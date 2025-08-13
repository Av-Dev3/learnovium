import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BookOpen, Target, Brain, Zap } from "lucide-react";

interface LessonCardProps {
  lesson: {
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
  };
  onComplete?: (lessonId: string) => void;
  onStart?: (lessonId: string) => void;
}

export function LessonCard({ lesson, onStart }: LessonCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{lesson.title}</CardTitle>
            <CardDescription className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              {lesson.objective}
            </CardDescription>
          </div>
          {lesson.completed && (
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              Completed
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
            <BookOpen className="h-4 w-4" />
            Content
          </div>
          <p className="text-sm leading-relaxed">{lesson.content}</p>
        </div>

        {lesson.quiz && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Brain className="h-4 w-4" />
              Quiz
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm font-medium mb-2">{lesson.quiz.question}</p>
              <div className="space-y-2">
                {lesson.quiz.options.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name={`quiz-${lesson.id}`}
                      id={`option-${lesson.id}-${index}`}
                      className="h-3 w-3"
                    />
                    <label htmlFor={`option-${lesson.id}-${index}`} className="text-sm">
                      {option}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {lesson.exercise && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <Zap className="h-4 w-4" />
              Exercise
            </div>
            <div className="rounded-lg border p-3">
              <p className="text-sm font-medium mb-2">{lesson.exercise.description}</p>
              <ol className="list-decimal list-inside space-y-1 text-sm">
                {lesson.exercise.steps.map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        )}

        <div className="flex gap-2 pt-2">
          {!lesson.completed ? (
            <Button onClick={() => onStart?.(lesson.id)} className="flex-1">
              Start Lesson
            </Button>
          ) : (
            <Button variant="outline" className="flex-1" disabled>
              Lesson Complete
            </Button>
          )}
          {lesson.score !== undefined && (
            <Badge variant="outline">
              Score: {lesson.score}%
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
} 