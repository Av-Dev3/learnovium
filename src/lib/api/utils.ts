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

export function dayIndexFrom(startISO: string) {
  const start = new Date(startISO);
  const now = new Date();
  
  // Use LOCAL time to ensure day changes at local midnight
  const startLocal = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const nowLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const ms = nowLocal.getTime() - startLocal.getTime();
  const dayIndex = Math.max(1, Math.floor(ms / 86400000) + 1);
  
  console.log('dayIndexFrom calculation (LOCAL TIME):', {
    startISO,
    startLocal: startLocal.toISOString(),
    nowLocal: nowLocal.toISOString(),
    ms,
    days: Math.floor(ms / 86400000),
    dayIndex,
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
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