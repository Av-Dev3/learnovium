/**
 * AI Model Pricing and Cost Estimation
 * Based on OpenAI pricing as of December 2024
 */

export interface ModelPricing {
  input_per_1k: number;  // USD per 1K input tokens
  output_per_1k: number; // USD per 1K output tokens
}

// OpenAI model pricing (USD per 1K tokens)
export const MODEL_PRICING: Record<string, ModelPricing> = {
  // GPT-4 family
  "gpt-4": {
    input_per_1k: 0.03,
    output_per_1k: 0.06,
  },
  "gpt-4-turbo": {
    input_per_1k: 0.01,
    output_per_1k: 0.03,
  },
  "gpt-4o": {
    input_per_1k: 0.005,
    output_per_1k: 0.015,
  },
  "gpt-4o-mini": {
    input_per_1k: 0.00015,
    output_per_1k: 0.0006,
  },
  
  // GPT-3.5 family
  "gpt-3.5-turbo": {
    input_per_1k: 0.0015,
    output_per_1k: 0.002,
  },
  
  // Embeddings
  "text-embedding-3-small": {
    input_per_1k: 0.00002,
    output_per_1k: 0,
  },
  "text-embedding-3-large": {
    input_per_1k: 0.00013,
    output_per_1k: 0,
  },
  "text-embedding-ada-002": {
    input_per_1k: 0.0001,
    output_per_1k: 0,
  },
  
  // GPT-5 family (new pricing - per million tokens)
  "gpt-5": {
    input_per_1k: 0.00125,  // $1.25 per million = $0.00125 per 1k
    output_per_1k: 0.01,    // $10.00 per million = $0.01 per 1k
  },
  "gpt-5-mini": {
    input_per_1k: 0.00025,  // $0.25 per million = $0.00025 per 1k
    output_per_1k: 0.002,   // $2.00 per million = $0.002 per 1k
  },
  "gpt-5-nano": {
    input_per_1k: 0.00005,  // $0.05 per million = $0.00005 per 1k
    output_per_1k: 0.0004,  // $0.40 per million = $0.0004 per 1k
  },
};

/**
 * Estimate the cost in USD for an AI call
 */
export function estimateCostUSD(
  model: string,
  promptTokens: number,
  completionTokens: number = 0
): number {
  const pricing = MODEL_PRICING[model];
  if (!pricing) {
    console.warn(`Unknown model pricing for: ${model}, using gpt-4o-mini fallback`);
    const fallback = MODEL_PRICING["gpt-4o-mini"];
    return (
      (promptTokens / 1000) * fallback.input_per_1k +
      (completionTokens / 1000) * fallback.output_per_1k
    );
  }

  const inputCost = (promptTokens / 1000) * pricing.input_per_1k;
  const outputCost = (completionTokens / 1000) * pricing.output_per_1k;
  
  return inputCost + outputCost;
}

/**
 * Format cost as currency string
 */
export function formatCost(costUSD: number): string {
  if (costUSD < 0.01) {
    return `$${(costUSD * 100).toFixed(3)}¢`;
  }
  return `$${costUSD.toFixed(4)}`;
}

/**
 * Get pricing info for a model
 */
export function getModelPricing(model: string): ModelPricing | null {
  return MODEL_PRICING[model] || null;
}

/**
 * List all supported models
 */
export function getSupportedModels(): string[] {
  return Object.keys(MODEL_PRICING);
}
