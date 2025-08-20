#!/usr/bin/env tsx

import { embedTexts } from "../src/rag/embeddings";

async function testEmbeddings() {
  console.log("Testing embeddings tracking...");
  
  try {
    // Test with a simple text
    const texts = ["This is a test text for embedding tracking"];
    
    console.log("Calling embedTexts...");
    const embeddings = await embedTexts(texts);
    
    console.log("Embeddings generated successfully!");
    console.log("Number of embeddings:", embeddings.length);
    console.log("Embedding dimensions:", embeddings[0]?.length || 0);
    
    // Wait a moment for logging to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    console.log("Test completed. Check the ai_call_log table for the embedding call.");
    
  } catch (error) {
    console.error("Test failed:", error);
  }
}

testEmbeddings();
