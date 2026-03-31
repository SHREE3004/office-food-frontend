const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

const ORDER_STATUSES = ["Placed", "Preparing", "Ready", "Delivered"];

// Helper: format a DATE column without timezone shift
function formatDate(d) {
  if (!d) return null;
  if (typeof d === "string") return d.split("T")[0];
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// Helper: get current time in IST
function nowIST() {
  return new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });
}

// Helper: generate order ID like 20260319-01
async function generateOrderId(scheduledDate) {
  const prefix = scheduledDate.replace(/-/g, "");
  const result = await pool.query(
    "SELECT COUNT(*) AS cnt FROM orders WHERE order_id LIKE $1",
    [prefix + "-%"]
  );
  const nextNum = String(Number(result.rows[0].cnt) + 1).padStart(2, "0");
  return `${prefix}-${nextNum}`;
}

// GET /api/orders — all orders (with optional filters)
router.get("/", async (req, res) => {
  try {
    const { date, employee, status } = req.query;
    let sql = "SELECT * FROM orders";
    const conditions = [];
    const params = [];

    if (date) {
      params.push(date);
      conditions.push(`scheduled_date = $${params.length}`);
    }
    if (employee) {
      params.push(employee);
      conditions.push(`employee = $${params.length}`);
    }
    if (status) {
      params.push(status);
      conditions.push(`status = $${params.length}`);
    }

    if (conditions.length > 0) {
      sql += " WHERE " + conditions.join(" AND ");
    }
    sql += " ORDER BY created_at DESC";

    const ordersResult = await pool.query(sql, params);
    const orders = ordersResult.rows;

    // Fetch items for all orders
    if (orders.length > 0) {
      const orderIds = orders.map(o => o.order_id);
      const itemsResult = await pool.query(
        "SELECT * FROM order_items WHERE order_id = ANY($1)",
        [orderIds]
      );
      const itemsByOrderId = {};
      itemsResult.rows.forEach(item => {
        if (!itemsByOrderId[item.order_id]) itemsByOrderId[item.order_id] = [];
        itemsByOrderId[item.order_id].push({
          id: item.item_id,
          name: item.name,
          price: Number(item.price),
          qty: item.qty,
        });
      });

      const enriched = orders.map(o => ({
        orderId: o.order_id,
        employee: o.employee,
        items: itemsByOrderId[o.order_id] || [],
        total: Number(o.total),
        paymentMode: o.payment_mode,
        status: o.status,
        scheduledDate: formatDate(o.scheduled_date),
        isPreOrder: o.is_pre_order,
        placedAt: o.placed_at,
        preparingAt: o.preparing_at,
        readyAt: o.ready_at,
        deliveredAt: o.delivered_at,
        razorpayPaymentId: o.razorpay_payment_id,
        notifiedPreparing: o.notified_preparing,
        notifiedReady: o.notified_ready,
        onTheWay: o.on_the_way || false,
        onTheWayAt: o.on_the_way_at,
      }));
      return res.json(enriched);
    }

    res.json([]);
  } catch (err) {
    console.error("Get orders error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/orders — place a new order
router.post("/", authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    const { items, total, paymentMode, scheduledDate, isPreOrder, razorpayPaymentId } = req.body;
    const employee = req.user.name;

    if (!items || items.length === 0 || !scheduledDate) {
      return res.status(400).json({ error: "Items and scheduled date are required." });
    }

    await client.query("BEGIN");

    const orderId = await generateOrderId(scheduledDate);
    const status = razorpayPaymentId ? "Paid" : "Placed";

    await client.query(
      `INSERT INTO orders (order_id, employee, total, payment_mode, status, scheduled_date, is_pre_order, placed_at, razorpay_payment_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [orderId, employee, total, paymentMode, status, scheduledDate, isPreOrder || false, nowIST(), razorpayPaymentId || null]
    );

    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, item_id, name, price, qty) VALUES ($1, $2, $3, $4, $5)",
        [orderId, item.id, item.name, item.price, item.qty]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      orderId,
      employee,
      items,
      total,
      paymentMode,
      status,
      scheduledDate,
      isPreOrder: isPreOrder || false,
      placedAt: nowIST(),
      razorpayPaymentId: razorpayPaymentId || null,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Place order error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    client.release();
  }
});

// PATCH /api/orders/:orderId/status — update order status
router.patch("/:orderId/status", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (!ORDER_STATUSES.includes(status)) {
      return res.status(400).json({ error: "Invalid status." });
    }

    const extras = {};
    if (status === "Preparing") extras.preparing_at = nowIST();
    if (status === "Ready") extras.ready_at = nowIST();
    if (status === "Delivered") extras.delivered_at = nowIST();

    const setClauses = ["status = $1"];
    const params = [status];
    let idx = 2;

    for (const [col, val] of Object.entries(extras)) {
      setClauses.push(`${col} = $${idx}`);
      params.push(val);
      idx++;
    }
    params.push(orderId);

    const result = await pool.query(
      `UPDATE orders SET ${setClauses.join(", ")} WHERE order_id = $${idx} RETURNING *`,
      params
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json({ message: "Status updated.", orderId, status });
  } catch (err) {
    console.error("Update order status error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// PATCH /api/orders/:orderId/notify — mark order as notified
router.patch("/:orderId/notify", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;
    const { field } = req.body; // "notifiedPreparing" or "notifiedReady"

    const colMap = {
      notifiedPreparing: "notified_preparing",
      notifiedReady: "notified_ready",
    };
    const col = colMap[field];
    if (!col) return res.status(400).json({ error: "Invalid notification field." });

    await pool.query(
      `UPDATE orders SET ${col} = TRUE WHERE order_id = $1`,
      [orderId]
    );

    res.json({ message: "Notification marked." });
  } catch (err) {
    console.error("Mark notify error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// PATCH /api/orders/:orderId/onmyway — employee marks they are on the way
router.patch("/:orderId/onmyway", authMiddleware, async (req, res) => {
  try {
    const { orderId } = req.params;

    const result = await pool.query(
      `UPDATE orders SET on_the_way = TRUE, on_the_way_at = $1 WHERE order_id = $2 RETURNING *`,
      [nowIST(), orderId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Order not found." });
    }

    res.json({ message: "Marked on the way.", orderId });
  } catch (err) {
    console.error("On my way error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
