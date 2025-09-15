import { supabaseServer } from "../src/lib/supabaseServer";

async function testFlashcardTables() {
  try {
    console.log("Testing flashcard database tables...");
    
    const supabase = await supabaseServer();
    
    // Test if flashcard_categories table exists
    console.log("Checking flashcard_categories table...");
    const { data: categories, error: categoriesError } = await supabase
      .from("flashcard_categories")
      .select("id")
      .limit(1);
    
    if (categoriesError) {
      console.error("❌ flashcard_categories table error:", categoriesError.message);
      console.log("💡 Please run the migration: migrations/20250816_flashcards.sql");
      return false;
    }
    
    console.log("✅ flashcard_categories table exists");
    
    // Test if flashcards table exists
    console.log("Checking flashcards table...");
    const { data: flashcards, error: flashcardsError } = await supabase
      .from("flashcards")
      .select("id")
      .limit(1);
    
    if (flashcardsError) {
      console.error("❌ flashcards table error:", flashcardsError.message);
      console.log("💡 Please run the migration: migrations/20250816_flashcards.sql");
      return false;
    }
    
    console.log("✅ flashcards table exists");
    
    // Test if flashcard_reviews table exists
    console.log("Checking flashcard_reviews table...");
    const { data: reviews, error: reviewsError } = await supabase
      .from("flashcard_reviews")
      .select("id")
      .limit(1);
    
    if (reviewsError) {
      console.error("❌ flashcard_reviews table error:", reviewsError.message);
      console.log("💡 Please run the migration: migrations/20250816_flashcards.sql");
      return false;
    }
    
    console.log("✅ flashcard_reviews table exists");
    
    console.log("🎉 All flashcard tables are ready!");
    return true;
    
  } catch (error) {
    console.error("❌ Database connection error:", error);
    return false;
  }
}

testFlashcardTables().then(success => {
  process.exit(success ? 0 : 1);
});
