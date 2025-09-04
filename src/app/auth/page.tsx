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
  Target
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
    <main className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-gradient-to-br from-brand/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-64 h-64 bg-gradient-to-br from-purple-400/20 via-indigo-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-brand/15 to-purple-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
      
      <div className="relative z-10 w-full max-w-md">
        {/* Logo and Branding */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
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

        {/* Features Preview */}
        <div className="mt-8 text-center space-y-4">
          <div className="flex items-center justify-center gap-6 text-sm text-[var(--fg)]/60">
            <div className="flex items-center gap-2">
              <Brain className="w-4 h-4 text-brand" />
              <span>AI-Powered</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-brand" />
              <span>Personalized</span>
            </div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-brand" />
              <span>Structured</span>
            </div>
          </div>
          
          <div className="text-xs text-[var(--fg)]/40">
            Join thousands of learners transforming their education with Learnovium
          </div>
        </div>
      </div>
    </main>
  );
} 