const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const app = express();
app.use(cors());
// Increased limit is necessary for the Base64 images from your AdminPage
app.use(express.json({ limit: '20mb' })); 

const PORT = 3002;
let currentOtp = ""; 

// --- 1. MONGODB CONNECTION ---
mongoose.connect('mongodb://localhost:27017/krushimitra_db')
  .then(() => console.log("🌱 MongoDB Connected: krushimitra_db"))
  .catch(err => console.error("❌ MongoDB Connection Error:", err));

// --- 2. MONGODB MODELS ---
const plantSchema = new mongoose.Schema({
  id: String, 
  name: String,
  category: String,
  price: Number,
  stockCount: Number,
  image: String,
  healthStatus: { type: String, default: "Healthy" }
});

const enquirySchema = new mongoose.Schema({
  name: String,
  phone: String,
  message: String,
  date: { type: String, default: () => new Date().toLocaleString() }
});

const Plant = mongoose.model('Plant', plantSchema);
const Enquiry = mongoose.model('Enquiry', enquirySchema);

// --- 3. EMAIL CONFIGURATION ---
const MY_EMAIL = "purvitamore03@gmail.com"; 
const MY_PASSWORD = "yckg ygxs zbqk teer"; // Ensure this is your 16-character App Password

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { user: MY_EMAIL, pass: MY_PASSWORD },
});

// --- 4. CONTACT PAGE LOGIC (ENQUIRIES) ---
app.post("/enquiries", async (req, res) => {
  try {
    const { name, phone, message } = req.body;
    const newEnquiry = new Enquiry({ name, phone, message });
    await newEnquiry.save();

    await transporter.sendMail({
      from: MY_EMAIL,
      to: MY_EMAIL,
      subject: `New Inquiry from ${name}`,
      text: `Name: ${name}\nPhone: ${phone}\nMessage: ${message}`,
    });
    res.send({ success: true });
  } catch (error) {
    console.error("Enquiry Error:", error);
    res.status(500).send({ success: false });
  }
});

// --- 5. ADMIN LOGIN & OTP LOGIC ---
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
  console.log("----------------------------");
  console.log("🔑 GENERATED OTP:", currentOtp); 
  console.log("----------------------------");
  
  transporter.sendMail({
    from: MY_EMAIL,
    to: MY_EMAIL,
    subject: "Admin Access Code",
    text: `Your KrushiMitra Admin code is: ${currentOtp}`,
  }, (err) => {
    if (err) {
        console.error("❌ Email failed:", err);
        return res.status(500).send({ success: false });
    }
    res.send({ success: true });
  });
});

app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  
  console.log(`🧪 ATTEMPT: Received [${otp}] | Stored [${currentOtp}]`);

  // Using String() and trim() to ensure a perfect match
  if (currentOtp && String(currentOtp).trim() === String(otp).trim()) {
    console.log("✅ VERIFIED: Access Granted");
    currentOtp = ""; 
    res.send({ success: true });
  } else {
    console.log("❌ FAILED: Code Mismatch");
    res.status(400).send({ success: false, message: "Invalid Code" });
  }
});

// --- 6. DASHBOARD & PLANT LOGIC ---



app.get('/admin/stats', async (req, res) => {
  try {
    const plants = await Plant.find();
    const enquiries = await Enquiry.find();
    res.json({ 
      plantCount: plants.length, 
      plants: plants, 
      enquiries: enquiries 
    });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.post('/plants', async (req, res) => {
  try {
    const newPlant = new Plant({
      id: String(Date.now()),
      ...req.body
    });
    await newPlant.save();
    res.status(201).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false });
  }
});

app.delete('/plants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedPlant = await Plant.findOneAndDelete({ id: id });
    
    if (!deletedPlant) {
      return res.status(404).json({ success: false, message: "Plant not found" });
    }
    res.json({ success: true, message: "Plant deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.listen(PORT, () => console.log(`🚀 Krushimitra Backend running on http://localhost:${PORT}`));