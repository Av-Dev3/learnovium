"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Bookmark
} from "lucide-react";
import Link from "next/link";

interface Flashcard {
  id: string;
  front: string;
  back: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  lastReviewed?: string;
  nextReview?: string;
  mastery: number; // 0-100
}

const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    front: 'What is the capital of France?',
    back: 'Paris',
    category: 'Geography',
    difficulty: 'easy',
    lastReviewed: '2024-01-15',
    nextReview: '2024-01-22',
    mastery: 85
  },
  {
    id: '2',
    front: 'What is the chemical symbol for gold?',
    back: 'Au',
    category: 'Chemistry',
    difficulty: 'medium',
    lastReviewed: '2024-01-14',
    nextReview: '2024-01-21',
    mastery: 65
  },
  {
    id: '3',
    front: 'What year did World War II end?',
    back: '1945',
    category: 'History',
    difficulty: 'easy',
    lastReviewed: '2024-01-13',
    nextReview: '2024-01-20',
    mastery: 90
  },
  {
    id: '4',
    front: 'What is the largest planet in our solar system?',
    back: 'Jupiter',
    category: 'Science',
    difficulty: 'easy',
    lastReviewed: '2024-01-12',
    nextReview: '2024-01-19',
    mastery: 75
  },
  {
    id: '5',
    front: 'What is the square root of 144?',
    back: '12',
    category: 'Mathematics',
    difficulty: 'medium',
    lastReviewed: '2024-01-11',
    nextReview: '2024-01-18',
    mastery: 80
  }
];

export default function FlashcardsPage() {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [studyMode, setStudyMode] = useState<'review' | 'practice'>('review');

  const currentCard = mockFlashcards[currentCardIndex];
  const totalCards = mockFlashcards.length;

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
              className="bg-gradient-to-r from-brand to-purple-600 hover:from-brand/90 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-2xl px-6 py-3"
            >
              <Plus className="h-5 w-5 mr-2" />
              Create Flashcard
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
                <p className="text-2xl font-bold text-[var(--fg)]">12</p>
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
                <p className="text-2xl font-bold text-[var(--fg)]">78%</p>
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
                <p className="text-2xl font-bold text-[var(--fg)]">5</p>
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

        {/* Main Flashcard */}
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
              className="w-full max-w-2xl h-80 cursor-pointer perspective-1000"
              onClick={handleFlip}
            >
              <div className={`relative w-full h-full transition-transform duration-700 transform-style-preserve-3d ${
                isFlipped ? 'rotate-y-180' : ''
              }`}>
                {/* Front of card */}
                <div className="absolute inset-0 backface-hidden">
                  <div className="w-full h-full p-8 rounded-3xl bg-[var(--bg)]/50 border-2 border-[var(--border)]/40 backdrop-blur-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-center items-center text-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className={getDifficultyColor(currentCard.difficulty)}>
                        {currentCard.difficulty}
                      </Badge>
                      <Badge variant="outline" className="bg-[var(--bg)]/30 border-[var(--border)]/40">
                        {currentCard.category}
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--fg)] mb-6 leading-relaxed">
                      {currentCard.front}
                    </h3>
                    
                    <div className="flex items-center gap-4 text-sm text-[var(--fg)]/60">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4" />
                        <span>Mastery: {currentCard.mastery}%</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        <span>Next: {currentCard.nextReview}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-[var(--fg)]/50 mt-4">
                      Click to flip
                    </p>
                  </div>
                </div>

                {/* Back of card */}
                <div className="absolute inset-0 backface-hidden rotate-y-180">
                  <div className="w-full h-full p-8 rounded-3xl bg-gradient-to-br from-brand/10 to-purple-600/10 border-2 border-brand/40 backdrop-blur-sm shadow-xl flex flex-col justify-center items-center text-center">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge className="bg-brand/20 text-brand border-brand/30">
                        Answer
                      </Badge>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-bold text-[var(--fg)] mb-6 leading-relaxed">
                      {currentCard.back}
                    </h3>
                    
                    {studyMode === 'practice' && (
                      <div className="flex gap-3 mt-6">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
                        >
                          <XCircle className="h-4 w-4 mr-2" />
                          Hard
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100"
                        >
                          <Clock className="h-4 w-4 mr-2" />
                          Medium
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Easy
                        </Button>
                      </div>
                    )}
                    
                    <p className="text-sm text-[var(--fg)]/50 mt-4">
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
              className="rounded-2xl px-6 py-3 hover:bg-[var(--bg)]/50"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Previous
            </Button>

            <Button
              onClick={handleShuffle}
              variant="outline"
              size="lg"
              className="rounded-2xl px-6 py-3 hover:bg-[var(--bg)]/50"
            >
              <Shuffle className="h-5 w-5 mr-2" />
              Shuffle
            </Button>

            <Button
              onClick={handleNext}
              disabled={currentCardIndex === totalCards - 1}
              variant="outline"
              size="lg"
              className="rounded-2xl px-6 py-3 hover:bg-[var(--bg)]/50"
            >
              Next
              <ArrowRight className="h-5 w-5 ml-2" />
            </Button>
          </div>
        </div>

        {/* Recent Cards */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <Bookmark className="w-6 h-6 text-brand" />
            <h2 className="text-2xl font-bold text-[var(--fg)]">Recent Cards</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockFlashcards.slice(0, 6).map((card) => (
              <div
                key={card.id}
                className="p-6 rounded-2xl bg-[var(--bg)]/50 border border-[var(--border)]/40 backdrop-blur-sm hover:shadow-lg transition-all duration-300 cursor-pointer group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(card.difficulty)}>
                      {card.difficulty}
                    </Badge>
                    <div className={`text-sm font-semibold ${getMasteryColor(card.mastery)}`}>
                      {card.mastery}%
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
                    <span>{card.category}</span>
                    <span>Next: {card.nextReview}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand via-purple-600 to-brand p-8 text-center text-white shadow-2xl">
          {/* Background effects */}
          <div className="absolute -top-10 -left-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" />
          <div className="absolute -bottom-10 -right-10 h-80 w-80 rounded-full bg-white/10 blur-3xl animate-pulse" style={{animationDelay: '1s'}} />
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-2xl md:text-3xl font-bold">
              Ready to boost your memory? 🚀
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto">
              Create custom flashcards and use spaced repetition to remember anything forever.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
              <Button 
                className="bg-white text-brand hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg rounded-2xl px-6 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Create New Cards
              </Button>
              <Button 
                variant="outline" 
                className="border-2 border-white text-white hover:bg-white/10 transition-all duration-300 rounded-2xl px-6 py-3"
              >
                <BookOpen className="w-5 h-5 mr-2" />
                Import Cards
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
