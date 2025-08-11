import { buildPlannerPrompt } from "@/lib/prompts";
import { generatePlan } from "@/lib/aiCall";

const ctx = `Topic: Beginner Python for data tasks. Audience: total beginner. Duration: 2 weeks. Sources: Automate the Boring Stuff, Real Python. Focus: practical daily exercises.`;
const msgs = buildPlannerPrompt(ctx);
const out = await generatePlan(msgs);
console.log(JSON.stringify(out.data, null, 2)); 