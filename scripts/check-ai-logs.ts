#!/usr/bin/env tsx

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config({ path: ".env.local" });

async function checkAILogs() {
  console.log("Checking AI call logs...");
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      console.log("URL:", !!supabaseUrl);
      console.log("Key:", !!supabaseKey);
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if table exists
    const { data: tableCheck, error: tableError } = await supabase
      .from("ai_call_log")
      .select("*", { count: "exact", head: true });
    
    if (tableError) {
      console.log("❌ ai_call_log table doesn't exist yet");
      console.log("This means no AI calls have been tracked yet.");
      console.log("The table will be created automatically when the first AI call is made.");
      return;
    }
    
    console.log("✅ ai_call_log table exists");
    
    // Get total count
    const { count, error: countError } = await supabase
      .from("ai_call_log")
      .select("*", { count: "exact", head: true });
    
    if (countError) {
      console.error("Count failed:", countError);
      return;
    }
    
    console.log(`Total AI calls logged: ${count}`);
    
    // Get recent calls
    const { data: recentCalls, error: recentError } = await supabase
      .from("ai_call_log")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10);
    
    if (recentError) {
      console.error("Recent calls failed:", recentError);
      return;
    }
    
    console.log("\nRecent AI calls:");
    recentCalls?.forEach((call, index) => {
      console.log(`${index + 1}. ${call.endpoint} (${call.model}) - ${call.prompt_tokens} tokens - $${call.cost_usd?.toFixed(6)} - ${call.success ? "✓" : "✗"}`);
    });
    
    // Get summary by endpoint
    const { data: endpointStats, error: endpointError } = await supabase
      .from("ai_call_log")
      .select("endpoint, prompt_tokens, completion_tokens, cost_usd, success");
    
    if (endpointError) {
      console.error("Endpoint stats failed:", endpointError);
      return;
    }
    
    const stats = endpointStats?.reduce((acc, call) => {
      const endpoint = call.endpoint || 'unknown';
      if (!acc[endpoint]) {
        acc[endpoint] = { calls: 0, tokens: 0, cost: 0, success: 0 };
      }
      acc[endpoint].calls++;
      acc[endpoint].tokens += (call.prompt_tokens || 0) + (call.completion_tokens || 0);
      acc[endpoint].cost += call.cost_usd || 0;
      if (call.success) acc[endpoint].success++;
      return acc;
    }, {} as Record<string, { calls: number; tokens: number; cost: number; success: number }>);
    
    console.log("\nSummary by endpoint:");
    Object.entries(stats || {}).forEach(([endpoint, data]) => {
      console.log(`${endpoint}: ${data.calls} calls, ${data.tokens.toLocaleString()} tokens, $${data.cost.toFixed(4)}, ${data.success}/${data.calls} successful`);
    });
    
  } catch (error) {
    console.error("Check failed:", error);
  }
}

checkAILogs();
