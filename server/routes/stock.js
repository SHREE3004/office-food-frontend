const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GET /api/stock — get stock logs (catering only)
router.get("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "catering") {
      return res.status(403).json({ error: "Only catering admins can view stock logs." });
    }

    const result = await pool.query(
      `SELECT sl.id, sl.menu_item_id, sl.item_name, sl.quantity, sl.added_by,
              sl.created_at, mi.stock AS current_stock
       FROM stock_logs sl
       LEFT JOIN menu_items mi ON mi.id = sl.menu_item_id
       ORDER BY sl.created_at DESC
       LIMIT 200`
    );

    res.json(result.rows.map(row => ({
      id: row.id,
      menuItemId: row.menu_item_id,
      itemName: row.item_name,
      quantity: row.quantity,
      addedBy: row.added_by,
      createdAt: row.created_at,
      currentStock: row.current_stock,
    })));
  } catch (err) {
    console.error("Get stock logs error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/stock — add stock to an item (catering only)
router.post("/", authMiddleware, async (req, res) => {
  const client = await pool.connect();
  try {
    if (req.user.role !== "catering") {
      return res.status(403).json({ error: "Only catering admins can add stock." });
    }

    const { menuItemId, quantity } = req.body;
    if (!menuItemId || !quantity || quantity <= 0) {
      return res.status(400).json({ error: "Valid menu item ID and quantity are required." });
    }

    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({ error: "Quantity must be a positive number." });
    }

    await client.query("BEGIN");

    // Get menu item name
    const itemResult = await client.query("SELECT id, name, stock FROM menu_items WHERE id = $1", [menuItemId]);
    if (itemResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ error: "Menu item not found." });
    }

    const item = itemResult.rows[0];

    // Update stock in menu_items
    await client.query("UPDATE menu_items SET stock = stock + $1 WHERE id = $2", [qty, menuItemId]);

    // Insert stock log
    const logResult = await client.query(
      `INSERT INTO stock_logs (menu_item_id, item_name, quantity, added_by)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [menuItemId, item.name, qty, req.user.name]
    );

    await client.query("COMMIT");

    const row = logResult.rows[0];
    res.status(201).json({
      id: row.id,
      menuItemId: row.menu_item_id,
      itemName: row.item_name,
      quantity: row.quantity,
      addedBy: row.added_by,
      createdAt: row.created_at,
      currentStock: item.stock + qty,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("Add stock error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  } finally {
    client.release();
  }
});

module.exports = router;
