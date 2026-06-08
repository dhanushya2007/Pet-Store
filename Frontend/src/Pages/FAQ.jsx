import React from "react";
import Layout from "../Components/Layout";

function FAQ() {
  return (
    <Layout>
      <main className="container">
        <div className="page-title">
          <p className="eyebrow">FAQ</p>
          <h1>Common questions.</h1>
          <p className="lead">
            Quick answers about PetStore shopping, adoption, seller registration, and support.
          </p>
        </div>
        <div className="content-box">
          <div className="faq-item">
            <h3>How can I adopt a pet?</h3>
            <p>Open the Adoption page, choose a pet, and contact us to begin the request process.</p>
          </div>
          <div className="faq-item">
            <h3>How do I become a seller?</h3>
            <p>Use the Seller page to submit your shop and contact details for registration.</p>
          </div>
          <div className="faq-item">
            <h3>Can I add pet products?</h3>
            <p>Yes, the Pet Shop Add page lets you add simple product or service listing details.</p>
          </div>
          <div className="faq-item">
            <h3>How do I contact support?</h3>
            <p>Use the Contact Us page or email support@petstore.com.</p>
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default FAQ;
