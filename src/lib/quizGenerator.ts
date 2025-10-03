import { generateQuiz as generateQuizAI } from "@/lib/aiCall";
import { buildLessonPromptWithRAG } from "@/lib/prompts";

interface QuizQuestion {
  question: string;
  type: 'multiple_choice' | 'true_false' | 'fill_blank';
  options?: string[];
  correct_answer_index?: number;
  correct_answer_text?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  explanation: string;
}

interface QuizData {
  title: string;
  description: string;
  time_limit_minutes: number;
  questions: QuizQuestion[];
}

interface GenerateQuizParams {
  goal: {
    id: string;
    topic: string;
    focus?: string;
    plan_json?: Record<string, unknown>;
  };
  quiz_type: 'lesson' | 'weekly';
  lesson_day_index?: number;
  week_start_day?: number;
  week_end_day?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  question_count: number;
}

export async function generateQuiz(params: GenerateQuizParams): Promise<{ data: QuizData | null; error: string | null }> {
  try {
    const { goal, quiz_type, lesson_day_index, week_start_day, week_end_day, difficulty, question_count } = params;

    let lessonContent: string = '';
    let quizTitle: string = '';
    let quizDescription: string = '';

    if (quiz_type === 'lesson') {
      // Generate quiz from a specific lesson
      if (!goal.plan_json || typeof goal.plan_json !== 'object') {
        return { data: null, error: "Goal does not have a plan" };
      }

      const plan = goal.plan_json as { 
        modules?: Array<{ 
          title: string; 
          days: Array<{ 
            day_index: number; 
            topic: string; 
            objective: string; 
            practice: string; 
            assessment: string; 
            est_minutes: number 
          }> 
        }> 
      };
      if (!plan.modules || !Array.isArray(plan.modules)) {
        return { data: null, error: "Plan does not have modules" };
      }

      // Find the target day across all modules
      let targetLesson = null;
      let moduleTitle = '';
      for (const module of plan.modules) {
        const day = module.days.find(d => d.day_index === lesson_day_index);
        if (day) {
          targetLesson = day;
          moduleTitle = module.title;
          break;
        }
      }

      if (!targetLesson) {
        return { data: null, error: `Lesson for day ${lesson_day_index} not found` };
      }

      // Get lesson content using RAG
      const ragMessages = await buildLessonPromptWithRAG(
        `${goal.topic} - ${targetLesson.topic}`,
        goal.topic,
        5
      );

      // Extract context from the RAG messages
      const context = ragMessages.find(msg => msg.role === 'user')?.content || '';

      lessonContent = `Topic: ${targetLesson.topic}\nObjective: ${targetLesson.objective}\nContext: ${context}`;
      quizTitle = `Quiz: ${targetLesson.topic} (${moduleTitle})`;
      quizDescription = `Test your knowledge of ${targetLesson.topic}`;

    } else if (quiz_type === 'weekly') {
      // Generate quiz from multiple lessons (weekly)
      if (!goal.plan_json || typeof goal.plan_json !== 'object') {
        return { data: null, error: "Goal does not have a plan" };
      }

      const plan = goal.plan_json as { 
        modules?: Array<{ 
          title: string; 
          days: Array<{ 
            day_index: number; 
            topic: string; 
            objective: string; 
            practice: string; 
            assessment: string; 
            est_minutes: number 
          }> 
        }> 
      };
      if (!plan.modules || !Array.isArray(plan.modules)) {
        return { data: null, error: "Plan does not have modules" };
      }

      // Collect all days within the week range from all modules
      const weekLessons: Array<{ day_index: number; topic: string; objective: string }> = [];
      for (const module of plan.modules) {
        for (const day of module.days) {
          if (day.day_index >= week_start_day! && day.day_index <= week_end_day!) {
            weekLessons.push(day);
          }
        }
      }

      if (weekLessons.length === 0) {
        return { data: null, error: `No lessons found for week ${week_start_day}-${week_end_day}` };
      }

      // Combine all week lessons content
      const weekContent = weekLessons.map(lesson => 
        `Day ${lesson.day_index}: ${lesson.topic}\nObjective: ${lesson.objective}`
      ).join('\n\n');

      // Get RAG context for the week
      const ragMessages = await buildLessonPromptWithRAG(
        `${goal.topic} - Week ${week_start_day}-${week_end_day}`,
        goal.topic,
        8
      );

      // Extract context from the RAG messages
      const context = ragMessages.find(msg => msg.role === 'user')?.content || '';

      lessonContent = `Weekly Review: ${goal.topic}\n\nLessons:\n${weekContent}\n\nContext: ${context}`;
      quizTitle = `Weekly Quiz: ${goal.topic} (Days ${week_start_day}-${week_end_day})`;
      quizDescription = `Comprehensive quiz covering lessons from days ${week_start_day} to ${week_end_day}`;
    }

    // Generate quiz using AI
    const quizPrompt = buildQuizPrompt(lessonContent, difficulty, question_count, quiz_type);
    
    const { data: aiResponse } = await generateQuizAI(quizPrompt);
    
    if (!aiResponse) {
      return { data: null, error: 'AI generation failed: No response' };
    }

    // The AI response should already be in the correct format
    const quizData: QuizData = {
      title: aiResponse.title || quizTitle,
      description: aiResponse.description || quizDescription,
      time_limit_minutes: aiResponse.time_limit_minutes || 30,
      questions: aiResponse.questions.map((q: {
        question: string;
        type: string;
        options?: string[];
        correct_answer_index?: number;
        correct_answer_text?: string;
        difficulty: string;
        points: number;
        explanation: string;
      }) => ({
        question: q.question,
        type: q.type as 'multiple_choice' | 'true_false' | 'fill_blank',
        options: q.options,
        correct_answer_index: q.correct_answer_index,
        correct_answer_text: q.correct_answer_text,
        difficulty: q.difficulty as 'easy' | 'medium' | 'hard',
        points: q.points,
        explanation: q.explanation
      }))
    };

    return { data: quizData, error: null };

  } catch (error) {
    console.error("Quiz generation error:", error);
    return { data: null, error: `Quiz generation failed: ${error instanceof Error ? error.message : 'Unknown error'}` };
  }
}

function buildQuizPrompt(lessonContent: string, difficulty: string, questionCount: number, quizType: string) {
  return [
    {
      role: "system" as const,
      content: `You are an expert quiz generator. Create a comprehensive quiz based on the following lesson content.

QUIZ REQUIREMENTS:
- Quiz Type: ${quizType}
- Difficulty: ${difficulty}
- Number of Questions: ${questionCount}
- Mix of question types: 70% multiple choice, 20% true/false, 10% fill-in-the-blank
- Questions should test understanding, not just memorization
- Include explanations for correct answers
- Vary question difficulty within the specified level

RESPONSE FORMAT (JSON):
{
  "title": "Quiz Title",
  "description": "Quiz description",
  "time_limit_minutes": 30,
  "questions": [
    {
      "question": "Question text here?",
      "type": "multiple_choice",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct_answer_index": 0,
      "difficulty": "easy",
      "points": 1,
      "explanation": "Explanation of why this answer is correct"
    },
    {
      "question": "True or false statement here?",
      "type": "true_false",
      "correct_answer_text": "true",
      "difficulty": "medium",
      "points": 1,
      "explanation": "Explanation of the correct answer"
    },
    {
      "question": "Fill in the blank: The capital of France is ____.",
      "type": "fill_blank",
      "correct_answer_text": "Paris",
      "difficulty": "easy",
      "points": 1,
      "explanation": "Paris is the capital and largest city of France"
    }
  ]
}

Generate the quiz now:`
    },
    {
      role: "user" as const,
      content: `LESSON CONTENT:\n${lessonContent}`
    }
  ];
}

