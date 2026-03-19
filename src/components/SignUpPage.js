import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { apiSignup } from "../helpers/api";

const PASSWORD_RULES = [
  { key: "length", label: "At least 8 characters", test: (p) => p.length >= 8 },
  { key: "upper", label: "At least one uppercase letter (A-Z)", test: (p) => /[A-Z]/.test(p) },
  { key: "lower", label: "At least one lowercase letter (a-z)", test: (p) => /[a-z]/.test(p) },
  { key: "number", label: "At least one number (0-9)", test: (p) => /[0-9]/.test(p) },
  { key: "special", label: "At least one special character (!@#$%&*)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState("employee");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const ruleResults = useMemo(
    () => PASSWORD_RULES.map((r) => ({ ...r, passed: r.test(password) })),
    [password]
  );

  const allRulesPassed = ruleResults.every((r) => r.passed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }

    if (!allRulesPassed) {
      setError("Password does not meet all the requirements.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      await apiSignup(name.trim(), password, role);
      setSuccess("Account created successfully! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
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
          <h1>Create Account</h1>
          <p>Sign up to start ordering</p>
        </div>

        <div className="role-tabs">
          <button
            className={`role-tab ${role === "employee" ? "active" : ""}`}
            onClick={() => { setRole("employee"); setError(""); setSuccess(""); }}
          >
            👨‍💼 Employee
          </button>
          <button
            className={`role-tab ${role === "catering" ? "active" : ""}`}
            onClick={() => { setRole("catering"); setError(""); setSuccess(""); }}
          >
            👨‍🍳 Catering
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          {error && <div className="error-msg">{error}</div>}
          {success && <div className="success-msg">{success}</div>}

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
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {password.length > 0 && (
              <ul className="password-rules">
                {ruleResults.map((r) => (
                  <li key={r.key} className={r.passed ? "rule-pass" : "rule-fail"}>
                    <span className="rule-icon">{r.passed ? "✅" : "❌"}</span>
                    {r.label}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              placeholder="Re-enter password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            {confirmPassword.length > 0 && password !== confirmPassword && (
              <span className="rule-fail" style={{ fontSize: 13 }}>
                ❌ Passwords do not match
              </span>
            )}
            {confirmPassword.length > 0 && password === confirmPassword && (
              <span className="rule-pass" style={{ fontSize: 13 }}>
                ✅ Passwords match
              </span>
            )}
          </div>

          <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
            {loading ? "Creating Account..." : `Sign Up as ${role === "employee" ? "Employee" : "Catering Admin"}`}
          </button>

          <p className="auth-link">
            Already have an account? <Link to="/">Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
