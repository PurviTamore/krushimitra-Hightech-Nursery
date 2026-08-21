import React from "react";

/* ---------- Types ---------- */
interface AboutSection {
  title: string;
  icon: string;
  text: string;
}

/* ---------- Component ---------- */
const AboutPage: React.FC = () => {
  const aboutSections: AboutSection[] = [
    {
      title: "Our Vision",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/plant-under-sun.png",
      text: "At Krushimitra, our vision is to make plant care easy and accessible. This platform offers smart features like disease detection and personalized fertilizer recommendations.",
    },
    {
      title: "Our Mission",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/target.png",
      text: "We are committed to supporting plant lovers and farmers by merging expert knowledge with advanced AI to identify plant diseases and suggest accurate treatments.",
    },
    {
      title: "What We Offer",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/leaf.png",
      text: "From fruit and flowering plants to medicinal and indoor plants, we bring a wide variety to your fingertips with AI-powered detection and guidance.",
    },
    {
      title: "Why Choose Us",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/star.png",
      text: "By combining technology with nature, Krushimitra provides trustworthy and user-friendly solutions for professional and hobbyist plant care.",
    },
  ];

  const styles: Record<string, React.CSSProperties> = {
    container: {
      fontFamily: "'Inter', sans-serif",
      backgroundColor: "#ffffff",
      color: "#1e293b",
    },
    hero: {
      height: "50vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      background: "linear-gradient(rgba(6, 78, 59, 0.6), rgba(6, 78, 59, 0.6)), url('/images/Jasmine.jpg') center/cover no-repeat",
      color: "#ffffff",
      padding: "0 20px",
    },
    heroTitle: {
      fontSize: "3.5rem",
      fontWeight: 900,
      marginBottom: "10px",
      letterSpacing: "-1px",
    },
    contentSection: {
      padding: "80px 10%",
      textAlign: "center",
    },
    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "30px",
      marginTop: "40px",
    },
    card: {
      padding: "40px 30px",
      backgroundColor: "#f0fdf4",
      borderRadius: "24px",
      border: "1px solid #dcfce7",
      transition: "transform 0.3s ease",
    },
    cardIcon: {
      width: "50px",
      marginBottom: "20px",
    },
    cardTitle: {
      fontSize: "1.5rem",
      color: "#064e3b",
      marginBottom: "15px",
      fontWeight: 700,
    },
    cardText: {
      fontSize: "1rem",
      lineHeight: "1.7",
      color: "#475569",
    },
    mapSection: {
      padding: "80px 20px",
      backgroundColor: "#f8fafc",
      textAlign: "center",
    },
    mapTitle: {
      fontSize: "2.5rem",
      fontWeight: 800,
      color: "#064e3b",
      marginBottom: "40px",
    },
    mapWrapper: {
      maxWidth: "1100px",
      margin: "0 auto",
      borderRadius: "30px",
      overflow: "hidden",
      boxShadow: "0 20px 50px rgba(5, 150, 105, 0.15)",
      border: "8px solid #ffffff",
      lineHeight: 0, // Removes tiny gap at bottom of iframe
    }
  };

  return (
    <div style={styles.container}>
      {/* Hero Section */}
      <section style={styles.hero}>
        <div>
          <h1 style={styles.heroTitle}>About Krushimitra</h1>
          <p style={{ fontSize: "1.2rem", opacity: 0.9 }}>Where Agriculture meets Artificial Intelligence.</p>
        </div>
      </section>

      {/* Philosophy Grid */}
      <section style={styles.contentSection}>
        <h2 style={{ fontSize: "2.5rem", fontWeight: 800, color: "#064e3b" }}>Our Philosophy</h2>
        <div style={styles.grid}>
          {aboutSections.map((section, index) => (
            <div key={index} style={styles.card}>
              <img src={section.icon} alt={section.title} style={styles.cardIcon} />
              <h3 style={styles.cardTitle}>{section.title}</h3>
              <p style={styles.cardText}>{section.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Map Section using your provided Iframe */}
      <section style={styles.mapSection}>
        <h2 style={styles.mapTitle}>📍 Locate Our Nursery</h2>
        <div style={styles.mapWrapper}>
          <iframe 
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3758.9560014753283!2d72.796819674991!3d19.586385581726162!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7052a1ebf666b%3A0xa95d1dcc3498c0b9!2zS3J1c2hpbWl0cmEgSGlnaHRlY2ggTnVyc2VyeSDgpJXgpYPgpLfgpL_gpK7gpL_gpKTgpY3gpLAg4KSo4KSw4KWN4KS44KSw4KWA!5e0!3m2!1sen!2sin!4v1776487291291!5m2!1sen!2sin" 
            width="100%" 
            height="500" 
            style={{ border: 0 }} 
            allowFullScreen={true} 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            title="Krushimitra Office Location"
          ></iframe>
        </div>
        <p style={{ marginTop: "20px", color: "#64748b" }}>Open Daily: 9:00 AM — 6:00 PM</p>
      </section>
    </div>
  );
};

export default AboutPage;