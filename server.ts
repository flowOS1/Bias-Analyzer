import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
app.use(express.json({ limit: "5mb" }));

const PORT = 3000;

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Analysis endpoint
app.post("/api/analyze", async (req: express.Request, res: express.Response): Promise<void> => {
  try {
    const { text, focus = "general" } = req.body;

    if (!text || typeof text !== "string" || text.trim().length < 10) {
      res.status(400).json({ error: "Text must be at least 10 characters long to analyze." });
      return;
    }

    let focusInstruction = "";
    if (focus === "media") {
      focusInstruction = "Focus heavily on journalistic standards, media framing, sensationalism, headline exaggerations, and loaded language commonly found in news articles.";
    } else if (focus === "political") {
      focusInstruction = "Focus on political bias, ideological slants, partisan assumptions, out-group vilification, and one-sided policy representation.";
    } else if (focus === "cognitive") {
      focusInstruction = "Focus on psychological cognitive biases reflected in writing, such as confirmation bias, self-serving bias, anchoring, groupthink, bandwagon effects, and correlation-causation fallacies.";
    } else {
      focusInstruction = "Look broadly for cognitive biases, rhetorical tricks, media framing slants, loaded language, sensationalism, and ungrounded emotional appeal.";
    }

    const systemInstruction = `You are an elite, highly objective linguist, cognitive psychologist, and professional media analyst.
Your task is to review the user's pasted text and identify cognitive biases, logical fallacies, unsupported claims, media framing techniques, sensationalist language, and rhetorical fallacies, similar to how Grammarly highlights spelling and grammar issues.

CRITICAL CATEGORIZATION:
For every highlight, you MUST identify its category in the "biasGroup" field. It MUST be exactly one of:
- "Cognitive Bias" (e.g., Confirmation Bias, Anchoring, Bandwagon Effect, In-group Favoritism, Self-serving Bias)
- "Logical Fallacy" (e.g., Ad Hominem, Strawman, False Dilemma, Slippery Slope, Circular Reasoning, Correlation-Causation)
- "Unsupported Claim" (e.g., Unsubstantiated Generalization, Anecdotal Evidence as Fact, Vague Authority Reference, Missing Empirical Evidence)

CRITICAL INSTRUCTIONS:
1. Every item in the "highlights" list MUST contain "matchedText" that is a 100% exact character-for-character substring of the original text.
2. If you cannot find any bias, return an empty "highlights" array, but still calculate the objectivity/neutrality scores.
3. Keep the "explanation" educational, explaining the name of the bias/fallacy/claim issue and its psychological or rhetorical mechanism in 1-2 friendly sentences.
4. The "suggestedRewrite" must be a neutral, objective, and fair replacement for the exact "matchedText" that retains the original intended meaning but eliminates the slant or bias.

Analysis Focus:
${focusInstruction}

Please respond strictly in JSON according to the schema provided.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: `Please analyze the following text for biases:\n\n${text}`,
      config: {
        systemInstruction,
        temperature: 0.1, // low temperature for highly structured analysis
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            overallScore: {
              type: Type.INTEGER,
              description: "Overall bias level score from 0 (completely objective/unbiased) to 100 (extremely biased/propaganda)."
            },
            neutralityGrade: {
              type: Type.STRING,
              description: "Short classification label like 'Objective', 'Mildly Opinionated', 'Moderately Biased', 'Strongly Biased', or 'Extremely One-Sided'."
            },
            summary: {
              type: Type.STRING,
              description: "A 2-3 sentence high-level overview of the document's perspective, emotional loadedness, and prominent bias patterns."
            },
            categories: {
              type: Type.OBJECT,
              properties: {
                sensationalism: { type: Type.INTEGER, description: "Score from 0 to 100 indicating sensationalism/hype/clickbait tone." },
                framing: { type: Type.INTEGER, description: "Score from 0 to 100 indicating framing bias (skewing context)." },
                loadedLanguage: { type: Type.INTEGER, description: "Score from 0 to 100 indicating emotionally loaded or non-neutral terminology." },
                perspectiveBalance: { type: Type.INTEGER, description: "Score from 0 to 100 indicating lack of balanced perspectives or cherry-picked arguments." },
                cognitiveBias: { type: Type.INTEGER, description: "Score from 0 to 100 indicating underlying cognitive biases like anchoring, confirmation bias, etc." }
              },
              required: ["sensationalism", "framing", "loadedLanguage", "perspectiveBalance", "cognitiveBias"]
            },
            highlights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  matchedText: {
                    type: Type.STRING,
                    description: "The EXACT word, phrase, or sentence in the original text that exhibits the bias. It must match a substring of the input text character-for-character."
                  },
                  biasType: {
                    type: Type.STRING,
                    description: "The specific bias/fallacy/claim type, e.g., 'Confirmation Bias', 'Ad Hominem', 'Unsubstantiated Generalization', 'Sensationalism', 'Framing Bias', 'Loaded Language'."
                  },
                  biasGroup: {
                    type: Type.STRING,
                    description: "MUST be exactly one of: 'Cognitive Bias', 'Logical Fallacy', or 'Unsupported Claim'."
                  },
                  severity: {
                    type: Type.STRING,
                    description: "Severity of bias: 'low', 'medium', or 'high'."
                  },
                  explanation: {
                    type: Type.STRING,
                    description: "A concise, educational explanation of why this segment exhibits bias, explaining the cognitive or rhetorical mechanism behind it."
                  },
                  suggestedRewrite: {
                    type: Type.STRING,
                    description: "An alternative, highly objective, neutral, and balanced rewrite of the matched phrase or sentence."
                  }
                },
                required: ["matchedText", "biasType", "biasGroup", "severity", "explanation", "suggestedRewrite"]
              }
            }
          },
          required: ["overallScore", "neutralityGrade", "summary", "categories", "highlights"]
        }
      }
    });

    const resultText = response.text;
    if (!resultText) {
      throw new Error("Empty response from Gemini");
    }

    const data = JSON.parse(resultText);
    res.json(data);
  } catch (error: any) {
    console.error("API Error during analysis:", error);
    res.status(500).json({ error: error?.message || "Internal server error occurred during text analysis." });
  }
});

// Vite middleware for development or static serving for production
async function setupServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

setupServer();
