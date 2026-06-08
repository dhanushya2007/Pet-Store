import React, { useState } from "react";
import Layout from "../Components/Layout";
import API_BASE from "../api";

function Seller() {
  const [sellerName, setSellerName] = useState("");
  const [shopName, setShopName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    setError("");

    if (!sellerName || !shopName || !email || !phone || !address) {
      setError("Please complete all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/sellers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sellerName, shopName, email, phone, address }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to register seller.");
        return;
      }

      setStatus(`Successfully registered "${shopName}" as a seller shop!`);
      setSellerName("");
      setShopName("");
      setEmail("");
      setPhone("");
      setAddress("");
    } catch (err) {
      setError("Unable to register seller. Server is offline.");
    }
  }

  return (
    <Layout>
      <main className="container">
        <div className="page-title">
          <p className="eyebrow">Seller</p>
          <h1>Register your pet business.</h1>
          <p className="lead">
            Share your shop details and start listing products or services for pet owners.
          </p>
        </div>
        <form className="content-box" onSubmit={handleSubmit}>
          {status && <p className="success-message" style={{ color: "#27ae60", fontWeight: 700 }}>{status}</p>}
          {error && <p className="error-message" style={{ color: "#c0392b", fontWeight: 700 }}>{error}</p>}
          <div className="form-grid">
            <div>
              <label htmlFor="seller-name">Seller Name</label>
              <input
                id="seller-name"
                type="text"
                placeholder="Enter seller name"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="shop-name">Shop Name</label>
              <input
                id="shop-name"
                type="text"
                placeholder="Enter shop name"
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="email">Email Address</label>
              <input
                id="email"
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                placeholder="Enter phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
              />
            </div>
          </div>
          <label htmlFor="address">Shop Address</label>
          <textarea
            id="address"
            placeholder="Enter complete address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
          <button type="submit">Register Seller</button>
        </form>
      </main>
    </Layout>
  );
}

export default Seller;

