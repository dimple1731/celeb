import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-loaded GoogleGenAI client helper
let aiClient: GoogleGenAI | null = null;
function getAIClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      throw new Error("GEMINI_API_KEY is not configured. Please add it to your secrets or .env file.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

// API Route for Celebrity Search
app.post("/api/celebrity/search", async (req, res) => {
  const { query } = req.body;

  if (!query || typeof query !== "string" || query.trim() === "") {
    return res.status(400).json({ error: "A valid search query (famous person's name) is required." });
  }

  try {
    const ai = getAIClient();
    const prompt = `Generate a exhaustive and highly accurate "A to Z" profile for the famous person: "${query}". 
If this person is not famous, return a response for a famous person with a similar name, or the most famous correlation, but do your absolute best to fetch the exact historical/famous details for "${query}".
The response must follow the response schema provided precisely.
Make sure biography sections are rich, informative, and detailed.
For careerHighlights, list major achievements, milestones or breakthroughs.
Provide a mix of realistic socialMediaUpdates from platforms like twitter, instagram, linkedin, or tiktok, complete with matching usernames, contents, real-feeling metrics (likes, shares), and timestamps that feel current but realistic.
Provide 3-5 newsAlerts representing recent headlines, breaking announcements, or awards related to this person. Specify varying levels of importance ('high', 'medium', 'low') and news categories ('breaking', 'achievement', 'trending', 'announcement') so we can trigger live toast alerts for them.
Create inspirational quotes, fun trivia facts, and related searchSuggestions of other famous figures.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          required: [
            "name",
            "shortDescription",
            "category",
            "biography",
            "keyPersonalTraits",
            "careerHighlights",
            "awardsAndRecognition",
            "socialMediaUpdates",
            "newsAlerts",
            "quotes",
            "trivia",
            "searchSuggestions"
          ],
          properties: {
            name: {
              type: Type.STRING,
              description: "The full widely recognized name of the famous person."
            },
            shortDescription: {
              type: Type.STRING,
              description: "A short elegant tagline highlighting their main claim to fame (e.g., 'Revolutionary physicist who formed the theory of relativity')."
            },
            category: {
              type: Type.STRING,
              description: "Primary category such as Actor, Filmmaker, Scientist, Tech Leader, Musician, Author, Athlete, Historical Figure, etc."
            },
            biography: {
              type: Type.OBJECT,
              required: ["birthDate", "birthPlace", "earlyLife", "careerTrajectory", "personalLife", "impactAndLegacy"],
              properties: {
                birthDate: { type: Type.STRING, description: "Birth date or active era (e.g., 'March 14, 1879' or 'c. 570 BC')." },
                birthPlace: { type: Type.STRING, description: "Birth place or main region of activity (e.g., 'Ulm, Kingdom of Württemberg, German Empire')." },
                earlyLife: { type: Type.STRING, description: "Detailed summary of early upbringing, family, and educational backdrops." },
                careerTrajectory: { type: Type.STRING, description: "Extensive overview of their rise to prominence, initial breakthroughs, and career evolution." },
                personalLife: { type: Type.STRING, description: "Overview of family life, interests, and other notable non-career aspects." },
                impactAndLegacy: { type: Type.STRING, description: "Their ultimate enduring impact on human history, their industry, or culture." }
              }
            },
            keyPersonalTraits: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "An array of 3-5 traits (e.g., ['Visionary', 'Persistent', 'Eccentric', 'Analytical'])."
            },
            careerHighlights: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["year", "title", "description", "impact"],
                properties: {
                  year: { type: Type.STRING, description: "The year or timeframe of the highlight." },
                  title: { type: Type.STRING, description: "Title or event (e.g., 'Theory of General Relativity published')." },
                  description: { type: Type.STRING, description: "What happened exactly." },
                  impact: { type: Type.STRING, description: "The immediate of lasting consequence of this highlight." }
                }
              }
            },
            awardsAndRecognition: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["award", "year", "category"],
                properties: {
                  award: { type: Type.STRING, description: "Name of the award, honor, or degree (e.g., 'Nobel Prize in Physics')." },
                  year: { type: Type.STRING, description: "Year received." },
                  category: { type: Type.STRING, description: "Category/discipline for which they won." }
                }
              }
            },
            socialMediaUpdates: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "platform", "username", "timestamp", "content", "likes", "sharesCount", "repliesCount"],
                properties: {
                  id: { type: Type.STRING },
                  platform: { type: Type.STRING, description: "Platform token: 'twitter', 'instagram', 'linkedin', or 'tiktok'." },
                  username: { type: Type.STRING, description: "Their authentic handle or username (e.g., '@steve_jobs' or similar)." },
                  timestamp: { type: Type.STRING, description: "Recent timezone-independent stamp (e.g., '2 hours ago', 'Yesterday')." },
                  content: { type: Type.STRING, description: "Authentic sounding or real social media post matching their personality and voice." },
                  likes: { type: Type.INTEGER, description: "Approximate realistic count of likes." },
                  sharesCount: { type: Type.INTEGER, description: "Approximate realistic count of retweets or shares." },
                  repliesCount: { type: Type.INTEGER, description: "Approximate realistic count of comments." },
                  hasImage: { type: Type.BOOLEAN, description: "Does the post conceptually have a rich media image attached (e.g. true/false)?" }
                }
              }
            },
            newsAlerts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                required: ["id", "title", "source", "timeAgo", "summary", "category", "importance"],
                properties: {
                  id: { type: Type.STRING },
                  title: { type: Type.STRING, description: "A catchy headline/ticker (e.g., 'Biopic Film Announced Tracking Early Years')." },
                  source: { type: Type.STRING, description: "News publication name (e.g., 'The Hollywood Reporter', 'Nature', 'ESPN')." },
                  timeAgo: { type: Type.STRING, description: "When occurred (e.g. 'Just Now', '10m ago', '1h ago')." },
                  summary: { type: Type.STRING, description: "Short description of the event details." },
                  category: { type: Type.STRING, description: "Category: 'breaking', 'achievement', 'trending', or 'announcement'." },
                  importance: { type: Type.STRING, description: "Significance: 'high', 'medium', or 'low'." }
                }
              }
            },
            quotes: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3 popular inspirational or signature quotes by them."
            },
            trivia: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "3-4 captivating lesser-known facts or trivia."
            },
            searchSuggestions: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Names of 4 related celebrities or historical contemporary figures."
            }
          }
        }
      }
    });

    const textOutput = response.text;
    if (!textOutput) {
      throw new Error("Unable to obtain text content from Gemini model.");
    }

    const parsedProfile = JSON.parse(textOutput.trim());
    return res.json(parsedProfile);
  } catch (error: any) {
    console.error("Gemini Search API error:", error);
    return res.status(500).json({
      error: error.message || "An error occurred while processing your search. Please check your API key setup."
    });
  }
});

// Start and mount Vite middleware or static server
async function initServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode...");
    const distPath = path.join(__dirname, "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on http://0.0.0.0:${PORT}`);
  });
}

initServer().catch((err) => {
  console.error("Failed to start server", err);
});
