const express = require("express");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

// GET /api/menu — public
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM menu_items ORDER BY id");
    res.json(result.rows.map(row => ({
      id: row.id,
      name: row.name,
      price: Number(row.price),
      category: row.category,
      description: row.description,
      available: row.available,
    })));
  } catch (err) {
    console.error("Get menu error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/menu — catering only
router.post("/", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "catering") {
      return res.status(403).json({ error: "Only catering admins can add menu items." });
    }
    const { name, price, category, description, available } = req.body;
    if (!name || !price || !category) {
      return res.status(400).json({ error: "Name, price, and category are required." });
    }
    const result = await pool.query(
      "INSERT INTO menu_items (name, price, category, description, available) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [name.trim(), price, category, description || "", available !== false]
    );
    const row = result.rows[0];
    res.status(201).json({
      id: row.id, name: row.name, price: Number(row.price),
      category: row.category, description: row.description, available: row.available,
    });
  } catch (err) {
    console.error("Add menu item error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// PUT /api/menu/:id — catering only
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "catering") {
      return res.status(403).json({ error: "Only catering admins can edit menu items." });
    }
    const { name, price, category, description, available } = req.body;
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid item ID." });

    const result = await pool.query(
      `UPDATE menu_items SET name=$1, price=$2, category=$3, description=$4, available=$5 WHERE id=$6 RETURNING *`,
      [name.trim(), price, category, description || "", available, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found." });
    }
    const row = result.rows[0];
    res.json({
      id: row.id, name: row.name, price: Number(row.price),
      category: row.category, description: row.description, available: row.available,
    });
  } catch (err) {
    console.error("Update menu item error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// DELETE /api/menu/:id — catering only
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "catering") {
      return res.status(403).json({ error: "Only catering admins can delete menu items." });
    }
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ error: "Invalid item ID." });

    const result = await pool.query("DELETE FROM menu_items WHERE id=$1 RETURNING id", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Menu item not found." });
    }
    res.json({ message: "Item deleted." });
  } catch (err) {
    console.error("Delete menu item error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
