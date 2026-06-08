import React from "react";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout";

function NotFound() {
  return (
    <Layout>
      <main className="container">
        <div className="page-title">
          <p className="eyebrow">Page Not Found</p>
          <h1>We couldn't find that page.</h1>
          <p className="lead">The page you're looking for does not exist. Use the navigation above to continue browsing.</p>
          <Link className="button" to="/">
            Go Home
          </Link>
        </div>
      </main>
    </Layout>
  );
}

export default NotFound;
