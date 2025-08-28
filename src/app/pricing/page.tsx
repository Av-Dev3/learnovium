import { AppHeader } from "@/components/app-header";
import { Check, Crown, Star, Target, Zap, Sparkles, ArrowRight, CheckCircle, Shield, BookOpen } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <section className="relative text-center space-y-8">
            {/* Animated background elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-brand/20 via-purple-500/20 to-indigo-500/20 rounded-full blur-3xl animate-pulse" />
            <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-br from-purple-400/20 via-indigo-400/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-brand/15 to-purple-500/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand/10 to-purple-600/10 rounded-full border border-brand/20 mb-8">
                <Sparkles className="w-5 h-5 text-brand" />
                <span className="text-brand font-medium">Choose Your Plan</span>
              </div>
              
              <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                <span className="bg-gradient-to-r from-[var(--fg)] via-brand to-purple-600 bg-clip-text text-transparent">
                  Simple, Transparent
                </span>
                <br />
                <span className="bg-gradient-to-r from-brand via-purple-600 to-[var(--fg)] bg-clip-text text-transparent">
                  Pricing
                </span>
              </h1>
              
              <p className="text-2xl text-[var(--fg)]/80 max-w-4xl mx-auto leading-relaxed">
                Start learning for free and upgrade as you grow. All plans include our AI-powered learning engine 
                and personalized content designed to help you succeed.
              </p>
            </div>
          </section>

          {/* Pricing Tiers Section */}
          <section className="relative space-y-8">
            <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
              
              {/* Free Tier */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-gray-500/25 to-gray-400/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-gray-400/25 to-gray-300/25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-gray-500 to-gray-600 rounded-3xl flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-transform duration-500">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-[var(--fg)] mb-2">Free</h3>
                    <div className="text-4xl font-bold text-[var(--fg)] mb-1">$0</div>
                    <p className="text-[var(--fg)]/60">Ad-Supported</p>
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">1 active learning goal/plan at a time</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Access to 7-day and 30-day lesson plans only</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Basic progress tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Community support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Contains ads</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/auth"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-gray-500 to-gray-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Pro Tier */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand/20 via-purple-600/20 to-indigo-500/20 p-8 backdrop-blur-xl shadow-2xl border-2 border-brand/30 hover:shadow-3xl hover:scale-105 transition-all duration-500">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-brand to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
                
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-brand to-purple-600 rounded-3xl flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-transform duration-500">
                    <Star className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-[var(--fg)] mb-2">Pro</h3>
                    <div className="text-4xl font-bold text-[var(--fg)] mb-1">$4.99</div>
                    <p className="text-[var(--fg)]/60">per month</p>
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Up to 5 active learning goals/plans at a time</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Access to all lesson lengths (7, 30, 60, 90 days)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Flashcards included</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Ad-free experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Advanced progress analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Priority support</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/auth"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-brand to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Start Pro Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Elite Tier */}
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-yellow-500/20 via-orange-600/20 to-amber-500/20 p-8 backdrop-blur-xl shadow-xl border border-yellow-500/30 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-yellow-500/25 via-orange-500/25 to-amber-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                <div className="absolute -bottom-6 -left-6 w-20 h-20 bg-gradient-to-br from-orange-400/25 via-amber-400/25 to-yellow-400/25 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-700" />
                
                <div className="relative z-10 text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-3xl flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-transform duration-500">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-[var(--fg)] mb-2">Elite</h3>
                    <div className="text-4xl font-bold text-[var(--fg)] mb-1">$10.99</div>
                    <p className="text-[var(--fg)]/60">per month</p>
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Unlimited active learning goals/plans</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Everything in Pro</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Access to advanced AI models</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Faster, more accurate lessons</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">Custom learning paths</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-[var(--fg)]/80">VIP support & onboarding</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/auth"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Start Elite Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>
            </div>
          </section>

          {/* Features Comparison Section */}
          <section className="relative space-y-8">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand/10 to-purple-600/10 rounded-full border border-brand/20">
                <Zap className="w-5 h-5 text-brand" />
                <span className="text-brand font-medium">Feature Comparison</span>
              </div>
              <h2 className="font-heading text-4xl font-bold">What&apos;s Included in Each Plan</h2>
            </div>
            
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/20 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-12 backdrop-blur-xl shadow-2xl border border-white/20 dark:border-white/10">
              {/* Enhanced animated background elements */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-brand/30 via-purple-500/30 to-indigo-500/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-purple-400/30 via-indigo-400/30 to-blue-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
              
              <div className="relative z-10">
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-white/20">
                        <th className="py-4 px-6 text-lg font-semibold text-[var(--fg)]">Feature</th>
                        <th className="py-4 px-6 text-lg font-semibold text-[var(--fg)] text-center">Free</th>
                        <th className="py-4 px-6 text-lg font-semibold text-[var(--fg)] text-center">Pro</th>
                        <th className="py-4 px-6 text-lg font-semibold text-[var(--fg)] text-center">Elite</th>
                      </tr>
                    </thead>
                    <tbody className="space-y-4">
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-6 text-[var(--fg)]/80">Active Learning Goals</td>
                        <td className="py-4 px-6 text-center">1</td>
                        <td className="py-4 px-6 text-center">5</td>
                        <td className="py-4 px-6 text-center">Unlimited</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-6 text-[var(--fg)]/80">Lesson Plan Lengths</td>
                        <td className="py-4 px-6 text-center">7, 30 days</td>
                        <td className="py-4 px-6 text-center">7, 30, 60, 90 days</td>
                        <td className="py-4 px-6 text-center">All + Custom</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-6 text-[var(--fg)]/80">Flashcards</td>
                        <td className="py-4 px-6 text-center">Basic</td>
                        <td className="py-4 px-6 text-center">Unlimited</td>
                        <td className="py-4 px-6 text-center">Unlimited + AI</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-6 text-[var(--fg)]/80">AI Models</td>
                        <td className="py-4 px-6 text-center">Standard</td>
                        <td className="py-4 px-6 text-center">Enhanced</td>
                        <td className="py-4 px-6 text-center">Advanced</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-6 text-[var(--fg)]/80">Ads</td>
                        <td className="py-4 px-6 text-center">Yes</td>
                        <td className="py-4 px-6 text-center">No</td>
                        <td className="py-4 px-6 text-center">No</td>
                      </tr>
                      <tr className="border-b border-white/10">
                        <td className="py-4 px-6 text-[var(--fg)]/80">Support</td>
                        <td className="py-4 px-6 text-center">Community</td>
                        <td className="py-4 px-6 text-center">Priority</td>
                        <td className="py-4 px-6 text-center">VIP</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* Money Back Guarantee Section */}
          <section className="relative text-center space-y-8">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-green-500/20 via-emerald-600/20 to-green-500/20 p-12 backdrop-blur-xl shadow-2xl border border-green-500/30">
              {/* Animated background elements */}
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-gradient-to-br from-green-500/30 via-emerald-500/30 to-green-400/30 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-gradient-to-br from-emerald-400/30 via-green-400/30 to-green-500/30 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
              
              <div className="relative z-10 space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/25 mx-auto">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="font-heading text-4xl font-bold text-[var(--fg)]">
                  Risk-Free Learning
                </h2>
                <p className="text-xl text-[var(--fg)]/80 max-w-2xl mx-auto">
                  Try any paid plan with confidence. We offer a 30-day money-back guarantee on all subscriptions.
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="relative space-y-8">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-brand/10 to-purple-600/10 rounded-full border border-brand/20">
                <BookOpen className="w-5 h-5 text-brand" />
                <span className="text-brand font-medium">Frequently Asked Questions</span>
              </div>
              <h2 className="font-heading text-4xl font-bold">Common Questions About Our Plans</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-brand/25 via-purple-500/25 to-indigo-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-4">
                  <h3 className="font-heading text-xl font-semibold text-[var(--fg)]">Can I switch plans anytime?</h3>
                  <p className="text-[var(--fg)]/70 leading-relaxed">
                    Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-purple-400/25 via-indigo-400/25 to-blue-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-4">
                  <h3 className="font-heading text-xl font-semibold text-[var(--fg)]">What happens to my data if I cancel?</h3>
                  <p className="text-[var(--fg)]/70 leading-relaxed">
                    Your learning progress and data are preserved. You can reactivate anytime and continue where you left off.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-indigo-400/25 via-blue-400/25 to-cyan-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-4">
                  <h3 className="font-heading text-xl font-semibold text-[var(--fg)]">Do you offer team discounts?</h3>
                  <p className="text-[var(--fg)]/70 leading-relaxed">
                    Yes! Contact us for custom pricing on team plans with 5+ users. We offer significant discounts for larger groups.
                  </p>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-white/15 via-white/10 to-white/5 dark:from-white/10 dark:via-white/5 dark:to-white/0 p-8 backdrop-blur-xl shadow-xl border border-white/20 dark:border-white/10 hover:shadow-2xl hover:scale-105 transition-all duration-500">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-gradient-to-br from-blue-400/25 via-cyan-400/25 to-teal-500/25 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700" />
                
                <div className="relative z-10 space-y-4">
                  <h3 className="font-heading text-xl font-semibold text-[var(--fg)]">Is there a free trial for paid plans?</h3>
                  <p className="text-[var(--fg)]/70 leading-relaxed">
                    Yes! All paid plans come with a 7-day free trial. No credit card required to start your trial.
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
                  Ready to Start Learning?
                </h2>
                <p className="text-xl text-[var(--fg)]/80 max-w-2xl mx-auto">
                  Choose the plan that fits your learning goals and start your journey with AI-powered education today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    href="/auth"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-brand to-purple-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Start Learning Today
                  </Link>
                  <Link 
                    href="/about"
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-brand text-brand font-semibold rounded-2xl hover:bg-brand hover:text-white transition-all duration-300"
                  >
                    Learn More About Us
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
