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
    { role: "system" as const, content: `You are an expert AI tutor. Generate a LessonJSON that TEACHES, not summarizes. The lesson must be original, explanatory, and actionable.

QUALITY CONTRACT:
- Write in your own words. Do NOT copy or paraphrase closely from any source. Avoid distinctive phrasings. No quotes from websites.
- Teach like a great instructor: brief recap → concept explanation → worked example tied to the day's outcome → application guidance.
- All quiz questions must be directly answerable from today's reading.
- Output ONLY valid LessonJSON (see schema expectations in the user message). No commentary.` },
    { role: "user" as const, content:
`Context:
${context}

INPUT HEADER (required; parse from Context):
- DayTitle: the exact day title from the plan (use as LessonJSON "topic" verbatim).
- DayGoal: the concrete outcome that must be achieved today.
- Level: beginner | intermediate | advanced (determines voice and depth).
- EstMinutes: integer within 5–20; if missing, choose realistically based on Level.
- (Optional) Focus: sub-scope or constraints to emphasize.

If the header is missing, infer conservatively from the context. The lesson MUST align to DayTitle and DayGoal.

SCHEMA (LessonJSON):
{
  "topic": "Must equal DayTitle exactly (trim trailing spaces only).",
  "reading": "800–4000 chars. Structure inside the prose: (1) 2–3 sentence recap of yesterday linking to DayTitle; (2) clear definitions of today's key terms at first use; (3) one worked example that achieves DayGoal; (4) common mistakes & how to avoid them; (5) a concise checklist for success.",
  "walkthrough": "400–800 chars. Deterministic steps that a learner can follow to reach DayGoal. Reference the same variables/data/tools used in the worked example.",
  "quiz": [
    {"q":"Based on the reading, ...","a":["...","...","...","..."],"correct_index":N},
    {"q":"According to the reading, ...","a":["...","...","...","..."],"correct_index":M}
  ],
  "exercise": "100–300 chars. A practical mini-task that directly produces the DayGoal artifact.",
  "citations": ["1–3 credible sources used to check facts, not copied from."],
  "est_minutes": 5–20
}

STRICT RULES:
- topic: MUST equal DayTitle exactly.
- reading: 800–4000 chars; fully original; no copy/paste; define terms at first use; include recap → explanation → worked example → pitfalls → checklist.
- walkthrough: 400–800 chars; step-by-step; no branching; must achieve DayGoal.
- quiz: exactly 2 questions; each 4 options; correct_index 0–3; questions must explicitly say "Based on the reading" or "According to the reading".
- options length: 5–150 chars each; one clearly correct.
- exercise: 100–300 chars, directly tied to DayGoal, single artifact.
- citations: 1–3 reputable sources (docs, books, standards); do not quote; use for verification only.
- est_minutes: integer 5–20 (prefer EstMinutes if provided).
- No backticks, no commentary, ONLY valid JSON.

${JSON_RULES}` },
  ];
}

export function buildAdvancedLessonPrompt(context: string, topic: string, focus: string, dayIndex: number, level: string = 'beginner') {
  const levelInstructions = getLevelInstructions(level);
  
  return [
    { role: "system" as const, content: `You are a senior teacher creating an original, level-appropriate LessonJSON. Align STRICTLY to the provided day of the plan.

ORIGINALITY & TEACHING:
- Write everything in your own words. Do NOT copy or closely paraphrase any source. No quotes from websites.
- Teach with structure: recap of prior day → clear explanation → one worked example → actionable steps → brief pitfalls & checklist inside the reading.
- All quiz questions must be answerable from the reading.

LEVEL CALIBRATION:
${levelInstructions}

Output ONLY valid LessonJSON. No commentary.` },
    { role: "assistant" as const, content: `{
  "topic": "Must equal the provided day title exactly",
  "reading": "800–4000 chars, includes recap → definitions → worked example → pitfalls → checklist.",
  "walkthrough": "400–800 chars, deterministic steps to reach today's outcome.",
  "quiz": [
    { "q": "Based on the reading, ...", "a": ["A","B","C","D"], "correct_index": 2 },
    { "q": "According to the reading, ...", "a": ["A","B","C","D"], "correct_index": 1 }
  ],
  "exercise": "100–300 chars practical task producing the day's artifact.",
  "citations": ["1–3 credible sources"],
  "est_minutes": 15
}` },
    { role: "user" as const, content:
`Context (condensed; for grounding; do NOT copy):
${context}

Inputs:
- DayTitle (required): Must be used verbatim as LessonJSON "topic".
- DayGoal (required): The concrete learner outcome for day ${dayIndex}.
- Focus (optional): ${focus}
- Level: ${level}
- DayIndex: ${dayIndex}

TASK:
Create LessonJSON for day ${dayIndex} that achieves DayGoal and matches DayTitle.

HARD CONSTRAINTS:
- topic: EXACTLY equals DayTitle (trim trailing spaces only).
- reading: 800–4000 chars; include (1) 2–3 sentence recap referencing what Day ${dayIndex-1} accomplished (or "N/A" if day 1); (2) define key terms at first use; (3) one worked example that achieves DayGoal; (4) common mistakes & how to avoid; (5) checklist.
- walkthrough: 400–800 chars; precise steps to reproduce the worked example and achieve DayGoal.
- quiz: exactly 2 Qs; "Based on the reading…" / "According to the reading…"; 4 options each; one clearly correct; options 5–150 chars.
- exercise: 100–300 chars; produce a single artifact aligned with DayGoal.
- citations: 1–3 credible sources (docs, standards, reputable tutorials) used for verification only; do NOT quote or paraphrase closely.
- est_minutes: integer 5–20, realistic for ${level}.

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
    { role: "system" as const, content: `You are an expert AI tutor. Generate an original, teachable LessonJSON aligned to a plan day.

RAG USAGE:
- Use the RAG context for fact-checking and examples only; do NOT copy phrases or sentences; do NOT quote it.
- The lesson must be self-contained and fully original.

TEACHING STRUCTURE:
- reading: recap of prior day → definitions → one worked example → pitfalls → checklist.
- walkthrough: deterministic steps to reach the day's outcome.
- quiz: 2 questions based solely on the reading.

Output ONLY valid LessonJSON.` },
    { role: "user" as const, content:
`Context (RAG top-${k}):
${context}

Task:
Return LessonJSON for today's focus: ${query}. The "topic" field MUST equal the exact DayTitle for today (if DayTitle is present in context). If not present, derive a precise DayTitle from the plan-style format and use it consistently.

STRICT RULES:
- topic: Must equal DayTitle exactly (or the derived exact title).
- reading: 800–4000 chars; original text; include recap → definitions → worked example → pitfalls → checklist.
- walkthrough: 400–800 chars; precise steps to achieve the outcome implied by the DayTitle.
- quiz: exactly 2 Qs; each 4 options; options 5–150 chars; correct_index 0–3; questions must reference the reading explicitly.
- exercise: 100–300 chars; practical and outcome-aligned.
- citations: 1–3 credible sources; used for verification only; do NOT quote or closely paraphrase.
- est_minutes: 5–20.

Respond with ONLY valid JSON.

${JSON_RULES}` }
  ];
}