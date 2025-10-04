"use client";

import { useState, useMemo, useRef, useEffect } from "react";
import { GoalCard } from "@/components/ui/goal-card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Target, Search, Plus, ChevronDown, TrendingUp, Users } from "lucide-react";
import Link from "next/link";
import { useGoals } from "@/app/lib/hooks";

interface PopularGoal {
  topic: string;
  focus: string | null;
  level: string | null;
  count: number;
  recent_created_at: string;
}

export default function Plans() {
  const { goals, isLoading, isError, error } = useGoals();
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent">("recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [popularGoals, setPopularGoals] = useState<PopularGoal[]>([]);
  const [isLoadingPopular, setIsLoadingPopular] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fetch popular goals
  useEffect(() => {
    const fetchPopularGoals = async () => {
      try {
        setIsLoadingPopular(true);
        const response = await fetch('/api/goals/popular');
        if (response.ok) {
          const data = await response.json();
          setPopularGoals(data);
        } else {
          console.error('Failed to fetch popular goals:', response.statusText);
        }
      } catch (error) {
        console.error('Error fetching popular goals:', error);
      } finally {
        setIsLoadingPopular(false);
      }
    };

    fetchPopularGoals();
  }, []);

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
        <section aria-labelledby="controls-heading" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <h2 id="controls-heading" className="sr-only">Search and Filter Controls</h2>
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" aria-hidden="true" />
                <Input
                  placeholder="Search your learning goals..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                  aria-label="Search learning goals"
                />
              </div>
              <div className="relative" ref={dropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="h-12 w-48 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm cursor-pointer px-4 pr-10 flex items-center justify-between hover:bg-white/90 dark:hover:bg-slate-600/80"
                >
                  <span className="text-slate-700 dark:text-slate-300">Most Recent</span>
                  <ChevronDown 
                    className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                      isDropdownOpen ? 'rotate-180' : ''
                    }`} 
                  />
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border-2 border-slate-200 dark:border-slate-600 rounded-2xl shadow-xl z-50 overflow-hidden">
                    <button
                      type="button"
                      onClick={() => {
                        setSortBy("recent");
                        setIsDropdownOpen(false);
                      }}
                      className="w-full px-4 py-3 text-left text-lg text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors duration-200 flex items-center justify-between"
                    >
                      Most Recent
                      {sortBy === "recent" && (
                        <div className="w-2 h-2 bg-brand rounded-full"></div>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
            <Button 
              className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-2 border-emerald-500/20" 
              asChild
            >
              <Link href="/app/create">
                <Plus className="h-5 w-5 mr-3" aria-hidden="true" />
                Create New Goal
              </Link>
            </Button>
          </div>
        </section>

        {/* Goals Grid */}
        <section aria-labelledby="goals-heading" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <h2 id="goals-heading" className="sr-only">Learning Goals</h2>
          {(() => {
            try {
              if (filteredGoals.length > 0) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mb-6">
                      <Search className="h-12 w-12 text-slate-400" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">No goals match your search</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                      Try adjusting your search terms or filters
                    </p>
                    <Button 
                      variant="outline" 
                      onClick={() => setSearchTerm("")}
                      className="h-12 px-6 text-lg border-2 border-slate-300 dark:border-slate-600 hover:border-brand hover:bg-brand/5 rounded-2xl transition-all duration-300"
                    >
                      Clear Search
                    </Button>
                  </div>
                );
              } else {
                return (
                  <div className="text-center py-16">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand/20 to-purple-600/20 rounded-full flex items-center justify-center mb-6">
                      <Target className="h-12 w-12 text-brand" aria-hidden="true" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">No learning goals yet</h3>
                    <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                      Create your first learning goal to get started
                    </p>
                    <Button 
                      className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-2 border-emerald-500/20" 
                      asChild
                    >
                      <Link href="/app/create">
                        <Plus className="h-5 w-5 mr-3" aria-hidden="true" />
                        Create Your First Goal
                      </Link>
                    </Button>
                  </div>
                );
              }
            } catch (error) {
              console.error("Error in goals rendering:", error);
              return (
                <div className="text-center py-16">
                  <div className="w-24 h-24 mx-auto bg-gradient-to-br from-red-100 to-red-200 dark:from-red-900/20 dark:to-red-800/20 rounded-full flex items-center justify-center mb-6">
                    <Target className="h-12 w-12 text-red-500" aria-hidden="true" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">Error rendering goals</h3>
                  <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">Please refresh the page</p>
                  <Button 
                    onClick={() => window.location.reload()}
                    className="h-12 px-6 text-lg bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-2xl transition-all duration-300"
                  >
                    Refresh
                  </Button>
                </div>
              );
            }
          })()}
        </section>

        {/* Popular Goals Section */}
        {!isLoadingPopular && (
          <section aria-labelledby="popular-goals-heading" className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 id="popular-goals-heading" className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    Popular Learning Goals
                  </h2>
                  <p className="text-slate-600 dark:text-slate-400">
                    See what others are learning right now
                  </p>
                </div>
              </div>
            </div>

            {isLoadingPopular ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-slate-100 dark:bg-slate-700 rounded-2xl p-4 animate-pulse">
                    <div className="h-4 bg-slate-300 dark:bg-slate-600 rounded w-3/4 mb-2" />
                    <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-1/2 mb-3" />
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-slate-300 dark:bg-slate-600 rounded" />
                      <div className="h-3 bg-slate-300 dark:bg-slate-600 rounded w-16" />
                    </div>
                  </div>
                ))}
              </div>
            ) : popularGoals.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {popularGoals.slice(0, 6).map((goal, index) => (
                  <div
                    key={`${goal.topic}-${goal.focus}-${index}`}
                    className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-6 border border-slate-200 dark:border-slate-600 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                    onClick={() => {
                      // Pre-fill the create form with this popular goal
                      const params = new URLSearchParams({
                        topic: goal.topic,
                        focus: goal.focus || '',
                        level: goal.level || 'beginner'
                      });
                      window.location.href = `/app/create?${params.toString()}`;
                    }}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-lg mb-1 group-hover:text-brand transition-colors">
                          {goal.topic}
                        </h3>
                        {goal.focus && (
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-2">
                            {goal.focus}
                          </p>
                        )}
                        {goal.level && (
                          <span className="inline-block px-2 py-1 bg-brand/10 text-brand text-xs font-medium rounded-full">
                            {goal.level}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                        <Users className="w-4 h-4" />
                        <span className="text-sm font-medium">{goal.count}</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(goal.recent_created_at).toLocaleDateString()}
                      </span>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="w-2 h-2 bg-brand rounded-full animate-pulse" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-full flex items-center justify-center mb-4">
                  <TrendingUp className="h-8 w-8 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">No Popular Goals Yet</h3>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                  Be the first to create a learning goal and help others discover what to learn!
                </p>
              </div>
            )}

            <div className="mt-6 text-center">
              <Button
                variant="outline"
                className="h-12 px-6 text-lg border-2 border-slate-300 dark:border-slate-600 hover:border-brand hover:bg-brand/5 rounded-2xl transition-all duration-300"
                asChild
              >
                <Link href="/app/create">
                  <Plus className="h-5 w-5 mr-2" />
                  Create Your Own Goal
                </Link>
              </Button>
            </div>
          </section>
        )}

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