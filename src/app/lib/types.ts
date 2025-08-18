export interface Goal {
  id: string;
  topic: string;
  focus: string;
  plan_version: number;
  created_at: string;
  user_id: string;
  plan_template_id?: string;
  progress_pct?: number;
}

export interface Lesson {
  id: string;
  title: string;
  objective: string;
  content: string;
  quiz?: {
    question: string;
    options: string[];
    correctAnswer: number;
  };
  exercise?: {
    description: string;
    steps: string[];
  };
  completed?: boolean;
  score?: number;
  goal_id: string;
  created_at: string;
}

export interface Progress {
  id: string;
  goal_id: string;
  lesson_id: string;
  score: number;
  time_spent: number; // in minutes
  completed_at: string;
  user_id: string;
}

export interface ReminderSettings {
  id: string;
  user_id: string;
  enabled: boolean;
  window_start: string; // HH:MM format
  window_end: string; // HH:MM format
  channel: 'email' | 'push' | 'both';
  created_at: string;
  updated_at: string;
}

export interface CreateGoalRequest {
  topic: string;
  focus: string;
  level?: 'beginner' | 'intermediate' | 'advanced';
  minutes_per_day?: number;
  channels?: string[];
}

export interface CreateGoalResponse {
  id: string;
  topic: string;
  focus: string;
  plan_version: number;
  created_at: string;
  reused?: boolean;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Template caching types
export interface PlanTemplate {
  id: string;
  signature: string;
  topic: string;
  focus: string | null;
  level: string | null;
  minutes_per_day: number | null;
  locale: string;
  version: number;
  source: string;
  plan_json: any;
  created_at: string;
}

export interface LessonTemplate {
  id: string;
  plan_template_id: string;
  day_index: number;
  version: number;
  model: string;
  lesson_json: any;
  created_at: string;
} 