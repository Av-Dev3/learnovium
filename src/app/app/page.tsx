"use client";

export const dynamic = "force-dynamic";

import { LessonCard } from "@/components/ui/lesson-card";
import { GoalCard } from "@/components/ui/goal-card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Plus, Target, TrendingUp, BookOpen, Clock, Zap, ArrowRight, Sparkles, Brain, Trophy, Flame, CheckCircle, Play } from "lucide-react";
import Link from "next/link";
import { useGoals } from "@/app/lib/hooks";
import { MarkCompleteButton } from "@/app/components/MarkCompleteButton";
import { useEffect, useState, useMemo } from "react";

// Types for the lesson data
interface PlanDay {
  day_index: number;
  topic: string;
  objective?: string;
  practice?: string;
  assessment?: string;
  est_minutes?: number;
}

interface PlanModule {
  title: string;
  days: PlanDay[];
}

interface PlanData {
  version: string;
  total_days: number;
  modules: PlanModule[];
}

interface DashboardItem {
  goalId: string;
  goalTopic: string;
  dayIndex: number;
  lessonTitle: string;
  lessonSnippet: string;
  estMinutes?: number;
  hasLesson: boolean;
}

export default function Dashboard() {
  const { goals, isLoading, isError, error } = useGoals();
  const [dashboardItems, setDashboardItems] = useState<DashboardItem[]>([]);
  const [itemsLoading, setItemsLoading] = useState(true);

  // Ensure goals is always an array and memoize to prevent infinite loops
  const safeGoals = useMemo(() => Array.isArray(goals) ? goals : [], [goals]);

  // Function to compute day index
  const computeDayIndex = (createdAt: string) => {
    const createdDate = new Date(createdAt);
    const now = new Date();
    
    // Use local time instead of UTC to ensure day changes at local midnight
    const startLocal = new Date(createdDate.getFullYear(), createdDate.getMonth(), createdDate.getDate());
    const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const ms = nowLocal.getTime() - startLocal.getTime();
    return Math.max(1, Math.floor(ms / 86400000) + 1);
  };

  // Function to create snippet from text
  const snippet = (text: string) => {
    if (!text) return "";
    return text.length > 120 ? text.substring(0, 120) + "..." : text;
  };

  // Load dashboard items when goals change
  useEffect(() => {
    
    if (safeGoals.length > 0) {
      setItemsLoading(true);
      
      // Process each goal to create dashboard items
      const items: DashboardItem[] = [];
      
      safeGoals.forEach((goal) => {
        if (goal && goal.id && goal.topic) {
          const dayIndex = computeDayIndex(goal.created_at || new Date().toISOString());
          let lessonTitle = `Day ${dayIndex}`;
          let lessonSnippet = "Click to start learning";
          let estMinutes: number | undefined;
          let hasLesson = false;


          // Try to extract lesson data from plan_json if it exists
          if (goal.plan_json) {
            try {
              const plan = goal.plan_json as unknown as PlanData;
              const flatDays = (plan.modules || []).flatMap((m: PlanModule) => m.days || []);
              
              const day = flatDays.find((d: PlanDay) => d.day_index === dayIndex);
              if (day) {
                lessonTitle = day.topic || `Day ${dayIndex}`;
                lessonSnippet = snippet(day.objective || day.practice || day.assessment || "");
                estMinutes = day.est_minutes;
                hasLesson = true;
                
              }
            } catch (error) {
              // Error processing plan_json, continue with default values
            }
          }

          items.push({
            goalId: goal.id,
            goalTopic: goal.topic,
            dayIndex,
            lessonTitle,
            lessonSnippet,
            estMinutes,
            hasLesson,
          });
        }
      });

      setDashboardItems(items);
      setItemsLoading(false);
    } else {
      setDashboardItems([]);
      setItemsLoading(false);
    }
  }, [safeGoals]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
        <div className="space-y-8 pt-8">
          {/* Header skeleton */}
          <div className="mb-6 sm:mb-8">
            <div className="h-6 sm:h-8 w-48 sm:w-64 bg-[var(--bg)]/50 rounded-3xl animate-pulse mb-2" />
            <div className="h-4 sm:h-5 w-72 sm:w-96 bg-[var(--bg)]/50 rounded-3xl animate-pulse" />
          </div>

          {/* Stats skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 sm:mb-8">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-[var(--bg)]/50 border border-[var(--border)]/40 rounded-3xl p-6 backdrop-blur-sm">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 bg-[var(--bg)]/50 rounded-2xl animate-pulse" />
                  <div>
                    <div className="h-6 w-12 bg-[var(--bg)]/50 rounded animate-pulse mb-1" />
                    <div className="h-4 w-20 bg-[var(--bg)]/50 rounded animate-pulse" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Today's Lessons skeleton */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-36 sm:h-8 w-48 bg-[var(--bg)]/50 rounded-3xl animate-pulse" />
              <div className="h-4 w-24 sm:h-5 w-32 bg-[var(--bg)]/50 rounded-3xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {Array.from({ length: 2 }).map((_, i) => (
                <LoadingState key={i} type="lesson" />
              ))}
            </div>
          </div>

          {/* Active Goals skeleton */}
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between mb-6">
              <div className="h-6 w-36 sm:h-8 w-48 bg-[var(--bg)]/50 rounded-3xl animate-pulse" />
              <div className="h-10 w-24 sm:h-12 w-32 bg-[var(--bg)]/50 rounded-3xl animate-pulse" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 3 }).map((_, i) => (
                <LoadingState key={i} type="goal" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
        <div className="pt-8">
          <ErrorState
            title="Dashboard Error"
            message={error?.message || "Failed to load dashboard"}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  // Calculate total streak from all goals
  const totalStreak = safeGoals.reduce((sum, goal) => sum + (goal.currentStreak || 0), 0);
  const completedToday = safeGoals.length; // TODO: Calculate from progress data
  const totalEstimatedTime = safeGoals.length * 15; // TODO: Calculate actual time

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 pt-8">
        {/* Clean Header Design */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <header className="relative overflow-hidden rounded-2xl bg-gradient-fresh p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300">
                <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-yellow-100 drop-shadow-sm">AI-Powered Learning</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Welcome back! 👋
              </h1>
              <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                Continue your learning journey with today&apos;s personalized lessons
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="text-center p-4 rounded-2xl bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-yellow-200">{totalStreak}</div>
                <div className="text-white/80 text-sm font-medium">Day Streak</div>
              </div>
              <div className="text-center p-4 rounded-2xl bg-white/30 backdrop-blur-sm hover:bg-white/40 transition-all duration-300">
                <div className="text-3xl md:text-4xl font-bold text-green-200">{completedToday}</div>
                <div className="text-white/80 text-sm font-medium">Active Goals</div>
              </div>
            </div>
          </div>
          </header>
        </section>

        {/* Stats Cards - Compact Metric Design */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Goals Card */}
          <div className="group relative rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">{safeGoals.length}</div>
                  <div className="text-sm font-medium text-blue-600 dark:text-blue-400">Active Goals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Today's Lessons Card */}
          <div className="group relative rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-emerald-800 dark:text-emerald-200">{completedToday}</div>
                  <div className="text-sm font-medium text-emerald-600 dark:text-emerald-400">Today&apos;s Lessons</div>
                </div>
              </div>
            </div>
          </div>

          {/* Time Today Card */}
          <div className="group relative rounded-2xl bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-purple-800 dark:text-purple-200">{totalEstimatedTime}</div>
                  <div className="text-sm font-medium text-purple-600 dark:text-purple-400">Minutes Today</div>
                </div>
              </div>
            </div>
          </div>

          {/* Learning Streak Card */}
          <div className="group relative rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20 border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center">
                  <Flame className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-2xl font-bold text-orange-800 dark:text-orange-200">{totalStreak}</div>
                  <div className="text-sm font-medium text-orange-600 dark:text-orange-400">Day Streak</div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </section>

        {/* Today's Lessons */}
        {dashboardItems.length > 0 ? (
          <section aria-labelledby="lessons-heading" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 space-y-6">
            {/* Clean Header Design */}
            <div className="relative rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 p-6 shadow-lg border-0">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 id="lessons-heading" className="text-4xl font-bold text-indigo-800 dark:text-indigo-200 mb-3">
                    Today&apos;s Lessons ✨
                  </h2>
                  <p className="text-indigo-600 dark:text-indigo-300 text-xl font-medium">
                    Your personalized learning path for today
                  </p>
                </div>
              </div>
            </div>
            
            {itemsLoading ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {Array.from({ length: 2 }).map((_, i) => (
                  <LoadingState key={i} type="lesson" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {dashboardItems.map((item) => (
                  <Link key={item.goalId} href={`/app/plans/${item.goalId}/lesson`} className="block group">
                    <div className="group relative h-full rounded-3xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-200/50 dark:border-blue-700/50 flex flex-col">
                      
                      <div className="relative p-6 space-y-6 flex-1 flex flex-col">
                        {/* Header */}
                        <div className="space-y-4">
                          {/* Topic and Day Info */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/30 px-4 py-2 rounded-full">
                              <Target className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                              <span className="font-medium">{item.goalTopic}</span>
                              <span className="text-blue-400 dark:text-blue-500">•</span>
                              <span className="font-semibold text-blue-800 dark:text-blue-200">Day {item.dayIndex}</span>
                              {item.estMinutes && (
                                <>
                                  <span className="text-blue-400 dark:text-blue-500">•</span>
                                  <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                                    <Clock className="w-4 h-4" />
                                    {item.estMinutes} min
                                  </span>
                                </>
                              )}
                            </div>
                            
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-300 group-hover:scale-105">
                              <Play className="h-8 w-8 text-white" />
                            </div>
                          </div>
                          
                          {/* Lesson Title */}
                          <div>
                            <h3 className="text-xl font-semibold text-blue-800 dark:text-blue-200 group-hover:text-blue-700 dark:group-hover:text-blue-100 transition-colors leading-tight">
                              {item.lessonTitle}
                            </h3>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          {item.lessonSnippet && (
                            <div className="bg-blue-100 dark:bg-blue-900/30 rounded-2xl p-5">
                              <p className="text-blue-700 dark:text-blue-300 leading-relaxed line-clamp-3 text-sm">
                                {item.lessonSnippet}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Footer with status and actions */}
                        <div className="space-y-4 mt-auto">
                          {/* Status */}
                          <div className="flex items-center justify-between">
                            {!item.hasLesson ? (
                              <div className="flex items-center gap-2 text-sm text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded-full">
                                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                                <span>Lesson not generated yet</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2 text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 px-4 py-2 rounded-full">
                                <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                                <span>Ready to start</span>
                              </div>
                            )}
                            
                            <div className="flex items-center gap-2 text-sm text-blue-600 dark:text-blue-400 group-hover:text-blue-700 dark:group-hover:text-blue-300 transition-colors font-medium px-3 py-2 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30">
                              <span>Start learning</span>
                              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                          </div>
                          
                          {/* Lesson variety note */}
                          {item.hasLesson && (
                            <div className="flex items-center gap-2 text-xs text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30 px-4 py-3 rounded-xl">
                              <Target className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                              <span>Planned curriculum • Progressive learning</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </section>
        ) : safeGoals.length > 0 ? (
          // Goals exist but no lesson data
          <section aria-labelledby="lessons-heading" className="relative space-y-6">
            {/* Enhanced Header with Modern Glassmorphic Design */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
              {/* Enhanced animated background elements */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-brand/30 via-purple-500/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-purple-400/30 via-indigo-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-brand/20 to-purple-500/20 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
              
              <div className="relative z-10 flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-brand via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-brand/25">
                  <BookOpen className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 id="lessons-heading" className="text-4xl font-bold bg-gradient-to-r from-[var(--fg)] via-brand to-purple-600 bg-clip-text text-transparent mb-3">
                    Today&apos;s Lessons ✨
                  </h2>
                  <p className="text-[var(--fg)]/80 text-xl font-medium">
                    Your personalized learning path for today
                  </p>
                </div>
              </div>
            </div>
            
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10">
              {/* Enhanced animated background elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-br from-brand/15 to-purple-500/15 rounded-full blur-xl group-hover:scale-200 transition-transform duration-700" style={{animationDelay: '0.5s'}} />
              
              <div className="relative text-center py-16 px-6">
                <div className="w-24 h-24 bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-brand/25">
                  <Target className="h-12 w-12 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-[var(--fg)] mb-3">Goals found but no learning plans yet</h3>
                <p className="text-[var(--fg)]/70 mb-6 max-w-md mx-auto">
                  You have {safeGoals.length} learning goal{safeGoals.length === 1 ? '' : 's'}, but they don&apos;t have learning plans yet. Click on any goal below to generate your first lesson.
                </p>
                <div className="text-xs text-[var(--fg)]/40 bg-white/10 dark:bg-white/5 p-3 rounded-xl border border-white/20 dark:border-white/10 backdrop-blur-sm max-w-md mx-auto">
                  Debug: Found {safeGoals.length} goals but no lesson titles. This usually means the goals don&apos;t have plan_json data or the day calculation is off.
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {/* Active Goals */}
        <section aria-labelledby="goals-heading" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 space-y-6">
          {/* Clean Header Design */}
          <div className="relative rounded-2xl bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-6 shadow-lg border-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <div>
                  <h2 id="goals-heading" className="text-4xl font-bold text-emerald-800 dark:text-emerald-200 mb-3">
                    Your Learning Goals 🎯
                  </h2>
                  <p className="text-emerald-600 dark:text-emerald-300 text-xl font-medium">
                    Track your progress and achieve your learning objectives
                  </p>
                </div>
              </div>
              <Button 
                className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl px-6 py-3" 
                asChild
              >
                <Link href="/app/create">
                  <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                  New Goal
                </Link>
              </Button>
            </div>
          </div>
          
          {safeGoals.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {safeGoals.map((goal) => {
                if (!goal || typeof goal !== 'object' || !goal.id) {
                  console.warn("Invalid goal in dashboard:", goal);
                  return null;
                }
                return <GoalCard key={goal.id} goal={goal} />;
              }).filter(Boolean)}
            </div>
          ) : (
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-blue-950/30 dark:via-blue-900/20 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-800/30 hover:shadow-2xl hover:scale-105 transition-all duration-500">
              {/* Animated background elements */}
              <div className="absolute -top-8 -right-8 w-32 h-32 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />
              
              <div className="relative p-12 text-center">
                <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-xl group-hover:shadow-2xl group-hover:scale-110 transition-all duration-300">
                  <Target className="h-12 w-12 text-white" aria-hidden="true" />
                </div>
                <h3 className="text-2xl font-bold mb-3 text-blue-900 dark:text-blue-100">Ready to start learning?</h3>
                <p className="text-blue-700 dark:text-blue-200 mb-6 max-w-md mx-auto leading-relaxed">
                  Create your first learning goal and begin your journey to mastering new skills
                </p>
                <Button 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl px-6 py-3" 
                  asChild
                >
                  <Link href="/app/create">
                    <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                    Create Your First Goal
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Quick Actions */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-brand" />
            <h2 className="text-2xl font-bold text-[var(--fg)]">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Create New Goal Card */}
            <Link 
              href="/app/create"
              className="group relative rounded-3xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-indigo-500 rounded-2xl flex items-center justify-center mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2">Create New Goal</h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-200 leading-relaxed">Start learning a new skill with AI guidance</p>
              </div>
            </Link>

            {/* View All Plans Card */}
            <Link 
              href="/app/plans"
              className="group relative rounded-3xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">View All Plans</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-200 leading-relaxed">See your learning progress and plans</p>
              </div>
            </Link>

            {/* Flashcards Card */}
            <Link 
              href="/app/flashcards"
              className="group relative rounded-3xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-purple-500 rounded-2xl flex items-center justify-center mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Flashcards</h3>
                <p className="text-sm text-purple-700 dark:text-purple-200 leading-relaxed">Master concepts with spaced repetition</p>
              </div>
            </Link>

            {/* Learning History Card */}
            <Link 
              href="/app/history"
              className="group relative rounded-3xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-800 hover:shadow-lg transition-all duration-300"
            >
              <div className="p-6">
                <div className="w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">Learning History</h3>
                <p className="text-sm text-orange-700 dark:text-orange-200 leading-relaxed">Track your achievements and progress</p>
              </div>
            </Link>
          </div>
          </div>
        </section>

        {/* Motivation Section */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-indigo-600 p-8 text-center text-white shadow-2xl">
            {/* Animated background elements */}
            <div className="absolute -top-8 -right-8 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse" />
            <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white/5 rounded-full blur-md animate-pulse" style={{animationDelay: '2s'}} />
            
            <div className="relative z-10 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">
                Ready to crush today&apos;s goals? 🚀
              </h2>
              <p className="text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
                Every lesson brings you closer to mastery. Keep up the great work and maintain your learning streak!
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
                <Link 
                  href="/app/plans"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-purple-700 font-semibold rounded-2xl hover:bg-purple-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  View All Plans
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/app/flashcards"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-pink-700 font-semibold rounded-2xl hover:bg-pink-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Study Flashcards
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link 
                  href="/app/create"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-semibold rounded-2xl hover:from-indigo-600 hover:to-purple-700 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                >
                  Add New Goal
                </Link>
              </div>
            </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  );
}

 