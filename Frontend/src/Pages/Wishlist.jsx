import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout";
import API_BASE from "../api";
import { useAuth } from "../context/AuthContext";
import { FALLBACK_IMGS } from "../data/staticPets";

export default function Wishlist() {
  const { authFetch, isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(null);

  const loadData = useCallback(async () => {
    if (!isAuthenticated) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const meRes = await authFetch(`${API_BASE}/api/auth/me`);
      if (meRes.ok) {
        const meData = await meRes.json();
        // wishlist items come back as populated pet objects or string IDs
        const mapped = (meData.wishlist || []).map(item => {
          if (item && typeof item === 'object') return item;   // already populated pet
          return { _id: item, name: 'Pet' };                  // fallback string id
        });
        setWishlist(mapped);
      } else if (meRes.status === 401) {
        setError('Your session has expired. Please log out and log in again.');
      } else {
        setError('Could not load wishlist. Please try again.');
      }
    } catch (_) {
      setError('Could not connect to the server. Please check your connection and try again.');
    } finally {
      setLoading(false);
    }
  }, [authFetch, isAuthenticated]);

  useEffect(() => { loadData(); }, [loadData]);

  async function removeFromWishlist(petId) {
    try {
      await authFetch(`${API_BASE}/api/auth/wishlist/${petId}`, { method: 'PUT' });
      setWishlist(prev => prev.filter(p => (p._id || p) !== petId));
    } catch (_) {}
  }

  function getPetImg(pet) {
    if (pet.imageUrl) return pet.imageUrl;
    if (pet.imageUrls?.[0]) return pet.imageUrls[0];
    return FALLBACK_IMGS[pet.species?.toLowerCase()] || FALLBACK_IMGS['dog'];
  }

  return (
    <Layout>
      <div style={{ padding: '60px 20px', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>

        <div style={{ marginBottom: '36px' }}>
          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '8px' }}>
            ❤️ My Wishlist
          </h1>
          <p style={{ color: 'var(--text-light)', fontSize: '1.05rem' }}>
            Pets you've saved for later.
          </p>
        </div>

        {!isAuthenticated ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '48px' }}>🔒</span>
            <h3 style={{ marginTop: '16px', fontSize: '1.4rem' }}>Please log in</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', marginBottom: '24px' }}>
              You need to be logged in to view your wishlist.
            </p>
            <Link to="/login" className="btn-primary">Login →</Link>
          </div>
        ) : loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#888' }}>
            <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
            Loading your wishlist...
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff5f5', borderRadius: '16px', border: '1px solid #ffe0e0' }}>
            <span style={{ fontSize: '40px' }}>⚠️</span>
            <h3 style={{ marginTop: '16px', color: '#c0392b' }}>Connection Error</h3>
            <p style={{ color: '#888', marginTop: '8px', marginBottom: '24px' }}>{error}</p>
            <button className="btn-primary" onClick={loadData}>🔄 Try Again</button>
          </div>
        ) : wishlist.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <span style={{ fontSize: '48px' }}>💔</span>
            <h3 style={{ marginTop: '16px', fontSize: '1.4rem' }}>Your wishlist is empty</h3>
            <p style={{ color: 'var(--text-light)', marginTop: '8px', marginBottom: '24px' }}>
              Find a pet you love and click the ❤️ to save them here!
            </p>
            <Link to="/adoption" className="btn-primary">Browse Pets →</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '24px' }}>
            {wishlist.map(p => (
              <div key={p._id || p} style={{
                background: '#fff',
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 4px 16px rgba(0,0,0,0.07)',
                transition: 'transform 0.2s, box-shadow 0.2s',
                position: 'relative',
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)'; }}
                onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.07)'; }}
              >
                {/* Remove button */}
                <button
                  onClick={() => removeFromWishlist(p._id || p)}
                  style={{
                    position: 'absolute', top: 10, right: 10,
                    background: 'rgba(255,255,255,0.9)', border: 'none',
                    borderRadius: '50%', width: 32, height: 32,
                    cursor: 'pointer', fontSize: '1rem', zIndex: 2,
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                  }}
                  title="Remove from wishlist"
                >
                  ✕
                </button>

                <Link to={`/pets/${p._id || p}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ height: '180px', overflow: 'hidden', background: '#f5f5f5' }}>
                    <img
                      src={getPetImg(p)}
                      alt={p.name || 'Pet'}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={e => { e.target.onerror = null; e.target.src = FALLBACK_IMGS['dog']; }}
                    />
                  </div>
                  <div style={{ padding: '16px' }}>
                    <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: '4px' }}>
                      {p.name || 'Pet'}
                    </div>
                    {p.breed && (
                      <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '4px' }}>{p.breed}</div>
                    )}
                    {p.species && (
                      <span style={{
                        fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase',
                        background: '#f0fdf4', color: '#166534', padding: '2px 8px', borderRadius: '10px'
                      }}>
                        {p.species}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
