import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiLogin } from "../helpers/api";

const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { key: "upper", label: "At least one uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", label: "At least one lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "At least one number (0-9)", test: (p) => /[0-9]/.test(p) },
  { key: "special", label: "At least one special character (!@#$%&*)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function LoginPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("employee");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !password.trim()) {
      setError("Please enter both name and password.");
      return;
    }

    const passwordValid = PASSWORD_RULES.every((r) => r.test(password));
    if (!passwordValid) {
      setError("Password does not meet the required format.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const data = await apiLogin(name.trim(), password, role);

      const session = {
        name: data.name,
        role: data.role,
        token: data.token,
        loggedInAt: new Date().toISOString(),
      };
      sessionStorage.setItem("office-food-session", JSON.stringify(session));

      if (data.role === "employee") {
        navigate("/employee");
      } else {
        navigate("/catering");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <span className="logo-icon">🍽️</span>
          <h1>Office Food Ordering</h1>
          <p>Order delicious meals for your office</p>
        </div>

        <div className="role-tabs">
          <button
            className={`role-tab ${role === "employee" ? "active" : ""}`}
            onClick={() => { setRole("employee"); setError(""); }}
          >
            👨‍💼 Employee
          </button>
          <button
            className={`role-tab ${role === "catering" ? "active" : ""}`}
            onClick={() => { setRole("catering"); setError(""); }}
          >
            👨‍🍳 Catering
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-msg">{error}</div>}

          <div className="form-group">
            <label htmlFor="name">
              {role === "employee" ? "Employee Name" : "Catering Admin Name"}
            </label>
            <input
              id="name"
              type="text"
              placeholder={role === "employee" ? "Enter employee name" : "Enter admin name"}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Logging in..." : `Login as ${role === "employee" ? "Employee" : "Catering Admin"}`}
          </button>

          <p className="auth-link">
            Don't have an account? <Link to="/signup">Sign up here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
