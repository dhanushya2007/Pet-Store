import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import API_BASE from "../api";
import { useAuth } from "./AuthContext";

const CartContext = createContext();

// Stable session ID stored in localStorage
function getSessionId() {
  let sid = localStorage.getItem("ps_session");
  if (!sid) {
    sid = "sess_" + Math.random().toString(36).substr(2, 12);
    localStorage.setItem("ps_session", sid);
  }
  return sid;
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const sessionId = getSessionId();
  const [cart, setCart]       = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [toast, setToast]     = useState(null);
  const [loading, setLoading] = useState(false);

  // Sync wishlist from user profile on load/login
  useEffect(() => {
    if (user?.wishlist) {
      setWishlist(user.wishlist.map(w => w._id || w));
    }
  }, [user]);

  // ── Fetch cart from backend ───────────────────────────────────
  const fetchCart = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/api/cart/${sessionId}`);
      if (res.ok) {
        const data = await res.json();
        setCart(data.map(i => ({ id: i._id, petId: i.petId, name: i.name, price: i.price, qty: i.qty })));
      }
    } catch (_) {
      // backend offline — silent fail, cart remains local
    }
  }, [sessionId]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  // ── Show toast ────────────────────────────────────────────────
  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  }

  // ── Add to cart ───────────────────────────────────────────────
  async function addToCart(pet) {
    // Optimistic local update
    setCart(prev => {
      const existing = prev.find(i => i.petId === String(pet.id));
      if (existing) return prev.map(i => i.petId === String(pet.id) ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { id: "local_" + pet.id, petId: String(pet.id), name: pet.name, price: pet.price, qty: 1 }];
    });
    showToast(`${pet.name} added to cart! 🛒`);

    // Persist to backend
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/api/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ petId: String(pet.id), name: pet.name, price: pet.price, sessionId }),
      });
      if (res.ok) fetchCart(); // re-sync with real _id from mongo
    } catch (_) {} finally { setLoading(false); }
  }

  // ── Update qty ────────────────────────────────────────────────
  async function updateQty(item, newQty) {
    if (newQty < 1) return removeFromCart(item);
    setCart(prev => prev.map(i => i.id === item.id ? { ...i, qty: newQty } : i));
    try {
      await fetch(`${API_BASE}/api/cart/${item.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty: newQty }),
      });
    } catch (_) {}
  }

  // ── Remove item ───────────────────────────────────────────────
  async function removeFromCart(item) {
    setCart(prev => prev.filter(i => i.id !== item.id));
    try {
      await fetch(`${API_BASE}/api/cart/${item.id}`, { method: "DELETE" });
    } catch (_) {}
  }

  // ── Clear cart ────────────────────────────────────────────────
  async function clearCart() {
    setCart([]);
    try {
      await fetch(`${API_BASE}/api/cart/session/${sessionId}`, { method: "DELETE" });
    } catch (_) {}
  }

  // ── Wishlist (local only) ─────────────────────────────────────
  function toggleWishlist(petId) {
    setWishlist(prev =>
      prev.includes(petId) ? prev.filter(id => id !== petId) : [...prev, petId]
    );
  }

  const cartCount = cart.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  return (
    <CartContext.Provider value={{
      cart, wishlist, cartCount, cartTotal, loading,
      addToCart, updateQty, removeFromCart, clearCart, toggleWishlist, toast
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
