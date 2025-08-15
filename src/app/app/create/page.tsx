"use client";

import { useState } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Target, Brain, Clock, Globe, ArrowRight, CheckCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCreateGoal } from "@/app/lib/hooks";
import { success as showSuccess, error as showError } from "@/app/lib/toast";
import { Badge } from "@/components/ui/badge";

type Step = "topic" | "preferences" | "confirm";

export default function CreateGoal() {
  const router = useRouter();
  const { createGoal, isLoading, error } = useCreateGoal();
  const [currentStep, setCurrentStep] = useState<Step>("topic");
  const [form, setForm] = useState({
    topic: "",
    focus: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    minutesPerDay: 30,
    channels: [] as string[]
  });

  const availableChannels = [
    { id: "video", label: "Video Lessons", icon: Globe },
    { id: "reading", label: "Reading Materials", icon: Brain },
    { id: "exercises", label: "Practice Exercises", icon: Target },
    { id: "quizzes", label: "Knowledge Quizzes", icon: CheckCircle }
  ];

  const handleNext = () => {
    if (currentStep === "topic" && form.topic && form.focus) {
      setCurrentStep("preferences");
    } else if (currentStep === "preferences") {
      setCurrentStep("confirm");
    }
  };

  const handleBack = () => {
    if (currentStep === "preferences") {
      setCurrentStep("topic");
    } else if (currentStep === "confirm") {
      setCurrentStep("preferences");
    }
  };

  const handleSubmit = async () => {
    try {
      const result = await createGoal({
        topic: form.topic,
        focus: form.focus,
        level: form.level,
        minutes_per_day: form.minutesPerDay,
        channels: form.channels
      });

      if (result) {
        showSuccess("Learning goal created successfully!");
        router.push("/app");
      } else {
        showError("Failed to create learning goal");
      }
    } catch {
      showError("Failed to create learning goal");
    }
  };

  const toggleChannel = (channel: string) => {
    setForm(prev => ({
      ...prev,
      channels: prev.channels.includes(channel)
        ? prev.channels.filter(c => c !== channel)
        : [...prev.channels, channel]
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Header skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="h-6 sm:h-8 w-48 sm:w-64 bg-muted rounded animate-pulse mb-2" />
          <div className="h-4 sm:h-5 w-72 sm:w-96 bg-muted rounded animate-pulse" />
        </div>

        {/* Progress Bar skeleton */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <div className="h-3 w-20 sm:h-4 sm:w-24 bg-muted rounded animate-pulse" />
            <div className="h-3 w-12 sm:h-4 sm:w-16 bg-muted rounded animate-pulse" />
          </div>
          <div className="w-full bg-muted rounded-full h-2 animate-pulse" />
        </div>

        {/* Form skeleton */}
        <LoadingState type="form" />
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <header className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2">Create Learning Goal</h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Set up a personalized learning path tailored to your needs
        </p>
      </header>

      {/* Progress Bar */}
      <section aria-labelledby="progress-heading">
        <h2 id="progress-heading" className="sr-only">Creation Progress</h2>
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Step {currentStep === "topic" ? 1 : currentStep === "preferences" ? 2 : 3} of 3</span>
            <span className="text-sm text-muted-foreground">{getStepProgress()}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${getStepProgress()}%` }}
              role="progressbar"
              aria-valuenow={getStepProgress()}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Creation progress"
            />
          </div>
        </div>
      </section>

      {/* Step Content */}
      {currentStep === "topic" && (
        <section aria-labelledby="topic-heading">
          <h2 id="topic-heading" className="sr-only">Topic and Focus</h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="topic">What do you want to learn?</Label>
              <Input
                id="topic"
                placeholder="e.g., Python programming, Spanish language, Data science"
                value={form.topic}
                onChange={(e) => setForm(prev => ({ ...prev, topic: e.target.value }))}
                className="text-base sm:text-lg"
                aria-describedby="topic-help"
              />
              <p id="topic-help" className="text-xs sm:text-sm text-muted-foreground">
                Choose a broad learning area that interests you
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="focus">What&apos;s your specific focus?</Label>
              <Textarea
                id="focus"
                placeholder="e.g., Building web applications, Conversational skills, Machine learning basics"
                value={form.focus}
                onChange={(e) => setForm(prev => ({ ...prev, focus: e.target.value }))}
                rows={3}
                aria-describedby="focus-help"
              />
              <p id="focus-help" className="text-xs sm:text-sm text-muted-foreground">
                Be specific about what you want to achieve
              </p>
            </div>

            <div className="flex justify-end">
              <Button onClick={handleNext} disabled={!form.topic || !form.focus} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none">
                Next <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {currentStep === "preferences" && (
        <section aria-labelledby="preferences-heading">
          <h2 id="preferences-heading" className="sr-only">Learning Preferences</h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="space-y-2">
              <Label htmlFor="level">What&apos;s your current level?</Label>
              <select
                id="level"
                value={form.level}
                onChange={(e) => setForm(prev => ({ ...prev, level: e.target.value as "beginner" | "intermediate" | "advanced" }))}
                className="w-full px-3 py-2 border rounded-md bg-background"
                aria-describedby="level-help"
              >
                <option value="beginner">Beginner - New to the topic</option>
                <option value="intermediate">Intermediate - Some experience</option>
                <option value="advanced">Advanced - Looking to master</option>
              </select>
              <p id="level-help" className="text-xs sm:text-sm text-muted-foreground">
                This helps us tailor the content to your experience
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="minutesPerDay">How many minutes per day?</Label>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <Input
                  id="minutesPerDay"
                  type="number"
                  min="15"
                  max="120"
                  step="15"
                  value={form.minutesPerDay}
                  onChange={(e) => setForm(prev => ({ ...prev, minutesPerDay: parseInt(e.target.value) || 30 }))}
                  className="w-20 sm:w-24"
                  aria-describedby="time-help"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
              <p id="time-help" className="text-xs sm:text-sm text-muted-foreground">
                Choose a realistic daily commitment
              </p>
            </div>

            <div className="space-y-3">
              <Label>Learning channels (select all that apply)</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableChannels.map((channel) => {
                  const Icon = channel.icon;
                  const isSelected = form.channels.includes(channel.id);
                  
                  return (
                    <div
                      key={channel.id}
                      className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                        isSelected 
                          ? "border-primary bg-primary/5" 
                          : "border-muted hover:border-muted-foreground/50"
                      }`}
                      onClick={() => toggleChannel(channel.id)}
                      role="checkbox"
                      aria-checked={isSelected}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          toggleChannel(channel.id);
                        }
                      }}
                    >
                      <Switch checked={isSelected} onCheckedChange={() => toggleChannel(channel.id)} />
                      <Icon className={`h-5 w-5 ${isSelected ? "text-primary" : "text-muted-foreground"}`} aria-hidden="true" />
                      <span className={isSelected ? "font-medium" : ""}>{channel.label}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleNext} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                Next <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {currentStep === "confirm" && (
        <section aria-labelledby="confirm-heading">
          <h2 id="confirm-heading" className="sr-only">Review Your Learning Goal</h2>
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-muted/50 rounded-lg p-4 sm:p-6 space-y-3 sm:space-y-4">
              <h3 className="text-lg font-semibold">Review Your Learning Goal</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Topic</Label>
                  <p className="font-medium">{form.topic}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Focus</Label>
                  <p className="font-medium">{form.focus}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Level</Label>
                  <p className="font-medium capitalize">{form.level}</p>
                </div>
                
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Daily Commitment</Label>
                  <p className="font-medium">{form.minutesPerDay} minutes</p>
                </div>
              </div>

              {form.channels.length > 0 && (
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Learning Channels</Label>
                  <div className="flex flex-wrap gap-2">
                    {form.channels.map(channelId => {
                      const channel = availableChannels.find(c => c.id === channelId);
                      return channel ? (
                        <Badge key={channelId} variant="secondary">
                          {channel.label}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleSubmit} disabled={isLoading} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none">
                {isLoading ? "Creating..." : "Create Learning Goal"}
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-destructive/10 border border-destructive/20 rounded-lg" role="alert">
          <p className="text-destructive text-sm">{error}</p>
        </div>
      )}
    </div>
  );
}

function getStepProgress() {
  return 33; // This will be updated based on currentStep
}