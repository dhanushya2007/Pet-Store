import React from "react";
import logo from "./Assets/Images/logo.png";
import dog from "./Assets/Images/dog.png";
import dog1 from "./Assets/Images/dog1.png";
import cat from "./Assets/Images/cat.png";
import pedigree from "./Assets/Images/pedigree.png";
import "./Assets/Css/HomePage.css";

function Homepage() {
  return (
    <>
      <header>
        <div className="nav-wrap">
          <a className="brand" href="/">
            <img src={logo} alt="PetStore logo" />
            <span>
              Pet<span>Store</span>
            </span>
          </a>
          <nav className="nav-links">
            <a className="active" href="/">
              Home
            </a>
            <a href="/about">About Us</a>
            <a href="/adoption">Adoption</a>
            <a href="/seller">Seller</a>
            <a href="/pet-shop-add">Pet Shop Add</a>
            <a href="/contact">Contact Us</a>
            <a href="/login">Login</a>
          </nav>
        </div>
      </header>
      <main>
        <section className="container hero">
          <div>
            <p className="eyebrow">Happy pets, happy life</p>

            <h1>
              Everything your pet needs in one trusted store.
            </h1>
            <p className="lead">
              Shop pet essentials, connect with caring sellers,
              and find loving pets ready for adoption with a warm
              and simple experience.
            </p>

            <div className="hero-actions">
              <a className="button" href="/adoption">
                View Adoption
              </a>

              <a
                className="button secondary"
                href="/pet-shop-add"
              >
                Add Pet Shop
              </a>
            </div>
          </div>

          <div className="hero-image">
            <img
              src={dog}
              alt="Dog and cat sitting together"
            />
          </div>
        </section>
        <section className="section-band">
          <div className="container">
            <div className="grid">
              <article className="card">
                <img src={dog1} alt="Pet care" />
                <h3>Quality Pet Care</h3>
                <p>
                  Find food, grooming products, toys, and daily
                  essentials selected for comfortable pet living.
                </p>
              </article>
              <article className="card">
                <img src={cat} alt="Cat for adoption" />
                <h3>Pet Adoption</h3>
                <p>
                  Meet pets looking for a safe home and start a
                  responsible adoption journey.
                </p>
              </article>
              <article className="card">
                <img src={pedigree} alt="Pet product" />
                <h3>Trusted Sellers</h3>
                <p>
                  Register as a seller and showcase pet products
                  or services with clean, clear listings.
                </p>
              </article>
            </div>
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="footer-wrap">
          <p>PetStore - Happy Pets, Happy Life!</p>
          <div className="footer-links">
            <a href="/privacy">Privacy Policy</a>
            <a href="/faq">FAQ</a>
            <a href="/terms">Terms and Conditions</a>
          </div>
        </div>
      </footer>
    </>
  );
}

export default Homepage;