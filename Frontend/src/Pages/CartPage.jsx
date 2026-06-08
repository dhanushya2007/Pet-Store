import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api";

function CartPage() {
  const { cart, cartTotal, updateQty, removeFromCart, clearCart, loading } = useCart();
  const { authFetch, isAuthenticated } = useAuth();
  const [ordered, setOrdered] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutError, setCheckoutError] = useState(null);

  async function handleCheckout() {
    setSubmitting(true);
    setCheckoutError(null);
    const shipping = cartTotal >= 49 ? 0 : 9.99;
    const orderTotal = parseFloat((cartTotal + shipping).toFixed(2));

    // Save order to backend if logged in
    if (isAuthenticated && cart.length > 0) {
      try {
        const res = await authFetch(`${API_BASE}/api/orders`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart.map(i => ({
              petId:    i.petId,   // actual Pet ObjectId, not CartItem _id
              name:     i.name,
              price:    i.price,
              qty:      i.qty,
              imageUrl: i.imageUrl || "",
            })),
            total: orderTotal,
          }),
        });
        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          setCheckoutError(errData.error || "Failed to save your order. Please try again.");
          setSubmitting(false);
          return;
        }
      } catch (err) {
        setCheckoutError("Could not connect to the server. Please check your connection.");
        setSubmitting(false);
        return;
      }
    }
    await clearCart();
    setSubmitting(false);
    setOrdered(true);
  }

  if (ordered) {
    return (
      <Layout>
        <div className="cart-success-page">
          <div className="cart-success-box">
            <span className="cart-success-icon">🎉</span>
            <h2>Order Placed Successfully!</h2>
            <p>Thank you for your purchase. Your pet is on its way to a happy new home!</p>
            {isAuthenticated && (
              <Link to="/order-history" className="btn-primary" style={{ marginBottom: 8 }}>
                View My Orders →
              </Link>
            )}
            <Link to="/" className="btn-primary">← Continue Shopping</Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (cart.length === 0) {
    return (
      <Layout>
        <div className="cart-empty-page">
          <div className="cart-empty-box">
            <span style={{ fontSize: 56 }}>🛒</span>
            <h2>Your cart is empty</h2>
            <p>Add some amazing pets and products to get started!</p>
            <Link to="/adoption" className="btn-primary" id="go-to-adoption">Browse Pets →</Link>
          </div>
        </div>
      </Layout>
    );
  }

  const shipping = cartTotal >= 49 ? 0 : 9.99;
  const total = cartTotal + shipping;

  return (
    <Layout>
      <main className="cart-page">
        <div className="cart-page-inner">
          <div className="cart-header-row">
            <h1 className="cart-page-title">🛒 Shopping Cart</h1>
            <span className="cart-item-count">{cart.length} item{cart.length !== 1 ? "s" : ""}</span>
          </div>

          <div className="cart-layout">
            <div className="cart-items-col">
              {cart.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-icon">🐾</div>
                  <div className="cart-item-info">
                    <div className="cart-item-name">{item.name}</div>
                    <div className="cart-item-price">${item.price.toFixed(2)} each</div>
                  </div>
                  <div className="cart-qty-controls">
                    <button className="qty-btn" onClick={() => updateQty(item, item.qty - 1)}
                      id={`qty-minus-${item.id}`} disabled={loading}>−</button>
                    <span className="qty-val">{item.qty}</span>
                    <button className="qty-btn" onClick={() => updateQty(item, item.qty + 1)}
                      id={`qty-plus-${item.id}`} disabled={loading}>+</button>
                  </div>
                  <div className="cart-item-subtotal">${(item.price * item.qty).toFixed(2)}</div>
                  <button className="cart-remove-btn" onClick={() => removeFromCart(item)}
                    id={`remove-${item.id}`} aria-label="Remove item">✕</button>
                </div>
              ))}

              <div className="cart-actions-row">
                <Link to="/adoption" className="btn-outline-sm">← Continue Shopping</Link>
                <button className="btn-clear" onClick={clearCart} id="clear-cart-btn">🗑 Clear Cart</button>
              </div>
            </div>

            <div className="cart-summary-col">
              <div className="cart-summary-box">
                <h3 className="cart-summary-title">Order Summary</h3>
                <div className="summary-row">
                  <span>Subtotal ({cart.length} items)</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="summary-row">
                  <span>Shipping</span>
                  <span className={shipping === 0 ? "free-shipping" : ""}>
                    {shipping === 0 ? "FREE 🎉" : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
                {shipping > 0 && (
                  <div className="shipping-note">
                    Add ${(49 - cartTotal).toFixed(2)} more for free shipping!
                  </div>
                )}
                <div className="summary-divider" />
                <div className="summary-row summary-total">
                  <strong>Total</strong>
                  <strong>${total.toFixed(2)}</strong>
                </div>
                <button className="btn-checkout" onClick={handleCheckout} id="checkout-btn"
                  disabled={loading || submitting}>
                  {submitting ? "Processing..." : "Checkout →"}
                </button>
                {checkoutError && (
                  <div style={{ marginTop: 10, padding: "10px 14px", background: "#fff0f0", border: "1px solid #ffc0c0", borderRadius: 8, color: "#c0392b", fontSize: "0.88rem", fontWeight: 600 }}>
                    ⚠️ {checkoutError}
                  </div>
                )}
                <div className="summary-secure">🔒 Secure checkout &nbsp;|&nbsp; Free returns</div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default CartPage;
