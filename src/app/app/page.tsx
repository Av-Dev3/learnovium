"use client";

export const dynamic = "force-dynamic";

import { LessonCard } from "@/components/ui/lesson-card";
import { GoalCard } from "@/components/ui/goal-card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Plus, Target, TrendingUp, Calendar } from "lucide-react";
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
      <div className="space-y-4 sm:space-y-6">
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-6 sm:h-8 w-48 sm:w-64 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 sm:h-5 w-72 sm:w-96 bg-muted rounded animate-pulse" />
        </div>

        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <div className="h-6 w-6 sm:h-8 sm:w-8 bg-muted rounded animate-pulse" />
                <div>
                  <div className="h-4 w-12 sm:h-6 sm:w-16 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-3 w-16 sm:h-4 sm:w-20 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Today's Lessons skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="h-5 w-36 sm:h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="h-3 w-24 sm:h-4 w-32 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {Array.from({ length: 2 }).map((_, i) => (
              <LoadingState key={i} type="lesson" />
            ))}
          </div>
        </div>

        {/* Active Goals skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <div className="h-5 w-36 sm:h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="h-8 w-20 sm:h-10 w-24 bg-muted rounded animate-pulse" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <LoadingState key={i} type="goal" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Dashboard Error"
        message={error?.message || "Failed to load dashboard"}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const totalStreak = 0; // TODO: Calculate from progress data
  const completedToday = 0; // TODO: Calculate from progress data

  return (
    <div className="space-y-8">
      {/* Modern Header with Gradient */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 p-8 text-white">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-white/10 opacity-30" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1),transparent_50%)]" />
        
        <div className="relative z-10">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-3 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Welcome back! 👋
              </h1>
              <p className="text-blue-100 text-lg mb-4">
                Continue your learning journey with today&apos;s lessons
              </p>
            </div>
            <div className="hidden sm:flex items-center space-x-6">
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{totalStreak}</div>
                <div className="text-blue-200 text-sm">Day Streak</div>
              </div>
              <div className="text-center">
                <div className="text-2xl sm:text-3xl font-bold">{completedToday}</div>
                <div className="text-blue-200 text-sm">Completed Today</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-card border rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Target className="h-3 w-3 sm:h-4 sm:w-4 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-foreground">{safeGoals.length}</div>
              <div className="text-sm text-muted-foreground">Active Goals</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-foreground">{totalStreak}</div>
              <div className="text-sm text-muted-foreground">Day Streak</div>
            </div>
          </div>
        </div>
        
        <div className="bg-card border rounded-lg p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center">
              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-white" aria-hidden="true" />
            </div>
            <div>
              <div className="text-lg sm:text-xl font-bold text-foreground">{completedToday}</div>
              <div className="text-sm text-muted-foreground">Completed Today</div>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Lessons */}
      {safeGoals.length > 0 && (
        <section aria-labelledby="lessons-heading" className="relative">
          <div className="mb-6 sm:mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h2 id="lessons-heading" className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                  Today&apos;s Lessons ✨
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {safeGoals.length} lesson{safeGoals.length !== 1 ? 's' : ''} ready for you
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-sm text-green-600 font-medium">Active</span>
              </div>
            </div>
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
      <section aria-labelledby="goals-heading" className="relative">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 id="goals-heading" className="text-2xl sm:text-3xl font-bold mb-2 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 dark:from-white dark:via-gray-200 dark:to-white bg-clip-text text-transparent">
                Your Learning Goals 🎯
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                Track your progress and achieve your learning objectives
              </p>
            </div>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
              <Link href="/app/create">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                New Goal
              </Link>
            </Button>
          </div>
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 border border-gray-200 dark:border-gray-700 p-12 text-center">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(59,130,246,0.1),transparent_50%)]" />
            <div className="relative z-10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-xl">
                <Target className="h-10 w-10 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">Ready to start learning?</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                Create your first learning goal and begin your journey to mastering new skills
              </p>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
                <Link href="/app/create">
                  <Plus className="h-5 w-5 mr-2" aria-hidden="true" />
                  Create Your First Goal
                </Link>
              </Button>
            </div>
          </div>
        )}
      </section>
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
      <div className="bg-card border rounded-lg p-4 sm:p-6 text-center">
        <Target className="h-10 w-10 sm:h-12 sm:w-12 text-muted-foreground mx-auto mb-3" aria-hidden="true" />
        <h3 className="text-base sm:text-lg font-semibold mb-2">{goal.topic}</h3>
        <p className="text-muted-foreground mb-4 text-sm sm:text-base">
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