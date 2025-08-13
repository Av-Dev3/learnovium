// Example usage of MarkCompleteButton component
// This file demonstrates different ways to use the MarkCompleteButton

import { MarkCompleteButton } from "./MarkCompleteButton";

// Example 1: Basic usage with just goalId
export function BasicExample() {
  return (
    <MarkCompleteButton 
      goalId="123e4567-e89b-12d3-a456-426614174000" 
    />
  );
}

// Example 2: With specific day index
export function DaySpecificExample() {
  return (
    <MarkCompleteButton 
      goalId="123e4567-e89b-12d3-a456-426614174000"
      dayIndex={5}
    />
  );
}

// Example 3: Custom styling
export function CustomStylingExample() {
  return (
    <MarkCompleteButton 
      goalId="123e4567-e89b-12d3-a456-426614174000"
      variant="outline"
      size="sm"
      className="w-full"
    />
  );
}

// Example 4: In a lesson card
export function LessonCardExample() {
  const goalId = "123e4567-e89b-12d3-a456-426614174000";
  const dayIndex = 3;
  
  return (
    <div className="border rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">Lesson Title</h3>
      <p className="text-muted-foreground mb-4">
        Lesson description and content...
      </p>
      
      <div className="flex gap-2">
        <button className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
          Start Lesson
        </button>
        
        <MarkCompleteButton 
          goalId={goalId}
          dayIndex={dayIndex}
          variant="secondary"
          size="sm"
        />
      </div>
    </div>
  );
}

// Example 5: In a plan timeline
export function PlanTimelineExample() {
  const goalId = "123e4567-e89b-12d3-a456-426614174000";
  
  return (
    <div className="space-y-4">
      {[1, 2, 3, 4, 5].map((day) => (
        <div key={day} className="border rounded-lg p-4">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">Day {day}</h4>
              <p className="text-sm text-muted-foreground">
                Lesson objective for day {day}
              </p>
            </div>
            
            <MarkCompleteButton 
              goalId={goalId}
              dayIndex={day}
              variant="outline"
              size="sm"
            />
          </div>
        </div>
      ))}
    </div>
  );
} 