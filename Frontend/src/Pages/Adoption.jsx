import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api";

import { STATIC_PETS, FALLBACK_IMGS } from "../data/staticPets";

const SPECIES_FILTERS = ["All", "Dogs", "Cats", "For Sale"];

/* ─── Adoption Pet Card — same UI as before ─────────────────── */
function Stars({ count = 4 }) {
  return (
    <span style={{ color: "#f5a623", fontSize: 12 }}>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </span>
  );
}

function getPetImg(pet) {
  if (pet.imageUrl) return pet.imageUrl;
  return FALLBACK_IMGS[pet.species] || FALLBACK_IMGS['dog'];
}

function getAgeStr(pet) {
  if (pet.age < 12) return `${pet.age} months`;
  return `${(pet.age / 12).toFixed(1)} year${pet.age >= 24 ? "s" : ""}`;
}

/* ─── Adoption Pet Card ─────────────────────────────────────── */
function AdoptionCard({ pet }) {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const { authFetch, isAuthenticated } = useAuth();
  const [added, setAdded] = useState(false);
  const isWished = wishlist.includes(pet._id);
  const genderLabel = pet.gender === "male" ? "Male" : pet.gender === "female" ? "Female" : "Unknown";

  function handleCart() {
    addToCart({ id: pet._id, name: pet.name, price: pet.price || 199, img: getPetImg(pet) });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  async function handleWishlist() {
    if (isAuthenticated) {
      try { await authFetch(`${API_BASE}/api/auth/wishlist/${pet._id}`, { method: "PUT" }); } catch (_) {}
    }
    toggleWishlist(pet._id);
  }

  return (
    <div className="adopt-card">
      <div className="adopt-card-img">
        <img src={getPetImg(pet)} alt={pet.name} />
        <span className={`adopt-gender adopt-gender--${pet.gender}`}>
          {pet.gender === "male" ? "♂" : "♀"} {genderLabel}
        </span>
        <button
          className={`pet-wishlist${isWished ? " wished" : ""}`}
          onClick={handleWishlist}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          id={`adopt-wish-${pet._id}`}
        >
          {isWished ? "❤️" : "🤍"}
        </button>
      </div>

      <div className="adopt-card-body">
        <div className="adopt-meta">
          <span className="adopt-breed">{pet.breed}</span>
          <span className="adopt-age">🕐 {getAgeStr(pet)}</span>
        </div>
        <div className="adopt-name">{pet.name}</div>
        <div className="adopt-desc">{pet.description}</div>

        <div style={{ fontSize: "0.85rem", color: "var(--green)", fontWeight: 600, marginTop: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
          ✅ {pet.seller?.shopName || pet.seller?.name || "Verified Shelter"}
        </div>

        <div className="adopt-stars">
          <Stars count={pet.stars || 4} />
          <span className="pet-reviews">({pet.reviews || 0} reviews)</span>
        </div>

        <div className="adopt-actions">
          <button
            className={`btn-add-cart${added ? " btn-add-cart--added" : ""}`}
            onClick={handleCart}
            id={`adopt-cart-${pet._id}`}
          >
            {added ? "✓ Added!" : `🛒 Add to Cart ${pet.price ? `(₹${pet.price})` : ''}`}
          </button>

          <Link
            to="/application"
            state={{ 
              petName: pet.name, 
              petId: pet._id, 
              sellerId: pet.seller?._id || pet.seller,
              sellerName: pet.seller?.name || pet.seller?.shopName || "Local Shelter",
              sellerShop: pet.seller?.shopName || pet.seller?.name || "Local Shelter",
              sellerEmail: pet.seller?.email || "contact@localshelter.com",
              petImg: getPetImg(pet)
            }}
            className="btn-adopt"
            id={`adopt-now-${pet._id}`}
          >
            🐾 Adopt Now
          </Link>
        </div>

        {/* View Details link for DB pets */}
        {!pet._id?.startsWith("s") && (
          <Link to={`/pets/${pet._id}`} className="adopt-view-link" id={`view-pet-${pet._id}`}>
            View Details →
          </Link>
        )}
      </div>
    </div>
  );
}

/* ─── Adoption Page ─────────────────────────────────────────── */
function Adoption() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [search, setSearch]             = useState("");
  const [sortBy, setSortBy]             = useState(""); // age or price
  const [dbPets, setDbPets]             = useState([]);
  const [loadingDB, setLoadingDB]       = useState(true);

  // Try to load from backend; fall back to static if empty/error
  useEffect(() => {
    fetch(`${API_BASE}/api/pets`)
      .then(r => r.json())
      .then(data => {
        setDbPets(Array.isArray(data) && data.length > 0 ? data : []);
        setLoadingDB(false);
      })
      .catch(() => setLoadingDB(false));
  }, []);

  // Use DB pets if available, else static fallback
  const allPets = dbPets.length > 0 ? dbPets : STATIC_PETS;

  let filtered = allPets.filter(p => {
    const sp = p.species?.toLowerCase() || "";
    const br = p.breed?.toLowerCase() || "";
    const nm = p.name?.toLowerCase() || "";

    const matchSearch = nm.includes(search.toLowerCase()) || br.includes(search.toLowerCase());
    if (!matchSearch) return false;
    if (activeFilter === "All")      return true;
    if (activeFilter === "Dogs")     return sp === "dog";
    if (activeFilter === "Cats")     return sp === "cat";
    if (activeFilter === "Birds")    return sp === "bird";
    if (activeFilter === "Rabbits")  return sp === "rabbit";
    if (activeFilter === "Fish")     return sp === "fish";
    if (activeFilter === "Other")    return sp === "other" || sp === "hamster";
    if (activeFilter === "For Sale") return p.adoptionType === "sale" || p.adoptionType === "both";
    return true;
  });

  // Apply sorting by Age or Price
  if (sortBy === "age-asc") filtered.sort((a, b) => (a.age || 0) - (b.age || 0));
  if (sortBy === "age-desc") filtered.sort((a, b) => (b.age || 0) - (a.age || 0));
  if (sortBy === "price-asc") filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  if (sortBy === "price-desc") filtered.sort((a, b) => (b.price || 0) - (a.price || 0));

  return (
    <Layout>
      {/* ── Page hero ── */}
      <section className="adoption-hero">
        <div className="adoption-hero-inner">
          <p className="eyebrow">Find a Friend</p>
          <h1>Find a Loving Companion</h1>
          <p className="adopt-hero-sub">
            Browse {allPets.length} wonderful pets looking for a forever home.
            Every adoption saves a life. 🐾
          </p>

          {/* Search & Sort */}
          <div className="adopt-search-wrap" style={{ display: 'flex', gap: '10px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <span className="adopt-search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name or breed..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="adopt-search"
                id="adopt-search"
              />
            </div>
            <select 
              value={sortBy} 
              onChange={e => setSortBy(e.target.value)}
              className="adopt-sort"
              style={{ padding: '0 16px', borderRadius: 'var(--radius-sm)', border: 'none', fontWeight: 600, outline: 'none' }}
            >
              <option value="">Sort By...</option>
              <option value="age-asc">Age (Youngest)</option>
              <option value="age-desc">Age (Oldest)</option>
              <option value="price-asc">Price (Low to High)</option>
              <option value="price-desc">Price (High to Low)</option>
            </select>
          </div>

          {/* Filter pills */}
          <div className="adopt-filters">
            {SPECIES_FILTERS.map(f => (
              <button
                key={f}
                className={`filter-pill${activeFilter === f ? " filter-pill--active" : ""}`}
                onClick={() => setActiveFilter(f)}
                id={`filter-${f.toLowerCase().replace(" ", "-")}`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pets grid ── */}
      <main className="adopt-main">
        <div className="adopt-count">
          {loadingDB
            ? "Loading pets..."
            : <>Showing <strong>{filtered.length}</strong> pets {dbPets.length > 0 ? "from our database" : "available for adoption"}</>
          }
        </div>
        {!loadingDB && filtered.length === 0 ? (
          <div className="adopt-empty">
            <span style={{ fontSize: 48 }}>🐾</span>
            <p>No pets found matching "{search}"</p>
            <button className="btn-primary" onClick={() => { setSearch(""); setActiveFilter("All"); }}>Clear Filters</button>
          </div>
        ) : (
          <div className="adopt-grid">
            {filtered.map(pet => (
              <AdoptionCard key={pet._id} pet={pet} />
            ))}
          </div>
        )}
      </main>
    </Layout>
  );
}

export default Adoption;
