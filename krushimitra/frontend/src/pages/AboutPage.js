import React from "react";

function AboutPage() {
  const aboutSections = [
    {
      title: "Our Vision",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/plant-under-sun.png",
      text: "At Krushimitra, our vision is to make plant care easy and accessible. This platform is not only about showcasing a variety of plants but also about offering smart features like disease detection and personalized fertilizer recommendations."
    },
    {
      title: "Our Mission",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/target.png",
      text: "We are committed to supporting plant lovers and farmers by merging expert knowledge with advanced AI. Our tools help identify plant diseases through images, provide accurate treatments, and suggest the right care practices."
    },
    {
      title: "What We Offer",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/leaf.png",
      text: "From fruit and flowering plants to medicinal and indoor plants, we bring a wide variety to your fingertips. Our AI-powered detection system ensures reliable care guidance, making plant nurturing effortless and rewarding."
    },
    {
      title: "Why Choose Us",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/star.png",
      text: "By combining technology with nature, Krushimitra provides trustworthy and user-friendly solutions for plant care. Our unique approach empowers both casual gardeners and professional farmers with reliable insights."
    },
    {
      title: "Future Goals",
      icon: "https://img.icons8.com/ios-filled/50/4a7042/future.png",
      text: "We aim to expand plant categories, make our AI smarter, and integrate more advanced nursery services. Our future is about building a sustainable, tech-driven ecosystem for plant care."
    },
  ];

  const styles = {
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
    // 🔹 Overlay container
    aboutHeroOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
    },
    // 🔹 The actual image inside overlay
    overlayImage: {
      position: "absolute",
      width: "100%",
      height: "100%",
      objectFit: "cover",
      zIndex: 0,
      filter: "brightness(0.5)", // darken image for readable text
    },
    // 🔹 Overlay tint
    overlayTint: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(34, 49, 34, 0.4)",
      zIndex: 1,
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
    },
    aboutContent: {
      padding: "60px 12%",
      textAlign: "center",
      background: 'url("A:/Pranay/Final/krushimitra/krushimitra/frontend/public/images/Jasmine.jpg") center/cover no-repeat',
      position: "relative",
      color: "#2c3d2c",
    },
    aboutSection: {
      marginBottom: "60px",
      backgroundColor: "rgba(255, 255, 255, 0.85)",
      borderRadius: "12px",
      padding: "30px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
    },
    sectionTitle: {
      fontSize: "2rem",
      marginBottom: "15px",
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
      marginBottom: "45px",
      maxWidth: "900px",
      marginLeft: "auto",
      marginRight: "auto",
      color: "#2c3d2c",
      lineHeight: "1.6",
    },
    divider: {
      width: "80px",
      height: "4px",
      backgroundColor: "#4a7042",
      margin: "15px auto 40px",
      borderRadius: "2px",
    },
    mapSection: {
      textAlign: "center",
      padding: "80px 20px",
      backgroundColor: "#f0f5f0",
    },
    mapTitle: {
      fontSize: "2rem",
      marginBottom: "10px",
      color: "#2c3d2c",
    },
    mapText: {
      marginBottom: "20px",
      fontSize: "1.1rem",
      color: "#444",
    },
    mapIframe: {
      width: "80%",
      height: "450px",
      border: "none",
      borderRadius: "10px",
      boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.2)",
    },
  };

  return (
    <div>
      {/* Hero Section */}
      <section style={styles.aboutHero}>
        <div style={styles.aboutHeroOverlay}>
          {/* 🔹 Hero Background Image */}
          <img
            src="/images/Jasmine.jpg"
            alt="Hero Background"
            style={styles.overlayImage}
          />
          {/* 🔹 Transparent Tint Layer */}
          <div style={styles.overlayTint}></div>
        </div>

        <div style={styles.aboutHeroContent}>
          <h1 style={styles.aboutHeroTitle}>About Krushimitra</h1>
          <p style={styles.aboutHeroText}>
            Blending technology and nature to make plant care smarter, simpler,
            and accessible for everyone.
          </p>
        </div>
      </section>

      {/* Content Sections */}
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

      {/* Map Section */}
      <section style={styles.mapSection}>
        <h2 style={styles.mapTitle}>📍 Our Location</h2>
        <p style={styles.mapText}>Visit us at our nursery!</p>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d3758.9559244812817!2d72.79939502!3d19.58638888!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7052a1ebf666b%3A0xa95d1dcc3498c0b9!2zS3J1c2hpbWl0cmEgSGlnaHRlY2ggTnVyc2VyeSDgpJXgpYPgpLfgpL_gpK7gpL_gpKTgpY3gpLAg4KSo4KSw4KWN4KS44KSw4KWA!5e0!3m2!1sen!2sin!4v1758342292098!5m2!1sen!2sin"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Krushimitra Location"
          style={styles.mapIframe}
        ></iframe>
      </section>
    </div>
  );
}

export default AboutPage