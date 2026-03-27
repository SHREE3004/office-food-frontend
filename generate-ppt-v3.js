const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();
pptx.layout = "LAYOUT_WIDE";
pptx.author = "ServeBox Team";
pptx.company = "ServeBox";
pptx.title = "ServeBox Internal Presentation";

// Professional Light Theme
const C = {
  primary: "E23744",
  dark: "2D3436",
  text: "2D3436",
  sub: "636E72",
  accent: "0984E3",
  green: "00B894",
  purple: "6C5CE7",
  gold: "E17055",
  white: "FFFFFF",
  bg: "FFFFFF",
  light: "F8F9FA",
  card: "F8F9FA",
  border: "DEE2E6",
  codeBg: "F1F3F5",
};

const TOTAL = 12;

function sNum(slide, n) {
  slide.addText(`${n} / ${TOTAL}`, { x: 11.5, y: 7, w: 1.5, h: 0.3, fontSize: 9, color: C.sub, fontFace: "Arial", align: "right" });
}
function topBar(slide) {
  slide.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.06, fill: { color: C.primary } });
}

// ==================== SLIDE 1: TITLE ====================
let s = pptx.addSlide();
s.background = { fill: C.white };
s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.1, fill: { color: C.primary } });
sNum(s, 1);

s.addText("ServeBox", {
  x: 0.8, y: 2, w: 11, h: 1.2, fontSize: 56, bold: true, color: C.primary, fontFace: "Arial",
});
s.addText("Office Food Ordering Platform", {
  x: 0.8, y: 3.1, w: 11, h: 0.7, fontSize: 26, color: C.dark, fontFace: "Arial",
});
s.addText("Full-Stack Production Application  |  Internal Presentation", {
  x: 0.8, y: 3.8, w: 11, h: 0.5, fontSize: 15, color: C.sub, fontFace: "Arial",
});

// Tech tags
const tags = ["React 19", "Java Spring Boot", "PostgreSQL", "JWT Auth", "Razorpay"];
const tagColors = [C.accent, C.green, C.purple, C.gold, C.primary];
tags.forEach((t, i) => {
  const tx = 0.8 + i * 2.15;
  s.addShape(pptx.ShapeType.roundRect, {
    x: tx, y: 4.8, w: 2, h: 0.38, fill: { color: C.light },
    line: { color: tagColors[i], width: 1.2 }, rectRadius: 0.19,
  });
  s.addText(t, {
    x: tx, y: 4.8, w: 2, h: 0.38, align: "center",
    fontSize: 11, bold: true, color: tagColors[i], fontFace: "Arial",
  });
});

s.addText("Presented by: Shree Harini", {
  x: 0.8, y: 5.8, w: 5, h: 0.4, fontSize: 14, color: C.sub, fontFace: "Arial",
});

// ==================== SLIDE 2: PROBLEM & SOLUTION ====================
s = pptx.addSlide();
s.background = { fill: C.white };
topBar(s); sNum(s, 2);

s.addText("Problem & Solution", {
  x: 0.8, y: 0.5, w: 10, h: 0.7, fontSize: 32, bold: true, color: C.dark, fontFace: "Arial",
});
s.addText("Why we built ServeBox", {
  x: 0.8, y: 1.1, w: 10, h: 0.4, fontSize: 15, color: C.sub, fontFace: "Arial",
});

// Problem card
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.6, y: 1.8, w: 5.6, h: 4.8, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.12,
});
s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.8, w: 5.6, h: 0.06, fill: { color: "D63031" } });
s.addText("Current Pain Points", {
  x: 0.9, y: 2.0, w: 5, h: 0.5, fontSize: 18, bold: true, color: "D63031", fontFace: "Arial",
});
const pains = [
  "Manual order collection via WhatsApp / paper",
  "No centralized menu management",
  "Cash handling & payment tracking issues",
  "No order history or audit trail",
  "Catering team has no dashboard",
  "Data lost when browser cache clears",
];
pains.forEach((p, i) => {
  s.addText(`✗   ${p}`, { x: 0.9, y: 2.7 + i * 0.52, w: 5, h: 0.5, fontSize: 13, color: C.text, fontFace: "Arial" });
});

// Solution card
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.8, w: 5.6, h: 4.8, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.12,
});
s.addShape(pptx.ShapeType.rect, { x: 6.6, y: 1.8, w: 5.6, h: 0.06, fill: { color: C.green } });
s.addText("ServeBox Solution", {
  x: 6.9, y: 2.0, w: 5, h: 0.5, fontSize: 18, bold: true, color: C.green, fontFace: "Arial",
});
const sols = [
  "Digital ordering with live menu",
  "Role-based access (Employee + Catering)",
  "Integrated Razorpay online payments",
  "Complete order history & tracking",
  "Real-time order management dashboard",
  "Persistent PostgreSQL cloud database",
];
sols.forEach((p, i) => {
  s.addText(`✓   ${p}`, { x: 6.9, y: 2.7 + i * 0.52, w: 5, h: 0.5, fontSize: 13, color: C.text, fontFace: "Arial" });
});

// ==================== SLIDE 3: TECH STACK ====================
s = pptx.addSlide();
s.background = { fill: C.white };
topBar(s); sNum(s, 3);

s.addText("Technology Stack", {
  x: 0.8, y: 0.5, w: 10, h: 0.7, fontSize: 32, bold: true, color: C.dark, fontFace: "Arial",
});

const techRows = [
  ["Layer", "Technology", "Purpose"],
  ["Frontend", "React 19", "Component-based SPA with hooks"],
  ["Routing", "React Router v7", "Client-side navigation"],
  ["Backend", "Java (Spring Boot 3)", "REST API with Spring MVC"],
  ["Database", "PostgreSQL 18", "Relational DB with Spring Data JPA"],
  ["Auth", "Spring Security + JWT", "Token-based auth with BCrypt"],
  ["Payments", "Razorpay Checkout.js", "PCI-DSS compliant payment gateway"],
  ["Build Tool", "Maven", "Dependency management & JAR packaging"],
  ["Deployment", "Render", "Cloud hosting with managed PostgreSQL"],
];
const tRows = techRows.map((row, rIdx) =>
  row.map((cell, cIdx) => ({
    text: cell,
    options: {
      bold: rIdx === 0 || cIdx === 1,
      color: rIdx === 0 ? C.white : C.text,
      fill: { color: rIdx === 0 ? C.primary : (rIdx % 2 === 0 ? C.light : C.white) },
      fontSize: 13, fontFace: "Arial",
    },
  }))
);
s.addTable(tRows, {
  x: 0.6, y: 1.5, w: 12, h: 5.2,
  fontSize: 13, fontFace: "Arial",
  border: { type: "solid", pt: 0.5, color: C.border },
  colW: [2.5, 3.5, 6],
  autoPage: false,
});

// ==================== SLIDE 4: ARCHITECTURE ====================
s = pptx.addSlide();
s.background = { fill: C.white };
topBar(s); sNum(s, 4);

s.addText("Application Architecture", {
  x: 0.8, y: 0.5, w: 10, h: 0.7, fontSize: 32, bold: true, color: C.dark, fontFace: "Arial",
});

// 3-tier boxes
const tiers = [
  { title: "React Frontend", sub: "SPA (Browser)", color: C.accent },
  { title: "Java Spring Boot", sub: "REST API Server", color: C.green },
  { title: "PostgreSQL", sub: "Cloud Database", color: C.purple },
];
tiers.forEach((t, i) => {
  const bx = 0.6 + i * 4.1;
  s.addShape(pptx.ShapeType.roundRect, {
    x: bx, y: 1.5, w: 3.6, h: 1.4, fill: { color: C.light },
    line: { color: t.color, width: 2 }, rectRadius: 0.1,
  });
  s.addText(t.title, { x: bx, y: 1.6, w: 3.6, h: 0.6, align: "center", fontSize: 16, bold: true, color: t.color, fontFace: "Arial" });
  s.addText(t.sub, { x: bx, y: 2.15, w: 3.6, h: 0.4, align: "center", fontSize: 12, color: C.sub, fontFace: "Arial" });
  if (i < 2) {
    s.addText("→", { x: bx + 3.6, y: 1.5, w: 0.5, h: 1.4, align: "center", valign: "middle", fontSize: 24, color: C.sub, fontFace: "Arial" });
  }
});

// Endpoints
s.addText("REST API Endpoints", {
  x: 0.8, y: 3.2, w: 5, h: 0.4, fontSize: 16, bold: true, color: C.dark, fontFace: "Arial",
});
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.6, y: 3.7, w: 12, h: 3.1, fill: { color: C.codeBg },
  line: { color: C.border, width: 1 }, rectRadius: 0.08,
});
const eps = [
  "POST  /api/auth/signup          →  Register new user (BCrypt hashing)",
  "POST  /api/auth/login           →  Authenticate & return JWT token",
  "GET   /api/menu                 →  Fetch all menu items",
  "POST  /api/menu                 →  Add menu item (catering only)",
  "PUT   /api/menu/{id}            →  Update menu item (catering only)",
  "DELETE /api/menu/{id}           →  Delete menu item (catering only)",
  "GET   /api/orders               →  Fetch orders (with filters)",
  "POST  /api/orders               →  Place new order (JWT protected)",
  "PATCH /api/orders/{id}/status   →  Update order status",
  "PATCH /api/orders/{id}/notify   →  Mark notification sent",
];
eps.forEach((ep, i) => {
  s.addText(ep, { x: 0.9, y: 3.8 + i * 0.29, w: 11.5, h: 0.29, fontSize: 11, color: C.text, fontFace: "Courier New" });
});

// ==================== SLIDE 5: DATABASE SCHEMA ====================
s = pptx.addSlide();
s.background = { fill: C.white };
topBar(s); sNum(s, 5);

s.addText("Database Schema", {
  x: 0.8, y: 0.5, w: 10, h: 0.7, fontSize: 32, bold: true, color: C.dark, fontFace: "Arial",
});
s.addText("PostgreSQL — 4 tables with foreign key relationships", {
  x: 0.8, y: 1.1, w: 10, h: 0.3, fontSize: 14, color: C.sub, fontFace: "Arial",
});

// Table cards
const tables = [
  { name: "users", color: C.purple, cols: ["id  BIGINT PK", "name  VARCHAR(255)", "password_hash  VARCHAR(255)", "role  VARCHAR(50)", "created_at  TIMESTAMP"] },
  { name: "menu_items", color: C.green, cols: ["id  BIGINT PK", "name  VARCHAR(255)", "price  NUMERIC(10,2)", "category  VARCHAR(100)", "available  BOOLEAN"] },
  { name: "orders", color: C.accent, cols: ["order_id  VARCHAR PK", "employee  VARCHAR(255)", "total  NUMERIC(10,2)", "status  VARCHAR(50)", "payment_mode  VARCHAR(50)", "scheduled_date  DATE"] },
];
tables.forEach((t, i) => {
  const bx = 0.5 + i * 4.1;
  s.addShape(pptx.ShapeType.roundRect, {
    x: bx, y: 1.7, w: 3.8, h: 3.2, fill: { color: C.light },
    line: { color: t.color, width: 1.5 }, rectRadius: 0.1,
  });
  s.addText(t.name, { x: bx, y: 1.8, w: 3.8, h: 0.45, align: "center", fontSize: 15, bold: true, color: t.color, fontFace: "Arial" });
  t.cols.forEach((col, ci) => {
    s.addText(col, { x: bx + 0.2, y: 2.35 + ci * 0.32, w: 3.4, h: 0.32, fontSize: 10, color: C.text, fontFace: "Courier New" });
  });
});

// order_items
s.addShape(pptx.ShapeType.roundRect, {
  x: 2.5, y: 5.2, w: 8, h: 1.4, fill: { color: C.light },
  line: { color: C.primary, width: 1.5 }, rectRadius: 0.1,
});
s.addText("order_items", { x: 2.5, y: 5.3, w: 8, h: 0.4, align: "center", fontSize: 15, bold: true, color: C.primary, fontFace: "Arial" });
s.addText("id BIGINT PK  |  order_id VARCHAR FK  |  item_id INT  |  name VARCHAR  |  price NUMERIC  |  qty INT", {
  x: 2.7, y: 5.8, w: 7.6, h: 0.35, align: "center", fontSize: 10, color: C.text, fontFace: "Courier New",
});
s.addText("Foreign Key: order_items.order_id → orders.order_id", {
  x: 2.5, y: 6.2, w: 8, h: 0.3, align: "center", fontSize: 11, color: C.sub, fontFace: "Arial",
});

// ==================== SLIDE 6: AUTH & SECURITY ====================
s = pptx.addSlide();
s.background = { fill: C.white };
topBar(s); sNum(s, 6);

s.addText("Authentication & Security", {
  x: 0.8, y: 0.5, w: 10, h: 0.7, fontSize: 32, bold: true, color: C.dark, fontFace: "Arial",
});

// Signup
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.6, y: 1.4, w: 5.6, h: 5.2, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.4, w: 5.6, h: 0.06, fill: { color: C.purple } });
s.addText("Sign Up Flow", { x: 0.9, y: 1.6, w: 5, h: 0.5, fontSize: 18, bold: true, color: C.purple, fontFace: "Arial" });
const signup = [
  "1.  User enters name, password, role",
  "2.  Frontend validates password (5 rules)",
  "3.  POST /api/auth/signup",
  "4.  Backend hashes password (BCryptPasswordEncoder)",
  "5.  Stores in PostgreSQL users table",
  "6.  Redirect to login page",
];
signup.forEach((st, i) => {
  s.addText(st, { x: 0.9, y: 2.3 + i * 0.42, w: 5, h: 0.42, fontSize: 13, color: C.text, fontFace: "Arial" });
});

// Security features
s.addText("Security Features", { x: 0.9, y: 4.9, w: 5, h: 0.4, fontSize: 14, bold: true, color: C.primary, fontFace: "Arial" });
const secItems = [
  "Passwords hashed with BCrypt (never plain text)",
  "JWT tokens with 24-hour expiry",
  "Spring Security protects all endpoints",
  "Token stored in sessionStorage (clears on tab close)",
];
secItems.forEach((si, i) => {
  s.addText(`•  ${si}`, { x: 0.9, y: 5.3 + i * 0.32, w: 5, h: 0.32, fontSize: 11, color: C.text, fontFace: "Arial" });
});

// Login
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.4, w: 5.6, h: 5.2, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addShape(pptx.ShapeType.rect, { x: 6.6, y: 1.4, w: 5.6, h: 0.06, fill: { color: C.green } });
s.addText("Login Flow", { x: 6.9, y: 1.6, w: 5, h: 0.5, fontSize: 18, bold: true, color: C.green, fontFace: "Arial" });
const login = [
  "1.  User enters credentials + role",
  "2.  POST /api/auth/login",
  "3.  Backend: find user → BCrypt.matches()",
  "4.  On match → generate JWT token",
  "5.  Token sent to frontend",
  "6.  Navigate to role-based dashboard",
];
login.forEach((st, i) => {
  s.addText(st, { x: 6.9, y: 2.3 + i * 0.42, w: 5, h: 0.42, fontSize: 13, color: C.text, fontFace: "Arial" });
});

// JWT code
s.addText("JWT Token Generation", { x: 6.9, y: 4.9, w: 5, h: 0.4, fontSize: 14, bold: true, color: C.accent, fontFace: "Arial" });
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.9, y: 5.3, w: 5, h: 1.25, fill: { color: C.codeBg }, rectRadius: 0.06,
});
const jwt = ["Jwts.builder()", "  .setSubject(user.getName())", "  .claim(\"role\", user.getRole())", "  .setExpiration(+24h)", "  .signWith(secretKey).compact();"];
jwt.forEach((c, i) => {
  s.addText(c, { x: 7.1, y: 5.35 + i * 0.22, w: 4.6, h: 0.22, fontSize: 10, color: C.text, fontFace: "Courier New" });
});

// ==================== SLIDE 7: EMPLOYEE MODULE ====================
s = pptx.addSlide();
s.background = { fill: C.white };
topBar(s); sNum(s, 7);

s.addText("Employee Module", {
  x: 0.8, y: 0.5, w: 10, h: 0.7, fontSize: 32, bold: true, color: C.dark, fontFace: "Arial",
});

// Menu
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.6, y: 1.4, w: 5.6, h: 3.2, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.4, w: 5.6, h: 0.06, fill: { color: C.accent } });
s.addText("Menu Dashboard", { x: 0.9, y: 1.6, w: 5, h: 0.45, fontSize: 17, bold: true, color: C.accent, fontFace: "Arial" });
const menuF = ["Live search with instant filtering", "Dynamic category pills from API", "Responsive card grid layout", "Add to cart with quantity badges", "Floating cart bar (always visible)"];
menuF.forEach((f, i) => {
  s.addText(`•  ${f}`, { x: 0.9, y: 2.2 + i * 0.38, w: 5, h: 0.38, fontSize: 12, color: C.text, fontFace: "Arial" });
});

// Cart
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.4, w: 5.6, h: 3.2, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addShape(pptx.ShapeType.rect, { x: 6.6, y: 1.4, w: 5.6, h: 0.06, fill: { color: C.green } });
s.addText("Cart & Checkout", { x: 6.9, y: 1.6, w: 5, h: 0.45, fontSize: 17, bold: true, color: C.green, fontFace: "Arial" });
const cartF = ["Increment / decrement quantities", "Live total calculation", "Razorpay online payment or COD", "Order saved to PostgreSQL via API", "Confirmation page with order ID"];
cartF.forEach((f, i) => {
  s.addText(`•  ${f}`, { x: 6.9, y: 2.2 + i * 0.38, w: 5, h: 0.38, fontSize: 12, color: C.text, fontFace: "Arial" });
});

// Order flow
s.addText("Order Flow", { x: 0.8, y: 4.9, w: 5, h: 0.4, fontSize: 16, bold: true, color: C.dark, fontFace: "Arial" });
const oFlow = ["Browse Menu", "Add to Cart", "Choose Payment", "Place Order", "Confirmation"];
oFlow.forEach((of, i) => {
  const ox = 0.6 + i * 2.4;
  s.addShape(pptx.ShapeType.roundRect, {
    x: ox, y: 5.4, w: 2, h: 0.7, fill: { color: C.light },
    line: { color: C.primary, width: 1 }, rectRadius: 0.08,
  });
  s.addText(of, { x: ox, y: 5.4, w: 2, h: 0.7, align: "center", valign: "middle", fontSize: 11, bold: true, color: C.primary, fontFace: "Arial" });
  if (i < 4) s.addText("→", { x: ox + 2, y: 5.4, w: 0.4, h: 0.7, align: "center", valign: "middle", fontSize: 16, color: C.sub, fontFace: "Arial" });
});

// ==================== SLIDE 8: RAZORPAY ====================
s = pptx.addSlide();
s.background = { fill: C.white };
topBar(s); sNum(s, 8);

s.addText("Razorpay Payment Integration", {
  x: 0.8, y: 0.5, w: 10, h: 0.7, fontSize: 32, bold: true, color: C.dark, fontFace: "Arial",
});

// Flow
const rzpF = ["User clicks\n\"Pay Online\"", "Razorpay modal\nopens (iframe)", "User enters\npayment details", "Success / Fail\ncallback", "Order saved\nwith payment ID"];
rzpF.forEach((f, i) => {
  const fx = 0.4 + i * 2.45;
  s.addShape(pptx.ShapeType.roundRect, {
    x: fx, y: 1.5, w: 2.1, h: 0.9, fill: { color: C.light },
    line: { color: C.primary, width: 1 }, rectRadius: 0.08,
  });
  s.addText(f, { x: fx, y: 1.5, w: 2.1, h: 0.9, align: "center", valign: "middle", fontSize: 10, bold: true, color: C.text, fontFace: "Arial" });
  if (i < 4) s.addText("→", { x: fx + 2.1, y: 1.5, w: 0.35, h: 0.9, align: "center", valign: "middle", fontSize: 16, color: C.sub, fontFace: "Arial" });
});

// Details
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.6, y: 2.8, w: 5.6, h: 3.8, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addText("Technical Details", { x: 0.9, y: 2.9, w: 5, h: 0.45, fontSize: 17, bold: true, color: C.dark, fontFace: "Arial" });
const rzpD = [
  "API Key injected at build time via .env",
  "Amount sent in paise (₹140 = 14000)",
  "Card data never touches our server (PCI-DSS)",
  "Payment ID stored with order in database",
  "Loading state prevents double payments",
  "Failure handler shows error reason to user",
];
rzpD.forEach((d, i) => {
  s.addText(`•  ${d}`, { x: 0.9, y: 3.5 + i * 0.42, w: 5, h: 0.42, fontSize: 12, color: C.text, fontFace: "Arial" });
});

// Code
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 2.8, w: 5.6, h: 3.8, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addText("Integration Code (React)", { x: 6.9, y: 2.9, w: 5, h: 0.45, fontSize: 17, bold: true, color: C.dark, fontFace: "Arial" });
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.9, y: 3.5, w: 5, h: 2.8, fill: { color: C.codeBg }, rectRadius: 0.06,
});
const rzpCode = [
  "const options = {",
  "  key: REACT_APP_RAZORPAY_KEY_ID,",
  "  amount: totalPrice * 100,",
  "  currency: \"INR\",",
  "  handler: async (response) => {",
  "    await apiPlaceOrder({",
  "      items, total,",
  "      paymentMode: 'online',",
  "      razorpayPaymentId:",
  "        response.razorpay_payment_id",
  "    });",
  "  }",
  "};",
];
rzpCode.forEach((c, i) => {
  s.addText(c, { x: 7.1, y: 3.55 + i * 0.2, w: 4.6, h: 0.2, fontSize: 9.5, color: C.text, fontFace: "Courier New" });
});

// ==================== SLIDE 9: CATERING MODULE ====================
s = pptx.addSlide();
s.background = { fill: C.white };
topBar(s); sNum(s, 9);

s.addText("Catering Admin Module", {
  x: 0.8, y: 0.5, w: 10, h: 0.7, fontSize: 32, bold: true, color: C.dark, fontFace: "Arial",
});

// Menu CRUD
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.6, y: 1.4, w: 5.6, h: 4, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.4, w: 5.6, h: 0.06, fill: { color: C.accent } });
s.addText("Menu Management (CRUD)", { x: 0.9, y: 1.6, w: 5, h: 0.45, fontSize: 17, bold: true, color: C.accent, fontFace: "Arial" });
const crud = ["Create — Add new item via API", "Read — Fetch all items from database", "Update — Edit item details", "Delete — Remove item from database", "Toggle — Available / Unavailable status", "Categories: Breakfast, Lunch, Snacks, Beverages"];
crud.forEach((c, i) => {
  s.addText(`•  ${c}`, { x: 0.9, y: 2.2 + i * 0.42, w: 5, h: 0.42, fontSize: 12, color: C.text, fontFace: "Arial" });
});

// Order Management
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.4, w: 5.6, h: 4, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addShape(pptx.ShapeType.rect, { x: 6.6, y: 1.4, w: 5.6, h: 0.06, fill: { color: C.green } });
s.addText("Order Management", { x: 6.9, y: 1.6, w: 5, h: 0.45, fontSize: 17, bold: true, color: C.green, fontFace: "Arial" });
const ordF = ["View all incoming orders", "Employee name & order details", "Payment mode badge (Paid / COD)", "Status workflow management", "Notification tracking", "Order total with itemized breakdown"];
ordF.forEach((f, i) => {
  s.addText(`•  ${f}`, { x: 6.9, y: 2.2 + i * 0.42, w: 5, h: 0.42, fontSize: 12, color: C.text, fontFace: "Arial" });
});

// Status lifecycle
s.addText("Order Status Lifecycle", { x: 0.8, y: 5.7, w: 5, h: 0.4, fontSize: 14, bold: true, color: C.dark, fontFace: "Arial" });
const sts = ["Placed", "Preparing", "Ready", "Delivered"];
const stC = [C.primary, C.gold, C.accent, C.green];
sts.forEach((st, i) => {
  const sx = 0.6 + i * 3;
  s.addShape(pptx.ShapeType.roundRect, {
    x: sx, y: 6.15, w: 2.4, h: 0.4, fill: { color: C.light },
    line: { color: stC[i], width: 1.5 }, rectRadius: 0.2,
  });
  s.addText(st, { x: sx, y: 6.15, w: 2.4, h: 0.4, align: "center", fontSize: 12, bold: true, color: stC[i], fontFace: "Arial" });
  if (i < 3) s.addText("→", { x: sx + 2.4, y: 6.15, w: 0.6, h: 0.4, align: "center", fontSize: 14, color: C.sub, fontFace: "Arial" });
});

// ==================== SLIDE 10: DEPLOYMENT ====================
s = pptx.addSlide();
s.background = { fill: C.white };
topBar(s); sNum(s, 10);

s.addText("Deployment Architecture", {
  x: 0.8, y: 0.5, w: 10, h: 0.7, fontSize: 32, bold: true, color: C.dark, fontFace: "Arial",
});

// Flow
const depF = ["GitHub\nRepository", "Render\nBuild", "React Build\n+ Java JAR", "Spring Boot\nServes App", "PostgreSQL\nCloud DB"];
depF.forEach((d, i) => {
  const dx = 0.4 + i * 2.45;
  s.addShape(pptx.ShapeType.roundRect, {
    x: dx, y: 1.5, w: 2.1, h: 0.9, fill: { color: C.light },
    line: { color: C.accent, width: 1 }, rectRadius: 0.08,
  });
  s.addText(d, { x: dx, y: 1.5, w: 2.1, h: 0.9, align: "center", valign: "middle", fontSize: 10, bold: true, color: C.text, fontFace: "Arial" });
  if (i < 4) s.addText("→", { x: dx + 2.1, y: 1.5, w: 0.35, h: 0.9, align: "center", valign: "middle", fontSize: 16, color: C.sub, fontFace: "Arial" });
});

// Web Service
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.6, y: 2.8, w: 5.6, h: 3.8, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 2.8, w: 5.6, h: 0.06, fill: { color: C.accent } });
s.addText("Render Web Service", { x: 0.9, y: 3.0, w: 5, h: 0.45, fontSize: 17, bold: true, color: C.accent, fontFace: "Arial" });
const wsF = ["Auto-deploy on git push to main", "Build: mvn clean package + npm run build", "Start: java -jar servebox.jar", "HTTPS enabled by default", "Environment variables for secrets"];
wsF.forEach((f, i) => {
  s.addText(`•  ${f}`, { x: 0.9, y: 3.6 + i * 0.42, w: 5, h: 0.42, fontSize: 12, color: C.text, fontFace: "Arial" });
});

// Database
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 2.8, w: 5.6, h: 3.8, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addShape(pptx.ShapeType.rect, { x: 6.6, y: 2.8, w: 5.6, h: 0.06, fill: { color: C.green } });
s.addText("Render PostgreSQL", { x: 6.9, y: 3.0, w: 5, h: 0.45, fontSize: 17, bold: true, color: C.green, fontFace: "Arial" });
const dbF = ["Managed cloud database", "SSL connections enforced", "Automatic backups", "Same region as web service", "Connected via DATABASE_URL env var"];
dbF.forEach((f, i) => {
  s.addText(`•  ${f}`, { x: 6.9, y: 3.6 + i * 0.42, w: 5, h: 0.42, fontSize: 12, color: C.text, fontFace: "Arial" });
});

// ==================== SLIDE 11: PROJECT STRUCTURE ====================
s = pptx.addSlide();
s.background = { fill: C.white };
topBar(s); sNum(s, 11);

s.addText("Project Structure", {
  x: 0.8, y: 0.5, w: 10, h: 0.7, fontSize: 32, bold: true, color: C.dark, fontFace: "Arial",
});

// Frontend
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.6, y: 1.3, w: 5.6, h: 5.3, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addShape(pptx.ShapeType.rect, { x: 0.6, y: 1.3, w: 5.6, h: 0.06, fill: { color: C.accent } });
s.addText("Frontend (React)", { x: 0.9, y: 1.5, w: 5, h: 0.45, fontSize: 17, bold: true, color: C.accent, fontFace: "Arial" });
const feFiles = [
  "src/",
  "├── App.js               Main router",
  "├── App.css              Global styles",
  "├── components/",
  "│   ├── LoginPage.js     Authentication",
  "│   ├── SignUpPage.js     Registration",
  "│   ├── EmployeeDashboard.js  Menu + Cart",
  "│   ├── CartPage.js      Checkout + Payment",
  "│   ├── OrderConfirmation.js  Success page",
  "│   ├── CateringDashboard.js  Admin panel",
  "│   ├── OrderDisplay.js  Public display",
  "│   └── Navbar.js        Navigation",
  "└── helpers/",
  "    ├── api.js           API client",
  "    └── storage.js       Utilities",
];
feFiles.forEach((f, i) => {
  s.addText(f, { x: 0.9, y: 2.1 + i * 0.28, w: 5, h: 0.28, fontSize: 10, color: C.text, fontFace: "Courier New" });
});

// Backend
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.3, w: 5.6, h: 5.3, fill: { color: C.light },
  line: { color: C.border, width: 1 }, rectRadius: 0.1,
});
s.addShape(pptx.ShapeType.rect, { x: 6.6, y: 1.3, w: 5.6, h: 0.06, fill: { color: C.green } });
s.addText("Backend (Java Spring Boot)", { x: 6.9, y: 1.5, w: 5, h: 0.45, fontSize: 17, bold: true, color: C.green, fontFace: "Arial" });
const beFiles = [
  "src/main/java/com/servebox/",
  "├── ServeBoxApplication.java   Main",
  "├── config/",
  "│   └── SecurityConfig.java    Security",
  "├── controller/",
  "│   ├── AuthController.java    Auth API",
  "│   ├── MenuController.java    Menu API",
  "│   └── OrderController.java   Orders API",
  "├── model/",
  "│   ├── User.java              Entity",
  "│   ├── MenuItem.java          Entity",
  "│   └── Order.java             Entity",
  "├── repository/                JPA Repos",
  "└── service/                   Logic",
];
beFiles.forEach((f, i) => {
  s.addText(f, { x: 6.9, y: 2.1 + i * 0.28, w: 5, h: 0.28, fontSize: 10, color: C.text, fontFace: "Courier New" });
});

s.addShape(pptx.ShapeType.roundRect, {
  x: 3, y: 6.3, w: 7, h: 0.5, fill: { color: C.light },
  line: { color: C.primary, width: 1 }, rectRadius: 0.06,
});
s.addText("8 React components  •  3 REST controllers  •  4 database tables", {
  x: 3, y: 6.3, w: 7, h: 0.5, align: "center", valign: "middle",
  fontSize: 12, bold: true, color: C.primary, fontFace: "Arial",
});

// ==================== SLIDE 12: THANK YOU ====================
s = pptx.addSlide();
s.background = { fill: C.white };
s.addShape(pptx.ShapeType.rect, { x: 0, y: 0, w: 13.33, h: 0.1, fill: { color: C.primary } });
sNum(s, 12);

s.addText("Thank You", {
  x: 0, y: 2.2, w: "100%", h: 1, align: "center",
  fontSize: 52, bold: true, color: C.dark, fontFace: "Arial",
});
s.addText("ServeBox — Making Office Food Simple", {
  x: 0, y: 3.2, w: "100%", h: 0.6, align: "center",
  fontSize: 20, color: C.primary, fontFace: "Arial",
});

const summary = [
  { label: "Frontend", value: "React 19" },
  { label: "Backend", value: "Java Spring Boot" },
  { label: "Database", value: "PostgreSQL" },
  { label: "Auth", value: "Spring Security" },
  { label: "Payments", value: "Razorpay" },
  { label: "Hosted", value: "Render Cloud" },
];
summary.forEach((si, i) => {
  const sx = 0.9 + i * 1.95;
  s.addShape(pptx.ShapeType.roundRect, {
    x: sx, y: 4.3, w: 1.8, h: 1, fill: { color: C.light },
    line: { color: C.border, width: 1 }, rectRadius: 0.08,
  });
  s.addText(si.label, { x: sx, y: 4.35, w: 1.8, h: 0.35, align: "center", fontSize: 10, color: C.sub, fontFace: "Arial" });
  s.addText(si.value, { x: sx, y: 4.7, w: 1.8, h: 0.4, align: "center", fontSize: 12, bold: true, color: C.dark, fontFace: "Arial" });
});

s.addText("Questions?", {
  x: 0, y: 5.8, w: "100%", h: 0.5, align: "center",
  fontSize: 18, color: C.sub, fontFace: "Arial",
});

// Generate
pptx.writeFile({ fileName: "ServeBox-Presentation-v2.pptx" }).then(() => {
  console.log("ServeBox-Presentation-v2.pptx generated successfully!");
}).catch(err => {
  console.error("Error:", err);
});
