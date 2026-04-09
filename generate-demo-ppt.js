const pptxgen = require("pptxgenjs");

const ppt = new pptxgen();
ppt.layout = "LAYOUT_WIDE";
ppt.author = "ServeBox Team";
ppt.title = "ServeBox - Office Food Ordering System";

// Color palette - clean professional
const NAVY = "1B2A4A";
const WHITE = "FFFFFF";
const ACCENT = "2E86AB";
const LIGHT_BG = "F4F7FA";
const GOLD = "E8A838";
const DARK_TEXT = "2C3E50";
const SUB_TEXT = "5D6D7E";
const GREEN = "27AE60";

// ========== SLIDE 1: TITLE ==========
const slide1 = ppt.addSlide();
slide1.background = { color: NAVY };

// Decorative top bar
slide1.addShape(ppt.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.08, fill: { color: GOLD } });

// App icon
slide1.addText("🍽️", { x: 4.5, y: 1.2, w: 4.3, h: 1.2, fontSize: 60, align: "center" });

// Title
slide1.addText("ServeBox", {
  x: 1.5, y: 2.3, w: 10.3, h: 1.0,
  fontSize: 52, fontFace: "Calibri", bold: true,
  color: WHITE, align: "center",
});

// Subtitle
slide1.addText("Office Food Ordering System", {
  x: 1.5, y: 3.2, w: 10.3, h: 0.6,
  fontSize: 24, fontFace: "Calibri",
  color: GOLD, align: "center",
});

// Divider line
slide1.addShape(ppt.ShapeType.rect, { x: 4.5, y: 4.0, w: 4.3, h: 0.03, fill: { color: ACCENT } });

// Presented by
slide1.addText("Internal POC Presentation", {
  x: 1.5, y: 4.3, w: 10.3, h: 0.5,
  fontSize: 16, fontFace: "Calibri",
  color: SUB_TEXT, align: "center",
});

slide1.addText("April 2026", {
  x: 1.5, y: 4.8, w: 10.3, h: 0.5,
  fontSize: 14, fontFace: "Calibri",
  color: SUB_TEXT, align: "center",
});

// Bottom bar
slide1.addShape(ppt.ShapeType.rect, { x: 0, y: 7.42, w: "100%", h: 0.08, fill: { color: GOLD } });


// ========== SLIDE 2: ABOUT THE PROJECT ==========
const slide2 = ppt.addSlide();
slide2.background = { color: WHITE };
slide2.addShape(ppt.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: NAVY } });

slide2.addText("About the Project", {
  x: 0.8, y: 0.4, w: 11.7, h: 0.8,
  fontSize: 32, fontFace: "Calibri", bold: true,
  color: NAVY,
});

slide2.addShape(ppt.ShapeType.rect, { x: 0.8, y: 1.15, w: 2.5, h: 0.04, fill: { color: GOLD } });

// Problem box
slide2.addShape(ppt.ShapeType.roundRect, {
  x: 0.8, y: 1.6, w: 5.3, h: 2.8,
  fill: { color: LIGHT_BG }, rectRadius: 0.15,
  line: { color: "E0E0E0", width: 1 },
});

slide2.addText("🔍  The Problem", {
  x: 1.1, y: 1.75, w: 4.7, h: 0.5,
  fontSize: 18, fontFace: "Calibri", bold: true, color: NAVY,
});

slide2.addText([
  { text: "•  Manual food ordering via WhatsApp/calls\n", options: { fontSize: 13, color: DARK_TEXT, breakType: "none" } },
  { text: "•  No visibility on order status for employees\n", options: { fontSize: 13, color: DARK_TEXT } },
  { text: "•  Catering team overwhelmed with tracking\n", options: { fontSize: 13, color: DARK_TEXT } },
  { text: "•  No payment tracking or order history\n", options: { fontSize: 13, color: DARK_TEXT } },
  { text: "•  Pre-orders managed manually", options: { fontSize: 13, color: DARK_TEXT } },
], { x: 1.1, y: 2.3, w: 4.8, h: 2.0, fontFace: "Calibri", lineSpacingMultiple: 1.3 });

// Solution box
slide2.addShape(ppt.ShapeType.roundRect, {
  x: 6.6, y: 1.6, w: 5.7, h: 2.8,
  fill: { color: LIGHT_BG }, rectRadius: 0.15,
  line: { color: "E0E0E0", width: 1 },
});

slide2.addText("✅  ServeBox Solution", {
  x: 6.9, y: 1.75, w: 5.1, h: 0.5,
  fontSize: 18, fontFace: "Calibri", bold: true, color: GREEN,
});

slide2.addText([
  { text: "•  Centralized web-based ordering platform\n", options: { fontSize: 13, color: DARK_TEXT } },
  { text: "•  Real-time order tracking & live queue\n", options: { fontSize: 13, color: DARK_TEXT } },
  { text: "•  Catering dashboard for order management\n", options: { fontSize: 13, color: DARK_TEXT } },
  { text: "•  COD & Razorpay payment integration\n", options: { fontSize: 13, color: DARK_TEXT } },
  { text: "•  Pre-order support for next-day meals", options: { fontSize: 13, color: DARK_TEXT } },
], { x: 6.9, y: 2.3, w: 5.2, h: 2.0, fontFace: "Calibri", lineSpacingMultiple: 1.3 });

// Bottom summary
slide2.addShape(ppt.ShapeType.roundRect, {
  x: 0.8, y: 4.8, w: 11.7, h: 1.2,
  fill: { color: NAVY }, rectRadius: 0.1,
});

slide2.addText("ServeBox digitizes the entire office food ordering workflow — from browsing the menu to picking up the meal — improving efficiency for both employees and the catering team.", {
  x: 1.2, y: 4.9, w: 10.9, h: 1.0,
  fontSize: 14, fontFace: "Calibri", color: WHITE, align: "center", valign: "middle",
});

slide2.addShape(ppt.ShapeType.rect, { x: 0, y: 7.44, w: "100%", h: 0.06, fill: { color: NAVY } });


// ========== SLIDE 3: TECH STACK ==========
const slide3 = ppt.addSlide();
slide3.background = { color: WHITE };
slide3.addShape(ppt.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: NAVY } });

slide3.addText("Technology Stack", {
  x: 0.8, y: 0.4, w: 11.7, h: 0.8,
  fontSize: 32, fontFace: "Calibri", bold: true, color: NAVY,
});

slide3.addShape(ppt.ShapeType.rect, { x: 0.8, y: 1.15, w: 2.5, h: 0.04, fill: { color: GOLD } });

const techItems = [
  { icon: "⚛️", label: "Frontend", tech: "React 19", desc: "Single Page Application with responsive UI, React Router for navigation", color: "3498DB" },
  { icon: "☕", label: "Backend", tech: "Java Spring Boot 3", desc: "RESTful APIs, JWT authentication, bcrypt password hashing", color: "E67E22" },
  { icon: "🗄️", label: "Database", tech: "PostgreSQL", desc: "Relational database with migrations, indexed queries, secure storage", color: "27AE60" },
  { icon: "☁️", label: "Hosting", tech: "Render Cloud", desc: "Auto-deploy from GitHub, managed PostgreSQL, HTTPS enabled", color: "9B59B6" },
  { icon: "💳", label: "Payments", tech: "Razorpay", desc: "Online payment gateway integration with test mode support", color: "E74C3C" },
];

techItems.forEach((item, i) => {
  const y = 1.55 + i * 1.1;

  // Card background
  slide3.addShape(ppt.ShapeType.roundRect, {
    x: 0.8, y, w: 11.7, h: 0.95,
    fill: { color: LIGHT_BG }, rectRadius: 0.1,
    line: { color: "E0E0E0", width: 1 },
  });

  // Color accent bar on left
  slide3.addShape(ppt.ShapeType.rect, { x: 0.8, y: y + 0.15, w: 0.08, h: 0.65, fill: { color: item.color } });

  // Icon
  slide3.addText(item.icon, { x: 1.1, y, w: 0.7, h: 0.95, fontSize: 28, align: "center", valign: "middle" });

  // Label
  slide3.addText(item.label, {
    x: 1.9, y: y + 0.1, w: 2.0, h: 0.4,
    fontSize: 14, fontFace: "Calibri", bold: true, color: SUB_TEXT,
  });

  // Tech name
  slide3.addText(item.tech, {
    x: 1.9, y: y + 0.45, w: 2.5, h: 0.4,
    fontSize: 18, fontFace: "Calibri", bold: true, color: NAVY,
  });

  // Description
  slide3.addText(item.desc, {
    x: 4.8, y, w: 7.4, h: 0.95,
    fontSize: 13, fontFace: "Calibri", color: DARK_TEXT, valign: "middle",
  });
});

slide3.addShape(ppt.ShapeType.rect, { x: 0, y: 7.44, w: "100%", h: 0.06, fill: { color: NAVY } });


// ========== SLIDE 4: KEY FEATURES ==========
const slide4 = ppt.addSlide();
slide4.background = { color: WHITE };
slide4.addShape(ppt.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: NAVY } });

slide4.addText("Key Features", {
  x: 0.8, y: 0.4, w: 11.7, h: 0.8,
  fontSize: 32, fontFace: "Calibri", bold: true, color: NAVY,
});

slide4.addShape(ppt.ShapeType.rect, { x: 0.8, y: 1.15, w: 2.5, h: 0.04, fill: { color: GOLD } });

// Employee side
slide4.addText("👨‍💼  Employee Side", {
  x: 0.8, y: 1.5, w: 5.5, h: 0.5,
  fontSize: 18, fontFace: "Calibri", bold: true, color: ACCENT,
});

const empFeatures = [
  "🍽️  Browse menu by category (Breakfast, Lunch, Snacks, Beverages)",
  "🛒  Add to cart & place orders (COD or Razorpay)",
  "📅  Pre-order meals for the next day",
  "📊  Live order queue with position tracking",
  "🏢  \"I'm at the counter\" pickup notification",
  "📱  Real-time status updates on orders",
];

empFeatures.forEach((f, i) => {
  slide4.addText(f, {
    x: 1.1, y: 2.05 + i * 0.48, w: 5.5, h: 0.45,
    fontSize: 12.5, fontFace: "Calibri", color: DARK_TEXT, valign: "middle",
  });
});

// Catering side
slide4.addText("👨‍🍳  Catering Side", {
  x: 6.6, y: 1.5, w: 5.7, h: 0.5,
  fontSize: 18, fontFace: "Calibri", bold: true, color: GREEN,
});

const catFeatures = [
  "📋  Full menu CRUD (add, edit, delete, toggle availability)",
  "✅  Accept or ❌ Reject incoming orders",
  "🔄  Update order status (Preparing → Ready → Delivered)",
  "🏢  At-counter alerts — know when employee arrives",
  "📺  KFC-style order display board",
  "⏱️  Auto-refreshing dashboard (every 5 seconds)",
];

catFeatures.forEach((f, i) => {
  slide4.addText(f, {
    x: 6.9, y: 2.05 + i * 0.48, w: 5.5, h: 0.45,
    fontSize: 12.5, fontFace: "Calibri", color: DARK_TEXT, valign: "middle",
  });
});

// Security bar at bottom
slide4.addShape(ppt.ShapeType.roundRect, {
  x: 0.8, y: 5.1, w: 11.7, h: 0.8,
  fill: { color: LIGHT_BG }, rectRadius: 0.1,
  line: { color: "E0E0E0", width: 1 },
});

slide4.addText("🔒  Security: JWT token-based authentication  •  bcrypt password hashing  •  Role-based access control  •  HTTPS on production", {
  x: 1.0, y: 5.1, w: 11.3, h: 0.8,
  fontSize: 12.5, fontFace: "Calibri", color: NAVY, align: "center", valign: "middle",
});

slide4.addShape(ppt.ShapeType.rect, { x: 0, y: 7.44, w: "100%", h: 0.06, fill: { color: NAVY } });


// ========== SLIDE 5: FUTURE ENHANCEMENTS ==========
const slide5 = ppt.addSlide();
slide5.background = { color: WHITE };
slide5.addShape(ppt.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.06, fill: { color: NAVY } });

slide5.addText("Future Enhancements", {
  x: 0.8, y: 0.4, w: 11.7, h: 0.8,
  fontSize: 32, fontFace: "Calibri", bold: true, color: NAVY,
});

slide5.addShape(ppt.ShapeType.rect, { x: 0.8, y: 1.15, w: 2.5, h: 0.04, fill: { color: GOLD } });

const enhancements = [
  { icon: "👤", title: "Admin Panel", desc: "Dedicated admin role for user management, analytics, and system configuration" },
  { icon: "📊", title: "Reports & Analytics", desc: "Daily/weekly order reports, revenue tracking, most popular items dashboard" },
  { icon: "🔔", title: "Push Notifications", desc: "Real-time browser/mobile notifications when order status changes" },
  { icon: "⭐", title: "Ratings & Feedback", desc: "Employees can rate meals and leave feedback for the catering team" },
  { icon: "📱", title: "Mobile App (PWA)", desc: "Progressive Web App for native-like experience on phones" },
  { icon: "🤖", title: "Smart Recommendations", desc: "AI-based meal suggestions based on ordering history and preferences" },
];

enhancements.forEach((item, i) => {
  const col = i % 2;
  const row = Math.floor(i / 2);
  const x = col === 0 ? 0.8 : 6.6;
  const y = 1.55 + row * 1.6;

  // Card
  slide5.addShape(ppt.ShapeType.roundRect, {
    x, y, w: 5.6, h: 1.35,
    fill: { color: LIGHT_BG }, rectRadius: 0.12,
    line: { color: "E0E0E0", width: 1 },
  });

  // Icon circle
  slide5.addShape(ppt.ShapeType.ellipse, {
    x: x + 0.25, y: y + 0.25, w: 0.75, h: 0.75,
    fill: { color: NAVY },
  });
  slide5.addText(item.icon, {
    x: x + 0.25, y: y + 0.25, w: 0.75, h: 0.75,
    fontSize: 22, align: "center", valign: "middle",
  });

  // Title
  slide5.addText(item.title, {
    x: x + 1.2, y: y + 0.15, w: 4.1, h: 0.4,
    fontSize: 16, fontFace: "Calibri", bold: true, color: NAVY,
  });

  // Desc
  slide5.addText(item.desc, {
    x: x + 1.2, y: y + 0.55, w: 4.1, h: 0.65,
    fontSize: 12, fontFace: "Calibri", color: SUB_TEXT,
  });
});

slide5.addShape(ppt.ShapeType.rect, { x: 0, y: 7.44, w: "100%", h: 0.06, fill: { color: NAVY } });


// ========== SLIDE 6: THANK YOU ==========
const slide6 = ppt.addSlide();
slide6.background = { color: NAVY };
slide6.addShape(ppt.ShapeType.rect, { x: 0, y: 0, w: "100%", h: 0.08, fill: { color: GOLD } });

slide6.addText("🍽️", { x: 4.5, y: 1.5, w: 4.3, h: 1.0, fontSize: 50, align: "center" });

slide6.addText("Thank You!", {
  x: 1.5, y: 2.5, w: 10.3, h: 1.0,
  fontSize: 48, fontFace: "Calibri", bold: true,
  color: WHITE, align: "center",
});

slide6.addShape(ppt.ShapeType.rect, { x: 5, y: 3.5, w: 3.3, h: 0.03, fill: { color: GOLD } });

slide6.addText("Questions & Feedback Welcome", {
  x: 1.5, y: 3.8, w: 10.3, h: 0.6,
  fontSize: 20, fontFace: "Calibri",
  color: GOLD, align: "center",
});

slide6.addText("🌐  servebox.onrender.com", {
  x: 1.5, y: 4.8, w: 10.3, h: 0.5,
  fontSize: 16, fontFace: "Calibri", color: WHITE, align: "center",
});

slide6.addShape(ppt.ShapeType.rect, { x: 0, y: 7.42, w: "100%", h: 0.08, fill: { color: GOLD } });


// ========== GENERATE ==========
const outPath = "ServeBox-Demo-Presentation.pptx";
ppt.writeFile({ fileName: outPath }).then(() => {
  console.log(`Generated: ${outPath}`);
}).catch(err => {
  console.error("Failed:", err);
});
