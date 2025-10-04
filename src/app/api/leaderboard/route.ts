import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";


// Calculate XP based on activities (same as stats)
function calculateXP(lessons: number, quizzes: number, flashcards: number, streak: number): number {
  const lessonXP = lessons * 10;
  const quizXP = quizzes * 15;
  const flashcardXP = flashcards * 5;
  const streakBonus = Math.min(streak * 2, 100); // Max 100 bonus for streak
  
  return lessonXP + quizXP + flashcardXP + streakBonus;
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supa = await supabaseServer();

    // Simplified approach: get all users first
    const { data: allUsers, error: usersError } = await supa
      .from("profiles")
      .select("id, full_name")
      .not("full_name", "is", null);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    console.log("Fetched users count:", allUsers?.length || 0);

    // For now, return a simple leaderboard with mock data
    // This will be replaced with real data once we confirm the basic structure works
    const mockLeaderboard = [
      { rank: 1, name: "Alex Chen", xp: 4580, avatar: "AC", isCurrentUser: false },
      { rank: 2, name: "Sarah Johnson", xp: 4120, avatar: "SJ", isCurrentUser: false },
      { rank: 3, name: "You", xp: 2340, avatar: "ME", isCurrentUser: true },
      { rank: 4, name: "Mike Wilson", xp: 2180, avatar: "MW", isCurrentUser: false },
      { rank: 5, name: "Emma Davis", xp: 1950, avatar: "ED", isCurrentUser: false }
    ];

    console.log("Returning mock leaderboard with", mockLeaderboard.length, "users");
    return NextResponse.json(mockLeaderboard);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /api/leaderboard";
    console.error("GET /api/leaderboard - caught error:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
