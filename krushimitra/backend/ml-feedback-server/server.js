import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = 3003; 

app.use(cors());
app.use(express.json({ limit: "20mb" })); // Increased for high-res images

const feedbackFilePath = path.join(process.cwd(), "feedback.json");

const readFeedback = () => {
  if (fs.existsSync(feedbackFilePath)) {
    return JSON.parse(fs.readFileSync(feedbackFilePath, 'utf8'));
  }
  return [];
};

const writeFeedback = (data) => {
  fs.writeFileSync(feedbackFilePath, JSON.stringify(data, null, 2));
};

app.post("/feedback", (req, res) => {
  const { image, prediction, confidence, userFeedback } = req.body;

  const feedbackData = readFeedback();

  // Create a clean object for DMBA processing
  const newEntry = {
    id: Date.now(),
    timestamp: new Date().toISOString(),
    imagePreview: image ? image.substring(0, 50) + "..." : "no-image", 
    prediction,
    confidence,
    userFeedback
  };

  feedbackData.push(newEntry);
  writeFeedback(feedbackData);

  console.log(`✅ Feedback logged: ${prediction} (${confidence})`);
  res.json({ success: true, totalEntries: feedbackData.length });
});

app.get("/feedback", (req, res) => {
  res.json(readFeedback());
});

app.listen(PORT, () => {
  console.log(`🚀 ML Logic Server active on http://localhost:${PORT}`);
});