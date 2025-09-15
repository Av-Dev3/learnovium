import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/api/utils";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await supabaseServer();
    
    const results = {
      flashcard_categories: { exists: false, error: null },
      flashcards: { exists: false, error: null },
      flashcard_reviews: { exists: false, error: null }
    };

    // Test flashcard_categories table
    try {
      const { error } = await supabase
        .from("flashcard_categories")
        .select("id")
        .limit(1);
      
      if (error) {
        results.flashcard_categories.error = error.message;
      } else {
        results.flashcard_categories.exists = true;
      }
    } catch (err) {
      results.flashcard_categories.error = err instanceof Error ? err.message : 'Unknown error';
    }

    // Test flashcards table
    try {
      const { error } = await supabase
        .from("flashcards")
        .select("id")
        .limit(1);
      
      if (error) {
        results.flashcards.error = error.message;
      } else {
        results.flashcards.exists = true;
      }
    } catch (err) {
      results.flashcards.error = err instanceof Error ? err.message : 'Unknown error';
    }

    // Test flashcard_reviews table
    try {
      const { error } = await supabase
        .from("flashcard_reviews")
        .select("id")
        .limit(1);
      
      if (error) {
        results.flashcard_reviews.error = error.message;
      } else {
        results.flashcard_reviews.exists = true;
      }
    } catch (err) {
      results.flashcard_reviews.error = err instanceof Error ? err.message : 'Unknown error';
    }

    const allTablesExist = results.flashcard_categories.exists && 
                          results.flashcards.exists && 
                          results.flashcard_reviews.exists;

    return NextResponse.json({
      success: allTablesExist,
      message: allTablesExist 
        ? "All flashcard tables exist and are ready!" 
        : "Some flashcard tables are missing. Please run the migration.",
      tables: results
    });

  } catch (error) {
    console.error("Database test error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: "Database connection failed"
      },
      { status: 500 }
    );
  }
}
