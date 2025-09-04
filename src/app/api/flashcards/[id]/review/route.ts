import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/supabaseServer";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

// POST /api/flashcards/[id]/review - Record a review and update spaced repetition
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireUser(req);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: flashcardId } = await params;
    const body = await req.json();
    const { difficulty_rating, response_time_ms, was_correct = true } = body;

    if (!difficulty_rating || !["easy", "medium", "hard"].includes(difficulty_rating)) {
      return NextResponse.json(
        { error: "Invalid difficulty_rating. Must be: easy, medium, hard" },
        { status: 400 }
      );
    }

    const supabase = await supabaseServer();

    // Get current flashcard data
    const { data: flashcard, error: fetchError } = await supabase
      .from("flashcards")
      .select("*")
      .eq("id", flashcardId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !flashcard) {
      return NextResponse.json(
        { error: "Flashcard not found" },
        { status: 404 }
      );
    }

    // Calculate new spaced repetition values using SM-2 algorithm
    const { newInterval, newEaseFactor, newMasteryScore } = calculateSpacedRepetition(
      flashcard,
      difficulty_rating,
      was_correct
    );

    const nextReviewDate = new Date();
    nextReviewDate.setDate(nextReviewDate.getDate() + Math.ceil(newInterval));

    // Update flashcard with new spaced repetition data
    const { data: updatedFlashcard, error: updateError } = await supabase
      .from("flashcards")
      .update({
        review_count: flashcard.review_count + 1,
        last_reviewed_at: new Date().toISOString(),
        next_review_at: nextReviewDate.toISOString(),
        current_interval: newInterval,
        ease_factor: newEaseFactor,
        mastery_score: newMasteryScore,
      })
      .eq("id", flashcardId)
      .select()
      .single();

    if (updateError) {
      console.error("Error updating flashcard:", updateError);
      return NextResponse.json(
        { error: "Failed to update flashcard" },
        { status: 500 }
      );
    }

    // Record the review in history
    const { error: reviewError } = await supabase
      .from("flashcard_reviews")
      .insert({
        user_id: user.id,
        flashcard_id: flashcardId,
        difficulty_rating,
        response_time_ms,
        was_correct,
        old_interval: flashcard.current_interval,
        new_interval: newInterval,
        old_ease_factor: flashcard.ease_factor,
        new_ease_factor: newEaseFactor,
      });

    if (reviewError) {
      console.error("Error recording review:", reviewError);
      // Don't fail the request if review history fails
    }

    return NextResponse.json({
      flashcard: updatedFlashcard,
      next_review_at: nextReviewDate.toISOString(),
      mastery_improvement: newMasteryScore - flashcard.mastery_score,
    });
  } catch (error) {
    console.error("Review flashcard API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// SM-2 Spaced Repetition Algorithm
function calculateSpacedRepetition(
  flashcard: any,
  difficultyRating: "easy" | "medium" | "hard",
  wasCorrect: boolean
) {
  const currentInterval = flashcard.current_interval || 1;
  const currentEaseFactor = flashcard.ease_factor || 2.5;
  const currentMastery = flashcard.mastery_score || 0;

  let newInterval = currentInterval;
  let newEaseFactor = currentEaseFactor;
  let newMasteryScore = currentMastery;

  if (wasCorrect) {
    // Correct answer - increase interval
    if (currentInterval === 1) {
      newInterval = 6; // First repetition after 6 days
    } else {
      newInterval = currentInterval * newEaseFactor;
    }

    // Adjust ease factor based on difficulty rating
    switch (difficultyRating) {
      case "easy":
        newEaseFactor = Math.min(currentEaseFactor + 0.15, 3.0);
        newMasteryScore = Math.min(currentMastery + 8, 100);
        newInterval *= 1.3; // Bonus for easy
        break;
      case "medium":
        newEaseFactor = Math.max(currentEaseFactor - 0.02, 1.3);
        newMasteryScore = Math.min(currentMastery + 5, 100);
        break;
      case "hard":
        newEaseFactor = Math.max(currentEaseFactor - 0.15, 1.3);
        newMasteryScore = Math.min(currentMastery + 2, 100);
        newInterval *= 0.8; // Penalty for hard
        break;
    }
  } else {
    // Wrong answer - reset interval and decrease mastery
    newInterval = 1;
    newEaseFactor = Math.max(currentEaseFactor - 0.2, 1.3);
    newMasteryScore = Math.max(currentMastery - 10, 0);
  }

  // Ensure minimum interval of 1 day
  newInterval = Math.max(newInterval, 1);

  return {
    newInterval,
    newEaseFactor,
    newMasteryScore: Math.round(newMasteryScore),
  };
}
