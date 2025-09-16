import { AppHeader } from "@/components/app-header";
import { Brain, Target, Users, Zap, BookOpen, Globe, Sparkles, ArrowRight, CheckCircle, Lightbulb, Rocket, Heart } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <section className="relative text-center space-y-8">
            {/* Animated background elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-slate-300/15 via-slate-400/15 to-slate-500/15 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-br from-slate-400/15 via-slate-500/15 to-slate-600/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-slate-300/10 to-slate-400/10 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-200/50 to-slate-300/50 rounded-full border border-slate-300/40 mb-8">
                <Sparkles className="w-5 h-5 text-slate-600" />
                <span className="text-slate-700 font-medium">Revolutionizing Education</span>
              </div>
              
              <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                <span className="text-slate-800 dark:text-slate-100">
                  About Learnovium
                </span>
              </h1>
              
              <p className="text-2xl text-[var(--fg)]/80 max-w-4xl mx-auto leading-relaxed">
                Revolutionizing education with artificial intelligence that adapts to every learner, 
                making learning personal, practical, and accessible than ever before.
              </p>
            </div>
          </section>

          {/* Mission Statement Section */}
          <section className="relative space-y-8">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-slate-200/50 to-slate-300/50 rounded-full border border-slate-300/40">
                <Target className="w-5 h-5 text-slate-600" />
                <span className="text-slate-700 font-medium">Our Mission</span>
              </div>
              <h2 className="font-heading text-4xl font-bold">Transforming Education, One Learner at a Time</h2>
            </div>
            
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-12 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
              {/* Enhanced animated background elements */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-slate-300/20 via-slate-400/20 to-slate-500/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-slate-400/20 via-slate-500/20 to-slate-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-slate-300/15 to-slate-400/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
              
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-slate-500 via-slate-600 to-slate-700 rounded-3xl flex items-center justify-center shadow-2xl shadow-slate-500/25 mx-auto mb-8">
                  <Heart className="h-10 w-10 text-white" />
                </div>
                
                <div className="text-center space-y-6 max-w-5xl mx-auto">
                  <p className="text-xl text-[var(--fg)]/90 leading-relaxed">
                    <strong>Learnovium is dedicated to making education more personal, practical, and accessible than ever before.</strong> 
                    We believe that learning should adapt to the individual, not the other way around.
                  </p>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    By combining structured learning paths with daily micro-lessons powered by AI, we give every learner the ability to move forward at their own pace while staying consistent and motivated.
                  </p>
                  
                  <p className="text-lg text-[var(--fg)]/80 leading-relaxed">
                    Our mission is to cut through the noise, break down barriers, and turn curiosity into steady, meaningful progress. With Learnovium, anyone can build skills that last, discover new passions, and unlock opportunities whether they are learning for career growth, creative exploration, or personal fulfillment.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Core Values Section */}
          <section className="relative space-y-8">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand/10 to-purple-600/10 rounded-full border border-brand/20">
                <Zap className="w-5 h-5 text-brand" />
                <span className="text-brand font-medium">Core Values</span>
              </div>
              <h2 className="font-heading text-4xl font-bold">What Drives Us Forward</h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {/* Personalization */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-[var(--fg)]">Personalization</h3>
                  <p className="text-[var(--fg)]/70 leading-relaxed">
                    Every learner is unique. We create personalized learning experiences that adapt to individual needs, pace, and preferences.
                  </p>
                </div>
              </div>

              {/* Accessibility */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                    <Globe className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-[var(--fg)]">Accessibility</h3>
                  <p className="text-[var(--fg)]/70 leading-relaxed">
                    Quality education should be available to everyone, regardless of background, location, or circumstances.
                  </p>
                </div>
              </div>

              {/* Innovation */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-xl font-semibold text-[var(--fg)]">Innovation</h3>
                  <p className="text-[var(--fg)]/70 leading-relaxed">
                                         We continuously push the boundaries of what&apos;s possible in education technology through AI and cutting-edge solutions.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works Section */}
          <section className="relative space-y-8">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand/10 to-purple-600/10 rounded-full border border-brand/20">
                <BookOpen className="w-5 h-5 text-brand" />
                <span className="text-brand font-medium">How It Works</span>
              </div>
              <h2 className="font-heading text-4xl font-bold">The Learnovium Learning Experience</h2>
            </div>
            
            <div className="grid gap-8 md:grid-cols-2">
              {/* Left Column - Problem */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-red-500/10 via-red-400/10 to-red-500/10 p-8 backdrop-blur-xl shadow-xl border border-red-500/20 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-red-500/25 to-red-400/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Lightbulb className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-[var(--fg)]">The Problem</h3>
                  <p className="text-[var(--fg)]/80 leading-relaxed text-lg">
                                         Traditional learning platforms offer static content that doesn&apos;t adapt to individual needs, learning pace, or preferred styles. This leads to frustration, disengagement, and poor retention.
                  </p>
                </div>
              </div>

              {/* Right Column - Solution */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/10 via-green-400/10 to-green-500/10 p-8 backdrop-blur-xl shadow-xl border border-green-500/20 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-green-500/25 to-green-400/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <Rocket className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="font-heading text-2xl font-semibold text-[var(--fg)]">Our Solution</h3>
                  <p className="text-[var(--fg)]/80 leading-relaxed text-lg">
                    AI-powered learning that creates personalized paths, adapts content in real-time, and provides intelligent reminders to keep learners engaged and progressing consistently.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="relative text-center space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/20 via-purple-600/20 to-indigo-500/20 p-12 backdrop-blur-xl shadow-2xl border border-brand/30">
              {/* Animated background elements */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-brand/30 via-purple-500/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-purple-400/30 via-indigo-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
              
              <div className="relative z-10 space-y-6">
                <h2 className="font-heading text-4xl font-bold text-[var(--fg)]">
                  Ready to Transform Your Learning?
                </h2>
                <p className="text-xl text-[var(--fg)]/80 max-w-2xl mx-auto">
                  Join thousands of learners who are already experiencing the future of education with Learnovium.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    href="/app/create"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Start Learning Today
                  </Link>
                  <Link 
                    href="/pricing"
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand text-brand font-semibold rounded-2xl hover:bg-brand hover:text-white transition-all duration-300"
                  >
                    View Pricing
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}