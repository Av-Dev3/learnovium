#!/usr/bin/env tsx

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config({ path: ".env.local" });

async function checkDashboardIssue() {
  console.log("🔍 Checking dashboard issue...");
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing Supabase credentials");
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Check if we can connect
    console.log("🔌 Testing Supabase connection...");
    const { data: testData, error: testError } = await supabase
      .from("learning_goals")
      .select("id")
      .limit(1);
    
    if (testError) {
      console.error("❌ Connection failed:", testError);
      return;
    }
    
    console.log("✅ Connection successful");
    
    // Check learning_goals table
    console.log("\n📚 Checking learning_goals table...");
    const { data: goals, error: goalsError } = await supabase
      .from("learning_goals")
      .select("id, topic, created_at, plan_json, plan_template_id")
      .limit(5);
    
    if (goalsError) {
      console.error("❌ Error reading goals:", goalsError);
    } else {
      console.log(`✅ Found ${goals?.length || 0} goals`);
      goals?.forEach((goal, i) => {
        console.log(`  Goal ${i + 1}:`, {
          id: goal.id,
          topic: goal.topic,
          has_plan_json: !!goal.plan_json,
          has_plan_template_id: !!goal.plan_template_id,
          created_at: goal.created_at
        });
      });
    }
    
    // Check lesson_template table
    console.log("\n📖 Checking lesson_template table...");
    try {
      const { data: templates, error: templateError } = await supabase
        .from("lesson_template")
        .select("id, plan_template_id, day_index")
        .limit(5);
      
      if (templateError) {
        console.log("❌ lesson_template table error:", templateError);
      } else {
        console.log(`✅ Found ${templates?.length || 0} lesson templates`);
      }
    } catch (error) {
      console.log("❌ lesson_template table doesn't exist or error:", error);
    }
    
    // Check lesson_log table
    console.log("\n📝 Checking lesson_log table...");
    try {
      const { data: logs, error: logError } = await supabase
        .from("lesson_log")
        .select("id, goal_id, day_index")
        .limit(5);
      
      if (logError) {
        console.log("❌ lesson_log table error:", logError);
      } else {
        console.log(`✅ Found ${logs?.length || 0} lesson logs`);
      }
    } catch (error) {
      console.log("❌ lesson_log table doesn't exist or error:", error);
    }
    
    // Check plan_template table
    console.log("\n📋 Checking plan_template table...");
    try {
      const { data: plans, error: planError } = await supabase
        .from("plan_template")
        .select("id, topic, total_days")
        .limit(5);
      
      if (planError) {
        console.log("❌ plan_template table error:", planError);
      } else {
        console.log(`✅ Found ${plans?.length || 0} plan templates`);
      }
    } catch (error) {
      console.log("❌ plan_template table doesn't exist or error:", error);
    }
    
  } catch (error) {
    console.error("❌ Check failed:", error);
  }
}

checkDashboardIssue();
