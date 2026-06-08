import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout";
import aboutBanner from "../Assets/Images/about_banner.png";

const STATS = [
  { number:"5,200+", label:"Happy Adoptions", icon:"🐾" },
  { number:"320+",   label:"Verified Sellers", icon:"🏪" },
  { number:"12,000+",label:"Pets Listed",      icon:"🐶" },
  { number:"98%",    label:"Happy Families",   icon:"❤️" },
];

const TEAM = [
  { name:"Ananya Sharma",  role:"Founder & CEO",        img:"https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300", bio:"Animal lover building the future of pet adoption." },
  { name:"Rohan Mehta",    role:"Head of Operations",   img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", bio:"Ensuring every adoption is seamless and joyful." },
  { name:"Priya Nair",     role:"Animal Welfare Lead",  img:"https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300", bio:"Dedicated to the health and happiness of every pet." },
  { name:"Karthik Raj",    role:"Tech & Product",       img:"https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300", bio:"Building the platform that connects hearts and paws." },
];

const VALUES = [
  { icon:"🐕", title:"Animal Welfare First",  text:"Every decision we make puts the wellbeing of animals first. Health checks, vaccination tracking, and welfare guidelines are mandatory for all listings." },
  { icon:"🤝", title:"Transparent Community", text:"We verify all sellers and provide a transparent review system so adopters can make informed, confident decisions." },
  { icon:"🌱", title:"Sustainable Adoption",  text:"We promote adoption over shopping and help reduce pet abandonment by making the process simple and accessible." },
  { icon:"💚", title:"Lifetime Support",      text:"Our community support doesn't end at adoption. We provide resources, vet connections, and a community for every pet parent." },
];

/* ── Animated counter ── */
function Counter({ target }) {
  const ref   = useRef(null);
  const hasRun = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !hasRun.current) {
        hasRun.current = true;
        const num = parseInt(target.replace(/\D/g,""), 10);
        const suffix = target.replace(/[\d,]/g,"");
        let start = 0;
        const step = Math.ceil(num / 60);
        const timer = setInterval(() => {
          start = Math.min(start + step, num);
          el.textContent = start.toLocaleString() + suffix;
          if (start >= num) clearInterval(timer);
        }, 20);
      }
    }, { threshold: 0.5 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);
  return <span ref={ref}>{target}</span>;
}

function About() {
  return (
    <Layout>

      {/* ── BANNER WITH TEXT OVERLAY ── */}
      <div className="about-top-banner">
        <img src={aboutBanner} alt="Happy pets at PetStore" className="about-top-banner-img" />
        <div className="about-top-banner-overlay">
          <p className="about-banner-eyebrow">About PetStore</p>
          <h1 className="about-banner-title">Built for <span>Pet Lovers</span>,<br/>Families &amp; Sellers.</h1>
          <p className="about-banner-sub">
            India's most trusted pet adoption and marketplace platform. Every pet deserves a loving home — we make that happen.
          </p>
          <div className="about-banner-btns">
            <Link to="/adoption" className="btn-primary">🐾 Browse Pets</Link>
            <Link to="/contact" className="btn-outline-white">💬 Contact Us</Link>
          </div>
        </div>
      </div>

      {/* ── STATS ── */}
      <section className="about-stats-section">
        <div className="about-stats-grid">
          {STATS.map(s => (
            <div key={s.label} className="about-stat-card">
              <div className="about-stat-icon">{s.icon}</div>
              <div className="about-stat-number"><Counter target={s.number} /></div>
              <div className="about-stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── MISSION & VISION ── */}
      <section className="about-mv-section">
        <div className="about-mv-header">
          <h2>Mission &amp; <span className="highlight">Vision</span></h2>
          <p>What drives us every single day</p>
        </div>
        <div className="about-mv-grid">
          <div className="about-mv-card mission">
            <div className="about-mv-card-header">
              <span className="mv-icon">🎯</span>
              <h3>Our Mission</h3>
            </div>
            <p>
              To provide a safe, transparent, and joyful environment for pets and pet lovers — 
              making quality pet care accessible to every household in India through 
              technology and community.
            </p>
          </div>
          <div className="about-mv-card vision">
            <div className="about-mv-card-header">
              <span className="mv-icon">🔭</span>
              <h3>Our Vision</h3>
            </div>
            <p>
              To become South Asia's most loved pet ecosystem — where every pet finds a 
              home, every owner finds support, and every seller finds success through our 
              platform.
            </p>
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section className="about-wcu-section">
        <div className="about-wcu-header">
          <h2>Why Choose <span className="highlight">Us</span></h2>
          <p>We go above and beyond for you and your pets</p>
        </div>
        <div className="about-wcu-grid">
          <div className="about-wcu-card">
            <div className="wcu-icon">🏥</div>
            <h3>Vet-Verified Pets</h3>
            <p>All pets are health-checked by certified veterinarians before listing.</p>
          </div>
          <div className="about-wcu-card">
            <div className="wcu-icon">✅</div>
            <h3>Trusted Sellers</h3>
            <p>Every seller is verified with KYC and customer reviews.</p>
          </div>
          <div className="about-wcu-card">
            <div className="wcu-icon">🚚</div>
            <h3>Fast Delivery</h3>
            <p>Same-day delivery in major cities for all pet products.</p>
          </div>
          <div className="about-wcu-card">
            <div className="wcu-icon">🕐</div>
            <h3>24/7 Support</h3>
            <p>Round-the-clock customer support for all your pet needs.</p>
          </div>
        </div>
      </section>

      {/* ── TEAM ── */}
      <section className="about-team-section">
        <div className="about-section-header">
          <p className="eyebrow">The People Behind PetStore</p>
          <h2>Meet Our Team</h2>
        </div>
        <div className="about-team-grid">
          {TEAM.map((m,i) => (
            <div key={i} className="about-team-card" style={{ animationDelay:`${i*0.12}s` }}>
              <div className="about-team-info">
                <div className="about-team-name">{m.name}</div>
                <div className="about-team-role">{m.role}</div>
                <p className="about-team-bio">{m.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>


    </Layout>
  );
}

export default About;
