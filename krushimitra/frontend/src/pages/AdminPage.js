import React, { useState } from "react";
import axios from "axios";

// --- Reusable Add Plant Form Component (UPDATED for File Upload) ---
const AddPlantForm = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Fruit");
  // 🌟 NEW STATE: To hold the selected file object
  const [selectedFile, setSelectedFile] = useState(null); 
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState({ message: "", type: "" });

  // 🌟 NEW HANDLER: Captures the file object from the input
  const handleFileChange = (e) => {``
    setSelectedFile(e.target.files[0]);
  };

  const handleAddPlant = async (e) => {
    e.preventDefault();
    setStatus({ message: "Submitting...", type: "info" });

    // Input validation for the file
    if (!selectedFile) {
        setStatus({ message: "Please select an image file to upload.", type: "error" });
        return;
    }

    // 🌟 KEY CHANGE: Use FormData for sending files and text data together
    const formData = new FormData();
    formData.append("name", name);
    formData.append("category", category);
    formData.append("price", Number(price));
    formData.append("description", description);
    
    // Append the file itself. 'plantImage' MUST match the field name
    // your backend is configured to look for (e.g., using multer).
    formData.append("plantImage", selectedFile); 

    try {
      // NOTE: Update this URL to your deployed backend plant API endpoint
      const response = await fetch("http://localhost:3001/plants", {
        method: "POST",
        // CRUCIAL: Do NOT manually set Content-Type for FormData!
        body: formData, 
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Server responded unexpectedly.");
      }

      // Reset all form fields
      setName("");
      setCategory("Fruit");
      setSelectedFile(null); // Reset the file state
      setPrice("");
      setDescription("");
      
      // Optionally force a reset of the file input by updating a key, but 
      // relying on setSelectedFile(null) is often enough for a new selection.

      setStatus({ message: "Plant added successfully!", type: "success" });
      setTimeout(() => setStatus({ message: "", type: "" }), 3000);
    } catch (error) {
      console.error("Submission error:", error);
      setStatus({
        message: `An error occurred: ${error.message || "Please check server logs."}`,
        type: "error",
      });
    }
  };

  // getStatusStyle function remains the same...
  const getStatusStyle = () => {
    if (status.type === "success")
      return {
        color: "#4CAF50",
        background: "#e8f5e9",
        padding: "10px",
        borderRadius: "5px",
      };
    if (status.type === "error")
      return {
        color: "#f44336",
        background: "#ffebee",
        padding: "10px",
        borderRadius: "5px",
      };
    return { color: "#2196F3" };
  };

  return (
    <div className="admin-page">
      <h1>Add a New Plant</h1>
      <form onSubmit={handleAddPlant} className="admin-form">
        <input
          type="text"
          placeholder="Plant Name (e.g., Apple Tree)"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        >
          <option value="Fruit">Fruit</option>
          <option value="Flower">Flower</option>
          <option value="Vegetable">Vegetable</option>
          <option value="Medicinal">Medicinal</option>
          <option value="Indoor">Indoor</option>
          <option value="Outdoor">Outdoor</option>
        </select>
        
        {/* 🌟 REPLACED JSX for file input */}
        <div style={{ margin: '15px 0', border: '1px solid #246f3e', borderRadius: '5px', padding: '10px', background: 'rgba(0,0,0,0.2)' }}>
            <label style={{ display: 'block', color: '#ccc', marginBottom: '5px' }}>
                **Upload Plant Image:**
            </label>
            <input
                type="file"
                accept="image/*" // Restricts file selector to images
                onChange={handleFileChange}
                required
                style={{ background: 'none', border: 'none', width: '100%', color: 'white' }}
            />
             {selectedFile && (
                <p style={{ margin: '5px 0 0', fontSize: '0.9em', color: '#8BC34A' }}>
                    Selected file: **{selectedFile.name}**
                </p>
            )}
        </div>
        
        <input
          type="number"
          placeholder="Price (e.g., 799)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
        />
        <textarea
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        ></textarea>
        <button type="submit">Add Plant</button>
      </form>
      {status.message && (
        <p
          style={{
            ...getStatusStyle(),
            marginTop: "15px",
            textAlign: "center",
          }}
        >
          {status.message}
        </p>
      )}
    </div>
  );
};

// --- Main AdminPage Component with Login Flow (Original logic preserved) ---
function AdminPage() {
  const [step, setStep] = useState(1); // 1=login, 2=otp, 3=admin panel
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // NOTE: Assuming 3002 is your admin/auth service
      const res = await axios.post("http://localhost:3002/admin-login", {
        username,
        password,
      });
      if (res.data.success) {
        await axios.post("http://localhost:3002/send-otp");
        setStep(2);
      }
    } catch (err) {
      setError("Invalid credentials!");
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const res = await axios.post("http://localhost:3002/verify-otp", { otp });
      if (res.data.success) {
        setStep(3);
      }
    } catch (err) {
      setError("Invalid OTP!");
    }
  };

  const pageStyle = {
    padding: "120px 40px 40px",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #081308, #3a5a40)",
    display: "flex",
    justifyContent: "center",
    alignItems: "flex-start",
  };

  const formContainerStyle = {
    background: "rgba(255, 255, 255, 0.05)",
    padding: "30px",
    borderRadius: "15px",
    boxShadow: "0 8px 20px rgba(0, 0, 0, 0.5)",
    color: "#fff",
    width: "100%",
    maxWidth: "400px",
  };

  const inputStyle = {
    padding: "12px",
    borderRadius: "8px",
    border: "1px solid #246f3e",
    fontSize: "1rem",
    width: "100%",
    marginBottom: "15px",
    background: "rgba(0,0,0,0.2)",
    color: "#fff",
  };

  const buttonStyle = {
    padding: "14px",
    background: "#246f3e",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    width: "100%",
  };

  const errorStyle = {
    color: "#f44336",
    textAlign: "center",
    marginTop: "10px",
  };

  return (
    <div style={pageStyle}>
      {step === 1 && (
        <div style={formContainerStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Admin Login
          </h2>
          <form onSubmit={handleLogin}>
            <input
              style={inputStyle}
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <input
              style={inputStyle}
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <button style={buttonStyle} type="submit">
              Login
            </button>
            {error && <p style={errorStyle}>{error}</p>}
          </form>
        </div>
      )}

      {step === 2 && (
        <div style={formContainerStyle}>
          <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
            Enter OTP
          </h2>
          <p
            style={{
              textAlign: "center",
              marginBottom: "20px",
              fontSize: "0.9rem",
            }}
          >
            An OTP has been sent to the admin's email.
          </p>
          <form onSubmit={handleVerifyOtp}>
            <input
              style={inputStyle}
              type="text"
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <button style={buttonStyle} type="submit">
              Verify OTP
            </button>
            {error && <p style={errorStyle}>{error}</p>}
          </form>
        </div>
      )}

      {step === 3 && (
        // Once OTP is verified, show the actual Add Plant Form
        <AddPlantForm />
      )}
    </div>
  );
}

export default AdminPage;