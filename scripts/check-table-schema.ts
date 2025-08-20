#!/usr/bin/env tsx

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config({ path: ".env.local" });

async function checkTableSchema() {
  console.log("Checking ai_call_log table schema...");
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase credentials");
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get table schema
    const { data: columns, error } = await supabase
      .rpc('get_table_columns', { table_name: 'ai_call_log' });
    
    if (error) {
      console.log("Trying alternative method...");
      // Alternative: try to describe the table structure
      const { data: sample, error: sampleError } = await supabase
        .from("ai_call_log")
        .select("*")
        .limit(1);
      
      if (sampleError) {
        console.error("Error accessing table:", sampleError);
        return;
      }
      
      console.log("✅ Table exists and is accessible");
      console.log("Sample row structure:", sample?.[0] ? Object.keys(sample[0]) : "No data yet");
    } else {
      console.log("Table columns:", columns);
    }
    
  } catch (error) {
    console.error("Check failed:", error);
  }
}

checkTableSchema();
