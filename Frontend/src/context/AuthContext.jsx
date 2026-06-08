import React, { createContext, useContext, useState, useEffect } from "react";
import API_BASE from "../api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,  setUser]  = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore from localStorage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem("ps_token");
    const storedUser  = localStorage.getItem("ps_currentUser");
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  function login(userData, tokenStr) {
    setUser(userData);
    setToken(tokenStr);
    localStorage.setItem("ps_token",       tokenStr);
    localStorage.setItem("ps_currentUser", JSON.stringify(userData));
  }

  function logout() {
    setUser(null);
    setToken(null);
    localStorage.removeItem("ps_token");
    localStorage.removeItem("ps_currentUser");
  }

  // Refresh profile from server
  async function refreshUser() {
    const t = localStorage.getItem("ps_token");
    if (!t) return;
    try {
      const res  = await fetch(`${API_BASE}/api/auth/me`, {
        headers: { Authorization: `Bearer ${t}` }
      });
      if (res.ok) {
        const data = await res.json();
        const updated = { id: data._id, name: data.name, email: data.email, role: data.role, wishlist: data.wishlist };
        setUser(updated);
        localStorage.setItem("ps_currentUser", JSON.stringify(updated));
      }
    } catch (_) {}
  }

  // Authenticated fetch helper
  function authFetch(url, options = {}) {
    const t = token || localStorage.getItem("ps_token");
    return fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        ...(t ? { Authorization: `Bearer ${t}` } : {}),
      },
    });
  }

  const isAuthenticated = !!user;
  const isAdmin  = user?.role === "admin";
  const isSeller = user?.role === "seller" || user?.role === "admin";

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser, authFetch, isAuthenticated, isAdmin, isSeller }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
