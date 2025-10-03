"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeft, 
  Clock, 
  CheckCircle, 
  XCircle,
  Play,
  Pause,
  RotateCcw,
  Trophy,
  Target,
  Brain
} from "lucide-react";
import Link from "next/link";

interface QuizQuestion {
  id: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank';
  options?: string[];
  correct_answer_index?: number;
  correct_answer_text?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  explanation: string;
  question_order: number;
}

interface Quiz {
  id: string;
  title: string;
  description: string;
  quiz_type: 'lesson' | 'weekly' | 'custom';
  difficulty: 'easy' | 'medium' | 'hard';
  total_questions: number;
  time_limit_minutes: number;
  completed_at: string | null;
  score: number | null;
  time_taken_seconds: number | null;
  created_at: string;
  learning_goals: {
    topic: string;
    focus: string;
  };
}

interface QuizAnswer {
  question_id: string;
  selected_answer_index?: number;
  selected_answer_text?: string;
  time_spent_seconds?: number;
}

export default function QuizTakingPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const { id } = await params;
        const response = await fetch(`/api/quizzes/${id}`);
        if (response.ok) {
          const data = await response.json();
          setQuiz(data.quiz);
          setQuestions(data.questions);
          setTimeRemaining(data.quiz.time_limit_minutes * 60);
        } else {
          router.push('/app/quiz');
        }
      } catch (error) {
        console.error('Failed to fetch quiz:', error);
        router.push('/app/quiz');
      } finally {
        setIsLoading(false);
      }
    };

    fetchQuiz();
  }, [params, router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isQuizStarted && timeRemaining > 0 && !isQuizCompleted) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            handleSubmitQuiz();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isQuizStarted, timeRemaining, isQuizCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: string, answer: number | string) => {
    setAnswers(prev => {
      const existing = prev.find(a => a.question_id === questionId);
      if (existing) {
        return prev.map(a => 
          a.question_id === questionId 
            ? { ...a, selected_answer_index: typeof answer === 'number' ? answer : undefined, selected_answer_text: typeof answer === 'string' ? answer : undefined }
            : a
        );
      } else {
        return [...prev, { 
          question_id: questionId, 
          selected_answer_index: typeof answer === 'number' ? answer : undefined,
          selected_answer_text: typeof answer === 'string' ? answer : undefined
        }];
      }
    });
  };

  const handleSubmitQuiz = async () => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      const totalTime = quiz!.time_limit_minutes * 60 - timeRemaining;
      const response = await fetch(`/api/quizzes/${quiz!.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers,
          total_time_seconds: totalTime
        })
      });

      if (response.ok) {
        const result = await response.json();
        setQuizResult(result);
        setIsQuizCompleted(true);
      } else {
        const error = await response.json();
        alert(`Failed to submit quiz: ${error.error}`);
      }
    } catch (error) {
      console.error('Quiz submission failed:', error);
      alert('Failed to submit quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-[var(--fg)]/70">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Quiz not found</h1>
          <Button asChild>
            <Link href="/app/quiz">Back to Quizzes</Link>
          </Button>
        </div>
      </div>
    );
  }

  if (isQuizCompleted && quizResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
            <div className="text-center space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                <Trophy className="h-12 w-12 text-white" />
              </div>
              
              <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100">
                Quiz Completed!
              </h1>
              
              <div className="text-6xl font-bold text-green-600 dark:text-green-400">
                {quizResult.score}%
              </div>
              
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {quizResult.correct_answers}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Correct
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {quizResult.total_questions}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Total
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {formatTime(quizResult.time_taken_seconds)}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Time
                  </div>
                </div>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button asChild variant="outline">
                  <Link href="/app/quiz">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Quizzes
                  </Link>
                </Button>
                <Button asChild>
                  <Link href={`/app/quiz/${quiz.id}`}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Retake Quiz
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers.find(a => a.question_id === currentQuestion?.id);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" asChild>
                <Link href="/app/quiz">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Link>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                  {quiz.title}
                </h1>
                <p className="text-slate-600 dark:text-slate-400">
                  {quiz.learning_goals.topic} - {quiz.learning_goals.focus}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Badge className={getDifficultyColor(quiz.difficulty)}>
                {quiz.difficulty}
              </Badge>
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-lg">
                  {formatTime(timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {!isQuizStarted ? (
          /* Quiz Start Screen */
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center">
                <Brain className="h-12 w-12 text-white" />
              </div>
              
              <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
                Ready to Start?
              </h2>
              
              <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                {quiz.description}
              </p>
              
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {quiz.total_questions}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Questions
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {quiz.time_limit_minutes}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Minutes
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {quiz.difficulty}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400">
                    Difficulty
                  </div>
                </div>
              </div>
              
              <Button
                onClick={() => setIsQuizStarted(true)}
                className="bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white px-8 py-4 text-lg"
              >
                <Play className="h-5 w-5 mr-2" />
                Start Quiz
              </Button>
            </div>
          </div>
        ) : (
          /* Quiz Questions */
          <div className="space-y-6">
            {/* Progress Bar */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-4 border border-white/20 dark:border-slate-700/50">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  {Math.round(((currentQuestionIndex + 1) / questions.length) * 100)}%
                </span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-brand to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50">
              <div className="space-y-6">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 flex-1">
                    {currentQuestion.question_text}
                  </h3>
                  <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                    {currentQuestion.difficulty}
                  </Badge>
                </div>

                {/* Answer Options */}
                <div className="space-y-3">
                  {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options && (
                    currentQuestion.options.map((option, index) => (
                      <button
                        key={index}
                        onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                        className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                          currentAnswer?.selected_answer_index === index
                            ? 'border-brand bg-brand/10 text-brand dark:text-brand-300'
                            : 'border-slate-200 dark:border-slate-600 hover:border-brand/50 hover:bg-brand/5'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            currentAnswer?.selected_answer_index === index
                              ? 'border-brand bg-brand text-white'
                              : 'border-slate-300 dark:border-slate-600'
                          }`}>
                            {currentAnswer?.selected_answer_index === index && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                          </div>
                          <span className="font-medium">{option}</span>
                        </div>
                      </button>
                    ))
                  )}

                  {currentQuestion.question_type === 'true_false' && (
                    <div className="grid grid-cols-2 gap-4">
                      {['True', 'False'].map((option, index) => (
                        <button
                          key={option}
                          onClick={() => handleAnswerSelect(currentQuestion.id, option.toLowerCase())}
                          className={`p-4 text-center rounded-xl border-2 transition-all duration-200 ${
                            currentAnswer?.selected_answer_text === option.toLowerCase()
                              ? 'border-brand bg-brand/10 text-brand dark:text-brand-300'
                              : 'border-slate-200 dark:border-slate-600 hover:border-brand/50 hover:bg-brand/5'
                          }`}
                        >
                          <div className="flex items-center justify-center gap-3">
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                              currentAnswer?.selected_answer_text === option.toLowerCase()
                                ? 'border-brand bg-brand text-white'
                                : 'border-slate-300 dark:border-slate-600'
                            }`}>
                              {currentAnswer?.selected_answer_text === option.toLowerCase() && (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </div>
                            <span className="font-medium">{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {currentQuestion.question_type === 'fill_blank' && (
                    <div>
                      <input
                        type="text"
                        value={currentAnswer?.selected_answer_text || ''}
                        onChange={(e) => handleAnswerSelect(currentQuestion.id, e.target.value)}
                        placeholder="Type your answer here..."
                        className="w-full p-4 border-2 border-slate-200 dark:border-slate-600 rounded-xl focus:border-brand focus:ring-4 focus:ring-brand/20 transition-all duration-200"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {currentQuestionIndex === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={isSubmitting}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        <Trophy className="h-4 w-4 mr-2" />
                        Submit Quiz
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                  >
                    Next
                    <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
