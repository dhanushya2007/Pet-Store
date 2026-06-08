import React from "react";
import { Link } from "react-router-dom";
import Layout from "../Components/Layout";
import logo from "../Assets/Images/logo.png";

function ForgotPassword() {
  return (
    <Layout>
      <main className="auth-page">
        <form className="auth-card" onSubmit={(event) => event.preventDefault()}>
          <img className="auth-logo" src={logo} alt="PetStore logo" />
          <h1>Forgot Password</h1>
          <p className="lead">Enter your email and we will send reset instructions.</p>
          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" placeholder="Enter your email" />
          <button type="submit">Send Reset Link</button>
          <p className="form-note">Remembered it? <Link to="/login">Back to login</Link></p>
        </form>
      </main>
    </Layout>
  );
}

export default ForgotPassword;
