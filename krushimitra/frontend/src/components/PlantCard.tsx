import React from "react";

/* ---------- Types ---------- */

interface Plant {
  name: string;
  image: string;
  description: string;
  price: string | number;
  stockCount?: number; // Added stockCount property
  priceStyle?: React.CSSProperties;
}

interface PlantCardProps {
  plant: Plant;
}

/* ---------- Styles ---------- */

const cardStyle: React.CSSProperties = {
  background: "rgba(255, 255, 255, 0.1)",
  border: "1px solid rgba(255, 255, 255, 0.2)",
  borderRadius: "15px",
  padding: "15px",
  textAlign: "center",
  color: "white",
  backdropFilter: "blur(10px)",
  boxShadow: "0 8px 20px rgba(0, 0, 0, 0.4)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
};

const cardImageStyle: React.CSSProperties = {
  width: "100%",
  height: "180px",
  objectFit: "cover",
  borderRadius: "10px",
  marginBottom: "15px",
};

const cardTitleStyle: React.CSSProperties = {
  fontSize: "1.4rem",
  fontWeight: "bold",
  marginBottom: "5px",
};

const cardDescriptionStyle: React.CSSProperties = {
  fontSize: "0.9rem",
  lineHeight: "1.4",
  marginTop: "10px",
};

// New Style for the Stock Badge
const getStockBadgeStyle = (count: number): React.CSSProperties => ({
  fontSize: "0.8rem",
  fontWeight: "bold",
  padding: "4px 12px",
  borderRadius: "20px",
  display: "inline-block",
  margin: "10px auto",
  backgroundColor: count > 0 ? "rgba(74, 222, 128, 0.2)" : "rgba(248, 113, 113, 0.2)",
  color: count > 0 ? "#4ade80" : "#f87171",
  border: count > 0 ? "1px solid #4ade80" : "1px solid #f87171",
});

/* ---------- Component ---------- */

const PlantCard: React.FC<PlantCardProps> = ({ plant }) => {
  const { name, image, description, price, priceStyle, stockCount = 0 } = plant;

  return (
    <div style={cardStyle}>
      <div>
        <img src={image} alt={name} style={cardImageStyle} />
        <h3 style={cardTitleStyle}>{name}</h3>
        
        {/* Stock Status Badge */}
        <div style={getStockBadgeStyle(stockCount)}>
          {stockCount > 0 ? `Available: ${stockCount}` : "Out of Stock"}
        </div>

        <p style={{ ...priceStyle, fontSize: "1.2rem", fontWeight: "bold" }}>₹{price}</p>
      </div>
      <p style={cardDescriptionStyle}>{description}</p>
    </div>
  );
};

export default PlantCard;