"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { ArrowLeft, BookOpen, Target, Clock, CheckCircle, Brain, Zap, ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { MarkCompleteButton } from "@/app/components/MarkCompleteButton";
import { LessonContentFormatter } from "@/components/ui/lesson-content-formatter";

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
        
        const response = await fetch(`/api/goals/${goalId}/today`, {
          headers: {
            'x-user-timezone': Intl.DateTimeFormat().resolvedOptions().timeZone
          }
        });
        
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
          {/* Header */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" asChild className="hover:bg-[var(--bg)]/50">
              <Link href={`/app/plans/${goalId}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Plan
              </Link>
            </Button>
          </div>

          {/* Lesson Generation Loading Header */}
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-purple-600 to-brand p-8 text-center text-white shadow-2xl">
            {/* Background effects */}
            <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            
            <div className="relative z-10 space-y-6">
              <div className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/10 backdrop-blur-md rounded-full text-sm font-medium">
                <Sparkles className="h-4 w-4 animate-pulse" />
                Generating Your Lesson
              </div>
              
              <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">
                Creating Your Learning Experience
              </h1>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span className="font-medium">Takes about 1-2 minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <Brain className="h-4 w-4" />
                  <span className="font-medium">AI-powered content</span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1: Analyzing */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-blue-950/30 dark:to-indigo-950/30 p-6 border border-blue-200/50 dark:border-blue-800/30">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-blue-400/20 to-indigo-500/20 rounded-full blur-lg animate-pulse" />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">Analyzing Your Goal</h3>
                  <p className="text-sm text-blue-700 dark:text-blue-200">Understanding your learning objectives and current progress</p>
                </div>
                <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full animate-pulse" style={{width: '60%'}}></div>
                </div>
              </div>
            </div>

            {/* Step 2: Researching */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 to-violet-100 dark:from-purple-950/30 dark:to-violet-950/30 p-6 border border-purple-200/50 dark:border-purple-800/30">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-purple-400/20 to-violet-500/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '0.5s'}} />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">Researching Content</h3>
                  <p className="text-sm text-purple-700 dark:text-purple-200">Gathering relevant information and creating engaging material</p>
                </div>
                <div className="w-full bg-purple-200 dark:bg-purple-800 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full animate-pulse" style={{width: '40%'}}></div>
                </div>
              </div>
            </div>

            {/* Step 3: Creating */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 dark:from-emerald-950/30 dark:to-teal-950/30 p-6 border border-emerald-200/50 dark:border-emerald-800/30">
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-teal-500/20 rounded-full blur-lg animate-pulse" style={{animationDelay: '1s'}} />
              <div className="relative z-10 space-y-4">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-emerald-900 dark:text-emerald-100 mb-2">Creating Exercises</h3>
                  <p className="text-sm text-emerald-700 dark:text-emerald-200">Designing interactive quizzes and practice activities</p>
                </div>
                <div className="w-full bg-emerald-200 dark:bg-emerald-800 rounded-full h-2">
                  <div className="bg-emerald-500 h-2 rounded-full animate-pulse" style={{width: '20%'}}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Lesson Content Skeleton */}
          <div className="space-y-6">
            {/* Reading Section Skeleton */}
            <div className="p-8 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Lesson Content</h2>
                  <p className="text-[var(--fg)]/70">Read and understand the core concepts</p>
                </div>
              </div>
              <LoadingState type="lesson" />
            </div>

            {/* Quiz Section Skeleton */}
            <div className="p-8 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Knowledge Check</h2>
                  <p className="text-[var(--fg)]/70">Questions to test your understanding</p>
                </div>
              </div>
              <LoadingState type="lesson" />
            </div>

            {/* Exercise Section Skeleton */}
            <div className="p-8 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold text-[var(--fg)]">Practice Exercise</h2>
                  <p className="text-[var(--fg)]/70">Apply what you&apos;ve learned</p>
                </div>
              </div>
              <LoadingState type="lesson" />
            </div>
          </div>

          {/* Bottom Message */}
          <div className="text-center py-8">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-[var(--bg)]/50 border border-[var(--border)]/40 rounded-full text-sm text-[var(--fg)]/70 backdrop-blur-sm">
              <Clock className="h-4 w-4" />
              <span>Please wait while we create your personalized lesson...</span>
            </div>
          </div>
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
      <div className="max-w-4xl mx-auto px-3 sm:px-6 py-3 sm:py-8 space-y-4 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            asChild 
            className="hover:bg-[var(--bg)]/50 w-fit text-sm"
          >
            <Link href={`/app/plans/${goalId}`}>
              <ArrowLeft className="h-4 w-4 mr-1 sm:mr-2" />
              Back to Plan
            </Link>
          </Button>
          
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {isReused && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200 px-2 py-1 text-xs">
                <BookOpen className="h-3 w-3 mr-1" />
                Cached
              </Badge>
            )}
            <div className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-[var(--bg)]/50 border border-[var(--border)]/40 rounded-xl sm:rounded-2xl text-xs sm:text-sm text-[var(--fg)]/80 backdrop-blur-sm">
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="font-medium">{lesson.est_minutes} min</span>
            </div>
          </div>
        </div>

        {/* Lesson Header */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-3xl bg-gradient-to-r from-brand via-purple-600 to-brand p-3 sm:p-8 text-center text-white shadow-2xl">
          {/* Background effects */}
          <div className="absolute -top-4 -left-4 sm:-top-10 sm:-left-10 h-32 w-32 sm:h-80 sm:w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 sm:-bottom-10 sm:-right-10 h-24 w-24 sm:h-80 sm:w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          
          <div className="relative z-10 space-y-3 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 sm:px-6 py-1.5 sm:py-3 border border-white/20 bg-white/10 backdrop-blur-md rounded-full text-xs sm:text-sm font-medium">
              <Target className="h-3 w-3 sm:h-4 sm:w-4" />
              Today&apos;s Learning Focus
            </div>
            
            <h1 className="text-lg sm:text-3xl md:text-5xl font-bold leading-tight tracking-tight px-1">
              {lesson.topic}
            </h1>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="font-medium">{lesson.est_minutes} minutes estimated</span>
              </div>
              {isReused && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30 text-xs">
                  <BookOpen className="h-2 w-2 sm:h-3 sm:w-3 mr-1" />
                  Cached Lesson
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Reading Section */}
        <div className="p-3 sm:p-8 rounded-xl sm:rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-brand to-purple-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <BookOpen className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-2xl md:text-3xl font-bold text-[var(--fg)]">Lesson Content</h2>
              <p className="text-xs sm:text-base text-[var(--fg)]/70">Read and understand the core concepts</p>
            </div>
          </div>
          
          {lesson.reading ? (
            <LessonContentFormatter content={lesson.reading} />
          ) : (
            <div className="p-4 bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
              <p className="text-yellow-800 dark:text-yellow-200">
                <strong>Debug:</strong> No reading content available. 
                <br />Lesson data: {JSON.stringify(lesson, null, 2)}
              </p>
            </div>
          )}
        </div>

        {/* Walkthrough Section */}
        {lesson.walkthrough && lesson.walkthrough.trim() && (
          <div className="p-3 sm:p-8 rounded-xl sm:rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Target className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-2xl md:text-3xl font-bold text-[var(--fg)]">Key Points and Definitions</h2>
                <p className="text-xs sm:text-base text-[var(--fg)]/70">Essential concepts and key terms from today&apos;s lesson</p>
              </div>
            </div>
            
            <LessonContentFormatter content={lesson.walkthrough} />
          </div>
        )}

        {/* Quiz Section */}
        {lesson.quiz && lesson.quiz.length > 0 && (
          <div className="p-3 sm:p-8 rounded-xl sm:rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
            <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-8">
              <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                <Brain className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h2 className="text-base sm:text-2xl md:text-3xl font-bold text-[var(--fg)]">Knowledge Check</h2>
                <p className="text-xs sm:text-base text-[var(--fg)]/70">{totalQuestions} questions to test your understanding</p>
              </div>
            </div>
            
            <div className="space-y-4 sm:space-y-8">
              {lesson.quiz.map((question, questionIndex) => (
                <div key={questionIndex} className="p-3 sm:p-6 border border-[var(--border)]/30 rounded-lg sm:rounded-2xl bg-[var(--bg)]/20 backdrop-blur-sm">
                  <h3 className="font-bold text-base sm:text-xl md:text-2xl text-[var(--fg)] leading-tight mb-3 sm:mb-6">
                    {questionIndex + 1}. {question.q}
                  </h3>
                  
                  <div className="grid grid-cols-1 gap-2 sm:gap-4">
                    {question.a.map((answer, answerIndex) => (
                      <div
                        key={answerIndex}
                        className={`p-2.5 sm:p-4 rounded-lg sm:rounded-2xl border cursor-pointer transition-all duration-300 hover:scale-[1.01] sm:hover:scale-[1.02] ${
                          selectedAnswers[questionIndex] === answerIndex
                            ? "border-brand bg-brand/10 shadow-md ring-1 ring-brand/20"
                            : "border-[var(--border)]/40 hover:border-brand/50 hover:bg-[var(--bg)]/30 hover:shadow-sm"
                        } ${
                          quizSubmitted && answerIndex === question.correct_index
                            ? "border-green-500 bg-green-50 dark:bg-green-950 shadow-md ring-1 ring-green-200"
                            : ""
                        } ${
                          quizSubmitted && 
                          selectedAnswers[questionIndex] === answerIndex && 
                          answerIndex !== question.correct_index
                            ? "border-red-500 bg-red-50 dark:bg-red-950 shadow-md ring-1 ring-red-200"
                            : ""
                        }`}
                        onClick={() => !quizSubmitted && handleAnswerSelect(questionIndex, answerIndex)}
                      >
                        <div className="flex items-start gap-2 sm:gap-4">
                          <div className={`w-6 h-6 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center text-xs sm:text-sm font-bold flex-shrink-0 ${
                            selectedAnswers[questionIndex] === answerIndex
                              ? "border-brand bg-brand text-white shadow-sm"
                              : "border-[var(--border)]/50 bg-[var(--bg)]/50 text-[var(--fg)]/60"
                          }`}>
                            {String.fromCharCode(65 + answerIndex)}
                          </div>
                          <span className="text-sm sm:text-lg font-medium leading-relaxed text-[var(--fg)]">
                            {answer}
                          </span>
                        </div>
                        {quizSubmitted && answerIndex === question.correct_index && (
                          <CheckCircle className="h-4 w-4 sm:h-6 sm:w-6 text-green-600 ml-auto mt-1" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              {!quizSubmitted ? (
                <Button 
                  onClick={handleQuizSubmit}
                  className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl sm:rounded-2xl"
                  disabled={selectedAnswers.length !== totalQuestions}
                >
                  Submit Quiz
                </Button>
              ) : (
                <div className="text-center p-4 sm:p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl sm:rounded-3xl border-2 border-green-200 dark:border-green-800">
                  <div className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 text-green-700 dark:text-green-300">
                    Quiz Results: {correctAnswers}/{totalQuestions} correct
                  </div>
                  <div className="text-lg sm:text-xl mb-4 sm:mb-6 text-green-600 dark:text-green-400">
                    {correctAnswers === totalQuestions 
                      ? "🎉 Excellent! You&apos;ve mastered this material!" 
                      : correctAnswers >= totalQuestions / 2
                      ? "👍 Good effort! You&apos;re on the right track."
                      : "📚 Keep studying! Review the material and try again."}
                  </div>
                  <p className="text-green-700 dark:text-green-400 font-medium text-base sm:text-lg">
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
        <div className="p-3 sm:p-8 rounded-xl sm:rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/30 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-6">
            <div className="w-10 h-10 sm:w-16 sm:h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-lg sm:rounded-2xl flex items-center justify-center flex-shrink-0">
              <Zap className="h-5 w-5 sm:h-8 sm:w-8 text-white" />
            </div>
            <div>
              <h2 className="text-base sm:text-2xl md:text-3xl font-bold text-[var(--fg)]">Practice Exercise</h2>
              <p className="text-xs sm:text-base text-[var(--fg)]/70">Apply what you&apos;ve learned</p>
            </div>
          </div>
          
          <LessonContentFormatter content={lesson.exercise} />
        </div>


        {/* Completion Section */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-3xl bg-gradient-to-r from-green-500 via-emerald-500 to-green-600 p-3 sm:p-8 text-center text-white shadow-2xl">
          {/* Background effects */}
          <div className="absolute -top-4 -left-4 sm:-top-10 sm:-left-10 h-32 w-32 sm:h-80 sm:w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-4 -right-4 sm:-bottom-10 sm:-right-10 h-24 w-24 sm:h-80 sm:w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          
          <div className="relative z-10 space-y-3 sm:space-y-6">
            <div className="w-12 h-12 sm:w-20 sm:h-20 mx-auto bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center">
              <CheckCircle className="h-6 w-6 sm:h-10 sm:w-10 text-white" />
            </div>
            
            <h3 className="text-lg sm:text-2xl md:text-3xl font-bold px-1">
              Great job completing today&apos;s lesson!
            </h3>
            
            <p className="text-sm sm:text-lg text-green-100 max-w-2xl mx-auto px-1">
              Mark this lesson as complete to track your progress and unlock the next one
            </p>
            
            <MarkCompleteButton 
              goalId={goalId}
              variant="default"
              size="lg"
              className="bg-white text-green-600 hover:bg-green-50 shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg sm:rounded-2xl px-4 sm:px-8 py-2.5 sm:py-4 text-sm sm:text-lg font-semibold"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
