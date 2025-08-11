import { buildLessonPrompt } from "@/lib/prompts";
import { generateLesson } from "@/lib/aiCall";

const ctx = `Today's focus: Python lists vs tuples. Audience: beginner. Include short reading, walkthrough, 2 MCQs, and one mini exercise. Cite 1-2 sources.`;
const msgs = buildLessonPrompt(ctx);
const out = await generateLesson(msgs);
console.log(JSON.stringify(out.data, null, 2)); 