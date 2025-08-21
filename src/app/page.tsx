import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AppHeader } from "@/components/app-header";
import { Footer } from "@/components/layout/footer";

import { ArrowRight, Target, Brain, Calendar, Sparkles, Zap, Shield, Users, TrendingUp, Check, Crown, Star } from "lucide-react";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

export default async function Home() {
  // Check authentication status server-side
  const supabase = await supabaseServer();
  const { data: { session }, error } = await supabase.auth.getSession();
  const isAuthenticated = !!session;
  const user = session?.user;

  console.log("Homepage auth check - session:", !!session, "user:", user?.email, "error:", error);

  // For testing purposes, let's force the user menu to show
  const testAuth = true; // TEMPORARY: Force authentication for testing

  return (
    <div className="min-h-screen bg-[var(--bg)] overflow-x-hidden">
      <AppHeader 
        isLoggedIn={testAuth} 
        userName={user?.email || "test@example.com"}
        userAvatarUrl={user?.user_metadata?.avatar_url}
      />

      {/* Hero Section */}
      <section className="relative pt-28 pb-24 overflow-hidden">
        {/* Aurora + Grid background */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_50%_-10%,rgba(99,102,241,0.15),transparent),radial-gradient(800px_400px_at_100%_20%,rgba(147,51,234,0.15),transparent)]" />
          <div className="absolute inset-0 [mask-image:radial-gradient(closest-side,white,transparent)] opacity-[0.06]" style={{backgroundImage:"linear-gradient(to_right,rgba(0,0,0,.4)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,.4)_1px,transparent_1px)",backgroundSize:"64px_64px"}} />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 border border-[var(--border)]/40 bg-[var(--bg)]/80 backdrop-blur-md shadow-lg animate-fade-in">
              <Sparkles className="w-4 h-4 text-brand animate-bounce-gentle" />
              <span className="text-sm font-semibold text-[var(--fg)]/90">AI-Powered Learning Platform</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight animate-slide-up">
              <span className="text-[var(--fg)]">Master Any Skill with</span>
              <br />
              <span className="bg-gradient-to-r from-brand via-purple-500 to-brand bg-clip-text text-transparent bg-size-200 animate-pulse">AI-Powered</span>
              <br />
              <span className="text-[var(--fg)]">Learning Paths</span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-[var(--fg)]/70 max-w-3xl mx-auto leading-relaxed animate-slide-up [animation-delay:200ms]">
              Get personalized daily lessons, track your progress, and achieve your learning goals with intelligent AI guidance that adapts to your style.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up [animation-delay:400ms]">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  shape="pill"
                  asChild 
                  className="text-lg px-8 py-5 bg-gradient-to-r from-brand to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
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
                    className="text-lg px-8 py-5 bg-gradient-to-r from-brand to-purple-600 text-white border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
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
                    className="text-lg px-8 py-5 border-2 border-[var(--border)] hover:bg-muted hover:border-brand/50 transition-all duration-300"
                  >
                    <Link href="/auth">Watch Demo</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8 animate-slide-up [animation-delay:600ms]">
              <div className="text-center group">
                <div className="text-3xl font-bold text-[var(--fg)] group-hover:text-brand transition-colors duration-300">10K+</div>
                <div className="text-sm text-[var(--fg)]/70">Active Learners</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-[var(--fg)] group-hover:text-brand transition-colors duration-300">500+</div>
                <div className="text-sm text-[var(--fg)]/70">Skills Available</div>
              </div>
              <div className="text-center group">
                <div className="text-3xl font-bold text-[var(--fg)] group-hover:text-brand transition-colors duration-300">95%</div>
                <div className="text-sm text-[var(--fg)]/70">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gradient-to-b from-muted/30 to-transparent">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--fg)] mb-6">
              Why Choose <span className="text-brand">Learnovium</span>?
            </h2>
            <p className="text-xl text-[var(--fg)]/70 max-w-3xl mx-auto leading-relaxed">
              Our platform combines cutting-edge AI with proven learning methodologies to deliver an unparalleled educational experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-brand/30">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-brand to-purple-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Brain className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)] group-hover:text-brand transition-colors duration-300">
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
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-green-500/30">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)] group-hover:text-green-600 transition-colors duration-300">
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
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-purple-500/30">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Calendar className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)] group-hover:text-purple-600 transition-colors duration-300">
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
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-orange-500/30">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <TrendingUp className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)] group-hover:text-orange-600 transition-colors duration-300">
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
            <Card className="group border border-[var(--border)] bg-[var(--bg)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden backdrop-blur-sm hover:border-red-500/30">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-20 h-20 bg-gradient-to-br from-red-500 to-rose-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)] group-hover:text-red-600 transition-colors duration-300">
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

      {/* Pricing Section */}
      <section className="py-24 bg-gradient-to-b from-transparent to-muted/30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-[var(--fg)] mb-6">
              Choose Your <span className="text-brand">Learning Journey</span>
            </h2>
            <p className="text-xl text-[var(--fg)]/70 max-w-3xl mx-auto leading-relaxed">
              Start for free and upgrade as you grow. All plans include our AI-powered learning engine and personalized content.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Free Plan */}
            <Card className="relative border border-[var(--border)] bg-[var(--bg)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)] mb-2">
                  Free
                </CardTitle>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[var(--fg)]">$0</span>
                  <span className="text-[var(--fg)]/60 ml-2">/month</span>
                </div>
                <CardDescription className="text-[var(--fg)]/70">
                  Perfect for getting started with AI-powered learning
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">3 learning goals</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Daily AI lessons</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Basic progress tracking</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">50 flashcards</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Community support</span>
                  </li>
                </ul>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full py-3 text-lg font-semibold border-2 border-[var(--border)] hover:border-brand/50 hover:bg-muted transition-all duration-300 rounded-2xl"
                >
                  <Link href="/auth">Get Started Free</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Pro Plan */}
            <Card className="relative border-2 border-brand bg-[var(--bg)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden backdrop-blur-sm">
              {/* Popular Badge */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                <div className="bg-gradient-to-r from-brand to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                  Most Popular
                </div>
              </div>
              
              <CardHeader className="text-center pb-6 pt-8">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Star className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)] mb-2">
                  Pro
                </CardTitle>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[var(--fg)]">$4.99</span>
                  <span className="text-[var(--fg)]/60 ml-2">/month</span>
                </div>
                <CardDescription className="text-[var(--fg)]/70">
                  Ideal for serious learners and professionals
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Everything in Free</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Unlimited learning goals</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Advanced AI personalization</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Unlimited flashcards</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Detailed analytics</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Priority support</span>
                  </li>
                </ul>
                <Button 
                  asChild 
                  className="w-full py-3 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 rounded-2xl"
                >
                  <Link href="/auth">Start Pro Trial</Link>
                </Button>
              </CardContent>
            </Card>

            {/* Premium Plan */}
            <Card className="relative border border-[var(--border)] bg-[var(--bg)] hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 rounded-3xl overflow-hidden backdrop-blur-sm">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Crown className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-[var(--fg)] mb-2">
                  Premium
                </CardTitle>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-[var(--fg)]">$11.99</span>
                  <span className="text-[var(--fg)]/60 ml-2">/month</span>
                </div>
                <CardDescription className="text-[var(--fg)]/70">
                  For teams and advanced learners who want it all
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <ul className="space-y-4 mb-8">
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Everything in Pro</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Team collaboration</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Custom learning paths</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">Advanced integrations</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">1-on-1 coaching sessions</span>
                  </li>
                  <li className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-[var(--fg)]/80">White-label options</span>
                  </li>
                </ul>
                <Button 
                  asChild 
                  variant="outline" 
                  className="w-full py-3 text-lg font-semibold border-2 border-yellow-500/50 text-yellow-600 hover:border-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-950/20 transition-all duration-300 rounded-2xl"
                >
                  <Link href="/auth">Contact Sales</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Money Back Guarantee */}
          <div className="text-center mt-16">
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-full">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="text-green-700 dark:text-green-300 font-medium">30-day money-back guarantee on all paid plans</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-6xl mx-auto px-6">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-purple-600 to-brand p-12 text-center text-white shadow-2xl">
            {/* Background */}
            <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
            <div className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            
            <div className="relative z-10 max-w-4xl mx-auto space-y-8">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">
                Ready to Transform Your <span className="text-yellow-200">Learning</span>?
              </h2>
              <p className="text-xl text-blue-100 max-w-3xl mx-auto leading-relaxed">
                Join thousands of learners who are already achieving their goals with AI-powered guidance. Start your journey today and unlock your full potential.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                {isAuthenticated ? (
                  <Button 
                    size="lg" 
                    shape="pill"
                    asChild 
                    className="text-lg px-8 py-5 bg-white text-brand hover:bg-blue-50 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/app">
                      Go to Dashboard
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                ) : (
                  <Button 
                    size="lg" 
                    shape="pill"
                    asChild 
                    className="text-lg px-8 py-5 bg-white text-brand hover:bg-blue-50 border-0 shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300"
                  >
                    <Link href="/auth">
                      Start Learning Free
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Link>
                  </Button>
                )}
              </div>

              {/* Social Proof */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-blue-200 text-sm">
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
