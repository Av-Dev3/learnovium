import { PlanJSON, LessonJSON, ValidationJSON } from "@/types/ai";
import { retrieveContext } from "@/rag/retriever";

const JSON_RULES =
  "Respond with ONLY valid JSON. No backticks, no markdown, no commentary. If unsure, return the closest valid JSON.";

export function buildPlannerPrompt(context: string) {
  return [
    { role: "system" as const, content: "You build multi-week learning plans strictly from provided context. Output must validate against the PlanJSON schema." },
    { role: "user" as const, content:
`Context:
${context}

Task:
Create a plan in this shape:
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

${JSON_RULES}`
    },
  ];
}

export function buildLessonPrompt(context: string) {
  return [
    { role: "system" as const, content: "You are an AI tutor. Output must validate against LessonJSON." },
    { role: "user" as const, content:
`Context:
${context}

Task:
Return:
{
  "topic": "<string>",
  "reading": "<~150-250 words>",
  "walkthrough": "<~200-300 words>",
  "quiz": [
    { "q": "<string>", "a": ["<opt1>","<opt2>","<opt3>","<opt4>"], "correct_index": <0-3> },
    { "q": "<string>", "a": ["<opt1>","<opt2>","<opt3>","<opt4>"], "correct_index": <0-3> }
  ],
  "exercise": "<a short practical task>",
  "citations": ["<1-3 sources>"],
  "est_minutes": 5
}

${JSON_RULES}`
    },
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
    { role: "system" as const, content: "You build multi-week learning plans strictly from provided context. Output must validate against the PlanJSON schema." },
    { role: "user" as const, content:
`Context (RAG top-${k}):
${context}

Task:
Return a PlanJSON for the topic: ${topic ?? "General"}.

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