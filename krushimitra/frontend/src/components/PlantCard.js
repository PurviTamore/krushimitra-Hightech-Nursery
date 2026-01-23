import React from "react";

// Inline styles for the plant card to keep it self-contained
const cardStyle = {
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "15px",
  padding: "15px",
  textAlign: "center",
  color: "white",
  
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
};

const cardImageStyle = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
  borderRadius: "10px",
  marginBottom: "15px",
  
};

const cardTitleStyle = {
  fontSize: "1.4rem",
  fontWeight: "bold",
  marginBottom: "10px",
};

const cardDescriptionStyle = {
  fontSize: "0.9rem",
  lineHeight: "1.4",
};

// A simple hover effect can be managed with pseudo-classes in a style tag,
// but for simplicity, we'll keep it static. For a real app, you'd use CSS.

function PlantCard({ plant }) {
  // The 'plant' prop contains all the data for one plant from our db.json
  const { name, image, description, price, priceStyle } = plant;

  return (
    <div style={cardStyle}>
      <img src={image} alt={name} style={cardImageStyle} />
      <h3 style={cardTitleStyle}>{name}</h3>
      <p style={priceStyle}>₹{price}</p>
      <p style={cardDescriptionStyle}>{description}</p>
    </div>
  );
}

export default PlantCard;
