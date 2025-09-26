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
          <div className="space-y-6 sm:space-y-8 lg:space-y-12 pt-4 sm:pt-6 lg:pt-8">
          {/* Header skeleton */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
            <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-fresh p-4 sm:p-6 lg:p-8 text-white shadow-lg">
              <div className="h-5 sm:h-6 lg:h-8 w-28 sm:w-36 lg:w-48 bg-white/30 rounded animate-pulse mb-2" />
              <div className="h-3 sm:h-4 lg:h-5 w-48 sm:w-64 lg:w-80 bg-white/30 rounded animate-pulse" />
            </div>
          </section>

        {/* Overall Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-card border rounded-lg p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-5 w-5 sm:h-6 sm:w-6 lg:h-8 lg:w-8 bg-muted rounded animate-pulse" />
                <div>
                  <div className="h-3 w-10 sm:h-4 sm:w-12 lg:h-6 lg:w-16 bg-muted rounded animate-pulse mb-1" />
                  <div className="h-2 w-12 sm:h-3 sm:w-16 lg:h-4 lg:w-20 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Goals History skeleton */}
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
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
        <div className="space-y-6 sm:space-y-8 lg:space-y-12 pt-4 sm:pt-6 lg:pt-8">
        {/* Clean Header Design */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
          <header className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-fresh p-4 sm:p-6 lg:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300">
                <HistoryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-yellow-100 drop-shadow-sm">Learning History</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Learning History 📚
              </h1>
              <p className="text-sm sm:text-base lg:text-xl text-white/90 max-w-2xl leading-relaxed">
                Track your progress and celebrate your achievements
              </p>
            </div>
          </div>
          </header>
        </section>

      {/* Overall Stats */}
      {overallStats && (
        <section aria-labelledby="stats-heading">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50 mb-6 sm:mb-8">
            <h2 id="stats-heading" className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
              <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-brand" aria-hidden="true" />
              Overall Learning Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200">{overallStats.totalProgress}</p>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Total Lessons</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200">{overallStats.completedProgress}</p>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3 sm:gap-4">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200">{overallStats.averageScore}%</p>
                    <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400">Avg Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Goals History */}
      <section aria-labelledby="history-heading">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
          <h2 id="history-heading" className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3">
            <HistoryIcon className="h-5 w-5 sm:h-6 sm:w-6 text-brand" aria-hidden="true" />
            Learning Goals History
          </h2>
          {hasProgress ? (
            <div className="space-y-4 sm:space-y-6">
              {Object.entries(progressByGoal).map(([goalId, data]: [string, GoalProgress]) => (
                <article key={goalId} className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
                    <div className="space-y-2 flex-1 min-w-0">
                      <h3 className="text-lg sm:text-xl font-bold text-slate-800 dark:text-slate-200 break-words">{data.goal.topic}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm break-words">{data.goal.focus}</p>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm">
                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Target className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                          {data.completedLessons}/{data.totalLessons} lessons
                        </span>
                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Award className="h-3 w-3 sm:h-4 sm:w-4" aria-hidden="true" />
                          {Math.round(data.averageScore)}% avg
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm font-semibold border-2 border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm self-start sm:self-auto"
                    >
                      {Math.round((data.completedLessons / data.totalLessons) * 100)}% complete
                    </Badge>
                  </div>

                  {/* Recent Progress */}
                  <div className="space-y-2 sm:space-y-3">
                    <h4 className="text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Activity</h4>
                    <div className="space-y-1 sm:space-y-2">
                      {data.progress
                        .filter((p) => p.completed_at)
                        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
                        .slice(0, 3)
                        .map((p, index: number) => (
                          <div key={p.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-xs sm:text-sm p-2 sm:p-3 bg-slate-50/80 dark:bg-slate-600/50 rounded-lg sm:rounded-xl backdrop-blur-sm gap-2 sm:gap-0">
                            <div className="flex items-center gap-2 sm:gap-3">
                              <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" aria-hidden="true" />
                              <span className="font-medium text-slate-700 dark:text-slate-300">Lesson {index + 1}</span>
                            </div>
                            <div className="flex items-center gap-2 sm:gap-4 text-slate-500 dark:text-slate-400">
                              <span className="flex items-center gap-1">
                                <Award className="h-3 w-3" aria-hidden="true" />
                                {p.score || 0}%
                              </span>
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" aria-hidden="true" />
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
            <div className="text-center py-8 sm:py-12 px-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center shadow-xl mb-4 sm:mb-6">
                <HistoryIcon className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">No learning history yet</h3>
              <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 mb-4 sm:mb-6 max-w-md mx-auto">
                Complete your first lesson to start building your history
              </p>
              <Button 
                className="h-10 sm:h-12 px-6 sm:px-8 text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl sm:rounded-2xl" 
                asChild
              >
                <a href="/app">
                  <Target className="h-4 w-4 sm:h-5 sm:w-5 mr-2" aria-hidden="true" />
                  Start Learning
                </a>
              </Button>
            </div>
          )}
        </div>
      </section>
        </div>
      </div>
    </div>
  );
}