import React from "react";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "../helpers/storage";

export default function OrderConfirmation({ lastOrder }) {
  const navigate = useNavigate();

  if (!lastOrder) {
    return (
      <div className="dashboard">
        <div className="container center-content">
          <h2>No recent order found.</h2>
          <button className="btn btn-primary" onClick={() => navigate("/employee")}>Go to Menu</button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="container center-content">
        <div className="order-success-card">
          <div className="success-icon">✅</div>
          <h1>Order Placed Successfully!</h1>

          <div className="order-id-box">
            <span>Order ID</span>
            <strong>{lastOrder.orderId}</strong>
          </div>

          <div className="order-details">
            <div className="detail-row">
              <span>Employee</span>
              <span>{lastOrder.employee}</span>
            </div>
            <div className="detail-row">
              <span>Payment</span>
              <span>{lastOrder.paymentMode === "COD" ? "💵 Cash on Delivery" : "💳 Razorpay"}</span>
            </div>
            <div className="detail-row">
              <span>Status</span>
              <span className="status-badge">{lastOrder.status}</span>
            </div>
            {lastOrder.razorpayPaymentId && (
              <div className="detail-row">
                <span>Payment ID</span>
                <span className="payment-id">{lastOrder.razorpayPaymentId}</span>
              </div>
            )}
            <div className="detail-row">
              <span>Time</span>
              <span>{lastOrder.placedAt}</span>
            </div>

            <h4>Items Ordered</h4>
            {lastOrder.items.map((item) => (
              <div key={item.id} className="detail-row">
                <span>{item.name} × {item.qty}</span>
                <span>{formatPrice(item.price * item.qty)}</span>
              </div>
            ))}

            <div className="detail-row total-row">
              <span>Total</span>
              <span>{formatPrice(lastOrder.total)}</span>
            </div>
          </div>

          <button className="btn btn-primary" onClick={() => navigate("/employee")}>
            Order More
          </button>
        </div>
      </div>
    </div>
  );
}
