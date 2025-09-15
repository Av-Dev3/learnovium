import { retrieveContext } from "@/rag/retriever";

const JSON_RULES =
  "Respond with ONLY valid JSON. No backticks, no markdown, no commentary. If unsure, return the closest valid JSON.";

export function buildPlannerPrompt(context: string) {
  return [
    { role: "system" as const, content: "You are a learning plan generator. You MUST return JSON that matches the PlanJSON schema exactly. Do not use any other structure. Follow the format precisely." },
    { role: "user" as const, content: "Create a 7-day learning plan for Python programming. Use this EXACT format:" },
    { role: "assistant" as const, content: `{
  "version": "1",
  "topic": "Python Programming",
  "total_days": 7,
  "modules": [
    {
      "title": "Python Fundamentals",
      "days": [
        {
          "day_index": 1,
          "topic": "Introduction to Python Syntax",
          "objective": "Learn basic Python syntax and data types",
          "practice": "Write simple Python programs with variables and print statements",
          "assessment": "Complete 5 coding exercises with correct syntax",
          "est_minutes": 45
        },
        {
          "day_index": 2,
          "topic": "Control Structures",
          "objective": "Master if statements and loops",
          "practice": "Create programs using if/else and for/while loops",
          "assessment": "Build a number guessing game",
          "est_minutes": 60
        }
      ]
    },
    {
      "title": "Data Structures",
      "days": [
        {
          "day_index": 3,
          "topic": "Lists and Dictionaries",
          "objective": "Work with Python lists and dictionaries",
          "practice": "Manipulate data using list methods and dictionary operations",
          "assessment": "Create a contact book using dictionaries",
          "est_minutes": 50
        }
      ]
    }
  ],
  "citations": ["Python.org documentation", "Real Python tutorials"]
}` },
    { role: "user" as const, content:
`Context (use as knowledge base only):
${context}

Now create a learning plan using the EXACT same format as the example above. Do not deviate from this structure:

{
  "version": "1",
  "topic": "Your Topic Here",
  "total_days": 30,
  "modules": [
    {
      "title": "Module Title",
      "days": [
        {
          "day_index": 1,
          "topic": "Day Topic",
          "objective": "Learning objective",
          "practice": "Practice activity",
          "assessment": "Assessment method",
          "est_minutes": 30
        }
      ]
    }
  ],
  "citations": ["Source 1", "Source 2"]
}

CRITICAL RULES:
- MUST start with "version": "1"
- MUST use "topic" (not "plan_title" or "title")
- MUST use "total_days" (not "duration_weeks" or "days_total")
- MUST use "modules" array (not "weeks" or "days")
- Each module MUST have "title" and "days"
- Each day MUST have: day_index, topic, objective, practice, assessment, est_minutes
- est_minutes MUST be between 5 and 120
- day_index MUST be a number starting from 1
- Create 30 days total across multiple modules
- Make each day topic unique and progressive

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
    { role: "system" as const, content: "You are a senior teacher. You MUST return JSON that matches the LessonJSON schema exactly. Do not use any other structure. Follow the format precisely." },
    { role: "user" as const, content: "Here is the EXACT JSON format you must use for lessons:" },
    { role: "assistant" as const, content: `{
  "topic": "Introduction to Variables in Programming",
  "reading": "Variables are fundamental building blocks in programming that allow you to store and manipulate data. Think of a variable as a labeled box where you can put different types of information - numbers, text, or true/false values. In most programming languages, you create a variable by giving it a name and assigning a value using the equals sign (=). For example, 'age = 25' creates a variable called 'age' and stores the number 25 in it. Variables can change their values throughout your program, which makes them incredibly useful for calculations, storing user input, and keeping track of program state. The key is choosing descriptive names that clearly indicate what the variable represents, like 'userName' instead of just 'x' or 'data'. Practice creating variables with different data types and remember that variable names are case-sensitive, so 'age' and 'Age' are different variables. Variables are essential for building dynamic programs that can respond to user input, perform calculations, and maintain state. They allow you to store temporary data, pass information between functions, and create flexible code that can handle different scenarios. Understanding how to use variables effectively is the foundation of programming, as they enable you to create programs that can process data, make decisions, and produce meaningful output. Start with simple examples and gradually work your way up to more complex uses as you become comfortable with the concept.",
  "walkthrough": "To work with variables effectively, start by identifying what data you need to store. Choose a clear, descriptive name using camelCase (like 'firstName') or snake_case (like 'first_name'). Declare your variable and assign an initial value. Practice with different data types: numbers for calculations, strings for text, and booleans for true/false conditions. Always initialize variables before using them to avoid errors. As you write more complex programs, you'll use variables to store user input, perform calculations, and control program flow.",
  "quiz": [
    {
      "q": "What is the primary purpose of variables in programming?",
      "a": ["To make code look longer", "To store and manipulate data", "To slow down the program", "To confuse other programmers"],
      "correct_index": 1
    },
    {
      "q": "Which of the following is the best variable name?",
      "a": ["x", "data", "userAge", "stuff"],
      "correct_index": 2
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

CRITICAL RULES - FOLLOW THESE EXACTLY:
- Use the EXACT same JSON structure as the example above
- Replace the content with your own original lesson for the requested topic
- topic: 10-100 characters describing what is being learned
- reading: 800-2500 characters MAXIMUM (be comprehensive but stay within limit)
- walkthrough: 400-800 characters MAXIMUM (step-by-step guidance)
- quiz: Exactly 2 questions with 4 options each, correct_index 0-3
- exercise: 100-300 characters MAXIMUM (practical task description)
- citations: 1-3 strings with at least 10 characters each
- est_minutes: 5-20 minutes
- LENGTH IS CRITICAL: Stay within the character limits or validation will fail
- Use the context to understand the topic, but create completely original content
- Never copy phrases, sentences, or exact explanations from the sources
- Focus on teaching the specific topic that was planned for day ${dayIndex}
- Build naturally on previous days while staying true to the planned curriculum
- Emphasize clarity, actionability, and topic-specific learning

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

export async function buildPlannerPromptWithRAG(query: string, topic?: string, k = 6) {
  const { context } = await retrieveContext(query, k, topic);
  return [
    { role: "system" as const, content: "You are a learning plan generator. You MUST return JSON that matches the PlanJSON schema exactly. Do not use any other structure. Follow the format precisely." },
    { role: "user" as const, content: "Here is the EXACT JSON format you must use for learning plans:" },
    { role: "assistant" as const, content: `{
  "version": "1",
  "topic": "TOPIC_NAME_HERE",
  "total_days": 7,
  "modules": [
    {
      "title": "Module Title",
      "days": [
        {
          "day_index": 1,
          "topic": "Day Topic",
          "objective": "Learning objective",
          "practice": "Practice activity",
          "assessment": "Assessment method",
          "est_minutes": 45
        },
        {
          "day_index": 2,
          "topic": "Another Day Topic",
          "objective": "Another learning objective",
          "practice": "Another practice activity",
          "assessment": "Another assessment method",
          "est_minutes": 60
        }
      ]
    }
  ],
  "citations": ["Source 1", "Source 2"]
}` },
    { role: "user" as const, content:
`Context (RAG top-${k}, use as inspiration only):
${context}

Now create a learning plan for: ${query}

Use the EXACT same JSON structure as shown above, but replace the content with your own original plan for the requested topic. Do not copy the example content - only use the structure.

CRITICAL RULES:
- MUST start with "version": "1"
- MUST use "topic" field with the actual requested topic name
- MUST use "total_days" (not "duration_weeks" or "days_total")
- MUST use "modules" array (not "weeks" or "days")
- Each module MUST have "title" and "days"
- Each day MUST have: day_index, topic, objective, practice, assessment, est_minutes
- est_minutes MUST be between 5 and 120
- day_index MUST be a number starting from 1
- Create the requested number of days total across multiple modules
- Make each day topic unique and progressive
- Use the context to understand the topic, but create completely original plan content
- Never copy phrases, sentences, or exact explanations from the sources
- Each day must have a UNIQUE, DISTINCT topic that builds progressively
- Day 1: Start with absolute fundamentals
- Day 2+: Each day should introduce new concepts, skills, or deeper understanding
- Avoid repetitive topics or similar-sounding objectives
- Create a logical progression from basic to advanced concepts
- Each topic should be specific and actionable

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