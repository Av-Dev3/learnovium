"use client";

import { Button } from "@/components/ui/button";
import { BookOpen, Target, Brain, Zap } from "lucide-react";

interface LessonCardProps {
  lesson: {
    id: string;
    title: string;
    objective: string;
    content: string;
    day_index?: number;
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
  };
  onComplete?: (lessonId: string) => void;
  onStart?: (lessonId: string) => void;
}

export function LessonCard({ lesson, onStart }: LessonCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl hover:scale-105 transition-all duration-300 hover:border-slate-400/60">
      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              {lesson.day_index && (
                <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-800/30 rounded-full">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wider">
                    Day {lesson.day_index}
                  </span>
                </div>
              )}
              <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors">
                {lesson.title}
              </h3>
            </div>
            <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
              <Target className="h-4 w-4" />
              <span className="text-sm font-medium">{lesson.objective}</span>
            </div>
          </div>
          {lesson.completed && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-900/30 dark:to-teal-900/30 border border-emerald-200/50 dark:border-emerald-800/30 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider">Complete</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                <BookOpen className="h-4 w-4 text-white" />
              </div>
              <span>Content</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300 pl-10">{lesson.content}</p>
          </div>

          {/* Quiz Section */}
          {lesson.quiz && Array.isArray(lesson.quiz.options) && lesson.quiz.options.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-4 w-4 text-white" />
                </div>
                <span>Quiz</span>
              </div>
              <div className="pl-10 space-y-3">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{lesson.quiz.question}</p>
                <div className="space-y-2">
                  {lesson.quiz.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30 hover:bg-white/70 dark:hover:bg-slate-800/50 transition-colors duration-200">
                      <input
                        type="radio"
                        name={`quiz-${lesson.id}`}
                        id={`option-${lesson.id}-${index}`}
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300"
                      />
                      <label htmlFor={`option-${lesson.id}-${index}`} className="text-sm text-slate-700 dark:text-slate-200 cursor-pointer flex-1">
                        {option}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Exercise Section */}
          {lesson.exercise && Array.isArray(lesson.exercise.steps) && lesson.exercise.steps.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <span>Exercise</span>
              </div>
              <div className="pl-10 space-y-3">
                <p className="text-sm font-medium text-slate-600 dark:text-slate-300">{lesson.exercise.description}</p>
                <div className="space-y-2">
                  {lesson.exercise.steps.map((step, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 rounded-2xl bg-white/50 dark:bg-slate-800/30 border border-slate-200/50 dark:border-slate-700/30">
                      <div className="w-6 h-6 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </div>
                      <span className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed">{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 pt-6 mt-6 border-t border-slate-200/50 dark:border-slate-700/30">
          {!lesson.completed ? (
            <Button 
              onClick={() => onStart?.(lesson.id)} 
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl py-3"
            >
              Start Lesson
            </Button>
          ) : (
            <Button 
              variant="outline" 
              className="flex-1 border-2 border-emerald-200 text-emerald-700 dark:border-emerald-800 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 rounded-2xl py-3" 
              disabled
            >
              Lesson Complete
            </Button>
          )}
          {lesson.score !== undefined && (
            <div className="px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 border border-blue-200/50 dark:border-blue-800/30 rounded-2xl">
              <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Score: {lesson.score}%</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 