import type { Request, Response, NextFunction } from "express";
import type { Context } from "../types/api.js";

const VALID_CONTEXTS: Context[] = ["email_body", "sms", "form", "page_body"];
const MAX_TEXT_LENGTH = 8000;

export function validateAnalyzeRequest(req: Request, res: Response, next: NextFunction) {
  const { text, url, heuristic_score, context } = req.body;

  // 400: Missing required fields
  if (typeof text !== "string") {
    res.status(400).json({ error: "Missing required field: text" });
    return;
  }
  if (typeof url !== "string") {
    res.status(400).json({ error: "Missing required field: url" });
    return;
  }
  if (typeof heuristic_score !== "number") {
    res.status(400).json({ error: "Missing required field: heuristic_score" });
    return;
  }
  if (typeof context !== "string") {
    res.status(400).json({ error: "Missing required field: context" });
    return;
  }

  // 413: Text too long
  if (text.length > MAX_TEXT_LENGTH) {
    res.status(413).json({ error: "Text exceeds 8000 character limit" });
    return;
  }

  // 422: Invalid context
  if (!VALID_CONTEXTS.includes(context as Context)) {
    res.status(422).json({ error: "Invalid context value" });
    return;
  }

  next();
}
