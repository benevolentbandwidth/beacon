import type { AnalyzeRequest, AnalyzeResponse } from "../types/api.js";
import type { Provider } from "../providers/types.js";
import { MockProvider } from "../providers/mockProvider.js";

type ModelChoice = "external_llm" | "custom_model";

// Context-based routing
function selectModel(context: string): ModelChoice {
  // High-risk contexts → External LLM
  if (context === "email_body" || context === "sms") {
    return "external_llm";
  }

  // Lower-risk contexts (page_body, form) → Custom model
  return "custom_model";
}

export class AnalyzeService {
  private externalLlm: Provider;
  private customModel: Provider;

  constructor() {
    // Using mock provider for now
    this.externalLlm = new MockProvider();
    this.customModel = new MockProvider();
  }

  async analyze(request: AnalyzeRequest): Promise<AnalyzeResponse> {
    const model = selectModel(request.context);

    const provider = model === "external_llm" ? this.externalLlm : this.customModel;

    return provider.analyze(request);
  }
}
