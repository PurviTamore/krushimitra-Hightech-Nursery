import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import PlantCard from "../components/PlantCard";
import { mainApiUrl } from '../apiConfig'; // Adjust path if needed

// We'll add some new styles for this page layout in App.css later
const categoryPageStyles = {
  padding: "120px 40px 40px", // Add padding to top to avoid navbar overlap
  textAlign: "center",
  background: "linear-gradient(135deg, #14421dff )",
  minHeight: "100vh",
};

const categoryGridStyles = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  gap: "30px",
  marginTop: "40px",
};

function CategoryPage() {
  const { categoryName } = useParams(); // Get category from URL (e.g., "Indoor")
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This function fetches data from our json-server
    const fetchPlants = async () => {
      try {
        setLoading(true);
        setError(null);
        // Make sure your json-server is running on port 3001
        const response = await fetch(
       `${mainApiUrl}/plants?category=${categoryName}`
         );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setPlants(data);
      } catch (err) {
        setError("Failed to fetch plants. Please try again later.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlants();
  }, [categoryName]); // Re-run this effect if the categoryName changes

  if (loading) {
    return (
      <div style={categoryPageStyles}>
        <h1>Loading Plants...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div style={categoryPageStyles}>
        <h1>{error}</h1>
      </div>
    );
  }

  return (
    <div style={categoryPageStyles}>
      <h1 style={{ fontSize: "3rem", color: "white" }}>
        {categoryName} Plants
      </h1>
      <Link
        to="/"
        className="btn"
        style={{ marginTop: "20px", display: "inline-block" }}
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
        <p style={{ marginTop: "30px", fontSize: "1.2rem" }}>
          No plants found in this category yet.
        </p>
      )}
    </div>
  );
}

export default CategoryPage;
