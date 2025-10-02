"use client";

import { Button } from "@/components/ui/button";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/layout/footer";

import { ArrowRight, Target, Brain, Calendar, Sparkles, Zap, Shield, Users, TrendingUp, Star, Smartphone, Download, Apple, Play } from "lucide-react";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";
import { useEffect, useRef, useState } from "react";

export const dynamic = "force-dynamic";

// Custom hook for scroll animations
function useScrollAnimation() {
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = entry.target.getAttribute('data-animate-id');
            if (id) {
              setAnimatedElements(prev => new Set(prev).add(id));
            }
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    const elements = document.querySelectorAll('[data-animate-id]');
    elements.forEach(el => observerRef.current?.observe(el));

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return animatedElements;
}

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ email?: string; user_metadata?: { avatar_url?: string } } | null>(null);
  const [profile, setProfile] = useState<{ avatar_url?: string; name?: string } | null>(null);
  const animatedElements = useScrollAnimation();

  useEffect(() => {
    // Check authentication status client-side
    const checkAuth = async () => {
      try {
        const supabase = await supabaseServer();
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
        setUser(session?.user || null);
        
        // Fetch profile data if user exists
        if (session?.user) {
          try {
            const { data: profileData, error: profileError } = await supabase
              .from("profiles")
              .select("avatar_url, name")
              .eq("id", session.user.id)
              .single();
            
            if (profileError) {
              console.error("Error fetching profile:", profileError);
              // Set empty profile to avoid repeated requests
              setProfile({ avatar_url: undefined, name: undefined });
            } else {
              setProfile(profileData);
            }
          } catch (error) {
            console.error("Profile fetch failed:", error);
            // Set empty profile to avoid repeated requests
            setProfile({ avatar_url: undefined, name: undefined });
          }
        }
      } catch (err) {
        console.error('Auth check error:', err);
      }
    };
    
    checkAuth();
  }, []);

  console.log("Homepage auth check - isAuthenticated:", isAuthenticated, "user:", user?.email);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 overflow-x-hidden">
      <AppHeader 
        isLoggedIn={isAuthenticated} 
        userName={profile?.name || user?.email || "Guest"}
        userAvatarUrl={profile?.avatar_url || user?.user_metadata?.avatar_url}
      />

      {/* Hero Section */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 via-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400/20 via-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            {/* Glassmorphism Hero Card */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 dark:border-slate-700/50 shadow-xl">
              <div className="text-center space-y-8">
                {/* Badge */}
                <div 
                  data-animate-id="hero-badge"
                  className={`inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300 ${
                    animatedElements.has('hero-badge') ? 'animate-in' : 'animate-on-scroll'
                  }`}
                >
                  <Sparkles className="w-4 h-4 text-yellow-600 animate-pulse" />
                  <span className="text-sm font-bold text-yellow-800 dark:text-yellow-200">AI-Powered Learning Platform</span>
                </div>

                {/* Main Heading */}
                <h1 
                  data-animate-id="hero-heading"
                  className={`text-5xl md:text-7xl font-bold leading-tight tracking-tight transition-all duration-1000 ${
                    animatedElements.has('hero-heading') ? 'animate-in' : 'animate-on-scroll'
                  }`}
                >
                  <span className="text-slate-900 dark:text-slate-100 animate-fade-in-up" style={{animationDelay: '0.2s'}}>Master Any Skill with</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600" style={{animationDelay: '0.4s'}}>AI-Powered</span>
                  <br />
                  <span className="text-slate-900 dark:text-slate-100 animate-fade-in-up" style={{animationDelay: '0.6s'}}>Learning Paths</span>
                </h1>

                {/* Subtitle */}
                <p 
                  data-animate-id="hero-subtitle"
                  className={`text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed transition-all duration-1000 ${
                    animatedElements.has('hero-subtitle') ? 'animate-in' : 'animate-on-scroll'
                  }`}
                >
                  <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.8s'}}>Get personalized daily lessons,</span>{' '}
                  <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.0s'}}>track your progress,</span>{' '}
                  <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.2s'}}>and achieve your learning goals</span>{' '}
                  <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.4s'}}>with intelligent AI guidance</span>{' '}
                  <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.6s'}}>that adapts to your style.</span>
                </p>

                {/* CTA Buttons */}
                <div 
                  data-animate-id="hero-cta"
                  className={`flex flex-col sm:flex-row gap-4 justify-center items-center transition-all duration-1000 ${
                    animatedElements.has('hero-cta') ? 'animate-in' : 'animate-on-scroll'
                  }`}
                >
                  {isAuthenticated ? (
                    <Button 
                      size="lg" 
                      shape="pill"
                      asChild 
                      className="text-lg px-8 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover-bounce"
                    >
                      <Link href="/app">
                        Go to Dashboard
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  ) : (
                    <>
                      <Button 
                        size="lg" 
                        shape="pill"
                        asChild 
                        className="text-lg px-8 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover-bounce"
                      >
                        <Link href="/auth">
                          Start Learning Free
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                      </Button>
                      <Button 
                        size="lg" 
                        variant="outline" 
                        shape="pill"
                        asChild 
                        className="text-lg px-8 py-5 border-2 border-purple-200 dark:border-purple-700 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover-wiggle"
                      >
                        <Link href="/auth">Watch Demo</Link>
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Stats Cards */}
            <div 
              data-animate-id="hero-stats"
              className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 transition-all duration-1000 ${
                animatedElements.has('hero-stats') ? 'animate-in' : 'animate-on-scroll'
              }`}
            >
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform duration-300">10K+</div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">Active Learners</div>
                </div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300">500+</div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">Skills Available</div>
                </div>
              </div>
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl p-6 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 group">
                <div className="text-center">
                  <div className="text-3xl font-bold text-cyan-600 dark:text-cyan-400 group-hover:scale-110 transition-transform duration-300">95%</div>
                  <div className="text-sm font-medium text-slate-600 dark:text-slate-400 mt-1">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative py-24 overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800" />
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 via-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}} />
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          {/* Glassmorphism Header Card */}
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 dark:border-slate-700/50 shadow-xl mb-16">
            <div 
              data-animate-id="features-header"
              className={`text-center transition-all duration-1000 ${
                animatedElements.has('features-header') ? 'animate-in' : 'animate-on-scroll'
              }`}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-6">
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.2s'}}>Why Choose</span>{' '}
                <span className="inline-block animate-fade-in-up text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600" style={{animationDelay: '0.4s'}}>Learnovium</span>
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.6s'}}>?</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.8s'}}>Our platform combines cutting-edge AI</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.0s'}}>with proven learning methodologies</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.2s'}}>to deliver an unparalleled</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.4s'}}>educational experience</span>
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div 
              data-animate-id="feature-1"
              className={`group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                animatedElements.has('feature-1') ? 'animate-in' : 'animate-on-scroll'
              }`}
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  AI-Powered Lessons
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  Get personalized daily lessons tailored to your learning style, pace, and current knowledge level
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div 
              data-animate-id="feature-2"
              className={`group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                animatedElements.has('feature-2') ? 'animate-in' : 'animate-on-scroll'
              }`}
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-emerald-500 to-green-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-emerald-500/25">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Goal-Oriented Learning
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  Set clear learning objectives and track your progress with detailed analytics and insights
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div 
              data-animate-id="feature-3"
              className={`group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                animatedElements.has('feature-3') ? 'animate-in' : 'animate-on-scroll'
              }`}
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-500/25">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Daily Consistency
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  Build lasting habits with daily reminders, streak tracking, and motivational insights
                </p>
              </div>
            </div>

            {/* Feature 4 */}
            <div 
              data-animate-id="feature-4"
              className={`group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                animatedElements.has('feature-4') ? 'animate-in' : 'animate-on-scroll'
              }`}
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-500/25">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Progress Tracking
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  Visualize your learning journey with comprehensive progress analytics and performance metrics
                </p>
              </div>
            </div>

            {/* Feature 5 */}
            <div 
              data-animate-id="feature-5"
              className={`group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                animatedElements.has('feature-5') ? 'animate-in' : 'animate-on-scroll'
              }`}
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-red-500/25">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Secure & Private
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  Your data is protected with enterprise-grade security and privacy controls
                </p>
              </div>
            </div>

            {/* Feature 6 */}
            <div 
              data-animate-id="feature-6"
              className={`group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 ${
                animatedElements.has('feature-6') ? 'animate-in' : 'animate-on-scroll'
              }`}
            >
              <div className="text-center">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-indigo-500 to-cyan-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-indigo-500/25">
                  <Zap className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
                  Lightning Fast
                </h3>
                <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed">
                  Optimized performance ensures smooth learning experience across all devices
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing CTA Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-[var(--fg)] mb-6">
            <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.2s'}}>Choose Your</span>{' '}
            <span className="inline-block animate-fade-in-up text-brand" style={{animationDelay: '0.4s'}}>Learning Journey</span>
          </h2>
          <p className="text-xl text-[var(--fg)]/70 max-w-3xl mx-auto leading-relaxed mb-8">
            <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.6s'}}>Start for free and upgrade as you grow.</span>{' '}
            <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.8s'}}>All plans include our AI-powered learning engine</span>{' '}
            <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.0s'}}>and personalized content.</span>
          </p>
          <Link 
            href="/pricing"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg text-lg hover-bounce animate-fade-in-up"
            style={{animationDelay: '1.2s'}}
          >
            <Star className="w-5 h-5" />
            View All Plans
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Mobile App Coming Soon Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800" />
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-br from-purple-400/10 via-indigo-400/10 to-cyan-400/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400/10 via-purple-400/10 to-indigo-400/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '3s'}} />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="text-center space-y-8">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-emerald-400/20 to-green-400/20 backdrop-blur-sm border border-emerald-300/30 hover:from-emerald-400/30 hover:to-green-400/30 transition-all duration-300 rounded-full">
                <Smartphone className="w-5 h-5 text-emerald-600 animate-pulse" />
                <span className="text-emerald-800 dark:text-emerald-200 font-medium">Coming Soon</span>
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.2s'}}>Learn Anywhere with Our</span>{' '}
                <span className="inline-block animate-fade-in-up text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-green-600 to-teal-600" style={{animationDelay: '0.4s'}}>Mobile Apps</span>
              </h2>
              
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.6s'}}>Take your learning journey anywhere.</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.8s'}}>Our iOS and Android apps are coming soon</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.0s'}}>with offline sync, push notifications,</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.2s'}}>and the same AI-powered experience</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.4s'}}>you love on desktop.</span>
              </p>

              {/* Mobile App Features */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Download className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Offline Learning</h3>
                  <p className="text-slate-600 dark:text-slate-300">Download lessons and study without an internet connection</p>
                </div>

                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Zap className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Smart Notifications</h3>
                  <p className="text-slate-600 dark:text-slate-300">Get reminded at the perfect time to maintain your learning streak</p>
                </div>

                <div className="group">
                  <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center shadow-lg mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Brain className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Seamless Sync</h3>
                  <p className="text-slate-600 dark:text-slate-300">Your progress syncs instantly across all your devices</p>
                </div>
              </div>

              {/* App Store Buttons (Coming Soon) */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-12">
                <div className="group relative">
                  <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-400 to-slate-500 text-white font-semibold rounded-2xl shadow-lg cursor-not-allowed opacity-60">
                    <Apple className="h-6 w-6" />
                    <div className="text-left">
                      <div className="text-xs opacity-90">Coming Soon to</div>
                      <div className="text-lg font-bold leading-tight">App Store</div>
                    </div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    iOS App Coming Soon!
                  </div>
                </div>

                <div className="group relative">
                  <div className="flex items-center gap-3 px-6 py-4 bg-gradient-to-r from-slate-400 to-slate-500 text-white font-semibold rounded-2xl shadow-lg cursor-not-allowed opacity-60">
                    <Play className="h-6 w-6" />
                    <div className="text-left">
                      <div className="text-xs opacity-90">Coming Soon to</div>
                      <div className="text-lg font-bold leading-tight">Google Play</div>
                    </div>
                  </div>
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-800 text-white text-sm py-2 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Android App Coming Soon!
                  </div>
                </div>
              </div>

              {/* Early Access Signup */}
              <div className="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 rounded-2xl p-8 border border-emerald-200 dark:border-emerald-800 mt-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">Get Notified When We Launch</h3>
                <p className="text-slate-600 dark:text-slate-300 mb-6">Be among the first to experience learning on mobile. We&apos;ll notify you as soon as our apps are available.</p>
                <Button 
                  size="lg" 
                  shape="pill"
                  asChild 
                  className="text-lg px-8 py-4 bg-gradient-to-r from-emerald-600 to-green-600 text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                >
                  <Link href="/auth">
                    Join Early Access List
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        {/* Modern gradient background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-400/20 via-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-cyan-400/20 via-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
        </div>
        
        <div className="max-w-6xl mx-auto px-6 relative z-10">
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20 dark:border-slate-700/50 shadow-xl">
            <div className="text-center space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.2s'}}>Ready to Transform Your</span>{' '}
                <span className="inline-block animate-fade-in-up text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600" style={{animationDelay: '0.4s'}}>Learning</span>
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.6s'}}>?</span>
              </h2>
              <p className="text-xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '0.8s'}}>Join thousands of learners who are already</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.0s'}}>achieving their goals with AI-powered guidance.</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.2s'}}>Start your journey today and unlock</span>{' '}
                <span className="inline-block animate-fade-in-up" style={{animationDelay: '1.4s'}}>your full potential.</span>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated ? (
                  <Button 
                    size="lg" 
                    shape="pill"
                    asChild 
                    className="text-lg px-8 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover-bounce"
                  >
                    <Link href="/app">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <>
                    <Button 
                      size="lg" 
                      shape="pill"
                      asChild 
                      className="text-lg px-8 py-5 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 hover-bounce"
                    >
                      <Link href="/auth">
                        Start Learning Free
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                    <Button 
                      size="lg" 
                      variant="outline" 
                      shape="pill"
                      asChild 
                      className="text-lg px-8 py-5 border-2 border-purple-200 dark:border-purple-700 text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:border-purple-300 dark:hover:border-purple-600 transition-all duration-300 hover-wiggle"
                    >
                      <Link href="/pricing">
                        View Pricing
                        <ArrowRight className="ml-2 h-5 w-5" />
                      </Link>
                    </Button>
                  </>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-slate-600 dark:text-slate-400 text-sm">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5" />
                  <span>10,000+ learners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5" />
                  <span>500+ skills</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5" />
                  <span>95% success rate</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
