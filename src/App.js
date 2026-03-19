import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import LoginPage from "./components/LoginPage";
import EmployeeDashboard from "./components/EmployeeDashboard";
import CartPage from "./components/CartPage";
import OrderConfirmation from "./components/OrderConfirmation";
import CateringDashboard from "./components/CateringDashboard";
import SignUpPage from "./components/SignUpPage";
import OrderDisplay from "./components/OrderDisplay";

function App() {
  const [cart, setCart] = useState([]);
  const [lastOrder, setLastOrder] = useState(null);

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/employee" element={<EmployeeDashboard cart={cart} setCart={setCart} />} />
      <Route path="/employee/cart" element={<CartPage cart={cart} setCart={setCart} setLastOrder={setLastOrder} />} />
      <Route path="/employee/order-success" element={<OrderConfirmation lastOrder={lastOrder} />} />
      <Route path="/catering" element={<CateringDashboard />} />
      <Route path="/display" element={<OrderDisplay />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;