"use client";

import { Button } from "@/components/ui/button";
import { Calendar, Target, TrendingUp, Trash2 } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

interface GoalCardProps {
  goal: {
    id: string;
    topic: string;
    focus: string;
    plan_version: number;
    created_at: string;
    progress?: number;
    currentStreak?: number;
    plan_json?: {
      total_days?: number;
      modules?: Array<{
        days: Array<{
          day_index: number;
        }>;
      }>;
    };
  };
}

export function GoalCard({ goal }: GoalCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  // Safety check for goal data
  if (!goal || typeof goal !== 'object' || !goal.id || !goal.topic || !goal.focus || !goal.created_at) {
    console.warn("Invalid goal data passed to GoalCard:", goal);
    return (
      <div className="w-full p-6 rounded-2xl border-2 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20 text-center">
        <p className="text-red-600 dark:text-red-400">Invalid goal data</p>
      </div>
    );
  }

  // Generate consistent color theme based on goal ID
  const getColorTheme = (goalId: string) => {
    const colors = [
      {
        bg: 'from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20',
        border: 'border-blue-200/50 dark:border-blue-800/30',
        icon: 'from-blue-500 to-indigo-600',
        text: 'text-blue-700 dark:text-blue-300',
        accent: 'text-blue-600 dark:text-blue-400'
      },
      {
        bg: 'from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20',
        border: 'border-emerald-200/50 dark:border-emerald-800/30',
        icon: 'from-emerald-500 to-green-600',
        text: 'text-emerald-700 dark:text-emerald-300',
        accent: 'text-emerald-600 dark:text-emerald-400'
      },
      {
        bg: 'from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20',
        border: 'border-purple-200/50 dark:border-purple-800/30',
        icon: 'from-purple-500 to-violet-600',
        text: 'text-purple-700 dark:text-purple-300',
        accent: 'text-purple-600 dark:text-purple-400'
      },
      {
        bg: 'from-orange-50 to-amber-50 dark:from-orange-900/20 dark:to-amber-900/20',
        border: 'border-orange-200/50 dark:border-orange-800/30',
        icon: 'from-orange-500 to-amber-600',
        text: 'text-orange-700 dark:text-orange-300',
        accent: 'text-orange-600 dark:text-orange-400'
      },
      {
        bg: 'from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20',
        border: 'border-rose-200/50 dark:border-rose-800/30',
        icon: 'from-rose-500 to-pink-600',
        text: 'text-rose-700 dark:text-rose-300',
        accent: 'text-rose-600 dark:text-rose-400'
      },
      {
        bg: 'from-cyan-50 to-teal-50 dark:from-cyan-900/20 dark:to-teal-900/20',
        border: 'border-cyan-200/50 dark:border-cyan-800/30',
        icon: 'from-cyan-500 to-teal-600',
        text: 'text-cyan-700 dark:text-cyan-300',
        accent: 'text-cyan-600 dark:text-cyan-400'
      }
    ];
    
    // Use goal ID to consistently pick a color
    const hash = goalId.split('').reduce((a, b) => {
      a = ((a << 5) - a) + b.charCodeAt(0);
      return a & a;
    }, 0);
    return colors[Math.abs(hash) % colors.length];
  };

  const colorTheme = getColorTheme(goal.id);
  
  const daysSinceCreation = Math.ceil(
    (Date.now() - new Date(goal.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  // Calculate plan day information
  const totalDays = goal.plan_json?.total_days || 0;
  const currentDay = Math.min(daysSinceCreation + 1, totalDays || daysSinceCreation + 1);
  const isPlanComplete = totalDays > 0 && daysSinceCreation >= totalDays;
  const isPlanOverdue = totalDays > 0 && daysSinceCreation > totalDays;

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this learning plan? This action cannot be undone.")) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/goals/${goal.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Refresh the page to update the goals list
        window.location.reload();
      } else {
        const error = await response.json();
        alert(`Failed to delete goal: ${error.error}`);
      }
    } catch (error) {
      console.error("Error deleting goal:", error);
        alert("Failed to delete goal. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${colorTheme.bg} backdrop-blur-sm border ${colorTheme.border} hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-slate-400/60`}>
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
              {goal.topic}
            </h3>
            <div className={`flex items-center gap-2 ${colorTheme.accent}`}>
              <div className={`w-6 h-6 bg-gradient-to-br ${colorTheme.icon} rounded-lg flex items-center justify-center`}>
                <Target className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium">{goal.focus}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`px-3 py-1.5 bg-gradient-to-r ${colorTheme.bg} border ${colorTheme.border} rounded-full`}>
              <span className={`text-xs font-semibold ${colorTheme.text} uppercase tracking-wider`}>v{goal.plan_version}</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-xl transition-all duration-200"
              title="Delete plan"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Section */}
        <div className="space-y-4 mb-6">
          {goal.progress !== undefined && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-200">Progress</span>
                <span className="text-slate-600 dark:text-slate-400">{goal.progress}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${goal.progress}%` }}
                />
              </div>
            </div>
          )}
          
          {/* Stats Row */}
          <div className="space-y-3">
            {/* Day Counter */}
            {totalDays > 0 && (
              <div className="flex items-center justify-between text-sm">
                <div className={`flex items-center gap-2 ${colorTheme.accent}`}>
                  <div className={`w-5 h-5 bg-gradient-to-br ${colorTheme.icon} rounded-md flex items-center justify-center`}>
                    <Calendar className="h-3 w-3 text-white" />
                  </div>
                  <span className="font-medium">
                    Day {currentDay} of {totalDays}
                  </span>
                </div>
                {isPlanComplete && (
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                    <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-md flex items-center justify-center">
                      <Target className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium text-xs">
                      {isPlanOverdue ? 'Plan Complete!' : 'Plan Complete!'}
                    </span>
                  </div>
                )}
                {isPlanOverdue && daysSinceCreation - totalDays > 0 && (
                  <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
                    <div className="w-5 h-5 bg-gradient-to-br from-orange-400 to-orange-500 rounded-md flex items-center justify-center">
                      <Calendar className="h-3 w-3 text-white" />
                    </div>
                    <span className="font-medium text-xs">
                      +{daysSinceCreation - totalDays} days
                    </span>
                  </div>
                )}
              </div>
            )}
            
            {/* Streak Section */}
            <div className="flex items-center gap-2 text-sm">
              <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-md flex items-center justify-center">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium text-slate-600 dark:text-slate-400">
                {goal.currentStreak !== undefined && goal.currentStreak > 0 ? `${goal.currentStreak} day streak` : 'No active streak'}
              </span>
              {goal.currentStreak && goal.currentStreak > 0 && (
                <div className="flex items-center gap-1 ml-2">
                  {[...Array(Math.min(goal.currentStreak, 7))].map((_, i) => (
                    <div key={i} className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                  ))}
                  {goal.currentStreak > 7 && (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                      +{goal.currentStreak - 7}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
          <Button 
            asChild 
            className={`flex-1 bg-gradient-to-r ${colorTheme.icon} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl py-3`}
          >
            <Link href={`/app/plans/${goal.id}`}>
              View Plan
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className={`border-2 ${colorTheme.border} ${colorTheme.text} hover:opacity-80 transition-all duration-300 rounded-2xl px-4 py-3`}
          >
            <Link href="/app">
              Today&apos;s Lesson
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
} 