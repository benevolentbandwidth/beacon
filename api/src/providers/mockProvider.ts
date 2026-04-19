import type { AnalyzeRequest, AnalyzeResponse } from "../types/api.js";
import type { Provider } from "./types.js";

export class MockProvider implements Provider {
  name = "mock";

  async analyze(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Mock logic 
    if (request.heuristic_score >= 0.7) {
      return {
        risk_score: 0.91,
        label: "phishing",
        action: "block",
        reason: "Domain registered recently; urgency language matches credential-harvesting patterns.",
      };
    }

    if (request.heuristic_score >= 0.4) {
      return {
        risk_score: 0.55,
        label: "suspicious",
        action: "warn",
        reason: "Some indicators of potential phishing detected.",
      };
    }

    return {
      risk_score: 0.1,
      label: "safe",
      action: "allow",
      reason: "No significant risk indicators detected.",
    };
  }
}
