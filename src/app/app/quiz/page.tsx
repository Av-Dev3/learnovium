"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  BookOpen, 
  Clock, 
  Zap, 
  Plus, 
  CheckCircle, 
  XCircle, 
  ArrowLeft, 
  ArrowRight,
  Brain,
  TrendingUp,
  Shuffle,
  Star,
  Bookmark,
  Sparkles,
  Filter,
  RotateCcw,
  X,
  Play,
  Pause,
  Trophy,
  Target,
  Search,
  ChevronDown
} from "lucide-react";
import Link from "next/link";

// Mock data for the quiz page
const mockQuizzes = [
  {
    id: "1",
    title: "JavaScript Fundamentals",
    description: "Test your knowledge of JavaScript basics",
    category: "Programming",
    difficulty: "easy",
    questions: 15,
    timeLimit: 20,
    completedAt: null,
    score: null,
    color: "#3b82f6"
  },
  {
    id: "2", 
    title: "React Hooks Deep Dive",
    description: "Advanced concepts in React Hooks",
    category: "Frontend",
    difficulty: "hard",
    questions: 25,
    timeLimit: 35,
    completedAt: "2024-01-15",
    score: 85,
    color: "#8b5cf6"
  },
  {
    id: "3",
    title: "CSS Grid & Flexbox",
    description: "Modern CSS layout techniques",
    category: "CSS",
    difficulty: "medium",
    questions: 20,
    timeLimit: 25,
    completedAt: null,
    score: null,
    color: "#10b981"
  },
  {
    id: "4",
    title: "Node.js Basics",
    description: "Server-side JavaScript fundamentals",
    category: "Backend",
    difficulty: "medium",
    questions: 18,
    timeLimit: 30,
    completedAt: "2024-01-10",
    score: 92,
    color: "#f59e0b"
  },
  {
    id: "5",
    title: "Database Design Principles",
    description: "Relational database concepts and design",
    category: "Database",
    difficulty: "hard",
    questions: 22,
    timeLimit: 40,
    completedAt: null,
    score: null,
    color: "#ef4444"
  },
  {
    id: "6",
    title: "Python Data Structures",
    description: "Lists, dictionaries, sets and more",
    category: "Python",
    difficulty: "easy",
    questions: 12,
    timeLimit: 15,
    completedAt: "2024-01-12",
    score: 78,
    color: "#06b6d4"
  }
];

const mockCategories = [
  { id: "all", name: "All Categories", count: 6 },
  { id: "programming", name: "Programming", count: 2 },
  { id: "frontend", name: "Frontend", count: 1 },
  { id: "css", name: "CSS", count: 1 },
  { id: "backend", name: "Backend", count: 1 },
  { id: "database", name: "Database", count: 1 }
];

export default function QuizPage() {
  // State for quiz management
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"recent" | "difficulty" | "score">("recent");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showCompletedOnly, setShowCompletedOnly] = useState(false);

  // Mock loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort quizzes
  const filteredQuizzes = mockQuizzes.filter(quiz => {
    const categoryMatch = selectedCategory === 'all' || quiz.category.toLowerCase() === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || quiz.difficulty === selectedDifficulty;
    const searchMatch = quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                       quiz.description.toLowerCase().includes(searchTerm.toLowerCase());
    const completedMatch = !showCompletedOnly || quiz.completedAt !== null;
    
    return categoryMatch && difficultyMatch && searchMatch && completedMatch;
  }).sort((a, b) => {
    switch (sortBy) {
      case "difficulty":
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      case "score":
        return (b.score || 0) - (a.score || 0);
      default:
        return new Date(b.completedAt || '1970-01-01').getTime() - new Date(a.completedAt || '1970-01-01').getTime();
    }
  });

  // Stats calculations
  const totalQuizzes = mockQuizzes.length;
  const completedQuizzes = mockQuizzes.filter(q => q.completedAt).length;
  const averageScore = completedQuizzes > 0 
    ? Math.round(mockQuizzes.filter(q => q.score).reduce((sum, q) => sum + (q.score || 0), 0) / completedQuizzes)
    : 0;
  const todayCompleted = mockQuizzes.filter(q => 
    q.completedAt && new Date(q.completedAt).toDateString() === new Date().toDateString()
  ).length;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-300 dark:border-yellow-700';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 dark:text-green-400';
    if (score >= 70) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-[var(--fg)]/70">Loading quizzes...</p>
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
                <Brain className="w-5 h-5 text-yellow-300 animate-pulse" />
                <span className="text-sm font-bold text-yellow-100 drop-shadow-sm">Knowledge Quiz</span>
              </div>
              
              <h1 className="text-4xl md:text-5xl font-bold leading-tight tracking-tight">
                Quiz Center 🧠
              </h1>
              <p className="text-xl text-white/90 max-w-2xl leading-relaxed">
                Test your knowledge and track your learning progress
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
              <Button 
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl px-6 py-3"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Quiz
              </Button>
            </div>
          </div>
          </header>
        </section>

        {/* Controls */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          <div className="flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-slate-400" />
                <Input
                  placeholder="Search quizzes..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-12 h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                />
              </div>
              
              <div className="flex gap-3">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12 w-48 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                    {mockCategories.map(category => (
                      <SelectItem key={category.id} value={category.id} className="text-lg py-3">
                        {category.name} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger className="h-12 w-40 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm">
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm">
                    <SelectItem value="all" className="text-lg py-3">All Levels</SelectItem>
                    <SelectItem value="easy" className="text-lg py-3">Easy</SelectItem>
                    <SelectItem value="medium" className="text-lg py-3">Medium</SelectItem>
                    <SelectItem value="hard" className="text-lg py-3">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex gap-3">
              <Button
                variant={showCompletedOnly ? "default" : "outline"}
                onClick={() => setShowCompletedOnly(!showCompletedOnly)}
                className={`h-12 px-6 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                  showCompletedOnly 
                    ? 'bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105' 
                    : 'border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm'
                }`}
              >
                <Trophy className="h-5 w-5 mr-2" />
                Completed Only
              </Button>
            </div>
          </div>
        </section>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <BookOpen className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{totalQuizzes}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Total Quizzes</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg">
                <CheckCircle className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{completedQuizzes}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Completed</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <TrendingUp className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{averageScore}%</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Average Score</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                <Clock className="h-7 w-7 text-white" />
              </div>
              <div>
                <p className="text-3xl font-bold text-slate-800 dark:text-slate-200">{todayCompleted}</p>
                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quizzes Grid */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
          {filteredQuizzes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredQuizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                >
                  {/* Color accent bar */}
                  <div 
                    className="absolute top-0 left-0 right-0 h-1"
                    style={{ backgroundColor: quiz.color }}
                  />
                  
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 group-hover:text-brand transition-colors">
                          {quiz.title}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2">
                          {quiz.description}
                        </p>
                      </div>
                      {quiz.completedAt && quiz.score && (
                        <div className="ml-4">
                          <div className={`text-2xl font-bold ${getScoreColor(quiz.score)}`}>
                            {quiz.score}%
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge className={getDifficultyColor(quiz.difficulty)}>
                        {quiz.difficulty}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-50 dark:bg-slate-700">
                        {quiz.category}
                      </Badge>
                      <Badge variant="outline" className="bg-slate-50 dark:bg-slate-700">
                        {quiz.questions} questions
                      </Badge>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>{quiz.timeLimit} min</span>
                      </div>
                      {quiz.completedAt && (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          <span>Completed</span>
                        </div>
                      )}
                    </div>

                    <div className="pt-2">
                      <Button 
                        className={`w-full h-12 text-lg font-semibold rounded-xl transition-all duration-300 ${
                          quiz.completedAt 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                            : 'bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl hover:scale-105'
                        }`}
                      >
                        {quiz.completedAt ? (
                          <>
                            <RotateCcw className="h-5 w-5 mr-2" />
                            Retake Quiz
                          </>
                        ) : (
                          <>
                            <Play className="h-5 w-5 mr-2" />
                            Start Quiz
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand/20 to-purple-600/20 rounded-full flex items-center justify-center mb-6">
                <Brain className="h-12 w-12 text-brand" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-3">No quizzes found</h3>
              <p className="text-slate-600 dark:text-slate-400 mb-6 text-lg">
                {searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' || showCompletedOnly
                  ? "Try adjusting your search or filters"
                  : "Create your first quiz to get started"
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {(searchTerm || selectedCategory !== 'all' || selectedDifficulty !== 'all' || showCompletedOnly) && (
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedCategory("all");
                      setSelectedDifficulty("all");
                      setShowCompletedOnly(false);
                    }}
                    className="h-12 px-6 text-lg border-2 border-slate-300 dark:border-slate-600 hover:border-brand hover:bg-brand/5 rounded-2xl transition-all duration-300"
                  >
                    Clear Filters
                  </Button>
                )}
                <Button 
                  className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl border-2 border-emerald-500/20"
                >
                  <Plus className="h-5 w-5 mr-3" />
                  Create Your First Quiz
                </Button>
              </div>
            </div>
          )}
        </section>

        {/* Recent Activity */}
        {completedQuizzes > 0 && (
          <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-6 border border-white/20 dark:border-slate-700/50">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <Bookmark className="w-6 h-6 text-brand" />
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Recent Activity</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {mockQuizzes.filter(q => q.completedAt).slice(0, 3).map((quiz) => (
                  <div
                    key={quiz.id}
                    className="p-4 rounded-xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-lg transition-all duration-300 cursor-pointer group hover:scale-105"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getDifficultyColor(quiz.difficulty)}>
                          {quiz.difficulty}
                        </Badge>
                        <div className={`text-lg font-bold ${getScoreColor(quiz.score!)}`}>
                          {quiz.score}%
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-1 line-clamp-1">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {quiz.description}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                        <span>{quiz.category}</span>
                        <span>{quiz.questions} questions</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
        </div>
      </div>
    </div>
  );
}
