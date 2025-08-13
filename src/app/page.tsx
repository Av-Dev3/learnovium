import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

import { ArrowRight, Target, Brain, Calendar, Sparkles, Zap, Shield, Users, TrendingUp } from "lucide-react";
import Link from "next/link";
import { supabaseServer } from "@/lib/supabaseServer";

export default async function Home() {
  // Check authentication status server-side
  const supabase = await supabaseServer();
  const { data: { session } } = await supabase.auth.getSession();
  const isAuthenticated = !!session;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
                  LearnOV AI
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400">Powered by AI</div>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                Features
              </Link>
              <Link href="#about" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                About
              </Link>
              <Link href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors font-medium">
                Pricing
              </Link>
            </div>

            <div className="flex items-center space-x-3">
              {isAuthenticated ? (
                <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25">
                  <Link href="/app">Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button variant="ghost" size="sm" asChild>
                    <Link href="/auth">Sign In</Link>
                  </Button>
                  <Button asChild size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-lg shadow-blue-500/25">
                    <Link href="/auth">Get Started</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900"></div>
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200/30 dark:bg-blue-900/20 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200/30 dark:bg-purple-900/20 rounded-full blur-3xl"></div>
        
        <div className="relative max-w-7xl mx-auto px-6 text-center">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200/50 dark:border-gray-700/50 rounded-full px-6 py-3 shadow-lg">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                AI-Powered Learning Platform
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              <span className="text-gray-900 dark:text-white">
                Master Any Skill with
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-clip-text text-transparent">
                AI-Powered
              </span>
              <br />
              <span className="text-gray-900 dark:text-white">
                Learning Paths
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Get personalized daily lessons, track your progress, and achieve your learning goals with intelligent AI guidance that adapts to your style.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              {isAuthenticated ? (
                <Button 
                  size="lg" 
                  asChild 
                  className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl shadow-blue-500/25 rounded-2xl"
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
                    className="text-lg px-10 py-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 shadow-xl shadow-blue-500/25 rounded-2xl"
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
                    className="text-lg px-10 py-6 border-2 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-2xl"
                  >
                    <Link href="/auth">Watch Demo</Link>
                  </Button>
                </>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-2xl mx-auto pt-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">10K+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Active Learners</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">500+</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Skills Available</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">95%</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Why Choose LearnOV AI?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI with proven learning methodologies to deliver an unparalleled educational experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 hover:-translate-y-2 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Brain className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  AI-Powered Lessons
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Get personalized daily lessons tailored to your learning style, pace, and current knowledge level
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 2 */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 hover:-translate-y-2 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Target className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Goal-Oriented Learning
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Set clear learning objectives and track your progress with detailed analytics and insights
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 3 */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 hover:-translate-y-2 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Daily Consistency
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Build lasting habits with daily reminders, streak tracking, and motivational insights
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 4 */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 hover:-translate-y-2 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Progress Tracking
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Visualize your learning journey with comprehensive progress analytics and performance metrics
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 5 */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 hover:-translate-y-2 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Secure & Private
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                  Your data is protected with enterprise-grade security and privacy controls
                </CardDescription>
              </CardContent>
            </Card>

            {/* Feature 6 */}
            <Card className="group border-0 shadow-lg hover:shadow-2xl transition-all duration-500 bg-white dark:bg-gray-800 hover:-translate-y-2 rounded-3xl overflow-hidden">
              <CardHeader className="text-center pb-6">
                <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Lightning Fast
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center pb-8">
                <CardDescription className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
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
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 p-12 text-center text-white">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
            
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

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Brain className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white">LearnOV AI</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm">
                AI-powered learning platform that adapts to your style and helps you achieve your goals.
              </p>
            </div>

            {/* Product */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Product</h3>
              <div className="space-y-2">
                <Link href="#features" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Features
                </Link>
                <Link href="/app" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Dashboard
                </Link>
                <Link href="/app/create" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Create Goal
                </Link>
                <Link href="/app/plans" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Learning Plans
                </Link>
              </div>
            </div>

            {/* Company */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Company</h3>
              <div className="space-y-2">
                <Link href="#about" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  About
                </Link>
                <Link href="#pricing" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Pricing
                </Link>
                <Link href="/privacy" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Privacy
                </Link>
                <Link href="/terms" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Terms
                </Link>
              </div>
            </div>

            {/* Support */}
            <div className="space-y-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Support</h3>
              <div className="space-y-2">
                <Link href="/help" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Help Center
                </Link>
                <Link href="/contact" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
                <Link href="/status" className="block text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors text-sm">
                  Status
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              © 2025 LearnOV AI. All rights reserved.
            </div>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link href="/twitter" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>
              <Link href="/github" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                </svg>
              </Link>
              <Link href="/linkedin" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.328v15.344C1 18.4 1.595 19 2.328 19h15.34c.734 0 1.332-.6 1.332-1.344V2.328C19 1.581 18.4 1 17.668 1z" clipRule="evenodd" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
