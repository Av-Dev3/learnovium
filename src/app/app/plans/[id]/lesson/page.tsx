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

  const correctAnswers = selectedAnswers.filter((answer, index) => 
    answer === lesson.quiz[index]?.correct_index
  ).length;
  const totalQuestions = lesson.quiz.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/app/plans/${goalId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Plan
            </Link>
          </Button>
        </div>
        <div className="flex items-center gap-2">
          {isReused && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              Cached Lesson
            </Badge>
          )}
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            {lesson.est_minutes} min
          </div>
        </div>
      </div>

      {/* Lesson Header */}
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{lesson.topic}</CardTitle>
          <CardDescription className="text-lg">
            Today&apos;s Learning Focus
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Reading Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Reading
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed text-lg">{lesson.reading}</p>
        </CardContent>
      </Card>

      {/* Walkthrough Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Walkthrough
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed text-lg">{lesson.walkthrough}</p>
        </CardContent>
      </Card>

      {/* Quiz Section */}
      {lesson.quiz && lesson.quiz.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Quiz ({totalQuestions} questions)
            </CardTitle>
            <CardDescription>
              Test your understanding of today&apos;s material
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {lesson.quiz.map((question, questionIndex) => (
              <div key={questionIndex} className="space-y-3">
                <h4 className="font-semibold text-lg">{question.q}</h4>
                <div className="space-y-2">
                  {question.a.map((answer, answerIndex) => (
                    <div
                      key={answerIndex}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        selectedAnswers[questionIndex] === answerIndex
                          ? "border-primary bg-primary/10"
                          : "border-border hover:border-primary/50"
                      } ${
                        quizSubmitted && answerIndex === question.correct_index
                          ? "border-green-500 bg-green-50 dark:bg-green-950"
                          : ""
                      } ${
                        quizSubmitted && 
                        selectedAnswers[questionIndex] === answerIndex && 
                        answerIndex !== question.correct_index
                          ? "border-red-500 bg-red-50 dark:bg-red-950"
                          : ""
                      }`}
                      onClick={() => !quizSubmitted && handleAnswerSelect(questionIndex, answerIndex)}
                    >
                      <span className="text-sm font-medium">
                        {String.fromCharCode(65 + answerIndex)}. {answer}
                      </span>
                      {quizSubmitted && answerIndex === question.correct_index && (
                        <CheckCircle className="h-4 w-4 text-green-600 ml-2 inline" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
            
            {!quizSubmitted ? (
              <Button 
                onClick={handleQuizSubmit}
                className="w-full"
                disabled={selectedAnswers.length !== totalQuestions}
              >
                Submit Quiz
              </Button>
            ) : (
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <p className="text-lg font-semibold mb-2">
                  Quiz Results: {correctAnswers}/{totalQuestions} correct
                </p>
                <p className="text-muted-foreground">
                  {correctAnswers === totalQuestions 
                    ? "Excellent! You've mastered this material." 
                    : "Good effort! Review the material and try again."}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Exercise Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Exercise
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground leading-relaxed text-lg">{lesson.exercise}</p>
        </CardContent>
      </Card>

      {/* Citations */}
      {lesson.citations && lesson.citations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Sources</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lesson.citations.map((citation, index) => (
                <p key={index} className="text-sm text-muted-foreground">
                  {citation}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Completion Section */}
      <Card className="border-green-200 bg-green-50/50">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2 text-green-800">
            Great job completing today&apos;s lesson!
          </h3>
          <p className="text-green-700 mb-4">
            Mark this lesson as complete to track your progress
          </p>
          <MarkCompleteButton 
            goalId={goalId}
            variant="default"
            size="lg"
          />
        </CardContent>
      </Card>
    </div>
  );
}
