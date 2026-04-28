require("dotenv").config({ path: require("path").join(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/auth");
const menuRoutes = require("./routes/menu");
const orderRoutes = require("./routes/orders");
const stockRoutes = require("./routes/stock");
const pool = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/stock", stockRoutes);

// Health check
app.get("/api/health", (req, res) => res.json({ status: "ok", node_env: process.env.NODE_ENV, has_db_url: !!process.env.DATABASE_URL }));

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

// Auto-run migration on startup
const migrationSQL = `
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='stock') THEN
    ALTER TABLE menu_items ADD COLUMN stock INTEGER DEFAULT 50;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='on_the_way') THEN
    ALTER TABLE orders ADD COLUMN on_the_way BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='on_the_way_at') THEN
    ALTER TABLE orders ADD COLUMN on_the_way_at VARCHAR(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='rejected_reason') THEN
    ALTER TABLE orders ADD COLUMN rejected_reason VARCHAR(255);
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS stock_logs (
  id SERIAL PRIMARY KEY,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  added_by VARCHAR(255) NOT NULL,
  comment TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='stock_logs' AND column_name='comment') THEN
    ALTER TABLE stock_logs ADD COLUMN comment TEXT DEFAULT '';
  END IF;
END $$;
CREATE INDEX IF NOT EXISTS idx_stock_logs_menu_item ON stock_logs(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_stock_logs_created ON stock_logs(created_at DESC);
`;
pool.query(migrationSQL)
  .then(() => console.log("Database migration ready."))
  .catch((err) => console.error("Migration warning:", err.message));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
