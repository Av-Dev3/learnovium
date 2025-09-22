"use client";

import { useMemo } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  History as HistoryIcon, 
  Target, 
  Calendar, 
  CheckCircle,
  Award,
  BarChart3
} from "lucide-react";
import { useProgress, useGoals } from "@/app/lib/hooks";

interface Goal {
  id: string;
  topic: string;
  focus: string;
  plan_version: number;
  created_at: string;
  user_id: string;
}

interface Progress {
  id: string;
  goal_id: string;
  lesson_id: string;
  score: number;
  time_spent: number;
  completed_at: string;
  user_id: string;
}

interface GoalProgress {
  goal: Goal;
  progress: Progress[];
  totalLessons: number;
  completedLessons: number;
  averageScore: number;
  lastCompleted: Progress | undefined;
}

export default function History() {
  const { progress, isLoading: progressLoading, isError: progressError, error: progressErrorMsg } = useProgress();
  const { goals, isLoading: goalsLoading } = useGoals();
  
  // Ensure arrays are always defined
  const safeProgress = useMemo(() => Array.isArray(progress) ? progress : [], [progress]);
  const safeGoals = useMemo(() => Array.isArray(goals) ? goals : [], [goals]);
  
  const isLoading = progressLoading || goalsLoading;
  const isError = progressError;

  // Group progress by goal
  const progressByGoal = useMemo(() => {
    if (!safeProgress || !safeGoals) return {};
    
    const grouped: Record<string, GoalProgress> = {};
    
    safeGoals.forEach(goal => {
      if (!goal || typeof goal !== 'object' || !goal.id) {
        console.warn("Invalid goal in history:", goal);
        return;
      }
      const goalProgress = safeProgress.filter(p => p && p.goal_id === goal.id);
      if (goalProgress.length > 0) {
        grouped[goal.id] = {
          goal,
          progress: goalProgress,
          totalLessons: goalProgress.length,
          completedLessons: goalProgress.filter(p => p.completed_at).length,
          averageScore: goalProgress.reduce((sum, p) => sum + p.score, 0) / goalProgress.length,
          lastCompleted: goalProgress
            .filter(p => p.completed_at)
            .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())[0]
        };
      }
    });
    
    return grouped;
  }, [safeProgress, safeGoals]);

  // Calculate overall stats
  const overallStats = useMemo(() => {
    if (!safeProgress || !safeGoals) return null;
    
    const totalProgress = safeProgress.length;
    const completedProgress = safeProgress.filter(p => p && p.completed_at).length;
    const averageScore = safeProgress.reduce((sum, p) => sum + (p ? p.score : 0), 0) / totalProgress;
    
    return {
      totalProgress,
      completedProgress,
      averageScore: Math.round(averageScore)
    };
  }, [safeProgress, safeGoals]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12 pt-8">
          {/* Header skeleton */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-fresh p-8 text-white shadow-lg">
              <div className="h-6 sm:h-8 w-36 sm:w-48 bg-white/30 rounded animate-pulse mb-2" />
              <div className="h-4 sm:h-5 w-64 sm:w-80 bg-white/30 rounded animate-pulse" />
            </div>
          </section>

        {/* Overall Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
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

        {/* Goals History skeleton */}
        <div className="space-y-4 sm:space-y-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <LoadingState key={i} type="list" />
          ))}
        </div>
        </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <ErrorState
          title="History Error"
          message={progressErrorMsg?.message || "Failed to load learning history"}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  const hasProgress = overallStats && overallStats.totalProgress > 0;

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
                <HistoryIcon className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-yellow-100 drop-shadow-sm">Learning History</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Learning History 📚
              </h1>
              <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                Track your progress and celebrate your achievements
              </p>
            </div>
          </div>
          </header>
        </section>

      {/* Overall Stats */}
      {overallStats && (
        <section aria-labelledby="stats-heading">
          <h2 id="stats-heading" className="sr-only">Overall Learning Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="bg-card border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" aria-hidden="true" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{overallStats.totalProgress}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Lessons</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" aria-hidden="true" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{overallStats.completedProgress}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Completed</p>
                </div>
              </div>
            </div>
            
            <div className="bg-card border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-3">
                <Award className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" aria-hidden="true" />
                <div>
                  <p className="text-xl sm:text-2xl font-bold">{overallStats.averageScore}%</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Avg Score</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Goals History */}
      <section aria-labelledby="history-heading">
        <h2 id="history-heading" className="sr-only">Learning Goals History</h2>
        {hasProgress ? (
          <div className="space-y-4 sm:space-y-6">
            {Object.entries(progressByGoal).map(([goalId, data]: [string, GoalProgress]) => (
              <article key={goalId} className="bg-card border rounded-lg p-4 sm:p-6">
                <div className="flex items-start justify-between mb-3 sm:mb-4">
                  <div>
                    <h3 className="text-base sm:text-lg font-semibold mb-1">{data.goal.topic}</h3>
                    <p className="text-muted-foreground mb-2 text-sm">{data.goal.focus}</p>
                    <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm">
                      <span className="flex items-center gap-1">
                        <Target className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                        {data.completedLessons}/{data.totalLessons} lessons
                      </span>
                      <span className="flex items-center gap-1">
                        <Award className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                        {Math.round(data.averageScore)}% avg
                      </span>
                    </div>
                  </div>
                  <Badge variant="outline">
                    {Math.round((data.completedLessons / data.totalLessons) * 100)}% complete
                  </Badge>
                </div>

                {/* Recent Progress */}
                <div className="space-y-2 sm:space-y-3">
                  <h4 className="text-xs sm:text-sm font-medium text-muted-foreground">Recent Activity</h4>
                  <div className="space-y-2">
                    {data.progress
                      .filter((p) => p.completed_at)
                      .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
                      .slice(0, 3)
                      .map((p, index: number) => (
                        <div key={p.id} className="flex items-center justify-between text-xs sm:text-sm p-2 bg-muted/50 rounded">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" aria-hidden="true" />
                            <span>Lesson {index + 1}</span>
                          </div>
                          <div className="flex items-center gap-3 sm:gap-4 text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Award className="h-2 w-2 sm:h-3 sm:w-3" aria-hidden="true" />
                              {p.score || 0}%
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-2 w-2 sm:h-3 sm:w-3" aria-hidden="true" />
                              {new Date(p.completed_at).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 sm:py-12">
            <HistoryIcon className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" aria-hidden="true" />
            <h3 className="text-lg font-semibold mb-2">No learning history yet</h3>
            <p className="text-muted-foreground mb-4 text-sm sm:text-base">
              Complete your first lesson to start building your history
            </p>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
              <a href="/app">
                <Target className="h-4 w-4 mr-2" aria-hidden="true" />
                Start Learning
              </a>
            </Button>
          </div>
        )}
      </section>
        </div>
      </div>
    </div>
  );
}