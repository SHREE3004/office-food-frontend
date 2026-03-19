import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ title, cartCount }) {
  const navigate = useNavigate();
  const session = JSON.parse(sessionStorage.getItem("office-food-session") || "{}");

  const logout = () => {
    sessionStorage.removeItem("office-food-session");
    navigate("/");
  };

  return (
    <nav className="navbar">
      <div className="nav-left">
        <span className="nav-logo">🍽️</span>
        <h2>{title}</h2>
      </div>
      <div className="nav-right">
        {cartCount !== undefined && cartCount > 0 && (
          <button className="btn btn-outline cart-badge-btn" onClick={() => navigate("/employee/cart")}>
            🛒 Cart ({cartCount})
          </button>
        )}
        <span className="nav-user">👤 {session.name || "User"}</span>
        <button className="btn btn-outline" onClick={logout}>Logout</button>
      </div>
    </nav>
  );
}
