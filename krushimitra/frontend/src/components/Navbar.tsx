import React from "react";
import { Link } from "react-router-dom";

const navbarStyle: React.CSSProperties = {
  backgroundColor: "#0d3605ff",
  padding: "15px 20px",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  margin: 0,
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  width: "100%",
  boxSizing: "border-box", // ✅ FIXED
  zIndex: 1000,
};

const navListStyle: React.CSSProperties = {
  display: "flex",
  listStyle: "none",
  gap: "30px",
  margin: 0,
  padding: 0,
};

const listItemStyle: React.CSSProperties = {
  padding: "8px 0",
};

function Navbar() {
  return (
    <div style={navbarStyle}>
      <div className="logo">
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          Krushimitra
        </Link>
      </div>

      <ul style={navListStyle}>
        <li style={listItemStyle}>
          <Link to="/" style={{ color: "white", textDecoration: "none" }}>
            Home
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="/about" style={{ color: "white", textDecoration: "none" }}>
            About
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="/detector" style={{ color: "white", textDecoration: "none" }}>
            Disease Detector
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="/contact" style={{ color: "white", textDecoration: "none" }}>
            Contact
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link to="/admin" style={{ color: "white", textDecoration: "none" }}>
            Admin
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
