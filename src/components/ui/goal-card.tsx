import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Badge } from "@/components/ui/badge";
import { Calendar, Target, TrendingUp } from "lucide-react";
import Link from "next/link";

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
  const daysSinceCreation = Math.ceil(
    (Date.now() - new Date(goal.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

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
          <Badge variant="outline" className="text-xs">
            v{goal.plan_version}
          </Badge>
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