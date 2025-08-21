"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { ArrowLeft, BookOpen, Target, Clock, CheckCircle, Brain, Zap, ExternalLink } from "lucide-react";
import Link from "next/link";
import { MarkCompleteButton } from "@/app/components/MarkCompleteButton";

interface Lesson {
  topic: string;
  reading: string;
  walkthrough: string;
  quiz: Array<{
    q: string;
    a: string[];
    correct_index: number;
  }>;
  exercise: string;
  citations: string[];
  est_minutes: number;
}

interface LessonResponse {
  reused: boolean;
  lesson: Lesson;
}

export default function LessonPage() {
  const params = useParams();
  const goalId = params.id as string;
  
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isReused, setIsReused] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  useEffect(() => {
    if (!goalId) return;

    const fetchLesson = async () => {
      try {
        setIsLoading(true);
        setIsError(false);
        
        const response = await fetch(`/api/goals/${goalId}/today`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch lesson: ${response.status}`);
        }
        
        const data: LessonResponse = await response.json();
        setLesson(data.lesson);
        setIsReused(data.reused);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setIsError(true);
        setError(err instanceof Error ? err.message : "Failed to load lesson");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLesson();
  }, [goalId]);

  const handleQuizSubmit = () => {
    setQuizSubmitted(true);
  };

  const handleAnswerSelect = (questionIndex: number, answerIndex: number) => {
    setSelectedAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[questionIndex] = answerIndex;
      return newAnswers;
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hover:bg-[var(--bg)]/50">
              <Link href={`/app/plans/${goalId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plan
              </Link>
            </Button>
          </div>
          <LoadingState type="lesson" />
        </div>
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
        <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hover:bg-[var(--bg)]/50">
              <Link href={`/app/plans/${goalId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plan
              </Link>
            </Button>
          </div>
          <ErrorState
            title="Lesson Error"
            message={error || "Failed to load lesson"}
            onRetry={() => window.location.reload()}
          />
        </div>
      </div>
    );
  }

  console.log("Lesson page: Received lesson data:", {
    topic: lesson.topic,
    reading: lesson.reading?.substring(0, 100) + "...",
    walkthrough: lesson.walkthrough?.substring(0, 100) + "...",
    quiz_count: lesson.quiz?.length || 0,
    exercise: lesson.exercise?.substring(0, 100) + "...",
    est_minutes: lesson.est_minutes
  });

  const correctAnswers = selectedAnswers.filter((answer, index) => 
    answer === lesson.quiz[index]?.correct_index
  ).length;
  const totalQuestions = lesson.quiz.length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="hover:bg-[var(--bg)]/50 w-fit"
          >
            <Link href={`/app/plans/${goalId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plan
            </Link>
          </Button>
          
          <div className="flex flex-wrap items-center gap-3">
            {isReused && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1.5">
                <BookOpen className="h-3 w-3 mr-1" />
                Cached
              </Badge>
            )}
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--bg)]/50 border border-[var(--border)]/40 rounded-2xl text-sm text-[var(--fg)]/80 backdrop-blur-sm">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{lesson.est_minutes} min</span>
            </div>
          </div>
        </div>

        {/* Lesson Header */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-purple-600 to-brand p-8 text-center text-white shadow-2xl">
          {/* Background effects */}
          <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          
          <div className="relative z-10 space-y-6">
            <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium">
              <Target className="h-4 w-4" />
              Today&apos;s Learning Focus
            </div>
            
            <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
              {lesson.topic}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">{lesson.est_minutes} minutes estimated</span>
              </div>
              {isReused && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Cached Lesson
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Reading Section */}
        <div className="p-8 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center">
              <BookOpen className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Lesson Content</h2>
              <p className="text-[var(--fg)]/70">Read and understand the core concepts</p>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="text-[var(--fg)] leading-relaxed text-lg md:text-xl font-normal space-y-6">
              {lesson.reading.split('\n').map((paragraph, index) => (
                <p key={index} className="leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Quiz Section */}
        {lesson.quiz && lesson.quiz.length > 0 && (
          <div className="p-8 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <Brain className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Knowledge Check</h2>
                <p className="text-[var(--fg)]/70">{totalQuestions} questions to test your understanding</p>
              </div>
            </div>
            
            <div className="space-y-8">
              {lesson.quiz.map((question, questionIndex) => (
                <div key={questionIndex} className="p-6 border-2 border-[var(--border)]/40 rounded-2xl bg-[var(--bg)]/30 backdrop-blur-sm">
                  <h3 className="font-bold text-xl md:text-2xl text-[var(--fg)] leading-tight mb-6">
                    {questionIndex + 1}. {question.q}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-4">
                    {question.a.map((answer, answerIndex) => (
                      <div
                        key={answerIndex}
                        className={`p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                          selectedAnswers[questionIndex] === answerIndex
                            ? "border-brand bg-brand/10 shadow-lg ring-2 ring-brand/20"
                            : "border-[var(--border)]/50 hover:border-brand/50 hover:bg-[var(--bg)]/30 hover:shadow-md"
                        } ${
                          quizSubmitted && answerIndex === question.correct_index
                            ? "border-green-500 bg-green-50 dark:bg-green-950 shadow-lg ring-2 ring-green-200"
                            : ""
                        } ${
                          quizSubmitted && 
                          selectedAnswers[questionIndex] === answerIndex && 
                          answerIndex !== question.correct_index
                            ? "border-red-500 bg-red-50 dark:bg-red-950 shadow-lg ring-2 ring-red-200"
                            : ""
                        }`}
                        onClick={() => !quizSubmitted && handleAnswerSelect(questionIndex, answerIndex)}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                            selectedAnswers[questionIndex] === answerIndex
                              ? "border-brand bg-brand text-white shadow-md"
                              : "border-[var(--border)]/50 bg-[var(--bg)]/50 text-[var(--fg)]/60"
                          }`}>
                            {String.fromCharCode(65 + answerIndex)}
                          </div>
                          <span className="text-lg font-medium leading-relaxed text-[var(--fg)]">
                            {answer}
                          </span>
                        </div>
                        {quizSubmitted && answerIndex === question.correct_index && (
                          <CheckCircle className="h-6 w-6 text-green-600 ml-auto mt-2" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {!quizSubmitted ? (
                <Button 
                  onClick={handleQuizSubmit}
                  className="w-full py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl"
                  disabled={selectedAnswers.length !== totalQuestions}
                >
                  Submit Quiz
                </Button>
              ) : (
                <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-3xl border-2 border-green-200 dark:border-green-800">
                  <div className="text-3xl md:text-4xl font-bold mb-4 text-green-700 dark:text-green-300">
                    Quiz Results: {correctAnswers}/{totalQuestions} correct
                  </div>
                  <div className="text-xl mb-6 text-green-600 dark:text-green-400">
                    {correctAnswers === totalQuestions 
                      ? "🎉 Excellent! You&apos;ve mastered this material!" 
                      : correctAnswers >= totalQuestions / 2
                      ? "👍 Good effort! You&apos;re on the right track."
                      : "📚 Keep studying! Review the material and try again."}
                  </div>
                  <p className="text-green-700 dark:text-green-400 font-medium text-lg">
                    {correctAnswers === totalQuestions 
                      ? "You&apos;re ready to move forward!" 
                      : "Take your time to understand the concepts before continuing."}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Exercise Section */}
        <div className="p-8 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
              <Zap className="h-8 w-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Practice Exercise</h2>
              <p className="text-[var(--fg)]/70">Apply what you&apos;ve learned</p>
            </div>
          </div>
          
          <div className="prose prose-lg max-w-none">
            <div className="text-[var(--fg)] leading-relaxed text-lg md:text-xl font-normal space-y-6">
              {lesson.exercise.split('\n').map((paragraph, index) => (
                <p key={index} className="leading-8">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </div>

        {/* Citations */}
        {lesson.citations && lesson.citations.length > 0 && (
          <div className="p-8 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-slate-500 to-slate-600 rounded-2xl flex items-center justify-center">
                <ExternalLink className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Sources & References</h2>
                <p className="text-[var(--fg)]/70">Learn more from these resources</p>
              </div>
            </div>
            
            <div className="space-y-4">
              {lesson.citations.map((citation, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-[var(--bg)]/30 rounded-2xl border border-[var(--border)]/30">
                  <div className="w-3 h-3 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    {citation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Completion Section */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-8 text-center text-white shadow-2xl">
          {/* Background effects */}
          <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          
          <div className="relative z-10 space-y-6">
            <div className="w-20 h-20 mx-auto bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            
            <h3 className="text-2xl md:text-3xl font-bold">
              Great job completing today&apos;s lesson!
            </h3>
            
            <p className="text-lg text-green-100 max-w-2xl mx-auto">
              Mark this lesson as complete to track your progress and unlock the next one
            </p>
            
            <MarkCompleteButton 
              goalId={goalId}
              variant="default"
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl px-8 py-4 text-lg font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
