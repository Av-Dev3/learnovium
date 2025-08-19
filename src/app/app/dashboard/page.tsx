import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Container } from "@/components/layout/container";
import { supabaseServer } from "@/lib/supabaseServer";

interface LessonData {
  topic?: string;
  reading?: string;
  walkthrough?: string;
  est_minutes?: number;
}

interface PlanDay {
  day_index: number;
  topic?: string;
  objective?: string;
  practice?: string;
  assessment?: string;
  est_minutes?: number;
}

interface PlanModule {
  days?: PlanDay[];
}

interface PlanData {
  modules?: PlanModule[];
}

function computeDayIndex(startISO: string) {
  const start = new Date(startISO);
  const now = new Date();
  const ms = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
             Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate());
  return Math.max(1, Math.floor(ms / 86400000) + 1);
}

function snippet(text: string, max = 160) {
  if (!text) return "";
  const s = text.trim();
  return s.length > max ? s.slice(0, max - 1) + "…" : s;
}

export default async function DashboardPage() {
  const supabase = await supabaseServer();
  const { data: { user } } = await supabase.auth.getUser();

  // If not logged in, keep the original empty state
  if (!user) {
    return (
      <Container>
        <div className="space-y-8">
          <div>
            <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Dashboard</h1>
            <p className="text-[var(--muted)]">Welcome back! Here&apos;s your learning overview.</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Today&apos;s Lesson</CardTitle>
              <CardDescription>Your personalized learning content for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No lesson scheduled</h3>
                <p className="text-[var(--muted)] mb-4">Create your first learning plan to get started with daily lessons.</p>
                <a href="/app/create" className="inline-flex items-center px-4 py-2 bg-[var(--brand)] text-white rounded-md hover:opacity-90 transition-opacity">Create Plan</a>
              </div>
            </CardContent>
          </Card>
        </div>
      </Container>
    );
  }

  // Load user goals
  const { data: goals } = await supabase
    .from("learning_goals")
    .select("id, topic, created_at, plan_json")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(6);

  const items: Array<{
    goalId: string;
    goalTopic: string;
    dayIndex: number;
    lessonTitle?: string;
    lessonSnippet?: string;
    estMinutes?: number;
    hasLesson: boolean;
  }> = [];

  if (goals && goals.length) {
    // For each goal, try to read today&apos;s cached lesson from lesson_log only (no generation)
    for (const g of goals) {
      const dayIndex = computeDayIndex(g.created_at as string);
      let lessonTitle: string | undefined;
      let lessonSnippet: string | undefined;
      let estMinutes: number | undefined;
      let hasLesson = false;

      // Try cached user lesson first
      const { data: existing } = await supabase
        .from("lesson_log")
        .select("lesson_json")
        .eq("user_id", user.id)
        .eq("goal_id", g.id)
        .eq("day_index", dayIndex)
        .maybeSingle();

      if (existing?.lesson_json) {
        const l = existing.lesson_json as LessonData;
        lessonTitle = l.topic;
        lessonSnippet = snippet(l.reading || l.walkthrough || "");
        estMinutes = l.est_minutes;
        hasLesson = true;
      } else if (g.plan_json) {
        // Fall back to showing today&apos;s plan day title if no lesson cached yet
        try {
          const plan = g.plan_json as PlanData;
          // Locate the plan day by dayIndex
          const flatDays = (plan.modules || []).flatMap((m: PlanModule) => m.days || []);
          const day = flatDays.find((d: PlanDay) => d.day_index === dayIndex);
          if (day) {
            lessonTitle = day.topic || `Day ${dayIndex}`;
            lessonSnippet = snippet(day.objective || day.practice || day.assessment || "");
            estMinutes = day.est_minutes;
          }
        } catch {}
      }

      items.push({
        goalId: g.id,
        goalTopic: g.topic,
        dayIndex,
        lessonTitle,
        lessonSnippet,
        estMinutes,
        hasLesson,
      });
    }
  }

  return (
    <Container>
      <div className="space-y-8">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">Dashboard</h1>
          <p className="text-[var(--muted)]">Welcome back! Here&apos;s your learning overview.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Lessons</CardTitle>
            <CardDescription>Quick access to your current lessons. No extra AI calls.</CardDescription>
          </CardHeader>
          <CardContent>
            {(!items.length || items.every(i => !i.lessonTitle)) ? (
              <div className="text-center py-12">
                <h3 className="text-lg font-semibold mb-2">No lessons yet</h3>
                <p className="text-[var(--muted)] mb-4">Create a plan or open a plan page to generate today&apos;s lesson.</p>
                <a href="/app/create" className="inline-flex items-center px-4 py-2 bg-[var(--brand)] text-white rounded-md hover:opacity-90 transition-opacity">Create Plan</a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {items.map((it) => (
                  <Link key={it.goalId} href={`/app/plans/${it.goalId}/lesson`} className="block group">
                    <div className="rounded-lg border p-4 hover:shadow-sm transition-shadow">
                      <div className="text-sm text-[var(--muted)] mb-1">{it.goalTopic} • Day {it.dayIndex}{it.estMinutes ? ` • ${it.estMinutes} min` : ""}</div>
                      <div className="font-semibold mb-1">{it.lessonTitle || `Lesson for Day ${it.dayIndex}`}</div>
                      {it.lessonSnippet && (
                        <div className="text-sm text-foreground/80 line-clamp-3">{it.lessonSnippet}</div>
                      )}
                      {!it.hasLesson && (
                        <div className="text-xs mt-2 text-[var(--muted)]">Lesson not generated yet. Open to generate.</div>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Container>
  );
}