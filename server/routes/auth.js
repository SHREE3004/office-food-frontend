const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const authMiddleware = require("../middleware/auth");

const router = express.Router();
const SALT_ROUNDS = 10;

// POST /api/auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { name, password, role } = req.body;

    if (!name || !password || !role) {
      return res.status(400).json({ error: "Name, password, and role are required." });
    }
    if (!["employee", "catering"].includes(role)) {
      return res.status(400).json({ error: "Role must be 'employee' or 'catering'." });
    }

    // Check if user already exists
    const existing = await pool.query(
      "SELECT id FROM users WHERE LOWER(name) = LOWER($1) AND role = $2",
      [name.trim(), role]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "User already exists with this name and role." });
    }

    const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
    await pool.query(
      "INSERT INTO users (name, password_hash, role) VALUES ($1, $2, $3)",
      [name.trim(), passwordHash, role]
    );

    res.status(201).json({ message: "Account created successfully." });
  } catch (err) {
    console.error("Signup error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { name, password, role } = req.body;

    if (!name || !password || !role) {
      return res.status(400).json({ error: "Name, password, and role are required." });
    }

    const result = await pool.query(
      "SELECT id, name, password_hash, role FROM users WHERE LOWER(name) = LOWER($1) AND role = $2",
      [name.trim(), role]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "No account found. Please sign up first." });
    }

    const user = result.rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: "Incorrect password." });
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    res.json({ token, name: user.name, role: user.role });
  } catch (err) {
    console.error("Login error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// GET /api/auth/users — list all users (catering only)
router.get("/users", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "catering") {
      return res.status(403).json({ error: "Only catering admins can view users." });
    }
    const result = await pool.query(
      "SELECT id, name, role, created_at FROM users ORDER BY id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error("List users error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

// DELETE /api/auth/users/:id — delete a user (catering only)
router.delete("/users/:id", authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== "catering") {
      return res.status(403).json({ error: "Only catering admins can delete users." });
    }
    const { id } = req.params;
    const result = await pool.query("DELETE FROM users WHERE id = $1 RETURNING id, name, role", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found." });
    }
    res.json({ message: `User '${result.rows[0].name}' deleted.`, user: result.rows[0] });
  } catch (err) {
    console.error("Delete user error:", err.message);
    res.status(500).json({ error: "Internal server error." });
  }
});

module.exports = router;
