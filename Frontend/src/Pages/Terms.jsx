import React from "react";
import Layout from "../Components/Layout";

function Terms() {
  return (
    <Layout>
      <main className="container">
        <div className="page-title">
          <p className="eyebrow">Terms and Conditions</p>
          <h1>Simple rules for using PetStore.</h1>
          <p className="lead">
            By using PetStore, users and sellers agree to keep information accurate, respectful, and pet-friendly.
          </p>
        </div>
        <div className="content-box">
          <h2>User Responsibilities</h2>
          <p>Users must provide correct information and use the website only for lawful pet shopping, adoption, and seller activities.</p>
          <h2>Seller Listings</h2>
          <p>Sellers are responsible for accurate product details, prices, availability, and service descriptions.</p>
          <h2>Adoption Requests</h2>
          <p>Adoption interest does not guarantee approval. PetStore may review requests to support responsible pet care.</p>
          <h2>Changes</h2>
          <p>PetStore may update these terms when needed to improve service quality and user safety.</p>
        </div>
      </main>
    </Layout>
  );
}

export default Terms;
