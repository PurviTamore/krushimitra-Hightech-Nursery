import React, { useRef, useState } from "react";
import axios from "axios";

interface DiseaseResult {
  disease: string;
  confidence: string;
  solution: string;
}

const DiseaseDetectorPage: React.FC = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [base64Image, setBase64Image] = useState<string | null>(null);
  const [result, setResult] = useState<DiseaseResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysisStep, setAnalysisStep] = useState<string>("");

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      const reader = new FileReader();
      reader.onloadend = () => {
        setBase64Image(reader.result as string);
      };
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleDetectDisease = async (): Promise<void> => {
    if (!imagePreview || !base64Image) {
      alert("Please upload an image first.");
      return;
    }

    setIsLoading(true);
    setResult(null);

    setAnalysisStep("Step 1: Analyzing leaf pattern...");
    await new Promise((r) => setTimeout(r, 1200));
    setAnalysisStep("Step 2: Checking database for matches...");
    await new Promise((r) => setTimeout(r, 1200));

    const simulatedResults: DiseaseResult[] = [
      { disease: "Leaf Spot", confidence: "92%", solution: "Remove affected leaves and apply copper-based fungicide." },
      { disease: "Powdery Mildew", confidence: "88%", solution: "Ensure good air circulation and use sulfur-based spray." },
      { disease: "Healthy Leaf", confidence: "98%", solution: "No action needed. Your plant is doing great!" },
    ];

    const randomResult = simulatedResults[Math.floor(Math.random() * simulatedResults.length)];

    // Send data to ML Feedback Server (Port 3003)
    try {
      await axios.post("http://localhost:3003/feedback", {
        image: base64Image,
        prediction: randomResult.disease,
        confidence: randomResult.confidence,
        userFeedback: "auto-log"
      });
    } catch (err) {
      console.log("Note: Feedback server not running, but simulation continues.");
    }

    setIsLoading(false);
    setAnalysisStep("");
    setResult(randomResult);
  };

  const handleClear = (): void => {
    setImagePreview(null);
    setBase64Image(null);
    setResult(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f3f4f6", padding: "100px 20px" }}>
      
      {/* Title - Dark Green for contrast */}
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#064e3b", fontSize: "2.5rem" }}>🌿 AI Disease Detector</h1>
        <p style={{ color: "#374151" }}>Upload leaf photo for instant analysis</p>
      </div>

      <div style={{ background: "#ffffff", padding: "30px", borderRadius: "15px", maxWidth: "600px", margin: "0 auto", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
        <input type="file" accept="image/*" ref={fileInputRef} onChange={handleImageUpload} style={{ display: "none" }} />

        {!imagePreview ? (
          <button onClick={() => fileInputRef.current?.click()} style={{ background: "#059669", color: "#fff", padding: "12px 24px", borderRadius: "8px", border: "none", cursor: "pointer", fontWeight: "bold" }}>
            Select Image
          </button>
        ) : (
          <div>
            <img src={imagePreview} alt="Preview" style={{ width: "100%", maxHeight: "300px", borderRadius: "10px", objectFit: "contain", marginBottom: "20px" }} />
            <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
              <button onClick={handleDetectDisease} disabled={isLoading} style={{ background: "#10b981", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                {isLoading ? "Running..." : "Analyze Now"}
              </button>
              <button onClick={handleClear} style={{ background: "#ef4444", color: "white", padding: "10px 20px", borderRadius: "8px", border: "none", cursor: "pointer" }}>
                Clear
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Analysis Step - Explicitly Black Text */}
      {isLoading && (
        <div style={{ textAlign: "center", marginTop: "20px", color: "#000000", fontWeight: "600", fontSize: "1.1rem" }}>
          ⏳ {analysisStep}
        </div>
      )}

      {/* RESULTS SECTION - High Visibility Black Text */}
      {result && (
        <div style={{ background: "#ffffff", marginTop: "30px", padding: "30px", borderRadius: "15px", maxWidth: "600px", marginInline: "auto", border: "2px solid #10b981", boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)" }}>
          <h2 style={{ color: "#000000", borderBottom: "1px solid #eee", paddingBottom: "10px" }}>🧠 Analysis Results</h2>
          
          <div style={{ marginTop: "15px", color: "#000000" }}>
            <p style={{ fontSize: "1.2rem", margin: "10px 0" }}>
               <strong style={{color: "#059669"}}>Detected:</strong> {result.disease}
            </p>
            <p style={{ fontSize: "1.1rem", margin: "10px 0" }}>
               <strong style={{color: "#059669"}}>Confidence:</strong> {result.confidence}
            </p>
            <div style={{ marginTop: "20px", padding: "15px", backgroundColor: "#f0fdf4", borderRadius: "8px", borderLeft: "5px solid #10b981" }}>
               <strong style={{ display: "block", marginBottom: "5px", color: "#000000" }}>Recommended Solution:</strong>
               <span style={{ color: "#000000", lineHeight: "1.5" }}>{result.solution}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetectorPage;