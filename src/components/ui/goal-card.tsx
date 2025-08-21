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
  
  const daysSinceCreation = Math.ceil(
    (Date.now() - new Date(goal.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

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
    <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-slate-100 to-gray-100 dark:from-slate-950/30 dark:via-slate-900/20 dark:to-gray-900/30 border border-slate-200/50 dark:border-slate-800/30 hover:shadow-2xl hover:scale-105 transition-all duration-500 hover:border-slate-400/60">
      {/* Animated background elements */}
      <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-slate-400/20 to-gray-500/20 rounded-full blur-lg group-hover:scale-150 transition-transform duration-700" />
      <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-gradient-to-br from-gray-400/20 to-slate-500/20 rounded-full blur-lg group-hover:scale-125 transition-transform duration-700" />
      
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
              {goal.topic}
            </h3>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
                <Target className="h-3 w-3 text-white" />
              </div>
              <span className="text-sm font-medium">{goal.focus}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 bg-gradient-to-r from-indigo-100 to-purple-100 dark:from-indigo-900/30 dark:to-purple-900/30 border border-indigo-200/50 dark:border-indigo-800/30 rounded-full">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">v{goal.plan_version}</span>
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
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
              <div className="w-5 h-5 bg-gradient-to-br from-slate-400 to-slate-500 rounded-md flex items-center justify-center">
                <Calendar className="h-3 w-3 text-white" />
              </div>
              <span className="font-medium">{daysSinceCreation} days</span>
            </div>
            {goal.currentStreak && goal.currentStreak > 0 && (
              <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                <div className="w-5 h-5 bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-md flex items-center justify-center">
                  <TrendingUp className="h-3 w-3 text-white" />
                </div>
                <span className="font-medium">
                  {goal.currentStreak} day streak
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
          <Button 
            asChild 
            className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl py-3"
          >
            <Link href={`/app/plans/${goal.id}`}>
              View Plan
            </Link>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            asChild 
            className="border-2 border-slate-300 text-slate-700 dark:border-slate-600 dark:text-slate-300 hover:border-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all duration-300 rounded-2xl px-4 py-3"
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