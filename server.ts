import express from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  // API Route for METAR data
  app.get("/api/metar/:icao", async (req, res) => {
    const { icao } = req.params;
    const apiKey = process.env.AVWX_API_KEY || "KRelo_GKt3pGVbi4JOba7F2gY8OhhHxLBKOLu45tLlY";
    
    try {
      const response = await fetch(`https://avwx.rest/api/metar/${icao.toUpperCase()}`, {
        headers: {
          "Authorization": apiKey
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return res.status(response.status).json({ 
          error: "Failed to fetch METAR data", 
          details: errorData 
        });
      }
      
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("METAR fetch error:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(process.cwd(), "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(process.cwd(), "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Vaayu Server running on http://localhost:${PORT}`);
  });
}

startServer();
