const pptxgen = require("pptxgenjs");
const fs = require("fs");

const pptx = new pptxgen();

// Theme
pptx.layout = "LAYOUT_WIDE";
pptx.author = "ServeBox Team";
pptx.company = "ServeBox";
pptx.subject = "Office Food Ordering - POC";
pptx.title = "ServeBox POC Presentation";

const COLORS = {
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
  black: "000000",
  codeBg: "0D1117",
  cardBg: "2D3436",
};

function addSlideNumber(slide, num, total) {
  slide.addText(`${num} / ${total}`, {
    x: 0.3, y: 6.9, w: 2, h: 0.3,
    fontSize: 10, color: COLORS.gray, fontFace: "Arial",
  });
}

const TOTAL_SLIDES = 15;

// ===================== SLIDE 1: TITLE =====================
let slide = pptx.addSlide();
slide.background = { fill: COLORS.darkBg };
addSlideNumber(slide, 1, TOTAL_SLIDES);

slide.addText("🍽️", { x: 0, y: 0.8, w: "100%", h: 1, align: "center", fontSize: 60 });
slide.addText("ServeBox", {
  x: 0, y: 1.8, w: "100%", h: 1, align: "center",
  fontSize: 54, bold: true, color: COLORS.white, fontFace: "Arial",
});
slide.addText("Office Food Ordering System", {
  x: 0, y: 2.7, w: "100%", h: 0.6, align: "center",
  fontSize: 24, color: COLORS.gold, fontFace: "Arial",
});
slide.addText("Proof of Concept — Technical Presentation", {
  x: 0, y: 3.3, w: "100%", h: 0.5, align: "center",
  fontSize: 16, color: COLORS.gray, fontFace: "Arial",
});

// Tags
const tags = [
  { text: "  React 19  ", color: COLORS.primary },
  { text: "  SPA Architecture  ", color: "74B9FF" },
  { text: "  Razorpay Integration  ", color: COLORS.green },
  { text: "  Deployed on Netlify  ", color: COLORS.gold },
];
let tagX = 2.8;
tags.forEach((tag) => {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: tagX, y: 4.2, w: 2, h: 0.4,
    fill: { color: COLORS.dark }, line: { color: tag.color, width: 1.5 },
    rectRadius: 0.2,
  });
  slide.addText(tag.text, {
    x: tagX, y: 4.2, w: 2, h: 0.4, align: "center",
    fontSize: 11, bold: true, color: tag.color, fontFace: "Arial",
  });
  tagX += 2.1;
});

slide.addText("🌐  https://servebox.netlify.app", {
  x: 0, y: 5.2, w: "100%", h: 0.4, align: "center",
  fontSize: 14, color: COLORS.gray, fontFace: "Arial",
});

// ===================== SLIDE 2: PROBLEM STATEMENT =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.dark };
addSlideNumber(slide, 2, TOTAL_SLIDES);

slide.addText("📌  Problem Statement", {
  x: 0.6, y: 0.4, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.primary, fontFace: "Arial",
});
slide.addText(
  "Managing office food orders is chaotic — paper lists, WhatsApp groups, and manual tracking lead to errors, delays, and payment confusion.",
  { x: 0.6, y: 1.2, w: 11, h: 0.8, fontSize: 18, color: COLORS.lightGray, fontFace: "Arial" }
);

// Pain Points
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 2.3, w: 5.7, h: 4.2, fill: { color: "16213E" }, rectRadius: 0.15,
});
slide.addText("❌  Current Pain Points", {
  x: 0.8, y: 2.4, w: 5, h: 0.6, fontSize: 20, bold: true, color: COLORS.danger, fontFace: "Arial",
});
const painPoints = [
  "Manual order collection via chat/paper",
  "No centralized menu management",
  "Cash handling & payment tracking issues",
  "No order history or audit trail",
  "Catering team has no dashboard",
];
painPoints.forEach((p, i) => {
  slide.addText(`•   ${p}`, {
    x: 0.8, y: 3.1 + i * 0.55, w: 5.2, h: 0.5,
    fontSize: 15, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// Solution
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.5, y: 2.3, w: 5.7, h: 4.2, fill: { color: "16213E" }, rectRadius: 0.15,
});
slide.addText("✅  ServeBox Solution", {
  x: 6.8, y: 2.4, w: 5, h: 0.6, fontSize: 20, bold: true, color: COLORS.green, fontFace: "Arial",
});
const solutions = [
  "Digital ordering with live menu",
  "Role-based access (Employee + Catering)",
  "Integrated Razorpay payments",
  "Complete order history & tracking",
  "Full admin dashboard for catering",
];
solutions.forEach((s, i) => {
  slide.addText(`•   ${s}`, {
    x: 6.8, y: 3.1 + i * 0.55, w: 5.2, h: 0.5,
    fontSize: 15, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// ===================== SLIDE 3: TECH STACK =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.darkBg };
addSlideNumber(slide, 3, TOTAL_SLIDES);

slide.addText("🛠️  Technology Stack", {
  x: 0.6, y: 0.4, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.primary, fontFace: "Arial",
});

const techRows = [
  ["Layer", "Technology", "Purpose"],
  ["⚛️ Frontend Framework", "React 19", "Component-based Single Page Application"],
  ["🧭 Routing", "React Router v7", "Client-side navigation without page reloads"],
  ["🧠 State Management", "useState + useMemo", "Lightweight React Hooks (no Redux overhead)"],
  ["💾 Data Persistence", "localStorage + sessionStorage", "Browser-native storage (Web Storage API)"],
  ["💳 Payments", "Razorpay Checkout.js", "PCI-DSS compliant payment gateway"],
  ["🎨 Styling", "Pure CSS + CSS Variables", "Zero-dependency theming with design tokens"],
  ["🚀 Deployment", "Netlify (CDN)", "Global static hosting with instant deploys"],
];

const tableOpts = {
  x: 0.5, y: 1.4, w: 12, h: 5,
  fontSize: 14,
  fontFace: "Arial",
  color: COLORS.lightGray,
  border: { type: "solid", pt: 0.5, color: "30363D" },
  colW: [3, 3.5, 5.5],
  rowH: [0.5, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55, 0.55],
  autoPage: false,
};

const tableRows = techRows.map((row, rIdx) =>
  row.map((cell, cIdx) => ({
    text: cell,
    options: {
      bold: rIdx === 0 || cIdx === 1,
      color: rIdx === 0 ? COLORS.primary : COLORS.lightGray,
      fill: { color: rIdx === 0 ? "16213E" : (rIdx % 2 === 0 ? "1A1A2E" : "16213E") },
      fontSize: rIdx === 0 ? 13 : 14,
    },
  }))
);
slide.addTable(tableRows, tableOpts);

// ===================== SLIDE 4: ARCHITECTURE =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.dark };
addSlideNumber(slide, 4, TOTAL_SLIDES);

slide.addText("🏗️  Application Architecture", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.primary, fontFace: "Arial",
});
slide.addText("Single Page Application (SPA) with client-side routing", {
  x: 0.6, y: 1.0, w: 10, h: 0.4, fontSize: 16, color: COLORS.lightGray, fontFace: "Arial",
});

// Architecture boxes
const archBoxes = [
  { icon: "🔐", title: "Auth Layer", lines: ["LoginPage / SignUpPage", "Password validation (5 regex rules)", "Session management"] },
  { icon: "👨‍💼", title: "Employee Module", lines: ["EmployeeDashboard", "CartPage + Razorpay", "OrderConfirmation"] },
  { icon: "👨‍🍳", title: "Catering Module", lines: ["CateringDashboard", "Menu CRUD Operations", "Order Management"] },
];
archBoxes.forEach((box, i) => {
  const bx = 0.5 + i * 4.1;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: bx, y: 1.6, w: 3.8, h: 2.4, fill: { color: "16213E" },
    line: { color: "30363D", width: 1 }, rectRadius: 0.12,
  });
  slide.addText(box.icon, { x: bx, y: 1.7, w: 3.8, h: 0.6, align: "center", fontSize: 28 });
  slide.addText(box.title, {
    x: bx, y: 2.2, w: 3.8, h: 0.4, align: "center",
    fontSize: 16, bold: true, color: COLORS.white, fontFace: "Arial",
  });
  box.lines.forEach((line, li) => {
    slide.addText(line, {
      x: bx + 0.3, y: 2.7 + li * 0.35, w: 3.2, h: 0.35, align: "center",
      fontSize: 12, color: COLORS.gray, fontFace: "Arial",
    });
  });
});

// Route Map
slide.addText("Route Map", {
  x: 0.6, y: 4.2, w: 5, h: 0.4, fontSize: 16, bold: true, color: COLORS.gold, fontFace: "Arial",
});
const routes = [
  "/              →  LoginPage            // Authentication",
  "/signup        →  SignUpPage           // New user registration",
  "/employee      →  EmployeeDashboard    // Browse menu, add to cart",
  "/employee/cart →  CartPage             // Cart + Razorpay payment",
  "/employee/order-success →  OrderConfirmation",
  "/catering      →  CateringDashboard    // Admin: menu + orders",
  "/*             →  Redirect to /        // Catch-all",
];
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 4.6, w: 12, h: 2.6, fill: { color: COLORS.codeBg },
  line: { color: "30363D", width: 1 }, rectRadius: 0.1,
});
routes.forEach((r, i) => {
  slide.addText(r, {
    x: 0.8, y: 4.7 + i * 0.33, w: 11.5, h: 0.33,
    fontSize: 12, color: "C9D1D9", fontFace: "Courier New",
  });
});

// ===================== SLIDE 5: DATA LAYER =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.darkBg };
addSlideNumber(slide, 5, TOTAL_SLIDES);

slide.addText("💾  Data Layer (storage.js)", {
  x: 0.6, y: 0.4, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.primary, fontFace: "Arial",
});
slide.addText("No backend server — Web Storage API acts as the data layer", {
  x: 0.6, y: 1.1, w: 10, h: 0.4, fontSize: 16, color: COLORS.lightGray, fontFace: "Arial",
});

const dataRows = [
  ["Storage Key", "Type", "Content", "Persists?"],
  ["office-food-users", "localStorage", "Registered accounts (name, password, role)", "✅ Permanent"],
  ["office-food-menu", "localStorage", "Menu items (seeded with 10 defaults)", "✅ Permanent"],
  ["office-food-orders", "localStorage", "All placed orders with payment details", "✅ Permanent"],
  ["office-food-session", "sessionStorage", "Current login (name, role, timestamp)", "❌ Tab close"],
];
const dataTableRows = dataRows.map((row, rIdx) =>
  row.map((cell) => ({
    text: cell,
    options: {
      bold: rIdx === 0,
      color: rIdx === 0 ? COLORS.primary : COLORS.lightGray,
      fill: { color: rIdx === 0 ? "16213E" : (rIdx % 2 === 0 ? "1A1A2E" : "16213E") },
      fontSize: 13,
    },
  }))
);
slide.addTable(dataTableRows, {
  x: 0.5, y: 1.7, w: 12, h: 2.8,
  fontSize: 13, fontFace: "Arial", color: COLORS.lightGray,
  border: { type: "solid", pt: 0.5, color: "30363D" },
  colW: [2.8, 2.2, 4.5, 2.5],
  autoPage: false,
});

// Highlight box
slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 4.8, w: 0.08, h: 1.2, fill: { color: COLORS.primary },
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.58, y: 4.8, w: 11.9, h: 1.2, fill: { color: "2A1520" }, rectRadius: 0.05,
});
slide.addText(
  "💡 Design Decision: sessionStorage for auth = auto-logout on tab close (security). localStorage for data = survives browser restarts. In production, this would be replaced with REST API + Database.",
  { x: 0.8, y: 4.9, w: 11.5, h: 1, fontSize: 14, color: COLORS.lightGray, fontFace: "Arial" }
);

// ===================== SLIDE 6: AUTH SYSTEM =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.dark };
addSlideNumber(slide, 6, TOTAL_SLIDES);

slide.addText("🔐  Authentication System", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.primary, fontFace: "Arial",
});

// Sign Up column
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.2, w: 5.8, h: 5.5, fill: { color: "16213E" }, rectRadius: 0.12,
});
slide.addText("Sign Up Flow", {
  x: 0.8, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.purple, fontFace: "Arial",
});
const signupSteps = [
  "1.  User enters name, password, role",
  "2.  Real-time password validation (useMemo)",
  "3.  Confirm password match check",
  "4.  Duplicate user detection",
  "5.  Save to localStorage → redirect to login",
];
signupSteps.forEach((s, i) => {
  slide.addText(s, {
    x: 0.8, y: 1.9 + i * 0.4, w: 5.2, h: 0.4,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

slide.addText("Password Rules (Regex)", {
  x: 0.8, y: 4.1, w: 5, h: 0.4, fontSize: 16, bold: true, color: COLORS.primary, fontFace: "Arial",
});
const pwRules = [
  "p.length >= 8     → Min 8 characters",
  "/[A-Z]/           → Uppercase letter",
  "/[a-z]/           → Lowercase letter",
  "/[0-9]/           → Digit",
  "/[^A-Za-z0-9]/    → Special character",
];
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 4.5, w: 5.2, h: 2, fill: { color: COLORS.codeBg }, rectRadius: 0.08,
});
pwRules.forEach((r, i) => {
  slide.addText(r, {
    x: 1.0, y: 4.6 + i * 0.37, w: 4.8, h: 0.37,
    fontSize: 12, color: "C9D1D9", fontFace: "Courier New",
  });
});

// Login column
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.2, w: 5.8, h: 5.5, fill: { color: "16213E" }, rectRadius: 0.12,
});
slide.addText("Login Flow", {
  x: 6.9, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.green, fontFace: "Arial",
});
const loginSteps = [
  "1.  Validate password format (same 5 rules)",
  "2.  findUser() — lookup by name + role",
  "3.  Compare password",
  "4.  Create session in sessionStorage",
  "5.  Navigate to role-based dashboard",
];
loginSteps.forEach((s, i) => {
  slide.addText(s, {
    x: 6.9, y: 1.9 + i * 0.4, w: 5.2, h: 0.4,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

slide.addText("Session Guard", {
  x: 6.9, y: 4.1, w: 5, h: 0.4, fontSize: 16, bold: true, color: COLORS.gold, fontFace: "Arial",
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.9, y: 4.5, w: 5.2, h: 2, fill: { color: COLORS.codeBg }, rectRadius: 0.08,
});
const guardCode = [
  "// Every protected component:",
  "const session = sessionStorage.getItem(",
  '  \"office-food-session\"',
  ");",
  "if (!session) {",
  '  navigate(\"/\"); // Kick to login',
  "}",
];
guardCode.forEach((c, i) => {
  slide.addText(c, {
    x: 7.1, y: 4.6 + i * 0.27, w: 4.8, h: 0.27,
    fontSize: 11, color: "C9D1D9", fontFace: "Courier New",
  });
});

// ===================== SLIDE 7: EMPLOYEE MODULE =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.darkBg };
addSlideNumber(slide, 7, TOTAL_SLIDES);

slide.addText("👨‍💼  Employee Module", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.primary, fontFace: "Arial",
});

// Menu Dashboard
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.2, w: 5.8, h: 3.5, fill: { color: "16213E" }, rectRadius: 0.12,
});
slide.addText("Menu Dashboard", {
  x: 0.8, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.gold, fontFace: "Arial",
});
const menuFeatures = [
  "🔍  Live search — case-insensitive substring match",
  "🏷️  Dynamic category pills (auto-generated from data)",
  "📱  CSS Grid with auto-fill + minmax() — responsive",
  "🛒  Add to cart with live quantity badges",
  "📌  Floating cart bar (position: fixed)",
];
menuFeatures.forEach((f, i) => {
  slide.addText(f, {
    x: 0.8, y: 1.9 + i * 0.45, w: 5.2, h: 0.45,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// Cart System
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.2, w: 5.8, h: 3.5, fill: { color: "16213E" }, rectRadius: 0.12,
});
slide.addText("Cart System", {
  x: 6.9, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.gold, fontFace: "Arial",
});
const cartFeatures = [
  "➕  Increment / decrement with auto-remove at 0",
  "📊  Live total calculation using Array.reduce()",
  "🔄  State lifted to App.js — shared across routes",
  "💳  Two payment options: Razorpay / COD",
  "📝  Order summary with itemized breakdown",
];
cartFeatures.forEach((f, i) => {
  slide.addText(f, {
    x: 6.9, y: 1.9 + i * 0.45, w: 5.2, h: 0.45,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// Highlight
slide.addShape(pptx.ShapeType.rect, {
  x: 0.5, y: 5.0, w: 0.08, h: 1, fill: { color: COLORS.primary },
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.58, y: 5.0, w: 11.9, h: 1, fill: { color: "2A1520" }, rectRadius: 0.05,
});
slide.addText(
  '⚛️ React Pattern — "Lifting State Up": Cart state lives in App.js and is passed via props to EmployeeDashboard, CartPage, and Navbar. This ensures all components share the same cart data without external state libraries.',
  { x: 0.8, y: 5.1, w: 11.5, h: 0.8, fontSize: 13, color: COLORS.lightGray, fontFace: "Arial" }
);

// ===================== SLIDE 8: RAZORPAY =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.primaryDark };
addSlideNumber(slide, 8, TOTAL_SLIDES);

slide.addText("💳  Razorpay Payment Integration", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.white, fontFace: "Arial",
});

// Flow diagram
const flowBoxes = [
  "User clicks\n\"Pay with Razorpay\"",
  "Validate API Key\n& SDK loaded",
  "Razorpay modal\nopens (iframe)",
  "User enters\npayment details",
  "✅ Success\n❌ Fail → Callback",
];
flowBoxes.forEach((fb, i) => {
  const fx = 0.3 + i * 2.5;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: fx, y: 1.2, w: 2.1, h: 0.9, fill: { color: "A02030" },
    line: { color: "FFFFFF30", width: 1 }, rectRadius: 0.1,
  });
  slide.addText(fb, {
    x: fx, y: 1.2, w: 2.1, h: 0.9, align: "center", valign: "middle",
    fontSize: 11, bold: true, color: COLORS.white, fontFace: "Arial",
  });
  if (i < flowBoxes.length - 1) {
    slide.addText("→", {
      x: fx + 2.1, y: 1.2, w: 0.4, h: 0.9, align: "center", valign: "middle",
      fontSize: 20, color: COLORS.white, fontFace: "Arial",
    });
  }
});

// Technical Details
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 2.5, w: 5.8, h: 4, fill: { color: "8B1A25" }, rectRadius: 0.12,
});
slide.addText("Technical Details", {
  x: 0.8, y: 2.6, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.white, fontFace: "Arial",
});
const rzpDetails = [
  "🔑  API Key injected at build time via .env",
  "💰  Amount in paise (₹140 = 14000)",
  "🔒  Card data never touches our code (PCI-DSS)",
  "📎  Payment ID captured & stored with order",
  "⏳  Loading state prevents double-payments",
  "❌  Failure handler shows error reason + code",
];
rzpDetails.forEach((d, i) => {
  slide.addText(d, {
    x: 0.8, y: 3.2 + i * 0.45, w: 5.2, h: 0.45,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// Code
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 2.5, w: 5.8, h: 4, fill: { color: "8B1A25" }, rectRadius: 0.12,
});
slide.addText("Code Architecture", {
  x: 6.9, y: 2.6, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.white, fontFace: "Arial",
});
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.9, y: 3.2, w: 5.2, h: 3, fill: { color: COLORS.codeBg }, rectRadius: 0.08,
});
const rzpCode = [
  "const options = {",
  "  key: process.env.REACT_APP_RAZORPAY_KEY_ID,",
  "  amount: totalPrice * 100,",
  '  currency: "INR",',
  "  handler: (response) => {",
  "    // response.razorpay_payment_id",
  "    finishOrder(order);",
  "  },",
  '  "payment.failed": (resp) => {',
  "    alert(resp.error.description);",
  "  }",
  "};",
  "new window.Razorpay(options).open();",
];
rzpCode.forEach((c, i) => {
  slide.addText(c, {
    x: 7.1, y: 3.3 + i * 0.22, w: 4.8, h: 0.22,
    fontSize: 10, color: "C9D1D9", fontFace: "Courier New",
  });
});

// ===================== SLIDE 9: CATERING MODULE =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.dark };
addSlideNumber(slide, 9, TOTAL_SLIDES);

slide.addText("👨‍🍳  Catering Admin Module", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.primary, fontFace: "Arial",
});

// Menu CRUD
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.2, w: 5.8, h: 4.5, fill: { color: "16213E" }, rectRadius: 0.12,
});
slide.addText("Menu Management (CRUD)", {
  x: 0.8, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.gold, fontFace: "Arial",
});
const crudItems = [
  "➕  Create: Modal form → auto-generate ID",
  "📖  Read: Table view with category tags & status",
  "✏️  Update: Edit in modal → .map() replace",
  "🗑️  Delete: Confirm dialog → .filter() remove",
  "🔄  Toggle: Available / Unavailable status",
];
crudItems.forEach((c, i) => {
  slide.addText(c, {
    x: 0.8, y: 1.9 + i * 0.5, w: 5.2, h: 0.5,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// Categories
const cats = ["Breakfast", "Lunch", "Snacks", "Beverages"];
cats.forEach((cat, i) => {
  slide.addShape(pptx.ShapeType.roundRect, {
    x: 0.8 + i * 1.3, y: 4.6, w: 1.2, h: 0.35, fill: { color: "1B3A2D" },
    line: { color: COLORS.green, width: 1 }, rectRadius: 0.17,
  });
  slide.addText(cat, {
    x: 0.8 + i * 1.3, y: 4.6, w: 1.2, h: 0.35, align: "center",
    fontSize: 11, bold: true, color: COLORS.green, fontFace: "Arial",
  });
});

// Order Dashboard
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.2, w: 5.8, h: 4.5, fill: { color: "16213E" }, rectRadius: 0.12,
});
slide.addText("Order Dashboard", {
  x: 6.9, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.gold, fontFace: "Arial",
});
const orderFeatures = [
  "📦  All orders in card layout",
  "👤  Employee name & order details",
  "💳  Payment mode badge (Paid / COD)",
  "🕐  Order timestamp",
  "🔄  Manual refresh to load new orders",
  "📊  Total amount per order",
];
orderFeatures.forEach((f, i) => {
  slide.addText(f, {
    x: 6.9, y: 1.9 + i * 0.5, w: 5.2, h: 0.5,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// ===================== SLIDE 10: UI/UX =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.darkBg };
addSlideNumber(slide, 10, TOTAL_SLIDES);

slide.addText("🎨  UI/UX & Styling Architecture", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.primary, fontFace: "Arial",
});

// CSS Design System
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.2, w: 5.8, h: 5.3, fill: { color: "16213E" }, rectRadius: 0.12,
});
slide.addText("CSS Design System", {
  x: 0.8, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.gold, fontFace: "Arial",
});
const cssFeatures = [
  "🎯  CSS Variables — Change --primary once, theme updates",
  "📐  CSS Grid — Auto-responsive menu cards",
  "📱  Media Queries — Mobile-first at 900px breakpoint",
  "✨  Transitions — Hover effects, smooth interactions",
  "🎨  Zero Dependencies — No Tailwind / Bootstrap",
];
cssFeatures.forEach((f, i) => {
  slide.addText(f, {
    x: 0.8, y: 1.9 + i * 0.45, w: 5.2, h: 0.45,
    fontSize: 13, color: COLORS.lightGray, fontFace: "Arial",
  });
});

slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.8, y: 4.2, w: 5.2, h: 1.5, fill: { color: COLORS.codeBg }, rectRadius: 0.08,
});
const cssCode = [
  ":root {",
  "  --primary: #e23744;",
  "  --shadow-md: 0 4px 20px rgba(0,0,0,0.12);",
  "  --radius: 12px;",
  "}",
];
cssCode.forEach((c, i) => {
  slide.addText(c, {
    x: 1.0, y: 4.3 + i * 0.27, w: 4.8, h: 0.27,
    fontSize: 12, color: "C9D1D9", fontFace: "Courier New",
  });
});

// UX Highlights
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.2, w: 5.8, h: 5.3, fill: { color: "16213E" }, rectRadius: 0.12,
});
slide.addText("UX Highlights", {
  x: 6.9, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.gold, fontFace: "Arial",
});
const uxItems = [
  "✅  Real-time password strength indicator",
  "🛒  Floating cart bar — always accessible",
  "🔍  Instant search — no API delay",
  "🏷️  Dynamic category filtering",
  "⚡  Optimistic UI — instant cart updates",
  "📱  Fully responsive — works on mobile",
  "🔐  Auto-logout on tab close",
  "⏳  Payment loading state (prevents double-submit)",
];
uxItems.forEach((u, i) => {
  slide.addText(u, {
    x: 6.9, y: 1.9 + i * 0.45, w: 5.2, h: 0.45,
    fontSize: 13, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// ===================== SLIDE 11: DEPLOYMENT =====================
slide = pptx.addSlide();
slide.background = { fill: "302B63" };
addSlideNumber(slide, 11, TOTAL_SLIDES);

slide.addText("🚀  Deployment Pipeline", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.white, fontFace: "Arial",
});

// Flow
const deployFlow = ["React Code\n(JSX + CSS)", "npm run build\n(Webpack)", "Static Files\n(HTML+JS+CSS)", "Netlify CDN\n(Global Edge)", "🌐 Live URL\nservebox.netlify.app"];
deployFlow.forEach((df, i) => {
  const dx = 0.3 + i * 2.5;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: dx, y: 1.2, w: 2.1, h: 0.9, fill: { color: "1E1B4B" },
    line: { color: "4C4694", width: 1 }, rectRadius: 0.1,
  });
  slide.addText(df, {
    x: dx, y: 1.2, w: 2.1, h: 0.9, align: "center", valign: "middle",
    fontSize: 11, bold: true, color: COLORS.white, fontFace: "Arial",
  });
  if (i < deployFlow.length - 1) {
    slide.addText("→", {
      x: dx + 2.1, y: 1.2, w: 0.4, h: 0.9, align: "center", valign: "middle",
      fontSize: 20, color: COLORS.white, fontFace: "Arial",
    });
  }
});

// Build Process
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 2.5, w: 5.8, h: 3.5, fill: { color: "1E1B4B" }, rectRadius: 0.12,
});
slide.addText("Build Process", {
  x: 0.8, y: 2.6, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.white, fontFace: "Arial",
});
const buildItems = [
  "📦  Webpack compiles JSX → vanilla JS",
  "🔑  .env variables baked into bundle at build time",
  "🗜️  Code minified + gzipped (~81KB JS, ~3KB CSS)",
  "🔗  Content-hashed filenames for cache busting",
];
buildItems.forEach((b, i) => {
  slide.addText(b, {
    x: 0.8, y: 3.2 + i * 0.5, w: 5.2, h: 0.5,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// Netlify Features
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 2.5, w: 5.8, h: 3.5, fill: { color: "1E1B4B" }, rectRadius: 0.12,
});
slide.addText("Netlify Features", {
  x: 6.9, y: 2.6, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.white, fontFace: "Arial",
});
const netlifyItems = [
  "🌍  Global CDN — fast worldwide",
  "🔒  Free HTTPS (SSL certificate)",
  "♾️  No expiration — stays live forever",
  "📂  Drag & drop deployment",
];
netlifyItems.forEach((n, i) => {
  slide.addText(n, {
    x: 6.9, y: 3.2 + i * 0.5, w: 5.2, h: 0.5,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// ===================== SLIDE 12: SECURITY =====================
slide = pptx.addSlide();
slide.background = { fill: "B71C1C" };
addSlideNumber(slide, 12, TOTAL_SLIDES);

slide.addText("🔒  Security Considerations", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.white, fontFace: "Arial",
});

// Secured
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.2, w: 5.8, h: 5, fill: { color: "8B1A25" }, rectRadius: 0.12,
});
slide.addText("What's Secured (POC)", {
  x: 0.8, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.white, fontFace: "Arial",
});
const secured = [
  "✅  Password policy enforcement (5 rules)",
  "✅  PCI-DSS — Card data in Razorpay iframe only",
  "✅  Session auto-expiry on tab close",
  "✅  Route guards on protected pages",
  "✅  HTTPS via Netlify SSL",
  "✅  No sensitive keys exposed (test key only)",
];
secured.forEach((s, i) => {
  slide.addText(s, {
    x: 0.8, y: 1.9 + i * 0.55, w: 5.2, h: 0.55,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// Production Upgrades
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.2, w: 5.8, h: 5, fill: { color: "8B1A25" }, rectRadius: 0.12,
});
slide.addText("Production Upgrades Needed", {
  x: 6.9, y: 1.3, w: 5, h: 0.5, fontSize: 20, bold: true, color: COLORS.white, fontFace: "Arial",
});
const upgrades = [
  "🔄  bcrypt password hashing (server-side)",
  "🔄  JWT token-based authentication",
  "🔄  Server-side payment verification",
  "🔄  Rate limiting & CSRF protection",
  "🔄  Database encryption at rest",
  "🔄  Input sanitization (XSS prevention)",
];
upgrades.forEach((u, i) => {
  slide.addText(u, {
    x: 6.9, y: 1.9 + i * 0.55, w: 5.2, h: 0.55,
    fontSize: 14, color: COLORS.lightGray, fontFace: "Arial",
  });
});

// ===================== SLIDE 13: ROADMAP =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.dark };
addSlideNumber(slide, 13, TOTAL_SLIDES);

slide.addText("🗺️  Production Roadmap", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.primary, fontFace: "Arial",
});
slide.addText("Scaling from POC to production-ready application", {
  x: 0.6, y: 1.0, w: 10, h: 0.4, fontSize: 16, color: COLORS.lightGray, fontFace: "Arial",
});

const roadmapBoxes = [
  { icon: "🖥️", title: "Backend API", desc: "Node.js + Express\nReplace localStorage with REST APIs" },
  { icon: "🗄️", title: "Database", desc: "MongoDB / PostgreSQL\nShared data, multi-user support" },
  { icon: "🔐", title: "Auth Service", desc: "JWT + bcrypt\nSecure token-based sessions" },
  { icon: "💳", title: "Payment Verify", desc: "Server-side Razorpay verification\nWebhook for payment status" },
  { icon: "📱", title: "Mobile App", desc: "Capacitor or React Native\nAndroid + iOS app store" },
  { icon: "📊", title: "Analytics", desc: "Order trends, popular items\nRevenue dashboard" },
];
roadmapBoxes.forEach((rb, i) => {
  const col = i % 3;
  const row = Math.floor(i / 3);
  const rx = 0.5 + col * 4.1;
  const ry = 1.6 + row * 2.5;
  slide.addShape(pptx.ShapeType.roundRect, {
    x: rx, y: ry, w: 3.8, h: 2.2, fill: { color: "16213E" },
    line: { color: "30363D", width: 1 }, rectRadius: 0.12,
  });
  slide.addText(rb.icon, { x: rx, y: ry + 0.15, w: 3.8, h: 0.5, align: "center", fontSize: 28 });
  slide.addText(rb.title, {
    x: rx, y: ry + 0.65, w: 3.8, h: 0.35, align: "center",
    fontSize: 15, bold: true, color: COLORS.white, fontFace: "Arial",
  });
  slide.addText(rb.desc, {
    x: rx + 0.3, y: ry + 1.1, w: 3.2, h: 0.9, align: "center",
    fontSize: 12, color: COLORS.gray, fontFace: "Arial",
  });
});

// ===================== SLIDE 14: FILE STRUCTURE =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.darkBg };
addSlideNumber(slide, 14, TOTAL_SLIDES);

slide.addText("📁  Project File Structure", {
  x: 0.6, y: 0.3, w: 10, h: 0.7,
  fontSize: 32, bold: true, color: COLORS.primary, fontFace: "Arial",
});

// File tree
slide.addShape(pptx.ShapeType.roundRect, {
  x: 0.5, y: 1.1, w: 5.8, h: 5.6, fill: { color: COLORS.codeBg },
  line: { color: "30363D", width: 1 }, rectRadius: 0.1,
});
const fileTree = [
  "office-food-frontend/",
  "├── public/",
  "│   └── index.html         # HTML + Razorpay SDK",
  "├── src/",
  "│   ├── App.js             # Route definitions",
  "│   ├── App.css            # Complete stylesheet",
  "│   ├── index.js           # React entry point",
  "│   ├── components/",
  "│   │   ├── LoginPage.js",
  "│   │   ├── SignUpPage.js",
  "│   │   ├── EmployeeDashboard.js",
  "│   │   ├── CartPage.js",
  "│   │   ├── OrderConfirmation.js",
  "│   │   ├── CateringDashboard.js",
  "│   │   └── Navbar.js",
  "│   └── helpers/",
  "│       └── storage.js     # Data layer",
  "├── .env                   # Razorpay API key",
  "├── package.json",
  "└── build/                 # Production bundle",
];
fileTree.forEach((f, i) => {
  slide.addText(f, {
    x: 0.7, y: 1.2 + i * 0.27, w: 5.4, h: 0.27,
    fontSize: 11, color: "C9D1D9", fontFace: "Courier New",
  });
});

// Component table
slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.6, y: 1.1, w: 5.8, h: 5.6, fill: { color: "16213E" }, rectRadius: 0.12,
});
slide.addText("Component Responsibilities", {
  x: 6.9, y: 1.2, w: 5, h: 0.5, fontSize: 18, bold: true, color: COLORS.gold, fontFace: "Arial",
});

const compRows = [
  ["Component", "Responsibility"],
  ["App.js", "Root router + global state (cart)"],
  ["LoginPage", "Auth + password validation"],
  ["SignUpPage", "Registration + real-time rules"],
  ["EmployeeDash", "Menu browsing + search/filter"],
  ["CartPage", "Cart management + Razorpay"],
  ["OrderConfirm", "Success page + payment ID"],
  ["CateringDash", "Menu CRUD + order viewing"],
  ["Navbar", "Shared header + logout"],
  ["storage.js", "All data operations (CRUD)"],
];
const compTableRows = compRows.map((row, rIdx) =>
  row.map((cell, cIdx) => ({
    text: cell,
    options: {
      bold: rIdx === 0 || cIdx === 0,
      color: rIdx === 0 ? COLORS.primary : (cIdx === 0 ? COLORS.white : COLORS.lightGray),
      fill: { color: rIdx === 0 ? "1E2A4A" : (rIdx % 2 === 0 ? "16213E" : "1A2740") },
      fontSize: 12,
    },
  }))
);
slide.addTable(compTableRows, {
  x: 6.7, y: 1.8, w: 5.5, h: 4.5,
  fontSize: 12, fontFace: "Arial",
  border: { type: "solid", pt: 0.5, color: "30363D" },
  colW: [2, 3.5],
  autoPage: false,
});

// ===================== SLIDE 15: THANK YOU =====================
slide = pptx.addSlide();
slide.background = { fill: COLORS.darkBg };
addSlideNumber(slide, 15, TOTAL_SLIDES);

slide.addText("🎉", { x: 0, y: 0.8, w: "100%", h: 0.8, align: "center", fontSize: 60 });
slide.addText("Live Demo", {
  x: 0, y: 1.6, w: "100%", h: 0.8, align: "center",
  fontSize: 48, bold: true, color: COLORS.white, fontFace: "Arial",
});
slide.addText("https://servebox.netlify.app", {
  x: 0, y: 2.4, w: "100%", h: 0.5, align: "center",
  fontSize: 20, color: COLORS.gold, fontFace: "Arial",
});

// Two boxes
slide.addShape(pptx.ShapeType.roundRect, {
  x: 3.5, y: 3.3, w: 2.8, h: 1.2, fill: { color: "16213E" }, rectRadius: 0.1,
});
slide.addText("Employee Login", {
  x: 3.5, y: 3.4, w: 2.8, h: 0.4, align: "center",
  fontSize: 14, bold: true, color: COLORS.green, fontFace: "Arial",
});
slide.addText("Browse menu → Add to cart → Pay", {
  x: 3.5, y: 3.8, w: 2.8, h: 0.4, align: "center",
  fontSize: 11, color: COLORS.lightGray, fontFace: "Arial",
});

slide.addShape(pptx.ShapeType.roundRect, {
  x: 6.8, y: 3.3, w: 2.8, h: 1.2, fill: { color: "16213E" }, rectRadius: 0.1,
});
slide.addText("Catering Login", {
  x: 6.8, y: 3.4, w: 2.8, h: 0.4, align: "center",
  fontSize: 14, bold: true, color: COLORS.gold, fontFace: "Arial",
});
slide.addText("Manage menu → View orders", {
  x: 6.8, y: 3.8, w: 2.8, h: 0.4, align: "center",
  fontSize: 11, color: COLORS.lightGray, fontFace: "Arial",
});

slide.addText("Thank You! 🙏", {
  x: 0, y: 5.0, w: "100%", h: 0.8, align: "center",
  fontSize: 36, bold: true, color: COLORS.white, fontFace: "Arial",
});
slide.addText("Questions?", {
  x: 0, y: 5.8, w: "100%", h: 0.4, align: "center",
  fontSize: 16, color: COLORS.gray, fontFace: "Arial",
});

// ===================== SAVE =====================
const outputPath = "c:\\Users\\shshree\\office-food-frontend\\ServeBox-POC-Presentation.pptx";
pptx.writeFile({ fileName: outputPath }).then(() => {
  console.log(`✅ PPT saved to: ${outputPath}`);
}).catch((err) => {
  console.error("Error:", err);
});
