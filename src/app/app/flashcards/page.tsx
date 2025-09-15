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
      <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand mx-auto mb-4"></div>
          <p className="text-[var(--fg)]/70">Loading flashcards...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--bg)] via-[color-mix(in_oklab,var(--bg)_95%,black_2%)] to-[color-mix(in_oklab,var(--bg)_90%,black_4%)]">
      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[var(--fg)]">
              Flashcards 🧠
            </h1>
            <p className="text-xl text-[var(--fg)]/70">
              Master concepts with spaced repetition learning
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              size="sm" 
              asChild 
              className="hover:bg-[var(--bg)]/50"
            >
              <Link href="/app">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <Button 
              onClick={() => setShowCreateCard(true)}
              className="bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl px-6 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Flashcard
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          <div className="flex items-center gap-3">
            <Filter className="h-5 w-5 text-[var(--fg)]/70" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
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

          <Button
            variant={showDueTodayOnly ? "default" : "outline"}
            size="sm"
            onClick={() => setShowDueTodayOnly(!showDueTodayOnly)}
            className="rounded-xl"
          >
            <Clock className="h-4 w-4 mr-2" />
            Due Today ({dueTodayCount})
          </Button>

          <div className="flex items-center gap-2 ml-auto">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCreateCategory(true)}
              className="rounded-xl"
            >
              <Plus className="h-4 w-4 mr-2" />
              Category
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGenerateCards(true)}
              className="rounded-xl"
            >
              <Sparkles className="h-4 w-4 mr-2" />
              Generate
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-brand to-purple-600 rounded-2xl flex items-center justify-center">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--fg)]">{totalCards}</p>
                <p className="text-sm text-[var(--fg)]/70">Total Cards</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--fg)]">{reviewedTodayCount}</p>
                <p className="text-sm text-[var(--fg)]/70">Reviewed Today</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--fg)]">{averageMastery}%</p>
                <p className="text-sm text-[var(--fg)]/70">Average Mastery</p>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-[var(--fg)]">{dueTodayCount}</p>
                <p className="text-sm text-[var(--fg)]/70">Due Today</p>
              </div>
            </div>
          </div>
        </div>

        {/* Study Modes */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Zap className="w-6 h-6 text-brand" />
            <h2 className="text-2xl font-bold text-[var(--fg)]">Study Modes</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Button
              onClick={() => setStudyMode('review')}
              className={`h-20 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                studyMode === 'review'
                  ? 'bg-gradient-to-r from-brand to-purple-600 text-white shadow-xl scale-105'
                  : 'bg-[var(--bg)]/50 border border-[var(--border)]/40 text-[var(--fg)] hover:shadow-lg hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <BookOpen className="h-6 w-6" />
                <span>Review Mode</span>
              </div>
            </Button>

            <Button
              onClick={() => setStudyMode('practice')}
              className={`h-20 text-lg font-semibold rounded-2xl transition-all duration-300 ${
                studyMode === 'practice'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-xl scale-105'
                  : 'bg-[var(--bg)]/50 border border-[var(--border)]/40 text-[var(--fg)] hover:shadow-lg hover:scale-105'
              }`}
            >
              <div className="flex flex-col items-center gap-2">
                <Brain className="h-6 w-6" />
                <span>Practice Mode</span>
              </div>
            </Button>
          </div>
        </div>

        {/* Empty State */}
        {totalCards === 0 && (
          <div className="text-center py-16 space-y-6">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-brand to-purple-600 rounded-full flex items-center justify-center">
              <BookOpen className="h-12 w-12 text-white" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-[var(--fg)]">No Flashcards Yet</h2>
              <p className="text-[var(--fg)]/70 max-w-md mx-auto">
                You don&apos;t have any flashcards yet. Create some manually or generate them from your lessons.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                onClick={() => setShowCreateCard(true)}
                className="bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Card
              </Button>
              <Button
                onClick={() => setShowGenerateCards(true)}
                variant="outline"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Generate from Lessons
              </Button>
            </div>
          </div>
        )}

        {/* Main Flashcard */}
        {totalCards > 0 && currentCard ? (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[var(--fg)]">
                {studyMode === 'review' ? 'Review Cards' : 'Practice Session'}
              </h2>
              <div className="flex items-center gap-2 text-sm text-[var(--fg)]/70">
                <span>{currentCardIndex + 1} of {totalCards}</span>
              </div>
            </div>

            {/* Flashcard */}
            <div className="flex justify-center">
              <div 
                className="w-full max-w-2xl h-80 cursor-pointer"
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
                    <div className="w-full h-full p-8 rounded-3xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col justify-center items-center text-center">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className={getDifficultyColor(currentCard.difficulty)}>
                          {currentCard.difficulty}
                        </Badge>
                        <Badge variant="outline" className="bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600">
                          {currentCard.category.name}
                        </Badge>
                        {currentCard.source === 'lesson' && (
                          <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-900 dark:border-blue-700 dark:text-blue-300">
                            Day {(currentCard.lesson_day_index || 0) + 1}
                          </Badge>
                        )}
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
                        {currentCard.front}
                      </h3>
                      
                      <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4" />
                          <span>Mastery: {currentCard.mastery_score}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <RotateCcw className="h-4 w-4" />
                          <span>Reviews: {currentCard.review_count}</span>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
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
                    <div className="w-full h-full p-8 rounded-3xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 border-2 border-blue-200 dark:border-blue-700 shadow-lg flex flex-col justify-center items-center text-center">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge className="bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-600">
                          Answer
                        </Badge>
                      </div>
                      
                      <h3 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6 leading-relaxed">
                        {currentCard.back}
                      </h3>
                      
                      {studyMode === 'practice' && (
                        <div className="flex gap-3 mt-6">
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleReview('hard'); }}
                            disabled={reviewLoading}
                            variant="outline" 
                            size="sm" 
                            className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-900 dark:border-red-700 dark:text-red-300"
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Hard
                          </Button>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleReview('medium'); }}
                            disabled={reviewLoading}
                            variant="outline" 
                            size="sm" 
                            className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                          >
                            <Clock className="h-4 w-4 mr-2" />
                            Medium
                          </Button>
                          <Button 
                            onClick={(e) => { e.stopPropagation(); handleReview('easy'); }}
                            disabled={reviewLoading}
                            variant="outline" 
                            size="sm" 
                            className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                          >
                            <CheckCircle className="h-4 w-4 mr-2" />
                            Easy
                          </Button>
                        </div>
                      )}
                      
                      <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
                        Click to flip back
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="flex items-center justify-center gap-4">
              <Button
                onClick={handlePrevious}
                disabled={currentCardIndex === 0}
                variant="outline"
                size="lg"
                className="rounded-2xl px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Previous
              </Button>

              <Button
                onClick={handleFlip}
                variant="outline"
                size="lg"
                className="rounded-2xl px-6 py-3 hover:bg-blue-50 dark:hover:bg-blue-900 border-blue-200 dark:border-blue-700"
              >
                <RotateCcw className="h-5 w-5 mr-2" />
                {isFlipped ? 'Show Question' : 'Show Answer'}
              </Button>

              <Button
                onClick={handleShuffle}
                variant="outline"
                size="lg"
                className="rounded-2xl px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <Shuffle className="h-5 w-5 mr-2" />
                Shuffle
              </Button>

              <Button
                onClick={handleNext}
                disabled={currentCardIndex === totalCards - 1}
                variant="outline"
                size="lg"
                className="rounded-2xl px-6 py-3 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Next
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 dark:text-gray-400 mb-2">No flashcards found</h3>
            <p className="text-gray-500 dark:text-gray-500 mb-4">
              {selectedCategory !== 'all' || showDueTodayOnly 
                ? "Try adjusting your filters or create new flashcards"
                : categories.length === 0
                ? "Create your first category and flashcard to get started"
                : "Create your first flashcard or generate them from your lessons"
              }
            </p>
            <div className="flex justify-center gap-3">
              {categories.length === 0 ? (
                <Button onClick={() => setShowCreateCategory(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Category
                </Button>
              ) : (
                <>
                  <Button onClick={() => setShowCreateCard(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Create Flashcard
                  </Button>
                  <Button variant="outline" onClick={() => setShowGenerateCards(true)}>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate from Lessons
                  </Button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Recent Cards */}
        {totalCards > 0 && (
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <Bookmark className="w-6 h-6 text-brand" />
              <h2 className="text-2xl font-bold text-[var(--fg)]">Recent Cards</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {flashcards.slice(0, 6).map((card) => (
                <div
                  key={card.id}
                  className="p-6 rounded-2xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
                  onClick={() => {
                    const index = flashcards.findIndex(c => c.id === card.id);
                    if (index !== -1) {
                      setCurrentCardIndex(index);
                      setIsFlipped(false);
                    }
                  }}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <Badge className={getDifficultyColor(card.difficulty)}>
                        {card.difficulty}
                      </Badge>
                      <div className={`text-sm font-semibold ${getMasteryColor(card.mastery_score)}`}>
                        {card.mastery_score}%
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="font-semibold text-[var(--fg)] mb-2 line-clamp-2">
                        {card.front}
                      </h3>
                      <p className="text-sm text-[var(--fg)]/70 line-clamp-2">
                        {card.back}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-[var(--fg)]/50">
                      <span>{card.category.name}</span>
                      <span>
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
        )}
      </div>

      {/* Create Card Modal */}
      {showCreateCard && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create Flashcard</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateCard(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateCard} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category.id} value={category.id}>
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
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Front (Question)
                </label>
                <Textarea
                  value={newCard.front}
                  onChange={(e) => setNewCard({ ...newCard, front: e.target.value })}
                  placeholder="Enter the question or prompt..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Back (Answer)
                </label>
                <Textarea
                  value={newCard.back}
                  onChange={(e) => setNewCard({ ...newCard, back: e.target.value })}
                  placeholder="Enter the answer or explanation..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Difficulty
                </label>
                <Select 
                  value={newCard.difficulty} 
                  onValueChange={(value: 'easy' | 'medium' | 'hard') => 
                    setNewCard({ ...newCard, difficulty: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="easy">Easy</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="hard">Hard</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={createCardLoading} className="flex-1">
                  {createCardLoading ? "Creating..." : "Create Flashcard"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateCard(false)}
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
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Create Category</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCreateCategory(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Name
                </label>
                <Input
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                  placeholder="Category name..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <Textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                  placeholder="Optional description..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Color
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    className="w-12 h-10 rounded border border-[var(--border)]"
                  />
                  <Input
                    value={newCategory.color}
                    onChange={(e) => setNewCategory({ ...newCategory, color: e.target.value })}
                    placeholder="#6366f1"
                    className="flex-1"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={createCategoryLoading} className="flex-1">
                  {createCategoryLoading ? "Creating..." : "Create Category"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateCategory(false)}
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
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Generate Flashcards</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowGenerateCards(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <form onSubmit={handleGenerateCards} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Learning Goal
                </label>
                <Select 
                  value={generateForm.goal_id} 
                  onValueChange={(value) => setGenerateForm({ ...generateForm, goal_id: value })}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a goal" />
                  </SelectTrigger>
                  <SelectContent>
                    {goals.map(goal => (
                      <SelectItem key={goal.id} value={goal.id}>
                        {goal.topic}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
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
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Enter comma-separated day numbers (e.g., 1,2,3 for first 3 days)
                </p>
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    💡 <strong>Tip:</strong> Flashcards are automatically generated when you visit lesson pages. 
                    If you don&apos;t see flashcards for certain days, try visiting those lesson pages first.
                  </p>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={generateLoading} className="flex-1">
                  {generateLoading ? "Generating..." : "Generate Flashcards"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowGenerateCards(false)}
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