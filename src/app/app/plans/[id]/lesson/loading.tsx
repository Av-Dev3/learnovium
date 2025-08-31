import { LoadingState } from "@/components/ui/loading-state";
import { ArrowLeft, BookOpen, Brain, Zap, Clock, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LessonLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
      <div className="max-w-5xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" asChild className="hover:bg-[var(--bg)]/50">
            <Link href="/app">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
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
