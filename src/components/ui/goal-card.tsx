"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
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
      <Card className="w-full border-red-200 bg-red-50">
        <CardContent className="p-4 text-center text-red-600">
          <p>Invalid goal data</p>
        </CardContent>
      </Card>
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
    <Card className="w-full hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{goal.topic}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {goal.focus}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              v{goal.plan_version}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              disabled={isDeleting}
              className="h-8 w-8 p-0 text-red-500 hover:text-red-700 hover:bg-red-50"
              title="Delete plan"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {goal.progress !== undefined && (
            <ProgressBar value={goal.progress} size="sm" />
          )}
          
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{daysSinceCreation} days</span>
            </div>
            {goal.currentStreak && goal.currentStreak > 0 && (
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-green-600 font-medium">
                  {goal.currentStreak} day streak
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2">
          <Button asChild className="flex-1">
            <Link href={`/app/plans/${goal.id}`}>
              View Plan
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/app">
              Today&apos;s Lesson
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 