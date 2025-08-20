#!/usr/bin/env tsx

import { estimateCostUSD, formatCost } from "../src/lib/costs";

function testCostCalculation() {
  console.log("Testing cost calculations with updated GPT-5 pricing...\n");
  
  // Example usage from your system
  const promptTokens = 1000;
  const completionTokens = 500;
  
  console.log("For 1,000 input + 500 output tokens:\n");
  
  // GPT-4o-mini (old pricing)
  const gpt4oMiniCost = estimateCostUSD("gpt-4o-mini", promptTokens, completionTokens);
  console.log(`GPT-4o-mini: ${formatCost(gpt4oMiniCost)}`);
  
  // GPT-5-mini (new pricing)
  const gpt5MiniCost = estimateCostUSD("gpt-5-mini", promptTokens, completionTokens);
  console.log(`GPT-5-mini: ${formatCost(gpt5MiniCost)}`);
  
  // GPT-5 (full model)
  const gpt5Cost = estimateCostUSD("gpt-5", promptTokens, completionTokens);
  console.log(`GPT-5: ${formatCost(gpt5Cost)}`);
  
  // GPT-5-nano
  const gpt5NanoCost = estimateCostUSD("gpt-5-nano", promptTokens, completionTokens);
  console.log(`GPT-5-nano: ${formatCost(gpt5NanoCost)}`);
  
  console.log("\nCost multipliers vs GPT-4o-mini:");
  console.log(`GPT-5-mini is ${Math.round(gpt5MiniCost / gpt4oMiniCost)}x more expensive`);
  console.log(`GPT-5 is ${Math.round(gpt5Cost / gpt4oMiniCost)}x more expensive`);
  console.log(`GPT-5-nano is ${Math.round(gpt5NanoCost / gpt4oMiniCost)}x more expensive`);
  
  console.log("\nFor your reported usage (74k input + 30k output tokens):");
  const yourInputTokens = 74000;
  const yourOutputTokens = 30000;
  
  const yourGpt4oMiniCost = estimateCostUSD("gpt-4o-mini", yourInputTokens, yourOutputTokens);
  const yourGpt5MiniCost = estimateCostUSD("gpt-5-mini", yourInputTokens, yourOutputTokens);
  
  console.log(`GPT-4o-mini would cost: ${formatCost(yourGpt4oMiniCost)}`);
  console.log(`GPT-5-mini would cost: ${formatCost(yourGpt5MiniCost)}`);
  console.log(`Difference: ${formatCost(yourGpt5MiniCost - yourGpt4oMiniCost)}`);
}

testCostCalculation();
