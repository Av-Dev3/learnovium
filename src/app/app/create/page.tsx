"use client";

import { useState } from "react";
import { LoadingState } from "@/components/ui/loading-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    durationDays: 7 as 7 | 30 | 60 | 90,
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
        duration_days: form.durationDays,
        channels: form.channels
      });

      if (result) {
        if (result.reused) {
          showSuccess("Learning goal created successfully! (Reused existing plan)");
        } else {
          showSuccess("Learning goal created successfully!");
        }
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

  const getStepProgress = () => {
    switch (currentStep) {
      case "topic":
        return 33;
      case "preferences":
        return 66;
      case "confirm":
        return 100;
      default:
        return 33;
    }
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
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <header className="text-center mb-12">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6">
          <Target className="h-4 w-4" />
          Create Your Learning Journey
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-4">
          Create Learning Goal
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Set up a personalized learning path tailored to your needs and preferences
        </p>
      </header>

      {/* Progress Bar */}
      <section aria-labelledby="progress-heading" className="mb-12">
        <h2 id="progress-heading" className="sr-only">Creation Progress</h2>
        <div className="bg-muted/30 rounded-2xl p-6">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Step {currentStep === "topic" ? 1 : currentStep === "preferences" ? 2 : 3} of 3</span>
            <span className="text-lg font-semibold text-primary">{getStepProgress()}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500 ease-out"
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
        <section aria-labelledby="topic-heading" className="space-y-8">
          <h2 id="topic-heading" className="sr-only">Topic and Focus</h2>
          
          {/* Duration Selection */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-2xl p-8 border-0 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">Plan Duration</h3>
              <p className="text-muted-foreground">Choose how long you want this plan to run</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" role="radiogroup" aria-label="Plan duration">
              {[7,30,60,90].map((d) => (
                <button
                  key={d}
                  type="button" role="radio" tabIndex={0}
                  onClick={() => setForm(prev => ({ ...prev, durationDays: d as 7|30|60|90 }))}
                  className={`group relative p-6 rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    form.durationDays === d 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-xl scale-105 ring-4 ring-blue-200 dark:ring-blue-800" 
                      : "bg-white dark:bg-gray-800 border-2 border-muted/50 text-muted-foreground hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:scale-105 hover:shadow-lg"
                  }`}
                  aria-checked={form.durationDays === d}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setForm(prev => ({ ...prev, durationDays: d as 7|30|60|90 })); } }}
                >
                  <div className="text-center">
                    <div className={`text-3xl font-bold mb-2 ${form.durationDays === d ? "text-white" : "text-foreground"}`}>
                      {d}
                    </div>
                    <div className={`text-sm font-medium ${form.durationDays === d ? "text-blue-100" : "text-muted-foreground"}`}>
                      days
                    </div>
                  </div>
                  {form.durationDays === d && (
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-2xl p-8 border-0 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">What do you want to learn?</h3>
              <p className="text-muted-foreground">Choose a broad learning area that interests you</p>
            </div>
            
            <div className="space-y-4">
              <Input
                id="topic"
                placeholder="e.g., Python programming, Spanish language, Data science"
                value={form.topic}
                onChange={(e) => setForm(prev => ({ ...prev, topic: e.target.value }))}
                className="text-lg px-6 py-4 border-2 border-muted/50 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 rounded-xl transition-all duration-300"
                aria-describedby="topic-help"
              />
              <p id="topic-help" className="text-sm text-muted-foreground text-center">
                Be specific about your learning interests
              </p>
            </div>
          </div>

          {/* Focus Input */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-2xl p-8 border-0 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
                             <h3 className="text-2xl font-bold text-green-700 dark:text-green-300 mb-2">What&apos;s your specific focus?</h3>
              <p className="text-muted-foreground">Be specific about what you want to achieve</p>
            </div>
            
            <div className="space-y-4">
              <Textarea
                id="focus"
                placeholder="e.g., Building web applications, Conversational skills, Machine learning basics"
                value={form.focus}
                onChange={(e) => setForm(prev => ({ ...prev, focus: e.target.value }))}
                rows={4}
                className="text-lg px-6 py-4 border-2 border-muted/50 focus:border-green-500 focus:ring-4 focus:ring-green-500/20 rounded-xl transition-all duration-300 resize-none"
                aria-describedby="focus-help"
              />
              <p id="focus-help" className="text-sm text-muted-foreground text-center">
                The more specific, the better we can tailor your learning plan
              </p>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-center pt-8">
            <Button 
              onClick={handleNext} 
              disabled={!form.topic || !form.focus} 
              className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:shadow-lg rounded-xl"
            >
              Continue to Preferences <ArrowRight className="h-5 w-5 ml-3" aria-hidden="true" />
            </Button>
          </div>
        </section>
      )}

      {currentStep === "preferences" && (
        <section aria-labelledby="preferences-heading" className="space-y-8">
          <h2 id="preferences-heading" className="sr-only">Learning Preferences</h2>
          
          {/* Level Selection */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-2xl p-8 border-0 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-4">
                <Target className="h-8 w-8 text-orange-600" />
              </div>
                             <h3 className="text-2xl font-bold text-orange-700 dark:text-orange-300 mb-2">What&apos;s your current level?</h3>
              <p className="text-muted-foreground">This helps us tailor the content to your experience</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <select
                id="level"
                value={form.level}
                onChange={(e) => setForm(prev => ({ ...prev, level: e.target.value as "beginner" | "intermediate" | "advanced" }))}
                className="w-full px-6 py-4 text-lg border-2 border-muted/50 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/20 rounded-xl transition-all duration-300 bg-background"
                aria-describedby="level-help"
              >
                <option value="beginner">Beginner - New to the topic</option>
                <option value="intermediate">Intermediate - Some experience</option>
                <option value="advanced">Advanced - Looking to master</option>
              </select>
              <p id="level-help" className="text-sm text-muted-foreground text-center mt-3">
                Choose the level that best describes your current knowledge
              </p>
            </div>
          </div>

          {/* Daily Commitment */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-2xl p-8 border-0 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-8 w-8 text-cyan-600" />
              </div>
              <h3 className="text-2xl font-bold text-cyan-700 dark:text-cyan-300 mb-2">How many minutes per day?</h3>
              <p className="text-muted-foreground">Choose a realistic daily commitment</p>
            </div>
            
            <div className="flex items-center justify-center gap-4">
              <Input
                id="minutesPerDay"
                type="number"
                min="15"
                max="120"
                step="15"
                value={form.minutesPerDay}
                onChange={(e) => setForm(prev => ({ ...prev, minutesPerDay: parseInt(e.target.value) || 30 }))}
                className="w-24 text-center text-lg px-4 py-3 border-2 border-muted/50 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 rounded-xl transition-all duration-300"
                aria-describedby="time-help"
              />
              <span className="text-lg font-medium text-muted-foreground">minutes</span>
            </div>
            <p id="time-help" className="text-sm text-muted-foreground text-center mt-3">
              Start small and build up your learning habit
            </p>
          </div>

          {/* Learning Channels */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-2xl p-8 border-0 shadow-lg">
            <div className="text-center mb-6">
              <div className="w-16 h-16 mx-auto bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-4">
                <Globe className="h-8 w-8 text-violet-600" />
              </div>
              <h3 className="text-2xl font-bold text-violet-700 dark:text-violet-300 mb-2">Learning channels</h3>
              <p className="text-muted-foreground">Select all that apply to your learning style</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {availableChannels.map((channel) => {
                const Icon = channel.icon;
                const isSelected = form.channels.includes(channel.id);
                
                return (
                  <div
                    key={channel.id}
                    className={`group relative p-6 rounded-xl cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? "bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-xl scale-105 ring-4 ring-violet-200 dark:ring-violet-800" 
                        : "bg-white dark:bg-gray-800 border-2 border-muted/50 hover:border-violet-300 hover:bg-violet-50/50 dark:hover:bg-violet-950/20 hover:scale-105 hover:shadow-lg"
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
                    <div className="flex items-center gap-4">
                      <Switch checked={isSelected} onCheckedChange={() => toggleChannel(channel.id)} />
                      <Icon className={`h-6 w-6 ${isSelected ? "text-white" : "text-violet-600"}`} aria-hidden="true" />
                      <span className={`font-medium ${isSelected ? "text-white" : "text-foreground"}`}>
                        {channel.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between pt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="px-8 py-3 text-lg border-2 border-muted/50 hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all duration-300"
            >
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              className="px-12 py-3 text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-xl"
            >
              Review & Create <ArrowRight className="h-5 w-5 ml-3" aria-hidden="true" />
            </Button>
          </div>
        </section>
      )}

      {currentStep === "confirm" && (
        <section aria-labelledby="confirm-heading" className="space-y-8">
          <h2 id="confirm-heading" className="sr-only">Review Your Learning Goal</h2>
          
          {/* Review Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl p-8 border-0 shadow-lg">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-10 w-10 text-emerald-600" />
              </div>
              <h3 className="text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">Review Your Learning Goal</h3>
              <p className="text-xl text-muted-foreground">Everything looks great! Here&apos;s what we&apos;ll create for you</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6">
                <h4 className="font-semibold text-lg text-emerald-700 dark:text-emerald-300 mb-4">Learning Details</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Topic:</span>
                    <p className="font-semibold text-lg">{form.topic}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Focus:</span>
                    <p className="font-semibold text-lg">{form.focus}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Level:</span>
                    <p className="font-semibold text-lg capitalize">{form.level}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6">
                <h4 className="font-semibold text-lg text-emerald-700 dark:text-emerald-300 mb-4">Plan Settings</h4>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Duration:</span>
                    <p className="font-semibold text-lg">{form.durationDays} days</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Daily Commitment:</span>
                    <p className="font-semibold text-lg">{form.minutesPerDay} minutes</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-muted-foreground">Channels:</span>
                    <p className="font-semibold text-lg">{form.channels.length} selected</p>
                  </div>
                </div>
              </div>
            </div>

            {form.channels.length > 0 && (
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-xl p-6 mb-8">
                <h4 className="font-semibold text-lg text-emerald-700 dark:text-emerald-300 mb-4">Learning Channels</h4>
                <div className="flex flex-wrap gap-3">
                  {form.channels.map(channelId => {
                    const channel = availableChannels.find(c => c.id === channelId);
                    return channel ? (
                      <Badge key={channelId} variant="secondary" className="px-4 py-2 text-base bg-emerald-100 text-emerald-800 border-emerald-200">
                        {channel.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="px-8 py-3 text-lg border-2 border-muted/50 hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all duration-300"
            >
              Back
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className="px-12 py-4 text-xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:shadow-lg rounded-xl"
            >
              {isLoading ? "Creating..." : "Create Learning Goal"}
            </Button>
          </div>
        </section>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-8 p-6 bg-destructive/10 border-2 border-destructive/20 rounded-2xl" role="alert">
          <p className="text-destructive text-lg font-medium text-center">{error}</p>
        </div>
      )}
    </div>
  );
}

