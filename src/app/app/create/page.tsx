"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Target, Brain, Clock, Globe, ArrowRight, CheckCircle, Loader2 } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCreateGoal } from "@/app/lib/hooks";
import { success as showSuccess, error as showError } from "@/app/lib/toast";
import { Badge } from "@/components/ui/badge";

type Step = "topic" | "preferences" | "confirm";
type CreationStatus = "idle" | "creating" | "generating_plan" | "saving" | "success" | "error";

export default function CreateGoal() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { createGoal, isLoading } = useCreateGoal();
  const [currentStep, setCurrentStep] = useState<Step>("topic");
  const [creationStatus, setCreationStatus] = useState<CreationStatus>("idle");
  const [progressMessage, setProgressMessage] = useState("");
  const [form, setForm] = useState({
    topic: "",
    focus: "",
    level: "beginner" as "beginner" | "intermediate" | "advanced",
    minutesPerDay: 30,
    durationDays: 7 as 7 | 30 | 60 | 90,
    channels: [] as string[]
  });

  // Handle URL parameters for pre-filling form
  useEffect(() => {
    const topic = searchParams.get('topic');
    const focus = searchParams.get('focus');
    const level = searchParams.get('level');
    
    if (topic || focus || level) {
      setForm(prev => ({
        ...prev,
        ...(topic && { topic }),
        ...(focus && { focus }),
        ...(level && ['beginner', 'intermediate', 'advanced'].includes(level) && { level: level as "beginner" | "intermediate" | "advanced" })
      }));
      
      // If we have both topic and focus, move to preferences step
      if (topic && focus) {
        setCurrentStep("preferences");
      }
    }
  }, [searchParams]);

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
      setCreationStatus("creating");
      setProgressMessage("Starting goal creation...");
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgressMessage(prev => {
          if (prev.includes("AI is generating")) {
            return "AI is generating your personalized learning plan... (this may take 2-3 minutes)";
          } else if (prev.includes("Starting goal creation")) {
            return "AI is analyzing your learning preferences...";
          } else if (prev.includes("analyzing")) {
            return "AI is generating your personalized learning plan... (this may take 2-3 minutes)";
          }
          return prev;
        });
      }, 3000);

      const result = await createGoal({
        topic: form.topic,
        focus: form.focus,
        level: form.level,
        minutes_per_day: form.minutesPerDay,
        duration_days: form.durationDays,
        channels: form.channels
      });

      clearInterval(progressInterval);
      setCreationStatus("success");
      setProgressMessage("Goal created successfully! Redirecting...");

      if (result) {
        if (result.reused) {
          showSuccess("Learning goal created successfully! (Reused existing plan)");
        } else {
          showSuccess("Learning goal created successfully!");
        }
        
        // Wait a moment to show success, then redirect
        setTimeout(() => {
          router.push("/app");
        }, 1500);
      } else {
        setCreationStatus("error");
        setProgressMessage("Failed to create learning goal");
        showError("Failed to create learning goal");
      }
    } catch (error) {
      setCreationStatus("error");
      setProgressMessage("An error occurred while creating your goal");
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

  if (isLoading || creationStatus === "creating" || creationStatus === "generating_plan" || creationStatus === "saving") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8 lg:space-y-12 pt-4 sm:pt-6 lg:pt-8">
          {/* Clean Header Design */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
            <header className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-fresh p-4 sm:p-6 lg:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold text-yellow-100 drop-shadow-sm">Creating Learning Goal</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                  Creating Learning Goal 🎯
                </h1>
                <p className="text-sm sm:text-base lg:text-xl text-white/90 max-w-2xl leading-relaxed">
                  Please wait while we create your personalized learning plan
                </p>
              </div>
            </div>
            </header>
          </section>

        {/* Progress Display */}
        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border-0 shadow-lg text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
            <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-blue-600 animate-spin" />
          </div>
          
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-3 sm:mb-4">
            {creationStatus === "creating" && "Starting Goal Creation..."}
            {creationStatus === "generating_plan" && "Generating Learning Plan..."}
            {creationStatus === "saving" && "Saving Your Goal..."}
          </h3>
          
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 max-w-md mx-auto px-4">
            {progressMessage}
          </p>
          
          <div className="w-full bg-muted rounded-full h-2 sm:h-3 overflow-hidden max-w-md mx-auto">
            <div 
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out animate-pulse"
              style={{ width: "100%" }}
            />
          </div>
          
          <p className="text-xs sm:text-sm text-muted-foreground mt-3 sm:mt-4 px-4">
            This process typically takes 2-3 minutes. Please don&apos;t close this page.
          </p>
        </div>
        </div>
        </div>
      </div>
    );
  }

  if (creationStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8 lg:space-y-12 pt-4 sm:pt-6 lg:pt-8">
          {/* Clean Header Design */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
            <header className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-fresh p-4 sm:p-6 lg:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-green-400/20 to-emerald-400/20 backdrop-blur-sm border border-green-300/30 hover:from-green-400/30 hover:to-emerald-400/30 transition-all duration-300">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-300 animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold text-green-100 drop-shadow-sm">Goal Created Successfully!</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                  Learning Goal Created! 🎉
                </h1>
                <p className="text-sm sm:text-base lg:text-xl text-white/90 max-w-2xl leading-relaxed">
                  Redirecting you to your dashboard...
                </p>
              </div>
            </div>
            </header>
          </section>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border-0 shadow-lg text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
            <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-green-600" />
          </div>
          
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700 dark:text-green-300 mb-3 sm:mb-4">
            Your Learning Journey Begins!
          </h3>
          
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 px-4">
            {progressMessage}
          </p>
          
          <div className="w-full bg-muted rounded-full h-2 sm:h-3 overflow-hidden max-w-md mx-auto">
            <div 
              className="bg-gradient-to-r from-green-500 to-emerald-500 h-2 sm:h-3 rounded-full transition-all duration-1000 ease-out"
              style={{ width: "100%" }}
            />
          </div>
        </div>
        </div>
        </div>
      </div>
    );
  }

  if (creationStatus === "error") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-6 sm:space-y-8 lg:space-y-12 pt-4 sm:pt-6 lg:pt-8">
          {/* Clean Header Design */}
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
            <header className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-fresh p-4 sm:p-6 lg:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4">
                <div className="inline-flex items-center gap-2 rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-400/20 to-pink-400/20 backdrop-blur-sm border border-red-300/30 hover:from-red-400/30 hover:to-pink-400/30 transition-all duration-300">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-red-300 animate-pulse" />
                  <span className="text-xs sm:text-sm font-bold text-red-100 drop-shadow-sm">Goal Creation Failed</span>
                </div>
                
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                  Something Went Wrong ❌
                </h1>
                <p className="text-sm sm:text-base lg:text-xl text-white/90 max-w-2xl leading-relaxed">
                  We encountered an issue while creating your learning goal
                </p>
              </div>
            </div>
            </header>
          </section>

        <div className="bg-gradient-to-br from-red-50 to-pink-50 dark:from-red-950/20 dark:to-pink-950/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-12 border-0 shadow-lg text-center">
          <div className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 mx-auto bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4 sm:mb-6 lg:mb-8">
            <Target className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 text-red-600" />
          </div>
          
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-red-700 dark:text-red-300 mb-3 sm:mb-4">
            Goal Creation Failed
          </h3>
          
          <p className="text-sm sm:text-base lg:text-lg text-muted-foreground mb-4 sm:mb-6 px-4">
            {progressMessage}
          </p>
          
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Button 
              onClick={() => {
                setCreationStatus("idle");
                setCurrentStep("topic");
              }}
              className="px-6 sm:px-8 py-3 text-sm sm:text-base bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white rounded-lg sm:rounded-xl"
            >
              Try Again
            </Button>
            <Button 
              onClick={() => router.push("/app")}
              variant="outline"
              className="px-6 sm:px-8 py-3 text-sm sm:text-base rounded-lg sm:rounded-xl"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
        </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8 lg:space-y-12 pt-4 sm:pt-6 lg:pt-8">
        {/* Clean Header Design */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
          <header className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-fresh p-4 sm:p-6 lg:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full px-3 sm:px-4 lg:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300">
                <Target className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-yellow-100 drop-shadow-sm">Create Learning Goal</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Create Learning Goal 🎯
              </h1>
              <p className="text-sm sm:text-base lg:text-xl text-white/90 max-w-2xl leading-relaxed">
                Set up a personalized learning path tailored to your needs and preferences
              </p>
            </div>
          </div>
          </header>
        </section>

      {/* Progress Bar */}
      <section aria-labelledby="progress-heading" className="mb-6 sm:mb-8 lg:mb-12">
        <h2 id="progress-heading" className="sr-only">Creation Progress</h2>
        <div className="bg-muted/30 rounded-xl sm:rounded-2xl p-4 sm:p-6">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <span className="text-sm sm:text-base lg:text-lg font-semibold">Step {currentStep === "topic" ? 1 : currentStep === "preferences" ? 2 : 3} of 3</span>
            <span className="text-sm sm:text-base lg:text-lg font-semibold text-primary">{getStepProgress()}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 sm:h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 sm:h-3 rounded-full transition-all duration-500 ease-out"
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
        <section aria-labelledby="topic-heading" className="space-y-4 sm:space-y-6 lg:space-y-8">
          <h2 id="topic-heading" className="sr-only">Topic and Focus</h2>
          
          {/* Duration Selection */}
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-0 shadow-lg">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Clock className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700 dark:text-blue-300 mb-2">Plan Duration</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Choose how long you want this plan to run</p>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 lg:gap-4" role="radiogroup" aria-label="Plan duration">
              {[7,30,60,90].map((d) => (
                <button
                  key={d}
                  type="button" role="radio" tabIndex={0}
                  onClick={() => setForm(prev => ({ ...prev, durationDays: d as 7|30|60|90 }))}
                  className={`group relative p-3 sm:p-4 lg:p-6 rounded-lg sm:rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    form.durationDays === d 
                      ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-xl scale-105 ring-2 sm:ring-4 ring-blue-200 dark:ring-blue-800" 
                      : "bg-white dark:bg-gray-800 border-2 border-muted/50 text-muted-foreground hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-blue-950/20 hover:scale-105 hover:shadow-lg"
                  }`}
                  aria-checked={form.durationDays === d}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setForm(prev => ({ ...prev, durationDays: d as 7|30|60|90 })); } }}
                >
                  <div className="text-center">
                    <div className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 ${form.durationDays === d ? "text-white" : "text-foreground"}`}>
                      {d}
                    </div>
                    <div className={`text-xs sm:text-sm font-medium ${form.durationDays === d ? "text-blue-100" : "text-muted-foreground"}`}>
                      days
                    </div>
                  </div>
                  {form.durationDays === d && (
                    <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Topic Input */}
          <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-0 shadow-lg">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Target className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-purple-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-700 dark:text-purple-300 mb-2">What do you want to learn?</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Choose a broad learning area that interests you</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <Input
                id="topic"
                placeholder="e.g., Python programming, Spanish language, Data science"
                value={form.topic}
                onChange={(e) => setForm(prev => ({ ...prev, topic: e.target.value }))}
                className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-3 sm:py-4 border-2 border-muted/50 focus:border-purple-500 focus:ring-2 sm:focus:ring-4 focus:ring-purple-500/20 rounded-lg sm:rounded-xl transition-all duration-300"
                aria-describedby="topic-help"
              />
              <p id="topic-help" className="text-xs sm:text-sm text-muted-foreground text-center">
                Be specific about your learning interests
              </p>
            </div>
          </div>

          {/* Focus Input */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-0 shadow-lg">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Brain className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700 dark:text-green-300 mb-2">What&apos;s your specific focus?</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Be specific about what you want to achieve</p>
            </div>
            
            <div className="space-y-3 sm:space-y-4">
              <Textarea
                id="focus"
                placeholder="e.g., Building web applications, Conversational skills, Machine learning basics"
                value={form.focus}
                onChange={(e) => setForm(prev => ({ ...prev, focus: e.target.value }))}
                rows={3}
                className="text-sm sm:text-base lg:text-lg px-4 sm:px-6 py-3 sm:py-4 border-2 border-muted/50 focus:border-green-500 focus:ring-2 sm:focus:ring-4 focus:ring-green-500/20 rounded-lg sm:rounded-xl transition-all duration-300 resize-none"
                aria-describedby="focus-help"
              />
              <p id="focus-help" className="text-xs sm:text-sm text-muted-foreground text-center">
                The more specific, the better we can tailor your learning plan
              </p>
            </div>
          </div>

          {/* Next Button */}
          <div className="flex justify-center pt-4 sm:pt-6 lg:pt-8">
            <Button 
              onClick={handleNext} 
              disabled={!form.topic || !form.focus} 
              className="px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:shadow-lg rounded-lg sm:rounded-xl"
            >
              <span className="hidden sm:inline">Continue to Preferences</span>
              <span className="sm:hidden">Continue</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-3" aria-hidden="true" />
            </Button>
          </div>
        </section>
      )}

      {currentStep === "preferences" && (
        <section aria-labelledby="preferences-heading" className="space-y-4 sm:space-y-6 lg:space-y-8">
          <h2 id="preferences-heading" className="sr-only">Learning Preferences</h2>
          
          {/* Level Selection */}
          <div className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/20 dark:to-red-950/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-0 shadow-lg">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Target className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-orange-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-700 dark:text-orange-300 mb-2">What&apos;s your current level?</h3>
              <p className="text-sm sm:text-base text-muted-foreground">This helps us tailor the content to your experience</p>
            </div>
            
            <div className="max-w-md mx-auto">
              <Select value={form.level} onValueChange={(value) => setForm(prev => ({ ...prev, level: value as "beginner" | "intermediate" | "advanced" }))}>
                <SelectTrigger className="w-full px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base lg:text-lg border-2 border-muted/50 focus:border-orange-500 focus:ring-2 sm:focus:ring-4 focus:ring-orange-500/20 rounded-lg sm:rounded-xl transition-all duration-300 bg-background">
                  <SelectValue placeholder="Select your experience level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner - New to the topic</SelectItem>
                  <SelectItem value="intermediate">Intermediate - Some experience</SelectItem>
                  <SelectItem value="advanced">Advanced - Looking to master</SelectItem>
                </SelectContent>
              </Select>
              <p id="level-help" className="text-xs sm:text-sm text-muted-foreground text-center mt-2 sm:mt-3">
                Choose the level that best describes your current knowledge
              </p>
            </div>
          </div>

          {/* Daily Commitment */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 dark:from-cyan-950/20 dark:to-blue-950/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-0 shadow-lg">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto bg-cyan-100 dark:bg-cyan-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Clock className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-cyan-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-cyan-700 dark:text-cyan-300 mb-2">How many minutes per day?</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Choose a realistic daily commitment</p>
            </div>
            
            <div className="flex items-center justify-center gap-3 sm:gap-4">
              <Input
                id="minutesPerDay"
                type="number"
                min="15"
                max="120"
                step="15"
                value={form.minutesPerDay}
                onChange={(e) => setForm(prev => ({ ...prev, minutesPerDay: parseInt(e.target.value) || 30 }))}
                className="w-20 sm:w-24 text-center text-sm sm:text-base lg:text-lg px-3 sm:px-4 py-2 sm:py-3 border-2 border-muted/50 focus:border-cyan-500 focus:ring-2 sm:focus:ring-4 focus:ring-cyan-500/20 rounded-lg sm:rounded-xl transition-all duration-300"
                aria-describedby="time-help"
              />
              <span className="text-sm sm:text-base lg:text-lg font-medium text-muted-foreground">minutes</span>
            </div>
            <p id="time-help" className="text-xs sm:text-sm text-muted-foreground text-center mt-2 sm:mt-3">
              Start small and build up your learning habit
            </p>
          </div>

          {/* Learning Channels */}
          <div className="bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-0 shadow-lg">
            <div className="text-center mb-4 sm:mb-6">
              <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 mx-auto bg-violet-100 dark:bg-violet-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Globe className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-violet-600" />
              </div>
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-violet-700 dark:text-violet-300 mb-2">Learning channels</h3>
              <p className="text-sm sm:text-base text-muted-foreground">Select all that apply to your learning style</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              {availableChannels.map((channel) => {
                const Icon = channel.icon;
                const isSelected = form.channels.includes(channel.id);
                
                return (
                  <div
                    key={channel.id}
                    className={`group relative p-4 sm:p-5 lg:p-6 rounded-lg sm:rounded-xl cursor-pointer transition-all duration-300 ${
                      isSelected 
                        ? "bg-gradient-to-br from-violet-500 to-purple-500 text-white shadow-xl scale-105 ring-2 sm:ring-4 ring-violet-200 dark:ring-violet-800" 
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
                    <div className="flex items-center gap-3 sm:gap-4">
                      <Switch checked={isSelected} onCheckedChange={() => toggleChannel(channel.id)} />
                      <Icon className={`h-5 w-5 sm:h-6 sm:w-6 ${isSelected ? "text-white" : "text-violet-600"}`} aria-hidden="true" />
                      <span className={`text-sm sm:text-base font-medium ${isSelected ? "text-white" : "text-foreground"}`}>
                        {channel.label}
                      </span>
                    </div>
                    {isSelected && (
                      <div className="absolute -top-1 -right-1 sm:-top-2 sm:-right-2 w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle className="h-2 w-2 sm:h-3 sm:w-3 lg:h-4 lg:w-4 text-white" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 lg:pt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="px-6 sm:px-8 py-3 text-sm sm:text-base lg:text-lg border-2 border-muted/50 hover:border-primary/50 hover:bg-primary/5 rounded-lg sm:rounded-xl transition-all duration-300"
            >
              Back
            </Button>
            <Button 
              onClick={handleNext} 
              className="px-6 sm:px-8 lg:px-12 py-3 text-sm sm:text-base lg:text-lg font-semibold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-lg sm:rounded-xl"
            >
              <span className="hidden sm:inline">Review & Create</span>
              <span className="sm:hidden">Review</span>
              <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-2 sm:ml-3" aria-hidden="true" />
            </Button>
          </div>
        </section>
      )}

      {currentStep === "confirm" && (
        <section aria-labelledby="confirm-heading" className="space-y-4 sm:space-y-6 lg:space-y-8">
          <h2 id="confirm-heading" className="sr-only">Review Your Learning Goal</h2>
          
          {/* Review Card */}
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-xl sm:rounded-2xl p-4 sm:p-6 lg:p-8 border-0 shadow-lg">
            <div className="text-center mb-6 sm:mb-8">
              <div className="w-16 h-16 sm:w-18 sm:h-18 lg:w-20 lg:h-20 mx-auto bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <CheckCircle className="h-8 w-8 sm:h-9 sm:w-9 lg:h-10 lg:w-10 text-emerald-600" />
              </div>
              <h3 className="text-xl sm:text-2xl lg:text-3xl font-bold text-emerald-700 dark:text-emerald-300 mb-2">Review Your Learning Goal</h3>
              <p className="text-sm sm:text-base lg:text-xl text-muted-foreground">Everything looks great! Here&apos;s what we&apos;ll create for you</p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <h4 className="font-semibold text-base sm:text-lg text-emerald-700 dark:text-emerald-300 mb-3 sm:mb-4">Learning Details</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Topic:</span>
                    <p className="font-semibold text-sm sm:text-base lg:text-lg break-words">{form.topic}</p>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Focus:</span>
                    <p className="font-semibold text-sm sm:text-base lg:text-lg break-words">{form.focus}</p>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Level:</span>
                    <p className="font-semibold text-sm sm:text-base lg:text-lg capitalize">{form.level}</p>
                  </div>
                </div>
              </div>
              
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6">
                <h4 className="font-semibold text-base sm:text-lg text-emerald-700 dark:text-emerald-300 mb-3 sm:mb-4">Plan Settings</h4>
                <div className="space-y-2 sm:space-y-3">
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Duration:</span>
                    <p className="font-semibold text-sm sm:text-base lg:text-lg">{form.durationDays} days</p>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Daily Commitment:</span>
                    <p className="font-semibold text-sm sm:text-base lg:text-lg">{form.minutesPerDay} minutes</p>
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-medium text-muted-foreground">Channels:</span>
                    <p className="font-semibold text-sm sm:text-base lg:text-lg">{form.channels.length} selected</p>
                  </div>
                </div>
              </div>
            </div>

            {form.channels.length > 0 && (
              <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-6 sm:mb-8">
                <h4 className="font-semibold text-base sm:text-lg text-emerald-700 dark:text-emerald-300 mb-3 sm:mb-4">Learning Channels</h4>
                <div className="flex flex-wrap gap-2 sm:gap-3">
                  {form.channels.map(channelId => {
                    const channel = availableChannels.find(c => c.id === channelId);
                    return channel ? (
                      <Badge key={channelId} variant="secondary" className="px-3 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm bg-emerald-100 text-emerald-800 border-emerald-200">
                        {channel.label}
                      </Badge>
                    ) : null;
                  })}
                </div>
              </div>
            )}

            {/* Progress Expectation */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg sm:rounded-xl p-4 sm:p-6 border-2 border-blue-200 dark:border-blue-800">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                <h4 className="font-semibold text-sm sm:text-base lg:text-lg text-blue-700 dark:text-blue-300">What Happens Next?</h4>
              </div>
              <div className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-blue-600 dark:text-blue-400">
                <p>• Our AI will analyze your learning preferences and topic</p>
                <p>• Generate a personalized {form.durationDays}-day learning plan</p>
                <p>• Create daily lessons tailored to your {form.level} level</p>
                <p>• <strong>This process typically takes 2-3 minutes</strong></p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 sm:gap-4 pt-4 sm:pt-6 lg:pt-8">
            <Button 
              variant="outline" 
              onClick={handleBack}
              className="px-6 sm:px-8 py-3 text-sm sm:text-base lg:text-lg border-2 border-muted/50 hover:border-primary/50 hover:bg-primary/5 rounded-lg sm:rounded-xl transition-all duration-300"
            >
              Back
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={isLoading} 
              className="px-6 sm:px-8 lg:px-12 py-3 sm:py-4 text-sm sm:text-base lg:text-xl font-semibold bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:transform-none disabled:shadow-lg rounded-lg sm:rounded-xl"
            >
              {isLoading ? "Creating..." : "Create Learning Goal"}
            </Button>
          </div>
        </section>
      )}

      {/* Error Display */}
      {/* The error prop was removed from useCreateGoal, so this block is no longer relevant. */}
      {/* If you need to display an error, you'd need to manage it state-wise or pass it down differently. */}
      {/* For now, removing the unused variable and its usage. */}
        </div>
      </div>
    </div>
  );
}

