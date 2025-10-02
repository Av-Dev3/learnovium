"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  TrendingUp, 
  Target, 
  Brain, 
  Star, 
  ArrowRight, 
  Lightbulb,
  ArrowLeft,
  CheckCircle,
  Clock,
  Zap,
  Users,
  AlertCircle,
  Sparkles,
  BarChart3,
  Plus,
  ExternalLink
} from "lucide-react";
import Link from "next/link";

// Mock data for recommendations
const mockCurrentGoals = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    progress: 65,
    difficulty: "medium",
    timeSpent: 45, // hours
    avgSessionTime: 35, // minutes
    streakDays: 12,
    lastActivity: "2024-01-20",
    improvementAreas: [
      { area: "Async/Await", confidence: 40, importance: "high" },
      { area: "DOM Manipulation", confidence: 55, importance: "medium" },
      { area: "Error Handling", confidence: 30, importance: "high" }
    ],
    nextMilestones: [
      "Complete Promises module",
      "Build a simple web app",
      "Practice debugging techniques"
    ]
  },
  {
    id: "2",
    title: "React Development",
    progress: 80,
    difficulty: "hard",
    timeSpent: 72, // hours
    avgSessionTime: 50, // minutes
    streakDays: 8,
    lastActivity: "2024-01-19",
    improvementAreas: [
      { area: "State Management", confidence: 60, importance: "high" },
      { area: "Performance Optimization", confidence: 35, importance: "medium" },
      { area: "Testing", confidence: 25, importance: "high" }
    ],
    nextMilestones: [
      "Learn Redux Toolkit",
      "Implement unit tests",
      "Optimize component renders"
    ]
  }
];

const mockRecommendedGoals = [
  {
    id: "next-1",
    title: "Node.js Backend Development",
    reason: "Perfect next step after JavaScript fundamentals",
    difficulty: "medium",
    estimatedDuration: "45 days",
    prerequisites: ["JavaScript Fundamentals"],
    skillsGained: ["API Development", "Database Integration", "Server Management"],
    popularity: 85,
    matchScore: 92
  },
  {
    id: "next-2", 
    title: "TypeScript Mastery",
    reason: "Enhance your JavaScript and React skills",
    difficulty: "medium",
    estimatedDuration: "30 days",
    prerequisites: ["JavaScript Fundamentals", "React Development"],
    skillsGained: ["Type Safety", "Better IDE Support", "Large-scale Development"],
    popularity: 78,
    matchScore: 88
  },
  {
    id: "next-3",
    title: "Data Structures & Algorithms",
    reason: "Strengthen your programming foundation",
    difficulty: "hard",
    estimatedDuration: "60 days",
    prerequisites: ["JavaScript Fundamentals"],
    skillsGained: ["Problem Solving", "Code Optimization", "Technical Interviews"],
    popularity: 72,
    matchScore: 75
  }
];

const mockLearningInsights = [
  {
    type: "strength",
    title: "Consistent Learning Habit",
    description: "You've maintained a 12-day streak! Your regular study sessions are paying off.",
    action: "Keep it up and aim for a 30-day milestone",
    icon: "streak"
  },
  {
    type: "improvement",
    title: "Session Length Optimization",
    description: "Your average session is 35 minutes. Consider 45-50 minute sessions for better retention.",
    action: "Try extending your next few sessions by 10-15 minutes",
    icon: "clock"
  },
  {
    type: "opportunity",
    title: "Peer Learning Available",
    description: "3 other learners are studying JavaScript. Join study groups for better engagement.",
    action: "Connect with study partners in your area",
    icon: "users"
  },
  {
    type: "warning",
    title: "Knowledge Gap Detected",
    description: "Your async programming confidence is low (40%) but it's crucial for modern JavaScript.",
    action: "Dedicate 2-3 sessions specifically to async concepts",
    icon: "alert"
  }
];

const mockTrendingSkills = [
  { skill: "AI/Machine Learning", demand: 95, growth: "+45%" },
  { skill: "React/Next.js", demand: 88, growth: "+32%" },
  { skill: "Cloud Computing", demand: 82, growth: "+28%" },
  { skill: "TypeScript", demand: 79, growth: "+41%" },
  { skill: "DevOps", demand: 76, growth: "+35%" }
];

export default function RecommendationsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'improvements' | 'next-goals' | 'insights' | 'trending'>('improvements');

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const getInsightIcon = (iconType: string) => {
    switch (iconType) {
      case 'streak': return <Zap className="h-5 w-5" />;
      case 'clock': return <Clock className="h-5 w-5" />;
      case 'users': return <Users className="h-5 w-5" />;
      case 'alert': return <AlertCircle className="h-5 w-5" />;
      default: return <Lightbulb className="h-5 w-5" />;
    }
  };

  const getInsightColors = (type: string) => {
    switch (type) {
      case 'strength': return 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-300';
      case 'improvement': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300';
      case 'opportunity': return 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800 text-purple-700 dark:text-purple-300';
      case 'warning': return 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800 text-orange-700 dark:text-orange-300';
      default: return 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 70) return 'text-green-600 dark:text-green-400';
    if (confidence >= 50) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-[var(--fg)]/70">Loading your recommendations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-12 pt-8">
        {/* Clean Header Design */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <header className="relative overflow-hidden rounded-2xl bg-gradient-fresh p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300">
                <Lightbulb className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-yellow-100 drop-shadow-sm">AI Recommendations</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Your Learning Path 🎯
              </h1>
              <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                Personalized recommendations to accelerate your learning journey
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="hover:bg-white/20 text-white border-white/30"
              >
                <Link href="/app">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </div>
          </header>
        </section>

        {/* Tab Navigation */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { id: 'improvements', label: 'Improvements', icon: TrendingUp },
              { id: 'next-goals', label: 'Next Goals', icon: Target },
              { id: 'insights', label: 'Insights', icon: Brain },
              { id: 'trending', label: 'Trending', icon: Star }
            ].map((tab) => (
              <Button
                key={tab.id}
                onClick={() => setSelectedTab(tab.id as 'improvements' | 'next-goals' | 'insights' | 'trending')}
                className={`h-16 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                  selectedTab === tab.id
                    ? 'bg-gradient-to-r from-brand to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:shadow-lg hover:scale-105 hover:border-brand hover:ring-4 hover:ring-brand/20'
                }`}
              >
                <div className="flex flex-col items-center gap-2">
                  <tab.icon className="h-6 w-6" />
                  <span className="text-sm">{tab.label}</span>
                </div>
              </Button>
            ))}
          </div>
        </section>

        {/* Tab Content */}
        {selectedTab === 'improvements' && (
          <div className="space-y-8">
            {mockCurrentGoals.map((goal) => (
              <section key={goal.id} className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
                <div className="space-y-6">
                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-2">{goal.title}</h2>
                      <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="h-4 w-4" />
                          <span>{goal.progress}% Complete</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{goal.timeSpent}h Total</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Zap className="h-4 w-4" />
                          <span>{goal.streakDays} Day Streak</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getDifficultyColor(goal.difficulty)}>
                        {goal.difficulty}
                      </Badge>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-brand">{goal.progress}%</div>
                        <div className="text-sm text-slate-500 dark:text-slate-400">Progress</div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Areas for Improvement */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-orange-500" />
                        Areas for Improvement
                      </h3>
                      <div className="space-y-3">
                        {goal.improvementAreas.map((area, index) => (
                          <div key={index} className="p-4 rounded-xl bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-slate-800 dark:text-slate-200">{area.area}</span>
                              <Badge variant="outline" className={area.importance === 'high' ? 'border-red-300 text-red-700 dark:border-red-700 dark:text-red-300' : 'border-yellow-300 text-yellow-700 dark:border-yellow-700 dark:text-yellow-300'}>
                                {area.importance} priority
                              </Badge>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex-1">
                                <div className="flex items-center justify-between text-sm mb-1">
                                  <span className="text-slate-600 dark:text-slate-400">Confidence</span>
                                  <span className={`font-semibold ${getConfidenceColor(area.confidence)}`}>{area.confidence}%</span>
                                </div>
                                <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                                  <div 
                                    className={`h-2 rounded-full ${area.confidence >= 70 ? 'bg-green-500' : area.confidence >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`}
                                    style={{ width: `${area.confidence}%` }}
                                  />
                                </div>
                              </div>
                              <Button size="sm" variant="outline" className="text-xs">
                                Focus Study
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Next Milestones */}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-200 mb-4 flex items-center gap-2">
                        <Target className="h-5 w-5 text-brand" />
                        Next Milestones
                      </h3>
                      <div className="space-y-3">
                        {goal.nextMilestones.map((milestone, index) => (
                          <div key={index} className="p-4 rounded-xl bg-white/80 dark:bg-slate-700/80 border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 group">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                                {index + 1}
                              </div>
                              <span className="flex-1 text-slate-800 dark:text-slate-200">{milestone}</span>
                              <Button size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                <ArrowRight className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            ))}
          </div>
        )}

        {selectedTab === 'next-goals' && (
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Target className="w-6 h-6 text-brand" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Recommended Next Goals</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {mockRecommendedGoals.map((goal) => (
                  <div key={goal.id} className="group relative bg-white dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-brand transition-colors">
                            {goal.title}
                          </h3>
                          <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">{goal.reason}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-brand">{goal.matchScore}%</div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Match</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={getDifficultyColor(goal.difficulty)}>
                          {goal.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-700">
                          {goal.estimatedDuration}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-700">
                          {goal.popularity}% popular
                        </Badge>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Skills You&apos;ll Gain:</h4>
                        <div className="flex flex-wrap gap-1">
                          {goal.skillsGained.map((skill, index) => (
                            <span key={index} className="px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs">
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-slate-800 dark:text-slate-200 mb-2">Prerequisites:</h4>
                        <div className="space-y-1">
                          {goal.prerequisites.map((prereq, index) => (
                            <div key={index} className="flex items-center gap-2 text-sm">
                              <CheckCircle className="h-4 w-4 text-green-500" />
                              <span className="text-slate-600 dark:text-slate-400">{prereq}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button 
                        className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Start This Goal
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {selectedTab === 'insights' && (
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Brain className="w-6 h-6 text-brand" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Learning Insights & Tips</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {mockLearningInsights.map((insight, index) => (
                  <div key={index} className={`p-6 rounded-2xl border-2 transition-all duration-300 hover:scale-105 ${getInsightColors(insight.type)}`}>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                          insight.type === 'strength' ? 'bg-green-500' :
                          insight.type === 'improvement' ? 'bg-blue-500' :
                          insight.type === 'opportunity' ? 'bg-purple-500' :
                          'bg-orange-500'
                        } text-white shadow-lg`}>
                          {getInsightIcon(insight.icon)}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold mb-2">{insight.title}</h3>
                          <p className="mb-4 leading-relaxed">{insight.description}</p>
                          <div className="flex items-center gap-2 text-sm font-medium">
                            <ArrowRight className="h-4 w-4" />
                            <span>{insight.action}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {selectedTab === 'trending' && (
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-6">
                <Star className="w-6 h-6 text-brand" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Trending Skills & Technologies</h2>
              </div>
              
              <div className="space-y-4">
                {mockTrendingSkills.map((skill, index) => (
                  <div key={index} className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-brand to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-lg">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">{skill.skill}</h3>
                          <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                            <div className="flex items-center gap-1">
                              <TrendingUp className="h-4 w-4 text-green-500" />
                              <span className="text-green-600 dark:text-green-400 font-semibold">{skill.growth}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{skill.demand}% demand</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <div className="w-24 bg-slate-200 dark:bg-slate-700 rounded-full h-2 mb-1">
                            <div 
                              className="bg-gradient-to-r from-brand to-purple-600 h-2 rounded-full"
                              style={{ width: `${skill.demand}%` }}
                            />
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400">Market Demand</div>
                        </div>
                        <Button variant="outline" size="sm" className="flex items-center gap-2">
                          Explore
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 rounded-2xl bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 border border-blue-200 dark:border-blue-800">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Personalized Skill Recommendation
                </h3>
                <p className="text-slate-700 dark:text-slate-300 mb-4">
                  Based on your current goals and industry trends, we recommend focusing on <strong>TypeScript</strong> next. 
                  It complements your JavaScript and React skills perfectly and is in high demand.
                </p>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white">
                  <Target className="h-4 w-4 mr-2" />
                  Create TypeScript Goal
                </Button>
              </div>
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
}
