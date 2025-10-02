"use client";

import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseBrowser";
import Link from "next/link";
import { Logo } from "@/components/Logo";
import { 
  Mail, 
  ArrowLeft,
  CheckCircle,
  AlertCircle,
  Sparkles,
  Shield
} from "lucide-react";

export default function ResetRequestPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setMsg(null); setErr(null); setPending(true);
    try {
      const supabase = supabaseBrowser();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `https://www.learnovium.com/auth/reset/callback`,
      });
      if (error) throw error;
      setMsg("Reset link sent. Check your email.");
    } catch (e: unknown) {
      const errorMessage = e instanceof Error ? e.message : String(e);
      setErr(errorMessage);
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-full blur-3xl animate-pulse" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center min-h-screen py-8 lg:py-12">
          <div className="w-full max-w-md">
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

            {/* Reset Container */}
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
              {/* Container background elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl" />
              <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl" />
              
              <div className="relative z-10 space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                  <div className="w-16 h-16 bg-gradient-to-br from-brand via-purple-600 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h1 className="text-3xl font-bold text-[var(--fg)]">Reset Password</h1>
                  <p className="text-[var(--fg)]/70">Enter your email to receive a password reset link</p>
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

                  {/* Submit Button */}
                  <button 
                    disabled={pending} 
                    type="submit" 
                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-brand to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:hover:scale-100 disabled:hover:shadow-lg"
                  >
                    {pending ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending…
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5" />
                        Send Reset Link
                      </>
                    )}
                  </button>
                </form>

                {/* Back to Sign In */}
                <div className="text-center">
                  <Link 
                    href="/auth" 
                    className="inline-flex items-center gap-2 text-sm text-[var(--fg)]/70 hover:text-brand transition-colors"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Sign In
                  </Link>
                </div>

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
      </div>
    </div>
  );
} 