import { useState, useEffect } from "react";
import useSWR from "swr";

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  difficulty: "easy" | "medium" | "hard";
  mastery_score: number;
  review_count: number;
  last_reviewed_at?: string;
  next_review_at: string;
  source: "manual" | "lesson" | "generated";
  lesson_day_index?: number;
  created_at: string;
  category: {
    id: string;
    name: string;
    color: string;
  };
}

export interface FlashcardCategory {
  id: string;
  name: string;
  description?: string;
  color: string;
  created_at: string;
  goal?: {
    id: string;
    topic: string;
  };
  _count?: { count: number }[];
}

interface UseFlashcardsOptions {
  category_id?: string;
  goal_id?: string;
  due_today?: boolean;
  limit?: number;
}

export function useFlashcards(options: UseFlashcardsOptions = {}) {
  const params = new URLSearchParams();
  if (options.category_id) params.set("category_id", options.category_id);
  if (options.goal_id) params.set("goal_id", options.goal_id);
  if (options.due_today) params.set("due_today", "true");
  if (options.limit) params.set("limit", options.limit.toString());

  const { data, error, mutate } = useSWR<{ flashcards: Flashcard[] }>(
    `/api/flashcards?${params.toString()}`,
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch flashcards");
      return response.json();
    }
  );

  return {
    flashcards: data?.flashcards || [],
    loading: !error && !data,
    error,
    mutate,
  };
}

export function useFlashcardCategories() {
  const { data, error, mutate } = useSWR<{ categories: FlashcardCategory[] }>(
    "/api/flashcards/categories",
    async (url) => {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch categories");
      return response.json();
    }
  );

  return {
    categories: data?.categories || [],
    loading: !error && !data,
    error,
    mutate,
  };
}

export function useCreateFlashcard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createFlashcard = async (data: {
    category_id: string;
    goal_id?: string;
    front: string;
    back: string;
    difficulty?: "easy" | "medium" | "hard";
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/flashcards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create flashcard");
      }

      const result = await response.json();
      return result.flashcard;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createFlashcard, loading, error };
}

export function useCreateCategory() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCategory = async (data: {
    name: string;
    description?: string;
    color?: string;
    goal_id?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/flashcards/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create category");
      }

      const result = await response.json();
      return result.category;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createCategory, loading, error };
}

export function useReviewFlashcard() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reviewFlashcard = async (
    flashcardId: string,
    data: {
      difficulty_rating: "easy" | "medium" | "hard";
      response_time_ms?: number;
      was_correct?: boolean;
    }
  ) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/flashcards/${flashcardId}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to review flashcard");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { reviewFlashcard, loading, error };
}

export function useGenerateFlashcards() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateFlashcards = async (data: {
    goal_id: string;
    lesson_day_indices: number[];
    category_id?: string;
  }) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/flashcards/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to generate flashcards");
      }

      const result = await response.json();
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { generateFlashcards, loading, error };
}
