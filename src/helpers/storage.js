// Valid status flow: Placed → Preparing → Ready → Delivered
export const ORDER_STATUSES = ["Placed", "Preparing", "Ready", "Delivered"];

export function getDateString(daysFromNow = 0) {
  const d = new Date();
  d.setDate(d.getDate() + daysFromNow);
  return d.toISOString().split("T")[0];
}

// Compute queue position from an orders array (client-side helper)
export function getQueuePosition(orders, orderId) {
  const target = orders.find((o) => o.orderId === orderId);
  if (!target) return null;
  const activeOrders = orders
    .filter((o) => o.scheduledDate === target.scheduledDate && (o.status === "Placed" || o.status === "Preparing"))
    .sort((a, b) => (a.orderId > b.orderId ? 1 : -1));
  const idx = activeOrders.findIndex((o) => o.orderId === orderId);
  return idx === -1 ? null : idx + 1;
}

// ---------- Currency ----------
export const formatPrice = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
