import React, { useRef, useState } from "react";
import axios from "axios";

/* ---------- Interfaces ---------- */
interface DiseaseResult {
  disease: string;
  confidence: string;
  solution: string;
}

/* ---------- Treatment Database ---------- */
// This maps the "Clean Name" from Python to a specific treatment
const TREATMENT_DB: Record<string, string> = {
  "Apple Scab": "Apply copper-based fungicides in early spring. Rake and burn fallen leaves to prevent the fungus from overwintering.",
  "Black Rot": "Prune out dead or infected branches. Remove 'mummy' fruits from trees. Use sulfur or copper-based sprays during wet seasons.",
  "Cedar Apple Rust": "Remove nearby Junipers (the alternate host) if possible. Apply preventative fungicides when apple buds begin to break.",
  "Powdery Mildew": "Ensure good air circulation. Use neem oil or potassium bicarbonate sprays. Avoid overhead watering.",
  "Bacterial Spot": "Avoid high-nitrogen fertilizers which promote lush growth. Use copper-based bactericides during the growing season.",
  "Common Rust": "Plant resistant varieties. Apply fungicides containing chlorothalonil at the first sign of pustules.",
  "Northern Leaf Blight": "Rotate crops and manage residue. Use foliar fungicides if the infection is caught early.",
  "Early Blight": "Remove lower leaves to prevent soil splash. Use mulching and apply fungicides like Mancozeb.",
  "Late Blight": "Extremely aggressive. Remove and destroy infected plants immediately. Apply preventative copper sprays to surrounding plants.",
  "Leaf Blight": "Improve drainage and reduce leaf wetness. Apply fungicides early in the morning.",
  "Esca Black Measles": "Difficult to treat; focus on wound protection during pruning. Use approved wood-protectant pastes.",
  "Healthy": "Great job! Your plant shows no signs of disease. Maintain consistent watering and nutrition.",
  "Default": "Maintain balanced soil moisture and consult a local agricultural expert for specialized treatment."
};

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
      reader.onloadend = () => setBase64Image(reader.result as string);
      reader.readAsDataURL(file);
      setResult(null);
    }
  };

  const handleDetectDisease = async (): Promise<void> => {
    if (!base64Image) {
      alert("Please upload a leaf image first.");
      return;
    }

    setIsLoading(true);
    setAnalysisStep("🧠 AI is analyzing leaf pixels...");

    try {
      // 🚀 Connection to your Python AI Server
      const res = await axios.post("http://localhost:3003/predict", {
        image: base64Image
      });

      const detectedName = res.data.disease; // e.g., "Apple Scab"
      
      // Lookup the solution from our database
      const solution = TREATMENT_DB[detectedName] || TREATMENT_DB["Default"];

      setResult({
        disease: detectedName,
        confidence: res.data.confidence,
        solution: solution
      });
    } catch (err) {
      console.error(err);
      alert("ML Server Offline! Please ensure 'python app.py' is running on Port 3003.");
    } finally {
      setIsLoading(false);
      setAnalysisStep("");
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f0f4f0", padding: "120px 20px" }}>
      
      <div style={{ textAlign: "center", marginBottom: "40px" }}>
        <h1 style={{ color: "#1b4332", fontSize: "2.8rem" }}>🌿 Krushimitra AI Detector</h1>
        <p style={{ color: "#2d6a4f", fontSize: "1.1rem" }}>Advanced Convolutional Neural Network for Plant Health</p>
      </div>

      <div style={{ 
        background: "#ffffff", 
        padding: "40px", 
        borderRadius: "20px", 
        maxWidth: "650px", 
        margin: "0 auto", 
        boxShadow: "0 10px 25px rgba(0,0,0,0.1)", 
        textAlign: "center" 
      }}>
        <input 
          type="file" 
          accept="image/*" 
          ref={fileInputRef} 
          onChange={handleImageUpload} 
          style={{ display: "none" }} 
        />

        {!imagePreview ? (
          <div 
            onClick={() => fileInputRef.current?.click()}
            style={{ 
              border: "2px dashed #95d5b2", 
              padding: "50px", 
              borderRadius: "15px", 
              cursor: "pointer",
              backgroundColor: "#f7fcf9"
            }}
          >
            <p style={{ color: "#40916c", fontWeight: "600" }}>Click to select or drag a leaf photo</p>
          </div>
        ) : (
          <div>
            <img 
              src={imagePreview} 
              alt="Preview" 
              style={{ width: "100%", maxHeight: "350px", borderRadius: "12px", objectFit: "cover", marginBottom: "25px" }} 
            />
            <div style={{ display: "flex", gap: "15px", justifyContent: "center" }}>
              <button 
                onClick={handleDetectDisease} 
                disabled={isLoading}
                style={{ 
                  background: "#2d6a4f", color: "white", padding: "12px 25px", 
                  borderRadius: "10px", border: "none", cursor: "pointer", fontSize: "1rem" 
                }}
              >
                {isLoading ? "Running AI..." : "Analyze Health"}
              </button>
              <button 
                onClick={() => { setImagePreview(null); setResult(null); }}
                style={{ 
                  background: "#ef4444", color: "white", padding: "12px 25px", 
                  borderRadius: "10px", border: "none", cursor: "pointer" 
                }}
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div style={{ textAlign: "center", marginTop: "25px", color: "#1b4332", fontWeight: "bold" }}>
          ⏳ {analysisStep}
        </div>
      )}

      {result && (
        <div style={{ 
          background: "#ffffff", 
          marginTop: "40px", 
          padding: "35px", 
          borderRadius: "20px", 
          maxWidth: "650px", 
          marginInline: "auto", 
          border: "2px solid #52b788",
          boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
        }}>
          <h2 style={{ color: "#1b4332", borderBottom: "2px solid #f0f4f0", paddingBottom: "10px" }}>🧠 Detection Result</h2>
          
          <div style={{ marginTop: "20px" }}>
            <p style={{ fontSize: "1.3rem", margin: "10px 0", color: "#333" }}>
               <strong>Condition:</strong> <span style={{color: "#2d6a4f"}}>{result.disease}</span>
            </p>
            <p style={{ fontSize: "1.1rem", margin: "10px 0", color: "#333" }}>
               <strong>Confidence:</strong> {result.confidence}
            </p>
            
            <div style={{ 
              marginTop: "25px", 
              padding: "20px", 
              backgroundColor: "#f7fcf9", 
              borderRadius: "12px", 
              borderLeft: "6px solid #2d6a4f" 
            }}>
               <strong style={{ display: "block", marginBottom: "8px", color: "#1b4332", fontSize: "1.1rem" }}>
                 Recommended Treatment:
               </strong>
               <p style={{ color: "#444", lineHeight: "1.6", margin: 0 }}>{result.solution}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiseaseDetectorPage;