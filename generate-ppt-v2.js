const pptxgen = require("pptxgenjs");

const pptx = new pptxgen();

pptx.layout = "LAYOUT_WIDE";
pptx.author = "ServeBox Team";
pptx.company = "ServeBox";
pptx.subject = "ServeBox — Office Food Ordering Platform";
pptx.title = "ServeBox Internal Presentation";

const C = {
  primary: "E23744",
  primaryDark: "C7202E",
  dark: "1A1A2E",
  darkBg: "0F0C29",
  gold: "F0A500",
  green: "27AE60",
  danger: "E74C3C",
  purple: "6C5CE7",
  gray: "636E72",
  lightGray: "B2BEC3",
  white: "FFFFFF",
  codeBg: "0D1117",
  cardBg: "16213E",
};

function slideNum(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 0.3, y: 6.9, w: 2, h: 0.3,
    fontSize: 10, color: C.gray, fontFace: "Arial",
  });
}

const TOTAL = 15;

// ======================== SLIDE 1: TITLE ========================
let s = pptx.addSlide();
s.background = { fill: C.darkBg };
slideNum(s, 1, TOTAL);

s.addText("🍽️", { x: 0, y: 0.6, w: "100%", h: 1, align: "center", fontSize: 60 });
s.addText("ServeBox", {
  x: 0, y: 1.6, w: "100%", h: 1, align: "center",
  fontSize: 54, bold: true, color: C.white, fontFace: "Arial",
});
s.addText("Office Food Ordering Platform", {
  x: 0, y: 2.5, w: "100%", h: 0.6, align: "center",
  fontSize: 26, color: C.gold, fontFace: "Arial",
});
s.addText("Full-Stack Production Application — Internal Presentation", {
  x: 0, y: 3.1, w: "100%", h: 0.5, align: "center",
  fontSize: 16, color: C.gray, fontFace: "Arial",
});

const tags = [
  { text: "React 19", color: C.primary },
  { text: "Java Spring Boot", color: "74B9FF" },
  { text: "PostgreSQL", color: C.green },
  { text: "JWT Auth", color: C.purple },
  { text: "Razorpay", color: C.gold },
];
let tagX = 1.5;
tags.forEach((tag) => {
  const tw = tag.text.length > 12 ? 2.3 : 1.8;
  s.addShape(pptx.ShapeType.roundRect, {
    x: tagX, y: 4.1, w: tw, h: 0.4,
    fill: { color: C.dark }, line: { color: tag.color, width: 1.5 },
    rectRadius: 0.2,
  });
  s.addText(tag.text, {
    x: tagX, y: 4.1, w: tw, h: 0.4, align: "center",
    fontSize: 11, bold: true, color: tag.color, fontFace: "Arial",
  });
  tagX += tw + 0.15;
});

s.addText("Deployed on Render  •  PostgreSQL Cloud Database", {
  x: 0, y: 5.2, w: "100%", h: 0.4, align: "center",
  fontSize: 14, color: C.gray, fontFace: "Arial",
});
s.addText("Presented by: Shree Harini", {
  x: 0, y: 5.8, w: "100%", h: 0.4, align: "center",
  fontSize: 14, color: C.lightGray, fontFace: "Arial",
});

// ======================== SLIDE 2: PROBLEM STATEMENT ========================
s = pptx.addSlide();
s.background = { fill: C.dark };
slideNum(s, 2, TOTAL);

s.addText("📌  Problem Statement", {
  x: 0.6, y: 0.4, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});
s.addText(
  "Managing office food orders is chaotic — paper lists, WhatsApp groups, and manual tracking lead to errors, delays, and payment confusion.",
  { x: 0.6, y: 1.2, w: 11, h: 0.8, fontSize: 18, color: C.lightGray, fontFace: "Arial" }
);

// Pain Points
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 2.3, w: 5.7, h: 4.2, fill: { color: C.cardBg }, rectRadius: 0.15,
});
s.addText("❌  Current Pain Points", {
  x: 0.8, y: 2.4, w: 5, h: 0.6, fontSize: 20, bold: true, color: C.danger, fontFace: "Arial",
});
const painPoints = [
  "Manual order collection via chat/paper",
  "No centralized menu management",
  "Cash handling & payment tracking issues",
  "No order history or audit trail",
  "Catering team has no dashboard",
  "Data lost when browser cache clears",
];
painPoints.forEach((p, i) => {
  s.addText(`•   ${p}`, {
    x: 0.8, y: 3.1 + i * 0.5, w: 5.2, h: 0.5,
    fontSize: 14, color: C.lightGray, fontFace: "Arial",
  });
});

// Solution
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.5, y: 2.3, w: 5.7, h: 4.2, fill: { color: C.cardBg }, rectRadius: 0.15,
});
s.addText("✅  ServeBox Solution", {
  x: 6.8, y: 2.4, w: 5, h: 0.6, fontSize: 20, bold: true, color: C.green, fontFace: "Arial",
});
const solutions = [
  "Digital ordering with live menu",
  "Role-based access (Employee + Catering)",
  "Integrated Razorpay payments",
  "Complete order history & tracking",
  "Full admin dashboard for catering",
  "Persistent PostgreSQL database",
];
solutions.forEach((sol, i) => {
  s.addText(`•   ${sol}`, {
    x: 6.8, y: 3.1 + i * 0.5, w: 5.2, h: 0.5,
    fontSize: 14, color: C.lightGray, fontFace: "Arial",
  });
});

// ======================== SLIDE 3: TECH STACK ========================
s = pptx.addSlide();
s.background = { fill: C.darkBg };
slideNum(s, 3, TOTAL);

s.addText("🛠️  Technology Stack", {
  x: 0.6, y: 0.4, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});

const techRows = [
  ["Layer", "Technology", "Purpose"],
  ["⚛️ Frontend", "React 19", "Component-based SPA with hooks"],
  ["🧭 Routing", "React Router v7", "Client-side navigation"],
  ["🖥️ Backend", "Java (Spring Boot 3)", "REST API server with Spring MVC"],
  ["🗄️ Database", "PostgreSQL 18", "Relational DB with Spring Data JPA"],
  ["🔐 Auth", "Spring Security + JWT", "Token-based auth with BCrypt hashing"],
  ["💳 Payments", "Razorpay Checkout.js", "PCI-DSS compliant payment gateway"],
  ["🎨 Styling", "Pure CSS + CSS Variables", "Zero-dependency theming"],
  ["🚀 Deployment", "Render (Web Service + DB)", "Cloud hosting with managed PostgreSQL"],
  ["🔧 Build Tool", "Maven", "Dependency management & JAR packaging"],
];

const tableRows = techRows.map((row, rIdx) =>
  row.map((cell, cIdx) => ({
    text: cell,
    options: {
      bold: rIdx === 0 || cIdx === 1,
      color: rIdx === 0 ? C.primary : C.lightGray,
      fill: { color: rIdx === 0 ? C.cardBg : (rIdx % 2 === 0 ? C.dark : C.cardBg) },
      fontSize: rIdx === 0 ? 13 : 13,
    },
  }))
);
s.addTable(tableRows, {
  x: 0.5, y: 1.3, w: 12, h: 5.5,
  fontSize: 13, fontFace: "Arial", color: C.lightGray,
  border: { type: "solid", pt: 0.5, color: "30363D" },
  colW: [2.5, 3.5, 6],
  autoPage: false,
});

// ======================== SLIDE 4: ARCHITECTURE ========================
s = pptx.addSlide();
s.background = { fill: C.dark };
slideNum(s, 4, TOTAL);

s.addText("🏗️  Full-Stack Architecture", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});

// Architecture flow boxes
const archFlow = [
  { icon: "🌐", title: "React Frontend", sub: "SPA (Browser)", color: C.primary },
  { icon: "☕", title: "Java Spring Boot", sub: "REST API (Spring MVC)", color: "74B9FF" },
  { icon: "🗄️", title: "PostgreSQL", sub: "Cloud Database", color: C.green },
];
archFlow.forEach((box, i) => {
  const bx = 0.5 + i * 4.1;
  s.addShape(pptx.ShapeType.roundRect, {
    x: bx, y: 1.3, w: 3.6, h: 1.6, fill: { color: C.cardBg },
    line: { color: box.color, width: 2 }, rectRadius: 0.12,
  });
  s.addText(box.icon, { x: bx, y: 1.35, w: 3.6, h: 0.5, align: "center", fontSize: 28 });
  s.addText(box.title, {
    x: bx, y: 1.85, w: 3.6, h: 0.4, align: "center",
    fontSize: 17, bold: true, color: C.white, fontFace: "Arial",
  });
  s.addText(box.sub, {
    x: bx, y: 2.25, w: 3.6, h: 0.35, align: "center",
    fontSize: 12, color: C.gray, fontFace: "Arial",
  });
  if (i < archFlow.length - 1) {
    s.addText("→", {
      x: bx + 3.6, y: 1.3, w: 0.5, h: 1.6, align: "center", valign: "middle",
      fontSize: 28, color: C.gold, fontFace: "Arial",
    });
  }
});

// API Endpoints
s.addText("📡  API Endpoints", {
  x: 0.6, y: 3.2, w: 5, h: 0.4, fontSize: 18, bold: true, color: C.gold, fontFace: "Arial",
});
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 3.7, w: 12, h: 3.2, fill: { color: C.codeBg },
  line: { color: "30363D", width: 1 }, rectRadius: 0.1,
});
const endpoints = [
  "POST  /api/auth/signup          →  Register new user (BCrypt hashing)",
  "POST  /api/auth/login           →  Authenticate & return JWT token",
  "GET   /api/menu                 →  Fetch all menu items (public)",
  "POST  /api/menu                 →  Add menu item (catering only)",
  "PUT   /api/menu/{id}            →  Update menu item (catering only)",
  "DELETE /api/menu/{id}           →  Delete menu item (catering only)",
  "GET   /api/orders               →  Fetch orders (with date/status filters)",
  "POST  /api/orders               →  Place new order (JWT protected)",
  "PATCH /api/orders/{id}/status   →  Update order status (catering only)",
  "PATCH /api/orders/{id}/notify   →  Mark notification sent",
];
endpoints.forEach((ep, i) => {
  s.addText(ep, {
    x: 0.8, y: 3.8 + i * 0.3, w: 11.5, h: 0.3,
    fontSize: 11, color: "C9D1D9", fontFace: "Courier New",
  });
});

// ======================== SLIDE 5: DATABASE SCHEMA ========================
s = pptx.addSlide();
s.background = { fill: C.darkBg };
slideNum(s, 5, TOTAL);

s.addText("🗄️  Database Schema (PostgreSQL)", {
  x: 0.6, y: 0.4, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});

// Users table
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.3, w: 3.6, h: 3, fill: { color: C.cardBg },
  line: { color: C.purple, width: 2 }, rectRadius: 0.12,
});
s.addText("🔐  users", {
  x: 0.5, y: 1.35, w: 3.6, h: 0.45, align: "center",
  fontSize: 16, bold: true, color: C.purple, fontFace: "Arial",
});
const userCols = ["id  BIGINT  PK (Auto)", "name  VARCHAR(255)", "password_hash  VARCHAR(255)", "role  VARCHAR(50)", "created_at  TIMESTAMP"];
userCols.forEach((col, i) => {
  s.addText(col, {
    x: 0.7, y: 1.9 + i * 0.32, w: 3.2, h: 0.32,
    fontSize: 11, color: C.lightGray, fontFace: "Courier New",
  });
});

// Menu items table
s.addShape(pptx.ShapeType.roundRect, {
  x: 4.4, y: 1.3, w: 3.6, h: 3, fill: { color: C.cardBg },
  line: { color: C.green, width: 2 }, rectRadius: 0.12,
});
s.addText("📋  menu_items", {
  x: 4.4, y: 1.35, w: 3.6, h: 0.45, align: "center",
  fontSize: 16, bold: true, color: C.green, fontFace: "Arial",
});
const menuCols = ["id  BIGINT  PK (Auto)", "name  VARCHAR(255)", "price  NUMERIC(10,2)", "category  VARCHAR(100)", "available  BOOLEAN"];
menuCols.forEach((col, i) => {
  s.addText(col, {
    x: 4.6, y: 1.9 + i * 0.32, w: 3.2, h: 0.32,
    fontSize: 11, color: C.lightGray, fontFace: "Courier New",
  });
});

// Orders table
s.addShape(pptx.ShapeType.roundRect, {
  x: 8.3, y: 1.3, w: 4, h: 3, fill: { color: C.cardBg },
  line: { color: C.gold, width: 2 }, rectRadius: 0.12,
});
s.addText("📦  orders", {
  x: 8.3, y: 1.35, w: 4, h: 0.45, align: "center",
  fontSize: 16, bold: true, color: C.gold, fontFace: "Arial",
});
const orderCols = ["order_id  VARCHAR  PK", "employee  VARCHAR(255)", "total  NUMERIC(10,2)", "status  VARCHAR(50)", "payment_mode  VARCHAR(50)", "scheduled_date  DATE"];
orderCols.forEach((col, i) => {
  s.addText(col, {
    x: 8.5, y: 1.9 + i * 0.32, w: 3.6, h: 0.32,
    fontSize: 11, color: C.lightGray, fontFace: "Courier New",
  });
});

// Order Items table
s.addShape(pptx.ShapeType.roundRect, {
  x: 3, y: 4.7, w: 7, h: 2, fill: { color: C.cardBg },
  line: { color: C.primary, width: 2 }, rectRadius: 0.12,
});
s.addText("🧾  order_items", {
  x: 3, y: 4.75, w: 7, h: 0.45, align: "center",
  fontSize: 16, bold: true, color: C.primary, fontFace: "Arial",
});
const oiCols = [
  "id BIGINT PK  |  order_id VARCHAR FK  |  item_id INT  |  name VARCHAR  |  price NUMERIC  |  qty INT",
];
s.addText(oiCols[0], {
  x: 3.2, y: 5.3, w: 6.6, h: 0.4, align: "center",
  fontSize: 11, color: C.lightGray, fontFace: "Courier New",
});

// Relationship arrows
s.addText("orders ← FK → order_items", {
  x: 3, y: 5.8, w: 7, h: 0.4, align: "center",
  fontSize: 12, color: C.gray, fontFace: "Arial",
});

// ======================== SLIDE 6: AUTH SYSTEM ========================
s = pptx.addSlide();
s.background = { fill: C.dark };
slideNum(s, 6, TOTAL);

s.addText("🔐  Authentication & Security", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});

// Sign Up
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.2, w: 5.8, h: 5.5, fill: { color: C.cardBg }, rectRadius: 0.12,
});
s.addText("Sign Up Flow", {
  x: 0.8, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.purple, fontFace: "Arial",
});
const signupSteps = [
  "1.  User enters name, password, role",
  "2.  Frontend validates password (5 rules)",
  "3.  API call: POST /api/auth/signup",
  "4.  Backend hashes password (BCryptPasswordEncoder)",
  "5.  Stores in PostgreSQL users table",
  "6.  Redirect to login page",
];
signupSteps.forEach((step, i) => {
  s.addText(step, {
    x: 0.8, y: 1.9 + i * 0.4, w: 5.2, h: 0.4,
    fontSize: 14, color: C.lightGray, fontFace: "Arial",
  });
});

s.addText("Security Features", {
  x: 0.8, y: 4.3, w: 5, h: 0.4, fontSize: 16, bold: true, color: C.primary, fontFace: "Arial",
});
const secFeatures = [
  "🔒  Passwords hashed with BCryptPasswordEncoder",
  "🎫  JWT tokens (24h expiry) for session management",
  "🛡️  Spring Security filters protect all endpoints",
  "📱  Token stored in sessionStorage (auto-clears on tab close)",
];
secFeatures.forEach((f, i) => {
  s.addText(f, {
    x: 0.8, y: 4.8 + i * 0.4, w: 5.2, h: 0.4,
    fontSize: 12, color: C.lightGray, fontFace: "Arial",
  });
});

// Login Flow
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.2, w: 5.8, h: 5.5, fill: { color: C.cardBg }, rectRadius: 0.12,
});
s.addText("Login Flow", {
  x: 6.9, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.green, fontFace: "Arial",
});
const loginSteps = [
  "1.  User enters credentials + role",
  "2.  API call: POST /api/auth/login",
  "3.  Backend: find user → BCrypt.matches()",
  "4.  On match → Generate JWT token",
  "5.  Token sent to frontend",
  "6.  Navigate to role-based dashboard",
];
loginSteps.forEach((step, i) => {
  s.addText(step, {
    x: 6.9, y: 1.9 + i * 0.4, w: 5.2, h: 0.4,
    fontSize: 14, color: C.lightGray, fontFace: "Arial",
  });
});

// JWT Code example
s.addText("JWT Token Payload", {
  x: 6.9, y: 4.3, w: 5, h: 0.4, fontSize: 16, bold: true, color: C.gold, fontFace: "Arial",
});
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.9, y: 4.7, w: 5.2, h: 1.8, fill: { color: C.codeBg }, rectRadius: 0.08,
});
const jwtCode = [
  "String token = Jwts.builder()",
  "  .setSubject(user.getName())",
  "  .claim(\"role\", user.getRole())",
  "  .setExpiration(new Date(+24h))",
  "  .signWith(secretKey)",
  "  .compact();",
];
jwtCode.forEach((c, i) => {
  s.addText(c, {
    x: 7.1, y: 4.8 + i * 0.3, w: 4.8, h: 0.3,
    fontSize: 12, color: "C9D1D9", fontFace: "Courier New",
  });
});

// ======================== SLIDE 7: EMPLOYEE MODULE ========================
s = pptx.addSlide();
s.background = { fill: C.darkBg };
slideNum(s, 7, TOTAL);

s.addText("👨‍💼  Employee Module", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});

// Menu Dashboard
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.2, w: 5.8, h: 3.2, fill: { color: C.cardBg }, rectRadius: 0.12,
});
s.addText("Menu Dashboard", {
  x: 0.8, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.gold, fontFace: "Arial",
});
const menuFeatures = [
  "🔍  Live search — instant case-insensitive filter",
  "🏷️  Dynamic category pills (from API data)",
  "📱  Responsive CSS Grid layout",
  "🛒  Add to cart with quantity badges",
  "📌  Floating cart bar (always accessible)",
];
menuFeatures.forEach((f, i) => {
  s.addText(f, {
    x: 0.8, y: 1.9 + i * 0.42, w: 5.2, h: 0.42,
    fontSize: 13, color: C.lightGray, fontFace: "Arial",
  });
});

// Cart System
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.2, w: 5.8, h: 3.2, fill: { color: C.cardBg }, rectRadius: 0.12,
});
s.addText("Cart & Checkout", {
  x: 6.9, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.gold, fontFace: "Arial",
});
const cartFeatures = [
  "➕  Increment / decrement with auto-remove",
  "📊  Live total calculation",
  "💳  Razorpay online payment or Cash on Delivery",
  "🔄  Order placed via API → stored in PostgreSQL",
  "📝  Order confirmation with ID & summary",
];
cartFeatures.forEach((f, i) => {
  s.addText(f, {
    x: 6.9, y: 1.9 + i * 0.42, w: 5.2, h: 0.42,
    fontSize: 13, color: C.lightGray, fontFace: "Arial",
  });
});

// Order flow
s.addText("📦  Order Flow", {
  x: 0.6, y: 4.6, w: 5, h: 0.5, fontSize: 18, bold: true, color: C.gold, fontFace: "Arial",
});
const orderFlow = ["Browse Menu", "Add to Cart", "Choose Payment", "Place Order\n(API call)", "Confirmation\nPage"];
orderFlow.forEach((of, i) => {
  const ox = 0.5 + i * 2.4;
  s.addShape(pptx.ShapeType.roundRect, {
    x: ox, y: 5.2, w: 2, h: 0.85, fill: { color: C.dark },
    line: { color: C.primary, width: 1 }, rectRadius: 0.1,
  });
  s.addText(of, {
    x: ox, y: 5.2, w: 2, h: 0.85, align: "center", valign: "middle",
    fontSize: 11, bold: true, color: C.white, fontFace: "Arial",
  });
  if (i < orderFlow.length - 1) {
    s.addText("→", {
      x: ox + 2, y: 5.2, w: 0.4, h: 0.85, align: "center", valign: "middle",
      fontSize: 18, color: C.gold, fontFace: "Arial",
    });
  }
});

// ======================== SLIDE 8: RAZORPAY ========================
s = pptx.addSlide();
s.background = { fill: C.primaryDark };
slideNum(s, 8, TOTAL);

s.addText("💳  Razorpay Payment Integration", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: "Arial",
});

// Flow
const rzpFlow = ["User clicks\n\"Pay Online\"", "Validate API Key\n& SDK loaded", "Razorpay modal\nopens", "User enters\npayment details", "Success/Fail\nCallback"];
rzpFlow.forEach((fb, i) => {
  const fx = 0.3 + i * 2.5;
  s.addShape(pptx.ShapeType.roundRect, {
    x: fx, y: 1.2, w: 2.1, h: 0.9, fill: { color: "A02030" },
    line: { color: "FFFFFF30", width: 1 }, rectRadius: 0.1,
  });
  s.addText(fb, {
    x: fx, y: 1.2, w: 2.1, h: 0.9, align: "center", valign: "middle",
    fontSize: 11, bold: true, color: C.white, fontFace: "Arial",
  });
  if (i < rzpFlow.length - 1) {
    s.addText("→", {
      x: fx + 2.1, y: 1.2, w: 0.4, h: 0.9, align: "center", valign: "middle",
      fontSize: 20, color: C.white, fontFace: "Arial",
    });
  }
});

// Details
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 2.5, w: 5.8, h: 4, fill: { color: "8B1A25" }, rectRadius: 0.12,
});
s.addText("Technical Details", {
  x: 0.8, y: 2.6, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.white, fontFace: "Arial",
});
const rzpDetails = [
  "🔑  API Key injected at build time via .env",
  "💰  Amount in paise (₹140 = 14000)",
  "🔒  Card data never touches our code (PCI-DSS)",
  "📎  Payment ID stored with order in database",
  "⏳  Loading state prevents double-payments",
  "❌  Failure handler shows error reason",
];
rzpDetails.forEach((d, i) => {
  s.addText(d, {
    x: 0.8, y: 3.2 + i * 0.45, w: 5.2, h: 0.45,
    fontSize: 14, color: C.lightGray, fontFace: "Arial",
  });
});

// Code
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 2.5, w: 5.8, h: 4, fill: { color: "8B1A25" }, rectRadius: 0.12,
});
s.addText("Integration Code", {
  x: 6.9, y: 2.6, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.white, fontFace: "Arial",
});
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.9, y: 3.2, w: 5.2, h: 3, fill: { color: C.codeBg }, rectRadius: 0.08,
});
const rzpCode = [
  "const options = {",
  "  key: process.env.REACT_APP_RAZORPAY_KEY_ID,",
  "  amount: totalPrice * 100, // paise",
  '  currency: "INR",',
  "  handler: async (response) => {",
  "    // Save payment ID with order",
  "    await apiPlaceOrder({",
  "      items, total, paymentMode: 'online',",
  "      razorpayPaymentId: response.razorpay_payment_id",
  "    });",
  "  }",
  "};",
  "new window.Razorpay(options).open();",
];
rzpCode.forEach((c, i) => {
  s.addText(c, {
    x: 7.1, y: 3.3 + i * 0.22, w: 4.8, h: 0.22,
    fontSize: 10, color: "C9D1D9", fontFace: "Courier New",
  });
});

// ======================== SLIDE 9: CATERING MODULE ========================
s = pptx.addSlide();
s.background = { fill: C.dark };
slideNum(s, 9, TOTAL);

s.addText("👨‍🍳  Catering Admin Module", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});

// Menu CRUD
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.2, w: 5.8, h: 4.5, fill: { color: C.cardBg }, rectRadius: 0.12,
});
s.addText("Menu Management (CRUD)", {
  x: 0.8, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.gold, fontFace: "Arial",
});
const crudItems = [
  "➕  Create: Add new item via API",
  "📖  Read: Fetch all items from database",
  "✏️  Update: Edit item details via API",
  "🗑️  Delete: Remove item from database",
  "🔄  Toggle: Available / Unavailable status",
  "🏷️  Categories: Breakfast, Lunch, Snacks, Beverages",
];
crudItems.forEach((c, i) => {
  s.addText(c, {
    x: 0.8, y: 1.9 + i * 0.5, w: 5.2, h: 0.5,
    fontSize: 14, color: C.lightGray, fontFace: "Arial",
  });
});

// Order Management
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.2, w: 5.8, h: 4.5, fill: { color: C.cardBg }, rectRadius: 0.12,
});
s.addText("Order Management", {
  x: 6.9, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.gold, fontFace: "Arial",
});
const orderFeatures2 = [
  "📦  View all incoming orders",
  "👤  Employee name & order details",
  "💳  Payment mode badge (Paid / COD)",
  "🔄  Status workflow:",
  "      Placed → Preparing → Ready → Delivered",
  "🔔  Notification tracking for employees",
  "📊  Order total with itemized breakdown",
];
orderFeatures2.forEach((f, i) => {
  s.addText(f, {
    x: 6.9, y: 1.9 + i * 0.48, w: 5.2, h: 0.48,
    fontSize: 13, color: C.lightGray, fontFace: "Arial",
  });
});

// Status flow
s.addText("Order Status Lifecycle", {
  x: 0.6, y: 6.0, w: 5, h: 0.4, fontSize: 14, bold: true, color: C.gold, fontFace: "Arial",
});
const statuses = ["Placed", "Preparing", "Ready", "Delivered"];
const statusColors = [C.primary, C.gold, "74B9FF", C.green];
statuses.forEach((st, i) => {
  const sx = 0.5 + i * 3;
  s.addShape(pptx.ShapeType.roundRect, {
    x: sx, y: 6.4, w: 2.4, h: 0.4, fill: { color: C.dark },
    line: { color: statusColors[i], width: 1.5 }, rectRadius: 0.2,
  });
  s.addText(st, {
    x: sx, y: 6.4, w: 2.4, h: 0.4, align: "center",
    fontSize: 12, bold: true, color: statusColors[i], fontFace: "Arial",
  });
  if (i < statuses.length - 1) {
    s.addText("→", {
      x: sx + 2.4, y: 6.4, w: 0.6, h: 0.4, align: "center",
      fontSize: 14, color: C.gray, fontFace: "Arial",
    });
  }
});

// ======================== SLIDE 10: ORDER DISPLAY ========================
s = pptx.addSlide();
s.background = { fill: C.darkBg };
slideNum(s, 10, TOTAL);

s.addText("📺  Order Display Screen", {
  x: 0.6, y: 0.4, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});
s.addText("Public-facing display for office cafeteria / TV screen", {
  x: 0.6, y: 1.1, w: 10, h: 0.4, fontSize: 16, color: C.lightGray, fontFace: "Arial",
});

s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.8, w: 12, h: 4.5, fill: { color: C.cardBg }, rectRadius: 0.12,
});

const displayFeatures = [
  "📦  Shows all orders for the current day",
  "🔄  Auto-refreshes to show latest order statuses",
  "🎨  Color-coded status badges for quick visual scanning",
  "👤  Employee name, order items, and total displayed",
  "💳  Payment status indicator (Paid / COD)",
  "📱  Route: /display — can be opened on any screen",
  "🖥️  Designed for large display / cafeteria monitor",
  "🔓  No login required — public-facing page",
];
displayFeatures.forEach((f, i) => {
  s.addText(f, {
    x: 1.0, y: 2.1 + i * 0.48, w: 11, h: 0.48,
    fontSize: 15, color: C.lightGray, fontFace: "Arial",
  });
});

// ======================== SLIDE 11: UI/UX ========================
s = pptx.addSlide();
s.background = { fill: C.dark };
slideNum(s, 11, TOTAL);

s.addText("🎨  UI/UX Design & Styling", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});

// CSS Design System
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.2, w: 5.8, h: 5.3, fill: { color: C.cardBg }, rectRadius: 0.12,
});
s.addText("CSS Design System", {
  x: 0.8, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.gold, fontFace: "Arial",
});
const cssFeatures = [
  "🎯  CSS Variables for consistent theming",
  "📐  CSS Grid — auto-responsive menu layout",
  "📱  Mobile-first responsive design",
  "✨  Smooth hover effects & transitions",
  "🎨  Zero external CSS libraries",
];
cssFeatures.forEach((f, i) => {
  s.addText(f, {
    x: 0.8, y: 1.9 + i * 0.45, w: 5.2, h: 0.45,
    fontSize: 13, color: C.lightGray, fontFace: "Arial",
  });
});

s.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 4.2, w: 5.2, h: 1.5, fill: { color: C.codeBg }, rectRadius: 0.08,
});
const cssCode = [
  `:root {`,
  `  --primary: #e23744;`,
  `  --shadow-md: 0 4px 20px rgba(0,0,0,0.12);`,
  `  --radius: 12px;`,
  `}`,
];
cssCode.forEach((c, i) => {
  s.addText(c, {
    x: 1.0, y: 4.3 + i * 0.27, w: 4.8, h: 0.27,
    fontSize: 12, color: "C9D1D9", fontFace: "Courier New",
  });
});

// UX Highlights
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.2, w: 5.8, h: 5.3, fill: { color: C.cardBg }, rectRadius: 0.12,
});
s.addText("UX Highlights", {
  x: 6.9, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.gold, fontFace: "Arial",
});
const uxItems = [
  "✅  Real-time password strength indicator",
  "🛒  Floating cart bar — always accessible",
  "🔍  Instant search — no delay",
  "🏷️  Dynamic category filtering",
  "⚡  Loading states on API calls",
  "📱  Fully responsive layout",
  "🔐  Auto-logout on tab close",
  "⏳  Payment loading (prevents double-submit)",
  "🔔  Order status notifications",
];
uxItems.forEach((u, i) => {
  s.addText(u, {
    x: 6.9, y: 1.9 + i * 0.42, w: 5.2, h: 0.42,
    fontSize: 13, color: C.lightGray, fontFace: "Arial",
  });
});

// ======================== SLIDE 12: DEPLOYMENT ========================
s = pptx.addSlide();
s.background = { fill: "302B63" };
slideNum(s, 12, TOTAL);

s.addText("🚀  Deployment Architecture", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.white, fontFace: "Arial",
});

// Deployment flow
const deployFlow = ["GitHub\nRepository", "Render\nBuild", "React Build\n+ Java JAR", "Spring Boot\nServes App", "PostgreSQL\nCloud DB"];
deployFlow.forEach((df, i) => {
  const dx = 0.3 + i * 2.5;
  s.addShape(pptx.ShapeType.roundRect, {
    x: dx, y: 1.2, w: 2.1, h: 0.9, fill: { color: "1E1B4B" },
    line: { color: "4C4694", width: 1 }, rectRadius: 0.1,
  });
  s.addText(df, {
    x: dx, y: 1.2, w: 2.1, h: 0.9, align: "center", valign: "middle",
    fontSize: 11, bold: true, color: C.white, fontFace: "Arial",
  });
  if (i < deployFlow.length - 1) {
    s.addText("→", {
      x: dx + 2.1, y: 1.2, w: 0.4, h: 0.9, align: "center", valign: "middle",
      fontSize: 18, color: C.gold, fontFace: "Arial",
    });
  }
});

// Details
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 2.5, w: 5.8, h: 4, fill: { color: "1E1B4B" }, rectRadius: 0.12,
});
s.addText("Render Web Service", {
  x: 0.8, y: 2.6, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.gold, fontFace: "Arial",
});
const renderFeatures = [
  "🔗  Auto-deploy on Git push to main",
  "📦  Build: mvn clean package + npm run build",
  "▶️  Start: java -jar servebox.jar",
  "🌐  Custom domain support",
  "🔒  HTTPS by default (SSL)",
  "⚙️  Environment variables for secrets",
];
renderFeatures.forEach((f, i) => {
  s.addText(f, {
    x: 0.8, y: 3.2 + i * 0.45, w: 5.2, h: 0.45,
    fontSize: 13, color: C.lightGray, fontFace: "Arial",
  });
});

s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 2.5, w: 5.8, h: 4, fill: { color: "1E1B4B" }, rectRadius: 0.12,
});
s.addText("Render PostgreSQL", {
  x: 6.9, y: 2.6, w: 5, h: 0.5, fontSize: 20, bold: true, color: C.green, fontFace: "Arial",
});
const dbFeatures = [
  "🗄️  Managed PostgreSQL database",
  "🔐  SSL connections enforced",
  "📊  Auto-backups included",
  "🌍  Same region as web service",
  "📈  Scalable as usage grows",
  "🔗  Connected via DATABASE_URL env var",
];
dbFeatures.forEach((f, i) => {
  s.addText(f, {
    x: 6.9, y: 3.2 + i * 0.45, w: 5.2, h: 0.45,
    fontSize: 13, color: C.lightGray, fontFace: "Arial",
  });
});

// ======================== SLIDE 13: PROJECT STRUCTURE ========================
s = pptx.addSlide();
s.background = { fill: C.darkBg };
slideNum(s, 13, TOTAL);

s.addText("📁  Project Structure", {
  x: 0.6, y: 0.4, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});

// Frontend
s.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.3, w: 5.8, h: 5.5, fill: { color: C.cardBg }, rectRadius: 0.12,
});
s.addText("⚛️  Frontend (React)", {
  x: 0.8, y: 1.4, w: 5, h: 0.5, fontSize: 18, bold: true, color: C.primary, fontFace: "Arial",
});
const frontFiles = [
  "src/",
  "├── App.js               Main router",
  "├── App.css              Global styles",
  "├── components/",
  "│   ├── LoginPage.js     Authentication",
  "│   ├── SignUpPage.js     Registration",
  "│   ├── EmployeeDashboard.js  Menu + Cart",
  "│   ├── CartPage.js      Checkout + Razorpay",
  "│   ├── OrderConfirmation.js  Success page",
  "│   ├── CateringDashboard.js  Admin panel",
  "│   ├── OrderDisplay.js  Public display",
  "│   └── Navbar.js        Navigation bar",
  "└── helpers/",
  "    ├── api.js           API client (fetch)",
  "    └── storage.js       Utility functions",
];
frontFiles.forEach((f, i) => {
  s.addText(f, {
    x: 0.8, y: 2.0 + i * 0.3, w: 5.2, h: 0.3,
    fontSize: 10, color: "C9D1D9", fontFace: "Courier New",
  });
});

// Backend
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.3, w: 5.8, h: 5.5, fill: { color: C.cardBg }, rectRadius: 0.12,
});
s.addText("☕  Backend (Java Spring Boot)", {
  x: 6.9, y: 1.4, w: 5, h: 0.5, fontSize: 18, bold: true, color: C.green, fontFace: "Arial",
});
const backFiles = [
  "src/main/java/com/servebox/",
  "├── ServeBoxApplication.java   Main class",
  "├── config/",
  "│   └── SecurityConfig.java    Spring Security",
  "├── controller/",
  "│   ├── AuthController.java    Login & Signup",
  "│   ├── MenuController.java    Menu CRUD",
  "│   └── OrderController.java   Order mgmt",
  "├── model/",
  "│   ├── User.java              JPA Entity",
  "│   ├── MenuItem.java          JPA Entity",
  "│   └── Order.java             JPA Entity",
  "├── repository/                JPA Repos",
  "└── service/                   Business logic",
];
backFiles.forEach((f, i) => {
  s.addText(f, {
    x: 6.9, y: 2.0 + i * 0.3, w: 5.2, h: 0.3,
    fontSize: 10, color: "C9D1D9", fontFace: "Courier New",
  });
});

// Line count
s.addShape(pptx.ShapeType.roundRect, {
  x: 6.9, y: 5.6, w: 5.2, h: 1, fill: { color: C.dark },
  line: { color: C.gold, width: 1 }, rectRadius: 0.08,
});
s.addText("Total: 8 React components  •  3 REST controllers  •  4 database tables", {
  x: 6.9, y: 5.6, w: 5.2, h: 1, align: "center", valign: "middle",
  fontSize: 12, bold: true, color: C.gold, fontFace: "Arial",
});

// ======================== SLIDE 14: FUTURE SCOPE ========================
s = pptx.addSlide();
s.background = { fill: C.dark };
slideNum(s, 14, TOTAL);

s.addText("🔮  Future Enhancements", {
  x: 0.6, y: 0.4, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: C.primary, fontFace: "Arial",
});

const futureItems = [
  { icon: "📧", title: "Email / SMS Notifications", desc: "Notify employees when order status changes" },
  { icon: "📊", title: "Analytics Dashboard", desc: "Order trends, popular items, revenue tracking" },
  { icon: "🕐", title: "Pre-Order Scheduling", desc: "Order for future dates with scheduled delivery" },
  { icon: "⭐", title: "Rating & Feedback", desc: "Rate food items and provide feedback" },
  { icon: "👥", title: "Multi-tenant Support", desc: "Multiple offices/companies on one platform" },
  { icon: "📱", title: "Mobile App (React Native)", desc: "Native mobile app for iOS and Android" },
  { icon: "🤖", title: "Smart Recommendations", desc: "ML-based food suggestions based on order history" },
  { icon: "📋", title: "Inventory Management", desc: "Track ingredients and stock levels" },
];
futureItems.forEach((item, i) => {
  const col = i < 4 ? 0 : 1;
  const row = i % 4;
  const bx = 0.5 + col * 6.2;
  const by = 1.4 + row * 1.3;

  s.addShape(pptx.ShapeType.roundRect, {
    x: bx, y: by, w: 5.8, h: 1.1, fill: { color: C.cardBg },
    line: { color: "30363D", width: 1 }, rectRadius: 0.1,
  });
  s.addText(item.icon, {
    x: bx + 0.2, y: by + 0.1, w: 0.6, h: 0.9, valign: "middle", fontSize: 26,
  });
  s.addText(item.title, {
    x: bx + 0.9, y: by + 0.15, w: 4.5, h: 0.4,
    fontSize: 15, bold: true, color: C.white, fontFace: "Arial",
  });
  s.addText(item.desc, {
    x: bx + 0.9, y: by + 0.55, w: 4.5, h: 0.4,
    fontSize: 12, color: C.gray, fontFace: "Arial",
  });
});

// ======================== SLIDE 15: THANK YOU ========================
s = pptx.addSlide();
s.background = { fill: C.darkBg };
slideNum(s, 15, TOTAL);

s.addText("🙏", { x: 0, y: 1.2, w: "100%", h: 1, align: "center", fontSize: 60 });
s.addText("Thank You!", {
  x: 0, y: 2.2, w: "100%", h: 1, align: "center",
  fontSize: 52, bold: true, color: C.white, fontFace: "Arial",
});
s.addText("ServeBox — Making Office Food Simple", {
  x: 0, y: 3.2, w: "100%", h: 0.6, align: "center",
  fontSize: 22, color: C.gold, fontFace: "Arial",
});

// Summary boxes
const summaryItems = [
  { label: "Frontend", value: "React 19 SPA" },
  { label: "Backend", value: "Java Spring Boot" },
  { label: "Database", value: "PostgreSQL" },
  { label: "Auth", value: "Spring Security + JWT" },
  { label: "Payments", value: "Razorpay" },
  { label: "Hosted", value: "Render Cloud" },
];
summaryItems.forEach((si, i) => {
  const sx = 0.8 + i * 2;
  s.addShape(pptx.ShapeType.roundRect, {
    x: sx, y: 4.3, w: 1.8, h: 1.2, fill: { color: C.cardBg },
    line: { color: C.primary, width: 1 }, rectRadius: 0.1,
  });
  s.addText(si.label, {
    x: sx, y: 4.4, w: 1.8, h: 0.4, align: "center",
    fontSize: 11, color: C.gray, fontFace: "Arial",
  });
  s.addText(si.value, {
    x: sx, y: 4.8, w: 1.8, h: 0.5, align: "center",
    fontSize: 12, bold: true, color: C.white, fontFace: "Arial",
  });
});

s.addText("Questions?", {
  x: 0, y: 6.0, w: "100%", h: 0.5, align: "center",
  fontSize: 20, color: C.lightGray, fontFace: "Arial",
});

// Generate
pptx.writeFile({ fileName: "ServeBox-Presentation.pptx" }).then(() => {
  console.log("✅ ServeBox-Presentation.pptx generated successfully!");
}).catch(err => {
  console.error("Error:", err);
});
