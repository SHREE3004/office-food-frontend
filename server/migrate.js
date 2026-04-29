require("dotenv").config();
const pool = require("./db");

const SQL = `
-- Users table
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('employee', 'catering')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(name, role)
);

-- Menu items table
CREATE TABLE IF NOT EXISTS menu_items (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL CHECK (price > 0),
  category VARCHAR(100) NOT NULL,
  description TEXT DEFAULT '',
  available BOOLEAN DEFAULT TRUE
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) UNIQUE NOT NULL,
  employee VARCHAR(255) NOT NULL,
  total NUMERIC(10,2) NOT NULL,
  payment_mode VARCHAR(50) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'Placed',
  scheduled_date DATE NOT NULL,
  is_pre_order BOOLEAN DEFAULT FALSE,
  placed_at VARCHAR(100),
  preparing_at VARCHAR(100),
  ready_at VARCHAR(100),
  delivered_at VARCHAR(100),
  razorpay_payment_id VARCHAR(255),
  notified_preparing BOOLEAN DEFAULT FALSE,
  notified_ready BOOLEAN DEFAULT FALSE,
  on_the_way BOOLEAN DEFAULT FALSE,
  on_the_way_at VARCHAR(100),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id SERIAL PRIMARY KEY,
  order_id VARCHAR(50) NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
  item_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  price NUMERIC(10,2) NOT NULL,
  qty INTEGER NOT NULL CHECK (qty > 0)
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_orders_scheduled_date ON orders(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_orders_employee ON orders(employee);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);

-- Add on_the_way columns if missing (for existing databases)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='on_the_way') THEN
    ALTER TABLE orders ADD COLUMN on_the_way BOOLEAN DEFAULT FALSE;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='on_the_way_at') THEN
    ALTER TABLE orders ADD COLUMN on_the_way_at VARCHAR(100);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='orders' AND column_name='rejected_reason') THEN
    ALTER TABLE orders ADD COLUMN rejected_reason VARCHAR(255);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='stock') THEN
    ALTER TABLE menu_items ADD COLUMN stock INTEGER DEFAULT 50;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='menu_items' AND column_name='default_stock') THEN
    ALTER TABLE menu_items ADD COLUMN default_stock INTEGER DEFAULT 50;
  END IF;
END $$;

-- Stock logs table
CREATE TABLE IF NOT EXISTS stock_logs (
  id SERIAL PRIMARY KEY,
  menu_item_id INTEGER NOT NULL REFERENCES menu_items(id) ON DELETE CASCADE,
  item_name VARCHAR(255) NOT NULL,
  quantity INTEGER NOT NULL,
  added_by VARCHAR(255) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_stock_logs_menu_item ON stock_logs(menu_item_id);
CREATE INDEX IF NOT EXISTS idx_stock_logs_created ON stock_logs(created_at DESC);

-- Seed default menu items if table is empty
INSERT INTO menu_items (name, price, category, description, available)
SELECT * FROM (VALUES
  ('Veg Biryani Bowl', 140, 'Lunch', 'Fragrant basmati rice with mixed vegetables', TRUE),
  ('Paneer Butter Masala', 160, 'Lunch', 'Creamy paneer curry with butter naan', TRUE),
  ('Chicken Thali', 180, 'Lunch', 'Rice, dal, chicken curry, roti, salad', TRUE),
  ('Masala Dosa', 90, 'Breakfast', 'Crispy dosa with potato filling and chutney', TRUE),
  ('Idli Sambar', 70, 'Breakfast', 'Soft idlis with sambar and coconut chutney', TRUE),
  ('Paneer Wrap', 110, 'Snacks', 'Grilled paneer wrap with fresh veggies', TRUE),
  ('Samosa (2 pcs)', 40, 'Snacks', 'Crispy samosas with mint chutney', TRUE),
  ('Cold Coffee', 70, 'Beverages', 'Chilled coffee with ice cream', TRUE),
  ('Masala Chai', 30, 'Beverages', 'Hot spiced Indian tea', TRUE),
  ('Fresh Lime Soda', 50, 'Beverages', 'Sweet or salted fresh lime soda', TRUE)
) AS v(name, price, category, description, available)
WHERE NOT EXISTS (SELECT 1 FROM menu_items LIMIT 1);
`;

async function migrate() {
  try {
    await pool.query(SQL);
    console.log("Database migration completed successfully.");
  } catch (err) {
    console.error("Migration failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

migrate();
