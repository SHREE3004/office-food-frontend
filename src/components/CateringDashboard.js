import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { formatPrice, ORDER_STATUSES, getDateString } from "../helpers/storage";
import { apiGetMenu, apiAddMenuItem, apiUpdateMenuItem, apiDeleteMenuItem, apiGetOrders, apiUpdateOrderStatus } from "../helpers/api";

const CATEGORIES = ["Breakfast", "Lunch", "Snacks", "Beverages"];

const emptyItem = { name: "", price: "", category: "Lunch", description: "", available: true };

export default function CateringDashboard() {
  const navigate = useNavigate();
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [tab, setTab] = useState("menu");
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState(emptyItem);
  const [showForm, setShowForm] = useState(false);
  const [orderDateFilter, setOrderDateFilter] = useState("today");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");

  const loadData = useCallback(async () => {
    const session = sessionStorage.getItem("office-food-session");
    if (!session) { navigate("/"); return; }
    try {
      const [menuData, ordersData] = await Promise.all([apiGetMenu(), apiGetOrders()]);
      setMenu(menuData);
      setOrders(ordersData);
    } catch (err) {
      console.error("Failed to load data:", err.message);
    }
  }, [navigate]);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, [loadData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const openAddForm = () => {
    setEditItem(null);
    setForm(emptyItem);
    setShowForm(true);
  };

  const openEditForm = (item) => {
    setEditItem(item);
    setForm({ name: item.name, price: String(item.price), category: item.category, description: item.description, available: item.available });
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditItem(null);
    setForm(emptyItem);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price) return;

    const price = Number(form.price);
    if (isNaN(price) || price <= 0) return;

    try {
      if (editItem) {
        const updated = await apiUpdateMenuItem(editItem.id, {
          name: form.name.trim(), price, category: form.category,
          description: form.description.trim(), available: form.available,
        });
        setMenu((prev) => prev.map((m) => m.id === editItem.id ? updated : m));
      } else {
        const newItem = await apiAddMenuItem({
          name: form.name.trim(), price, category: form.category,
          description: form.description.trim(), available: form.available,
        });
        setMenu((prev) => [...prev, newItem]);
      }
      closeForm();
    } catch (err) {
      alert("Failed to save: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await apiDeleteMenuItem(id);
      setMenu((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert("Failed to delete: " + err.message);
    }
  };

  const toggleAvailability = async (id) => {
    const item = menu.find((m) => m.id === id);
    if (!item) return;
    try {
      const updated = await apiUpdateMenuItem(id, { ...item, available: !item.available });
      setMenu((prev) => prev.map((m) => m.id === id ? updated : m));
    } catch (err) {
      alert("Failed to update: " + err.message);
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await apiUpdateOrderStatus(orderId, newStatus);
      setOrders((prev) => prev.map((o) => {
        if (o.orderId !== orderId) return o;
        const extra = {};
        if (newStatus === "Preparing") extra.preparingAt = new Date().toLocaleString();
        if (newStatus === "Ready") extra.readyAt = new Date().toLocaleString();
        if (newStatus === "Delivered") extra.deliveredAt = new Date().toLocaleString();
        return { ...o, status: newStatus, ...extra };
      }));
    } catch (err) {
      alert("Failed to update status: " + err.message);
    }
  };

  const getNextStatus = (currentStatus) => {
    const idx = ORDER_STATUSES.indexOf(currentStatus);
    return idx < ORDER_STATUSES.length - 1 ? ORDER_STATUSES[idx + 1] : null;
  };

  const today = getDateString(0);
  const tomorrow = getDateString(1);
  const filterDate = orderDateFilter === "today" ? today : tomorrow;

  const filteredOrders = orders.filter((o) => {
    const matchDate = o.scheduledDate === filterDate;
    const matchStatus = orderStatusFilter === "All" || o.status === orderStatusFilter;
    return matchDate && matchStatus;
  });

  const orderCounts = {
    all: orders.filter((o) => o.scheduledDate === filterDate).length,
    placed: orders.filter((o) => o.scheduledDate === filterDate && o.status === "Placed").length,
    preparing: orders.filter((o) => o.scheduledDate === filterDate && o.status === "Preparing").length,
    ready: orders.filter((o) => o.scheduledDate === filterDate && o.status === "Ready").length,
    delivered: orders.filter((o) => o.scheduledDate === filterDate && o.status === "Delivered").length,
  };

  return (
    <div className="dashboard">
      <Navbar title="Catering Dashboard" />

      <div className="container">
        <div className="tab-bar">
          <button className={`tab ${tab === "menu" ? "active" : ""}`} onClick={() => setTab("menu")}>
            📋 Manage Menu ({menu.length})
          </button>
          <button className={`tab ${tab === "orders" ? "active" : ""}`} onClick={() => setTab("orders")}>
            📦 Orders ({orders.length})
          </button>
        </div>

        {/* ===================== MENU TAB ===================== */}
        {tab === "menu" && (
          <div>
            <div className="section-header">
              <h2>Menu Items</h2>
              <button className="btn btn-primary" onClick={openAddForm}>+ Add New Item</button>
            </div>

            {showForm && (
              <div className="modal-overlay" onClick={closeForm}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <h3>{editItem ? "Edit Item" : "Add New Item"}</h3>
                  <form onSubmit={handleSave} className="item-form">
                    <div className="form-group">
                      <label>Item Name</label>
                      <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Chicken Biryani" required />
                    </div>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Price (₹)</label>
                        <input name="price" type="number" min="1" value={form.price} onChange={handleChange} placeholder="e.g. 150" required />
                      </div>
                      <div className="form-group">
                        <label>Category</label>
                        <select name="category" value={form.category} onChange={handleChange}>
                          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Description</label>
                      <input name="description" value={form.description} onChange={handleChange} placeholder="Short description" />
                    </div>
                    <div className="form-group checkbox-group">
                      <label>
                        <input type="checkbox" name="available" checked={form.available} onChange={handleChange} />
                        Available for ordering
                      </label>
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn btn-outline" onClick={closeForm}>Cancel</button>
                      <button type="submit" className="btn btn-primary">{editItem ? "Update Item" : "Add Item"}</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {menu.length === 0 ? (
              <div className="empty-state">
                <p>No menu items yet. Click "Add New Item" to get started.</p>
              </div>
            ) : (
              <div className="catering-table-wrapper">
                <table className="catering-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Category</th>
                      <th>Price</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menu.map((item, idx) => (
                      <tr key={item.id} className={!item.available ? "row-disabled" : ""}>
                        <td>{idx + 1}</td>
                        <td>
                          <strong>{item.name}</strong>
                          {item.description && <small className="table-desc">{item.description}</small>}
                        </td>
                        <td><span className="category-tag">{item.category}</span></td>
                        <td>{formatPrice(item.price)}</td>
                        <td>
                          <button
                            className={`status-toggle ${item.available ? "available" : "unavailable"}`}
                            onClick={() => toggleAvailability(item.id)}
                          >
                            {item.available ? "✅ Available" : "❌ Unavailable"}
                          </button>
                        </td>
                        <td>
                          <div className="action-btns">
                            <button className="btn btn-sm btn-outline" onClick={() => openEditForm(item)}>✏️ Edit</button>
                            <button className="btn btn-sm btn-danger" onClick={() => handleDelete(item.id)}>🗑️ Delete</button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ===================== ORDERS TAB ===================== */}
        {tab === "orders" && (
          <div>
            <div className="section-header">
              <h2>All Orders</h2>
              <div className="header-actions">
                <button className="btn btn-outline" onClick={() => navigate("/display")} title="Open KFC-style display">
                  📺 Order Display
                </button>
                <button className="btn btn-outline" onClick={loadData}>🔄 Refresh</button>
              </div>
            </div>

            {/* Date filter */}
            <div className="order-filters">
              <div className="date-filter-bar">
                <button
                  className={`date-filter-btn ${orderDateFilter === "today" ? "active" : ""}`}
                  onClick={() => setOrderDateFilter("today")}
                >
                  🍽️ Today's Orders
                </button>
                <button
                  className={`date-filter-btn ${orderDateFilter === "tomorrow" ? "active" : ""}`}
                  onClick={() => setOrderDateFilter("tomorrow")}
                >
                  📅 Tomorrow's Pre-orders
                </button>
              </div>

              {/* Status filter pills */}
              <div className="status-filter-pills">
                <button className={`pill ${orderStatusFilter === "All" ? "active" : ""}`} onClick={() => setOrderStatusFilter("All")}>
                  All ({orderCounts.all})
                </button>
                <button className={`pill ${orderStatusFilter === "Placed" ? "active" : ""}`} onClick={() => setOrderStatusFilter("Placed")}>
                  🕐 Placed ({orderCounts.placed})
                </button>
                <button className={`pill ${orderStatusFilter === "Preparing" ? "active" : ""}`} onClick={() => setOrderStatusFilter("Preparing")}>
                  👨‍🍳 Preparing ({orderCounts.preparing})
                </button>
                <button className={`pill ${orderStatusFilter === "Ready" ? "active" : ""}`} onClick={() => setOrderStatusFilter("Ready")}>
                  ✅ Ready ({orderCounts.ready})
                </button>
                <button className={`pill ${orderStatusFilter === "Delivered" ? "active" : ""}`} onClick={() => setOrderStatusFilter("Delivered")}>
                  📦 Delivered ({orderCounts.delivered})
                </button>
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="empty-state">
                <p>No orders for {orderDateFilter === "today" ? "today" : "tomorrow"}{orderStatusFilter !== "All" ? ` with status "${orderStatusFilter}"` : ""}.</p>
              </div>
            ) : (
              <div className="orders-list">
                {filteredOrders.map((order) => {
                  const nextStatus = getNextStatus(order.status);
                  return (
                    <div key={order.orderId} className={`order-card order-card-${order.status.toLowerCase()}`}>
                      <div className="order-card-header">
                        <div>
                          <h4>{order.orderId}</h4>
                          {order.isPreOrder && <span className="preorder-badge-sm">📅 Pre-order</span>}
                        </div>
                        <span className={`status-badge status-badge-${order.status.toLowerCase()}`}>
                          {order.status}
                        </span>
                      </div>
                      <div className="order-card-body">
                        <p><strong>Employee:</strong> {order.employee}</p>
                        <p><strong>Payment:</strong> {order.paymentMode === "COD" ? "💵 COD" : "💳 Razorpay"}</p>
                        <p><strong>Placed:</strong> {order.placedAt}</p>
                        {order.preparingAt && <p><strong>Preparing since:</strong> {order.preparingAt}</p>}
                        {order.readyAt && <p><strong>Ready at:</strong> {order.readyAt}</p>}
                        {order.deliveredAt && <p><strong>Delivered at:</strong> {order.deliveredAt}</p>}
                        {order.onTheWay && (
                          <div className="onmyway-alert">
                            <span className="onmyway-icon">🚶</span>
                            <span><strong>{order.employee}</strong> ({order.orderId}) is on the way to collect! {order.onTheWayAt && <small>({order.onTheWayAt})</small>}</span>
                          </div>
                        )}
                        <div className="order-items-list">
                          {order.items.map((item) => (
                            <span key={item.id} className="order-item-chip">
                              {item.name} × {item.qty}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="order-card-footer">
                        <strong>Total: {formatPrice(order.total)}</strong>
                        {nextStatus ? (
                          <button
                            className={`btn btn-primary btn-sm status-advance-btn`}
                            onClick={() => handleStatusChange(order.orderId, nextStatus)}
                          >
                            {nextStatus === "Preparing" && "👨‍🍳 Start Preparing"}
                            {nextStatus === "Ready" && "✅ Mark Ready"}
                            {nextStatus === "Delivered" && "📦 Mark Delivered"}
                          </button>
                        ) : (
                          <span className="status-badge status-badge-delivered">📦 Delivered</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
