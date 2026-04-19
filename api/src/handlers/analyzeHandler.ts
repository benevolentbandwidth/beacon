import type { Request, Response } from "express";
import type { AnalyzeRequest } from "../types/api.js";
import { AnalyzeService } from "../services/analyzeService.js";

const analyzeService = new AnalyzeService();

export async function analyzeHandler(req: Request, res: Response) {
  const request: AnalyzeRequest = {
    text: req.body.text,
    url: req.body.url,
    heuristic_score: req.body.heuristic_score,
    context: req.body.context,
  };

  try {
    const result = await analyzeService.analyze(request);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
}
