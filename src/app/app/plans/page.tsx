"use client";

import { useState, useMemo } from "react";
import { GoalCard } from "@/components/ui/goal-card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Target, Search, Plus } from "lucide-react";
import Link from "next/link";
import { useGoals } from "@/app/lib/hooks";

export default function Plans() {
  const { goals, isLoading, isError, error } = useGoals();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent">("recent");

  // Use useMemo to compute filtered goals instead of useState + useEffect
  const filteredGoals = useMemo(() => {
    if (!goals || !Array.isArray(goals)) {
      return [];
    }

    const filtered = goals.filter(goal => {
      if (!goal || typeof goal !== 'object') {
        return false;
      }
      const topicMatch = goal.topic?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const focusMatch = goal.focus && goal.focus.toLowerCase().includes(searchTerm.toLowerCase());
      return topicMatch || focusMatch;
    });

    // Sort by recent
    if (sortBy === "recent") {
      filtered.sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA;
      });
    }

    return filtered;
  }, [goals, searchTerm, sortBy]);

  // Early return if still loading or if goals is not properly initialized
  if (isLoading || !goals || !Array.isArray(goals)) {
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

        {/* Controls skeleton */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <div className="relative flex-1">
            <div className="h-9 sm:h-10 w-full bg-muted rounded animate-pulse" />
          </div>
          <div className="h-9 sm:h-10 w-28 sm:w-32 bg-muted rounded animate-pulse" />
          <div className="h-9 sm:h-10 w-20 sm:w-24 bg-muted rounded animate-pulse" />
        </div>

        {/* Goals Grid skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <LoadingState key={i} type="goal" />
          ))}
        </div>

        {/* Summary Stats skeleton */}
        <div className="mt-8 sm:mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
          <div className="relative z-10">
            <div className="text-center mb-8">
              <div className="h-8 w-32 bg-muted rounded-full animate-pulse mx-auto mb-4" />
              <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto mb-2" />
              <div className="h-5 w-64 bg-muted rounded animate-pulse mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="group relative overflow-hidden rounded-2xl bg-white/10 dark:bg-white/5 p-6 backdrop-blur-sm border border-white/20 dark:border-white/10">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-muted rounded-2xl animate-pulse mx-auto mb-3" />
                    <div className="h-8 w-16 bg-muted rounded animate-pulse mx-auto mb-2" />
                    <div className="h-4 w-20 bg-muted rounded animate-pulse mx-auto" />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
          title="Plans Error"
          message={error?.message || "Failed to load learning plans"}
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  // Ensure goals is an array before proceeding
  if (!Array.isArray(goals)) {
    console.error("Goals is not an array:", goals);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <ErrorState
          title="Data Error"
          message="Invalid data format received from server"
          onRetry={() => window.location.reload()}
        />
      </div>
    );
  }

  try {
    const totalGoals = goals.length;
    const activeGoals = goals.length; // TODO: Calculate from progress data
    const completedGoals = 0; // TODO: Calculate from progress data
    const totalStreak = 0; // TODO: Calculate from progress data

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
                <Target className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-yellow-100 drop-shadow-sm">Learning Plans</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Your Learning Goals 🎯
              </h1>
              <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                Track your progress and manage your learning journey
              </p>
            </div>
          </div>
          </header>
        </section>

        {/* Controls */}
        <section aria-labelledby="controls-heading">
          <h2 id="controls-heading" className="sr-only">Search and Filter Controls</h2>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                aria-label="Search learning goals"
              />
            </div>
            <Select value={sortBy} onValueChange={(value) => setSortBy(value as "recent")}>
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="recent">Most Recent</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
              <Link href="/app/create">
                <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                New Goal
              </Link>
            </Button>
          </div>
        </section>

        {/* Goals Grid */}
        <section aria-labelledby="goals-heading">
          <h2 id="goals-heading" className="sr-only">Learning Goals</h2>
          {(() => {
            try {
              if (filteredGoals.length > 0) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    {filteredGoals.map((goal) => {
                      if (!goal || typeof goal !== 'object' || !goal.id) {
                        return null;
                      }
                      return <GoalCard key={goal.id} goal={goal} />;
                    }).filter(Boolean)}
                  </div>
                );
              } else if (goals && goals.length > 0) {
                return (
                  <div className="text-center py-8 sm:py-12">
                    <Search className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold mb-2">No goals match your search</h3>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                      Try adjusting your search terms or filters
                    </p>
                    <Button variant="outline" onClick={() => setSearchTerm("")}>
                      Clear Search
                    </Button>
                  </div>
                );
              } else {
                return (
                  <div className="text-center py-8 sm:py-12">
                    <Target className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground mx-auto mb-3 sm:mb-4" aria-hidden="true" />
                    <h3 className="text-lg font-semibold mb-2">No learning goals yet</h3>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                      Create your first learning goal to get started
                    </p>
                    <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105" asChild>
                      <Link href="/app/create">
                        <Plus className="h-4 w-4 mr-2" aria-hidden="true" />
                        Create Your First Goal
                      </Link>
                    </Button>
                  </div>
                );
              }
            } catch (error) {
              console.error("Error in goals rendering:", error);
              return (
                <div className="text-center py-8">
                  <h3 className="text-lg font-semibold mb-2">Error rendering goals</h3>
                  <p className="text-muted-foreground mb-4">Please refresh the page</p>
                  <Button onClick={() => window.location.reload()}>Refresh</Button>
                </div>
              );
            }
          })()}
        </section>

        {/* Summary Stats */}
        {(() => {
          try {
            if (goals && goals.length > 0) {
              return (
                <section aria-labelledby="stats-heading">
                  <div className="mt-8 sm:mt-12 relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                    {/* Enhanced animated background elements */}
                    <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl animate-pulse" />
                    <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl animate-pulse" style={{animationDelay: '1s'}} />
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-brand/15 to-purple-500/15 rounded-full blur-xl animate-pulse" style={{animationDelay: '2s'}} />
                    
                    <div className="relative z-10">
                      <div className="text-center mb-8">
                        <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand/10 to-purple-600/10 rounded-full border border-brand/20 mb-4">
                          <Target className="w-5 h-5 text-brand" />
                          <span className="text-brand font-medium">Progress Overview</span>
                        </div>
                        <h2 id="stats-heading" className="text-3xl font-bold text-[var(--fg)] mb-2">Your Learning Journey</h2>
                        <p className="text-[var(--fg)]/70 text-lg">Track your progress and celebrate your achievements</p>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {/* Total Goals */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/10 via-blue-400/10 to-blue-500/10 p-6 backdrop-blur-sm border border-blue-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500/20 to-blue-400/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700" />
                          <div className="relative z-10 text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
                              <Target className="h-6 w-6 text-white" />
                            </div>
                            <div className="text-3xl font-bold text-blue-600 mb-1">{totalGoals}</div>
                            <div className="text-sm text-[var(--fg)]/70 font-medium">Total Goals</div>
                          </div>
                        </div>

                        {/* Active Goals */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-500/10 via-green-400/10 to-green-500/10 p-6 backdrop-blur-sm border border-green-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-green-500/20 to-green-400/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700" />
                          <div className="relative z-10 text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
                              <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                            </div>
                            <div className="text-3xl font-bold text-green-600 mb-1">{activeGoals}</div>
                            <div className="text-sm text-[var(--fg)]/70 font-medium">Active</div>
                          </div>
                        </div>

                        {/* Completed Goals */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/10 via-purple-400/10 to-purple-500/10 p-6 backdrop-blur-sm border border-purple-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-purple-400/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700" />
                          <div className="relative z-10 text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
                              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                                <div className="w-3 h-3 bg-purple-600 rounded-full" />
                              </div>
                            </div>
                            <div className="text-3xl font-bold text-purple-600 mb-1">{completedGoals}</div>
                            <div className="text-sm text-[var(--fg)]/70 font-medium">Completed</div>
                          </div>
                        </div>

                        {/* Total Streak */}
                        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500/10 via-orange-400/10 to-orange-500/10 p-6 backdrop-blur-sm border border-orange-500/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
                          <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-orange-500/20 to-orange-400/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700" />
                          <div className="relative z-10 text-center">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-3">
                              <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse" />
                              </div>
                            </div>
                            <div className="text-3xl font-bold text-orange-600 mb-1">{totalStreak}</div>
                            <div className="text-sm text-[var(--fg)]/70 font-medium">Total Streak</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>
              );
            }
            return null;
          } catch (error) {
            console.error("Error in summary stats rendering:", error);
            return null;
          }
        })()}
        </div>
      </div>
    </div>
    );
  } catch (error) {
    console.error("Critical error in Plans component:", error);
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Critical Error</h3>
          <p className="text-muted-foreground mb-4">Something went wrong. Please refresh the page.</p>
          <Button onClick={() => window.location.reload()}>Refresh</Button>
        </div>
      </div>
    );
  }
}