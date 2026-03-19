import React, { useState, useEffect, useCallback } from "react";
import { getDateString, ORDER_STATUSES } from "../helpers/storage";
import { apiGetOrders } from "../helpers/api";

const STATUS_CONFIG = {
  Placed: { icon: "🕐", label: "Placed", color: "#f39c12" },
  Preparing: { icon: "👨‍🍳", label: "Preparing", color: "#3498db" },
  Ready: { icon: "✅", label: "Ready for Pickup", color: "#27ae60" },
  Delivered: { icon: "📦", label: "Delivered", color: "#95a5a6" },
};

export default function OrderDisplay() {
  const [orders, setOrders] = useState([]);
  const [dateFilter, setDateFilter] = useState(getDateString(0));
  const [now, setNow] = useState(new Date());

  const loadOrders = useCallback(async () => {
    try {
      const all = await apiGetOrders({ date: dateFilter });
      setOrders(all);
    } catch {
      // silently fail on display screen
    }
    setNow(new Date());
  }, [dateFilter]);

  useEffect(() => {
    loadOrders();
    const interval = setInterval(loadOrders, 3000);
    return () => clearInterval(interval);
  }, [loadOrders]);

  const today = getDateString(0);
  const tomorrow = getDateString(1);

  // Group orders by status
  const grouped = {};
  ORDER_STATUSES.forEach((s) => {
    grouped[s] = orders.filter((o) => o.status === s);
  });

  // Active statuses to show prominently
  const activeStatuses = ["Preparing", "Ready", "Placed"];
  const hasActiveOrders = activeStatuses.some((s) => grouped[s]?.length > 0);

  return (
    <div className="display-screen">
      <div className="display-header">
        <div className="display-header-left">
          <span className="display-logo">🍽️</span>
          <h1>Order Status Board</h1>
        </div>
        <div className="display-header-right">
          <div className="display-date-tabs">
            <button
              className={`display-date-tab ${dateFilter === today ? "active" : ""}`}
              onClick={() => setDateFilter(today)}
            >
              Today
            </button>
            <button
              className={`display-date-tab ${dateFilter === tomorrow ? "active" : ""}`}
              onClick={() => setDateFilter(tomorrow)}
            >
              Tomorrow
            </button>
          </div>
          <span className="display-time">
            {now.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {!hasActiveOrders && grouped["Delivered"]?.length === 0 ? (
        <div className="display-empty">
          <span className="display-empty-icon">📋</span>
          <h2>No orders yet</h2>
          <p>Orders will appear here as they are placed</p>
        </div>
      ) : (
        <div className="display-columns">
          {activeStatuses.map((status) => {
            const config = STATUS_CONFIG[status];
            const statusOrders = grouped[status] || [];
            return (
              <div key={status} className={`display-column column-${status.toLowerCase()}`}>
                <div className="display-column-header" style={{ borderBottomColor: config.color }}>
                  <span className="column-icon">{config.icon}</span>
                  <h2>{config.label}</h2>
                  <span className="column-count">{statusOrders.length}</span>
                </div>
                <div className="display-column-body">
                  {statusOrders.length === 0 ? (
                    <p className="column-empty">No orders</p>
                  ) : (
                    statusOrders.map((order) => (
                      <div key={order.orderId} className={`display-order-card card-${status.toLowerCase()}`}>
                        <div className="display-order-id">{order.orderId}</div>
                        <div className="display-order-name">{order.employee}</div>
                        <div className="display-order-items">
                          {order.items.map((item) => (
                            <span key={item.id}>{item.name} ×{item.qty}</span>
                          ))}
                        </div>
                        {order.isPreOrder && <span className="display-preorder-badge">📅 Pre-order</span>}
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delivered orders at the bottom */}
      {grouped["Delivered"]?.length > 0 && (
        <div className="display-delivered-section">
          <h3>📦 Recently Delivered ({grouped["Delivered"].length})</h3>
          <div className="delivered-ticker">
            {grouped["Delivered"].map((order) => (
              <span key={order.orderId} className="delivered-chip">
                {order.orderId} — {order.employee}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
