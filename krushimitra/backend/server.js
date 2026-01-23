// ADD THESE LINES AT THE TOP
const fs = require('fs');
const path = require('path');

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");
const app = express();

app.use(cors());
app.use(bodyParser.json());

const PORT = process.env.PORT || 3002;

let otps = {};


const adminCredentials = {
  username: "admin",
  password: "admin123",
  email: "vaishnavidawane4@gmail.com",
};


const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "vaishnavidawane4@gmail.com",
    pass: "ofji cfto camh njdw",
  },
});


app.post("/enquiries", async (req, res) => {
  try {
    const { name, phone, email, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and message are required fields",
      });
    }
    const mailOptions = {
      from: `"Plant Shop Contact Form" <${adminCredentials.email}>`,
      to: adminCredentials.email,
      replyTo: email,
      subject: `New Contact Form Inquiry from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2d5a27;">New Contact Form Submission</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 8px;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: white; padding: 15px; border-radius: 5px; border-left: 4px solid #2d5a27;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>
      `,
    };
    await transporter.sendMail(mailOptions);
    res.status(200).json({
      success: true,
      message: "Your inquiry has been sent successfully!",
    });
  } catch (error) {
    console.error("Error sending inquiry email:", error);
    res.status(500).json({
      success: false,
      message: "Failed to send your inquiry. Please try again later.",
    });
  }
});


app.post("/admin-login", (req, res) => {
  const { username, password } = req.body;
  if (
    username === adminCredentials.username &&
    password === adminCredentials.password
  ) {
    res.send({ success: true, message: "Username/password correct" });
  } else {
    res.status(401).send({ success: false, message: "Invalid credentials" });
  }
});


app.post("/send-otp", (req, res) => {
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otps[adminCredentials.email] = otp;
  const mailOptions = {
    from: adminCredentials.email,
    to: adminCredentials.email,
    subject: "Your OTP for Plant Manager Admin Login",
    text: `Your OTP is: ${otp}`,
  };
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).send({ success: false, message: "Failed to send OTP" });
    }
    console.log("OTP sent:", otp);
    res.send({ success: true, message: "OTP sent to admin email" });
  });
});


app.post("/verify-otp", (req, res) => {
  const { otp } = req.body;
  if (otps[adminCredentials.email] === otp) {
    delete otps[adminCredentials.email];
    res.send({ success: true, message: "OTP verified" });
  } else {
    res.status(400).send({ success: false, message: "Invalid OTP" });
  }
});


const dbPath = path.join(__dirname, 'db.json');


app.get('/plants', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading database" });
    }
    const jsonData = JSON.parse(data);
    let plants = jsonData.plants;
    if (req.query.category) {
      plants = plants.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
    }
    res.json(plants);
  });
});


app.post('/plants', (req, res) => {
  fs.readFile(dbPath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: "Error reading database" });
    }
    const jsonData = JSON.parse(data);
    const newPlant = { id: String(Date.now()), ...req.body };
    jsonData.plants.push(newPlant);
    fs.writeFile(dbPath, JSON.stringify(jsonData, null, 2), (writeErr) => {
      if (writeErr) {
        return res.status(500).json({ message: "Error saving new plant" });
      }
      res.status(201).json(newPlant);
    });
  });
});


// This should be the last part of the file
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
); 