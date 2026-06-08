import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import API_BASE from "../api";
import { FALLBACK_IMGS } from "../data/staticPets";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

function PetDetail() {
  const { id } = useParams();
  const { user, authFetch, isAuthenticated } = useAuth();
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [pet, setPet]         = useState(null);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg]         = useState("");
  const [msgText, setMsgText] = useState("");
  const [wished, setWished]   = useState(false);
  const [activeImg, setActiveImg] = useState(0);
  const [addedMsg, setAddedMsg] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/pets/${id}`)
      .then(r => r.json())
      .then(data => { setPet(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (user?.wishlist) setWished(user.wishlist.includes(id));
  }, [user, id]);

  async function toggleWishlist() {
    if (!isAuthenticated) { navigate("/login"); return; }
    try {
      await authFetch(`${API_BASE}/api/auth/wishlist/${id}`, { method: "PUT" });
      setWished(w => !w);
    } catch (_) {}
  }

  async function sendMessage(e) {
    e.preventDefault();
    if (!msgText.trim()) return;
    if (!isAuthenticated) { navigate("/login"); return; }
    try {
      await authFetch(`${API_BASE}/api/messages`, {
        method: "POST",
        body: JSON.stringify({ petId: id, toUserId: pet.seller._id, text: msgText }),
      });
      setMsg("Message sent to seller! 🎉");
      setMsgText("");
    } catch (_) { setMsg("Could not send message."); }
  }

  function handleCart() {
    addToCart({ id: pet._id, name: pet.name, price: pet.price, img: allImages[0] });
    setAddedMsg("✓ Added to cart!");
    setTimeout(() => setAddedMsg(""), 2000);
  }

  if (loading) return <Layout><div className="dash-loading">Loading pet details...</div></Layout>;
  if (!pet || pet.error) return <Layout><div className="dash-loading">Pet not found.</div></Layout>;

  const ageFmt = pet.age < 12 ? `${pet.age} months` : `${(pet.age/12).toFixed(1)} years`;

  // Build image array: main + extras
  const allImages = [
    ...(pet.imageUrl ? [pet.imageUrl] : [FALLBACK_IMGS[pet.species?.toLowerCase()] || FALLBACK_IMGS['dog']]),
    ...(pet.imageUrls || []).filter(u => u && u !== pet.imageUrl),
  ];

  return (
    <Layout>
      <main className="pet-detail-page">
        <div className="pet-detail-inner">
          {/* ── Image Gallery ── */}
          <div className="pet-detail-img-wrap">
            <div className="pet-gallery">
              {allImages.length > 0
                ? <img src={allImages[activeImg]} alt={pet.name} className="pet-gallery-main"
                    onError={e => e.target.src = "https://placehold.co/600x450/e4ede5/2c4a30?text=🐾"} />
                : <div className="pet-detail-img pet-detail-img--placeholder">🐾</div>
              }
              {allImages.length > 1 && (
                <div className="pet-gallery-thumbs">
                  {allImages.map((src, i) => (
                    <img key={i} src={src} alt={`${pet.name} ${i+1}`}
                      className={`pet-gallery-thumb${activeImg===i?" active":""}`}
                      onClick={() => setActiveImg(i)}
                      onError={e => e.target.style.display="none"} />
                  ))}
                </div>
              )}
            </div>
            <button className={`pet-detail-wish${wished?" wished":""}`} onClick={toggleWishlist}>
              {wished ? "❤️ Wishlisted" : "🤍 Wishlist"}
            </button>
          </div>

          {/* ── Info ── */}
          <div className="pet-detail-info">
            <div className="pet-detail-badges">
              <span className="pet-badge-species">{pet.species}</span>
              <span className="pet-badge-type">
                {pet.adoptionType==="adoption" ? "🐾 Free Adoption" : pet.adoptionType==="both" ? "🐾 Adopt or Buy" : "🛒 For Sale"}
              </span>
              {pet.vaccinated && <span className="pet-badge-vax">💉 Vaccinated</span>}
              {pet.neutered   && <span className="pet-badge-vax">✂️ Neutered</span>}
            </div>

            <h1 className="pet-detail-name">{pet.name}</h1>
            <p className="pet-detail-breed">{pet.breed} · {pet.species} · {ageFmt} · {pet.gender}</p>
            {pet.price > 0 && <p className="pet-detail-price">₹{pet.price}</p>}
            <p className="pet-detail-desc">{pet.description || "No description provided."}</p>
            {pet.location && <p className="pet-detail-loc">📍 {pet.location}</p>}

            {/* ── Actions ── */}
            <div className="pet-detail-actions">
              {pet.adoptionType !== "sale" && (
                <Link to="/application"
                  state={{
                    petName:    pet.name,
                    petId:      pet._id,
                    sellerId:   pet.seller?._id,
                    sellerName: pet.seller?.name || pet.seller?.shopName || "Local Shelter",
                    sellerShop: pet.seller?.shopName || pet.seller?.name || "Local Shelter",
                    petImg:     allImages[0],
                  }}
                  className="btn-primary" id="adopt-btn">🐾 Apply to Adopt</Link>
              )}
              {pet.adoptionType !== "adoption" && (
                <button className="btn-cart" onClick={handleCart} id="buy-btn">
                  {addedMsg || "🛒 Add to Cart"}
                </button>
              )}
            </div>

            {/* ── Seller Card ── */}
            {pet.seller && (
              <div className="pet-seller-card">
                <div className="pet-seller-avatar">{pet.seller.name?.[0]?.toUpperCase()||"S"}</div>
                <div>
                  <div className="pet-seller-name">{pet.seller.shopName||pet.seller.name}</div>
                  <div className="pet-seller-email">{pet.seller.email}</div>
                </div>
              </div>
            )}

            {/* ── Message Seller ── */}
            {pet.seller && user?.id !== pet.seller._id && (
              <form className="pet-msg-form" onSubmit={sendMessage}>
                <h4>💬 Message the Seller</h4>
                {msg && <p className="pet-msg-success">{msg}</p>}
                {!isAuthenticated && (
                  <p style={{ fontSize:12, color:"#f39c12", marginBottom:8 }}>
                    <Link to="/login" style={{ color:"var(--green)", fontWeight:700 }}>Login</Link> to send a message.
                  </p>
                )}
                <textarea value={msgText} onChange={e => setMsgText(e.target.value)}
                  placeholder="Ask about diet, behaviour, vaccinations..." rows={3} id="msg-text"
                  disabled={!isAuthenticated} />
                <button type="submit" id="send-msg-btn" disabled={!isAuthenticated}>Send Message</button>
              </form>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default PetDetail;
