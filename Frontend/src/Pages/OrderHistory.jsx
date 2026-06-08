import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout";
import API_BASE from "../api";
import { useAuth } from "../context/AuthContext";
import { FALLBACK_IMGS } from "../data/staticPets";

const StatusBadge = ({ status }) => {
  const s = status?.toLowerCase() || 'pending';
  const displayStatus = s === 'pending' ? 'requested' : s;

  const colors = {
    requested:  { bg: '#fff3cd', color: '#856404' },
    approved:   { bg: '#d4edda', color: '#155724' },
    rejected:   { bg: '#f8d7da', color: '#721c24' },
    processing: { bg: '#cce5ff', color: '#004085' },
    shipped:    { bg: '#e2e3e5', color: '#383d41' },
    delivered:  { bg: '#d4edda', color: '#155724' },
  };
  const { bg, color } = colors[displayStatus] || { bg: '#eee', color: '#333' };
  return (
    <span style={{
      backgroundColor: bg, color,
      padding: '4px 12px', borderRadius: '20px',
      fontSize: '0.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px'
    }}>
      {displayStatus}
    </span>
  );
};

export default function OrderHistory() {
  const { authFetch, isAuthenticated } = useAuth();
  const [historyItems, setHistoryItems] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [error, setError]               = useState(null);

  const loadData = useCallback(async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const [appsRes, ordersRes] = await Promise.all([
        authFetch(`${API_BASE}/api/applications/my`),
        authFetch(`${API_BASE}/api/orders/my`),
      ]);

      let appsData   = [];
      let ordersData = [];

      if (appsRes.ok)   appsData   = await appsRes.json();
      if (ordersRes.ok) ordersData = await ordersRes.json();

      // Normalize only APPROVED adoption applications
      const normalizedApps = (Array.isArray(appsData) ? appsData : [])
        .filter(a => a.status === 'approved')
        .map(a => ({
          _id:    a._id,
          type:   'Adoption Request',
          title:  a.petName || 'Pet',
          petImg: a.petId?.imageUrl || (a.petId?.species ? FALLBACK_IMGS[a.petId.species] : null) || FALLBACK_IMGS['dog'],
          breed:  a.petId?.breed || '',
          location: a.location || '',
          date:   a.createdAt,
          status: a.status,
          total:  null,
          note:   a.sellerNote,
          items:  [],
        }));

      // Normalize cart orders
      const normalizedOrders = (Array.isArray(ordersData) ? ordersData : []).map(o => ({
        _id:    o._id,
        type:   'Purchase',
        title:  `Order #${o._id.toString().slice(-6).toUpperCase()}`,
        petImg: o.items?.[0]?.imageUrl || null,
        breed:  o.items?.length > 1 ? `${o.items.length} items` : (o.items?.[0]?.name || ''),
        date:   o.createdAt,
        status: o.status,
        total:  o.total,
        note:   null,
        items:  o.items,
      }));

      const merged = [...normalizedApps, ...normalizedOrders]
        .sort((a, b) => new Date(b.date) - new Date(a.date));
      setHistoryItems(merged);

    } catch (err) {
      setError('Could not connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [authFetch, isAuthenticated]);

  useEffect(() => { loadData(); }, [loadData]);

  return (
    <Layout>
      <div style={{ padding: '60px 20px', maxWidth: '860px', margin: '0 auto', minHeight: '80vh' }}>

        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            📦 Order History
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>
            Track your pet store purchases and approved adoptions in one place.
          </p>
        </div>

        {!isAuthenticated ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '48px' }}>🔒</span>
            <h3 style={{ marginTop: '16px', fontSize: '1.4rem' }}>Please log in</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', marginBottom: '24px' }}>
              You need to be logged in to view your order history.
            </p>
            <Link to="/login" className="btn-primary">Login →</Link>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
            Loading your history...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff5f5', borderRadius: '16px', border: '1px solid #ffe0e0' }}>
            <span style={{ fontSize: '40px' }}>⚠️</span>
            <h3 style={{ marginTop: '16px', color: '#c0392b' }}>Connection Error</h3>
            <p style={{ color: '#888', marginTop: '8px', marginBottom: '24px' }}>{error}</p>
            <button className="btn-primary" onClick={loadData}>🔄 Try Again</button>
          </div>
        ) : historyItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '48px' }}>📭</span>
            <h3 style={{ marginTop: '16px', fontSize: '1.4rem' }}>No history yet</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', marginBottom: '24px' }}>
              You haven't placed any orders or adoption requests yet.
            </p>
            <Link to="/adoption" className="btn-primary">Browse Pets →</Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {historyItems.map(item => (
              <div key={item._id} style={{
                background: '#fff',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 2px 12px rgba(0,0,0,0.06)',
                borderLeft: `5px solid ${item.type === 'Adoption Request' ? '#ff9f43' : '#1dd1a1'}`,
                display: 'flex',
                gap: '20px',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
              }}>

                {/* Pet image for adoption requests */}
                {item.petImg && (
                  <img src={item.petImg} alt={item.title}
                    style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: '12px', flexShrink: 0 }}
                    onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMGS['dog']; }}
                  />
                )}

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: item.type === 'Adoption Request' ? '#ff9f43' : '#1dd1a1', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700, marginBottom: '4px' }}>
                        {item.type}
                      </div>
                      <h3 style={{ fontSize: '1.15rem', margin: 0, fontWeight: 700 }}>{item.title}</h3>
                      {item.breed && (
                        <div style={{ fontSize: '0.9rem', color: '#999', marginTop: '2px' }}>{item.breed}</div>
                      )}
                      {item.location && (
                        <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '2px' }}>📍 {item.location}</div>
                      )}
                      <div style={{ fontSize: '0.85rem', color: '#aaa', marginTop: '6px' }}>
                        {new Date(item.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <StatusBadge status={item.status} />
                      {item.total != null && (
                        <div style={{ fontSize: '1.2rem', fontWeight: 800, marginTop: '8px', color: 'var(--text-main)' }}>
                          ${item.total}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Order items */}
                  {item.items?.length > 0 && (
                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '12px' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#888', marginBottom: '8px' }}>ITEMS</div>
                      {item.items.map((it, idx) => (
                        <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.95rem', padding: '4px 0', color: 'var(--text-main)' }}>
                          <span>{it.qty}× {it.name}</span>
                          <span style={{ fontWeight: 600 }}>${it.price * it.qty}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Seller note */}
                  {item.note && (
                    <div style={{ background: '#fef9e7', border: '1px solid #fde68a', padding: '10px 14px', borderRadius: '8px', marginTop: '12px', fontSize: '0.9rem' }}>
                      <strong>💬 Seller note:</strong> {item.note}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
