import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Initialize Gemini client safely
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", app: "StudyMate AI", time: new Date().toISOString() });
});

// AI Study Assistant Chat
app.post("/api/ai/ask", async (req, res) => {
  try {
    const { prompt, context, history = [] } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: "Prompt is required" });
    }

    const ai = getGeminiClient();
    
    // System instruction tailored for an empathetic, concise, and structured AI Study Companion
    const systemInstruction = `You are StudyMate AI, an expert, encouraging, and clear AI Study Companion and Academic Tutor.
Your goals:
1. Provide accurate, clear, and easy-to-understand explanations for any study subject (Math, Science, History, Languages, Coding, Literature, etc.).
2. Break down complex concepts into step-by-step digestible points, using bullet points, bold key terms, and code/math blocks where helpful.
3. Be supportive, concise, and helpful. If context about the user's subjects or current task is provided, tailor your response to it.
${context ? `User Context: ${JSON.stringify(context)}` : ""}`;

    // Format chat prompt with history if provided
    let combinedPrompt = prompt;
    if (history && Array.isArray(history) && history.length > 0) {
      const recentHistory = history.slice(-6); // last 6 turns
      const formattedHistory = recentHistory
        .map((h: { sender: string; text: string }) => `${h.sender === "user" ? "Student" : "StudyMate"}: ${h.text}`)
        .join("\n");
      combinedPrompt = `Conversation History:\n${formattedHistory}\n\nStudent: ${prompt}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: combinedPrompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return res.json({ response: response.text });
  } catch (error: any) {
    console.error("Gemini AI ask error:", error);
    return res.status(500).json({
      error: error.message || "Failed to process AI query",
      fallbackMessage: "I encountered an error processing your request. Please check that GEMINI_API_KEY is configured properly in Secrets."
    });
  }
});

// AI Summarizer
app.post("/api/ai/summarize", async (req, res) => {
  try {
    const { text, format = "bullet-points" } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Text content is required for summarization" });
    }

    const ai = getGeminiClient();
    const systemInstruction = `You are a study summarizer. Transform study material, textbook chapters, or lecture notes into clean, high-yield revision notes.
Format: ${format === "bullet-points" ? "Key Takeaways (Bullet Points), Essential Vocabulary, and Core Summary" : "Executive Summary, Mind Map Outline, and Action Points"}.
Use markdown with clear bold headers.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Please summarize the following study text:\n\n${text}`,
      config: {
        systemInstruction,
        temperature: 0.4,
      },
    });

    return res.json({ summary: response.text });
  } catch (error: any) {
    console.error("Gemini AI summarize error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate summary" });
  }
});

// AI Flashcards Generator
app.post("/api/ai/generate-flashcards", async (req, res) => {
  try {
    const { topic, text, count = 5 } = req.body;
    if (!topic && !text) {
      return res.status(400).json({ error: "Topic or text is required for flashcards" });
    }

    const ai = getGeminiClient();
    const prompt = `Create ${count} high-yield study flashcards for topic or material: "${topic || ''}".
Text material: ${text || 'N/A'}.

Return ONLY a JSON array of objects with keys "front" (question/prompt) and "back" (clear concise answer).
Example format:
[
  {"front": "What is Photosynthesis?", "back": "Process where plants convert light energy into chemical energy (glucose) using water and CO2."},
  {"front": "Where does dark reaction occur?", "back": "In the stroma of chloroplasts."}
]`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        temperature: 0.5,
      },
    });

    const jsonText = response.text || "[]";
    let flashcards = [];
    try {
      flashcards = JSON.parse(jsonText);
    } catch {
      flashcards = [];
    }

    return res.json({ flashcards });
  } catch (error: any) {
    console.error("Gemini Flashcard error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate flashcards" });
  }
});

// AI Homework Helper
app.post("/api/ai/homework-help", async (req, res) => {
  try {
    const { problem, subject } = req.body;
    if (!problem) {
      return res.status(400).json({ error: "Homework problem statement is required" });
    }

    const ai = getGeminiClient();
    const prompt = `Solve and explain this ${subject || "General"} homework problem step-by-step:
"${problem}"

Structure your output as follows:
### 🎯 Problem Statement
### 💡 Concept & Key Formula / Idea
### 📝 Step-by-Step Solution
### ✅ Final Answer
### 🎓 Learning Tip`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        systemInstruction: "You are an expert tutor solving student homework problems accurately and educationally.",
        temperature: 0.3,
      },
    });

    return res.json({ solution: response.text });
  } catch (error: any) {
    console.error("Gemini Homework error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate solution" });
  }
});

// AI Study Plan Generator
app.post("/api/ai/generate-study-plan", async (req, res) => {
  try {
    const { subjects, daysUntilExam, hoursPerDay } = req.body;
    const ai = getGeminiClient();

    const prompt = `Create a structured study timetable schedule for a student studying: ${subjects ? subjects.join(", ") : "General subjects"}.
Days available: ${daysUntilExam || 7} days.
Daily study goal: ${hoursPerDay || 3} hours/day.

Format the output clearly using Markdown headers and tables for daily study blocks with subjects, topics, and break recommendations.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    return res.json({ plan: response.text });
  } catch (error: any) {
    console.error("Gemini Study Plan error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate study plan" });
  }
});

// Vite Middleware & Static Serving
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`StudyMate AI Server listening on http://localhost:${PORT}`);
  });
}

startServer();
