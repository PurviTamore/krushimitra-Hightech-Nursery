import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import PlantCard from "../components/PlantCard";
import { mainApiUrl } from "../apiConfig";

/* ---------- Types ---------- */

interface Plant {
  id: string;
  name: string;
  image: string;
  description: string;
  price: string | number;
  category: string; 
  stockCount: number; // Added stockCount to the interface
  priceStyle?: React.CSSProperties;
}

/* ---------- Styles ---------- */

const categoryPageStyles: React.CSSProperties = {
  padding: "120px 40px 40px",
  textAlign: "center",
  background: "linear-gradient(135deg, #14421dff, #1c5c29)",
  minHeight: "100vh",
};

const categoryGridStyles: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "30px",
  marginTop: "40px",
};

/* ---------- Component ---------- */

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams<{ categoryName: string }>();

  const [plants, setPlants] = useState<Plant[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        setError(null);

        const formattedCategory = categoryName 
          ? categoryName.charAt(0).toUpperCase() + categoryName.slice(1).toLowerCase() 
          : "";

        const response = await fetch(
          `${mainApiUrl}/plants?category=${formattedCategory}`
        );

        if (!response.ok) {
          throw new Error("Could not connect to the plant server.");
        }

        const data: Plant[] = await response.json();
        setPlants(data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch plants. Ensure JSON Server is running on Port 3001.");
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [categoryName]);

  if (loading) {
    return (
      <div style={categoryPageStyles}>
        <h1 style={{ color: "white" }}>Loading Plants...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={categoryPageStyles}>
        <h1 style={{ color: "white" }}>{error}</h1>
        <Link to="/" style={{ color: "#81c784", marginTop: "20px", display: "block" }}>
          Try Again
        </Link>
      </div>
    );
  }

  return (
    <div style={categoryPageStyles}>
      <h1 style={{ fontSize: "3rem", color: "white", textTransform: "capitalize" }}>
        {categoryName} Plants
      </h1>

      <Link
        to="/"
        className="btn"
        style={{ 
          marginTop: "20px", 
          display: "inline-block",
          color: "white",
          textDecoration: "none",
          border: "1px solid white",
          padding: "10px 20px",
          borderRadius: "5px"
        }}
      >
        ⬅ Back to Categories
      </Link>

      {plants.length > 0 ? (
        <div style={categoryGridStyles}>
          {plants.map((plant) => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>
      ) : (
        <p style={{ marginTop: "30px", fontSize: "1.2rem", color: "white" }}>
          No plants found in the "{categoryName}" category yet.
        </p>
      )}
    </div>
  );
};

export default CategoryPage;