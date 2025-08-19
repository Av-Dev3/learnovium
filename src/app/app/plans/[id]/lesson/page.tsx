"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/ui/loading-state";
import { ErrorState } from "@/components/ui/error-state";
import { ArrowLeft, BookOpen, Target, Clock, CheckCircle, Loader2 } from "lucide-react";
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
  const router = useRouter();
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
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/app/plans/${goalId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plan
            </Link>
          </Button>
        </div>
        <LoadingState type="lesson" />
      </div>
    );
  }

  if (isError || !lesson) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="hover:bg-muted/50">
            <Link href={`/app/plans/${goalId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plan
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-3">
          {isReused && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
              <BookOpen className="h-3 w-3 mr-1" />
              Cached
            </Badge>
          )}
          <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 rounded-full text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className="font-medium">{lesson.est_minutes} min</span>
          </div>
        </div>
      </div>

      {/* Lesson Header */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20">
        <CardHeader className="text-center pb-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-4">
            <Target className="h-4 w-4" />
            Today&apos;s Learning Focus
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            {lesson.topic}
          </CardTitle>
          <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span className="font-medium">{lesson.est_minutes} minutes estimated</span>
            </div>
            {isReused && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800 border-blue-200">
                <BookOpen className="h-3 w-3 mr-1" />
                Cached Lesson
              </Badge>
            )}
          </div>
        </CardHeader>
      </Card>

      {/* Reading Section */}
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-blue-700 dark:text-blue-300">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <BookOpen className="h-6 w-6" />
            </div>
            Lesson Content
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed text-lg font-medium">
              {lesson.reading}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Quiz Section */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-purple-700 dark:text-purple-300">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              Knowledge Check ({totalQuestions} questions)
            </CardTitle>
            <CardDescription className="text-lg text-muted-foreground">
              Test your understanding of today&apos;s material
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 space-y-6">
            {lesson.quiz.map((question, questionIndex) => (
              <div key={questionIndex} className="space-y-4 p-6 border-2 border-muted/50 rounded-xl bg-muted/20">
                <h4 className="font-bold text-xl text-foreground leading-tight">
                  {questionIndex + 1}. {question.q}
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {question.a.map((answer, answerIndex) => (
                    <div
                      key={answerIndex}
                      className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                        selectedAnswers[questionIndex] === answerIndex
                          ? "border-primary bg-primary/10 shadow-lg ring-2 ring-primary/20"
                          : "border-muted/50 hover:border-primary/50 hover:bg-muted/30 hover:shadow-md"
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
                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${
                          selectedAnswers[questionIndex] === answerIndex
                            ? "border-primary bg-primary text-primary-foreground shadow-md"
                            : "border-muted/50 bg-muted/50 text-muted-foreground"
                        }`}>
                          {String.fromCharCode(65 + answerIndex)}
                        </div>
                        <span className="text-base font-medium leading-relaxed">
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
                className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                disabled={selectedAnswers.length !== totalQuestions}
              >
                Submit Quiz
              </Button>
            ) : (
              <div className="text-center p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl border-2 border-green-200 dark:border-green-800">
                <div className="text-3xl font-bold mb-3 text-green-700 dark:text-green-300">
                  Quiz Results: {correctAnswers}/{totalQuestions} correct
                </div>
                <div className="text-xl mb-4 text-green-600 dark:text-green-400">
                  {correctAnswers === totalQuestions 
                    ? "🎉 Excellent! You've mastered this material!" 
                    : correctAnswers >= totalQuestions / 2
                    ? "👍 Good effort! You're on the right track."
                    : "📚 Keep studying! Review the material and try again."}
                </div>
                <p className="text-green-700 dark:text-green-400 font-medium">
                  {correctAnswers === totalQuestions 
                    ? "You're ready to move forward!" 
                    : "Take your time to understand the concepts before continuing."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Exercise Section */}
      <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-3 text-2xl font-bold text-orange-700 dark:text-orange-300">
            <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
              <Target className="h-6 w-6" />
            </div>
            Practice Exercise
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="prose prose-lg max-w-none">
            <p className="text-foreground leading-relaxed text-lg font-medium">
              {lesson.exercise}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Citations */}
      {lesson.citations && lesson.citations.length > 0 && (
        <Card className="border-0 shadow-md hover:shadow-lg transition-shadow duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3 text-2xl font-bold text-slate-700 dark:text-slate-300">
              <div className="p-2 bg-slate-100 dark:bg-slate-900/30 rounded-lg">
                <BookOpen className="h-6 w-6" />
              </div>
              Sources & References
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="space-y-3">
              {lesson.citations.map((citation, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-muted/30 rounded-lg">
                  <div className="w-2 h-2 bg-slate-400 rounded-full mt-2 flex-shrink-0"></div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {citation}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Section */}
      <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
        <CardContent className="p-8 text-center">
          <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-2xl font-bold mb-3 text-green-800 dark:text-green-200">
            Great job completing today&apos;s lesson!
          </h3>
          <p className="text-green-700 dark:text-green-300 text-lg mb-6">
            Mark this lesson as complete to track your progress and unlock the next one
          </p>
          <MarkCompleteButton 
            goalId={goalId}
            variant="default"
            size="lg"
            className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all duration-300"
          />
        </CardContent>
      </Card>
    </div>
  );
}
