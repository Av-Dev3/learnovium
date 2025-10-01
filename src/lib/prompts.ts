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
- Reading: 200-500 words explaining the concept with clear examples (aim for comprehensive coverage)
- Walkthrough: 200-300 words showing step-by-step how to apply the concept
- Quiz: 2 questions that test understanding and application based on the reading material
- Exercise: A practical task that can be completed in 5-10 minutes
- Citations: Use the provided context sources
- Est minutes: Realistic time estimate (5-15 minutes)

Focus on making this lesson immediately useful and actionable.` },
  ];
}

export function buildAdvancedLessonPrompt(context: string, topic: string, focus: string, dayIndex: number, level: string = 'beginner') {
  const levelInstructions = getLevelInstructions(level);
  
  return [
    { role: "system" as const, content: `You are a senior teacher who creates skill-level-appropriate lessons. You MUST return JSON that matches the LessonJSON schema exactly. Do not use any other structure. Follow the format precisely.

${levelInstructions}

LESSON CREATION GUIDELINES:
- Adapt ALL content (reading, walkthrough, quiz, exercise) to the ${level} level
- Use appropriate language complexity and technical depth
- Include examples and explanations that match the skill level
- Ensure the lesson builds on appropriate prior knowledge for a ${level} learner
- Make the content immediately actionable for someone at ${level} level` },
    { role: "user" as const, content: "Here is the EXACT JSON format you must use for lessons:" },
    { role: "assistant" as const, content: `{
  "topic": "Introduction to Variables in Programming",
  "reading": "Variables are fundamental building blocks in programming that allow you to store and manipulate data. Think of a variable as a labeled box where you can put different types of information - numbers, text, or true/false values. In most programming languages, you create a variable by giving it a name and assigning a value using the equals sign (=). For example, 'age = 25' creates a variable called 'age' and stores the number 25 in it. Variables can change their values throughout your program, which makes them incredibly useful for calculations, storing user input, and keeping track of program state. The key is choosing descriptive names that clearly indicate what the variable represents, like 'userName' instead of just 'x' or 'data'. Practice creating variables with different data types and remember that variable names are case-sensitive, so 'age' and 'Age' are different variables. Variables are essential for building dynamic programs that can respond to user input, perform calculations, and maintain state. They allow you to store temporary data, pass information between functions, and create flexible code that can handle different scenarios. Understanding how to use variables effectively is the foundation of programming, as they enable you to create programs that can process data, make decisions, and produce meaningful output. Start with simple examples and gradually work your way up to more complex uses as you become comfortable with the concept. Variables also have different scopes - some are accessible throughout your entire program (global variables) while others are only available within specific functions or code blocks (local variables). This concept of scope is crucial for writing clean, maintainable code. When you declare a variable inside a function, it's only accessible within that function unless you explicitly return it or pass it as a parameter. Global variables, while sometimes necessary, should be used sparingly as they can make code harder to debug and maintain. Another important aspect is variable types - some languages require you to declare the type explicitly (like int age = 25 in C++), while others infer the type automatically (like age = 25 in Python). Understanding type systems helps prevent errors and makes your code more predictable. Variables can also be constants, meaning their values cannot be changed once set. This is useful for values that should remain the same throughout your program's execution, like mathematical constants or configuration settings. The concept of variables extends beyond simple data storage - they're the foundation for more complex data structures like arrays, objects, and classes. As you progress in programming, you'll learn how to create custom data types and use variables to build sophisticated programs that can model real-world scenarios. Remember that good variable naming is not just about following syntax rules, but about making your code self-documenting and easy to understand for both yourself and other developers who might work with your code in the future.",
  "walkthrough": "To work with variables effectively, start by identifying what data you need to store. Choose a clear, descriptive name using camelCase (like 'firstName') or snake_case (like 'first_name'). Declare your variable and assign an initial value. Practice with different data types: numbers for calculations, strings for text, and booleans for true/false conditions. Always initialize variables before using them to avoid errors. As you write more complex programs, you'll use variables to store user input, perform calculations, and control program flow.",
  "quiz": [
    {
      "q": "Based on the lesson, what happens when you declare a variable inside a function?",
      "a": ["It becomes global automatically", "It's only accessible within that function", "It causes a syntax error", "It overwrites existing variables"],
      "correct_index": 1
    },
    {
      "q": "According to the lesson, why should global variables be used sparingly?",
      "a": ["They use more memory", "They make code harder to debug and maintain", "They run slower", "They can't store numbers"],
      "correct_index": 1
    }
  ],
  "exercise": "Create three variables: one to store your name, one for your age, and one for whether you like programming. Then write a simple program that prints out a sentence using these variables.",
  "citations": ["Programming Fundamentals Guide", "Variable Naming Best Practices"],
  "est_minutes": 15
}` },
    { role: "user" as const, content:
`Context (condensed, use only for grounding; do not copy):
${context}

Now create a lesson using the EXACT same JSON structure as shown above, but replace the content with your own original lesson for the requested topic.

Task: Create LessonJSON for topic "${topic}" teaching ONE concrete skill aligned with "${focus}" for a ${level} learner on day ${dayIndex}.

CRITICAL: This lesson is for a ${level} level learner, so:
- Adjust ALL content complexity to match ${level} level knowledge and experience
- Use language and examples appropriate for a ${level} learner
- Assume appropriate prior knowledge for someone at ${level} level
- Make the lesson immediately actionable for a ${level} learner
- Ensure the reading, walkthrough, quiz, and exercise all match the ${level} level

CRITICAL RULES - FOLLOW THESE EXACTLY:
- Use the EXACT same JSON structure as the example above
- Replace the content with your own original lesson for the requested topic
- topic: 10-100 characters describing what is being learned
- reading: 800-4000 characters MAXIMUM (be comprehensive and detailed, aim for 2000+ characters)
- walkthrough: 400-800 characters MAXIMUM (step-by-step guidance)
- quiz: Exactly 2 questions with 4 options each, correct_index 0-3
  * CRITICAL: Quiz questions MUST be based on specific content from the reading material
  * Questions should test understanding of concepts explained in the reading
  * Use phrases like "Based on the lesson..." or "According to the reading..." to ensure questions reference the material
  * Quiz answers must be 5-150 characters each - keep them concise but descriptive
  * Avoid answers that are too short (< 5 chars) or too long (> 150 chars)
- exercise: 100-300 characters MAXIMUM (practical task description)
- citations: 1-3 strings with at least 10 characters each
- est_minutes: 5-20 minutes
- LENGTH IS CRITICAL: Stay within the character limits or validation will fail
- Use the context to understand the topic, but create completely original content
- Never copy phrases, sentences, or exact explanations from the sources
- Focus on teaching the specific topic that was planned for day ${dayIndex}
- Build naturally on previous days while staying true to the planned curriculum
- Emphasize clarity, actionability, and topic-specific learning
- Make the reading content comprehensive and detailed - this is the core learning material

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
    { role: "system" as const, content: "You are an AI tutor. Output must validate against LessonJSON." },
    { role: "user" as const, content:
`Context (RAG top-${k}):
${context}

Task:
Return LessonJSON for today's focus: ${query}.
Respond with ONLY valid JSON.` }
  ];
}