"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  X
} from "lucide-react";
import Link from "next/link";
import { 
  useFlashcards, 
  useFlashcardCategories, 
  useCreateFlashcard, 
  useCreateCategory, 
  useReviewFlashcard, 
  useGenerateFlashcards,
  useGoals
} from "@/app/lib/hooks";

export default function FlashcardsPage() {
  // State for flashcard study
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<'review' | 'practice'>('review');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showDueTodayOnly, setShowDueTodayOnly] = useState(false);

  // State for modals
  const [showCreateCard, setShowCreateCard] = useState(false);
  const [showCreateCategory, setShowCreateCategory] = useState(false);
  const [showGenerateCards, setShowGenerateCards] = useState(false);

  // Form state
  const [newCard, setNewCard] = useState({ front: '', back: '', difficulty: 'medium' as 'easy' | 'medium' | 'hard' });
  const [newCategory, setNewCategory] = useState({ name: '', description: '', color: '#6366f1' });
  const [generateForm, setGenerateForm] = useState({ goal_id: '', lesson_days: [] as number[] });

  // Hooks
  const { flashcards, loading: flashcardsLoading, mutate: mutateFlashcards } = useFlashcards({
    category_id: selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined,
    due_today: showDueTodayOnly
  });
  const { categories, loading: categoriesLoading, mutate: mutateCategories } = useFlashcardCategories();
  const { goals, isLoading: goalsLoading } = useGoals();
  const { createFlashcard, loading: createCardLoading } = useCreateFlashcard();
  const { createCategory, loading: createCategoryLoading } = useCreateCategory();
  const { reviewFlashcard, loading: reviewLoading } = useReviewFlashcard();
  const { generateFlashcards, loading: generateLoading } = useGenerateFlashcards();

  // Reset card index when flashcards change
  useEffect(() => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
  }, [flashcards]);

  const currentCard = flashcards[currentCardIndex];
  const totalCards = flashcards.length;

  // Debug logging
  useEffect(() => {
    console.log("🔍 Flashcard page debug:", {
      flashcardsCount: flashcards.length,
      categoriesCount: categories.length,
      selectedCategory,
      showDueTodayOnly,
      flashcardsLoading,
      categoriesLoading,
      flashcards: flashcards.slice(0, 3).map(c => ({ id: c.id, front: c.front?.substring(0, 50), category: c.category?.name }))
    });
  }, [flashcards, categories, selectedCategory, showDueTodayOnly, flashcardsLoading, categoriesLoading]);

  // Stats calculations
  const dueTodayCount = flashcards.filter(card => 
    new Date(card.next_review_at) <= new Date()
  ).length;
  const averageMastery = flashcards.length > 0 
    ? Math.round(flashcards.reduce((sum, card) => sum + card.mastery_score, 0) / flashcards.length)
    : 0;
  const reviewedTodayCount = flashcards.filter(card => 
    card.last_reviewed_at && 
    new Date(card.last_reviewed_at).toDateString() === new Date().toDateString()
  ).length;

  const handleNext = () => {
    if (currentCardIndex < totalCards - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    }
  };

  const handlePrevious = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleShuffle = () => {
    setCurrentCardIndex(Math.floor(Math.random() * totalCards));
    setIsFlipped(false);
  };

  const handleReview = async (difficulty: 'easy' | 'medium' | 'hard') => {
    if (!currentCard) return;

    try {
      await reviewFlashcard(currentCard.id, {
        difficulty_rating: difficulty,
        was_correct: true,
        response_time_ms: 5000 // Could track actual time
      });
      
      // Move to next card and refresh data
      if (currentCardIndex < totalCards - 1) {
        handleNext();
      }
      mutateFlashcards();
    } catch (error) {
      console.error('Failed to review flashcard:', error);
    }
  };

  const handleCreateCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCategory || selectedCategory === 'all') {
      alert('Please select a category first');
      return;
    }

    try {
      await createFlashcard({
        category_id: selectedCategory,
        front: newCard.front,
        back: newCard.back,
        difficulty: newCard.difficulty
      });
      
      setNewCard({ front: '', back: '', difficulty: 'medium' });
      setShowCreateCard(false);
      mutateFlashcards();
    } catch (error) {
      console.error('Failed to create flashcard:', error);
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await createCategory(newCategory);
      setNewCategory({ name: '', description: '', color: '#6366f1' });
      setShowCreateCategory(false);
      mutateCategories();
    } catch (error) {
      console.error('Failed to create category:', error);
    }
  };

  const handleGenerateCards = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await generateFlashcards({
        goal_id: generateForm.goal_id,
        lesson_day_indices: generateForm.lesson_days
      });
      
      setGenerateForm({ goal_id: '', lesson_days: [] });
      setShowGenerateCards(false);
      mutateFlashcards();
    } catch (error) {
      console.error('Failed to generate flashcards:', error);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getMasteryColor = (mastery: number) => {
    if (mastery >= 80) return 'text-green-600';
    if (mastery >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (flashcardsLoading || categoriesLoading || goalsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-[var(--fg)]/70">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-cyan-50 dark:from-slate-900 dark:via-purple-900/20 dark:to-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-6 sm:space-y-8 lg:space-y-12 pt-4 sm:pt-6 lg:pt-8">
        {/* Clean Header Design */}
        <section className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
          <header className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-fresh p-4 sm:p-6 lg:p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 sm:gap-6">
            <div className="space-y-3 sm:space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-400/20 to-orange-400/20 backdrop-blur-sm border border-yellow-300/30 hover:from-yellow-400/30 hover:to-orange-400/30 transition-all duration-300">
                <Brain className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-300 animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-yellow-100 drop-shadow-sm">Flashcards</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight tracking-tight">
                Flashcards 🧠
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-white/90 max-w-2xl leading-relaxed">
                Master concepts with spaced repetition learning
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                asChild 
                className="hover:bg-white/20 text-white border-white/30 text-sm sm:text-base"
              >
                <Link href="/app">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
              <Button 
                onClick={() => setShowCreateCard(true)}
                className="bg-gradient-to-r from-yellow-400 to-orange-400 hover:from-yellow-500 hover:to-orange-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-xl sm:rounded-2xl px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Create Flashcard
              </Button>
            </div>
          </div>
          </header>
        </section>

        {/* Controls */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-stretch sm:items-center">
              <div className="flex items-center gap-3">
                <Filter className="h-4 w-4 sm:h-5 sm:w-5 text-slate-600 dark:text-slate-400" />
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-10 sm:h-12 w-full sm:w-48 text-sm sm:text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl sm:rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-50">
                    <SelectItem value="all" className="text-sm sm:text-lg py-2 sm:py-3">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id} className="text-sm sm:text-lg py-2 sm:py-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2 h-2 sm:w-3 sm:h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant={showDueTodayOnly ? "default" : "outline"}
                size="sm"
                onClick={() => setShowDueTodayOnly(!showDueTodayOnly)}
                className={`h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-lg font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  showDueTodayOnly 
                    ? 'bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl hover:scale-105' 
                    : 'border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm'
                }`}
              >
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Due Today ({dueTodayCount})
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateCategory(true)}
                className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-lg font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105"
              >
                <Plus className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Category
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowGenerateCards(true)}
                className="h-10 sm:h-12 px-4 sm:px-6 text-sm sm:text-lg font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105"
              >
                <Sparkles className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Generate
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-brand to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200">{totalCards}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">Total Cards</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <CheckCircle className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200">{reviewedTodayCount}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">Reviewed Today</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200">{averageMastery}%</p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">Average Mastery</p>
              </div>
            </div>
          </div>

          <div className="p-4 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 hover:shadow-xl transition-all duration-300 hover:scale-105">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-14 lg:h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl sm:rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Clock className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-slate-800 dark:text-slate-200">{dueTodayCount}</p>
                <p className="text-xs sm:text-sm font-medium text-slate-600 dark:text-slate-400 truncate">Due Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Modes */}
        <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
          <div className="space-y-4 sm:space-y-6">
            <div className="flex items-center gap-3">
              <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">Study Modes</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <Button
                onClick={() => setStudyMode('review')}
                className={`h-16 sm:h-20 lg:h-24 text-sm sm:text-base lg:text-lg font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  studyMode === 'review'
                    ? 'bg-gradient-to-r from-brand to-purple-600 text-white shadow-xl scale-105'
                    : 'bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:shadow-lg hover:scale-105 hover:border-brand hover:ring-4 hover:ring-brand/20'
                }`}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                  <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                  <span>Review Mode</span>
                </div>
              </Button>

              <Button
                onClick={() => setStudyMode('practice')}
                className={`h-16 sm:h-20 lg:h-24 text-sm sm:text-base lg:text-lg font-semibold rounded-xl sm:rounded-2xl transition-all duration-300 ${
                  studyMode === 'practice'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl scale-105'
                    : 'bg-white/80 dark:bg-slate-700/80 border-2 border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:shadow-lg hover:scale-105 hover:border-brand hover:ring-4 hover:ring-brand/20'
                }`}
              >
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                  <Brain className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                  <span>Practice Mode</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Empty State */}
        {totalCards === 0 && (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20 dark:border-slate-700/50 text-center">
            <div className="space-y-6">
              <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center shadow-xl">
                <BookOpen className="h-12 w-12 text-white" />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200">No Flashcards Yet</h2>
                <p className="text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                  You don&apos;t have any flashcards yet. Create some manually or generate them from your lessons.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  onClick={() => setShowCreateCard(true)}
                  className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create First Card
                </Button>
                <Button
                  onClick={() => setShowGenerateCards(true)}
                  className="h-12 px-8 text-lg font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105"
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  Generate from Lessons
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Main Flashcard */}
        {totalCards > 0 && currentCard ? (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">
                  {studyMode === 'review' ? 'Review Cards' : 'Practice Session'}
                </h2>
                <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400">
                  <span>{currentCardIndex + 1} of {totalCards}</span>
                </div>
              </div>

            {/* Flashcard */}
            <div className="flex justify-center">
              <div 
                className="w-full max-w-2xl h-64 sm:h-72 lg:h-80 cursor-pointer"
                onClick={handleFlip}
                style={{ perspective: '1000px' }}
              >
                <div 
                  className={`relative w-full h-full transition-transform duration-700`}
                  style={{ 
                    transformStyle: 'preserve-3d',
                    transform: isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Front of card */}
                  <div 
                    className="absolute inset-0"
                    style={{ backfaceVisibility: 'hidden' }}
                  >
                    <div className="w-full h-full p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-center items-center text-center">
                      <div className="flex flex-wrap items-center justify-center gap-2 mb-3 sm:mb-4">
                        <Badge className={`${getDifficultyColor(currentCard.difficulty)} text-xs sm:text-sm`}>
                          {currentCard.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-xs sm:text-sm">
                          {currentCard.category.name}
                        </Badge>
                        {currentCard.source === 'lesson' && (
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300 text-xs sm:text-sm">
                            Day {(currentCard.lesson_day_index || 0) + 1}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-relaxed px-2">
                        {currentCard.front}
                      </h3>
                      
                      <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Mastery: {currentCard.mastery_score}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <RotateCcw className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Reviews: {currentCard.review_count}</span>
                        </div>
                      </div>
                      
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-3 sm:mt-4">
                        Click to flip
                      </p>
                    </div>
                  </div>

                  {/* Back of card */}
                  <div 
                    className="absolute inset-0"
                    style={{ 
                      backfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div className="w-full h-full p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-2 border-blue-200 dark:border-blue-700 shadow-lg flex flex-col justify-center items-center text-center">
                      <div className="flex items-center gap-2 mb-3 sm:mb-4">
                        <Badge className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600 text-xs sm:text-sm">
                          Answer
                        </Badge>
                      </div>
                      
                      <h3 className="text-lg sm:text-xl lg:text-2xl xl:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4 sm:mb-6 leading-relaxed px-2">
                        {currentCard.back}
                      </h3>
                      
                      {studyMode === 'practice' && (
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-4 sm:mt-6">
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleReview('hard'); }}
                            disabled={reviewLoading}
                            variant="outline" 
                            size="sm" 
                            className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:border-red-700 dark:text-red-300 text-xs sm:text-sm px-3 sm:px-4 py-2"
                          >
                            <XCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Hard
                          </Button>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleReview('medium'); }}
                            disabled={reviewLoading}
                            variant="outline" 
                            size="sm" 
                            className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100 text-xs sm:text-sm px-3 sm:px-4 py-2"
                          >
                            <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Medium
                          </Button>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleReview('easy'); }}
                            disabled={reviewLoading}
                            variant="outline" 
                            size="sm" 
                            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100 text-xs sm:text-sm px-3 sm:px-4 py-2"
                          >
                            <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                            Easy
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-500 mt-3 sm:mt-4">
                        Click to flip back
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

              {/* Navigation Controls */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    onClick={handlePrevious}
                    disabled={currentCardIndex === 0}
                    className="h-10 sm:h-12 px-3 sm:px-6 text-sm sm:text-lg font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>

                  <Button
                    onClick={handleFlip}
                    className="h-10 sm:h-12 px-3 sm:px-6 text-sm sm:text-lg font-semibold border-2 border-blue-200 dark:border-blue-700 hover:border-blue-400 hover:ring-4 hover:ring-blue-400/20 rounded-xl sm:rounded-2xl transition-all duration-300 bg-blue-50/80 dark:bg-blue-900/80 backdrop-blur-sm hover:scale-105"
                  >
                    <RotateCcw className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">{isFlipped ? 'Show Question' : 'Show Answer'}</span>
                    <span className="sm:hidden">{isFlipped ? 'Question' : 'Answer'}</span>
                  </Button>
                </div>

                <div className="flex items-center gap-2 sm:gap-3">
                  <Button
                    onClick={handleShuffle}
                    className="h-10 sm:h-12 px-3 sm:px-6 text-sm sm:text-lg font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105"
                  >
                    <Shuffle className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2" />
                    Shuffle
                  </Button>

                  <Button
                    onClick={handleNext}
                    disabled={currentCardIndex === totalCards - 1}
                    className="h-10 sm:h-12 px-3 sm:px-6 text-sm sm:text-lg font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-xl sm:rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                    <ArrowRight className="h-4 w-4 sm:h-5 sm:w-5 ml-1 sm:ml-2" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-3xl p-12 border border-white/20 dark:border-slate-700/50 text-center">
            <BookOpen className="h-16 w-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2">No flashcards found</h3>
            <p className="text-slate-500 dark:text-slate-500 mb-6">
              {selectedCategory !== 'all' || showDueTodayOnly 
                ? "Try adjusting your filters or create new flashcards"
                : categories.length === 0
                ? "Create your first category and flashcard to get started"
                : "Create your first flashcard or generate them from your lessons"
              }
            </p>
            <div className="flex justify-center gap-4">
              {categories.length === 0 ? (
                <Button 
                  onClick={() => setShowCreateCategory(true)}
                  className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl"
                >
                  <Plus className="h-5 w-5 mr-2" />
                  Create Category
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={() => setShowCreateCard(true)}
                    className="h-12 px-8 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    Create Flashcard
                  </Button>
                  <Button 
                    onClick={() => setShowGenerateCards(true)}
                    className="h-12 px-8 text-lg font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105"
                  >
                    <Sparkles className="h-5 w-5 mr-2" />
                    Generate from Lessons
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Recent Cards */}
        {totalCards > 0 && (
          <div className="bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-white/20 dark:border-slate-700/50">
            <div className="space-y-4 sm:space-y-6">
              <div className="flex items-center gap-3">
                <Bookmark className="w-5 h-5 sm:w-6 sm:h-6 text-brand" />
                <h2 className="text-xl sm:text-2xl font-bold text-slate-800 dark:text-slate-200">Recent Cards</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {flashcards.slice(0, 6).map((card) => (
                  <div
                    key={card.id}
                    className="p-4 sm:p-6 rounded-xl sm:rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm border border-slate-200 dark:border-slate-600 hover:shadow-xl transition-all duration-300 cursor-pointer group hover:scale-105"
                    onClick={() => {
                      const index = flashcards.findIndex(c => c.id === card.id);
                      if (index !== -1) {
                        setCurrentCardIndex(index);
                        setIsFlipped(false);
                      }
                    }}
                  >
                    <div className="space-y-3 sm:space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge className={`${getDifficultyColor(card.difficulty)} text-xs sm:text-sm`}>
                          {card.difficulty}
                        </Badge>
                        <div className={`text-xs sm:text-sm font-semibold ${getMasteryColor(card.mastery_score)}`}>
                          {card.mastery_score}%
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-semibold text-slate-800 dark:text-slate-200 mb-2 line-clamp-2 text-sm sm:text-base">
                          {card.front}
                        </h3>
                        <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                          {card.back}
                        </p>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-500">
                        <span className="truncate">{card.category.name}</span>
                        <span className="truncate ml-2">
                          {card.source === 'lesson' && card.lesson_day_index !== undefined
                            ? `Day ${card.lesson_day_index + 1}`
                            : card.source
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      {/* Create Card Modal */}
      {showCreateCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Create Flashcard</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateCard(false)}
                className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                  <SelectTrigger className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-50">
                    <SelectItem value="all" className="text-lg py-3">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id} className="text-lg py-3">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          {category.name}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Front (Question)
                </label>
                <Textarea
                  value={newCard.front}
                  onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  placeholder="Enter the question or prompt..."
                  required
                  className="h-24 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Back (Answer)
                </label>
                <Textarea
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  placeholder="Enter the answer or explanation..."
                  required
                  className="h-24 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Difficulty
                </label>
                <Select 
                  value={newCard.difficulty} 
                  onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                    setNewCard({ ...newCard, difficulty: value })
                  }
                >
                  <SelectTrigger className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-50">
                    <SelectItem value="easy" className="text-lg py-3">Easy</SelectItem>
                    <SelectItem value="medium" className="text-lg py-3">Medium</SelectItem>
                    <SelectItem value="hard" className="text-lg py-3">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={createCardLoading} 
                  className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl"
                >
                  {createCardLoading ? "Creating..." : "Create Flashcard"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowCreateCard(false)}
                  className="h-12 px-6 text-lg font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Category Modal */}
      {showCreateCategory && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Create Category</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateCategory(false)}
                className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Name
                </label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Category name..."
                  required
                  className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Description
                </label>
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Optional description..."
                  className="h-20 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Color
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-16 h-12 rounded-2xl border-2 border-slate-200 dark:border-slate-600 cursor-pointer"
                  />
                  <Input
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    placeholder="#6366f1"
                    className="flex-1 h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={createCategoryLoading} 
                  className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl"
                >
                  {createCategoryLoading ? "Creating..." : "Create Category"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowCreateCategory(false)}
                  className="h-12 px-6 text-lg font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Generate Cards Modal */}
      {showGenerateCards && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm border border-white/20 dark:border-slate-700/50 rounded-3xl p-8 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-200">Generate Flashcards</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGenerateCards(false)}
                className="h-10 w-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={handleGenerateCards} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Learning Goal
                </label>
                <Select 
                  value={generateForm.goal_id} 
                  onValueChange={(value) => setGenerateForm({ ...generateForm, goal_id: value })}
                  required
                >
                  <SelectTrigger className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm">
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-white/95 dark:bg-slate-800/95 backdrop-blur-sm z-50">
                    {goals.map(goal => (
                      <SelectItem key={goal.id} value={goal.id} className="text-lg py-3">
                        {goal.topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Lesson Days (1-based)
                </label>
                <Input
                  placeholder="e.g. 1,2,3,4,5,6,7"
                  onChange={(e) => {
                    const days = e.target.value
                      .split(',')
                      .map(d => parseInt(d.trim()) - 1) // Convert to 0-based
                      .filter(d => !isNaN(d) && d >= 0);
                    setGenerateForm({ ...generateForm, lesson_days: days });
                  }}
                  required
                  className="h-12 text-lg border-2 border-slate-200 dark:border-slate-600 focus:border-brand focus:ring-4 focus:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm"
                />
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                  Enter comma-separated day numbers (e.g., 1,2,3 for first 3 days)
                </p>
                <div className="mt-3 p-4 bg-blue-50/80 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl backdrop-blur-sm">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Tip:</strong> Flashcards are automatically generated when you visit lesson pages. 
                    If you don&apos;t see flashcards for certain days, try visiting those lesson pages first.
                  </p>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <Button 
                  type="submit" 
                  disabled={generateLoading} 
                  className="flex-1 h-12 text-lg font-semibold bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 rounded-2xl"
                >
                  {generateLoading ? "Generating..." : "Generate Flashcards"}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowGenerateCards(false)}
                  className="h-12 px-6 text-lg font-semibold border-2 border-slate-200 dark:border-slate-600 hover:border-brand hover:ring-4 hover:ring-brand/20 rounded-2xl transition-all duration-300 bg-white/80 dark:bg-slate-700/80 backdrop-blur-sm hover:scale-105"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}