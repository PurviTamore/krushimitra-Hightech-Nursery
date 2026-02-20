import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import CategoryPage from "./pages/CategoryPage";
import AdminPage from "./pages/AdminPage";
import DiseaseDetectorPage from "./pages/DiseaseDetectorPage";
import ContactPage from "./pages/ContactPage";
import AboutPage from "./pages/AboutPage";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* This ensures Home Page opens first */}
        <Route path="/" element={<HomePage />} />
        <Route path="/category/:categoryName" element={<CategoryPage />} />
        <Route path="/detector" element={<DiseaseDetectorPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/about" element={<AboutPage />} />
      </Routes>
    </>
  );
}

// THIS LINE IS CRITICAL - It fixes the error in index.tsx
export default App;