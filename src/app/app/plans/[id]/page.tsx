import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Target, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkCompleteButton } from "@/app/components/MarkCompleteButton";

interface PlanModule {
  day: number;
  title: string;
  topic: string;
  objective: string;
  est_minutes: number;
  completed?: boolean;
}

interface PlanData {
  modules: PlanModule[];
  total_days: number;
  total_minutes: number;
}

interface GoalResponse {
  goal: {
    id: string;
    topic: string;
    focus: string;
    created_at: string;
    plan_version: number;
  };
  plan_json: PlanData | null;
  completed_lessons?: number;
  total_lessons?: number;
}

async function getGoalPlan(goalId: string): Promise<GoalResponse> {
  try {
    const response = await fetch(`/api/goals/${goalId}`, { cache: 'no-store' });

    if (!response.ok) {
      if (response.status === 404) {
        notFound();
      }
      throw new Error(`Failed to fetch goal: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching goal plan:', error);
    throw new Error('Failed to load goal plan');
  }
}

export default async function PlanDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;
  const { goal, plan_json, completed_lessons = 0, total_lessons = 0 } = await getGoalPlan(id);

  const progressPercentage = total_lessons > 0 
    ? Math.round((completed_lessons / total_lessons) * 100) 
    : 0;

  const daysSinceCreation = Math.ceil(
    (Date.now() - new Date(goal.created_at).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/app/plans">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plans
            </Link>
          </Button>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{goal.topic}</h1>
          <p className="text-lg text-muted-foreground">{goal.focus}</p>
        </div>

        <div className="flex items-center gap-6 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>Created {daysSinceCreation} days ago</span>
          </div>
          <div className="flex items-center gap-2">
            <Target className="h-4 w-4" />
            <span>Plan v{goal.plan_version}</span>
          </div>
        </div>
      </div>

      {/* Progress Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Learning Progress
          </CardTitle>
          <CardDescription>
            Track your progress through this learning plan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Overall Progress</span>
              <span>{progressPercentage}%</span>
            </div>
            <ProgressBar value={progressPercentage} size="lg" />
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-blue-600">{completed_lessons}</p>
              <p className="text-sm text-muted-foreground">Completed</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{total_lessons}</p>
              <p className="text-sm text-muted-foreground">Total Lessons</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {plan_json?.total_days || 0}
              </p>
              <p className="text-sm text-muted-foreground">Total Days</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {plan_json?.total_minutes || 0}
              </p>
              <p className="text-sm text-muted-foreground">Est. Minutes</p>
            </div>
          </div>

          <div className="pt-4 border-t">
            <Button asChild className="w-full">
              <Link href="/app">
                <BookOpen className="h-4 w-4 mr-2" />
                Open Today&apos;s Lesson
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Plan Timeline */}
      {plan_json ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold mb-4">Learning Timeline</h2>
            <p className="text-muted-foreground">
              {plan_json.total_days} days • {plan_json.total_minutes} minutes estimated
            </p>
          </div>

          <div className="space-y-4">
            {Array.isArray(plan_json.modules) && plan_json.modules.length > 0 ? plan_json.modules.map((module) => (
              <Card 
                key={module.day} 
                className={`transition-all hover:shadow-md ${
                  module.completed ? 'border-green-200 bg-green-50/50' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className="text-sm">
                          Day {module.day}
                        </Badge>
                        {module.completed && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Completed
                          </Badge>
                        )}
                      </div>
                      
                      <div>
                        <h3 className="text-lg font-semibold">{module.title}</h3>
                        <p className="text-muted-foreground mt-1">{module.topic}</p>
                      </div>
                      
                      <p className="text-sm leading-relaxed">{module.objective}</p>
                      
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>{module.est_minutes} minutes estimated</span>
                      </div>
                      
                      <div className="pt-2">
                        <MarkCompleteButton 
                          goalId={goal.id} 
                          dayIndex={module.day}
                          variant="outline"
                          size="sm"
                        />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card className="text-center">
                <CardContent className="p-6 text-muted-foreground">
                  No modules available for this plan yet.
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      ) : (
        /* Empty State */
        <Card className="text-center py-12">
          <CardContent>
            <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Learning Plan Available</h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              This goal doesn&apos;t have a learning plan yet. The plan will be generated when you start your first lesson.
            </p>
            <Button asChild>
              <Link href="/app">
                <BookOpen className="h-4 w-4 mr-2" />
                Start Learning
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}