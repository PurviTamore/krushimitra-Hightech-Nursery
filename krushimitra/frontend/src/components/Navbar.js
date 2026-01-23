import React from "react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div className="navbar" style={navbarStyle}>
      <div className="logo">
        <Link
          to="/"
          className="nav-link"
          style={{ textDecoration: "none", color: "white" }}
        >
          Krushimitra
        </Link>
      </div>
      <ul style={navListStyle}>
        <li style={listItemStyle}>
          <Link 
            to="/"
            className="nav-link" 
            style={{ textDecoration: "none", color: "white" }}
          >
            Home
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link 
            to="/about" 
            className="nav-link"
            style={{ textDecoration: "none", color: "white" }}
          >
            About
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link 
            to="/detector" 
            className="nav-link"
            style={{ textDecoration: "none", color: "white" }}
          >
            Disease Detector
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link 
            to="/contact" 
            className="nav-link"
            style={{ textDecoration: "none", color: "white" }}
          >
            Contact
          </Link>
        </li>
        <li style={listItemStyle}>
          <Link 
            to="/admin" 
            className="nav-link"
            style={{ textDecoration: "none", color: "white" }}
          >
            Admin
          </Link>
        </li>
      </ul>
    </div>
  );
}

// Green color from the screenshot
const navbarStyle = {
  backgroundColor: "#0d3605ff", // Exact green color from your screenshot
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
  boxSizing: "border-box",
  zIndex: 1000
};

const navListStyle = {
  display: "flex",
  listStyle: "none",
  gap: "30px",
  margin: 0,
  padding: 0
};

const listItemStyle = {
  padding: "8px 0"
};

export default Navbar;