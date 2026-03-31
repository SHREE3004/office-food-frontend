require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok" }));

// Debug: check DB columns (temporary)
const pool = require("./db");
app.get("/api/debug/columns", async (req, res) => {
  try {
    const r = await pool.query("SELECT column_name, data_type FROM information_schema.columns WHERE table_name='orders' ORDER BY ordinal_position");
    res.json(r.rows);
  } catch (e) { res.status(500).json({ error: e.message }); }
});

// Serve React production build
const buildPath = path.join(__dirname, "..", "build");
// Cache static assets (js/css have hash in filename so safe to cache)
app.use("/static", express.static(path.join(buildPath, "static"), { maxAge: "1y" }));
// Don't cache index.html so new builds are picked up immediately
app.use(express.static(buildPath, { etag: false, lastModified: false }));
app.get("*", (req, res) => {
  res.set("Cache-Control", "no-store");
  res.sendFile(path.join(buildPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
