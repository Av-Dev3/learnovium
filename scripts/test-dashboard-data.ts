#!/usr/bin/env tsx

import { config } from "dotenv";
import { createClient } from "@supabase/supabase-js";

// Load environment variables
config({ path: ".env.local" });

async function testDashboardData() {
  console.log("🔍 Testing dashboard data...");
  
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      console.error("❌ Missing Supabase credentials");
      return;
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection
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
      .limit(10);
    
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
        
        if (goal.plan_json) {
          const plan = goal.plan_json as any;
          console.log(`    Plan data:`, {
            version: plan.version,
            total_days: plan.total_days,
            has_modules: !!plan.modules,
            modules_count: plan.modules?.length || 0
          });
          
          if (plan.modules && plan.modules.length > 0) {
            const firstModule = plan.modules[0];
            console.log(`    First module:`, {
              title: firstModule.title,
              days_count: firstModule.days?.length || 0
            });
            
            if (firstModule.days && firstModule.days.length > 0) {
              const firstDay = firstModule.days[0];
              console.log(`    First day:`, {
                day_index: firstDay.day_index,
                topic: firstDay.topic,
                objective: firstDay.objective?.substring(0, 50)
              });
            }
          }
        }
      });
    }
    
    // Check if there are any goals with plan_json
    if (goals && goals.length > 0) {
      const goalsWithPlans = goals.filter(g => g.plan_json);
      console.log(`\n📋 Goals with plans: ${goalsWithPlans.length}/${goals.length}`);
      
      if (goalsWithPlans.length > 0) {
        const firstGoalWithPlan = goalsWithPlans[0];
        console.log("First goal with plan:", firstGoalWithPlan.topic);
        
        // Test the day calculation
        const createdDate = new Date(firstGoalWithPlan.created_at);
        const now = new Date();
        const ms = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
                   Date.UTC(createdDate.getUTCFullYear(), createdDate.getUTCMonth(), createdDate.getUTCDate());
        const dayIndex = Math.max(1, Math.floor(ms / 86400000) + 1);
        
        console.log("Day calculation:", {
          created_date: createdDate.toISOString(),
          now: now.toISOString(),
          day_index: dayIndex
        });
        
        // Check if there's a plan day for today
        if (firstGoalWithPlan.plan_json) {
          const plan = firstGoalWithPlan.plan_json as any;
          const flatDays = (plan.modules || []).flatMap((m: any) => m.days || []);
          const todayPlan = flatDays.find((d: any) => d.day_index === dayIndex);
          
          console.log("Today's plan day:", todayPlan ? {
            topic: todayPlan.topic,
            objective: todayPlan.objective?.substring(0, 50)
          } : "Not found");
        }
      }
    }
    
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

testDashboardData();
