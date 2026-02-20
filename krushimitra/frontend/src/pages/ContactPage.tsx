import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";

interface ContactFormData {
  name: string;
  phone: string;
  email: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<ContactFormData>({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState<string>("");

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus("Sending your message...");

    try {
      await axios.post(
        `${process.env.REACT_APP_MAIN_API_URL}/enquiries`,
        formData
      );

      setStatus("Thank you for your message! We will get back to you soon.");
      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Failed to submit enquiry:", error);
      setStatus("Sorry, something went wrong. Please try again later.");
    }
  };

  return (
    <div className="contact-page" style={{ paddingTop: "50px" }}>
      {/* Hero Section */}
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1>Contact Us</h1>
          <p>
            We're here to help you find the perfect plant and answer any
            questions you have.
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="contact-section">
        <div className="contact-info">
          <h2>Get in Touch</h2>
          <p>
            <strong>Email:</strong> bhupeshnthakur@gmail.com
          </p>
          <p>
            <strong>Phone:</strong> +91 9096272031
          </p>
          <p>
            <strong>WhatsApp:</strong> +91 9923721239
          </p>
          <p>
            <strong>Address:</strong> AT-Kapse, Near Shiv Temple, Saphale West
          </p>
        </div>

        <div className="contact-form">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <textarea
              name="message"
              placeholder="Message"
              value={formData.message}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={status === "Sending your message..."}
            >
              {status === "Sending your message..." ? "Sending..." : "Submit"}
            </button>
          </form>

          {status && (
            <p
              style={{
                marginTop: "15px",
                color: status.includes("Sorry")
                  ? "#dc3545"
                  : "#28a745",
              }}
            >
              {status}
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
