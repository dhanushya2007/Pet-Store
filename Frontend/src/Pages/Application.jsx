import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Layout from "../Components/Layout";
import FormField from "../Components/FormField";
import API_BASE from "../api";
import { useAuth } from "../context/AuthContext";

function Application() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // Pre-fill from navigation state (when clicking "Adopt Now" on a pet)
  const petFromState    = location.state?.petName    || "";
  const sellerName      = location.state?.sellerName || "";
  const sellerShop      = location.state?.sellerShop || sellerName;
  const sellerEmail     = location.state?.sellerEmail || "";
  const petImg          = location.state?.petImg     || "";

  const [applicantName,  setApplicantName]  = useState(user?.name || "");
  const [petName,        setPetName]        = useState(petFromState);
  const [petIdState,     setPetIdState]     = useState(location.state?.petId || null);
  const [sellerIdState,  setSellerIdState]  = useState(location.state?.sellerId || null);
  const [contactNumber,  setContactNumber]  = useState(user?.phone || "");
  const [locationVal,    setLocationVal]    = useState("");
  const [reason,         setReason]         = useState("");
  const [submitted,      setSubmitted]      = useState(false);
  const [status,         setStatus]         = useState("");
  const [submitting,     setSubmitting]     = useState(false);

  // Restore draft
  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem("ps_redirectAfterLogin", "/application");
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    const draft = JSON.parse(sessionStorage.getItem("ps_applicationDraft") || "null");
    if (draft && !petFromState) {
      setApplicantName(draft.applicantName || user?.name || "");
      setPetName(draft.petName || "");
      setContactNumber(draft.contactNumber || "");
      setLocationVal(draft.location || "");
      setReason(draft.reason || "");
      if (draft.petId) setPetIdState(draft.petId);
      if (draft.sellerId) setSellerIdState(draft.sellerId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save draft as user types
  useEffect(() => {
    sessionStorage.setItem("ps_applicationDraft",
      JSON.stringify({ 
        applicantName, petName, contactNumber, location: locationVal, reason, 
        petId: petIdState, sellerId: sellerIdState 
      })
    );
  }, [applicantName, petName, contactNumber, locationVal, reason, petIdState, sellerIdState]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!applicantName || !petName || !contactNumber || !locationVal || !reason) {
      setStatus("Please complete all fields before sending your request.");
      return;
    }
    setSubmitting(true);
    try {
      const body = {
        applicantName, petName, contactNumber, location: locationVal, reason,
        petId:    (petIdState && !petIdState.startsWith("s")) ? petIdState : undefined,
        userId:   user?._id       || user?.id || undefined,
        sellerId: sellerIdState   || undefined,
      };
      const res = await fetch(`${API_BASE}/api/applications`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) { setStatus(data.error || "Submission failed."); return; }

      sessionStorage.removeItem("ps_applicationDraft");
      setSubmitted(true);
    } catch (_) {
      setStatus("Unable to send request. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  /* ── Success screen ── */
  if (submitted) {
    return (
      <Layout>
        <div className="cart-success-page">
          <div className="cart-success-box">
            <span className="cart-success-icon">🐾</span>
            <h2>Request Sent to Seller!</h2>
            <p>
              Your adoption request for <strong>{petName}</strong> has been sent to the seller.
              They will review your application and respond soon.
            </p>
            <div style={{ display:"flex", gap:12, justifyContent:"center", flexWrap:"wrap" }}>
              {isAuthenticated && (
                <button className="btn-primary" onClick={() => navigate("/order-history")}>
                  Track My Requests →
                </button>
              )}
              <button className="btn-primary" onClick={() => navigate("/adoption")}
                style={{ background:"var(--orange)" }}>
                Browse More Pets
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <main className="adopt-request-page">
        <div className="adopt-request-inner">

          {/* ── Header ── */}
          <div className="adopt-req-header slide-in-bottom">
            <p className="eyebrow">Adoption Request</p>
            <h1>{petFromState ? `Adopt ${petFromState}` : "Send Adoption Request"}</h1>
            <p className="lead">
              Fill in your details and send a request directly to the seller.
              They will review and respond soon.
            </p>
          </div>

          {/* ── Seller Banner ── */}
          {(sellerName || sellerShop || petImg) && (
            <div className="adopt-seller-banner fade-in">
              {petImg && (
                <img src={petImg} alt={petFromState} className="adopt-pet-thumb"
                  onError={e => e.target.style.display="none"} />
              )}
              <div className="adopt-seller-info">
                {sellerShop && (
                  <p className="adopt-seller fade-in-delayed" style={{ display: 'flex', flexDirection: 'column' }}>
                    <span>📨 Sending adoption request to</span>
                    <strong style={{ fontSize: '1.1rem', color: 'var(--text-main)' }}>{sellerShop}</strong>
                    {sellerEmail && (
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-light)', marginTop: '2px' }}>
                        ✉️ {sellerEmail}
                      </span>
                    )}
                  </p>
                )}
                <div className="adopt-seller-avatar-row">
                  <div className="adopt-seller-avatar">
                    {(sellerShop || sellerName || "S")[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="adopt-seller-shop">{sellerShop || sellerName}</div>
                    {sellerName && sellerName !== sellerShop && (
                      <div className="adopt-seller-sub">by {sellerName}</div>
                    )}
                    {petFromState && (
                      <div style={{ fontSize: '0.85rem', color: '#888', marginTop: 4 }}>
                        🐾 Requesting to adopt <strong>{petFromState}</strong>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="adopt-seller-badge">✅ Verified Seller</div>
            </div>
          )}

          {/* ── Form ── */}
          <form className="adopt-req-form fade-in-delayed" onSubmit={handleSubmit}>
            {status && <p className="adopt-req-error">{status}</p>}

            <div className="adopt-req-grid">
              <FormField
                id="application-name"
                label="Your Full Name"
                value={applicantName}
                onChange={e => setApplicantName(e.target.value)}
                placeholder="Enter your full name"
                required
              />
              <FormField
                id="application-pet"
                label="Pet Name"
                value={petName}
                onChange={e => setPetName(e.target.value)}
                placeholder="Which pet would you like to adopt?"
                required
              />
              <FormField
                id="application-contact"
                label="Contact Number"
                type="tel"
                value={contactNumber}
                onChange={e => setContactNumber(e.target.value)}
                placeholder="Your phone number"
                required
              />
              <FormField
                id="application-location"
                label="Your Location"
                type="text"
                value={locationVal}
                onChange={e => setLocationVal(e.target.value)}
                placeholder="Enter city, state, or address"
                required
              />
            </div>

            <FormField
              id="application-reason"
              label="Why should the seller choose you?"
              type="textarea"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Tell the seller about your home, experience with pets, and why you'd be a great match..."
              required
              rows={5}
            />

            <button type="submit" disabled={submitting} className={`adopt-req-submit pulse-on-hover ${submitting ? 'submitting' : ''}`}>
              {submitting ? "Sending Request..." : "Submit Application"}
            </button>

            {!isAuthenticated && (
              <p className="adopt-req-login-note">
                💡 <a href="/login" style={{ color:"var(--green)", fontWeight:700 }}>Log in</a> to track your request status in your dashboard.
              </p>
            )}
          </form>
        </div>
      </main>
    </Layout>
  );
}

export default Application;
