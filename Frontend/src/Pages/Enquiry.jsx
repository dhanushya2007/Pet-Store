import React, { useEffect, useState } from "react";
import Layout from "../Components/Layout";
import FormField from "../Components/FormField";
import API_BASE from "../api";

function Enquiry() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [enquiries, setEnquiries] = useState([]);
  const [success, setSuccess] = useState("");

  useEffect(() => {
    fetch(`${API_BASE}/api/enquiries`)
      .then((res) => res.json())
      .then((data) => setEnquiries(data))
      .catch((err) => console.error("Error fetching enquiries:", err));

    const draft = JSON.parse(sessionStorage.getItem("ps_enquiryDraft") || "null");
    if (draft) {
      setFullName(draft.fullName || "");
      setEmail(draft.email || "");
      setMessage(draft.message || "");
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem(
      "ps_enquiryDraft",
      JSON.stringify({ fullName, email, message })
    );
  }, [fullName, email, message]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!fullName || !email || !message) {
      setSuccess("Please fill in all fields before submitting.");
      return;
    }

    try {
      const response = await fetch(`${API_BASE}/api/enquiries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, message }),
      });

      const data = await response.json();

      if (!response.ok) {
        setSuccess(data.error || "Submission failed. Try again.");
        return;
      }

      sessionStorage.removeItem("ps_enquiryDraft");
      setEnquiries([data, ...enquiries]);
      setFullName("");
      setEmail("");
      setMessage("");
      setSuccess("Thank you! Your enquiry has been submitted.");
    } catch (err) {
      setSuccess("Unable to submit enquiry. Server is offline.");
    }
  }

  return (
    <Layout>
      <main className="container">
        <div className="page-title">
          <p className="eyebrow">Send an enquiry</p>
          <h1>Ask us about adoption, products, or seller support.</h1>
          <p className="lead">Your enquiry is stored locally so you can revisit the message later.</p>
        </div>
        <div className="grid two">
          <form className="content-box" onSubmit={handleSubmit}>
            {success && <p className="success-message">{success}</p>}
            <FormField
              id="enquiry-name"
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your name"
              required
            />
            <FormField
              id="enquiry-email"
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
            <FormField
              id="enquiry-message"
              label="Message"
              type="textarea"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Tell us what you need help with"
              required
              rows={5}
            />
            <button type="submit">Submit Enquiry</button>
          </form>
          <div className="content-box">
            <h2>Your past enquiries</h2>
            {enquiries.length === 0 ? (
              <p>No enquiries submitted yet.</p>
            ) : (
              <ul className="list-reset">
                {enquiries.map((item) => (
                  <li key={item.id} className="list-item">
                    <strong>{item.fullName}</strong> <span>({item.email})</span>
                    <p>{item.message}</p>
                    <small>{item.submittedAt}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </main>
    </Layout>
  );
}

export default Enquiry;
