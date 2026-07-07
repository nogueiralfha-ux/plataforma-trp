import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini client
let aiInstance: GoogleGenAI | null = null;

function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is required");
    }
    aiInstance = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

// Chat support endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemPrompt } = req.body;
    if (!messages || !Array.isArray(messages)) {
       res.status(400).json({ error: "Invalid messages array" });
       return;
    }

    const ai = getGeminiClient();

    // Map history to contents for Gemini API
    const contents = messages.map(msg => ({
      role: msg.sender === 'user' ? 'user' : 'model',
      parts: [{ text: msg.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents,
      config: {
        systemInstruction: systemPrompt || "Você é um terapeuta/coaching acolhedor, profissional e prestativo, focado em ajudar o usuário a se recuperar fisicamente, mentalmente e espiritualmente no protocolo TRP. Responda em português de forma clara, empática e motivadora. Nunca prescreva medicamentos médicos, foque em hábitos saudáveis, respiração, exercícios leves e equilíbrio."
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error("Error in /api/chat:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Journal entry analysis endpoint (structured JSON output)
app.post("/api/diary-analyze", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
       res.status(400).json({ error: "Text is required for analysis" });
       return;
    }

    const ai = getGeminiClient();

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Analise a seguinte entrada de diário terapêutico escrita pelo usuário e retorne uma análise estruturada contendo o sentimento predominante ('joy', 'neutral', 'sad', 'anxious', 'angry' ou 'tired'), um conselho terapêutico acolhedor e encorajador, e até 3 palavras-chave/tags de bem-estar recomendadas.\n\nTexto do usuário: "${text}"`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            sentiment: {
              type: Type.STRING,
              description: "Sentimento predominante da entrada. Deve ser exatamente um dos seguintes: joy, neutral, sad, anxious, angry, tired."
            },
            advice: {
              type: Type.STRING,
              description: "Conselho terapêutico e acolhedor (máximo de 3 frases) em português."
            },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Até 3 palavras-chave de bem-estar ou tópicos abordados (ex: 'Autocuidado', 'Mindfulness', 'Fadiga', 'Ansiedade')."
            }
          },
          required: ["sentiment", "advice", "tags"]
        }
      }
    });

    if (response.text) {
      const data = JSON.parse(response.text.trim());
      res.json(data);
    } else {
      res.status(500).json({ error: "Failed to generate sentiment analysis" });
    }
  } catch (error: any) {
    console.error("Error in /api/diary-analyze:", error);
    res.status(500).json({ error: error.message || "Internal server error" });
  }
});

// Vite middleware integrated for dev / Production build asset delivery
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
