import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// GET /api/flashcards - Get user's flashcards with optional filtering
export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const categoryId = searchParams.get("category_id");
    const goalId = searchParams.get("goal_id");
    const dueTodayOnly = searchParams.get("due_today") === "true";
    const limit = parseInt(searchParams.get("limit") || "50");

    const supabase = await supabaseServer();

    let query = supabase
      .from("flashcards")
      .select(`
        id,
        front,
        back,
        difficulty,
        mastery_score,
        review_count,
        last_reviewed_at,
        next_review_at,
        source,
        lesson_day_index,
        goal_id,
        created_at,
        category:flashcard_categories(id, name, color),
        goal:learning_goals(id, topic)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (categoryId) {
      query = query.eq("category_id", categoryId);
    }

    if (goalId) {
      query = query.eq("goal_id", goalId);
    }

    if (dueTodayOnly) {
      query = query.lte("next_review_at", new Date().toISOString());
    }

    const { data: flashcards, error } = await query;

    if (error) {
      console.error("Error fetching flashcards:", error);
      return NextResponse.json(
        { error: "Failed to fetch flashcards" },
        { status: 500 }
      );
    }

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error("Flashcards API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/flashcards - Create a new flashcard
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { category_id, goal_id, front, back, difficulty = "medium" } = body;

    if (!category_id || !front || !back) {
      return NextResponse.json(
        { error: "Missing required fields: category_id, front, back" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // Verify category belongs to user
    const { data: category, error: categoryError } = await supabase
      .from("flashcard_categories")
      .select("id")
      .eq("id", category_id)
      .eq("user_id", user.id)
      .single();

    if (categoryError || !category) {
      return NextResponse.json(
        { error: "Category not found or access denied" },
        { status: 404 }
      );
    }

    const { data: flashcard, error } = await supabase
      .from("flashcards")
      .insert({
        user_id: user.id,
        category_id,
        goal_id,
        front: front.trim(),
        back: back.trim(),
        difficulty,
        source: "manual",
      })
      .select(`
        id,
        front,
        back,
        difficulty,
        mastery_score,
        review_count,
        last_reviewed_at,
        next_review_at,
        source,
        created_at,
        category:flashcard_categories(id, name, color)
      `)
      .single();

    if (error) {
      console.error("Error creating flashcard:", error);
      return NextResponse.json(
        { error: "Failed to create flashcard" },
        { status: 500 }
      );
    }

    return NextResponse.json({ flashcard }, { status: 201 });
  } catch (error) {
    console.error("Create flashcard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
