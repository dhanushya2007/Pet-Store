import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../Assets/Images/logo.png";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import API_BASE from "../api";

/* ── Add Pet Modal (inline, for sellers) ─────────────────────── */
const SPECIES_OPTS = ["dog","cat","bird","rabbit","fish","hamster","other"];
const BLANK = {
  name:"", species:"dog", breed:"", age:"", gender:"male",
  price:"", imageUrl:"", description:"", vaccinated:false,
  neutered:false, location:"", adoptionType:"adoption"
};

function AddPetModal({ onClose, authFetch }) {
  const [form, setForm] = useState(BLANK);
  const [msg,  setMsg]  = useState("");

  async function submit(e) {
    e.preventDefault();
    if (!form.name || !form.species || !form.age) {
      setMsg("Name, species and age are required.");
      return;
    }
    setMsg("Saving...");
    try {
      const res = await authFetch(`${API_BASE}/api/pets`, {
        method: "POST",
        body: JSON.stringify({ ...form, age: Number(form.age), price: Number(form.price||0) }),
      });
      const d = await res.json();
      if (res.ok) {
        setMsg("✓ Pet listed! It will appear on the adoption page.");
        setForm(BLANK);
        setTimeout(onClose, 2000);
      } else {
        setMsg(d.error || `Error ${res.status}: Could not save listing.`);
      }
    } catch (err) {
      setMsg("Network error — is the backend running on port 5000?");
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🐾 Add New Pet Listing</h2>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        {msg && <p className={`modal-msg${msg.startsWith("✓")?" ok":""}`}>{msg}</p>}
        <form className="modal-form" onSubmit={submit}>
          <div className="modal-grid">
            <div className="form-field">
              <label>Pet Name *</label>
              <input value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} required />
            </div>
            <div className="form-field">
              <label>Breed</label>
              <input value={form.breed} onChange={e=>setForm(p=>({...p,breed:e.target.value}))} />
            </div>
            <div className="form-field">
              <label>Species *</label>
              <select value={form.species} onChange={e=>setForm(p=>({...p,species:e.target.value}))}>
                {SPECIES_OPTS.map(s=><option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Gender</label>
              <select value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))}>
                {["male","female","unknown"].map(g=><option key={g} value={g}>{g}</option>)}
              </select>
            </div>
            <div className="form-field">
              <label>Age (months) *</label>
              <input type="number" min="0" value={form.age} onChange={e=>setForm(p=>({...p,age:e.target.value}))} required />
            </div>
            <div className="form-field">
              <label>Price ($)</label>
              <input type="number" min="0" value={form.price} onChange={e=>setForm(p=>({...p,price:e.target.value}))} />
            </div>
            <div className="form-field">
              <label>Listing Type</label>
              <select value={form.adoptionType} onChange={e=>setForm(p=>({...p,adoptionType:e.target.value}))}>
                <option value="adoption">Free Adoption</option>
                <option value="sale">For Sale</option>
                <option value="both">Adopt or Buy</option>
              </select>
            </div>
            <div className="form-field">
              <label>Location</label>
              <input value={form.location} onChange={e=>setForm(p=>({...p,location:e.target.value}))} />
            </div>
            <div className="form-field modal-full">
              <label>Main Image URL</label>
              <input type="url" value={form.imageUrl}
                onChange={e=>setForm(p=>({...p,imageUrl:e.target.value}))}
                placeholder="https://example.com/pet.jpg" />
              {form.imageUrl && (
                <img src={form.imageUrl} alt="preview"
                  style={{marginTop:6,width:70,height:70,borderRadius:8,objectFit:"cover"}}
                  onError={e=>e.target.style.display="none"} />
              )}
            </div>
            <div className="form-field modal-full">
              <label>Description</label>
              <textarea rows={2} value={form.description}
                onChange={e=>setForm(p=>({...p,description:e.target.value}))} />
            </div>
            <div className="form-field modal-full" style={{display:"flex",gap:20,alignItems:"center"}}>
              <label style={{display:"flex",gap:6,alignItems:"center",cursor:"pointer"}}>
                <input type="checkbox" checked={form.vaccinated}
                  onChange={e=>setForm(p=>({...p,vaccinated:e.target.checked}))} />
                💉 Vaccinated
              </label>
              <label style={{display:"flex",gap:6,alignItems:"center",cursor:"pointer"}}>
                <input type="checkbox" checked={form.neutered}
                  onChange={e=>setForm(p=>({...p,neutered:e.target.checked}))} />
                ✂️ Neutered
              </label>
            </div>
          </div>
          <button type="submit" className="modal-submit">Submit Listing</button>
        </form>
      </div>
    </div>
  );
}

/* ── Main Layout ─────────────────────────────────────────────── */
function Layout({ children }) {
  const { cartCount, toast } = useCart();
  const { user, isAuthenticated, isAdmin, isSeller, logout, authFetch } = useAuth();
  const navigate = useNavigate();
  const [showAddPet, setShowAddPet] = useState(false);
  const [menuOpen,   setMenuOpen]   = useState(false);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const accountHref = isAuthenticated
    ? (isAdmin ? "/admin" : isSeller ? "/seller/dashboard" : "/order-history")
    : "/login";
  const accountLabel = isAuthenticated ? user?.name?.split(" ")[0] : "Account";
  const accountSub   = isAuthenticated
    ? (isAdmin ? "Admin Panel" : isSeller ? "Seller Panel" : "Order History")
    : "Login / Register";

  return (
    <>
      {toast && <div className="cart-toast" role="alert">{toast}</div>}
      {showAddPet && <AddPetModal onClose={() => setShowAddPet(false)} authFetch={authFetch} />}

      {/* ══ HEADER ══════════════════════════════════════════ */}
      <header className="site-header">
        <div className="header-inner">

          {/* Brand */}
          <NavLink to="/" className="brand">
            <img src={logo} alt="PetStore" />
            <div className="brand-text">
              <div className="brand-name">Pet<span>Store</span></div>
              <div className="brand-tagline">Happy Pets, Happy Life!</div>
            </div>
          </NavLink>

          {/* Search */}
          <div className="header-search">
            <input type="text" placeholder="Search pets, breeds..." id="global-search" aria-label="Search" />
            <button className="search-btn" aria-label="Search">🔍</button>
          </div>

          {/* Actions */}
          <div className="header-actions">
            <NavLink to={accountHref} className="header-action-btn" id="my-account-btn">
              <span className="icon">👤</span>
              <span>{accountLabel}<br/><small>{accountSub}</small></span>
            </NavLink>

            {/* Wishlist — only when logged in as user */}
            {isAuthenticated && !isAdmin && (
              <NavLink to="/wishlist" className="header-action-btn" id="wishlist-btn">
                <span className="icon">❤️</span>
                <span>Wishlist</span>
              </NavLink>
            )}

            {/* Cart */}
            <NavLink to="/cart" className="header-action-btn cart-btn" id="cart-btn">
              <span className="icon">🛒</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              <span>Cart</span>
            </NavLink>

            {/* Logout */}
            {isAuthenticated && (
              <button className="header-action-btn logout-btn" onClick={handleLogout} id="logout-btn">
                <span className="icon">🚪</span>
                <span>Logout</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* ══ NAV BAR ═════════════════════════════════════════ */}
      {isAuthenticated && (
        <nav className="site-nav">
          <div className="nav-inner">
            <button
              className={`nav-hamburger${menuOpen?" open":""}`}
              onClick={() => setMenuOpen(m => !m)}
              aria-label="Toggle menu">
              <span/><span/><span/>
            </button>

            <ul className={`nav-links${menuOpen?" nav-open":""}`}>
              <li><NavLink to="/" end className={({isActive})=>isActive?"active":undefined} onClick={()=>setMenuOpen(false)}>Home</NavLink></li>
              <li><NavLink to="/adoption" className={({isActive})=>isActive?"active":undefined} onClick={()=>setMenuOpen(false)}>🐾 Adoption</NavLink></li>

              {/* Add Pet — sellers only */}
              {isSeller && (
                <li>
                  <button className="nav-link-btn" onClick={() => { setShowAddPet(true); setMenuOpen(false); }}>
                    ➕ Add Pet
                  </button>
                </li>
              )}

              {/* Dashboard — for sellers only */}
              {isAuthenticated && isSeller && (
                <li>
                  <NavLink to="/seller/dashboard"
                    className={({isActive})=>isActive?"active":undefined}
                    onClick={()=>setMenuOpen(false)}>
                    👤 My Dashboard
                  </NavLink>
                </li>
              )}

              {/* Order History — for standard buyers */}
              {isAuthenticated && !isAdmin && !isSeller && (
                <li>
                  <NavLink to="/order-history"
                    className={({isActive})=>isActive?"active":undefined}
                    onClick={()=>setMenuOpen(false)}>
                    📦 Order History
                  </NavLink>
                </li>
              )}

              {/* Pending Requests — for standard buyers */}
              {isAuthenticated && !isAdmin && !isSeller && (
                <li>
                  <NavLink to="/my-pets"
                    className={({isActive})=>isActive?"active":undefined}
                    onClick={()=>setMenuOpen(false)}>
                    🐾 Pending Requests
                  </NavLink>
                </li>
              )}



              {/* My Listings — for sellers */}
              {isSeller && (
                <li>
                  <NavLink to="/seller/dashboard" className={({isActive})=>isActive?"active":undefined} onClick={()=>setMenuOpen(false)}>
                    📋 My Listings
                  </NavLink>
                </li>
              )}

              {/* Admin panel */}
              {isAdmin && (
                <li>
                  <NavLink to="/admin" className={({isActive})=>isActive?"active":undefined} onClick={()=>setMenuOpen(false)}>
                    🔐 Admin Panel
                  </NavLink>
                </li>
              )}

              <li><NavLink to="/enquiry" className={({isActive})=>isActive?"active":undefined} onClick={()=>setMenuOpen(false)}>Enquiry</NavLink></li>
              <li><NavLink to="/about"   className={({isActive})=>isActive?"active":undefined} onClick={()=>setMenuOpen(false)}>About</NavLink></li>
              <li><NavLink to="/contact" className={({isActive})=>isActive?"active":undefined} onClick={()=>setMenuOpen(false)}>Contact</NavLink></li>
            </ul>
          </div>
        </nav>
      )}

      {/* ══ PAGE CONTENT ════════════════════════════════════ */}
      {children}

      {/* ══ FOOTER ══════════════════════════════════════════ */}
      <footer className="site-footer">
        <div className="footer-inner">
          <div>
            <div className="footer-brand-img">
              <img src={logo} alt="PetStore" />
              <div>
                <div className="footer-brand-name">Pet<span>Store</span></div>
                <div className="footer-tagline">Happy Pets, Happy Life!</div>
              </div>
            </div>
            <p className="footer-desc">Your trusted platform for pet adoption and care. Every pet deserves a loving home.</p>
            <div className="footer-socials">
              <a href="#facebook" className="social-btn" aria-label="Facebook">f</a>
              <a href="#instagram" className="social-btn" aria-label="Instagram">📷</a>
              <a href="#twitter" className="social-btn" aria-label="Twitter">𝕏</a>
              <a href="#youtube" className="social-btn" aria-label="YouTube">▶</a>
            </div>
          </div>

          <div className="footer-col">
            <h4>Quick Links</h4>
            <ul>
              <li><NavLink to="/">Home</NavLink></li>
              <li><NavLink to="/adoption">Adoption</NavLink></li>
              <li><NavLink to="/about">About Us</NavLink></li>
              <li><NavLink to="/faq">FAQs</NavLink></li>
              <li><NavLink to="/contact">Contact Us</NavLink></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>My Account</h4>
            <ul>
              <li><NavLink to={accountHref}>Dashboard</NavLink></li>
              <li><NavLink to="/cart">Cart</NavLink></li>
              <li><NavLink to="/adoption">Browse Pets</NavLink></li>
              <li><NavLink to="/faq">FAQs</NavLink></li>
              <li><NavLink to="/enquiry">Support</NavLink></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Pets</h4>
            <ul>
              <li><NavLink to="/adoption">All Pets</NavLink></li>
              <li><NavLink to="/adoption">Dogs</NavLink></li>
              <li><NavLink to="/adoption">Cats</NavLink></li>
              <li><NavLink to="/adoption">Birds</NavLink></li>
              <li><NavLink to="/adoption">Rabbits</NavLink></li>
            </ul>
          </div>

          <div className="footer-col">
            <h4>Newsletter</h4>
            <p style={{fontSize:"13px",color:"rgba(255,255,255,0.6)",marginBottom:0}}>
              Get the latest updates on new pets and special offers.
            </p>
            <div className="newsletter-input-wrap">
              <input type="email" placeholder="Enter your email" id="newsletter-email" aria-label="Newsletter email" />
              <button className="btn-subscribe">Subscribe</button>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© 2024 Pet Store. All Rights Reserved.</span>
          <div className="footer-payments">
            <span className="pay-badge">VISA</span>
            <span className="pay-badge">MC</span>
            <span className="pay-badge">PayPal</span>
            <span className="pay-badge">⬛Pay</span>
          </div>
          <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>
            <NavLink to="/privacy">Privacy Policy</NavLink>
            <NavLink to="/terms">Terms &amp; Conditions</NavLink>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Layout;
