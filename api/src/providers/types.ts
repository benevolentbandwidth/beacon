import type { AnalyzeRequest, AnalyzeResponse } from "../types/api.js";

export interface Provider {
  name: string;
  analyze(request: AnalyzeRequest): Promise<AnalyzeResponse>;
}
