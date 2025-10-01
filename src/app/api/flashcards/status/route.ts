import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// GET /api/flashcards/status?goal_id=xxx&day_index=1
// Check if flashcards exist for a specific lesson
export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const goalId = searchParams.get("goal_id");
    const dayIndexStr = searchParams.get("day_index");

    if (!goalId || !dayIndexStr) {
      return NextResponse.json(
        { error: "Missing goal_id or day_index" },
        { status: 400 }
      );
    }

    const dayIndex = parseInt(dayIndexStr, 10);
    if (isNaN(dayIndex)) {
      return NextResponse.json(
        { error: "Invalid day_index" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // Check if flashcards exist
    const { data: flashcards, error } = await supabase
      .from("flashcards")
      .select("id, front, back, difficulty")
      .eq("user_id", user.id)
      .eq("goal_id", goalId)
      .eq("lesson_day_index", dayIndex);

    if (error) {
      console.error("Error checking flashcard status:", error);
      return NextResponse.json(
        { error: "Failed to check flashcard status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      exists: flashcards && flashcards.length > 0,
      count: flashcards?.length || 0,
      flashcards: flashcards || [],
    });
  } catch (error) {
    console.error("Flashcard status check failed:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

