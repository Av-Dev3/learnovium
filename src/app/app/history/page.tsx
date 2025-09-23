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
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 mb-8">
            <h2 id="stats-heading" className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
              <BarChart3 className="h-6 w-6 text-brand" aria-hidden="true" />
              Overall Learning Statistics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{overallStats.totalProgress}</p>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Lessons</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <CheckCircle className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{overallStats.completedProgress}</p>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
                  </div>
                </div>
              </div>
              
              <div className="p-6 rounded-3xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Award className="h-7 w-7 text-white" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{overallStats.averageScore}%</p>
                    <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Avg Score</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Goals History */}
      <section aria-labelledby="history-heading">
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <h2 id="history-heading" className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-6 flex items-center gap-3">
            <HistoryIcon className="h-6 w-6 text-brand" aria-hidden="true" />
            Learning Goals History
          </h2>
          {hasProgress ? (
            <div className="space-y-6">
              {Object.entries(progressByGoal).map(([goalId, data]: [string, GoalProgress]) => (
                <article key={goalId} className="p-6 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <div className="flex items-start justify-between mb-4">
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200">{data.goal.topic}</h3>
                      <p className="text-slate-600 dark:text-slate-400 text-sm">{data.goal.focus}</p>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Target className="h-4 w-4" aria-hidden="true" />
                          {data.completedLessons}/{data.totalLessons} lessons
                        </span>
                        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                          <Award className="h-4 w-4" aria-hidden="true" />
                          {Math.round(data.averageScore)}% avg
                        </span>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className="px-4 py-2 text-sm font-semibold border-2 border-slate-200 dark:border-slate-600 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                    >
                      {Math.round((data.completedLessons / data.totalLessons) * 100)}% complete
                    </Badge>
                  </div>

                  {/* Recent Progress */}
                  <div className="space-y-3">
                    <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-300">Recent Activity</h4>
                    <div className="space-y-2">
                      {data.progress
                        .filter((p) => p.completed_at)
                        .sort((a, b) => new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime())
                        .slice(0, 3)
                        .map((p, index: number) => (
                          <div key={p.id} className="flex items-center justify-between text-sm p-3 bg-slate-50/80 dark:bg-slate-600/50 rounded-xl backdrop-blur-sm">
                            <div className="flex items-center gap-3">
                              <CheckCircle className="h-4 w-4 text-green-600" aria-hidden="true" />
                              <span className="font-medium text-slate-700 dark:text-slate-300">Lesson {index + 1}</span>
                            </div>
                            <div className="flex items-center gap-4 text-slate-500 dark:text-slate-400">
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
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center shadow-xl mb-6">
                <HistoryIcon className="h-12 w-12 text-white" aria-hidden="true" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">No learning history yet</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 max-w-md mx-auto">
                Complete your first lesson to start building your history
              </p>
              <Button 
                className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl" 
                asChild
              >
                <a href="/app">
                  <Target className="h-5 w-5 mr-2" aria-hidden="true" />
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