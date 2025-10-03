import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";
import { calculateStreak } from "@/lib/api/utils";

export const dynamic = "force-dynamic";

interface UserStats {
  totalStudyTime: number; // hours
  totalLessons: number;
  totalQuizzes: number;
  totalFlashcards: number;
  averageScore: number;
  currentStreak: number;
  longestStreak: number;
  weeklyGoal: number; // hours
  weeklyProgress: number; // hours
  monthlyGoal: number; // hours
  monthlyProgress: number; // hours
  level: number;
  xp: number;
  xpToNext: number;
  badges: Badge[];
  weeklyActivity: WeeklyActivity[];
}

interface Badge {
  id: string;
  name: string;
  description: string;
  earned: boolean;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

interface WeeklyActivity {
  day: string;
  hours: number;
  lessons: number;
  quizzes: number;
}


// Calculate XP based on activities
function calculateXP(lessons: number, quizzes: number, flashcards: number, streak: number): number {
  const lessonXP = lessons * 10;
  const quizXP = quizzes * 15;
  const flashcardXP = flashcards * 5;
  const streakBonus = Math.min(streak * 2, 100); // Max 100 bonus for streak
  
  return lessonXP + quizXP + flashcardXP + streakBonus;
}

// Calculate level from XP
function calculateLevel(xp: number): { level: number; xpToNext: number } {
  const baseXP = 100;
  const level = Math.floor(Math.sqrt(xp / baseXP)) + 1;
  const nextLevelXP = Math.pow(level, 2) * baseXP;
  const xpToNext = nextLevelXP - xp;
  
  return { level, xpToNext: Math.max(0, xpToNext) };
}

// Calculate badges based on user progress
function calculateBadges(stats: Partial<UserStats>): Badge[] {
  const badges: Badge[] = [
    {
      id: 'first-steps',
      name: 'First Steps',
      description: 'Complete your first lesson',
      earned: (stats.totalLessons || 0) >= 1,
      rarity: 'common'
    },
    {
      id: 'quiz-master',
      name: 'Quiz Master',
      description: 'Score 90% or higher on 5 quizzes',
      earned: (stats.averageScore || 0) >= 90 && (stats.totalQuizzes || 0) >= 5,
      rarity: 'rare'
    },
    {
      id: 'streak-warrior',
      name: 'Streak Warrior',
      description: 'Maintain a 7-day learning streak',
      earned: (stats.currentStreak || 0) >= 7,
      rarity: 'epic'
    },
    {
      id: 'knowledge-seeker',
      name: 'Knowledge Seeker',
      description: 'Complete 50 lessons',
      earned: (stats.totalLessons || 0) >= 50,
      rarity: 'rare'
    },
    {
      id: 'flash-champion',
      name: 'Flash Champion',
      description: 'Master 100 flashcards',
      earned: (stats.totalFlashcards || 0) >= 100,
      rarity: 'epic'
    },
    {
      id: 'perfectionist',
      name: 'Perfectionist',
      description: 'Score 100% on a quiz',
      earned: (stats.averageScore || 0) >= 100,
      rarity: 'legendary'
    },
    {
      id: 'marathon-learner',
      name: 'Marathon Learner',
      description: 'Study for 30 days straight',
      earned: (stats.longestStreak || 0) >= 30,
      rarity: 'legendary'
    },
    {
      id: 'speed-demon',
      name: 'Speed Demon',
      description: 'Complete 10 lessons in one day',
      earned: false, // This would need daily lesson tracking
      rarity: 'epic'
    }
  ];
  
  return badges;
}

// Calculate weekly activity data
function calculateWeeklyActivity(progressData: Array<{ completed_at: string; day_index?: number }>): WeeklyActivity[] {
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const weeklyData: WeeklyActivity[] = [];
  
  // Get the last 7 days
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dayKey = date.toISOString().split('T')[0];
    
    // Filter progress for this day
    const dayProgress = progressData.filter(p => 
      p.completed_at && p.completed_at.startsWith(dayKey)
    );
    
    const hours = dayProgress.length * 0.5; // Assume 30 minutes per lesson
    const lessons = dayProgress.length;
    const quizzes = Math.floor(lessons * 0.3); // Assume 30% of lessons have quizzes
    
    weeklyData.push({
      day: days[date.getDay()],
      hours: Math.round(hours * 10) / 10,
      lessons,
      quizzes
    });
  }
  
  return weeklyData;
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supa = await supabaseServer();

    // Get user's goals
    const { data: goals, error: goalsError } = await supa
      .from("learning_goals")
      .select("id, topic, minutes_per_day")
      .eq("user_id", user.id);

    if (goalsError) {
      console.error("Error fetching goals:", goalsError);
      return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
    }

    const goalIds = goals?.map(g => g.id) || [];

    if (goalIds.length === 0) {
      // Return empty stats for new users
      const emptyStats: UserStats = {
        totalStudyTime: 0,
        totalLessons: 0,
        totalQuizzes: 0,
        totalFlashcards: 0,
        averageScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyGoal: 5,
        weeklyProgress: 0,
        monthlyGoal: 20,
        monthlyProgress: 0,
        level: 1,
        xp: 0,
        xpToNext: 100,
        badges: calculateBadges({}),
        weeklyActivity: calculateWeeklyActivity([])
      };
      
      return NextResponse.json(emptyStats);
    }

    // Get lesson progress data
    const { data: progressData, error: progressError } = await supa
      .from("lesson_progress")
      .select("completed_at, day_index, goal_id")
      .eq("user_id", user.id)
      .in("goal_id", goalIds)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false });

    if (progressError) {
      console.error("Error fetching progress:", progressError);
      return NextResponse.json({ error: "Failed to fetch progress" }, { status: 500 });
    }

    // Get flashcard data
    const { data: flashcardData, error: flashcardError } = await supa
      .from("flashcards")
      .select("id, mastery_score, review_count")
      .eq("user_id", user.id);

    if (flashcardError) {
      console.error("Error fetching flashcards:", flashcardError);
      return NextResponse.json({ error: "Failed to fetch flashcards" }, { status: 500 });
    }

    // Get quiz data (assuming quizzes are stored in a separate table or as part of lessons)
    // For now, we'll estimate based on progress data
    const totalQuizzes = Math.floor((progressData?.length || 0) * 0.3);
    const averageScore = 85; // This would need to be calculated from actual quiz scores

    // Calculate basic stats
    const totalLessons = progressData?.length || 0;
    const totalStudyTime = totalLessons * 0.5; // Assume 30 minutes per lesson
    const totalFlashcards = flashcardData?.length || 0;

    // Calculate streaks
    const currentStreak = calculateStreak(progressData || []);
    
    // Calculate longest streak (simplified - would need more complex logic for historical data)
    const longestStreak = Math.max(currentStreak, 0);

    // Calculate XP and level
    const xp = calculateXP(totalLessons, totalQuizzes, totalFlashcards, currentStreak);
    const { level, xpToNext } = calculateLevel(xp);

    // Calculate weekly and monthly progress
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    
    const weeklyProgress = (progressData || [])
      .filter(p => new Date(p.completed_at) >= weekStart)
      .length * 0.5;
    
    const monthlyProgress = (progressData || [])
      .filter(p => new Date(p.completed_at) >= monthStart)
      .length * 0.5;

    // Calculate goals (use user's average or default)
    const weeklyGoal = Math.max(5, Math.ceil(weeklyProgress));
    const monthlyGoal = Math.max(20, Math.ceil(monthlyProgress));

    // Calculate badges
    const badges = calculateBadges({
      totalLessons,
      totalQuizzes,
      totalFlashcards,
      averageScore,
      currentStreak,
      longestStreak
    });

    // Calculate weekly activity
    const weeklyActivity = calculateWeeklyActivity(progressData || []);

    const stats: UserStats = {
      totalStudyTime: Math.round(totalStudyTime * 10) / 10,
      totalLessons,
      totalQuizzes,
      totalFlashcards,
      averageScore,
      currentStreak,
      longestStreak,
      weeklyGoal,
      weeklyProgress: Math.round(weeklyProgress * 10) / 10,
      monthlyGoal,
      monthlyProgress: Math.round(monthlyProgress * 10) / 10,
      level,
      xp,
      xpToNext,
      badges,
      weeklyActivity
    };

    return NextResponse.json(stats);
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "Unknown error in GET /api/stats";
    console.error("GET /api/stats - caught error:", e);
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
