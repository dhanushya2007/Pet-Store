import React, { useState } from "react";
import Layout from "../Components/Layout";
import API_BASE from "../api";

function PetShopAdd() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Pet Food");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus("");
    setError("");

    if (!name || !category || !price || !stock || !description) {
      setError("Please complete all fields.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/products`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, category, price, stock, description }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to add pet listing.");
        return;
      }

      setStatus(`Successfully added "${name}" to listings!`);
      setName("");
      setPrice("");
      setStock("");
      setDescription("");
    } catch (err) {
      setError("Unable to add listing. Server is offline.");
    }
  }

  return (
    <Layout>
      <main className="container">
        <div className="page-title">
          <p className="eyebrow">Pet Shop Add</p>
          <h1>Add a pet product or service.</h1>
          <p className="lead">
            Create a simple listing for food, toys, grooming, health care, or pet services.
          </p>
        </div>
        <form className="content-box" onSubmit={handleSubmit}>
          {status && <p className="success-message" style={{ color: "#27ae60", fontWeight: 700 }}>{status}</p>}
          {error && <p className="error-message" style={{ color: "#c0392b", fontWeight: 700 }}>{error}</p>}
          <div className="form-grid">
            <div>
              <label htmlFor="item-name">Item Name</label>
              <input
                id="item-name"
                type="text"
                placeholder="Enter item name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option>Pet Food</option>
                <option>Pet Toys</option>
                <option>Grooming</option>
                <option>Accessories</option>
                <option>Health Care</option>
              </select>
            </div>
            <div>
              <label htmlFor="price">Price ($)</label>
              <input
                id="price"
                type="text"
                placeholder="Enter price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
              />
            </div>
            <div>
              <label htmlFor="stock">Stock</label>
              <input
                id="stock"
                type="number"
                placeholder="Available quantity"
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                required
              />
            </div>
          </div>
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            placeholder="Write short product details"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <button type="submit">Add Listing</button>
        </form>
      </main>
    </Layout>
  );
}

export default PetShopAdd;

