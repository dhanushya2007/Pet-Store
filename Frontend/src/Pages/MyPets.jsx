import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout";
import API_BASE from "../api";
import { useAuth } from "../context/AuthContext";
import { FALLBACK_IMGS } from "../data/staticPets";

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase() || "pending";
  const displayStatus = s === "pending" ? "requested" : s;
  const colors = {
    requested: { bg: "#fff3cd", color: "#856404", icon: "⏳" },
    approved:  { bg: "#d4edda", color: "#155724", icon: "✅" },
    rejected:  { bg: "#f8d7da", color: "#721c24", icon: "❌" },
  };
  const { bg, color, icon } = colors[displayStatus] || { bg: "#eee", color: "#333", icon: "❓" };
  return (
    <span style={{
      backgroundColor: bg, color,
      padding: "5px 14px", borderRadius: "20px",
      fontSize: "0.82rem", fontWeight: 700, textTransform: "uppercase",
      letterSpacing: "0.5px", display: "inline-flex", alignItems: "center", gap: 6
    }}>
      {icon} {displayStatus}
    </span>
  );
};

export default function MyPets() {
  const { authFetch, isAuthenticated } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState(null);
  const [filter, setFilter]     = useState("all");

  const loadData = useCallback(async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const res = await authFetch(`${API_BASE}/api/applications/my`);
      if (res.ok) {
        const data = await res.json();
        setRequests(Array.isArray(data) ? data.filter(r => r.status !== 'approved') : []);
      } else {
        let errStr = `HTTP Error ${res.status}`;
        try {
          const data = await res.json();
          if (data.error) errStr = data.error;
        } catch(e) {}
        setError(`Failed to load requests: ${errStr}`);
      }
    } catch (err) {
      setError(`Network error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [authFetch, isAuthenticated]);

  useEffect(() => { loadData(); }, [loadData]);

  function getPetImg(app) {
    if (app.petId?.imageUrl)        return app.petId.imageUrl;
    if (app.petId?.imageUrls?.[0])  return app.petId.imageUrls[0];
    const species = app.petId?.species?.toLowerCase();
    return FALLBACK_IMGS[species] || FALLBACK_IMGS["dog"];
  }

  const filtered = filter === "all"
    ? requests
    : requests.filter(r => {
        const s = r.status?.toLowerCase();
        if (filter === "requested") return s === "pending" || s === "requested";
        if (filter === "approved")  return s === "approved";
        if (filter === "rejected")  return s === "rejected";
        return true;
      });

  const counts = {
    all:       requests.length,
    requested: requests.filter(r => r.status === "pending").length,
    approved:  requests.filter(r => r.status === "approved").length,
    rejected:  requests.filter(r => r.status === "rejected").length,
  };

  return (
    <Layout>
      <div style={{ padding: "60px 20px", maxWidth: "1000px", margin: "0 auto", minHeight: "80vh" }}>

        {/* Header */}
        <div style={{ marginBottom: "30px" }}>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, color: "var(--text-main)", marginBottom: "8px" }}>
            ⏳ Pending Requests
          </h1>
          <p style={{ color: "var(--text-light)", fontSize: "1.05rem" }}>
            Track the status of your adoption applications. Approved requests are moved to your Order History.
          </p>
        </div>

        {!isAuthenticated ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: "48px" }}>🔒</span>
            <h3 style={{ marginTop: "16px" }}>Please log in</h3>
            <p style={{ color: "var(--text-light)", marginTop: "8px", marginBottom: "24px" }}>
              You need to be logged in to view your pets.
            </p>
            <Link to="/login" className="btn-primary">Login →</Link>
          </div>
        ) : loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#888" }}>
            <div style={{ fontSize: "2rem", marginBottom: "12px" }}>⏳</div>
            Loading your pets...
          </div>
        ) : error ? (
          <div style={{ textAlign: "center", padding: "60px 20px", background: "#fff5f5", borderRadius: "16px", border: "1px solid #ffe0e0" }}>
            <span style={{ fontSize: "40px" }}>⚠️</span>
            <h3 style={{ marginTop: "16px", color: "#c0392b" }}>Connection Error</h3>
            <p style={{ color: "#888", marginTop: "8px", marginBottom: "24px" }}>{error}</p>
            <button className="btn-primary" onClick={loadData}>🔄 Try Again</button>
          </div>
        ) : requests.length === 0 ? (
          <div style={{ textAlign: "center", padding: "70px 20px", background: "#fff", borderRadius: "16px", boxShadow: "0 4px 20px rgba(0,0,0,0.06)" }}>
            <span style={{ fontSize: "60px" }}>🐾</span>
            <h3 style={{ marginTop: "20px", fontSize: "1.5rem", fontWeight: 700 }}>No adoption requests yet</h3>
            <p style={{ color: "var(--text-light)", marginTop: "10px", marginBottom: "28px", fontSize: "1.05rem" }}>
              Browse our available pets and send your first adoption request!
            </p>
            <Link to="/adoption" className="btn-primary" style={{ fontSize: "1rem", padding: "14px 28px" }}>
              🐶 Browse Pets →
            </Link>
          </div>
        ) : (
          <>
            {/* Filter tabs */}
            <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
              {[
                { key: "all",       label: "All",      emoji: "📋" },
                { key: "requested", label: "Requested", emoji: "⏳" },
                { key: "approved",  label: "Approved",  emoji: "✅" },
                { key: "rejected",  label: "Rejected",  emoji: "❌" },
              ].map(({ key, label, emoji }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  style={{
                    padding: "8px 18px", borderRadius: "20px", border: "2px solid",
                    borderColor: filter === key ? "var(--green)" : "#e0e0e0",
                    background: filter === key ? "var(--green)" : "#fff",
                    color: filter === key ? "#fff" : "#555",
                    fontWeight: 600, cursor: "pointer", fontSize: "0.9rem",
                    transition: "all 0.2s",
                  }}
                >
                  {emoji} {label} ({counts[key]})
                </button>
              ))}
            </div>

            {filtered.length === 0 ? (
              <div style={{ textAlign: "center", padding: "40px", color: "#888" }}>
                No {filter} requests found.
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "24px" }}>
                {filtered.map(app => (
                  <div key={app._id} style={{
                    background: "#fff",
                    borderRadius: "16px",
                    overflow: "hidden",
                    boxShadow: "0 4px 16px rgba(0,0,0,0.07)",
                    transition: "transform 0.2s, box-shadow 0.2s",
                    borderTop: `4px solid ${
                      app.status === "approved" ? "#1dd1a1" :
                      app.status === "rejected" ? "#ff6b6b" : "#ff9f43"
                    }`,
                  }}
                    onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.12)"; }}
                    onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.07)"; }}
                  >
                    {/* Pet Image */}
                    <div style={{ height: "200px", overflow: "hidden", background: "#f5f5f5", position: "relative" }}>
                      <img
                        src={getPetImg(app)}
                        alt={app.petName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMGS["dog"]; }}
                      />
                      <div style={{ position: "absolute", top: 12, right: 12 }}>
                        <StatusBadge status={app.status} />
                      </div>
                    </div>

                    {/* Pet Info */}
                    <div style={{ padding: "20px" }}>
                      <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "6px" }}>
                        {app.petName}
                      </h3>
                      {app.petId?.breed && (
                        <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "8px" }}>
                          {app.petId.breed} · {app.petId.species}
                        </p>
                      )}

                      {/* Requested date */}
                      <p style={{ fontSize: "0.82rem", color: "#aaa", marginBottom: "14px" }}>
                        📅 Requested: {new Date(app.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                      </p>

                      {/* Seller note if approved/rejected */}
                      {app.sellerNote && (
                        <div style={{
                          background: app.status === "approved" ? "#f0fdf4" : "#fff5f5",
                          border: `1px solid ${app.status === "approved" ? "#bbf7d0" : "#ffe0e0"}`,
                          padding: "10px 14px", borderRadius: "10px", fontSize: "0.88rem", marginBottom: "14px"
                        }}>
                          <strong>💬 Seller says:</strong> {app.sellerNote}
                        </div>
                      )}

                      {/* View pet button */}
                      {app.petId?._id && (
                        <Link
                          to={`/pets/${app.petId._id}`}
                          style={{
                            display: "block", textAlign: "center",
                            padding: "10px", borderRadius: "10px",
                            background: "var(--green)", color: "#fff",
                            fontWeight: 600, textDecoration: "none", fontSize: "0.95rem",
                          }}
                        >
                          View Pet Details →
                        </Link>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
}
