import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { formatPrice, ORDER_STATUSES, getDateString } from "../helpers/storage";
import { apiGetMenu, apiAddMenuItem, apiUpdateMenuItem, apiDeleteMenuItem, apiGetOrders, apiUpdateOrderStatus, apiRejectOrder, apiGetStockLogs, apiAddStock } from "../helpers/api";

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
  const [stockLogs, setStockLogs] = useState([]);
  const [showStockForm, setShowStockForm] = useState(false);
  const [stockForm, setStockForm] = useState({ menuItemId: "", quantity: "" });
  const [quickStockItemId, setQuickStockItemId] = useState(null);
  const [quickStockQty, setQuickStockQty] = useState("");

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
    try {
      const stockData = await apiGetStockLogs();
      setStockLogs(stockData);
    } catch (err) {
      console.error("Failed to load stock logs:", err.message);
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

  const handleReject = async (orderId) => {
    const reason = window.prompt("Reason for rejecting this order:", "Insufficient quantity");
    if (reason === null) return; // cancelled
    try {
      await apiRejectOrder(orderId, reason);
      setOrders((prev) => prev.map((o) => o.orderId === orderId ? { ...o, status: "Rejected", rejectedReason: reason } : o));
    } catch (err) {
      alert("Failed to reject order: " + err.message);
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
  }).sort((a, b) => {
    // At-counter orders go to top
    if (a.onTheWay && !b.onTheWay) return -1;
    if (!a.onTheWay && b.onTheWay) return 1;
    return 0;
  }); 

  const orderCounts = {
    all: orders.filter((o) => o.scheduledDate === filterDate).length,
    placed: orders.filter((o) => o.scheduledDate === filterDate && o.status === "Placed").length,
    preparing: orders.filter((o) => o.scheduledDate === filterDate && o.status === "Preparing").length,
    ready: orders.filter((o) => o.scheduledDate === filterDate && o.status === "Ready").length,
    delivered: orders.filter((o) => o.scheduledDate === filterDate && o.status === "Delivered").length,
    rejected: orders.filter((o) => o.scheduledDate === filterDate && o.status === "Rejected").length,
  };

  const handleAddStock = async (e) => {
    e.preventDefault();
    const menuItemId = Number(stockForm.menuItemId);
    const quantity = Number(stockForm.quantity);
    if (!menuItemId || !quantity || quantity <= 0) return;
    try {
      const newLog = await apiAddStock(menuItemId, quantity);
      setStockLogs((prev) => [newLog, ...prev]);
      setMenu((prev) => prev.map((m) => m.id === menuItemId ? { ...m, stock: newLog.currentStock } : m));
      setStockForm({ menuItemId: "", quantity: "" });
      setShowStockForm(false);
    } catch (err) {
      alert("Failed to add stock: " + err.message);
    }
  };

  const handleQuickAddStock = async (e) => {
    e.preventDefault();
    const qty = Number(quickStockQty);
    if (!quickStockItemId || !qty || qty <= 0) return;
    try {
      const newLog = await apiAddStock(quickStockItemId, qty);
      setStockLogs((prev) => [newLog, ...prev]);
      setMenu((prev) => prev.map((m) => m.id === quickStockItemId ? { ...m, stock: newLog.currentStock } : m));
      setQuickStockItemId(null);
      setQuickStockQty("");
    } catch (err) {
      alert("Failed to add stock: " + err.message);
    }
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
            📦 Orders ({orderCounts.all})
          </button>
          <button className={`tab ${tab === "stock" ? "active" : ""}`} onClick={() => setTab("stock")}>
            📊 Stock Management
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

            {quickStockItemId && (
              <div className="modal-overlay" onClick={() => setQuickStockItemId(null)}>
                <div className="modal quick-stock-modal" onClick={(e) => e.stopPropagation()}>
                  <h3>Add Stock — {menu.find((m) => m.id === quickStockItemId)?.name}</h3>
                  <form onSubmit={handleQuickAddStock} className="item-form">
                    <div className="form-group">
                      <label>Quantity to Add</label>
                      <input
                        type="number"
                        min="1"
                        value={quickStockQty}
                        onChange={(e) => setQuickStockQty(e.target.value)}
                        placeholder="e.g. 25"
                        autoFocus
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setQuickStockItemId(null)}>Cancel</button>
                      <button type="submit" className="btn btn-primary">Add Stock</button>
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
                      <th>Stock</th>
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
                          <div className="stock-cell">
                            <span className={`stock-badge ${item.stock === 0 ? "stock-out" : item.stock <= 10 ? "stock-low" : "stock-ok"}`}>
                              {item.stock === 0 ? "Out of stock" : item.stock}
                            </span>
                            <button className="btn-quick-stock" title="Add stock" onClick={() => { setQuickStockItemId(item.id); setQuickStockQty(""); }}>+</button>
                          </div>
                        </td>
                        <td>
                          <button
                            className={`status-toggle-simple ${item.available ? "status-yes" : "status-no"}`}
                            onClick={() => toggleAvailability(item.id)}
                            title={item.available ? "Click to mark unavailable" : "Click to mark available"}
                          >
                            {item.available ? "✔" : "✘"}
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
                <button className={`pill ${orderStatusFilter === "Rejected" ? "active" : ""}`} onClick={() => setOrderStatusFilter("Rejected")}>
                  ❌ Rejected ({orderCounts.rejected})
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
                  const isAtCounter = order.onTheWay && order.status !== "Delivered" && order.status !== "Rejected";
                  return (
                    <div key={order.orderId} className={`order-card order-card-${order.status.toLowerCase()} ${isAtCounter ? "order-card-at-counter" : ""}`}>
                      {isAtCounter && (
                        <div className="at-counter-banner">
                          <span>🏢</span> <strong>{order.employee}</strong> is at the counter to collect {order.onTheWayAt && <small>— {order.onTheWayAt.replace(/:\d{2}\s/, " ")}</small>}
                        </div>
                      )}
                      <div className="order-card-top">
                        <div className="order-serial-circle">
                          #{order.orderId.split("-")[1]}
                        </div>
                        <div className="order-card-info">
                          <span className="order-employee-name">{order.employee}</span>
                        </div>
                        <div className="order-card-right">
                          <span className={`status-badge status-badge-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                          <span className={`payment-tag ${order.paymentMode === "COD" ? "payment-cod" : "payment-online"}`}>
                            {order.paymentMode === "COD" ? "💵 COD" : "💳 Paid"}
                          </span>
                        </div>
                      </div>
                      {order.isPreOrder && <div style={{padding: "0 16px"}}><span className="preorder-badge-sm">📅 Pre-order</span></div>}
                      {order.status === "Rejected" && (
                        <div style={{padding: "0 16px"}}>
                          <div className="rejected-alert">
                            <span>❌ Rejected{order.rejectedReason ? `: ${order.rejectedReason}` : ""}</span>
                          </div>
                        </div>
                      )}
                      <div className="order-items-section">
                        {order.items.map((item) => (
                          <div key={item.id} className="order-item-row">
                            <span className="order-item-name">{item.name}</span>
                            <span className="order-item-qty">×{item.qty}</span>
                          </div>
                        ))}
                      </div>
                      <div className="order-card-footer">
                        <strong className="order-total">₹{order.total}</strong>
                        {order.status === "Placed" && (
                          <div className="accept-reject-btns">
                            <button
                              className="btn btn-sm btn-success"
                              onClick={() => handleStatusChange(order.orderId, "Preparing")}
                            >
                              ✅ Accept
                            </button>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleReject(order.orderId)}
                            >
                              ❌ Reject
                            </button>
                          </div>
                        )}
                        {order.status !== "Placed" && order.status !== "Rejected" && order.status !== "Delivered" && nextStatus && (
                          <button
                            className="btn btn-primary btn-sm status-advance-btn"
                            onClick={() => handleStatusChange(order.orderId, nextStatus)}
                          >
                            {nextStatus === "Ready" && "✅ Mark Ready"}
                            {nextStatus === "Delivered" && "📦 Mark Delivered"}
                          </button>
                        )}
                        {order.status === "Delivered" && (
                          <span className="status-badge status-badge-delivered">📦 Delivered</span>
                        )}
                        {order.status === "Rejected" && (
                          <span className="status-badge status-badge-rejected">❌ Rejected</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ===================== STOCK TAB ===================== */}
        {tab === "stock" && (
          <div>
            <div className="section-header">
              <h2>Stock Management</h2>
              <button className="btn btn-primary" onClick={() => setShowStockForm(true)}>+ Add Stock</button>
            </div>

            {showStockForm && (
              <div className="modal-overlay" onClick={() => setShowStockForm(false)}>
                <div className="modal" onClick={(e) => e.stopPropagation()}>
                  <h3>Add Stock</h3>
                  <form onSubmit={handleAddStock} className="item-form">
                    <div className="form-group">
                      <label>Select Item</label>
                      <select
                        value={stockForm.menuItemId}
                        onChange={(e) => setStockForm((prev) => ({ ...prev, menuItemId: e.target.value }))}
                        required
                      >
                        <option value="">-- Select an item --</option>
                        {menu.map((item) => (
                          <option key={item.id} value={item.id}>
                            {item.name} (Current stock: {item.stock})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Quantity to Add</label>
                      <input
                        type="number"
                        min="1"
                        value={stockForm.quantity}
                        onChange={(e) => setStockForm((prev) => ({ ...prev, quantity: e.target.value }))}
                        placeholder="e.g. 25"
                        required
                      />
                    </div>
                    <div className="form-actions">
                      <button type="button" className="btn btn-outline" onClick={() => setShowStockForm(false)}>Cancel</button>
                      <button type="submit" className="btn btn-primary">Add Stock</button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Stock Addition History — primary view */}
            <div className="stock-log-section">
              <h3>📋 Stock Addition History</h3>
              {stockLogs.length === 0 ? (
                <div className="empty-state">
                  <p>No stock additions recorded yet. Click "+ Add Stock" to add stock for an item.</p>
                </div>
              ) : (
                <div className="catering-table-wrapper">
                  <table className="catering-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Item</th>
                        <th>Quantity Added</th>
                        <th>Added By</th>
                        <th>Date & Time</th>
                        <th>Current Stock</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockLogs.map((log, idx) => (
                        <tr key={log.id}>
                          <td>{idx + 1}</td>
                          <td><strong>{log.itemName}</strong></td>
                          <td><span className="stock-badge stock-ok">+{log.quantity}</span></td>
                          <td>👤 {log.addedBy}</td>
                          <td>🕐 {new Date(log.createdAt).toLocaleString("en-IN", { timeZone: "Asia/Kolkata", day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true })}</td>
                          <td>
                            <span className={`stock-badge ${log.currentStock === 0 ? "stock-out" : log.currentStock <= 10 ? "stock-low" : "stock-ok"}`}>
                              {log.currentStock != null ? log.currentStock : "—"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Current stock overview */}
            <div className="stock-overview" style={{ marginTop: 28 }}>
              <h3>📊 Current Stock Levels</h3>
              <div className="catering-table-wrapper">
                <table className="catering-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Item Name</th>
                      <th>Category</th>
                      <th>Current Stock</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {menu.map((item, idx) => (
                      <tr key={item.id}>
                        <td>{idx + 1}</td>
                        <td><strong>{item.name}</strong></td>
                        <td><span className="category-tag">{item.category}</span></td>
                        <td>
                          <span className={`stock-badge ${item.stock === 0 ? "stock-out" : item.stock <= 10 ? "stock-low" : "stock-ok"}`}>
                            {item.stock}
                          </span>
                        </td>
                        <td>
                          {item.stock === 0 ? "❌ Out of stock" : item.stock <= 10 ? "⚠️ Low stock" : "✅ In stock"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
