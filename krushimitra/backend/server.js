const fs = require('fs');
const path = require('path');
const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const PORT = 3002;
const dbPath = path.join(__dirname, 'db.json');
let currentOtp = ""; 

// --- CONFIGURATION ---
const MY_EMAIL = "purvitamore03@gmail.com"; 
const MY_PASSWORD = "yckg ygxs zbqk teer"; 

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: MY_EMAIL, pass: MY_PASSWORD },
});

// Ensure DB exists and is formatted correctly
if (!fs.existsSync(dbPath)) {
    fs.writeFileSync(dbPath, JSON.stringify({ plants: [], enquiries: [] }, null, 2));
}

// --- 1. CONTACT PAGE LOGIC (ENQUIRIES) ---
app.post("/enquiries", async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    const newEnquiry = { id: Date.now(), name, phone, message, date: new Date().toLocaleString() };
    db.enquiries.push(newEnquiry);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    await transporter.sendMail({
      from: MY_EMAIL,
      to: MY_EMAIL,
      subject: `New Inquiry from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nMessage: ${message}`,
    });
    res.send({ success: true });
  } catch (error) {
    res.status(500).send({ success: false });
  }
});

// --- 2. ADMIN LOGIN & OTP LOGIC ---
app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;
  if (username === "admin" && password === "admin123") {
    res.send({ success: true });
  } else {
    res.status(401).send({ success: false });
  }
});

app.post("/send-otp", (req, res) => {
  currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
  console.log("SERVER LOG: OTP is", currentOtp); 
  
  transporter.sendMail({
    from: MY_EMAIL,
    to: MY_EMAIL,
    subject: "Admin Access Code",
    text: `Your KrushiMitra Admin code is: ${currentOtp}`,
  }, (err) => {
    if (err) return res.status(500).send({ success: false });
    res.send({ success: true });
  });
});

app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  if (currentOtp === String(otp).trim()) {
    currentOtp = ""; 
    res.send({ success: true });
  } else {
    res.status(400).send({ success: false });
  }
});

// --- 3. DASHBOARD & PLANT LOGIC ---

// UPDATED: Now returns full plants array so AdminPage can list them for deletion
app.get('/admin/stats', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  res.json({ 
    plantCount: db.plants.length, 
    plants: db.plants, // Added this line
    enquiries: db.enquiries || [] 
  });
});

app.post('/plants', (req, res) => {
  const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  db.plants.push({ id: String(Date.now()), ...req.body });
  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.status(201).json({ success: true });
});

// NEW: Delete Plant Route
app.delete('/plants/:id', (req, res) => {
  try {
    const { id } = req.params;
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Filter out the plant with the matching ID
    const initialCount = db.plants.length;
    db.plants = db.plants.filter(p => p.id !== id);
    
    if (db.plants.length === initialCount) {
      return res.status(404).json({ success: false, message: "Plant not found" });
    }

    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
    res.json({ success: true, message: "Plant deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));