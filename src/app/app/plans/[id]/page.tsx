import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Target, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkCompleteButton } from "@/app/components/MarkCompleteButton";
import { GoalCard } from "@/components/ui/goal-card";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

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
    level?: string;
    created_at: string;
    plan_version: number;
  };
  plan_json: PlanData | null;
  completed_lessons?: number;
  total_lessons?: number;
}

async function getGoalPlan(goalId: string): Promise<GoalResponse> {
  try {
    const hdrs = await headers();
    const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host");
    const protocol = hdrs.get("x-forwarded-proto") ?? "http";
    const url = `${protocol}://${host}/api/goals/${goalId}`;

    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        // Forward cookies so the API route can authenticate the user
        cookie: hdrs.get('cookie') ?? '',
        accept: 'application/json',
      },
    });

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

  // Calculate plan day information
  const totalDays = plan_json?.total_days || 0;
  const currentDay = Math.min(daysSinceCreation + 1, totalDays || daysSinceCreation + 1);
  const isPlanComplete = totalDays > 0 && daysSinceCreation >= totalDays;
  const isPlanOverdue = totalDays > 0 && daysSinceCreation > totalDays;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl animate-pulse" />
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8 lg:space-y-12 pt-4 sm:pt-6 lg:pt-8">
          {/* Header */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
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
              {goal.level && (
                <div className="flex items-center gap-2">
                  <Target className="h-4 w-4 text-blue-600" />
                  <Badge variant="secondary" className="capitalize">
                    {goal.level} Level
                  </Badge>
                </div>
              )}
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

          {/* Goal Card - Compact Version */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
            <GoalCard goal={{
              id: goal.id,
              topic: goal.topic,
              focus: goal.focus,
              plan_version: goal.plan_version,
              created_at: goal.created_at,
              progress: progressPercentage,
              currentStreak: 0, // TODO: Get actual streak data
              plan_json: plan_json ? {
                total_days: plan_json.total_days,
                modules: plan_json.modules?.map(module => ({
                  days: [{ day_index: module.day }]
                }))
              } : undefined
            }} />
          </div>

          {/* Plan Timeline */}
          {plan_json ? (
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50 space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Learning Timeline</h2>
                <div className="flex items-center gap-4 text-muted-foreground">
                  <p>
                    {totalDays > 0 ? `Day ${currentDay} of ${totalDays}` : `${plan_json.total_days} days`} • {plan_json.total_minutes} minutes estimated
                  </p>
                  {isPlanComplete && (
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold">
                      ✓ Plan Complete
                    </span>
                  )}
                  {isPlanOverdue && (
                    <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold">
                      +{daysSinceCreation - totalDays} days overdue
                    </span>
                  )}
                </div>
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
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}