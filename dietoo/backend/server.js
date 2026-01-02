import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Init Gemini with API Key
const genAI = new GoogleGenerativeAI("AIzaSyD5dvbUYHXf1Zqr8yrDEyrZN30Jbk399gU");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (req, res) => {
  res.send("✅ Vertex Gemini backend running");
});

app.post("/api/diet", async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Prompt required" });
    }

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const reply = response.text();

    res.json({ reply });
  } catch (err) {
    console.error("🔥 Gemini error:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => {
  console.log("🚀 Backend running on http://localhost:5000");
});
