const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const nodemailer = require("nodemailer");

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const PORT = 3002;
let currentOtp = "";

// --- DATABASE CONNECTION ---
mongoose.connect('mongodb://localhost:27017/krushimitra_db')
  .then(() => console.log("🌱 Enterprise BI Cloud Active"))
  .catch(err => console.error("❌ DB Error:", err));

// --- SCHEMAS ---
const plantSchema = new mongoose.Schema({
  name: String,
  category: String,
  price: Number,
  stockCount: Number,
  image: String,
  healthStatus: { type: String, default: "Healthy" },
  createdAt: { type: Date, default: Date.now }
});

const Plant = mongoose.model('Plant', plantSchema);
const Enquiry = mongoose.model('Enquiry', new mongoose.Schema({ 
    name: String, phone: String, message: String, 
    date: { type: String, default: () => new Date().toLocaleString() } 
}));

// --- SECURE MAIL ENGINE ---
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { 
    user: "purvitamore03@gmail.com", 
    pass: "yckg ygxs zbqk teer" // Ensure this is your latest Google App Password
  },
});

// --- AUTHENTICATION ROUTES ---
app.post("/send-otp", (req, res) => {
  currentOtp = Math.floor(100000 + Math.random() * 900000).toString();
  
  const mailOptions = {
    from: "purvitamore03@gmail.com",
    to: "purvitamore03@gmail.com",
    subject: "Krushimitra Secure Access Code",
    html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #22c55e;">
        <h2 style="color: #22c55e;">Admin Verification</h2>
        <p>A login attempt was made for Krushimitra BI HQ.</p>
        <div style="font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #333;">${currentOtp}</div>
        <p>This code expires in 10 minutes.</p>
      </div>
    `
  };

  transporter.sendMail(mailOptions, (err) => {
    if (err) {
      console.log(err);
      res.status(500).send({ success: false });
    } else {
      res.send({ success: true });
    }
  });
});

app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  if (currentOtp && String(currentOtp) === String(otp)) {
    currentOtp = ""; // Clear OTP after use
    res.send({ success: true });
  } else {
    res.status(400).send({ success: false });
  }
});

// --- DATA MANAGEMENT ROUTES ---
app.get('/admin/stats', async (req, res) => {
  const plants = await Plant.find();
  const enquiries = await Enquiry.find().sort({ _id: -1 });
  res.json({ plants, enquiries });
});

app.post('/plants', async (req, res) => {
  const newPlant = new Plant(req.body);
  await newPlant.save();
  res.status(201).json({ success: true });
});

app.delete('/plants/:id', async (req, res) => {
    await Plant.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.delete('/enquiries/:id', async (req, res) => {
    await Enquiry.findByIdAndDelete(req.params.id);
    res.json({ success: true });
});

app.listen(PORT, () => console.log(`🚀 BI System live on Port ${PORT}`));