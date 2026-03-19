import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { formatPrice, getDateString } from "../helpers/storage";
import { apiPlaceOrder } from "../helpers/api";

export default function CartPage({ cart, setCart, setLastOrder }) {
  const navigate = useNavigate();
  const session = JSON.parse(sessionStorage.getItem("office-food-session") || "{}");
  const [paying, setPaying] = useState(false);
  const [scheduledDate, setScheduledDate] = useState(getDateString(0)); // default: today

  const today = getDateString(0);
  const tomorrow = getDateString(1);
  const isPreOrder = scheduledDate === tomorrow;

  const changeQty = (id, delta) => {
    setCart((prev) =>
      prev
        .map((item) => item.id === id ? { ...item, qty: Math.max(0, item.qty + delta) } : item)
        .filter((item) => item.qty > 0)
    );
  };

  const removeItem = (id) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalItems = cart.reduce((s, i) => s + i.qty, 0);
  const totalPrice = cart.reduce((s, i) => s + i.qty * i.price, 0);

  const finishOrder = async (orderData) => {
    try {
      const order = await apiPlaceOrder(orderData);
      setLastOrder(order);
      setCart([]);
      navigate("/employee/order-success");
    } catch (err) {
      alert("Failed to place order: " + err.message);
    }
  };

  const buildOrderData = (paymentMode, extra = {}) => ({
    items: cart.map(({ id, name, price, qty }) => ({ id, name, price, qty })),
    total: totalPrice,
    paymentMode,
    scheduledDate,
    isPreOrder,
    ...extra,
  });

  const handleCOD = () => {
    if (cart.length === 0) return;
    finishOrder(buildOrderData("COD"));
  };

  const handleRazorpay = () => {
    if (cart.length === 0) return;

    const razorpayKey = process.env.REACT_APP_RAZORPAY_KEY_ID;

    if (!razorpayKey || razorpayKey === "rzp_test_YOUR_KEY_HERE") {
      alert("Razorpay key is not configured.\n\nPlease set REACT_APP_RAZORPAY_KEY_ID in the .env file and restart the server.");
      return;
    }

    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Please check your internet connection and refresh.");
      return;
    }

    setPaying(true);

    const options = {
      key: razorpayKey,
      amount: totalPrice * 100, // Razorpay expects amount in paise
      currency: "INR",
      name: "Office Food Ordering",
      description: `Order`,
      image: "",
      prefill: {
        name: session.name || "",
      },
      theme: {
        color: "#e23744",
      },
      handler: (response) => {
        // Payment successful
        const orderData = buildOrderData("RAZORPAY", {
          razorpayPaymentId: response.razorpay_payment_id,
        });
        setPaying(false);
        finishOrder(orderData);
      },
      modal: {
        ondismiss: () => {
          setPaying(false);
        },
      },
    };

    const rzp = new window.Razorpay(options);

    rzp.on("payment.failed", (response) => {
      setPaying(false);
      alert(
        `Payment failed!\n\nReason: ${response.error.description}\nCode: ${response.error.code}`
      );
    });

    rzp.open();
  };

  return (
    <div className="dashboard">
      <Navbar title="Your Cart" cartCount={totalItems} />

      <div className="container">
        <button className="btn btn-outline back-btn" onClick={() => navigate("/employee")}>
          ← Back to Menu
        </button>

        {cart.length === 0 ? (
          <div className="empty-state">
            <h2>🛒 Your cart is empty</h2>
            <p>Go back to the menu and add some delicious items!</p>
            <button className="btn btn-primary" onClick={() => navigate("/employee")}>
              Browse Menu
            </button>
          </div>
        ) : (
          <div className="cart-layout">
            <div className="cart-items">
              <h2>Cart Items ({totalItems})</h2>
              {cart.map((item) => (
                <div key={item.id} className="cart-item-card">
                  <div className="cart-item-info">
                    <h4>{item.name}</h4>
                    <p className="cart-item-price">{formatPrice(item.price)} each</p>
                  </div>
                  <div className="cart-item-actions">
                    <div className="qty-control">
                      <button className="qty-btn" onClick={() => changeQty(item.id, -1)}>−</button>
                      <span className="qty-value">{item.qty}</span>
                      <button className="qty-btn" onClick={() => changeQty(item.id, 1)}>+</button>
                    </div>
                    <span className="cart-item-total">{formatPrice(item.price * item.qty)}</span>
                    <button className="btn-remove" onClick={() => removeItem(item.id)}>✕</button>
                  </div>
                </div>
              ))}
            </div>

            <div className="cart-summary">
              <h3>Order Summary</h3>
              <div className="summary-row">
                <span>Items</span>
                <span>{totalItems}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="summary-row total-row">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="schedule-selector">
                <label className="schedule-label">📅 Order for:</label>
                <div className="schedule-options">
                  <button
                    className={`schedule-btn ${scheduledDate === today ? "active" : ""}`}
                    onClick={() => setScheduledDate(today)}
                  >
                    🍽️ Today
                  </button>
                  <button
                    className={`schedule-btn ${scheduledDate === tomorrow ? "active" : ""}`}
                    onClick={() => setScheduledDate(tomorrow)}
                  >
                    📋 Tomorrow (Pre-order)
                  </button>
                </div>
                {isPreOrder && (
                  <p className="preorder-note">Your order will be prepared for {new Date(tomorrow).toLocaleDateString("en-IN", { weekday: "long", month: "short", day: "numeric" })}</p>
                )}
              </div>

              <div className="payment-buttons">
                <button
                  className="btn btn-primary btn-full"
                  onClick={handleRazorpay}
                  disabled={paying}
                >
                  {paying ? "⏳ Processing..." : "💳 Pay with Razorpay"}
                </button>
                <button
                  className="btn btn-secondary btn-full"
                  onClick={handleCOD}
                  disabled={paying}
                >
                  💵 Cash on Delivery
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
