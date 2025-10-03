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

    // Get all users with their progress data
    const { data: allUsers, error: usersError } = await supa
      .from("profiles")
      .select(`
        id,
        full_name,
        learning_goals!inner (
          id,
          lesson_progress!inner (
            completed_at,
            day_index
          ),
          flashcards!inner (
            id,
            mastery_score,
            review_count
          )
        )
      `)
      .not("full_name", "is", null);

    if (usersError) {
      console.error("Error fetching users:", usersError);
      return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
    }

    // Calculate XP for each user
    const usersWithXP = (allUsers || []).map(userData => {
      const goals = userData.learning_goals || [];
      const allProgress = goals.flatMap(goal => goal.lesson_progress || []);
      const allFlashcards = goals.flatMap(goal => goal.flashcards || []);
      
      const totalLessons = allProgress.length;
      const totalQuizzes = Math.floor(totalLessons * 0.3);
      const totalFlashcards = allFlashcards.length;
      
      // Calculate streak (simplified)
      const currentStreak = Math.min(totalLessons, 30); // Simplified streak calculation
      
      const xp = calculateXP(totalLessons, totalQuizzes, totalFlashcards, currentStreak);
      
      return {
        id: userData.id,
        name: userData.full_name || "Anonymous",
        xp
      };
    });

    // Sort by XP and add ranks
    const sortedUsers = usersWithXP
      .sort((a, b) => b.xp - a.xp)
      .map((userData, index) => ({
        rank: index + 1,
        name: userData.name,
        xp: userData.xp,
        avatar: userData.name.split(' ').map((n: string) => n[0]).join('').toUpperCase(),
        isCurrentUser: userData.id === user.id
      }));

    // Get top 10 and check if current user is included
    const top10 = sortedUsers.slice(0, 10);
    const currentUserInTop10 = top10.some(u => u.isCurrentUser);
    
    if (!currentUserInTop10) {
      // Current user not in top 10, add them
      const currentUser = sortedUsers.find(u => u.isCurrentUser);
      if (currentUser) {
        top10.push({
          ...currentUser,
          name: "You"
        });
      }
    }

    return NextResponse.json(top10);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /api/leaderboard";
    console.error("GET /api/leaderboard - caught error:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
