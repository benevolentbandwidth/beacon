// Request/Response types for POST /v1/analyze

export type Context = "email_body" | "sms" | "form" | "page_body";
export type Label = "phishing" | "suspicious" | "safe";
export type Action = "block" | "warn" | "allow";

export interface AnalyzeRequest {
  text: string;
  url: string;
  heuristic_score: number;
  context: Context;
}

export interface AnalyzeResponse {
  risk_score: number;
  label: Label;
  action: Action;
  reason: string;
}
