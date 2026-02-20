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
      text:
        "At Krushimitra, our vision is to make plant care easy and accessible. This platform is not only about showcasing a variety of plants but also about offering smart features like disease detection and personalized fertilizer recommendations.",
    },
    {
      title: "Our Mission",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/target.png",
      text:
        "We are committed to supporting plant lovers and farmers by merging expert knowledge with advanced AI. Our tools help identify plant diseases through images, provide accurate treatments, and suggest the right care practices.",
    },
    {
      title: "What We Offer",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/leaf.png",
      text:
        "From fruit and flowering plants to medicinal and indoor plants, we bring a wide variety to your fingertips. Our AI-powered detection system ensures reliable care guidance.",
    },
    {
      title: "Why Choose Us",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/star.png",
      text:
        "By combining technology with nature, Krushimitra provides trustworthy and user-friendly solutions for plant care.",
    },
    {
      title: "Future Goals",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/future.png",
      text:
        "We aim to expand plant categories, enhance AI accuracy, and build a complete tech-driven ecosystem for plant care.",
    },
  ];

  const styles: Record<string, React.CSSProperties> = {
    aboutHero: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "20px",
      position: "relative",
      overflow: "hidden",
    },
    aboutHeroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    overlayImage: {
      position: "absolute",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      filter: "brightness(0.5)",
    },
    overlayTint: {
      position: "absolute",
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(34,49,34,0.4)",
    },
    aboutHeroContent: {
      position: "relative",
      zIndex: 2,
      color: "#f8f7f2",
    },
    aboutHeroTitle: {
      fontSize: "3rem",
      marginBottom: "20px",
    },
    aboutHeroText: {
      fontSize: "1.2rem",
      maxWidth: "600px",
      margin: "0 auto",
    },
    aboutContent: {
      padding: "60px 12%",
      textAlign: "center",
      background:
        'url("/images/Jasmine.jpg") center/cover no-repeat',
    },
    aboutSection: {
      marginBottom: "60px",
      backgroundColor: "rgba(255,255,255,0.85)",
      borderRadius: "12px",
      padding: "30px",
      boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
    },
    sectionTitle: {
      fontSize: "2rem",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      gap: "12px",
      color: "#2c3d2c",
    },
    sectionIcon: {
      width: "30px",
      height: "30px",
    },
    sectionText: {
      fontSize: "1.1rem",
      lineHeight: "1.6",
      color: "#2c3d2c",
    },
    divider: {
      width: "80px",
      height: "4px",
      backgroundColor: "#4a7042",
      margin: "15px auto 40px",
    },
    mapSection: {
      textAlign: "center",
      padding: "80px 20px",
      backgroundColor: "#f0f5f0",
    },
    mapIframe: {
      width: "80%",
      height: "450px",
      border: "none",
      borderRadius: "10px",
    },
  };

  return (
    <div>
      {/* Hero */}
      <section style={styles.aboutHero}>
        <div style={styles.aboutHeroOverlay}>
          <img
            src="/images/Jasmine.jpg"
            alt="Hero"
            style={styles.overlayImage}
          />
          <div style={styles.overlayTint}></div>
        </div>

        <div style={styles.aboutHeroContent}>
          <h1 style={styles.aboutHeroTitle}>About Krushimitra</h1>
          <p style={styles.aboutHeroText}>
            Blending technology and nature to make plant care smarter and easier.
          </p>
        </div>
      </section>

      {/* Sections */}
      <section style={styles.aboutContent}>
        {aboutSections.map((section, index) => (
          <div key={index} style={styles.aboutSection}>
            <h2 style={styles.sectionTitle}>
              <img
                src={section.icon}
                alt={section.title}
                style={styles.sectionIcon}
              />
              {section.title}
            </h2>
            <div style={styles.divider}></div>
            <p style={styles.sectionText}>{section.text}</p>
          </div>
        ))}
      </section>

      {/* Map */}
      <section style={styles.mapSection}>
        <h2>📍 Our Location</h2>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3758.9559244812817!2d72.79939502!3d19.58638888"
          loading="lazy"
          title="Krushimitra Location"
          style={styles.mapIframe}
        ></iframe>
      </section>
    </div>
  );
};

export default AboutPage;
