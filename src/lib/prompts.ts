import { retrieveContext } from "@/rag/retriever";

const JSON_RULES =
  "Respond with ONLY valid JSON. No backticks, no markdown, no commentary. If unsure, return the closest valid JSON.";

function getLevelInstructions(level: string): string {
  switch (level.toLowerCase()) {
    case 'beginner':
      return `BEGINNER LEVEL INSTRUCTIONS:
- Assume the learner has NO prior knowledge of the topic
- Start with absolute fundamentals and basic concepts
- Use simple, clear language and avoid jargon
- Focus on building a solid foundation
- Each day should introduce one core concept at a time
- Include plenty of examples and explanations
- Make topics very specific and concrete (e.g., "What is a variable?" not "Programming concepts")
- Keep exercises simple and achievable
- Build confidence through small wins`;

    case 'intermediate':
      return `INTERMEDIATE LEVEL INSTRUCTIONS:
- Assume the learner has basic knowledge but wants to deepen understanding
- Build on fundamental concepts with more complex applications
- Introduce best practices and common patterns
- Include some technical terminology but explain it
- Focus on practical applications and real-world scenarios
- Each day should combine multiple concepts or dive deeper into one area
- Include problem-solving and analysis exercises
- Prepare for advanced topics`;

    case 'advanced':
      return `ADVANCED LEVEL INSTRUCTIONS:
- Assume the learner has solid intermediate knowledge
- Focus on complex concepts, optimization, and best practices
- Include advanced techniques and industry standards
- Use technical terminology appropriately
- Cover edge cases, performance considerations, and architectural decisions
- Each day should tackle sophisticated topics or deep dives
- Include challenging exercises and real-world projects
- Prepare for expert-level mastery`;

    default:
      return `SKILL LEVEL INSTRUCTIONS:
- Adapt the content complexity based on the specified level
- Ensure progression is appropriate for the learner's experience
- Use language and examples that match the skill level`;
  }
}

export function buildPlannerPrompt(context: string, level: string = 'beginner') {
  const levelInstructions = getLevelInstructions(level);
  
  return [
    { role: "system" as const, content: `You are a master curriculum architect. Produce a progressive, pristine day-by-day learning plan.

Return ONLY valid JSON that conforms EXACTLY to the PlanJSON schema (see demo provided later). 
No code fences, no commentary, no extra fields.

LEVEL RULES:
- Beginner: Day 1 starts from absolute zero ("What is it? Why learn it?"). Plain language; one new idea per day; include a brief spiral review. Prefer Bloom verbs: identify, recall, describe, execute, apply.
- Intermediate: Assume foundations exist but fluency is fragile. Start with a quick practical review. Combine 1–2 related ideas/day; introduce best practices and common pitfalls. Prefer Bloom verbs: apply, analyze, implement, refactor.
- Advanced: Assume solid intermediate skill. Start at complexity. Focus on optimization, architecture, trade-offs, and edge cases. Prefer Bloom verbs: evaluate, architect, optimize, synthesize, critique.

DURATION RULES:
- 7 days (intensive): essentials only; 45–90 min/day; every day is a milestone; end with a minimal viable capstone.
- 30 days (standard): steady foundations + small projects; 30–60 min/day; end with a complete small capstone.
- 60 days (deep dive): coverage + depth; 30–60 min/day; include a mid-program integrator + final capstone.
- 90 days (comprehensive): full breadth + depth; 20–45 min/day; 3–6 modules; portfolio-grade capstone.

DAY TITLE TEMPLATE (must be used for each day's "topic"):
"D{two-digit day} | {ModuleShort}: {Imperative verb} {precise concept} — {specific outcome} [Builds on Day {N-1}: {carryover}]"

Title rules:
- Use imperative Bloom verbs appropriate to level.
- Outcome must be specific and testable.
- Day 1 must end with "[Builds on Day 0: N/A]" or "[Builds on Day 0: starts from zero]".
- Days 2+ must state what they build on from the previous day.
- Avoid vague nouns ("basics", "stuff"); avoid passive voice.
- Keep under ~140 characters, prefer clarity.

ASSESSMENT RULES:
- Each day's "assessment" must specify a concrete artifact + criteria (e.g., "Script runs on 3 sample inputs using for loops; outputs must match expected results.").

CITATIONS:
- Include 3–6 credible sources (official docs, standards, reputable books/tutorials).

${levelInstructions}` },
    { role: "assistant" as const, content: `{
  "version": "1",
  "topic": "Sample Topic",
  "total_days": 7,
  "modules": [
    {
      "title": "Module Title",
      "days": [
        {
          "day_index": 1,
          "topic": "D01 | Foundations: Understand core concept X — perform outcome Y [Builds on Day 0: N/A]",
          "objective": "Achieve a clear, concrete goal; include 2–3 micro-objectives separated by semicolons.",
          "practice": "Brief spiral review of the previous day if applicable; then today's guided steps toward the outcome.",
          "assessment": "Explicit artifact + criteria (what will be checked and how).",
          "est_minutes": 45
        }
      ]
    }
  ],
  "citations": ["Source 1", "Source 2", "Source 3"]
}` },
    { role: "user" as const, content: `Create a progressive learning plan using the exact PlanJSON format shown above.

Context (use as grounding only; do NOT copy verbatim):
${context}

HARD SCHEMA RULES:
- MUST start with "version": "1".
- MUST include "topic", "total_days", "modules"[], "days"[], and "citations".
- "day_index" must be integers 1..(total_days) with no gaps or duplicates.
- Each "day" MUST include: day_index, topic, objective, practice, assessment, est_minutes.
- Each day's "topic" MUST follow the DAY TITLE TEMPLATE exactly.
- "objective" must state the target and include 2–3 micro-objectives (semicolon-separated).
- "practice" must contain hands-on steps; for Days 2+, begin with 1–2 sentences of spiral review.
- "assessment" must define a concrete artifact + criteria.
- "est_minutes" must be realistic for the duration category.
- Distribute days across modules logically (sub-skills or project phases).
- Every day must be unique, specific, and progressively harder.
- End with an appropriate synthesis or capstone for the duration/level.

Respond with ONLY valid JSON.

${JSON_RULES}` },
  ];
}

export function buildLessonPrompt(context: string) {
  return [
    { role: "system" as const, content: `You are a skilled teacher. Write lessons as flowing reading material that teaches clearly and progressively.
Output must be ONLY valid LessonJSON and the "topic" MUST equal the plan's DayTitle exactly.

STYLE & ORIGINALITY:
- Write like a short textbook chapter (continuous narrative).
- Definitions and key terms are introduced naturally inside the prose when first needed.
- No copy/paste or close paraphrase from sources; your wording must be original.
- Avoid "N/A" placeholders.

FIELD INTENT (schema remains the same):
- "reading": The main teaching text (the mini-chapter).
- "walkthrough": Use this field to summarize "Key Points & Definitions" extracted from today's reading (not step-by-step). It should read like a concise consolidation section, not instructions.

STRUCTURE & LENGTH:
- topic: equals DayTitle exactly (trim trailing spaces only).
- reading: 800–4000 characters. Flow: brief recap → introduce concept → deepen with examples → connect to today's outcome. Embed definitions naturally.
- walkthrough (Key Points & Definitions): 400–800 characters. Concise, coherent recap of the most important ideas and definitions from the reading; full sentences or short paragraphs (not bullets required).
- quiz: exactly 2 questions; each has 4 options (5–150 chars) and one correct answer (0–3). Questions must say "Based on the reading…" or "According to the reading…".
- exercise: 100–300 characters. A single practical or reflective task directly reinforcing today's concept.
- citations: 1–3 reputable sources used only for verification; do not quote them.
- est_minutes: 5–20.

Respond with ONLY valid JSON.` },
    { role: "user" as const, content:
`Context (for inspiration; do NOT copy or quote):
${context}

INPUT HEADER (parse from Context if present; otherwise infer conservatively):
- DayTitle: exact plan day title → use as LessonJSON "topic".
- Level: beginner | intermediate | advanced (calibrate tone/depth).
- EstMinutes: integer 5–20 (choose realistically if missing).
- (Optional) DayRecapHint: one sentence describing what the previous day accomplished.
- (Optional) Focus: sub-scope or constraints to emphasize.

TASK:
Create LessonJSON for topic "DayTitle". The lesson must read as a flowing mini-chapter with definitions woven in. 
Use "walkthrough" to provide a cohesive "Key Points & Definitions" summary extracted from the reading (not procedural steps).

${JSON_RULES}` },
  ];
}

export function buildAdvancedLessonPrompt(context: string, topic: string, focus: string, dayIndex: number, level: string = 'beginner') {
  const levelInstructions = getLevelInstructions(level);
  
  return [
    { role: "system" as const, content: `You are a senior teacher creating an original, level-appropriate LessonJSON aligned to a specific plan day.

STYLE & ORIGINALITY:
- Write as a continuous mini-chapter: graceful transitions, examples, and definitions introduced in context.
- All text must be original; do not copy or closely paraphrase sources; no quotes.

ALIGNMENT:
- LessonJSON "topic" MUST equal the provided day title exactly (the 'topic' parameter).
- Calibrate depth and terminology to the learner level.

FIELD INTENT:
- "reading": main teaching narrative (mini-chapter).
- "walkthrough": "Key Points & Definitions" — a compact, coherent summary of essentials from the reading (not step-by-step).

LEVEL CALIBRATION:
${levelInstructions}

LENGTH & RULES:
- topic: equals the provided day title exactly.
- reading: 800–4000 chars; include a brief, natural recap referencing Day ${dayIndex-1} (or "Starting from zero" if Day 1); define terms on first use; weave examples; lead the learner to today's outcome.
- walkthrough (Key Points & Definitions): 400–800 chars; cohesive recap of the most important ideas and definitions from the reading.
- quiz: exactly 2 questions; each 4 options; options 5–150 chars; one correct (0–3); questions must refer to the reading.
- exercise: 100–300 chars; one practical or reflective task reinforcing today's concept/outcome.
- citations: 1–3 reputable sources for verification only (no quotes).
- est_minutes: 5–20.

Output ONLY valid JSON.` },
    { role: "assistant" as const, content: `{
  "topic": "Must equal the plan's day title exactly",
  "reading": "800–4000 chars; flowing narrative with in-context definitions and examples.",
  "walkthrough": "400–800 chars; cohesive 'Key Points & Definitions' summary derived from the reading.",
  "quiz": [
    { "q": "Based on the reading, ...", "a": ["A","B","C","D"], "correct_index": 2 },
    { "q": "According to the reading, ...", "a": ["A","B","C","D"], "correct_index": 1 }
  ],
  "exercise": "100–300 chars; one task reinforcing today's concept.",
  "citations": ["1–3 credible sources"],
  "est_minutes": 15
}` },
    { role: "user" as const, content:
`Context (condensed; grounding only; do NOT copy):
${context}

Inputs:
- DayTitle (required): use EXACTLY as LessonJSON "topic".
- Level: ${level}
- DayIndex: ${dayIndex}
- Focus (optional): ${focus}

TASK:
Create LessonJSON for day ${dayIndex} that reads as a mini-chapter. 
Use "walkthrough" to provide a cohesive "Key Points & Definitions" summary extracted from the reading (not procedural steps).

STRICT RULES:
- topic equals DayTitle exactly (trim trailing spaces only).
- reading: 800–4000 chars; recap → introduce → deepen with examples → connect to today's outcome; definitions in context.
- walkthrough: 400–800 chars; coherent Key Points & Definitions derived from the reading.
- quiz: exactly 2 questions; 4 options each; options 5–150 chars; one correct (0–3); questions explicitly reference the reading.
- exercise: 100–300 chars; single, practical/reflective task reinforcing the concept.
- citations: 1–3 reputable sources; verification only; do not quote.
- est_minutes: 5–20.

${JSON_RULES}` },
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

export async function buildPlannerPromptWithRAG(query: string, topic?: string, level: string = 'beginner', k = 6) {
  const { context } = await retrieveContext(query, k, topic);
  const levelInstructions = getLevelInstructions(level);
  
  return [
    { role: "system" as const, content: `You are a master curriculum architect. Produce a progressive, pristine day-by-day learning plan.

Return ONLY valid JSON that conforms EXACTLY to the PlanJSON schema (see demo provided later). 
No code fences, no commentary, no extra fields.

Use the provided RAG context for grounding only; do NOT copy or quote it verbatim, and do NOT let it override the requested level/duration rules.

LEVEL RULES:
- Beginner: Day 1 starts from absolute zero; plain language; one idea per day; brief spiral review. Bloom verbs: identify, recall, describe, execute, apply.
- Intermediate: Fluency building; combine 1–2 ideas/day; best practices & pitfalls; Bloom verbs: apply, analyze, implement, refactor.
- Advanced: Start at complexity; optimization, architecture, edge cases; Bloom verbs: evaluate, architect, optimize, synthesize, critique.

DURATION RULES:
- 7 days: 45–90 min/day; essentials only; minimal viable capstone.
- 30 days: 30–60 min/day; steady progression; small capstone.
- 60 days: 30–60 min/day; mid integrator + final capstone.
- 90 days: 20–45 min/day; 3–6 modules; portfolio-grade capstone.

DAY TITLE TEMPLATE (must be used for each day's "topic"):
"D{two-digit day} | {ModuleShort}: {Imperative verb} {precise concept} — {specific outcome} [Builds on Day {N-1}: {carryover}]"

Assessment, citations, and title rules are identical to the non-RAG version.

${levelInstructions}` },
    { role: "assistant" as const, content: `{
  "version": "1",
  "topic": "Sample Topic",
  "total_days": 7,
  "modules": [
    {
      "title": "Module Title",
      "days": [
        {
          "day_index": 1,
          "topic": "D01 | Foundations: Understand core concept X — perform outcome Y [Builds on Day 0: N/A]",
          "objective": "Achieve a clear, concrete goal; include 2–3 micro-objectives separated by semicolons.",
          "practice": "Brief spiral review of the previous day if applicable; then today's guided steps toward the outcome.",
          "assessment": "Explicit artifact + criteria (what will be checked and how).",
          "est_minutes": 45
        }
      ]
    }
  ],
  "citations": ["Source 1", "Source 2", "Source 3"]
}` },
    { role: "user" as const, content: `Context (RAG top-${k}, use for grounding only; do NOT copy verbatim):
${context}

Task:
Create a learning plan for: ${query} at ${levelInstructions ? '' : ''} level (respect the LEVEL and DURATION rules above).

HARD SCHEMA RULES:
- MUST start with "version": "1".
- MUST include "topic", "total_days", "modules"[], "days"[], and "citations".
- "day_index" 1..(total_days), no gaps/dupes.
- Each day MUST include: day_index, topic, objective, practice, assessment, est_minutes.
- Each day's "topic" MUST follow the DAY TITLE TEMPLATE exactly.
- "objective": target + 2–3 micro-objectives separated by semicolons.
- "practice": hands-on steps; include 1–2 sentence spiral review for Days 2+.
- "assessment": explicit artifact + criteria.
- "est_minutes": realistic for duration category.
- Logical module grouping; progressive difficulty; appropriate synthesis or capstone.

Respond with ONLY valid JSON.

${JSON_RULES}` }
  ];
}

export async function buildLessonPromptWithRAG(query: string, topic?: string, k = 5) {
  const { context } = await retrieveContext(query, k, topic);
  return [
    { role: "system" as const, content: `You are an expert AI tutor. Generate an original, teachable LessonJSON aligned to the plan day title.

RAG POLICY:
- Use RAG context to fact-check or inspire examples only; do NOT copy phrases or sentences; do NOT quote it.
- The lesson must be self-contained and fully original.

FIELD INTENT:
- "reading": flowing mini-chapter with in-context definitions.
- "walkthrough": "Key Points & Definitions" summary distilled from the reading (not step-by-step).

LENGTH & RULES:
- topic equals the exact plan DayTitle; if not explicitly present, derive a precise DayTitle from the plan format and use consistently.
- reading: 800–4000 chars; recap → introduce → deepen with examples → connect to outcome.
- walkthrough: 400–800 chars; coherent Key Points & Definitions from the reading.
- quiz: 2 questions referencing the reading; 4 options each; one correct (0–3); options 5–150 chars.
- exercise: 100–300 chars; single task reinforcing the concept.
- citations: 1–3 reputable sources; verification only; no quotes.
- est_minutes: 5–20.

Output ONLY valid JSON.` },
    { role: "user" as const, content:
`Context (RAG top-${k}; grounding only; do NOT copy):
${context}

Task:
Return LessonJSON for today's focus: ${query}. 
Ensure 'topic' equals the exact DayTitle from context (or a precise derived DayTitle in plan format). 
Use 'walkthrough' for a cohesive Key Points & Definitions recap from the reading.

Respond with ONLY valid JSON.

${JSON_RULES}` }
  ];
}