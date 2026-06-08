import React, { useState } from "react";
import Layout from "../Components/Layout";

const INFO_CARDS = [
  { icon:"📍", title:"Visit Us",     lines:["PetStore HQ, MG Road","Bengaluru, Karnataka 560001"] },
  { icon:"📞", title:"Call Us",      lines:["+91 98765 43210","+91 80 1234 5678"] },
  { icon:"📧", title:"Email Us",     lines:["support@petstore.com","hello@petstore.com"] },
  { icon:"⏰", title:"Working Hours",lines:["Mon – Sat: 9 AM – 7 PM","Sun: 10 AM – 4 PM"] },
];

const TOPICS = ["Adoption Help","Seller Support","Payment Issue","Report a Listing","General Query","Other"];

function Contact() {
  const [form,    setForm]    = useState({ name:"", email:"", topic:"", message:"" });
  const [sent,    setSent]    = useState(false);
  const [sending, setSending] = useState(false);

  function change(k) { return e => setForm(f => ({...f,[k]:e.target.value})); }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSending(true);
    setTimeout(() => { setSending(false); setSent(true); }, 1200);
  }

  return (
    <Layout>
      {/* ── HERO ── */}
      <section className="contact-hero">
        <div className="contact-hero-blob">🐾</div>
        <div className="contact-hero-content">
          <p className="eyebrow">Get In Touch</p>
          <h1>We're Here to Help 💬</h1>
          <p className="contact-hero-sub">
            Whether you have a question about adopting, selling, or just want to say hello — our friendly team is ready to help.
          </p>
        </div>
        <div className="contact-hero-wave">
          <svg viewBox="0 0 1440 80" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
            <path d="M0,40 C360,80 1080,0 1440,40 L1440,80 L0,80 Z" fill="var(--bg)"/>
          </svg>
        </div>
      </section>

      <main className="contact-page">
        {/* ── Info cards ── */}
        <div className="contact-info-cards">
          {INFO_CARDS.map((c,i) => (
            <div key={i} className="contact-info-card">
              <div className="contact-info-icon">{c.icon}</div>
              <div className="contact-info-title">{c.title}</div>
              {c.lines.map((l,j) => <div key={j} className="contact-info-line">{l}</div>)}
            </div>
          ))}
        </div>

        {/* ── Main section ── */}
        <div className="contact-main-grid">

          {/* Form */}
          <div className="contact-form-box">
            <div className="contact-form-header">
              <h2>Send Us a Message</h2>
              <p>We'll respond within 24 hours.</p>
            </div>

            {sent ? (
              <div className="contact-success">
                <div className="contact-success-icon">🎉</div>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. Our team will get back to you within 24 hours.</p>
                <button className="btn-primary" onClick={() => { setSent(false); setForm({ name:"",email:"",topic:"",message:"" }); }}>
                  Send Another
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <div className="contact-form-row">
                  <div className="form-field">
                    <label htmlFor="c-name">Full Name *</label>
                    <input id="c-name" type="text" value={form.name}
                      onChange={change("name")} placeholder="Your full name" required />
                  </div>
                  <div className="form-field">
                    <label htmlFor="c-email">Email Address *</label>
                    <input id="c-email" type="email" value={form.email}
                      onChange={change("email")} placeholder="you@example.com" required />
                  </div>
                </div>
                <div className="form-field">
                  <label htmlFor="c-topic">Topic</label>
                  <select id="c-topic" value={form.topic} onChange={change("topic")}>
                    <option value="">Select a topic...</option>
                    {TOPICS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div className="form-field">
                  <label htmlFor="c-message">Message *</label>
                  <textarea id="c-message" value={form.message} onChange={change("message")}
                    placeholder="Describe your question or issue in detail..." rows={6} required />
                </div>
                <button type="submit" className="contact-submit-btn" disabled={sending} id="contact-submit">
                  {sending ? (
                    <><span className="contact-spinner"/> Sending...</>
                  ) : (
                    "📨 Send Message"
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Map / Social panel */}
          <div className="contact-side-panel">
            <div className="contact-map-box">
              <iframe
                title="PetStore Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3887.7943025098487!2d77.60583931533445!3d12.97259699085611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae1670c9b44e6d%3A0xf8dfc3e8517e4fe0!2sMG%20Road%2C%20Bengaluru%2C%20Karnataka!5e0!3m2!1sen!2sin!4v1691000000000!5m2!1sen!2sin"
                width="100%" height="240" style={{ border:0, borderRadius:12 }}
                allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

            <div className="contact-social-box">
              <h4>Follow Us</h4>
              <div className="contact-socials">
                {[
                  { icon:"f",  label:"Facebook",  href:"#facebook",  color:"#1877f2" },
                  { icon:"📷", label:"Instagram", href:"#instagram", color:"#e1306c" },
                  { icon:"𝕏",  label:"Twitter",   href:"#twitter",   color:"#000" },
                  { icon:"▶",  label:"YouTube",   href:"#youtube",   color:"#ff0000" },
                ].map(s => (
                  <a key={s.label} href={s.href} className="contact-social-btn"
                    style={{ "--s-color": s.color }} aria-label={s.label}>
                    <span>{s.icon}</span>
                    <span>{s.label}</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="contact-faq-box">
              <h4>🐾 Quick FAQ</h4>
              {[
                ["How do I adopt a pet?","Browse pets, click Adopt Now, fill the form, and the seller will contact you."],
                ["How long does approval take?","Sellers typically respond within 24–48 hours."],
                ["Is PetStore free to use?","Browsing and adopting is 100% free. Sellers have optional premium listings."],
              ].map(([q,a],i) => (
                <details key={i} className="contact-faq-item">
                  <summary>{q}</summary>
                  <p>{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Contact;
