import { AppHeader } from "@/components/app-header";
import { Check, Crown, Star, Target, Zap, Sparkles, ArrowRight, CheckCircle, Shield, BookOpen } from "lucide-react";
import Link from "next/link";

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <AppHeader />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Hero Section */}
          <section className="relative text-center space-y-8">
            {/* Modern gradient background */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400/20 via-indigo-400/20 to-cyan-400/20 rounded-full blur-3xl animate-pulse" />
              <div className="absolute -bottom-20 -right-20 w-32 h-32 bg-gradient-to-br from-cyan-400/20 via-purple-400/20 to-indigo-400/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-br from-indigo-400/15 via-purple-400/15 to-cyan-400/15 rounded-full blur-2xl animate-pulse" style={{animationDelay: '2s'}} />
            </div>
            
            {/* Glassmorphism container */}
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 dark:border-slate-700/50 shadow-xl">
              <div className="relative z-10">
                <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300 rounded-full mb-8">
                  <Sparkles className="w-5 h-5 text-yellow-600 animate-pulse" />
                  <span className="text-yellow-800 dark:text-yellow-200 font-medium">Choose Your Plan</span>
                </div>
                
                <h1 className="font-heading text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl mb-6">
                  <span className="text-slate-900 dark:text-slate-100">
                    Simple, Transparent
                  </span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600">
                    Pricing
                  </span>
                </h1>
                
                <p className="text-2xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto leading-relaxed">
                  Start learning for free and upgrade as you grow. All plans include our AI-powered learning engine 
                  and personalized content designed to help you succeed.
                </p>
              </div>
            </div>
          </section>

          {/* Pricing Tiers Section */}
          <section className="relative space-y-8">
            <div className="grid gap-8 lg:grid-cols-3 max-w-7xl mx-auto">
              
              {/* Free Tier */}
              <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-slate-500 to-slate-600 rounded-3xl flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Target className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Free</h3>
                    <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">$0</div>
                    <p className="text-slate-600 dark:text-slate-400">Ad-Supported</p>
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">1 active learning goal/plan at a time</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Access to 7-day and 30-day lesson plans only</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Basic progress tracking</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Community support</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Contains ads</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/auth"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-slate-500 to-slate-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Pro Tier */}
              <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border-2 border-purple-200 dark:border-purple-700 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
                {/* Popular Badge */}
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                  <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-lg">
                    Most Popular
                  </div>
                </div>
                
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-3xl flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Star className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Pro</h3>
                    <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">$4.99</div>
                    <p className="text-slate-600 dark:text-slate-400">per month</p>
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Up to 5 active learning goals/plans at a time</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Access to all lesson lengths (7, 30, 60, 90 days)</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Flashcards included</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Ad-free experience</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Advanced progress analytics</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Priority support</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/auth"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    Start Pro Trial
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </div>
              </div>

              {/* Elite Tier */}
              <div className="group relative bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <div className="text-center space-y-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-3xl flex items-center justify-center shadow-lg mx-auto group-hover:scale-110 transition-transform duration-300">
                    <Crown className="h-10 w-10 text-white" />
                  </div>
                  
                  <div>
                    <h3 className="font-heading text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">Elite</h3>
                    <div className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-1">$10.99</div>
                    <p className="text-slate-600 dark:text-slate-400">per month</p>
                  </div>
                  
                  <div className="space-y-4 text-left">
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Unlimited active learning goals/plans</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Everything in Pro</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Access to advanced AI models</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Faster, more accurate lessons</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Custom learning paths</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">Offline mode for mobile app</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Check className="h-5 w-5 text-green-500 flex-shrink-0" />
                      <span className="text-slate-600 dark:text-slate-300">VIP support & onboarding</span>
                    </div>
                  </div>
                  
                  <Link 
                    href="/auth"
                    className="inline-flex items-center justify-center w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
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
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300 rounded-full">
                <Zap className="w-5 h-5 text-yellow-600 animate-pulse" />
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">Feature Comparison</span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-slate-100">What&apos;s Included in Each Plan</h2>
            </div>
            
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 dark:border-slate-700/50 shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-700">
                      <th className="py-4 px-6 text-lg font-semibold text-slate-900 dark:text-slate-100">Feature</th>
                      <th className="py-4 px-6 text-lg font-semibold text-slate-900 dark:text-slate-100 text-center">Free</th>
                      <th className="py-4 px-6 text-lg font-semibold text-slate-900 dark:text-slate-100 text-center">Pro</th>
                      <th className="py-4 px-6 text-lg font-semibold text-slate-900 dark:text-slate-100 text-center">Elite</th>
                    </tr>
                  </thead>
                  <tbody className="space-y-4">
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">Active Learning Goals</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">1</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">5</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Unlimited</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">Lesson Plan Lengths</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">7, 30 days</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">7, 30, 60, 90 days</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">All + Custom</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">Flashcards</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Basic</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Unlimited</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Unlimited + AI</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">AI Models</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Standard</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Enhanced</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Advanced</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">Ads</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Yes</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">No</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">No</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">Offline Mode</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">No</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">No</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Yes</td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-800">
                      <td className="py-4 px-6 text-slate-600 dark:text-slate-300">Support</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Community</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">Priority</td>
                      <td className="py-4 px-6 text-center text-slate-600 dark:text-slate-300">VIP</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Money Back Guarantee Section */}
          <section className="relative text-center space-y-8">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 dark:border-slate-700/50 shadow-xl">
              <div className="space-y-6">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-green-500/25 mx-auto">
                  <Shield className="h-10 w-10 text-white" />
                </div>
                
                <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-slate-100">
                  Risk-Free Learning
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Try any paid plan with confidence. We offer a 30-day money-back guarantee on all subscriptions.
                </p>
                <div className="flex items-center justify-center gap-2 text-green-600 dark:text-green-400 font-semibold">
                  <CheckCircle className="w-5 h-5" />
                  <span>30-day money-back guarantee</span>
                </div>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="relative space-y-8">
            <div className="text-center space-y-4 mb-12">
              <div className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300 rounded-full">
                <BookOpen className="w-5 h-5 text-yellow-600 animate-pulse" />
                <span className="text-yellow-800 dark:text-yellow-200 font-medium">Frequently Asked Questions</span>
              </div>
              <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-slate-100">Common Questions About Our Plans</h2>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">Can I switch plans anytime?</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Yes! You can upgrade, downgrade, or cancel your subscription at any time. Changes take effect immediately.
                  </p>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">What happens to my data if I cancel?</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Your learning progress and data are preserved. You can reactivate anytime and continue where you left off.
                  </p>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">Do you offer team discounts?</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Yes! Contact us for custom pricing on team plans with 5+ users. We offer significant discounts for larger groups.
                  </p>
                </div>
              </div>

              <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 border border-white/20 dark:border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <h3 className="font-heading text-xl font-semibold text-slate-900 dark:text-slate-100">Is there a free trial for paid plans?</h3>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                    Yes! All paid plans come with a 7-day free trial. No credit card required to start your trial.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Call to Action */}
          <section className="relative text-center space-y-8">
            <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-white/20 dark:border-slate-700/50 shadow-xl">
              <div className="space-y-6">
                <h2 className="font-heading text-4xl font-bold text-slate-900 dark:text-slate-100">
                  Ready to Start Learning?
                </h2>
                <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                  Choose the plan that fits your learning goals and start your journey with AI-powered education today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <Link 
                    href="/auth"
                    className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 text-white font-semibold rounded-2xl hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
                  >
                    <CheckCircle className="w-5 h-5" />
                    Start Learning Today
                  </Link>
                  <Link 
                    href="/about"
                    className="inline-flex items-center gap-2 px-8 py-4 border-2 border-purple-300 dark:border-purple-600 text-purple-600 dark:text-purple-400 font-semibold rounded-2xl hover:bg-purple-50 dark:hover:bg-purple-900/20 hover:text-purple-700 dark:hover:text-purple-300 transition-all duration-300"
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
