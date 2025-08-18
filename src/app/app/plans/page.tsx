"use client";

import { useState, useMemo } from "react";
import { GoalCard } from "@/components/ui/goal-card";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
      <div className="space-y-4 sm:space-y-6">
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-6 sm:h-8 w-36 sm:w-48 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 sm:h-5 w-64 sm:w-80 bg-muted rounded animate-pulse" />
        </div>

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
        <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-muted/50 rounded-lg">
          <div className="h-5 w-20 sm:h-6 sm:w-24 bg-muted rounded animate-pulse mb-3 sm:mb-4" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i}>
                <div className="h-6 w-12 sm:h-8 sm:w-16 bg-muted rounded animate-pulse mx-auto mb-1" />
                <div className="h-3 w-16 sm:h-4 sm:w-20 bg-muted rounded animate-pulse mx-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <ErrorState
        title="Plans Error"
        message={error?.message || "Failed to load learning plans"}
        onRetry={() => window.location.reload()}
      />
    );
  }

  // Ensure goals is an array before proceeding
  if (!Array.isArray(goals)) {
    console.error("Goals is not an array:", goals);
    return (
      <ErrorState
        title="Data Error"
        message="Invalid data format received from server"
        onRetry={() => window.location.reload()}
      />
    );
  }

  try {
    const totalGoals = goals.length;
    const activeGoals = goals.length; // TODO: Calculate from progress data
    const completedGoals = 0; // TODO: Calculate from progress data
    const totalStreak = 0; // TODO: Calculate from progress data

    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header */}
        <header className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Learning Plans</h1>
          <p className="text-muted-foreground text-sm sm:text-base">
            Track your progress and manage your learning goals
          </p>
        </header>

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
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as "recent")}
              className="px-3 py-2 border rounded-md bg-background"
              aria-label="Sort goals by"
            >
              <option value="recent">Most Recent</option>
            </select>
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
                  <div className="mt-8 sm:mt-12 p-4 sm:p-6 bg-muted/50 rounded-lg">
                    <h2 id="stats-heading" className="text-lg font-semibold mb-3 sm:mb-4 text-center">Progress Overview</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-center">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-blue-600">{totalGoals}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Total Goals</div>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-green-600">{activeGoals}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Active</div>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-purple-600">{completedGoals}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Completed</div>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-orange-600">{totalStreak}</div>
                        <div className="text-xs sm:text-sm text-muted-foreground">Total Streak</div>
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
    );
  } catch (error) {
    console.error("Critical error in Plans component:", error);
    return (
      <div className="text-center py-8">
        <h3 className="text-lg font-semibold mb-2">Critical Error</h3>
        <p className="text-muted-foreground mb-4">Something went wrong. Please refresh the page.</p>
        <Button onClick={() => window.location.reload()}>Refresh</Button>
      </div>
    );
  }
}