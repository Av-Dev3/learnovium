import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/layout/footer";

import { ArrowRight, Target, Brain, Calendar, Sparkles, Zap, Shield, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function Home() {
  // Check authentication status server-side
  const supabase = await supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <AppHeader isLoggedIn={isAuthenticated} />

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-10%] left-1/2 h-[32rem] w-[32rem] -translate-x-1/2 rounded-full bg-brand/10 blur-3xl" />
          <div className="absolute top-0 right-[-10%] h-[28rem] w-[28rem] rounded-full bg-purple-500/10 blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 border border-[var(--border)]/70 bg-[var(--bg)]/60 backdrop-blur">
              <Sparkles className="w-4 h-4 text-brand" />
              <span className="text-sm font-medium text-[var(--fg)]/80">AI-Powered Learning Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight">
              <span className="text-[var(--fg)]">Master Any Skill with</span>
              <br />
              <span className="bg-gradient-to-r from-brand via-purple-500 to-brand bg-clip-text text-transparent">AI-Powered</span>
              <br />
              <span className="text-[var(--fg)]">Learning Paths</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-[var(--fg)]/70 max-w-3xl mx-auto leading-relaxed">
              Get personalized daily lessons, track your progress, and achieve your learning goals with intelligent AI guidance that adapts to your style.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  asChild 
                  className="text-lg px-8 py-5 bg-gradient-to-r from-brand to-purple-600 text-white border-0 shadow-xl rounded-2xl"
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
                    asChild 
                  className="text-lg px-8 py-5 bg-gradient-to-r from-brand to-purple-600 text-white border-0 shadow-xl rounded-2xl"
                  >
                    <Link href="/auth">
                      Start Learning Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline" 
                    asChild 
                    className="text-lg px-8 py-5 border border-[var(--border)] hover:bg-muted rounded-2xl"
                  >
                    <Link href="/auth">Watch Demo</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--fg)]">10K+</div>
                <div className="text-sm text-[var(--fg)]/70">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--fg)]">500+</div>
                <div className="text-sm text-[var(--fg)]/70">Skills Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[var(--fg)]">95%</div>
                <div className="text-sm text-[var(--fg)]/70">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--fg)] mb-6">
              Why Choose LearnOV AI?
            </h2>
            <p className="text-xl text-[var(--fg)]/70 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with proven learning methodologies to deliver an unparalleled educational experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)]">
                  AI-Powered Lessons
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-[var(--fg)]/70 text-lg leading-relaxed">
                  Get personalized daily lessons tailored to your learning style, pace, and current knowledge level
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)]">
                  Goal-Oriented Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-[var(--fg)]/70 text-lg leading-relaxed">
                  Set clear learning objectives and track your progress with detailed analytics and insights
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)]">
                  Daily Consistency
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-[var(--fg)]/70 text-lg leading-relaxed">
                  Build lasting habits with daily reminders, streak tracking, and motivational insights
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)]">
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-[var(--fg)]/70 text-lg leading-relaxed">
                  Visualize your learning journey with comprehensive progress analytics and performance metrics
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)]">
                  Secure & Private
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-[var(--fg)]/70 text-lg leading-relaxed">
                  Your data is protected with enterprise-grade security and privacy controls
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-xl transition-all duration-300 hover:-translate-y-1 rounded-2xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)]">
                  Lightning Fast
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-[var(--fg)]/70 text-lg leading-relaxed">
                  Optimized performance ensures smooth learning experience across all devices
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-purple-600 to-brand p-12 text-center text-white">
            {/* Background */}
            <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl" />
            
            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold">
                Ready to Transform Your Learning?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Join thousands of learners who are already achieving their goals with AI-powered guidance. Start your journey today and unlock your full potential.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated ? (
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    asChild
                    className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl shadow-xl"
                  >
                    <Link href="/app">
                      Continue Learning
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    variant="secondary" 
                    asChild
                    className="text-lg px-10 py-6 bg-white text-blue-600 hover:bg-blue-50 rounded-2xl shadow-xl"
                  >
                    <Link href="/auth">
                      Start Learning Now
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center space-x-8 pt-8">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-200">10,000+ learners</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-200">500+ skills</span>
                </div>
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-5 h-5 text-blue-200" />
                  <span className="text-blue-200">95% success rate</span>
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
