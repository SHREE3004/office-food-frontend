import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { formatPrice, getQueuePosition, ORDER_STATUSES } from "../helpers/storage";
import { apiGetMenu, apiGetOrders, apiMarkNotified } from "../helpers/api";

export default function EmployeeDashboard({ cart, setCart }) {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [myOrders, setMyOrders] = useState([]);
  const [showMyOrders, setShowMyOrders] = useState(false);

  const session = JSON.parse(sessionStorage.getItem("office-food-session") || "{}");

  const loadMyOrders = useCallback(async () => {
    if (!session.name) return;
    try {
      const orders = await apiGetOrders({ employee: session.name });
      const enriched = orders.map((o) => ({
        ...o,
        queuePosition: getQueuePosition(orders, o.orderId),
      }));
      setMyOrders(enriched);
      return orders;
    } catch {
      return [];
    }
  }, [session.name]);

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
            <button className="btn btn-outline my-orders-btn" onClick={() => setShowMyOrders(!showMyOrders)}>
              📋 My Orders ({myOrders.filter((o) => o.status !== "Delivered").length})
            </button>
          </div>
        </div>

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
