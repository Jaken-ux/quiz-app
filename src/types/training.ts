import type { Difficulty, Interest } from "@/types/quiz";

export type QuestionPoolItem = {
  id: string;
  // Pool questions are tagged with one primary interest (single-tag) for
  // training purposes, even though full Quizzes can carry multiple.
  interest: Interest;
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

export type InterestRating = {
  interest: Interest;
  rating: number;
  gamesPlayed: number;
  lastUpdated: string;
};

export type TrainingSession = {
  id: string;
  interest: Interest;
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
