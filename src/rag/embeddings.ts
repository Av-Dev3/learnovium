import { openai } from "@/lib/openai";
import { estimateCostUSD } from "@/lib/costs";

export async function embedTexts(texts: string[], model = process.env.OPENAI_EMBED_MODEL ?? "text-embedding-3-small") {
  if (!texts.length) return [];
  
  try {
    console.log(`RAG: Embedding ${texts.length} texts with model ${model}`);
    const t0 = Date.now();
    
    const res = await openai.embeddings.create({ model, input: texts });
    
    const latency_ms = Date.now() - t0;
    const totalTokens = res.usage?.total_tokens || 0;
    const cost_usd = estimateCostUSD(model, totalTokens, 0);
    
    console.log(`RAG: Embedding completed - ${totalTokens} tokens, $${cost_usd.toFixed(6)} cost, ${latency_ms}ms`);
    
    // Log the embedding call for cost tracking
    try {
      const { logCall } = await import("@/lib/aiGuard");
      await logCall({
        user_id: undefined, // Embeddings are system-level
        goal_id: undefined,
        endpoint: "embeddings" as const, // Type assertion for the new endpoint
        model,
        prompt_tokens: totalTokens,
        completion_tokens: 0,
        success: true,
        latency_ms,
        cost_usd,
      });
    } catch (logError) {
      console.warn("Failed to log embedding call:", logError);
    }
    
    return res.data.map(d => d.embedding as number[]);
  } catch (error) {
    console.error("Embedding error:", error);
    
    // Log failed embedding call
    try {
      const { logCall } = await import("@/lib/aiGuard");
      await logCall({
        user_id: undefined,
        goal_id: undefined,
        endpoint: "embeddings" as const, // Type assertion for the new endpoint
        model,
        prompt_tokens: texts.reduce((sum, t) => sum + Math.ceil(t.length / 4), 0), // Estimate tokens
        completion_tokens: 0,
        success: false,
        latency_ms: Date.now() - Date.now(),
        error_text: error instanceof Error ? error.message : "Unknown error",
        cost_usd: 0,
      });
    } catch (logError) {
      console.warn("Failed to log failed embedding call:", logError);
    }
    
    throw error;
  }
} 