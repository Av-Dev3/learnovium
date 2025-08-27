import { retrieveContext } from "@/rag/retriever";

const JSON_RULES =
  "Respond with ONLY valid JSON. No backticks, no markdown, no commentary. If unsure, return the closest valid JSON.";

export function buildPlannerPrompt(context: string) {
  return [
    { role: "system" as const, content: "You build multi-week learning plans strictly from provided context. Output must validate against the PlanJSON schema. IMPORTANT: Use the context as inspiration but create ORIGINAL plan content. Never copy text directly from sources. Each day must have a distinct, progressive topic that builds on previous days." },
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

CRITICAL REQUIREMENTS:
1. Use the context to understand the topic, but create completely original plan content
2. Never copy phrases, sentences, or exact explanations from the sources
3. Each day must have a UNIQUE, DISTINCT topic that builds progressively
4. Day 1: Start with absolute fundamentals
5. Day 2+: Each day should introduce new concepts, skills, or deeper understanding
6. Avoid repetitive topics or similar-sounding objectives
7. Create a logical progression from basic to advanced concepts
8. Each topic should be specific and actionable

Example of good progression:
- Day 1: "Basic Concepts and Terminology"
- Day 2: "Core Principles and Fundamentals" 
- Day 3: "Practical Applications and Examples"
- Day 4: "Common Techniques and Methods"
- Day 5: "Advanced Strategies and Optimization"

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
    { role: "system" as const, content: `You are a senior teacher. Produce a single JSON object that VALIDATES against LessonJSON. No prose, no backticks.
Constraints:
- audience: ${level}, day ${dayIndex}
- focus: ${focus}
- originality: use context only as background, write in your own words
- quality: substantial, practical, copyright-safe
- topic_alignment: strictly follow the planned topic for day ${dayIndex}
- progression: build on previous days naturally
Schema fields & lengths:
- topic: 10-100 chars
- reading: 800-1500 chars (this is the main lesson content)
- walkthrough: 400-800 chars (extra practice tips, mistakes to avoid)
- quiz: 2 items; q: 20-200; a: 4 options 10-100; correct_index: 0-3
- exercise: 100-300 chars
- citations: 1-3 strings (>=10 chars)
- est_minutes: 5-20
Output: ONLY JSON strictly matching the schema.` },
    { role: "user" as const, content:
`Context (condensed, use only for grounding; do not copy):
${context}

Task: Create LessonJSON for topic "${topic}" teaching ONE concrete skill aligned with "${focus}" for a ${level} learner on day ${dayIndex}. 

IMPORTANT: This lesson should follow the pre-planned topic for day ${dayIndex}. Focus on teaching the specific topic that was planned, not random variations. Build naturally on previous days while staying true to the planned curriculum.

Emphasize clarity, actionability, and topic-specific learning.
Return ONLY the JSON object.` },
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
    { role: "system" as const, content: "You build multi-week learning plans strictly from provided context. Output must validate against the PlanJSON schema. IMPORTANT: Use the context as inspiration but create ORIGINAL plan content. Never copy text directly from sources. Each day must have a distinct, progressive topic that builds on previous days." },
    { role: "user" as const, content:
`Context (RAG top-${k}, use as inspiration only):
${context}

Task:
Create an ORIGINAL PlanJSON for the topic: ${topic ?? "General"}.

CRITICAL REQUIREMENTS:
1. Use the context to understand the topic, but create completely original plan content
2. Never copy phrases, sentences, or exact explanations from the sources
3. Each day must have a UNIQUE, DISTINCT topic that builds progressively
4. Day 1: Start with absolute fundamentals
5. Day 2+: Each day should introduce new concepts, skills, or deeper understanding
6. Avoid repetitive topics or similar-sounding objectives
7. Create a logical progression from basic to advanced concepts
8. Each topic should be specific and actionable

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