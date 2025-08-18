import { CachedBadge } from "./cached-badge";
import { Badge } from "./badge";
import { Clock, BookOpen, Target, Brain } from "lucide-react";

interface LessonDisplayProps {
  lesson: {
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
  };
  isReused?: boolean;
  className?: string;
}

export function LessonDisplay({ lesson, isReused = false, className = "" }: LessonDisplayProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with cached indicator */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{lesson.topic}</h2>
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{lesson.est_minutes} minutes</span>
          </div>
        </div>
        {isReused && <CachedBadge />}
      </div>

      {/* Reading Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Reading</h3>
        </div>
        <p className="text-foreground leading-relaxed">{lesson.reading}</p>
      </div>

      {/* Walkthrough Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Walkthrough</h3>
        </div>
        <p className="text-foreground leading-relaxed">{lesson.walkthrough}</p>
      </div>

      {/* Quiz Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Quiz</h3>
        </div>
        <div className="space-y-4">
          {lesson.quiz.map((question, index) => (
            <div key={index} className="space-y-2">
              <p className="font-medium">{question.q}</p>
              <div className="grid grid-cols-1 gap-2">
                {question.a.map((option, optionIndex) => (
                  <div
                    key={optionIndex}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      optionIndex === question.correct_index
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-sm font-medium">
                      {String.fromCharCode(65 + optionIndex)}. {option}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Exercise Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Exercise</h3>
        </div>
        <p className="text-foreground leading-relaxed">{lesson.exercise}</p>
      </div>

      {/* Citations */}
      {lesson.citations.length > 0 && (
        <div className="pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            <strong>Sources:</strong> {lesson.citations.join(", ")}
          </p>
        </div>
      )}
    </div>
  );
}
