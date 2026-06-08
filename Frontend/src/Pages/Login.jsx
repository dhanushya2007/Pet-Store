import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import FormField from "../Components/FormField";
import logo from "../Assets/Images/logo.png";
import API_BASE from "../api";
import { useAuth } from "../context/AuthContext";

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const savedEmail = localStorage.getItem("ps_savedEmail");
    if (savedEmail) { setEmail(savedEmail); setRememberMe(true); }
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!email || !password) { setError("Please enter both email and password."); return; }
    setSubmitting(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password: password.trim() }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Login failed."); return; }

      login(data.user, data.token);
      if (rememberMe) localStorage.setItem("ps_savedEmail", email);
      else            localStorage.removeItem("ps_savedEmail");

      if (data.user.role === "admin")       navigate("/admin");
      else if (data.user.role === "seller") navigate("/seller/dashboard");
      else                                  navigate("/");
    } catch (_) {
      setError("Unable to connect to the backend server.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Layout>
      <main className="auth-page">
        <form className="auth-card" onSubmit={handleSubmit}>
          <img className="auth-logo" src={logo} alt="PetStore logo" />
          <h1>Login</h1>
          <p className="lead">Welcome back to PetStore.</p>
          {error && <p style={{ color: "#c0392b", fontWeight: 700 }}>{error}</p>}
          <FormField id="email" label="Email Address" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" required />
          <FormField id="password" label="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" required />
          <div className="form-checkbox">
            <input id="rememberMe" type="checkbox" checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)} />
            <label htmlFor="rememberMe">Remember my email</label>
          </div>
          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "Logging in..." : "Login"}
            </button>
            <Link className="button ghost" to="/forgot-password">Forgot Password</Link>
          </div>
          <p className="form-note">
            New to PetStore? <Link to="/signup">Create an account</Link>
          </p>
        </form>
      </main>
    </Layout>
  );
}

export default Login;
