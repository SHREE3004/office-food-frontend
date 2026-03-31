import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { formatPrice, getQueuePosition, ORDER_STATUSES, getDateString } from "../helpers/storage";
import { apiGetMenu, apiGetOrders, apiMarkNotified, apiMarkOnMyWay } from "../helpers/api";

export default function EmployeeDashboard({ cart, setCart }) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [allOrders, setAllOrders] = useState([]);
  const [showMyOrders, setShowMyOrders] = useState(false);
  const [showLiveQueue, setShowLiveQueue] = useState(false);

  const session = JSON.parse(sessionStorage.getItem("office-food-session") || "{}");

  const loadAllOrders = useCallback(async () => {
    try {
      const today = getDateString(0);
      const orders = await apiGetOrders({ date: today });
      setAllOrders(orders);
      return orders;
    } catch {
      return [];
    }
  }, []);

  const loadMyOrders = useCallback(async () => {
    if (!session.name) return;
    try {
      const orders = await apiGetOrders({ employee: session.name });
      const todayAll = await loadAllOrders();
      const enriched = orders.map((o) => ({
        ...o,
        queuePosition: getQueuePosition(todayAll || orders, o.orderId),
      }));
      setMyOrders(enriched);
      return orders;
    } catch {
      return [];
    }
  }, [session.name, loadAllOrders]);

  const checkReadyOrders = useCallback(async () => {
    if (!session.name) return;

    const orders = await loadMyOrders();
    if (!orders) return;

    // Check for orders that moved to "Preparing"
    const preparingOrders = orders.filter(
      (o) => o.status === "Preparing" && !o.notifiedPreparing
    );
    preparingOrders.forEach((o) => {
      const pos = getQueuePosition(orders, o.orderId);
      const posMsg = pos ? ` (Queue position: #${pos})` : "";
      setNotifications((prev) => {
        if (prev.some((p) => p.orderId === o.orderId && p.type === "preparing")) return prev;
        return [...prev, {
          orderId: o.orderId,
          type: "preparing",
          message: `Your order ${o.orderId} is being prepared!${posMsg}`,
        }];
      });
      if ("Notification" in window && Notification.permission === "granted") {
        new Notification("👨‍🍳 Order Preparing!", {
          body: `Your order ${o.orderId} is being prepared!${posMsg}`,
          icon: "/favicon.ico",
          tag: o.orderId + "-preparing",
        });
      }
      apiMarkNotified(o.orderId, "notifiedPreparing").catch(() => {});
    });

    // Check for orders that are "Ready"
    const readyOrders = orders.filter(
      (o) => o.status === "Ready" && !o.notifiedReady
    );
    if (readyOrders.length > 0) {
      const newNotifs = readyOrders.map((o) => ({
        orderId: o.orderId,
        type: "ready",
        message: `Your order ${o.orderId} is ready! Please collect it.`,
      }));
      setNotifications((prev) => [
        ...prev,
        ...newNotifs.filter((n) => !prev.some((p) => p.orderId === n.orderId && p.type === "ready")),
      ]);

      readyOrders.forEach((o) => {
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("🍽️ Order Ready!", {
            body: `Your order ${o.orderId} is ready! Please collect it.`,
            icon: "/favicon.ico",
            tag: o.orderId,
          });
        }
        apiMarkNotified(o.orderId, "notifiedReady").catch(() => {});
      });
    }
  }, [session.name, loadMyOrders]);

  useEffect(() => {
    const s = sessionStorage.getItem("office-food-session");
    if (!s) { navigate("/"); return; }

    apiGetMenu().then((items) => setMenu(items.filter((item) => item.available))).catch(() => {});

    // Request browser notification permission on load
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }

    checkReadyOrders();
    const interval = setInterval(checkReadyOrders, 5000);
    return () => clearInterval(interval);
  }, [navigate, checkReadyOrders]);

  const dismissNotification = (orderId) => {
    setNotifications((prev) => prev.filter((n) => n.orderId !== orderId));
  };

  const categories = ["All", ...new Set(menu.map((item) => item.category))];

  const filtered = menu.filter((item) => {
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = filterCategory === "All" || item.category === filterCategory;
    return matchSearch && matchCat;
  });

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  const addToCart = (menuItem) => {
    setCart((prev) => {
      const existing = prev.find((c) => c.id === menuItem.id);
      if (existing) {
        return prev.map((c) => c.id === menuItem.id ? { ...c, qty: c.qty + 1 } : c);
      }
      return [...prev, { ...menuItem, qty: 1 }];
    });
  };

  const getCartQty = (id) => {
    const item = cart.find((c) => c.id === id);
    return item ? item.qty : 0;
  };

  return (
    <div className="dashboard">
      <Navbar title="Employee Dashboard" cartCount={cartCount} />

      {/* Notification toasts */}
      {notifications.length > 0 && (
        <div className="notification-container">
          {notifications.map((notif) => (
            <div key={notif.orderId + notif.type} className={`notification-toast ${notif.type === "ready" ? "toast-ready" : "toast-preparing"}`}>
              <div className="notification-content">
                <span className="notification-icon">{notif.type === "ready" ? "🍽️" : "👨‍🍳"}</span>
                <span>{notif.message}</span>
              </div>
              <button className="notification-close" onClick={() => dismissNotification(notif.orderId)}>✕</button>
            </div>
          ))}
        </div>
      )}

      <div className="container">
        <div className="page-header">
          <div className="page-header-row">
            <div>
              <h1>🍽️ Today's Menu</h1>
              <p>Browse and add items to your cart</p>
            </div>
            <div className="header-btn-group">
              <button className="btn btn-outline my-orders-btn" onClick={() => { setShowLiveQueue(!showLiveQueue); if (showMyOrders) setShowMyOrders(false); }}>
                📊 Live Queue ({allOrders.filter((o) => o.status !== "Delivered").length})
              </button>
              <button className="btn btn-outline my-orders-btn" onClick={() => { setShowMyOrders(!showMyOrders); if (showLiveQueue) setShowLiveQueue(false); }}>
                📋 My Orders ({myOrders.filter((o) => o.status !== "Delivered").length})
              </button>
            </div>
          </div>
        </div>

        {/* Live Queue Panel */}
        {showLiveQueue && (
          <LiveQueuePanel allOrders={allOrders} myName={session.name} />
        )}

        {/* My Orders Panel */}
        {showMyOrders && (
          <div className="my-orders-panel">
            <h2>📋 My Orders</h2>
            {myOrders.length === 0 ? (
              <p className="empty-state-text">No orders yet. Place your first order!</p>
            ) : (
              <div className="my-orders-list">
                {myOrders.map((order) => (
                  <div key={order.orderId} className={`my-order-card status-${order.status.toLowerCase()}`}>
                    <div className="my-order-header">
                      <span className="my-order-id">{order.orderId}</span>
                      <span className={`my-order-status status-pill-${order.status.toLowerCase()}`}>{order.status}</span>
                    </div>
                    <div className="my-order-body">
                      <div className="my-order-items">
                        {order.items.map((item) => (
                          <span key={item.id} className="order-item-chip">{item.name} × {item.qty}</span>
                        ))}
                      </div>
                      <div className="my-order-meta">
                        <span>{formatPrice(order.total)}</span>
                        {order.isPreOrder && <span className="preorder-badge">📅 Pre-order</span>}
                        <span className="order-date">{order.scheduledDate}</span>
                      </div>
                    </div>
                    {/* On my way button */}
                    {(order.status === "Preparing" || order.status === "Ready") && !order.onTheWay && (
                      <button
                        className="btn btn-onmyway"
                        onClick={async () => {
                          try {
                            await apiMarkOnMyWay(order.orderId);
                            setMyOrders((prev) => prev.map((o) => o.orderId === order.orderId ? { ...o, onTheWay: true } : o));
                          } catch { }
                        }}
                      >
                        🚶 I'm on my way to collect!
                      </button>
                    )}
                    {order.onTheWay && (order.status === "Preparing" || order.status === "Ready") && (
                      <div className="onmyway-badge-bar">
                        <span>🚶 On the way — Catering team has been notified!</span>
                      </div>
                    )}
                    {/* Queue position */}
                    {(order.status === "Placed" || order.status === "Preparing") && order.queuePosition && (
                      <div className="queue-position-bar">
                        <span className="queue-icon">🔢</span>
                        <span>Queue position: <strong>#{order.queuePosition}</strong></span>
                        {order.queuePosition === 1 && <span className="queue-next">🔥 You're next!</span>}
                      </div>
                    )}
                    {/* Status progress */}
                    <div className="status-progress">
                      {ORDER_STATUSES.map((s, i) => {
                        const currentIdx = ORDER_STATUSES.indexOf(order.status);
                        return (
                          <div key={s} className={`progress-step ${i <= currentIdx ? "done" : ""} ${i === currentIdx ? "current" : ""}`}>
                            <div className="progress-dot" />
                            <span>{s}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="filters">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Search dishes..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`pill ${filterCategory === cat ? "active" : ""}`}
                onClick={() => setFilterCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="empty-state">
            <p>No items found. Try a different search or category.</p>
          </div>
        )}

        <div className="menu-grid">
          {filtered.map((item) => (
            <div key={item.id} className="menu-card">
              <div className="menu-card-body">
                <span className="menu-category">{item.category}</span>
                <h3>{item.name}</h3>
                <p className="menu-desc">{item.description}</p>
                <div className="menu-card-footer">
                  <span className="menu-price">{formatPrice(item.price)}</span>
                  {getCartQty(item.id) > 0 ? (
                    <span className="in-cart-badge">✓ {getCartQty(item.id)} in cart</span>
                  ) : null}
                  <button className="btn btn-primary" onClick={() => addToCart(item)}>
                    + Add
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {cartCount > 0 && (
          <div className="floating-cart" onClick={() => navigate("/employee/cart")}>
            🛒 View Cart ({cartCount} items) →
          </div>
        )}
      </div>
    </div>
  );
}

/* ============ LIVE QUEUE PANEL ============ */
function LiveQueuePanel({ allOrders, myName }) {
  const activeOrders = allOrders
    .filter((o) => o.status !== "Delivered")
    .sort((a, b) => (a.orderId > b.orderId ? 1 : -1));

  const myActiveOrders = activeOrders.filter((o) => o.employee === myName);

  // Group by status for summary
  const statusCounts = {};
  activeOrders.forEach((o) => {
    statusCounts[o.status] = (statusCounts[o.status] || 0) + 1;
  });

  const STATUS_ICONS = {
    Placed: "🕐",
    Preparing: "👨‍🍳",
    Ready: "✅",
    Delivered: "📦",
  };

  return (
    <div className="live-queue-panel">
      <div className="queue-header">
        <h2>📊 Live Order Queue</h2>
        <div className="queue-summary-chips">
          {ORDER_STATUSES.filter((s) => s !== "Delivered").map((s) => (
            <span key={s} className={`queue-summary-chip chip-${s.toLowerCase()}`}>
              {STATUS_ICONS[s]} {s}: {statusCounts[s] || 0}
            </span>
          ))}
          <span className="queue-summary-chip chip-total">Total Active: {activeOrders.length}</span>
        </div>
      </div>

      {/* My position highlight */}
      {myActiveOrders.length > 0 && (
        <div className="my-queue-highlight">
          <h3>🎯 Your Order{myActiveOrders.length > 1 ? "s" : ""} in Queue</h3>
          {myActiveOrders.map((order) => {
            const pos = activeOrders.findIndex((o) => o.orderId === order.orderId) + 1;
            return (
              <div key={order.orderId} className="my-queue-card">
                <div className="my-queue-position">#{pos}</div>
                <div className="my-queue-info">
                  <span className="my-queue-order-id">{order.orderId}</span>
                  <span className={`queue-status-pill pill-${order.status.toLowerCase()}`}>{STATUS_ICONS[order.status]} {order.status}</span>
                </div>
                <div className="my-queue-items">
                  {order.items.map((item) => (
                    <span key={item.id} className="order-item-chip">{item.name} × {item.qty}</span>
                  ))}
                </div>
                {pos === 1 && <span className="queue-up-next">🔥 You're next!</span>}
                {pos > 1 && <span className="queue-ahead">{pos - 1} order{pos - 1 > 1 ? "s" : ""} ahead of you</span>}
              </div>
            );
          })}
        </div>
      )}

      {/* Full queue list */}
      <div className="queue-list">
        <h3>📋 All Active Orders ({activeOrders.length})</h3>
        {activeOrders.length === 0 ? (
          <p className="empty-state-text">No active orders right now</p>
        ) : (
          <div className="queue-table">
            <div className="queue-table-header">
              <span>#</span>
              <span>Order ID</span>
              <span>Employee</span>
              <span>Items</span>
              <span>Status</span>
            </div>
            {activeOrders.map((order, idx) => {
              const isMe = order.employee === myName;
              return (
                <div key={order.orderId} className={`queue-table-row ${isMe ? "queue-row-mine" : ""}`}>
                  <span className="queue-pos">{idx + 1}</span>
                  <span className="queue-oid">{order.orderId}</span>
                  <span className="queue-emp">{order.employee} {isMe && <em>(You)</em>}</span>
                  <span className="queue-items-cell">
                    {order.items.map((it) => `${it.name}×${it.qty}`).join(", ")}
                  </span>
                  <span className={`queue-status-pill pill-${order.status.toLowerCase()}`}>
                    {STATUS_ICONS[order.status]} {order.status}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
