import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// GET /api/flashcards/categories - Get user's flashcard categories
export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await supabaseServer();

    const { data: categories, error } = await supabase
      .from("flashcard_categories")
      .select(`
        id,
        name,
        description,
        color,
        created_at,
        goal:learning_goals(id, topic),
        _count:flashcards(count)
      `)
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching categories:", error);
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: 500 }
      );
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error("Categories API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// POST /api/flashcards/categories - Create a new category
export async function POST(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, description, color = "#6366f1", goal_id } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Missing required field: name" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // If goal_id is provided, verify it belongs to user
    if (goal_id) {
      const { data: goal, error: goalError } = await supabase
        .from("learning_goals")
        .select("id")
        .eq("id", goal_id)
        .eq("user_id", user.id)
        .single();

      if (goalError || !goal) {
        return NextResponse.json(
          { error: "Goal not found or access denied" },
          { status: 404 }
        );
      }
    }

    const { data: category, error } = await supabase
      .from("flashcard_categories")
      .insert({
        user_id: user.id,
        goal_id,
        name: name.trim(),
        description: description?.trim(),
        color,
      })
      .select(`
        id,
        name,
        description,
        color,
        created_at,
        goal:learning_goals(id, topic)
      `)
      .single();

    if (error) {
      console.error("Error creating category:", error);
      return NextResponse.json(
        { error: "Failed to create category" },
        { status: 500 }
      );
    }

    return NextResponse.json({ category }, { status: 201 });
  } catch (error) {
    console.error("Create category API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
