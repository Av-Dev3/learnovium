import { retrieveContext } from "@/rag/retriever";

const JSON_RULES =
  "Respond with ONLY valid JSON. No backticks, no markdown, no commentary. If unsure, return the closest valid JSON.";

export function buildPlannerPrompt(context: string) {
  return [
    { role: "system" as const, content: "You build multi-week learning plans strictly from provided context. Output must validate against the PlanJSON schema. IMPORTANT: Use the context as inspiration but create ORIGINAL plan content. Never copy text directly from sources." },
    { role: "user" as const, content:
`Context (use as knowledge base only):
${context}

Task:
Create an ORIGINAL learning plan in this shape:
{
  "version": "1",
  "topic": "<string>",
  "total_days": <int>,
  "modules": [
    { "title": "<string>", "days": [
      { "day_index": <int>, "topic": "<string>", "objective": "<string>", "practice": "<string>", "assessment": "<string>", "est_minutes": <int 5-120> }
    ]}
  ],
  "citations": ["<source1>", "<source2>"]
}

CRITICAL: Use the context to understand the topic, but create completely original plan content. 
Never copy phrases, sentences, or exact explanations from the sources.
Synthesize the information and express everything in your own words.

${JSON_RULES}`
    },
  ];
}

export function buildLessonPrompt(context: string) {
  return [
    { role: "system" as const, content: `You are an expert AI tutor who creates engaging, practical, and focused daily lessons. Your lessons should be:

1. SPECIFIC and ACTIONABLE - Focus on one clear skill or concept per lesson
2. PRACTICAL - Include real-world examples and hands-on exercises
3. PROGRESSIVE - Build on previous knowledge and prepare for next steps
4. ENGAGING - Use clear language, examples, and interactive elements
5. MEASURABLE - Include specific learning objectives and assessment

Always use the provided context as your primary source of information. If the context doesn't contain enough detail, supplement with general knowledge but stay focused on the topic.

Output must validate against LessonJSON schema.` },
    { role: "user" as const, content:
`Context:
${context}

Task:
Create a focused, practical daily lesson that teaches ONE specific skill or concept. The lesson should be immediately actionable and build toward the larger learning goal.

Requirements:
- Topic: Be specific about what skill/concept is being learned today
- Reading: 150-250 words explaining the concept with clear examples
- Walkthrough: 200-300 words showing step-by-step how to apply the concept
- Quiz: 2 questions that test understanding and application (not just memorization)
- Exercise: A practical task that can be completed in 5-10 minutes
- Citations: Use the provided context sources
- Est minutes: Realistic time estimate (5-15 minutes)

Focus on making this lesson immediately useful and actionable.` },
  ];
}

export function buildAdvancedLessonPrompt(context: string, topic: string, focus: string, dayIndex: number, level: string = 'beginner') {
  return [
    { role: "system" as const, content: `You are a master educator specializing in ${topic}. You create daily lessons that are:

CRITICAL REQUIREMENTS:
1. ONE SKILL PER LESSON - Each lesson teaches exactly one specific, measurable skill
2. IMMEDIATELY ACTIONABLE - Students can practice the skill right after reading
3. CONTEXT-DRIVEN - Use the provided context as inspiration, but create ORIGINAL content
4. PROGRESSIVE DIFFICULTY - Day ${dayIndex} should be appropriate for the student's level
5. REAL-WORLD APPLICATION - Include practical examples and exercises
6. LEVEL-APPROPRIATE - This lesson is for ${level} level students
7. COPYRIGHT-SAFE - Never copy text directly from sources. Synthesize information and express it in your own words.

LESSON STRUCTURE:
- Topic: Specific skill being learned (e.g., "Playing the G Major Chord" not just "Guitar Basics")
- Reading: Clear explanation with examples and why this skill matters (${level} level appropriate, ORIGINAL content)
- Walkthrough: Step-by-step instructions with common mistakes to avoid (your own explanations)
- Quiz: Application questions, not memorization (${level} level difficulty, original questions)
- Exercise: A 5-10 minute practice session (original exercise design)
- Citations: Reference the provided context sources for credibility

IMPORTANT: Use the context as a knowledge base to understand the topic, then create completely original lesson content. Never copy phrases, sentences, or exact explanations from the sources.` },
    { role: "user" as const, content:
`Learning Context:
Topic: ${topic}
Focus: ${focus}
Level: ${level}
Day: ${dayIndex}

Context Information (use as knowledge base only):
${context}

Create a lesson for Day ${dayIndex} that teaches ONE specific skill related to ${focus}. 
The lesson should be immediately actionable and build toward mastering ${topic}.
This lesson is for ${level} level students, so adjust the complexity and depth accordingly.

CRITICAL: Use the context to understand the topic, but create completely original lesson content. 
Never copy text directly from sources. Synthesize the information and express everything in your own words.
This ensures copyright safety and creates better, more engaging lessons.

Remember: Focus on ONE skill, make it practical, and ensure students can practice it right away.` },
  ];
}

export function buildValidatorPrompt(outputJson: string) {
  return [
    { role: "system" as const, content: "You validate lesson outputs. Output must validate against ValidationJSON." },
    { role: "user" as const, content:
`Given this lesson JSON:
${outputJson}

Return:
{
  "citations": <true|false>,
  "out_of_context": <true|false>,
  "notes": "<optional>"
}

${JSON_RULES}`
    },
  ];
}

export async function buildPlannerPromptWithRAG(query: string, topic?: string, k = 6) {
  const { context } = await retrieveContext(query, k, topic);
  return [
    { role: "system" as const, content: "You build multi-week learning plans strictly from provided context. Output must validate against the PlanJSON schema. IMPORTANT: Use the context as inspiration but create ORIGINAL plan content. Never copy text directly from sources." },
    { role: "user" as const, content:
`Context (RAG top-${k}, use as knowledge base only):
${context}

Task:
Create an ORIGINAL PlanJSON for the topic: ${topic ?? "General"}.

CRITICAL: Use the context to understand the topic, but create completely original plan content. 
Never copy phrases, sentences, or exact explanations from the sources.
Synthesize the information and express everything in your own words.

Respond with ONLY valid JSON.` }
  ];
}

export async function buildLessonPromptWithRAG(query: string, topic?: string, k = 5) {
  const { context } = await retrieveContext(query, k, topic);
  return [
    { role: "system" as const, content: "You are an AI tutor. Output must validate against LessonJSON." },
    { role: "user" as const, content:
`Context (RAG top-${k}):
${context}

Task:
Return LessonJSON for today's focus: ${query}.
Respond with ONLY valid JSON.` }
  ];
} 