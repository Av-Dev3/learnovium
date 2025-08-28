import Link from "next/link";

import { Container } from "@/components/layout/container";
import { supabaseServer } from "@/lib/supabaseServer";
import { 
  BookOpen, 
  Target, 
  TrendingUp, 
  Clock, 
  Zap, 
  Plus, 
  ArrowRight, 
  Sparkles,
  Brain,
  Trophy,
  Flame,
  CheckCircle,
  Play,
  BarChart3,
  Lightbulb
} from "lucide-react";

interface LessonData {
  topic?: string;
  reading?: string;
  walkthrough?: string;
  est_minutes?: number;
}

interface PlanDay {
  day_index: number;
  topic?: string;
  objective?: string;
  practice?: string;
  assessment?: string;
  est_minutes?: number;
}

interface PlanModule {
  days?: PlanDay[];
}

interface PlanData {
  modules?: PlanModule[];
}

function computeDayIndex(startISO: string) {
  const start = new Date(startISO);
  const now = new Date();
  const ms = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
             Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  return Math.max(1, Math.floor(ms / 86400000) + 1);
}

function snippet(text: string, max = 120) {
  if (!text) return "";
  const s = text.trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export default async function DashboardPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, show modern empty state
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
        <Container>
          <div className="space-y-8 pt-8">
            {/* Hero Section */}
            <div className="text-center space-y-6 py-12">
              <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 border border-[var(--border)]/40 bg-[var(--bg)]/80 backdrop-blur-md shadow-lg">
                <Sparkles className="w-5 h-5 text-brand" />
                <span className="text-sm font-semibold text-[var(--fg)]/90">AI-Powered Learning</span>
              </div>
              
              <h1 className="font-heading text-4xl md:text-6xl font-bold leading-tight tracking-tight">
                <span className="text-[var(--fg)]">Welcome to</span>
                <br />
                <span className="bg-gradient-to-r from-brand via-purple-500 to-brand bg-clip-text text-transparent">Learnovium</span>
              </h1>
              
              <p className="text-xl text-[var(--fg)]/70 max-w-2xl mx-auto leading-relaxed">
                Master any skill with personalized AI-powered learning paths. Create your first goal to get started.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Link 
                  href="/auth"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/about"
                  className="inline-flex items-center gap-2 px-8 py-4 border-2 border-[var(--border)] text-[var(--fg)] font-semibold rounded-2xl hover:border-brand/50 hover:bg-muted transition-all duration-300"
                >
                  Learn More
                </Link>
              </div>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="text-center space-y-4 p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--fg)]">AI-Powered</h3>
                <p className="text-sm text-[var(--fg)]/70">Personalized lessons that adapt to your learning style</p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--fg)]">Goal-Oriented</h3>
                <p className="text-sm text-[var(--fg)]/70">Clear objectives and progress tracking</p>
              </div>
              
              <div className="text-center space-y-4 p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--fg)]">Daily Progress</h3>
                <p className="text-sm text-[var(--fg)]/70">Build lasting habits with daily consistency</p>
              </div>
            </div>
          </div>
        </Container>
      </div>
    );
  }

  // Load user goals
  const { data: goals } = await supabase
    .from("learning_goals")
    .select("id, topic, created_at, plan_json, plan_template_id")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  console.log("Dashboard: Loaded goals:", goals?.length || 0);
  console.log("Dashboard: Goals data:", goals);
  if (goals && goals.length > 0) {
    console.log("Dashboard: First goal sample:", {
      id: goals[0].id,
      topic: goals[0].topic,
      created_at: goals[0].created_at,
      has_plan_json: !!goals[0].plan_json,
      has_plan_template_id: !!goals[0].plan_template_id,
      plan_json_keys: goals[0].plan_json ? Object.keys(goals[0].plan_json) : 'none'
    });
  }

  const items: Array<{
    goalId: string;
    goalTopic: string;
    dayIndex: number;
    lessonTitle?: string;
    lessonSnippet?: string;
    estMinutes?: number;
    hasLesson: boolean;
  }> = [];

  if (goals && goals.length) {
    // For each goal, try to read today's cached lesson from lesson_template first, then lesson_log
    for (const g of goals) {
      const dayIndex = computeDayIndex(g.created_at as string);
      console.log(`Dashboard: Processing goal ${g.id}, day ${dayIndex}`);
      console.log(`Dashboard: Goal data:`, {
        id: g.id,
        topic: g.topic,
        has_plan_json: !!g.plan_json,
        has_plan_template_id: !!g.plan_template_id,
        plan_json_type: typeof g.plan_json,
        plan_json_keys: g.plan_json ? Object.keys(g.plan_json) : 'none'
      });
      
      let lessonTitle: string | undefined;
      let lessonSnippet: string | undefined;
      let estMinutes: number | undefined;
      let hasLesson = false;

      // Try cached lesson template first (new system)
      if (g.plan_template_id) {
        try {
          const { data: templateLesson } = await supabase
            .from("lesson_template")
            .select("lesson_json")
            .eq("plan_template_id", g.plan_template_id)
            .eq("day_index", dayIndex)
            .eq("version", 1)
            .maybeSingle();

          if (templateLesson?.lesson_json) {
            const l = templateLesson.lesson_json as LessonData;
            lessonTitle = l.topic;
            lessonSnippet = snippet(l.reading || l.walkthrough || "");
            estMinutes = l.est_minutes;
            hasLesson = true;
            console.log(`Dashboard: Using lesson template for goal ${g.id}:`, { 
              title: lessonTitle, 
              snippet: lessonSnippet?.substring(0, 50),
              reading_length: l.reading?.length || 0,
              walkthrough_length: l.walkthrough?.length || 0
            });
          } else {
            console.log(`Dashboard: No lesson template found for goal ${g.id}, day ${dayIndex}`);
          }
        } catch (error) {
          console.log(`Dashboard: Template lesson lookup failed for goal ${g.id}:`, error);
        }
      } else {
        console.log(`Dashboard: Goal ${g.id} has no plan_template_id`);
      }

      // If no template lesson, try cached user lesson (fallback)
      if (!hasLesson) {
        try {
          const { data: existing } = await supabase
            .from("lesson_log")
            .select("lesson_json")
            .eq("user_id", user.id)
            .eq("goal_id", g.id)
            .eq("day_index", dayIndex)
            .maybeSingle();

          if (existing?.lesson_json) {
            const l = existing.lesson_json as LessonData;
            lessonTitle = l.topic;
            lessonSnippet = snippet(l.reading || l.walkthrough || "");
            estMinutes = l.est_minutes;
            hasLesson = true;
            console.log(`Dashboard: Using cached lesson log for goal ${g.id}:`, { 
              title: lessonTitle, 
              snippet: lessonSnippet?.substring(0, 50),
              reading_length: l.reading?.length || 0,
              walkthrough_length: l.walkthrough?.length || 0
            });
          } else {
            console.log(`Dashboard: No lesson log found for goal ${g.id}, day ${dayIndex}`);
          }
        } catch (error) {
          // Table might not exist yet, that's okay
          console.log(`Dashboard: Lesson log lookup failed for goal ${g.id} (table may not exist):`, error);
        }
      }

      // If still no lesson, fall back to showing today's plan day title
      if (!hasLesson && g.plan_json) {
        try {
          const plan = g.plan_json as PlanData;
          console.log(`Dashboard: Plan data for goal ${g.id}:`, {
            has_modules: !!plan.modules,
            modules_count: plan.modules?.length || 0,
            plan_type: typeof plan,
            plan_keys: Object.keys(plan)
          });
          
          // Locate the plan day by dayIndex
          const flatDays = (plan.modules || []).flatMap((m: PlanModule) => m.days || []);
          console.log(`Dashboard: Flat days for goal ${g.id}:`, {
            total_days: flatDays.length,
            day_indices: flatDays.map((d: PlanDay) => d.day_index),
            looking_for_day: dayIndex
          });
          
          const day = flatDays.find((d: PlanDay) => d.day_index === dayIndex);
          if (day) {
            lessonTitle = day.topic || `Day ${dayIndex}`;
            lessonSnippet = snippet(day.objective || day.practice || day.assessment || "");
            estMinutes = day.est_minutes;
            console.log(`Dashboard: Using plan data for goal ${g.id}:`, { 
              title: lessonTitle, 
              snippet: lessonSnippet?.substring(0, 50),
              day_index: day.day_index,
              has_objective: !!day.objective,
              has_practice: !!day.practice,
              has_assessment: !!day.assessment
            });
          } else {
            // No plan day found for today, show a message to generate lesson
            lessonTitle = `Day ${dayIndex}`;
            lessonSnippet = "Click to generate today's lesson";
            estMinutes = undefined;
            console.log(`Dashboard: No plan day found for goal ${g.id}, day ${dayIndex}. Available days:`, flatDays.map(d => d.day_index));
          }
        } catch (error) {
          console.log(`Dashboard: Error processing plan_json for goal ${g.id}:`, error);
          lessonTitle = `Day ${dayIndex}`;
          lessonSnippet = "Click to generate today's lesson";
          estMinutes = undefined;
        }
      } else if (!hasLesson) {
        // No plan data at all - show a basic placeholder
        lessonTitle = `Day ${dayIndex}`;
        lessonSnippet = "Click to start learning and generate your first lesson";
        estMinutes = undefined;
        console.log(`Dashboard: No plan data for goal ${g.id}. This goal needs a learning plan.`);
      }

      // Ensure we always have a title and snippet
      if (!lessonTitle) {
        lessonTitle = `Day ${dayIndex}`;
      }
      if (!lessonSnippet) {
        lessonSnippet = "Click to start learning";
      }

      console.log(`Dashboard: Final item for goal ${g.id}:`, {
        goalId: g.id,
        goalTopic: g.topic,
        dayIndex,
        lessonTitle,
        lessonSnippet: lessonSnippet?.substring(0, 50),
        estMinutes,
        hasLesson
      });

      items.push({
        goalId: g.id,
        goalTopic: g.topic,
        dayIndex,
        lessonTitle,
        lessonSnippet,
        estMinutes,
        hasLesson,
      });
    }
  } else {
    console.log("Dashboard: No goals found in database");
  }

  console.log("Dashboard: Final items to display:", items.length);
  console.log("Dashboard: Items details:", items.map(item => ({
    goalId: item.goalId,
    goalTopic: item.goalTopic,
    dayIndex: item.dayIndex,
    lessonTitle: item.lessonTitle,
    lessonSnippet: item.lessonSnippet?.substring(0, 50),
    hasLesson: item.hasLesson,
    estMinutes: item.estMinutes
  })));
  
  // Debug the rendering condition
  const shouldShowEmptyState = !items.length || items.every(i => !i.lessonTitle);
  console.log("Dashboard: Should show empty state?", shouldShowEmptyState);
  console.log("Dashboard: Items length:", items.length);
  console.log("Dashboard: Items with lesson titles:", items.filter(i => i.lessonTitle).length);
  console.log("Dashboard: Items without lesson titles:", items.filter(i => !i.lessonTitle).length);

  // Calculate some stats
  const totalGoals = goals?.length || 0;
  const activeLessons = items.filter(i => i.hasLesson).length;
  const totalEstimatedTime = items.reduce((sum, i) => sum + (i.estMinutes || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
      <Container>
        <div className="space-y-8 pt-8">
          {/* Header Section */}
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-2">
                <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]">
                  Welcome back! 👋
                </h1>
                <p className="text-xl text-[var(--fg)]/70">Here&apos;s your learning overview for today</p>
              </div>
              
              <Link 
                href="/app/create"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
              >
                <Plus className="w-5 h-5" />
                New Goal
              </Link>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center">
                    <Target className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--fg)]">{totalGoals}</p>
                    <p className="text-sm text-[var(--fg)]/70">Active Goals</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <BookOpen className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--fg)]">{activeLessons}</p>
                    <p className="text-sm text-[var(--fg)]/70">Today&apos;s Lessons</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                    <Clock className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--fg)]">{totalEstimatedTime}</p>
                    <p className="text-sm text-[var(--fg)]/70">Minutes Today</p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
                    <Flame className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-[var(--fg)]">7</p>
                    <p className="text-sm text-[var(--fg)]/70">Day Streak</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="w-6 h-6 text-brand" />
              <h2 className="text-2xl font-bold text-[var(--fg)]">Quick Actions</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link 
                href="/app/create"
                className="group p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-brand/40"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] group-hover:text-brand transition-colors">Create New Goal</h3>
                    <p className="text-sm text-[var(--fg)]/70">Start learning a new skill with AI guidance</p>
                  </div>
                </div>
              </Link>

              <Link 
                href="/app/plans"
                className="group p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-green-500/40"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] group-hover:text-green-600 transition-colors">View All Plans</h3>
                    <p className="text-sm text-[var(--fg)]/70">See your learning progress and plans</p>
                  </div>
                </div>
              </Link>

              <Link 
                href="/app/history"
                className="group p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-purple-500/40"
              >
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Trophy className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-[var(--fg)] group-hover:text-purple-600 transition-colors">Learning History</h3>
                    <p className="text-sm text-[var(--fg)]/70">Track your achievements and progress</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Today's Lessons */}
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-brand" />
              <h2 className="text-2xl font-bold text-[var(--fg)]">Today&apos;s Lessons</h2>
            </div>

            {(() => { console.log("Dashboard render: items.length =", items.length, "items =", items); return null; })()}

            {/* Always show something - either lessons or helpful content */}
            {items.length === 0 ? (
              // No goals at all
              <div className="text-center py-16 px-6">
                <div className="w-24 h-24 bg-gradient-to-br from-[var(--border)] to-[var(--border)]/60 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="h-12 w-12 text-[var(--fg)]/40" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--fg)] mb-3">Ready to start learning?</h3>
                <p className="text-[var(--fg)]/70 mb-6 max-w-md mx-auto">
                  Create your first learning goal to get started with a structured, progressive learning plan powered by AI.
                </p>
                <Link 
                  href="/app/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  <Plus className="w-5 h-5" />
                  Create Your First Goal
                </Link>
              </div>
            ) : items.every(i => !i.lessonTitle) ? (
              // Goals exist but no lesson titles (likely no plan data)
              <div className="space-y-6">
                <div className="text-center py-8 px-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-[var(--border)] to-[var(--border)]/60 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-8 w-8 text-[var(--fg)]/40" />
                  </div>
                  <h3 className="text-lg font-semibold text-[var(--fg)] mb-3">Goals found but no learning plans yet</h3>
                  <p className="text-[var(--fg)]/70 mb-4 max-w-md mx-auto">
                    You have {items.length} learning goal{items.length === 1 ? '' : 's'}, but they don&apos;t have learning plans yet. Click on any goal below to generate your first lesson.
                  </p>
                  <div className="text-xs text-[var(--fg)]/40 bg-[var(--bg)]/30 p-3 rounded-lg max-w-md mx-auto">
                    Debug: Found {items.length} goals but no lesson titles. This usually means the goals don&apos;t have plan_json data or the day calculation is off.
                  </div>
                </div>
                
                {/* Show goals even without lesson titles */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {items.map((it) => (
                    <Link key={it.goalId} href={`/app/plans/${it.goalId}`} className="block group">
                      <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-brand/40">
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-sm text-[var(--fg)]/60">
                                <Target className="w-4 h-4" />
                                <span>{it.goalTopic}</span>
                                <span>•</span>
                                <span>Day {it.dayIndex}</span>
                              </div>
                              <h3 className="text-xl font-semibold text-[var(--fg)] group-hover:text-brand transition-colors">
                                {it.lessonTitle || `Goal: ${it.goalTopic}`}
                              </h3>
                            </div>
                            
                            <div className="w-12 h-12 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                              <Target className="h-6 w-6 text-white" />
                            </div>
                          </div>

                          <p className="text-[var(--fg)]/80 leading-relaxed">
                            {it.lessonSnippet || "Click to view this goal and generate your first lesson"}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-[var(--fg)]/60">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                              <span>No lesson plan yet</span>
                            </div>
                            
                            <div className="flex items-center gap-2 text-sm text-[var(--fg)]/60 group-hover:text-brand transition-colors">
                              <span>View goal</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              // Show the actual lessons
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {items.map((it) => (
                  <Link key={it.goalId} href={`/app/plans/${it.goalId}/lesson`} className="block group">
                    <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-brand/40">
                      <div className="space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-[var(--fg)]/60">
                              <Target className="w-4 h-4" />
                              <span>{it.goalTopic}</span>
                              <span>•</span>
                              <span>Day {it.dayIndex}</span>
                              {it.estMinutes && (
                                <>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <Clock className="w-4 h-4" />
                                    {it.estMinutes} min
                                  </span>
                                </>
                              )}
                            </div>
                            <h3 className="text-xl font-semibold text-[var(--fg)] group-hover:text-brand transition-colors">
                              {it.lessonTitle || `Lesson for Day ${it.dayIndex}`}
                            </h3>
                          </div>
                          
                          <div className="w-12 h-12 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                            <Play className="h-6 w-6 text-white" />
                          </div>
                        </div>

                        {/* Content */}
                        {it.lessonSnippet && (
                          <p className="text-[var(--fg)]/80 leading-relaxed line-clamp-3">
                            {it.lessonSnippet}
                          </p>
                        )}

                        {/* Status */}
                        <div className="flex items-center justify-between">
                          {!it.hasLesson ? (
                            <div className="flex items-center gap-2 text-sm text-[var(--fg)]/60">
                              <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                              <span>Lesson not generated yet</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-sm text-green-600">
                              <CheckCircle className="w-4 h-4" />
                              <span>Ready to start</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-[var(--fg)]/60 group-hover:text-brand transition-colors">
                            <span>Start learning</span>
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        
                        {/* Lesson variety note */}
                        {it.hasLesson && (
                          <div className="flex items-center gap-2 text-xs text-[var(--fg)]/50">
                            <Target className="w-3 h-3" />
                            <span>Planned curriculum • Progressive learning</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Motivation Section */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-purple-600 to-brand p-8 text-center text-white shadow-2xl">
            {/* Background effects */}
            <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            
            <div className="relative z-10 space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold">
                Ready to follow your learning path? 🚀
              </h2>
              <p className="text-lg text-blue-100 max-w-2xl mx-auto">
                Each lesson is carefully planned to build your knowledge step by step. Follow the curriculum and watch your skills grow!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link 
                  href="/app/plans"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand font-semibold rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  View All Plans
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/app/create"
                  className="inline-flex items-center gap-2 px-6 py-3 border-2 border-white text-white font-semibold rounded-2xl hover:bg-white/10 transition-all duration-300"
                >
                  Add New Goal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}