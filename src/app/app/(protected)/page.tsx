"use client";

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
            <div className="h-5 w-36 sm:h-6 sm:w-48 bg-muted rounded animate-pulse" />
            <div className="h-3 w-24 sm:h-4 sm:w-32 bg-muted rounded animate-pulse" />
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
            <div className="h-5 w-36 sm:h-6 sm:w-48 bg-muted rounded animate-pulse" />
            <div className="h-8 w-20 sm:h-10 sm:w-24 bg-muted rounded animate-pulse" />
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
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Welcome back!</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Continue your learning journey with today&apos;s lessons
        </p>
      </header>

      {/* Stats */}
      <section aria-labelledby="stats-heading">
        <h2 id="stats-heading" className="sr-only">Learning Statistics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="bg-card border rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" aria-hidden="true" />
              <div>
                <p className="text-xl sm:text-2xl font-bold">{goals.length}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Active Goals</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" aria-hidden="true" />
              <div>
                <p className="text-xl sm:text-2xl font-bold">{totalStreak}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total Streak</p>
              </div>
            </div>
          </div>
          
          <div className="bg-card border rounded-lg p-3 sm:p-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-orange-600" aria-hidden="true" />
              <div>
                <p className="text-xl sm:text-2xl font-bold">{completedToday}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Completed Today</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Today's Lessons */}
      {goals.length > 0 && (
        <section aria-labelledby="lessons-heading">
          <div className="mb-4 sm:mb-6">
            <h2 id="lessons-heading" className="text-xl sm:text-2xl font-semibold mb-2">Today&apos;s Lessons</h2>
            <p className="text-sm text-muted-foreground">
              {goals.length} lesson{goals.length !== 1 ? 's' : ''} available
            </p>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {goals.map((goal) => (
              <GoalLessonCard key={goal.id} goal={goal} />
            ))}
          </div>
        </section>
      )}

      {/* Active Goals */}
      <section aria-labelledby="goals-heading">
        <div className="mb-4 sm:mb-6">
          <h2 id="goals-heading" className="text-xl sm:text-2xl font-semibold mb-2">Your Learning Goals</h2>
          <Button asChild>
            <Link href="/app/create">
              <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
              New Goal
            </Link>
          </Button>
        </div>
        
        {goals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {goals.map((goal) => (
              <GoalCard key={goal.id} goal={goal} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <Target className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-2">No goals yet</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Create your first learning goal to get started
            </p>
            <Button asChild>
              <Link href="/app/create">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                Create Your First Goal
              </Link>
            </Button>
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