import React, { useState } from "react";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout";
import { useCart } from "../context/CartContext";

import heroPets      from "../Assets/Images/hero_pets.png";
import hdGolden      from "../Assets/Images/hd_golden_retriever.png";
import hdShorthair   from "../Assets/Images/hd_british_shorthair.png";
import hdCorgi       from "../Assets/Images/hd_corgi.png";
import hdMaltese     from "../Assets/Images/hd_maltese.png";
import hdLabrador    from "../Assets/Images/hd_labrador.png";
import hdPersian     from "../Assets/Images/hd_persian_cat.png";
import hdBeagle      from "../Assets/Images/hd_beagle.png";
import hdPomeranian  from "../Assets/Images/hd_pomeranian.png";
import pedigree      from "../Assets/Images/pedigree.png";
import petFood       from "../Assets/Images/pet_food_promo.png";


/* ─── Data ──────────────────────────────────────────────────────── */
const CATEGORIES = [
  { icon: "🐕", name: "Dogs",        color: "#fff0e6" },
  { icon: "🐈", name: "Cats",        color: "#e8f0ff" },
  { icon: "🦜", name: "Birds",       color: "#e8ffe8" },
  { icon: "🐟", name: "Fish",        color: "#e6f7ff" },
  { icon: "🐇", name: "Small Pets",  color: "#fff5e6" },
  { icon: "🦮", name: "Accessories", color: "#f5e6ff" },
  { icon: "🥣", name: "Food",        color: "#fff0e0" },
  { icon: "🎾", name: "Toys",        color: "#e6ffe8" },
];

const ALL_PETS = [
  { id: 1,  img: hdGolden,     type: "Puppy",  name: "Golden Retriever",   price: 499,  stars: 5, reviews: 128,  badge: "Popular" },
  { id: 2,  img: hdShorthair,  type: "Kitten", name: "British Shorthair",  price: 299,  stars: 4, reviews: 96,   badge: "New"     },
  { id: 3,  img: hdCorgi,      type: "Puppy",  name: "Pembroke Corgi",     price: 450,  stars: 5, reviews: 74,   badge: null      },
  { id: 4,  img: hdMaltese,    type: "Puppy",  name: "Maltese Puppy",      price: 350,  stars: 4, reviews: 63,   badge: "Sale"    },
  { id: 5,  img: hdLabrador,   type: "Adult",  name: "Labrador Retriever", price: 520,  stars: 5, reviews: 212,  badge: "Popular" },
  { id: 6,  img: hdPersian,    type: "Kitten", name: "Persian Cat",        price: 380,  stars: 4, reviews: 87,   badge: null      },
  { id: 7,  img: hdBeagle,     type: "Puppy",  name: "Beagle Puppy",       price: 310,  stars: 4, reviews: 55,   badge: "New"     },
  { id: 8,  img: hdPomeranian, type: "Puppy",  name: "Pomeranian",         price: 420,  stars: 5, reviews: 143,  badge: "Popular" },
];


const TRUST_ITEMS = [
  { icon: "🏥", title: "Health Guarantee", desc: "We ensure the best for your pets" },
  { icon: "🏆", title: "Premium Quality",  desc: "Only the finest products for your pets" },
  { icon: "🔄", title: "Easy Returns",     desc: "Hassle-free returns within 30 days" },
  { icon: "👥", title: "Trusted by Thousands", desc: "Join 10,000+ happy pet parents" },
];

/* ─── Star Row ───────────────────────────────────────────────────── */
function Stars({ count }) {
  return (
    <>
      {"★".repeat(count)}{"☆".repeat(5 - count)}
    </>
  );
}

/* ─── Pet Card ───────────────────────────────────────────────────── */
function PetCard({ pet }) {
  const { wishlist, toggleWishlist, addToCart } = useCart();
  const [added, setAdded] = useState(false);
  const isWished = wishlist.includes(pet.id);

  function handleAddToCart() {
    addToCart({ id: pet.id, name: pet.name, price: pet.price, img: pet.img });
    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <div className="pet-card" id={`pet-card-${pet.id}`}>
      {/* ── Image area ── */}
      <div className="pet-card-img">
        <img src={pet.img} alt={pet.name} />

        {/* badge */}
        {pet.badge && (
          <span className={`pet-badge pet-badge--${pet.badge.toLowerCase()}`}>
            {pet.badge}
          </span>
        )}

        {/* wishlist heart — always visible */}
        <button
          className={`pet-wishlist${isWished ? " wished" : ""}`}
          onClick={() => toggleWishlist(pet.id)}
          aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
          id={`wishlist-${pet.id}`}
        >
          {isWished ? "❤️" : "🤍"}
        </button>
      </div>

      {/* ── Body ── */}
      <div className="pet-card-body">
        <div className="pet-type">{pet.type}</div>
        <div className="pet-name">{pet.name}</div>
        <div className="pet-price">${pet.price.toFixed(2)}</div>
        <div className="pet-stars">
          <Stars count={pet.stars} />
          <span className="pet-reviews"> ({pet.reviews})</span>
        </div>

        {/* ── Add to Cart button ── */}
        <button
          className={`btn-add-cart${added ? " btn-add-cart--added" : ""}`}
          onClick={handleAddToCart}
          id={`add-to-cart-${pet.id}`}
        >
          {added ? "✓ Added!" : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
}

/* ─── Homepage ───────────────────────────────────────────────────── */
function HomePage() {
  const [showAll, setShowAll] = useState(false);
  const visiblePets = showAll ? ALL_PETS : ALL_PETS.slice(0, 2);

  return (
    <Layout>
      <main>

        {/* ══ HERO ══════════════════════════════════════════════ */}
        <section className="hero">
          <div className="hero-inner">
            {/* Left content */}
            <div className="hero-content">
              <div className="hero-eyebrow">🐾 Happy Pets, Happy Life</div>
              <h1 className="hero-title">
                Because They Deserve<br />
                The <span className="highlight">Best Care</span>
              </h1>
              <p className="hero-desc">
                Explore our wide range of pet products and find everything
                your furry friends need — food, toys, accessories &amp; more.
              </p>
              <div className="hero-btns">
                <Link to="/adoption" className="btn-primary" id="hero-shop-now">
                  Shop Now →
                </Link>
                <Link to="/about" className="btn-outline" id="hero-about-us">
                  About Us
                </Link>
              </div>

              <div className="hero-badges">
                <div className="hero-badge">
                  <div className="hero-badge-icon">🚚</div>
                  <div className="hero-badge-text">
                    <strong>Free Shipping</strong>
                    <span>On orders over $49</span>
                  </div>
                </div>
                <div className="hero-badge">
                  <div className="hero-badge-icon">🔒</div>
                  <div className="hero-badge-text">
                    <strong>Secure Payment</strong>
                    <span>100% secure payment</span>
                  </div>
                </div>
                <div className="hero-badge">
                  <div className="hero-badge-icon">💬</div>
                  <div className="hero-badge-text">
                    <strong>24/7 Support</strong>
                    <span>We're here to help</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right image */}
            <div className="hero-image-wrap">
              <img src={heroPets} alt="Happy puppy and kitten" />
              <div className="hero-trust-pill">
                <span className="hero-trust-label">Trusted by</span>
                <strong className="hero-trust-count">10K+</strong>
                <span className="hero-trust-label">Pet Parents</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ CATEGORIES ════════════════════════════════════════ */}
        <section className="categories-section">
          <div className="categories-inner">
            <div className="categories-row">
              {CATEGORIES.map((c) => (
                <Link
                  to="/adoption"
                  key={c.name}
                  className="cat-item"
                  id={`cat-${c.name.toLowerCase().replace(/\s/g, "-")}`}
                >
                  <div className="cat-icon" style={{ background: c.color }}>
                    {c.icon}
                  </div>
                  <div className="cat-name">{c.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ══ FEATURED PETS + PROMO ════════════════════════════ */}
        <section className="featured-section">

          {/* Left: Pets */}
          <div className="featured-left">
            <div className="section-header">
              <div className="section-title">
                <span className="paw">🐾</span> Featured Pets
              </div>
              <button
                className="view-all-btn"
                onClick={() => setShowAll((v) => !v)}
                id="view-all-btn"
              >
                {showAll ? "Show Less ↑" : "View All →"}
              </button>
            </div>

            <div className="pets-grid">
              {visiblePets.map((pet) => (
                <PetCard key={pet.id} pet={pet} />
              ))}
            </div>
          </div>

          {/* Right: Promo */}
          <div className="featured-right">
            <div className="promo-banner" id="promo-banner">
              <div className="promo-content">
                <div className="promo-off">Up to 30% OFF</div>
                <div className="promo-title">On Selected Pet Foods</div>
                <div className="promo-sub">Healthy food for a happy life.</div>
                <Link to="/pet-shop-add" className="btn-primary" id="promo-shop-now">
                  Shop Now →
                </Link>
              </div>
              <img src={petFood} alt="Premium pet food" className="promo-img" />
            </div>

            {/* Quick stats */}
            <div className="quick-stats">
              <div className="qs-item">
                <span className="qs-num">1200+</span>
                <span className="qs-label">Pet Products</span>
              </div>
              <div className="qs-divider" />
              <div className="qs-item">
                <span className="qs-num">50+</span>
                <span className="qs-label">Pet Breeds</span>
              </div>
              <div className="qs-divider" />
              <div className="qs-item">
                <span className="qs-num">10K+</span>
                <span className="qs-label">Happy Owners</span>
              </div>
            </div>
          </div>
        </section>

        {/* ══ TRUST BADGES ══════════════════════════════════════ */}
        <section className="trust-section">
          <div className="trust-inner">
            {TRUST_ITEMS.map((t) => (
              <div className="trust-item" key={t.title}>
                <div className="trust-icon">{t.icon}</div>
                <div className="trust-text">
                  <strong>{t.title}</strong>
                  <span>{t.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ CTA BANNER ══════════════════════════════════════ */}
        <section className="cta-home-section">
          <div className="cta-home-banner">
            <div className="cta-home-content">
              <h2>🐾 Give a Pet a Forever Home</h2>
              <p>Hundreds of loving pets are waiting for adoption. Make a difference today — adopt, don't shop!</p>
            </div>
            <Link to="/adoption" className="btn-cta-home" id="cta-home-btn">
              View Pets for Adoption →
            </Link>
          </div>
        </section>

        {/* ══ TESTIMONIALS ═════════════════════════════════════ */}
        <section className="testimonials-section">
          <div className="testimonials-header">
            <h2>What Pet Owners <span className="highlight">Say</span></h2>
            <p>Real stories from our happy community</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="quote-mark">“</div>
              <div className="stars-row">★★★★★</div>
              <p className="testimonial-text">
                "PetZone made adopting my golden retriever so easy! The process was smooth and the team was super helpful."
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">👩</div>
                <div className="author-info">
                  <span className="author-name">Priya Sharma</span>
                  <span className="author-title">Dog Mom, Chennai</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="quote-mark">“</div>
              <div className="stars-row">★★★★★</div>
              <p className="testimonial-text">
                "Best pet products at great prices. My cat absolutely loves the toys I ordered. Fast delivery too!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">👨</div>
                <div className="author-info">
                  <span className="author-name">Rahul Verma</span>
                  <span className="author-title">Cat Dad, Mumbai</span>
                </div>
              </div>
            </div>

            <div className="testimonial-card">
              <div className="quote-mark">“</div>
              <div className="stars-row">★★★★★</div>
              <p className="testimonial-text">
                "As a seller, PetZone gave my pet shop incredible visibility. Sales tripled in just 2 months!"
              </p>
              <div className="testimonial-author">
                <div className="author-avatar">👩‍💼</div>
                <div className="author-info">
                  <span className="author-name">Ananya Iyer</span>
                  <span className="author-title">Pet Shop Owner, Bangalore</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>
    </Layout>
  );
}

export default HomePage;
