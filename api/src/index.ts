import express from "express";
import { analyzeHandler } from "./handlers/analyzeHandler.js";
import { validateAnalyzeRequest } from "./middleware/validate.js";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(express.json({ limit: "512kb" }));

// POST /v1/analyze - AI-powered analysis
app.post("/v1/analyze", validateAnalyzeRequest, analyzeHandler);

app.listen(PORT, () => {
  console.log(`Beacon API listening on port ${PORT}`);
});
