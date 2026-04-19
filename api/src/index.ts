import express from "express";
import { analyzeText } from "./scamHeuristics.js";
import { analyzeHandler } from "./handlers/analyzeHandler.js";
import { validateAnalyzeRequest } from "./middleware/validate.js";

// TODO: add port string access
const PORT = Number(process.env.PORT) || 3000;

const app = express();
//TODO : add rate limiting here
app.use(express.json({ limit: "512kb" }));

app.post("/v1/check", (req, res) => {
  const text = req.body?.text;
  if (typeof text !== "string") {
    res.status(400).json({ error: "Body must be JSON with a string field \"text\"." });
    return;
  }
  if (text.length === 0) {
    res.status(400).json({ error: "Field \"text\" must be non-empty." });
    return;
  }

  const result = analyzeText(text);
  res.json({
    isScam: result.isScam,
    confidence: result.confidence,
    matches: result.matches,
  });
});

// POST /v1/analyze - AI-powered analysis
app.post("/v1/analyze", validateAnalyzeRequest, analyzeHandler);

app.listen(PORT, () => {
  console.log(`Beacon API listening on port ${PORT}`);
});
