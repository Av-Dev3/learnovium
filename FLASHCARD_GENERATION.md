# Flashcard Generation System

## Overview

Flashcards are generated automatically when you complete a lesson, but the generation happens **asynchronously in the background** on the server. This means you can leave the lesson page immediately without waiting for flashcards to be created.

## How It Works

### Automatic Generation
1. When you load a lesson for the first time, the server starts generating flashcards automatically
2. The lesson loads immediately - you don't have to wait
3. Flashcard generation continues in the background (60-second timeout)
4. The server will log when flashcards are ready

### Manual Generation
If automatic generation fails or you want to regenerate flashcards:

**API Endpoints:**

1. **Check Flashcard Status**
   ```
   GET /api/flashcards/status?goal_id=xxx&day_index=1
   ```
   Returns:
   ```json
   {
     "exists": true,
     "count": 6,
     "flashcards": [...]
   }
   ```

2. **Manually Generate Flashcards**
   ```
   POST /api/flashcards/generate-for-day
   Body: {
     "goal_id": "xxx",
     "day_index": 1
   }
   ```
   This will:
   - Check if flashcards already exist (returns early if they do)
   - Generate new flashcards from the lesson
   - Save them to the database
   - Return the generated flashcards

## Key Features

✅ **Non-blocking**: Lesson loads immediately  
✅ **Background processing**: Flashcards generate server-side  
✅ **Automatic retry**: If generation fails, you can manually trigger it  
✅ **Duplicate prevention**: Won't generate flashcards if they already exist  
✅ **Timeout protection**: 60-second timeout prevents hanging

## For Developers

### Server-Side Generation
The generation happens in `src/app/api/goals/[id]/today/route.ts`:
- Returns lesson immediately with `flashcards_pending: true`
- Continues generating flashcards in background
- Logs success/failure to console

### Timeout Settings
- **Plans**: 120 seconds (2 minutes)
- **Lessons**: 60 seconds (1 minute)  
- **Flashcards**: 60 seconds (1 minute)

### Error Handling
If flashcard generation times out or fails:
1. Check server logs for error details
2. Use `/api/flashcards/status` to check if flashcards exist
3. Use `/api/flashcards/generate-for-day` to manually regenerate

## Troubleshooting

**Flashcards not appearing?**
1. Wait 60 seconds after loading the lesson
2. Check server logs for generation errors
3. Use the status endpoint to verify
4. Use the manual generation endpoint if needed

**Generation timing out?**
- The OpenAI API might be slow or unresponsive
- The timeout will fire after 60 seconds
- Try manual generation later when the API is more responsive

