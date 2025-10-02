import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";

export async function requireUser(req: NextRequest) {
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    return { user: null, supabase: null, res: NextResponse.json({ error: "Supabase env missing" }, { status: 500 }) };
  }
  const supabase = await supabaseServer();
  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) {
    return { user: null, supabase, res: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
  return { user, supabase, res: null };
}

export function dayIndexFrom(startISO: string, timezone: string = 'UTC') {
  const start = new Date(startISO);
  const now = new Date();
  
  // Convert to the specified timezone for day calculation
  const startInTz = new Date(start.toLocaleString("en-US", { timeZone: timezone }));
  const nowInTz = new Date(now.toLocaleString("en-US", { timeZone: timezone }));
  
  // Get just the date part (midnight) in the target timezone
  const startLocal = new Date(startInTz.getFullYear(), startInTz.getMonth(), startInTz.getDate());
  const nowLocal = new Date(nowInTz.getFullYear(), nowInTz.getMonth(), nowInTz.getDate());
  
  const ms = nowLocal.getTime() - startLocal.getTime();
  const dayIndex = Math.max(1, Math.floor(ms / 86400000) + 1);
  
  console.log('dayIndexFrom calculation (TIMEZONE AWARE):', {
    startISO,
    timezone,
    startInTz: startInTz.toISOString(),
    nowInTz: nowInTz.toISOString(),
    startLocal: startLocal.toISOString(),
    nowLocal: nowLocal.toISOString(),
    ms,
    days: Math.floor(ms / 86400000),
    dayIndex
  });
  
  return dayIndex;
}

export function calculateStreak(progressData: Array<{ completed_at: string; day_index?: number }>): number {
  if (!progressData || progressData.length === 0) return 0;

  // Sort progress by completion date (most recent first)
  const sortedProgress = [...progressData].sort((a, b) => 
    new Date(b.completed_at).getTime() - new Date(a.completed_at).getTime()
  );

  let streak = 0;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  // Group progress by day (local timezone)
  const progressByDay = new Map<string, boolean>();
  
  sortedProgress.forEach(progress => {
    const completedDate = new Date(progress.completed_at);
    const dayKey = `${completedDate.getFullYear()}-${completedDate.getMonth()}-${completedDate.getDate()}`;
    progressByDay.set(dayKey, true);
  });

  // Calculate consecutive days starting from today and going backwards
  const currentDate = new Date(today);
  
  while (true) {
    const dayKey = `${currentDate.getFullYear()}-${currentDate.getMonth()}-${currentDate.getDate()}`;
    
    if (progressByDay.has(dayKey)) {
      streak++;
      // Move to previous day
      currentDate.setDate(currentDate.getDate() - 1);
    } else {
      // No progress found for this day, streak ends
      break;
    }
  }

  return streak;
} 