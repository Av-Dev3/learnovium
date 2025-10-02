import { notFound } from "next/navigation";
import Link from "next/link";
import { Calendar, Target, Clock, ArrowLeft, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/components/ui/progress-bar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MarkCompleteButton } from "@/app/components/MarkCompleteButton";
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

  // Use LOCAL time to match backend and dashboard
  const start = new Date(goal.created_at);
  const now = new Date();
  const startLocal = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const ms = nowLocal.getTime() - startLocal.getTime();
  const currentDay = Math.max(1, Math.floor(ms / 86400000) + 1);
  
  const daysSinceCreation = currentDay - 1;

  // Calculate plan day information
  const totalDays = plan_json?.total_days || 0;
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
                    {totalDays > 0 ? `${currentDay} / ${totalDays}` : (plan_json?.total_days || 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {totalDays > 0 ? 'Current / Total Days' : 'Total Days'}
                    {isPlanComplete && (
                      <span className="ml-2 text-emerald-600 font-semibold">✓ Complete</span>
                    )}
                    {isPlanOverdue && (
                      <span className="ml-2 text-orange-600 font-semibold">+{daysSinceCreation - totalDays} days</span>
                    )}
                  </p>
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
                  <Link href={`/app/plans/${goal.id}/lesson`}>
                    <BookOpen className="h-4 w-4 mr-2" />
                    Open Today&apos;s Lesson
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

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

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {Array.isArray(plan_json.modules) && plan_json.modules.length > 0 ? plan_json.modules.map((module) => {
                  // Generate consistent color theme based on module day
                  const getColorTheme = (day: number) => {
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
                    return colors[(day - 1) % colors.length];
                  };

                  const colorTheme = getColorTheme(module.day);

                  return (
                    <div 
                      key={module.day} 
                      className={`group relative overflow-hidden rounded-3xl bg-gradient-to-br ${colorTheme.bg} backdrop-blur-sm border ${colorTheme.border} hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-slate-400/60 ${
                        module.completed ? 'border-green-200 bg-green-50/50' : ''
                      }`}
                    >
                      <div className="relative p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-6">
                          <div className="space-y-3">
                            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                              {module.title}
                            </h3>
                            <div className={`flex items-center gap-2 ${colorTheme.accent}`}>
                              <div className={`w-6 h-6 bg-gradient-to-br ${colorTheme.icon} rounded-lg flex items-center justify-center`}>
                                <Target className="h-3 w-3 text-white" />
                              </div>
                              <span className="text-sm font-medium">{module.topic}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className={`px-3 py-1.5 bg-gradient-to-r ${colorTheme.bg} border ${colorTheme.border} rounded-full`}>
                              <span className={`text-xs font-semibold ${colorTheme.text} uppercase tracking-wider`}>Day {module.day}</span>
                            </div>
                            {module.completed && (
                              <div className="px-3 py-1.5 bg-gradient-to-r from-green-100 to-green-200 border border-green-300 rounded-full">
                                <span className="text-xs font-semibold text-green-800 uppercase tracking-wider">✓ Complete</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Content */}
                        <div className="space-y-4 mb-6">
                          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300">{module.objective}</p>
                          
                          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                            <Clock className="h-4 w-4" />
                            <span>{module.est_minutes} minutes estimated</span>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
                          <Button 
                            asChild 
                            className={`flex-1 bg-gradient-to-r ${colorTheme.icon} hover:opacity-90 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl py-3`}
                          >
                            <Link href={`/app/plans/${goal.id}/lesson`}>
                              Start Lesson
                            </Link>
                          </Button>
                          <MarkCompleteButton 
                            goalId={goal.id} 
                            dayIndex={module.day}
                            variant="outline"
                            size="sm"
                            className={`border-2 ${colorTheme.border} ${colorTheme.text} hover:opacity-80 transition-all duration-300 rounded-2xl px-4 py-3`}
                          />
                        </div>
                      </div>
                    </div>
                  );
                }) : (
                  <div className="col-span-full">
                    <Card className="text-center">
                      <CardContent className="p-6 text-muted-foreground">
                        No modules available for this plan yet.
                      </CardContent>
                    </Card>
                  </div>
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