import React from "react";
import Layout from "../Components/Layout";

function Terms() {
  return (
    <Layout>
      <main className="terms-container">
        <div className="terms-header">
          <span className="eyebrow">Terms and Conditions</span>
          <h1>Simple Rules for Using PetStore</h1>
          <p className="lead">
            By using PetStore, users and sellers agree to keep information accurate, respectful, and pet-friendly.
          </p>
        </div>

        <div className="terms-card-wrapper">
          <div className="terms-card">
            <div className="terms-card-icon">👤</div>
            <div className="terms-card-content">
              <h2>User Responsibilities</h2>
              <p>Users must provide correct information and use the website only for lawful pet shopping, adoption, and seller activities.</p>
            </div>
          </div>

          <div className="terms-card">
            <div className="terms-card-icon">🏪</div>
            <div className="terms-card-content">
              <h2>Seller Listings</h2>
              <p>Sellers are responsible for accurate product details, prices, availability, and service descriptions.</p>
            </div>
          </div>

          <div className="terms-card">
            <div className="terms-card-icon">🐾</div>
            <div className="terms-card-content">
              <h2>Adoption Requests</h2>
              <p>Adoption interest does not guarantee approval. PetStore may review requests to support responsible pet care.</p>
            </div>
          </div>

          <div className="terms-card">
            <div className="terms-card-icon">🔄</div>
            <div className="terms-card-content">
              <h2>Changes &amp; Updates</h2>
              <p>PetStore may update these terms when needed to improve service quality and user safety.</p>
            </div>
          </div>
        </div>

        <div className="terms-footer">
          <p>Last updated: June 2026</p>
        </div>
      </main>
    </Layout>
  );
}

export default Terms;
