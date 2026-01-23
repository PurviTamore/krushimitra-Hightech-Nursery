import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";

const app = express();
const PORT = process.env.PORT || 3003;  // Using a new port to avoid conflicts

app.use(cors());
app.use(express.json({ limit: "10mb" })); // Increase limit to accept base64 images

// Store feedback in a JSON file for persistence
const feedbackFilePath = path.join(process.cwd(), "feedback.json");

// Helper function to read feedback
const readFeedback = () => {
  if (fs.existsSync(feedbackFilePath)) {
    const fileContent = fs.readFileSync(feedbackFilePath);
    return JSON.parse(fileContent);
  }
  return [];
};

// Helper function to write feedback
const writeFeedback = (data) => {
  fs.writeFileSync(feedbackFilePath, JSON.stringify(data, null, 2));
};

app.post("/feedback", (req, res) => {
  const { image, prediction, correctClass, userFeedback } = req.body;

  const feedbackData = readFeedback();

  feedbackData.push({
    timestamp: new Date().toISOString(),
    image: image.substring(0, 150) + "...", // Store only a snippet of the base64 string
    prediction,
    correctClass,
    userFeedback,
  });

  writeFeedback(feedbackData);

  console.log("✅ Feedback received. Total entries:", feedbackData.length);
  res.json({ success: true, totalFeedback: feedbackData.length });
});

app.get("/feedback", (req, res) => {
  const feedbackData = readFeedback();
  res.json(feedbackData);
});

app.listen(PORT, () => {
  console.log(`✅ ML Feedback server running on http://localhost:${PORT}`);
});
