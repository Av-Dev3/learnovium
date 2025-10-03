import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface GoalWithProgress {
  id: string;
  topic: string;
  focus: string;
  level: string;
  created_at: string;
  plan_json?: Record<string, unknown>;
  progress_pct?: number;
  completed_lessons: number;
  total_lessons: number;
  streak_days: number;
  last_activity: string;
  time_spent_hours: number;
  avg_session_minutes: number;
}

interface ImprovementArea {
  area: string;
  confidence: number;
  importance: 'high' | 'medium' | 'low';
  reason: string;
}

interface NextMilestone {
  title: string;
  description: string;
  estimated_days: number;
  priority: 'high' | 'medium' | 'low';
}

interface RecommendedGoal {
  id: string;
  title: string;
  reason: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimated_duration: string;
  prerequisites: string[];
  skills_gained: string[];
  popularity: number;
  match_score: number;
  category: string;
}

interface LearningInsight {
  type: 'strength' | 'improvement' | 'opportunity' | 'warning';
  title: string;
  description: string;
  action: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
}

interface TrendingSkill {
  skill: string;
  demand: number;
  growth: string;
  category: string;
  relevance_score: number;
}

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await supabaseServer();

    // Get user's goals with progress data
    const { data: goals, error: goalsError } = await supabase
      .from("learning_goals")
      .select(`
        id, topic, focus, level, created_at, plan_json, progress_pct,
        plan_template_id
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (goalsError) {
      console.error("Error fetching goals:", goalsError);
      return NextResponse.json({ error: "Failed to fetch goals" }, { status: 500 });
    }

    // Get progress data for all goals
    const { data: progress, error: progressError } = await supabase
      .from("lesson_progress")
      .select("goal_id, day_index, completed_at, score")
      .eq("user_id", user.id)
      .not("completed_at", "is", null)
      .order("completed_at", { ascending: false });

    if (progressError) {
      console.error("Error fetching progress:", progressError);
    }

    // Get user profile for preferences
    const { data: profile } = await supabase
      .from("profiles")
      .select("level, minutes_per_day, tz")
      .eq("id", user.id)
      .single();

    // Process goals with progress data
    const goalsWithProgress: GoalWithProgress[] = goals?.map(goal => {
      const goalProgress = progress?.filter(p => p.goal_id === goal.id) || [];
      const completedLessons = goalProgress.length;
      
    // Calculate total lessons from plan
    let totalLessons = 0;
    if (goal.plan_json && typeof goal.plan_json === 'object') {
      const plan = goal.plan_json as { modules?: Array<Record<string, unknown>> };
      if (plan.modules && Array.isArray(plan.modules)) {
        totalLessons = plan.modules.length;
      }
    }

      // Calculate streak (consecutive days with activity)
      const streakDays = calculateStreak(goalProgress);
      
      // Calculate time spent (estimate based on completed lessons)
      const timeSpentHours = Math.round(completedLessons * 0.5); // 30 min per lesson average
      
      // Calculate average session time
      const avgSessionMinutes = profile?.minutes_per_day || 30;

      // Get last activity date
      const lastActivity = goalProgress.length > 0 
        ? goalProgress[0].completed_at 
        : goal.created_at;

      return {
        id: goal.id,
        topic: goal.topic,
        focus: goal.focus || '',
        level: goal.level || 'beginner',
        created_at: goal.created_at,
        plan_json: goal.plan_json,
        progress_pct: goal.progress_pct || Math.round((completedLessons / Math.max(totalLessons, 1)) * 100),
        completed_lessons: completedLessons,
        total_lessons: totalLessons,
        streak_days: streakDays,
        last_activity: lastActivity,
        time_spent_hours: timeSpentHours,
        avg_session_minutes: avgSessionMinutes
      };
    }) || [];

    // Generate recommendations
    const currentGoals = goalsWithProgress.filter(goal => (goal.progress_pct || 0) < 100);
    const improvements = generateImprovements(currentGoals);
    const nextGoals = generateNextGoals(currentGoals, profile?.level || 'beginner');
    const insights = generateInsights(currentGoals, profile);
    const trending = generateTrendingSkills(currentGoals);

    return NextResponse.json({
      current_goals: currentGoals,
      improvements,
      next_goals: nextGoals,
      insights,
      trending_skills: trending
    });

  } catch (error) {
    console.error("Error in recommendations API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

function calculateStreak(progress: Array<{ completed_at: string }>): number {
  if (progress.length === 0) return 0;
  
  // Group by date and count consecutive days
  const dates = [...new Set(progress.map(p => p.completed_at.split('T')[0]))]
    .sort()
    .reverse();
  
  let streak = 0;
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString().split('T')[0];
  
  // Check if there was activity today or yesterday
  if (dates.includes(today) || dates.includes(yesterday)) {
    streak = 1;
    
    for (let i = 1; i < dates.length; i++) {
      const currentDate = new Date(dates[i - 1]);
      const previousDate = new Date(dates[i]);
      const diffDays = Math.floor((currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24));
      
      if (diffDays === 1) {
        streak++;
      } else {
        break;
      }
    }
  }
  
  return streak;
}

function generateImprovements(goals: GoalWithProgress[]): GoalWithProgress[] {
  return goals.map(goal => {
    // Add improvement areas based on progress and topic
    const improvementAreas = generateImprovementAreas(goal);
    const nextMilestones = generateNextMilestones(goal);
    
    return {
      ...goal,
      improvement_areas: improvementAreas,
      next_milestones: nextMilestones
    };
  });
}

function generateImprovementAreas(goal: GoalWithProgress): ImprovementArea[] {
  const areas: ImprovementArea[] = [];
  
  // Analyze progress patterns
  if ((goal.progress_pct || 0) < 30) {
    areas.push({
      area: "Getting Started",
      confidence: 20,
      importance: 'high',
      reason: "You're just beginning this topic. Focus on building a strong foundation."
    });
  }
  
  if (goal.streak_days < 3) {
    areas.push({
      area: "Consistency",
      confidence: 30,
      importance: 'high',
      reason: "Building a consistent learning habit will accelerate your progress."
    });
  }
  
  if (goal.avg_session_minutes < 20) {
    areas.push({
      area: "Session Length",
      confidence: 40,
      importance: 'medium',
      reason: "Longer study sessions can improve retention and understanding."
    });
  }
  
  // Topic-specific areas
  if (goal.topic.toLowerCase().includes('javascript')) {
    areas.push({
      area: "Async Programming",
      confidence: 35,
      importance: 'high',
      reason: "Essential for modern JavaScript development"
    });
  }
  
  if (goal.topic.toLowerCase().includes('react')) {
    areas.push({
      area: "State Management",
      confidence: 45,
      importance: 'high',
      reason: "Critical for building complex React applications"
    });
  }
  
  return areas.slice(0, 3); // Limit to 3 areas
}

function generateNextMilestones(goal: GoalWithProgress): NextMilestone[] {
  const milestones: NextMilestone[] = [];
  
  if ((goal.progress_pct || 0) < 25) {
    milestones.push({
      title: "Complete First Module",
      description: "Finish the introductory concepts",
      estimated_days: 3,
      priority: 'high'
    });
  }
  
  if ((goal.progress_pct || 0) < 50) {
    milestones.push({
      title: "Build First Project",
      description: "Apply what you've learned in a practical project",
      estimated_days: 7,
      priority: 'high'
    });
  }
  
  if ((goal.progress_pct || 0) < 75) {
    milestones.push({
      title: "Master Advanced Concepts",
      description: "Dive deeper into complex topics",
      estimated_days: 10,
      priority: 'medium'
    });
  }
  
  return milestones;
}

function generateNextGoals(currentGoals: GoalWithProgress[], userLevel: string): RecommendedGoal[] {
  const recommendations: RecommendedGoal[] = [];
  
  // Analyze current goals to suggest next steps
  const topics = currentGoals.map(g => g.topic.toLowerCase());
  
  if (topics.some(t => t.includes('javascript'))) {
    recommendations.push({
      id: 'next-1',
      title: 'Node.js Backend Development',
      reason: 'Perfect next step after JavaScript fundamentals',
      difficulty: 'medium',
      estimated_duration: '45 days',
      prerequisites: ['JavaScript Fundamentals'],
      skills_gained: ['API Development', 'Database Integration', 'Server Management'],
      popularity: 85,
      match_score: 92,
      category: 'Backend Development'
    });
  }
  
  if (topics.some(t => t.includes('react'))) {
    recommendations.push({
      id: 'next-2',
      title: 'TypeScript Mastery',
      reason: 'Enhance your JavaScript and React skills with type safety',
      difficulty: 'medium',
      estimated_duration: '30 days',
      prerequisites: ['JavaScript Fundamentals', 'React Development'],
      skills_gained: ['Type Safety', 'Better IDE Support', 'Large-scale Development'],
      popularity: 78,
      match_score: 88,
      category: 'Language Enhancement'
    });
  }
  
  // Add general recommendations based on user level
  if (userLevel === 'beginner') {
    recommendations.push({
      id: 'next-3',
      title: 'Data Structures & Algorithms',
      reason: 'Strengthen your programming foundation',
      difficulty: 'hard',
      estimated_duration: '60 days',
      prerequisites: ['Basic Programming Knowledge'],
      skills_gained: ['Problem Solving', 'Code Optimization', 'Technical Interviews'],
      popularity: 72,
      match_score: 75,
      category: 'Computer Science'
    });
  }
  
  return recommendations.slice(0, 3);
}

function generateInsights(goals: GoalWithProgress[], profile: { level?: string; minutes_per_day?: number } | null): LearningInsight[] {
  const insights: LearningInsight[] = [];
  
  // Analyze learning patterns
  const totalStreak = Math.max(...goals.map(g => g.streak_days));
  const avgProgress = goals.reduce((sum, g) => sum + (g.progress_pct || 0), 0) / goals.length;
  const totalTimeSpent = goals.reduce((sum, g) => sum + g.time_spent_hours, 0);
  
  if (totalStreak >= 7) {
    insights.push({
      type: 'strength',
      title: 'Excellent Learning Consistency',
      description: `You've maintained a ${totalStreak}-day streak! Your regular study sessions are paying off.`,
      action: 'Keep it up and aim for a 30-day milestone',
      icon: 'streak',
      priority: 'high'
    });
  }
  
  if (profile?.minutes_per_day && profile.minutes_per_day < 30) {
    insights.push({
      type: 'improvement',
      title: 'Session Length Optimization',
      description: `Your current session length is ${profile.minutes_per_day} minutes. Consider 45-50 minute sessions for better retention.`,
      action: 'Try extending your next few sessions by 10-15 minutes',
      icon: 'clock',
      priority: 'medium'
    });
  }
  
  if (avgProgress < 30) {
    insights.push({
      type: 'warning',
      title: 'Slow Progress Detected',
      description: `Your average progress is ${Math.round(avgProgress)}%. Consider adjusting your learning approach.`,
      action: 'Review your study methods and consider seeking help',
      icon: 'alert',
      priority: 'high'
    });
  }
  
  if (totalTimeSpent > 20) {
    insights.push({
      type: 'opportunity',
      title: 'Ready for Advanced Topics',
      description: `You've spent ${totalTimeSpent} hours learning. You're ready to tackle more challenging concepts.`,
      action: 'Explore advanced topics in your current goals',
      icon: 'users',
      priority: 'medium'
    });
  }
  
  return insights;
}

function generateTrendingSkills(goals: GoalWithProgress[]): TrendingSkill[] {
  const trending: TrendingSkill[] = [
    { skill: 'AI/Machine Learning', demand: 95, growth: '+45%', category: 'Emerging Tech', relevance_score: 85 },
    { skill: 'React/Next.js', demand: 88, growth: '+32%', category: 'Frontend', relevance_score: 90 },
    { skill: 'Cloud Computing', demand: 82, growth: '+28%', category: 'Infrastructure', relevance_score: 75 },
    { skill: 'TypeScript', demand: 79, growth: '+41%', category: 'Language', relevance_score: 88 },
    { skill: 'DevOps', demand: 76, growth: '+35%', category: 'Operations', relevance_score: 70 }
  ];
  
  // Sort by relevance to user's current goals
  const userTopics = goals.map(g => g.topic.toLowerCase());
  return trending.sort((a, b) => {
    const aRelevance = userTopics.some(topic => 
      a.skill.toLowerCase().includes(topic) || topic.includes(a.skill.toLowerCase())
    ) ? 100 : a.relevance_score;
    const bRelevance = userTopics.some(topic => 
      b.skill.toLowerCase().includes(topic) || topic.includes(b.skill.toLowerCase())
    ) ? 100 : b.relevance_score;
    
    return bRelevance - aRelevance;
  });
}
