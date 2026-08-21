import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import PlantCard from "../components/PlantCard";

const CategoryPage: React.FC = () => {
  const { categoryName } = useParams();
  const [plants, setPlants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlants = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3002/admin/stats");
        const formatted = categoryName!.charAt(0).toUpperCase() + categoryName!.slice(1).toLowerCase();
        setPlants(res.data.plants.filter((p: any) => p.category === formatted));
      } catch (err) {
        console.error("Connection Error");
      } finally {
        setLoading(false);
      }
    };
    fetchPlants();
  }, [categoryName]);

  return (
    <div style={containerStyle}>
      <style>{`
        .plant-card-wrapper {
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          border-radius: 28px;
          padding: 15px;
          /* THE GREEN CARD THEME */
          background: linear-gradient(145deg, #065b22 0%, #086114 100%);
          border: 1px solid #10b981;
          box-shadow: 0 10px 20px rgba(5, 150, 105, 0.15);
        }

        .plant-card-wrapper:hover {
          transform: translateY(-15px) scale(1.02);
          background: linear-gradient(145deg, #059669 0%, #064e3b 100%);
          box-shadow: 0 30px 60px rgba(5, 150, 105, 0.3);
        }

        /* Adjusting internal text and images of PlantCard to look good on Green */
        .plant-card-wrapper > div {
          width: 100% !important;
          background: transparent !important;
          color: white !important;
          border: none !important;
          box-shadow: none !important;
        }

        /* Ensuring images inside the green cards look crisp */
        .plant-card-wrapper img {
          border-radius: 20px;
          box-shadow: 0 8px 16px rgba(0,0,0,0.1);
        }

        .category-title::after {
          content: '';
          display: block;
          width: 60px;
          height: 5px;
          background: #059669;
          margin: 12px auto;
          border-radius: 10px;
        }
      `}</style>

      <div style={{ marginBottom: "70px" }}>
        <h1 className="category-title" style={titleStyle}>{categoryName} Collection</h1>
        <p style={subtitleStyle}>Exceptional greenery, nurtured with care.</p>
        <Link to="/" style={backBtnStyle}>Back to Nursery</Link>
      </div>
      
      <div style={gridStyle}>
        {loading ? (
          <div style={loaderContainer}>
            <h2 style={{ color: '#059669', fontWeight: '300' }}>Preparing your selection...</h2>
          </div>
        ) : (
          plants.length > 0 ? (
            plants.map((p: any) => (
              <div key={p._id} className="plant-card-wrapper">
                <PlantCard plant={p} />
              </div>
            ))
          ) : (
            <div style={emptyStateStyle}>
              <p>No botanical items available in this category.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};

/* --- Professional Style Definitions --- */

const containerStyle: any = {
  padding: "160px 40px 120px 40px",
  backgroundColor: "#ecf3ec", // Clean white background
  minHeight: "100vh",
  textAlign: "center",
  fontFamily: "'Inter', sans-serif"
};

const titleStyle: any = {
  color: "#064e3b", // Deepest green for text
  textTransform: "capitalize",
  fontSize: "3.8rem",
  fontWeight: "900",
  letterSpacing: "-2px"
};

const subtitleStyle: any = {
  color: "#64748b",
  fontSize: "1.15rem",
  marginBottom: "35px"
};

const backBtnStyle: any = {
  color: "#11ab3a",
  textDecoration: "none",
  fontWeight: "700",
  fontSize: "1rem",
  padding: "10px 20px",
  borderRadius: "12px",
  backgroundColor: "#f0fdf4",
  transition: "0.3s"
};

const gridStyle: any = {
  display: "grid",
  // Large Cards
  gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", 
  gap: "45px",
  maxWidth: "1400px",
  margin: "0 auto"
};

const loaderContainer: any = {
  gridColumn: "1/-1",
  padding: "100px 0"
};

const emptyStateStyle: any = {
  gridColumn: "1/-1",
  padding: "60px",
  color: "#94a3b8",
  fontSize: "1.2rem"
};

export default CategoryPage;