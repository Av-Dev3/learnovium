"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Search, BookOpen, Target, Brain, Zap, Settings, HelpCircle, ArrowRight, BarChart3, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openSections, setOpenSections] = useState<{ [key: string]: boolean }>({});

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const faqSections = [
    {
      id: "getting-started",
      title: "Getting Started",
      icon: <Zap className="w-5 h-5" />,
      color: "from-blue-500 to-cyan-500",
      questions: [
        {
          question: "How do I create my first learning plan?",
          answer: "To create your first learning plan, click the &apos;Create Plan&apos; button on your dashboard or go to the Plans section. Choose a topic you want to learn, set your learning goals, and our AI will generate a personalized learning path with daily lessons tailored to your skill level and preferences."
        },
        {
          question: "What makes Learnovium different from other learning platforms?",
          answer: "Learnovium uses advanced AI to create personalized learning experiences. Unlike static courses, our platform adapts to your progress, generates custom content, and provides intelligent recommendations. Each lesson is crafted specifically for your learning style and goals."
        },
        {
          question: "How do I set up my profile and preferences?",
          answer: "Go to Settings from your user menu to customize your profile. You can upload an avatar, set your learning preferences, adjust notification settings, and configure your learning schedule. The more you customize, the better our AI can personalize your experience."
        },
        {
          question: "Is there a mobile app available?",
          answer: "Learnovium is fully responsive and works great on mobile devices through your web browser. We&apos;re working on dedicated mobile apps for iOS and Android, which will be available soon."
        }
      ]
    },
    {
      id: "navigation",
      title: "Navigation & Interface",
      icon: <Target className="w-5 h-5" />,
      color: "from-purple-500 to-pink-500",
      questions: [
        {
          question: "How do I navigate the dashboard?",
          answer: "Your dashboard is the central hub where you can see all your active learning plans, progress, and upcoming lessons. Use the sidebar (desktop) or hamburger menu (mobile) to access different sections like Plans, Stats, Settings, and more."
        },
        {
          question: "What's the difference between Plans and Lessons?",
          answer: "Plans are comprehensive learning paths for specific topics (like 'Learn Python' or 'Master Guitar'). Each plan contains multiple lessons that build upon each other. Lessons are individual learning sessions within a plan that you complete daily."
        },
        {
          question: "How do I access my learning history?",
          answer: "Click on 'History' in the navigation menu to see all your completed lessons, plans, and learning achievements. You can filter by date, topic, or plan to review your learning journey."
        },
        {
          question: "What do the different icons and badges mean?",
          answer: "Icons throughout the interface represent different features: 📚 for lessons, 🎯 for goals, 📊 for stats, ⚙️ for settings. Badges show your achievements, streaks, and progress milestones. Hover over any icon or badge for more information."
        }
      ]
    },
    {
      id: "learning-features",
      title: "Learning Features",
      icon: <Brain className="w-5 h-5" />,
      color: "from-green-500 to-emerald-500",
      questions: [
        {
          question: "How do daily lessons work?",
          answer: "Each day, you'll receive a new lesson based on your current progress and learning goals. Lessons are designed to take 15-30 minutes and include interactive content, practice exercises, and knowledge checks. Complete them at your own pace throughout the day."
        },
        {
          question: "What are flashcards and how do I use them?",
          answer: "Flashcards help reinforce key concepts through spaced repetition. They're automatically generated from your lessons and appear in your daily review. Use the Flashcards section to practice and strengthen your memory of important information."
        },
        {
          question: "How do quizzes work?",
          answer: "Quizzes test your understanding of lesson material and help identify areas for improvement. They're automatically generated and can be taken multiple times. Your performance helps our AI adjust future lesson difficulty and content."
        },
        {
          question: "What are learning streaks and how do they work?",
          answer: "Learning streaks track consecutive days of learning activity. Complete at least one lesson or review session each day to maintain your streak. Streaks motivate consistent learning and unlock special achievements."
        },
        {
          question: "How does the AI adapt to my learning style?",
          answer: "Our AI analyzes your progress, quiz performance, time spent on lessons, and feedback to continuously adapt your learning experience. It adjusts lesson difficulty, content style, and pacing to match your optimal learning pattern."
        }
      ]
    },
    {
      id: "progress-tracking",
      title: "Progress & Analytics",
      icon: <BarChart3 className="w-5 h-5" />,
      color: "from-orange-500 to-red-500",
      questions: [
        {
          question: "How can I track my learning progress?",
          answer: "Visit the Stats section to see detailed analytics including completion rates, time spent learning, streak counts, and skill improvements. The dashboard also shows your overall progress across all active plans."
        },
        {
          question: "What statistics are available to me?",
          answer: "You can view total learning time, lessons completed, current streaks, accuracy rates, skill level progressions, and comparative performance over time. All data is presented in easy-to-understand charts and graphs."
        },
        {
          question: "How do I see my achievements and badges?",
          answer: "Achievements and badges are displayed in your Stats section and profile. They recognize milestones like completing your first lesson, maintaining a 7-day streak, mastering a skill, or completing a full learning plan."
        },
        {
          question: "Can I export my learning data?",
          answer: "Yes, you can export your learning data including progress reports, completed lessons, and achievements. Go to Settings > Data Export to download your information in various formats."
        }
      ]
    },
    {
      id: "plans-goals",
      title: "Plans & Goals",
      icon: <BookOpen className="w-5 h-5" />,
      color: "from-indigo-500 to-purple-500",
      questions: [
        {
          question: "How do I create a new learning plan?",
          answer: "Click 'Create Plan' on your dashboard, select a topic or skill you want to learn, set your learning goals and timeline, and our AI will generate a personalized learning path with daily lessons and milestones."
        },
        {
          question: "Can I have multiple learning plans active at once?",
          answer: "Yes, you can have multiple active learning plans simultaneously. However, we recommend focusing on 2-3 plans at a time to maintain quality learning and avoid overwhelming yourself."
        },
        {
          question: "How do I pause or modify a learning plan?",
          answer: "Go to your Plans section, select the plan you want to modify, and use the options menu to pause, resume, or adjust your learning goals. You can also change the difficulty level or learning pace."
        },
        {
          question: "What happens when I complete a learning plan?",
          answer: "When you complete a plan, you'll receive a completion certificate, unlock related achievements, and get recommendations for advanced topics or related skills to continue your learning journey."
        },
        {
          question: "How do I set learning goals?",
          answer: "Learning goals can be set when creating a plan or modified in the plan settings. You can set time-based goals (learn in 30 days), skill-based goals (reach intermediate level), or achievement-based goals (complete 50 lessons)."
        }
      ]
    },
    {
      id: "troubleshooting",
      title: "Troubleshooting",
      icon: <Settings className="w-5 h-5" />,
      color: "from-gray-500 to-slate-500",
      questions: [
        {
          question: "What should I do if a lesson isn't loading?",
          answer: "Try refreshing the page or clearing your browser cache. If the problem persists, check your internet connection and try using a different browser. Contact support if the issue continues."
        },
        {
          question: "How do I reset my password?",
          answer: "Go to the sign-in page and click 'Forgot Password'. Enter your email address and follow the instructions sent to your inbox to reset your password securely."
        },
        {
          question: "Why aren't my progress updates saving?",
          answer: "Ensure you have a stable internet connection and that you're logged in. Try refreshing the page and completing the lesson again. If the issue persists, contact our support team."
        },
        {
          question: "How do I change my email address?",
          answer: "Go to Settings > Account Information to update your email address. You'll need to verify the new email address before the change takes effect."
        },
        {
          question: "What if I'm not receiving email notifications?",
          answer: "Check your spam folder first, then go to Settings > Notifications to ensure email notifications are enabled. You can also add our email address to your contacts to prevent future issues."
        }
      ]
    }
  ];

  const quickLinks = [
    { title: "Create Your First Plan", href: "/app/create", icon: <Target className="w-4 h-4" /> },
    { title: "View Your Progress", href: "/app/stats", icon: <BarChart3 className="w-4 h-4" /> },
    { title: "Manage Settings", href: "/app/settings", icon: <Settings className="w-4 h-4" /> },
    { title: "Contact Support", href: "/contact", icon: <MessageSquare className="w-4 h-4" /> }
  ];

  const filteredSections = faqSections.map(section => ({
    ...section,
    questions: section.questions.filter(q => 
      q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(section => section.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
            <HelpCircle className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 mb-4">
            Help Center
          </h1>
          <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
            Everything you need to know about using Learnovium effectively. Find answers, learn tips, and get the most out of your learning experience.
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-2xl mx-auto mb-8">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
            <Input
              type="text"
              placeholder="Search help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 py-3 text-lg rounded-2xl border-2 border-slate-200 dark:border-slate-700 focus:border-blue-500 dark:focus:border-blue-400 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm"
            />
          </div>
        </div>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {quickLinks.map((link, index) => (
            <Card key={index} className="group hover:shadow-lg transition-all duration-300 hover:scale-105 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardContent className="p-6">
                <a href={link.href} className="flex items-center space-x-3 text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg group-hover:bg-blue-200 dark:group-hover:bg-blue-800/50 transition-colors">
                    {link.icon}
                  </div>
                  <span className="font-medium">{link.title}</span>
                  <ArrowRight className="w-4 h-4 ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {filteredSections.map((section) => (
            <Card key={section.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-slate-200 dark:border-slate-700">
              <CardHeader 
                className="cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors rounded-t-lg"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${section.color} text-white`}>
                      {section.icon}
                    </div>
                    <div>
                      <CardTitle className="text-2xl">{section.title}</CardTitle>
                      <CardDescription className="text-base">
                        {section.questions.length} question{section.questions.length !== 1 ? 's' : ''}
                      </CardDescription>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="p-2">
                    {openSections[section.id] ? (
                      <ChevronUp className="w-5 h-5" />
                    ) : (
                      <ChevronDown className="w-5 h-5" />
                    )}
                  </Button>
                </div>
              </CardHeader>
              
              {openSections[section.id] && (
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    {section.questions.map((faq, index) => (
                      <div key={index} className="border-l-4 border-blue-200 dark:border-blue-800 pl-4 py-2">
                        <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
                          {faq.question}
                        </h4>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                          {faq.answer}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        {/* Contact Support Section */}
        <Card className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              <MessageSquare className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4">
              Still need help?
            </h3>
            <p className="text-slate-600 dark:text-slate-300 mb-6 max-w-2xl mx-auto">
              Can&apos;t find what you&apos;re looking for? Our support team is here to help you succeed in your learning journey.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                <a href="/contact">Contact Support</a>
              </Button>
              <Button variant="outline" asChild>
                <a href="mailto:support@learnovium.com">Email Us</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
