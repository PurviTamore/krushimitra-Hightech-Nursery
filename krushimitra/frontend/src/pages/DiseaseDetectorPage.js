import React, { useState, useRef } from "react";

function DiseaseDetectorPage() {
  const [imagePreview, setImagePreview] = useState(null);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [analysisStep, setAnalysisStep] = useState("");

  const fileInputRef = useRef(null);
  const imageRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setResult(null);
    }
  };

  const handleDetectDisease = async () => {
  if (!imagePreview) {
    alert("Please upload an image first.");
    return;
  }

  setIsLoading(true);
  setResult(null);

  // Simulated step-by-step process
  setAnalysisStep("Analyzing leaf pattern...");
  await new Promise((r) => setTimeout(r, 1500));
  setAnalysisStep("Detecting possible diseases...");
  await new Promise((r) => setTimeout(r, 1500));
  setAnalysisStep("Finalizing report...");
  await new Promise((r) => setTimeout(r, 1500));

  // Random simulated results
  const simulatedResults = [
    {
      disease: "Leaf Spot",
      confidence: "92%",
      solution:
        "Remove affected leaves, avoid overhead watering, and apply a copper-based fungicide.",
    },
    {
      disease: "Powdery Mildew",
      confidence: "88%",
      solution:
        "Ensure good air circulation, avoid water on leaves, and use sulfur-based fungicide.",
    },
    {
      disease: "Blight",
      confidence: "90%",
      solution:
        "Remove infected parts, avoid overcrowding plants, and apply a chlorothalonil spray.",
    },
    {
      disease: "Rust",
      confidence: "85%",
      solution:
        "Cut off affected leaves and apply neem oil or a fungicide containing myclobutanil.",
    },
    {
      disease: "Healthy Leaf",
      confidence: "95%",
      solution: "Your plant appears healthy! Continue regular watering and care.",
    },
  ];

  const randomResult =
    simulatedResults[Math.floor(Math.random() * simulatedResults.length)];

  setIsLoading(false);
  setAnalysisStep("");
  setResult(randomResult);
};


  const handleClear = () => {
    setImagePreview(null);
    setResult(null);
    fileInputRef.current.value = null;
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(135deg, #f0f9ff 0%, #ecfdf5 50%, #f0fdf4 100%)",
        padding: "100px 20px 50px 20px",
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      }}
    >
      {/* Header Section */}
      <div style={{ textAlign: "center", marginBottom: "50px" }}>
        <h1
          style={{
            fontSize: "2.8rem",
            color: "#14532d",
            marginBottom: "15px",
            fontWeight: "800",
          }}
        >
          🌿 Plant Disease Detector
        </h1>
        <p
          style={{
            fontSize: "1.2rem",
            color: "#374151",
            maxWidth: "700px",
            margin: "0 auto",
            lineHeight: "1.6",
          }}
        >
          Upload a clear image of your plant leaf and let our AI help detect
          possible diseases. Get instant insights and recommendations for
          healthier plants.
        </p>
      </div>

      {/* Upload Section */}
      <div
        style={{
          textAlign: "center",
          background: "white",
          padding: "40px",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
          maxWidth: "800px",
          margin: "0 auto 60px",
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          ref={fileInputRef}
          style={{ display: "none" }}
        />
        {!imagePreview ? (
          <button
            onClick={() => fileInputRef.current.click()}
            style={{
              background: "#15803d",
              color: "white",
              padding: "15px 35px",
              fontSize: "1.1rem",
              borderRadius: "12px",
              border: "none",
              cursor: "pointer",
              transition: "background 0.3s",
            }}
          >
            📤 Upload Leaf Image
          </button>
        ) : (
          <div>
            <img
              src={imagePreview}
              alt="Preview"
              ref={imageRef}
              style={{
                width: "300px",
                height: "300px",
                objectFit: "cover",
                borderRadius: "15px",
                marginBottom: "20px",
              }}
            />
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button
                onClick={handleDetectDisease}
                disabled={isLoading}
                style={{
                  background: "#16a34a",
                  color: "white",
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                🔍 {isLoading ? "Analyzing..." : "Detect Disease"}
              </button>
              <button
                onClick={handleClear}
                style={{
                  background: "#dc2626",
                  color: "white",
                  padding: "12px 28px",
                  borderRadius: "10px",
                  border: "none",
                  fontSize: "1rem",
                  cursor: "pointer",
                }}
              >
                ❌ Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Step */}
      {isLoading && (
        <div
          style={{
            textAlign: "center",
            color: "#166534",
            fontSize: "1.2rem",
            fontWeight: "600",
          }}
        >
          {analysisStep}
        </div>
      )}

      {/* Result Section */}
      {result && (
        <div
          style={{
            textAlign: "center",
            background: "white",
            padding: "40px",
            borderRadius: "20px",
            boxShadow: "0 8px 20px rgba(0, 0, 0, 0.1)",
            maxWidth: "800px",
            margin: "40px auto",
          }}
        >
          <h2 style={{ color: "#14532d", fontSize: "2rem", marginBottom: "10px" }}>
            🧠 Analysis Result
          </h2>
          <p style={{ fontSize: "1.1rem", color: "#374151" }}>
            <strong>Disease Detected:</strong> {result.disease}
          </p>
          <p style={{ fontSize: "1.1rem", color: "#374151" }}>
            <strong>Confidence Level:</strong> {result.confidence}
          </p>
          <p style={{ fontSize: "1.1rem", color: "#374151", marginTop: "10px" }}>
            <strong>Recommended Action:</strong> {result.solution}
          </p>
        </div>
      )}

      {/* Disclaimer Section */}
      <div
        style={{
          marginTop: "60px",
          padding: "25px",
          background: "linear-gradient(135deg, #fef2f2, #fee2e2)",
          border: "2px solid #fecaca",
          borderRadius: "20px",
          boxShadow: "0 8px 20px rgba(239, 68, 68, 0.2)",
          maxWidth: "900px",
          margin: "60px auto 0",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            color: "#b91c1c",
            fontWeight: "800",
            fontSize: "1.4rem",
            marginBottom: "10px",
          }}
        >
          ⚠️ Disclaimer
        </h3>
        <p
          style={{
            color: "#7f1d1d",
            fontSize: "1.1rem",
            lineHeight: "1.6",
            fontWeight: "500",
          }}
        >
          The given analysis results may not be accurate. This application is
          intended <strong>only for testing and educational purposes</strong> — it
          should not be used for real-world plant health diagnosis or
          agricultural decisions.
        </p>
      </div>
    </div>
  );
}

export default DiseaseDetectorPage;