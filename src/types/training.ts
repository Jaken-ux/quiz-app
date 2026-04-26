import type { Category, Difficulty } from "@/types/quiz";

export type QuestionPoolItem = {
  id: string;
  category: Category;
  difficulty: Difficulty;
  text: string;
  options: string[];
  correctIndex: number;
};

export type TrainingMode = "classic" | "fast";

export type RatingLevel =
  | "beginner"
  | "devoted"
  | "skilled"
  | "expert"
  | "master";

export type CategoryRating = {
  category: Category;
  rating: number;
  gamesPlayed: number;
  lastUpdated: string;
};

export type TrainingSession = {
  id: string;
  category: Category;
  difficulty: Difficulty;
  mode: TrainingMode;
  score: number;
  correctCount: number;
  totalQuestions: number;
  averageTimePerQuestion: number;
  ratingBefore: number;
  ratingAfter: number;
  ratingDelta: number;
  playedAt: string;
};
