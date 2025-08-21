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
import { useLesson } from "@/app/lib/hooks";

export default function Dashboard() {
  const { goals, isLoading, isError, error } = useGoals();

  // Ensure goals is always an array
  const safeGoals = Array.isArray(goals) ? goals : [];

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

  const totalStreak = 7; // TODO: Calculate from progress data
  const completedToday = safeGoals.length; // TODO: Calculate from progress data
  const totalEstimatedTime = safeGoals.length * 15; // TODO: Calculate actual time

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
      <div className="space-y-8 pt-8">
        {/* Modern Header with Glassmorphic Design */}
        <header className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-purple-600 to-brand p-8 text-white shadow-2xl">
          {/* Background effects */}
          <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 border border-white/20 bg-white/10 backdrop-blur-md">
                  <Sparkles className="w-5 h-5 text-yellow-200" />
                  <span className="text-sm font-semibold">AI-Powered Learning</span>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                  Welcome back! 👋
                </h1>
                <p className="text-xl text-blue-100 max-w-2xl leading-relaxed">
                  Continue your learning journey with today&apos;s personalized lessons
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-yellow-200">{totalStreak}</div>
                  <div className="text-blue-200 text-sm font-medium">Day Streak</div>
                </div>
                <div className="text-center p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <div className="text-3xl md:text-4xl font-bold text-green-200">{completedToday}</div>
                  <div className="text-blue-200 text-sm font-medium">Active Goals</div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Modern Stats Grid with New Design */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Active Goals Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-50 via-blue-100 to-indigo-100 dark:from-blue-950/30 dark:via-blue-900/20 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-800/30 hover:shadow-2xl hover:scale-105 transition-all duration-500">
            {/* Animated background elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Target className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{safeGoals.length}</div>
                  <div className="text-xs font-medium text-blue-600 dark:text-blue-300 uppercase tracking-wider">Goals</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">Active Goals</h3>
              <p className="text-sm text-blue-700 dark:text-blue-200 leading-relaxed">Your current learning objectives and progress</p>
            </div>
          </div>

          {/* Today's Lessons Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:via-emerald-900/20 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-800/30 hover:shadow-2xl hover:scale-105 transition-all duration-500">
            {/* Animated background elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-emerald-900 dark:text-emerald-100">{completedToday}</div>
                  <div className="text-xs font-medium text-emerald-600 dark:text-emerald-300 uppercase tracking-wider">Lessons</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Today&apos;s Lessons</h3>
              <p className="text-sm text-emerald-700 dark:text-emerald-200 leading-relaxed">AI-powered content ready for you</p>
            </div>
          </div>

          {/* Time Estimate Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100 dark:from-purple-950/30 dark:via-purple-900/20 dark:to-violet-900/30 border border-purple-200/50 dark:border-purple-800/30 hover:shadow-2xl hover:scale-105 transition-all duration-500">
            {/* Animated background elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-violet-400/20 to-fuchsia-500/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Clock className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{totalEstimatedTime}</div>
                  <div className="text-xs font-medium text-purple-600 dark:text-purple-300 uppercase tracking-wider">Minutes</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2">Time Today</h3>
              <p className="text-sm text-purple-700 dark:text-purple-200 leading-relaxed">Estimated learning time for today</p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 dark:from-orange-950/30 dark:via-orange-900/20 dark:to-amber-900/30 border border-orange-200/50 dark:border-orange-800/30 hover:shadow-2xl hover:scale-105 transition-all duration-500">
            {/* Animated background elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />
            
            <div className="relative p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                  <Flame className="h-7 w-7 text-white" />
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{totalStreak}</div>
                  <div className="text-xs font-medium text-orange-600 dark:text-orange-300 uppercase tracking-wider">Days</div>
                </div>
              </div>
              <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2">Learning Streak</h3>
              <p className="text-sm text-orange-700 dark:text-orange-200 leading-relaxed">Keep the momentum going strong</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-brand" />
            <h2 className="text-2xl font-bold text-[var(--fg)]">Quick Actions</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Create New Goal Card */}
            <Link 
              href="/app/create"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-50 via-indigo-100 to-purple-100 dark:from-indigo-950/30 dark:via-indigo-900/20 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-800/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-indigo-400/60"
            >
              {/* Animated background elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-indigo-400/20 to-purple-500/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-purple-400/20 to-pink-500/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />
              
              <div className="relative p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 mb-4">
                  <Plus className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-indigo-900 dark:text-indigo-100 mb-2 group-hover:text-indigo-700 dark:group-hover:text-indigo-200 transition-colors">Create New Goal</h3>
                <p className="text-sm text-indigo-700 dark:text-indigo-200 leading-relaxed">Start learning a new skill with AI guidance</p>
              </div>
            </Link>

            {/* View All Plans Card */}
            <Link 
              href="/app/plans"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-50 via-emerald-100 to-teal-100 dark:from-emerald-950/30 dark:via-emerald-900/20 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-800/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-emerald-400/60"
            >
              {/* Animated background elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-teal-400/20 to-cyan-500/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />
              
              <div className="relative p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 mb-4">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-emerald-900 dark:text-emerald-100 mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-200 transition-colors">View All Plans</h3>
                <p className="text-sm text-emerald-700 dark:text-emerald-200 leading-relaxed">See your learning progress and plans</p>
              </div>
            </Link>

            {/* Flashcards Card */}
            <Link 
              href="/app/flashcards"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100 dark:from-purple-950/30 dark:via-purple-900/20 dark:to-violet-900/30 border border-purple-200/50 dark:border-purple-800/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-purple-400/60"
            >
              {/* Animated background elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-violet-400/20 to-fuchsia-500/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />
              
              <div className="relative p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 mb-4">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-purple-900 dark:text-purple-100 mb-2 group-hover:text-purple-700 dark:group-hover:text-purple-200 transition-colors">Flashcards</h3>
                <p className="text-sm text-purple-700 dark:text-purple-200 leading-relaxed">Master concepts with spaced repetition</p>
              </div>
            </Link>

            {/* Learning History Card */}
            <Link 
              href="/app/history"
              className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-50 via-orange-100 to-amber-100 dark:from-orange-950/30 dark:via-orange-900/20 dark:to-amber-900/30 border border-orange-200/50 dark:border-orange-800/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-orange-400/60"
            >
              {/* Animated background elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-orange-400/20 to-amber-500/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700" />
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-yellow-500/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />
              
              <div className="relative p-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300 mb-4">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-orange-900 dark:text-orange-100 mb-2 group-hover:text-orange-700 dark:group-hover:text-orange-200 transition-colors">Learning History</h3>
                <p className="text-sm text-orange-700 dark:text-orange-200 leading-relaxed">Track your achievements and progress</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Today's Lessons */}
        {safeGoals.length > 0 && (
          <section aria-labelledby="lessons-heading" className="relative space-y-6">
            <div className="flex items-center gap-3">
              <BookOpen className="w-6 h-6 text-brand" />
              <h2 id="lessons-heading" className="text-2xl font-bold text-[var(--fg)]">
                Today&apos;s Lessons ✨
              </h2>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {safeGoals.map((goal) => {
                if (!goal || typeof goal !== 'object' || !goal.id) {
                  console.warn("Invalid goal in dashboard:", goal);
                  return null;
                }
                return <GoalLessonCard key={goal.id} goal={goal} />;
              }).filter(Boolean)}
            </div>
          </section>
        )}

        {/* Active Goals */}
        <section aria-labelledby="goals-heading" className="relative space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-2">
              <h2 id="goals-heading" className="text-2xl font-bold text-[var(--fg)]">
                Your Learning Goals 🎯
              </h2>
              <p className="text-[var(--fg)]/70">
                Track your progress and achieve your learning objectives
              </p>
            </div>
            <Button 
              className="bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl px-6 py-3" 
              asChild
            >
              <Link href="/app/create">
                <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                New Goal
              </Link>
            </Button>
          </div>
          
          {safeGoals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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

        {/* Motivation Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-purple-600 to-brand p-8 text-center text-white shadow-2xl">
          {/* Background effects */}
          <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to crush today&apos;s goals? 🚀
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Every lesson brings you closer to mastery. Keep up the great work and maintain your learning streak!
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
                  href="/app/flashcards"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-brand font-semibold rounded-2xl hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Study Flashcards
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
    </div>
  );
}

// Component to render a goal with its lesson
function GoalLessonCard({ goal }: { goal: { id: string; topic: string } }) {
  const { lesson, isLoading, isError } = useLesson(goal.id);

  if (isLoading) {
    return <LoadingState type="lesson" />;
  }

  if (isError || !lesson) {
    return (
      <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm text-center hover:shadow-lg transition-all duration-300">
        <div className="w-16 h-16 bg-gradient-to-br from-[var(--border)] to-[var(--border)]/60 rounded-full flex items-center justify-center mx-auto mb-4">
          <Target className="h-8 w-8 text-[var(--fg)]/40" aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold mb-2 text-[var(--fg)]">{goal.topic}</h3>
        <p className="text-[var(--fg)]/70 mb-4">
          No lesson available for today
        </p>
        <MarkCompleteButton 
          goalId={goal.id} 
          variant="outline" 
          size="sm"
        />
      </div>
    );
  }

  return (
    <LessonCard
      lesson={lesson}
      onComplete={(lessonId) => {
        // The MarkCompleteButton will handle completion
        console.log('Lesson completed:', lessonId);
      }}
    />
  );
} 