import React from "react";
import Layout from "../Components/Layout";

function Privacy() {
  return (
    <Layout>
      <main className="container">
        <div className="page-title">
          <p className="eyebrow">Privacy Policy</p>
          <h1>Your privacy matters.</h1>
          <p className="lead">
            This page explains how PetStore may collect and use basic information for accounts, orders, adoption requests, and support.
          </p>
        </div>
        <div className="content-box">
          <h2>Information We Collect</h2>
          <p>We may collect your name, email, phone number, address, and details submitted through forms.</p>
          <h2>How We Use Information</h2>
          <p>We use information to manage accounts, respond to messages, process seller requests, and improve pet services.</p>
          <h2>Data Care</h2>
          <p>We keep personal details protected and do not sell your information to outside parties.</p>
        </div>
      </main>
    </Layout>
  );
}

export default Privacy;
