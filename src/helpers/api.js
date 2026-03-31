const API_BASE = process.env.REACT_APP_API_URL || "/api";

function getToken() {
  const session = sessionStorage.getItem("office-food-session");
  if (!session) return null;
  try {
    return JSON.parse(session).token;
  } catch {
    return null;
  }
}

async function request(path, options = {}) {
  const token = getToken();
  const headers = { "Content-Type": "application/json", ...options.headers };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });
  const data = await res.json();

  if (!res.ok) {
    const err = new Error(data.error || "Request failed");
    err.status = res.status;
    throw err;
  }
  return data;
}

// ---------- Auth ----------
export async function apiSignup(name, password, role) {
  return request("/auth/signup", {
    method: "POST",
    body: JSON.stringify({ name, password, role }),
  });
}

export async function apiLogin(name, password, role) {
  return request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ name, password, role }),
  });
}

// ---------- Menu ----------
export async function apiGetMenu() {
  return request("/menu");
}

export async function apiAddMenuItem(item) {
  return request("/menu", {
    method: "POST",
    body: JSON.stringify(item),
  });
}

export async function apiUpdateMenuItem(id, item) {
  return request(`/menu/${id}`, {
    method: "PUT",
    body: JSON.stringify(item),
  });
}

export async function apiDeleteMenuItem(id) {
  return request(`/menu/${id}`, { method: "DELETE" });
}

// ---------- Orders ----------
export async function apiGetOrders(filters = {}) {
  const params = new URLSearchParams();
  if (filters.date) params.set("date", filters.date);
  if (filters.employee) params.set("employee", filters.employee);
  if (filters.status) params.set("status", filters.status);
  const qs = params.toString();
  return request(`/orders${qs ? `?${qs}` : ""}`);
}

export async function apiPlaceOrder(orderData) {
  return request("/orders", {
    method: "POST",
    body: JSON.stringify(orderData),
  });
}

export async function apiUpdateOrderStatus(orderId, status) {
  return request(`/orders/${encodeURIComponent(orderId)}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });
}

export async function apiMarkNotified(orderId, field) {
  return request(`/orders/${encodeURIComponent(orderId)}/notify`, {
    method: "PATCH",
    body: JSON.stringify({ field }),
  });
}

export async function apiMarkOnMyWay(orderId) {
  return request(`/orders/${encodeURIComponent(orderId)}/onmyway`, {
    method: "PATCH",
  });
}
