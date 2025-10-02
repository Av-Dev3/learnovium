"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { 
  Mail, 
  Lock, 
  Sparkles, 
  UserPlus, 
  LogIn, 
  Zap, 
  Eye, 
  EyeOff,
  CheckCircle,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Brain,
  Target,
  Clock,
  Trophy,
  Flame,
  TrendingUp,
  Play,
  Star,
  Users,
  Award,
  ChevronRight,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Calendar,
  Shield,
  Zap as Lightning
} from "lucide-react";

type Mode = "magic" | "signin" | "signup";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);

  async function bridgeSession() {
    const supabase = supabaseBrowser();
    const { data } = await supabase.auth.getSession();
    const at = data.session?.access_token;
    const rt = data.session?.refresh_token;
    if (!at || !rt) return false;
    const r = await fetch("/auth/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ access_token: at, refresh_token: rt }),
    });
    return r.ok;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null);
    setErr(null);
    setPending(true);
    const supabase = supabaseBrowser();

    try {
      if (mode === "magic") {
        const { error } = await supabase.auth.signInWithOtp({
          email,
          options: {
            emailRedirectTo: "https://www.learnovium.com/auth/callback",
          },
        });
        if (error) throw error;
        setMsg("Magic link sent. Check your email.");
        return;
      }

      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: "https://www.learnovium.com/auth/callback",
          },
        });
        if (error) throw error;
        setMsg("Account created. Check your email to confirm (if required).");
        return;
      }

      // mode === "signin": email + password
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Bridge client session -> server cookies
      const ok = await bridgeSession();
      if (!ok) throw new Error("Could not set server session");
      window.location.href = "/app";
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : "Authentication failed.";
      setErr(errorMessage);
    } finally {
      setPending(false);
    }
  }

  const getModeConfig = (currentMode: Mode) => {
    switch (currentMode) {
      case "signin":
        return {
          title: "Welcome Back",
          subtitle: "Sign in to continue your learning journey",
          icon: LogIn,
          buttonText: "Sign In",
          buttonIcon: LogIn
        };
      case "signup":
        return {
          title: "Join Learnovium",
          subtitle: "Start your personalized learning adventure today",
          icon: UserPlus,
          buttonText: "Create Account",
          buttonIcon: UserPlus
        };
      case "magic":
        return {
          title: "Magic Link",
          subtitle: "Get a secure link sent to your email",
          icon: Sparkles,
          buttonText: "Send Magic Link",
          buttonIcon: Mail
        };
    }
  };

  const modeConfig = getModeConfig(mode);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-amber-500/5 to-orange-500/5 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 left-1/4 w-72 h-72 bg-gradient-to-br from-emerald-500/5 to-teal-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen py-8 lg:py-12">
          
          {/* Left Side - Auth Form */}
          <div className="flex items-center justify-center lg:justify-start">
            <div className="w-full max-w-md">
              {/* Logo and Branding */}
              <div className="text-center lg:text-left mb-8">
                <div className="flex items-center justify-center lg:justify-start gap-3 mb-6">
                  <Logo size="lg" />
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-brand/10 to-purple-600/10 rounded-full border border-brand/20">
                    <Sparkles className="w-4 h-4 text-brand" />
                    <span className="text-brand font-medium text-sm">AI-Powered Learning</span>
                  </div>
                </div>
              </div>

              {/* Auth Container */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
                {/* Container background elements */}
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl" />
                
                <div className="relative z-10 space-y-6">
                  {/* Header */}
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-gradient-to-br from-brand via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                      <modeConfig.icon className="h-8 w-8 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-[var(--fg)]">{modeConfig.title}</h1>
                    <p className="text-[var(--fg)]/70">{modeConfig.subtitle}</p>
                  </div>

                  {/* Mode Tabs */}
                  <div className="flex gap-2 p-1 bg-white/10 dark:bg-white/5 rounded-2xl border border-white/20 dark:border-white/10">
                    <button 
                      onClick={() => setMode("signin")} 
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        mode === "signin" 
                          ? "bg-gradient-to-r from-brand to-purple-600 text-white shadow-lg" 
                          : "text-[var(--fg)]/70 hover:text-[var(--fg)] hover:bg-white/10"
                      }`}
                    >
                      <LogIn className="w-4 h-4" />
                      Sign In
                    </button>
                    <button 
                      onClick={() => setMode("signup")} 
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        mode === "signup" 
                          ? "bg-gradient-to-r from-brand to-purple-600 text-white shadow-lg" 
                          : "text-[var(--fg)]/70 hover:text-[var(--fg)] hover:bg-white/10"
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      Sign Up
                    </button>
                    <button 
                      onClick={() => setMode("magic")} 
                      className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                        mode === "magic" 
                          ? "bg-gradient-to-r from-brand to-purple-600 text-white shadow-lg" 
                          : "text-[var(--fg)]/70 hover:text-[var(--fg)] hover:bg-white/10"
                      }`}
                    >
                      <Zap className="w-4 h-4" />
                      Magic Link
                    </button>
                  </div>

                  {/* Form */}
                  <form onSubmit={onSubmit} className="space-y-4">
                    {/* Email Input */}
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--fg)]/50">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input 
                        type="email" 
                        required 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        placeholder="you@example.com" 
                        className="w-full pl-10 pr-4 py-3 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl text-[var(--fg)] placeholder-[var(--fg)]/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all duration-200" 
                      />
                    </div>

                    {/* Password Input */}
                    {mode !== "magic" && (
                      <div className="relative">
                        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--fg)]/50">
                          <Lock className="w-5 h-5" />
                        </div>
                        <input 
                          type={showPassword ? "text" : "password"} 
                          required 
                          value={password} 
                          onChange={(e) => setPassword(e.target.value)} 
                          placeholder={mode === "signup" ? "Create a password" : "Your password"} 
                          className="w-full pl-10 pr-12 py-3 bg-white/10 dark:bg-white/5 border border-white/20 dark:border-white/10 rounded-2xl text-[var(--fg)] placeholder-[var(--fg)]/50 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand/50 transition-all duration-200" 
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[var(--fg)]/50 hover:text-[var(--fg)]/70 transition-colors"
                        >
                          {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    )}

                    {/* Submit Button */}
                    <button 
                      disabled={pending} 
                      type="submit" 
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg"
                    >
                      {pending ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Please wait…
                        </>
                      ) : (
                        <>
                          <modeConfig.buttonIcon className="w-5 h-5" />
                          {modeConfig.buttonText}
                        </>
                      )}
                    </button>
                  </form>

                  {/* Additional Links */}
                  {mode === "signin" && (
                    <div className="text-center">
                      <Link 
                        href="/auth/reset" 
                        className="text-sm text-[var(--fg)]/70 hover:text-brand transition-colors underline decoration-[var(--fg)]/30 hover:decoration-brand"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  )}

                  {/* Messages */}
                  {err && (
                    <div className="flex items-center gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
                      <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                      <p className="text-sm text-red-600">{err}</p>
                    </div>
                  )}
                  
                  {msg && (
                    <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl">
                      <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <p className="text-sm text-green-600">{msg}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Features & Benefits */}
          <div className="hidden lg:block space-y-8">
            {/* Hero Section */}
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-[var(--fg)] leading-tight">
                Master any skill with 
                <span className="bg-gradient-to-r from-brand to-purple-600 bg-clip-text text-transparent"> AI guidance</span>
              </h2>
              
              <p className="text-xl text-[var(--fg)]/80 leading-relaxed">
                Get personalized daily lessons, track your progress, and achieve your learning goals with intelligent AI that adapts to your pace and style.
              </p>
            </div>

            {/* Key Features Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-[var(--fg)] mb-2">AI-Powered</h3>
                <p className="text-sm text-[var(--fg)]/70">Intelligent learning paths tailored to your goals</p>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-green-600 rounded-xl flex items-center justify-center mb-4">
                  <Target className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-[var(--fg)] mb-2">Personalized</h3>
                <p className="text-sm text-[var(--fg)]/70">Adapts to your learning style and pace</p>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center mb-4">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-[var(--fg)] mb-2">Structured</h3>
                <p className="text-sm text-[var(--fg)]/70">Daily lessons with clear learning objectives</p>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-[var(--fg)] mb-2">Progress Tracking</h3>
                <p className="text-sm text-[var(--fg)]/70">Monitor your achievements and growth</p>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-[var(--fg)] mb-1">10K+</div>
                  <div className="text-sm text-[var(--fg)]/70">Active Learners</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--fg)] mb-1">50+</div>
                  <div className="text-sm text-[var(--fg)]/70">Skills Available</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-[var(--fg)] mb-1">95%</div>
                  <div className="text-sm text-[var(--fg)]/70">Success Rate</div>
                </div>
              </div>
            </div>

            {/* Benefits List */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-[var(--fg)]">Why choose Learnovium?</h3>
              <div className="space-y-3">
                {[
                  "🎯 Personalized learning paths for any skill",
                  "🤖 AI-powered lesson generation and adaptation", 
                  "📊 Real-time progress tracking and analytics",
                  "🔥 Gamified learning with streaks and achievements",
                  "📱 Learn anywhere, anytime on any device",
                  "🔒 Secure and private learning environment"
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 