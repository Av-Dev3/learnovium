import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { buildPlannerPromptWithRAG } from "@/lib/prompts";
import { generatePlan } from "@/lib/aiCall";
import { canonicalizeSignature } from "@/lib/goalSignature";
import { logCall } from "@/lib/aiGuard"; // Re-enabled for AI call tracking

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 300; // 5 minutes for Vercel function timeout

// Add timeout configuration - increased for comprehensive plan generation
const PLAN_GENERATION_TIMEOUT_MS = 270000; // 4.5 minutes for plan generation (longer than OpenAI timeout)
const RAG_TIMEOUT_MS = 60000; // 1 minute for RAG operations (was 30s)
const API_RESPONSE_TIMEOUT_MS = 300000; // 5 minutes total API response time (was 90s)

// Helper function to generate fallback plans
function generateFallbackPlan(topic: string, focus: string | undefined, level: string, duration: number, minutesPerDay: number) {
  const modules = [];
  const daysPerModule = Math.min(7, Math.ceil(duration / 2)); // Split into logical modules
  
  for (let moduleIndex = 0; moduleIndex < Math.ceil(duration / daysPerModule); moduleIndex++) {
    const moduleStartDay = moduleIndex * daysPerModule + 1;
    const moduleEndDay = Math.min((moduleIndex + 1) * daysPerModule, duration);
    const moduleTitle = getModuleTitle(topic, level, moduleIndex);
    
    const days = [];
    for (let day = moduleStartDay; day <= moduleEndDay; day++) {
      const dayTopic = getDayTopic(topic, level, day, duration, focus);
      days.push({
        day_index: day,
        topic: dayTopic,
        objective: `Learn ${dayTopic.toLowerCase()}`,
        practice: `Practice and apply ${dayTopic.toLowerCase()}`,
        assessment: `Assess understanding of ${dayTopic.toLowerCase()}`,
        est_minutes: Math.min(minutesPerDay || 30, 60)
      });
    }
    
    modules.push({
      title: moduleTitle,
      days
    });
  }
  
  return {
    version: "1",
    topic: topic,
    total_days: duration,
    modules,
    citations: [`${topic} learning resources`]
  };
}

function getModuleTitle(topic: string, level: string, moduleIndex: number): string {
  const levelText = level.charAt(0).toUpperCase() + level.slice(1);
  const moduleNames = [
    `${levelText} Fundamentals`,
    `${levelText} Core Concepts`,
    `${levelText} Advanced Topics`,
    `${levelText} Specialized Skills`,
    `${levelText} Mastery & Application`
  ];
  
  return moduleNames[moduleIndex] || `${levelText} Module ${moduleIndex + 1}`;
}

function getDayTopic(topic: string, level: string, day: number, totalDays: number, focus: string | undefined): string {
  const focusText = focus ? ` - ${focus}` : '';
  const levelPrefix = level.charAt(0).toUpperCase() + level.slice(1);
  
  // Create more specific, unique topics for each day
  const topicVariations = [
    `${levelPrefix} Introduction to ${topic}${focusText}`,
    `Understanding ${topic} Fundamentals${focusText}`,
    `Core ${topic} Principles and Concepts${focusText}`,
    `Essential ${topic} Terminology and Basics${focusText}`,
    `Practical ${topic} Applications${focusText}`,
    `${topic} Best Practices and Standards${focusText}`,
    `Intermediate ${topic} Techniques${focusText}`,
    `Advanced ${topic} Strategies${focusText}`,
    `${topic} Problem-Solving Methods${focusText}`,
    `Real-World ${topic} Implementation${focusText}`,
    `${topic} Optimization and Performance${focusText}`,
    `Advanced ${topic} Concepts${focusText}`,
    `${topic} Expert Techniques${focusText}`,
    `Mastering ${topic} Workflows${focusText}`,
    `${topic} Integration and Deployment${focusText}`,
    `${topic} Troubleshooting and Debugging${focusText}`,
    `${topic} Security and Best Practices${focusText}`,
    `${topic} Testing and Quality Assurance${focusText}`,
    `${topic} Documentation and Maintenance${focusText}`,
    `${topic} Advanced Projects and Portfolio${focusText}`,
    `${topic} Industry Standards and Trends${focusText}`,
    `${topic} Collaboration and Teamwork${focusText}`,
    `${topic} Performance Monitoring${focusText}`,
    `${topic} Scalability and Architecture${focusText}`,
    `${topic} Final Project and Review${focusText}`,
    `${topic} Certification and Next Steps${focusText}`,
    `${topic} Community and Resources${focusText}`,
    `${topic} Career Applications${focusText}`,
    `${topic} Mastery Assessment${focusText}`,
    `${topic} Professional Development${focusText}`
  ];
  
  // Ensure we have enough variations for any duration
  const topicIndex = (day - 1) % topicVariations.length;
  let selectedTopic = topicVariations[topicIndex];
  
  // If we need more topics than we have variations, add day-specific suffixes
  if (day > topicVariations.length) {
    const cycle = Math.floor((day - 1) / topicVariations.length) + 1;
    selectedTopic = `${selectedTopic} (Part ${cycle})`;
  }
  
  return selectedTopic;
}

// GET /api/goals — list current user's goals
export async function GET(req: NextRequest) {
  try {
    const { user, supabase, res } = await requireUser(req);
    if (!user) {
      console.log("GET /api/goals - no user found");
      return res!;
    }
    
    console.log("GET /api/goals - user:", user.id);
    console.log("GET /api/goals - user email:", user.email);
    
    // Check if the learning_goals table exists and has data
    const { data: tableCheck, error: tableError } = await supabase
      .from("learning_goals")
      .select("count", { count: "exact", head: true });
    
    console.log("GET /api/goals - table check:", { tableCheck, tableError });
    
    const { data, error } = await supabase
      .from("learning_goals")
      .select("id, topic, focus, plan_version, created_at, plan_json, plan_template_id")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });
      
    if (error) {
      console.error("GET /api/goals - Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    
    console.log("GET /api/goals - data:", data);
    console.log("GET /api/goals - data type:", typeof data);
    console.log("GET /api/goals - is array:", Array.isArray(data));
    console.log("GET /api/goals - data length:", data?.length);
    
    return NextResponse.json(data ?? []);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /api/goals";
    console.error("GET /api/goals - caught error:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

// POST /api/goals — create a new goal with template caching
export async function POST(req: NextRequest) {
  // Add overall timeout wrapper
  const apiTimeoutPromise = new Promise((_, reject) => 
    setTimeout(() => reject(new Error('API response timeout')), API_RESPONSE_TIMEOUT_MS)
  );
  
  const apiPromise = createGoalInternal(req);
  
  try {
    return await Promise.race([apiPromise, apiTimeoutPromise]) as Awaited<ReturnType<typeof createGoalInternal>>;
  } catch (error) {
    if (error instanceof Error && error.message.includes('API response timeout')) {
      console.error("POST /api/goals - API timeout, returning error response");
      return NextResponse.json({ 
        error: "Request timed out. Please try again with a shorter duration or contact support." 
      }, { status: 408 });
    }
    throw error;
  }
}

async function createGoalInternal(req: NextRequest) {
  try {
    console.log("POST /api/goals - incoming request");
    const { user, supabase, res } = await requireUser(req);
    if (!user) {
      console.log("POST /api/goals - no user found");
      return res!;
    }
    console.log("POST /api/goals - user:", user.id);
    
    const body = await req.json().catch(() => ({}));
    const { topic, focus, level, minutes_per_day, duration_days } = body || {};
    console.log("POST /api/goals - body:", { topic, focus, level, minutes_per_day, duration_days });
    if (!topic) return NextResponse.json({ error: "Missing topic" }, { status: 400 });

    // Pull profile to build signature
    const { data: profile } = await supabase
      .from("profiles")
      .select("level, minutes_per_day, tz")
      .eq("id", user.id)
      .maybeSingle();
    
    const signature = await canonicalizeSignature({
      topic,
      focus,
      level: level || profile?.level || 'beginner',
      minutes_per_day: minutes_per_day || profile?.minutes_per_day || 30,
      duration_days: duration_days || null,
      locale: profile?.tz || 'en',
      version: 1,
    });

    // 1) Try to reuse existing plan_template
    let template = null;
    try {
      const { data: templateData } = await supabase
        .from("plan_template")
        .select("id, plan_json")
        .eq("signature", signature)
        .eq("version", 1)
        .maybeSingle();
      template = templateData;
      console.log("POST /api/goals - template found:", Boolean(template));
    } catch {
      // plan_template table might not exist yet, continue with plan generation
      console.log("plan_template table not available, generating new plan");
    }

    if (template) {
      // Link a new user-owned goal to the template instantly (no AI call)
      const { data: goal, error } = await supabase
        .from("learning_goals")
        .insert({
          user_id: user.id,
          topic,
          focus,
          level,
          plan_version: 1,
          plan_json: template.plan_json,
          ...(template.id && { plan_template_id: template.id }),
        })
        .select("id, topic, focus, plan_version, created_at")
        .single();

      if (error) {
        console.error("POST /api/goals - insert (reuse) error:", error);
        return NextResponse.json({ error: error.message }, { status: 400 });
      }
      console.log("POST /api/goals - goal created (reuse):", goal?.id);

      // Create flashcard category for this goal
      try {
        const { error: categoryError } = await supabase
          .from("flashcard_categories")
          .insert({
            user_id: user.id,
            goal_id: goal.id,
            name: topic,
            description: `Flashcards for ${topic}${focus ? ` - ${focus}` : ''}`,
            color: '#6366f1', // Default brand color
          });

        if (categoryError) {
          console.warn("Failed to create flashcard category:", categoryError);
          // Don't fail the goal creation if category creation fails
        } else {
          console.log("Flashcard category created for goal:", goal.id);
        }
      } catch (categoryErr) {
        console.warn("Error creating flashcard category:", categoryErr);
        // Don't fail the goal creation if category creation fails
      }

      return NextResponse.json({ ...goal, reused: true }, { status: 201 });
    }

    // 2) No template yet: generate with RAG + GPT
    const t0 = Date.now();
    
    // Check budget caps before AI call
    // Temporarily disabled while setting up database migrations
    // await checkCapsOrThrow(user.id, "planner");
    
    let plan_json;
    try {
      console.log("POST /api/goals - Starting AI plan generation...");
      const duration = (duration_days as number) || 7;
      const userLevel = level || 'beginner';
      
      // Add timeout handling for long-duration plans
      if (duration > 14) {
        console.log(`POST /api/goals - Long duration (${duration} days), using optimized generation`);
      }
      
      console.log("POST /api/goals - Building RAG prompt...");
      
      // Optimize RAG context size based on duration
      const ragContextSize = duration <= 7 ? 6 : duration <= 14 ? 8 : 10;
      
      // Add timeout for RAG operations
      const ragPromise = buildPlannerPromptWithRAG(
        `Create a ${duration}-day ${userLevel} level learning plan for ${topic}${focus ? ` focusing on ${focus}` : ""}. The plan must strictly have total_days=${duration} and be appropriate for ${userLevel} level students. For longer plans, focus on progressive skill building with clear milestones.`,
        topic,
        ragContextSize
      );
      
      const ragTimeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => reject(new Error('RAG operation timeout')), RAG_TIMEOUT_MS)
      );
      
      const msgs = await Promise.race([ragPromise, ragTimeoutPromise]);
      
      console.log("POST /api/goals - Calling OpenAI...");
      console.log("POST /api/goals - Plan generation timeout set to:", PLAN_GENERATION_TIMEOUT_MS, "ms");
      
      // Add timeout wrapper for plan generation
      const planGenerationPromise = generatePlan(msgs, user.id);
      const timeoutPromise = new Promise<never>((_, reject) => 
        setTimeout(() => {
          console.log("POST /api/goals - Plan generation timeout reached after", PLAN_GENERATION_TIMEOUT_MS, "ms");
          reject(new Error('Plan generation timeout'));
        }, PLAN_GENERATION_TIMEOUT_MS)
      );
      
      console.log("POST /api/goals - Starting Promise.race with plan generation...");
      const { data: planResult, usage } = await Promise.race([planGenerationPromise, timeoutPromise]);
      
      console.log("POST /api/goals - OpenAI response received:", { planResult, usage });
      // Force total_days to requested duration if model deviates
      plan_json = { ...planResult, total_days: duration };
      
      // Log the AI call
      const latency_ms = Date.now() - t0;
      
      // Use the proper cost calculation from costs.ts
      let cost_usd = 0;
      if (usage) {
        const { estimateCostUSD } = await import("@/lib/costs");
        cost_usd = estimateCostUSD(
          "gpt-4o-mini", // or get from usage
          usage.prompt_tokens || 0,
          usage.completion_tokens || 0
        );
      }
      
      console.log("POST /api/goals - AI generation successful:", { latency_ms, cost_usd });
      
      // Log the AI call for tracking
      try {
        await logCall({
          user_id: user.id,
          goal_id: undefined, // No goal_id yet since we're creating it
          endpoint: "planner",
          model: "gpt-4o-mini",
          prompt_tokens: usage?.prompt_tokens || 0,
          completion_tokens: usage?.completion_tokens || 0,
          success: true,
          latency_ms,
          cost_usd,
        });
        console.log("AI call logged successfully");
      } catch (logError) {
        console.error("Failed to log AI call:", logError);
      }
    } catch (error) {
      console.error("POST /api/goals - AI plan generation failed:", error);
      
      // Check if it's a timeout error
      const isTimeout = error instanceof Error && (
        error.message.includes('timeout') || 
        error.message.includes('timeout') ||
        error.message.includes('Plan generation timeout') ||
        error.message.includes('RAG operation timeout')
      );
      
      if (isTimeout) {
        console.log("POST /api/goals - Timeout detected, using fallback plan");
      }
      
      // Create a fallback plan structure
      const userLevel = level || 'beginner';
      const duration = (duration_days as number) || 7;
      
      // Generate a structured fallback plan based on duration
      const fallbackPlan = generateFallbackPlan(topic, focus, userLevel, duration, minutes_per_day);
      plan_json = fallbackPlan;
      
      console.log("POST /api/goals - Using fallback plan:", plan_json);
      
      // Log the failed AI call for tracking
      const latency_ms = Date.now() - t0;
      try {
        await logCall({
          user_id: user.id,
          goal_id: undefined,
          endpoint: "planner",
          model: isTimeout ? "timeout_fallback" : "fallback",
          prompt_tokens: 0,
          completion_tokens: 0,
          success: false,
          latency_ms,
          cost_usd: 0,
          error_text: error instanceof Error ? error.message : "Unknown error",
        });
        console.log("Failed AI call logged successfully");
      } catch (logError) {
        console.error("Failed to log failed AI call:", logError);
      }
    }

    // Save template for future reuse
    let newTemplate: { id: string } | null = null;
    try {
      const { data: templateData, error: tErr } = await supabase
        .from("plan_template")
        .insert({
          signature,
          topic,
          focus,
          level: level || profile?.level || null,
          minutes_per_day: minutes_per_day || profile?.minutes_per_day || null,
          locale: profile?.tz || "en",
          version: 1,
          plan_json,
        })
        .select("id")
        .single();

      if (tErr) {
        // If conflict due to race, re-query and continue
        console.warn("POST /api/goals - template insert error, will re-query:", tErr?.message);
        const { data: t2 } = await supabase
          .from("plan_template")
          .select("id")
          .eq("signature", signature)
          .eq("version", 1)
          .maybeSingle();
        if (t2) newTemplate = t2;
      } else {
        newTemplate = templateData;
      }
    } catch {
      // plan_template table might not exist yet, continue without caching
      console.log("plan_template table not available, skipping template caching");
    }

    console.log("POST /api/goals - About to insert goal into database...");
    console.log("POST /api/goals - Insert data:", {
      user_id: user.id,
      topic,
      focus,
      level,
      plan_version: 1,
      plan_json: typeof plan_json,
      plan_json_keys: plan_json ? Object.keys(plan_json) : 'null'
    });

    const { data: goal, error: gErr } = await supabase
      .from("learning_goals")
      .insert({
        user_id: user.id,
        topic,
        focus,
        level,
        plan_version: 1,
        plan_json,
        ...(newTemplate?.id && { plan_template_id: newTemplate.id }),
      })
      .select("id, topic, focus, plan_version, created_at")
      .single();

    if (gErr) {
      console.error("POST /api/goals - insert (new) error:", gErr);
      console.error("POST /api/goals - Error details:", {
        code: gErr.code,
        message: gErr.message,
        details: gErr.details,
        hint: gErr.hint
      });
      return NextResponse.json({ error: gErr.message }, { status: 400 });
    }
    
    console.log("POST /api/goals - Goal created successfully:", goal);
    console.log("POST /api/goals - goal created (new):", goal?.id);

    // Create flashcard category for this goal
    try {
      const { error: categoryError } = await supabase
        .from("flashcard_categories")
        .insert({
          user_id: user.id,
          goal_id: goal.id,
          name: topic,
          description: `Flashcards for ${topic}${focus ? ` - ${focus}` : ''}`,
          color: '#6366f1', // Default brand color
        });

      if (categoryError) {
        console.warn("Failed to create flashcard category:", categoryError);
        // Don't fail the goal creation if category creation fails
      } else {
        console.log("Flashcard category created for goal:", goal.id);
      }
    } catch (categoryErr) {
      console.warn("Error creating flashcard category:", categoryErr);
      // Don't fail the goal creation if category creation fails
    }

    return NextResponse.json({ ...goal, reused: false }, { status: 201 });
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in POST /api/goals";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
} 