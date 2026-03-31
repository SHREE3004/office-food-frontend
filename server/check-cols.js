require("dotenv").config();
const pool = require("./db");
async function check() {
  const r = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name='orders' AND column_name LIKE 'on%'");
  console.log("Columns:", r.rows);
  const r2 = await pool.query("SELECT order_id, on_the_way, on_the_way_at FROM orders LIMIT 5");
  console.log("Orders:", r2.rows);
  pool.end();
}
check().catch(e => { console.error(e.message); pool.end(); });
