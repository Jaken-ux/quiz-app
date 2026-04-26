import type { Difficulty } from "@/types/quiz";
import type { RatingLevel, TrainingMode } from "@/types/training";

const RATING_MIN = 100;
const RATING_MAX = 3000;
const RATING_INITIAL = 1000;

export const RATING_LEVEL_ORDER: RatingLevel[] = [
  "beginner",
  "devoted",
  "skilled",
  "expert",
  "master",
];

type LevelDisplay = {
  name: string;
  color: string;
  emoji: string;
};

const LEVEL_DISPLAYS: Record<RatingLevel, LevelDisplay> = {
  beginner: { name: "Nybörjare", color: "#9CA3AF", emoji: "🌱" },
  devoted: { name: "Hängiven", color: "#3B82F6", emoji: "💙" },
  skilled: { name: "Skicklig", color: "#10B981", emoji: "🌟" },
  expert: { name: "Expert", color: "#A855F7", emoji: "🏅" },
  master: { name: "Mästare", color: "#F59E0B", emoji: "👑" },
};

const LEVEL_RANGES: Record<RatingLevel, { min: number; max: number }> = {
  beginner: { min: 0, max: 800 },
  devoted: { min: 800, max: 1200 },
  skilled: { min: 1200, max: 1600 },
  expert: { min: 1600, max: 2000 },
  master: { min: 2000, max: 3000 },
};

export function getRatingLevel(rating: number): RatingLevel {
  if (rating >= 2000) return "master";
  if (rating >= 1600) return "expert";
  if (rating >= 1200) return "skilled";
  if (rating >= 800) return "devoted";
  return "beginner";
}

export function getRatingLevelDisplay(level: RatingLevel): LevelDisplay {
  return LEVEL_DISPLAYS[level];
}

export function getRatingLevelRange(
  level: RatingLevel,
): { min: number; max: number } {
  return LEVEL_RANGES[level];
}

export function getLevelProgress(rating: number): number {
  const level = getRatingLevel(rating);
  const { min, max } = LEVEL_RANGES[level];
  if (max === min) return 1;
  return Math.min(1, Math.max(0, (rating - min) / (max - min)));
}

export function compareLevels(a: RatingLevel, b: RatingLevel): number {
  return RATING_LEVEL_ORDER.indexOf(a) - RATING_LEVEL_ORDER.indexOf(b);
}

type QuestionResult = {
  difficulty: Difficulty;
  isCorrect: boolean;
  timeUsedSeconds: number;
  timeLimitSeconds: number;
};

export function calculateQuestionDelta(
  difficulty: Difficulty,
  isCorrect: boolean,
  timeUsedSeconds: number,
  timeLimitSeconds: number,
): number {
  let delta = 0;
  if (isCorrect) {
    if (difficulty === "easy") delta = 6;
    else if (difficulty === "medium") delta = 10;
    else delta = 15;
    if (timeUsedSeconds < timeLimitSeconds * 0.5) {
      delta += 3;
    }
  } else {
    if (difficulty === "easy") delta = -10;
    else if (difficulty === "medium") delta = -10;
    else delta = -5;
  }
  return delta;
}

export function calculateSessionDelta(
  questionResults: QuestionResult[],
  mode: TrainingMode,
): number {
  const sum = questionResults.reduce(
    (acc, q) =>
      acc +
      calculateQuestionDelta(
        q.difficulty,
        q.isCorrect,
        q.timeUsedSeconds,
        q.timeLimitSeconds,
      ),
    0,
  );
  return mode === "fast" ? sum * 2 : sum;
}

export function applyRating(currentRating: number, delta: number): number {
  const next = currentRating + delta;
  return Math.min(RATING_MAX, Math.max(RATING_MIN, next));
}

export const RATING_INITIAL_VALUE = RATING_INITIAL;
