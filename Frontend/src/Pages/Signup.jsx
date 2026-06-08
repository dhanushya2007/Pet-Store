import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import FormField from "../Components/FormField";
import logo from "../Assets/Images/logo.png";
import API_BASE from "../api";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const navigate  = useNavigate();
  const { login } = useAuth();
  const [name, setName]         = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole]         = useState("user");
  const [error, setError]       = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    if (!name || !email || !password) { setError("Please fill in all fields."); return; }
    setSubmitting(true);
    try {
      const res  = await fetch(`${API_BASE}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed."); return; }

      login(data.user, data.token);

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
          <h1>Create Account</h1>
          <p className="lead">Join thousands of pet lovers today.</p>
          {error && <p style={{ color: "#c0392b", fontWeight: 700 }}>{error}</p>}

          <FormField id="name" label="Full Name" type="text" value={name}
            onChange={(e) => setName(e.target.value)} placeholder="Your full name" required />
          <FormField id="email" label="Email Address" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)} placeholder="Your email" required />
          <FormField id="password" label="Password" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)} placeholder="Create a password" required />

          {/* Role selector */}
          <div className="form-field">
            <label htmlFor="role">I want to join as</label>
            <select id="role" value={role} onChange={(e) => setRole(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: 8, border: "1.5px solid #f0d5bc", fontSize: 13, fontFamily: "inherit", background: "white", width: "100%" }}>
              <option value="user">🐾 Pet Adopter / Buyer</option>
              <option value="seller">🏪 Pet Seller</option>
            </select>
          </div>

          {role === "seller" && (
            <p style={{ fontSize: 12, color: "#7a857c", background: "#f0f7f1", padding: "8px 12px", borderRadius: 8 }}>
              🛈 As a seller you can list pets for adoption or sale. Your listings require admin approval before going live.
            </p>
          )}

          <div className="form-actions">
            <button type="submit" disabled={submitting}>
              {submitting ? "Creating account..." : "Sign Up"}
            </button>
          </div>
          <p className="form-note">
            Already have an account? <Link to="/login">Log in</Link>
          </p>
        </form>
      </main>
    </Layout>
  );
}

export default Signup;
