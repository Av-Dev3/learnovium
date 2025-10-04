import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/goals/popular
 * Returns the most popular goals/plans based on creation frequency
 */
export async function GET(req: NextRequest) {
  try {
    const { user, supabase, res } = await requireUser(req);
    if (!user) {
      console.log("GET /api/goals/popular - no user found");
      return res!;
    }

    console.log("GET /api/goals/popular - user:", user.id);

    // Query to get popular goals by counting occurrences of topic + focus combinations
    // This gives us the most commonly created goal types across all users
    const { data: popularGoals, error } = await supabase
      .from("learning_goals")
      .select("topic, focus, level, count")
      .not("topic", "is", null)
      .order("count", { ascending: false })
      .limit(10);

    if (error) {
      console.error("GET /api/goals/popular - Supabase error:", error);
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // If the above query doesn't work (count might not be available), 
    // we'll use a different approach to aggregate by topic + focus
    if (!popularGoals || popularGoals.length === 0) {
      // Alternative approach: get all goals and aggregate manually
      const { data: allGoals, error: allGoalsError } = await supabase
        .from("learning_goals")
        .select("topic, focus, level, created_at")
        .not("topic", "is", null)
        .order("created_at", { ascending: false })
        .limit(1000); // Get recent goals to calculate popularity

      if (allGoalsError) {
        console.error("GET /api/goals/popular - All goals error:", allGoalsError);
        return NextResponse.json({ error: allGoalsError.message }, { status: 400 });
      }

      // Aggregate by topic + focus combination
      const goalCounts = new Map<string, {
        topic: string;
        focus: string | null;
        level: string | null;
        count: number;
        recent_created_at: string;
      }>();

      allGoals?.forEach(goal => {
        const key = `${goal.topic}|${goal.focus || 'general'}`;
        const existing = goalCounts.get(key);
        
        if (existing) {
          existing.count += 1;
          // Keep the most recent creation date
          if (new Date(goal.created_at) > new Date(existing.recent_created_at)) {
            existing.recent_created_at = goal.created_at;
          }
        } else {
          goalCounts.set(key, {
            topic: goal.topic,
            focus: goal.focus,
            level: goal.level,
            count: 1,
            recent_created_at: goal.created_at
          });
        }
      });

      // Convert to array and sort by count
      const popularGoalsArray = Array.from(goalCounts.values())
        .sort((a, b) => b.count - a.count)
        .slice(0, 10);

      console.log("GET /api/goals/popular - aggregated data:", popularGoalsArray);
      return NextResponse.json(popularGoalsArray);
    }

    console.log("GET /api/goals/popular - data:", popularGoals);
    return NextResponse.json(popularGoals);

  } catch (error) {
    console.error("GET /api/goals/popular - unexpected error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
