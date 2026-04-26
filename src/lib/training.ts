import { questionPool } from "@/data/question-pool";
import type { Category, Difficulty } from "@/types/quiz";
import type {
  QuestionPoolItem,
  TrainingMode,
  TrainingSession,
} from "@/types/training";

const STORAGE_KEY = "quiz-app.training-sessions";

export function getPoolSize(
  category: Category,
  difficulty: Difficulty,
): number {
  return questionPool.filter(
    (q) => q.category === category && q.difficulty === difficulty,
  ).length;
}

export function drawQuestions(
  category: Category,
  difficulty: Difficulty,
  count: number,
): QuestionPoolItem[] {
  const matching = questionPool.filter(
    (q) => q.category === category && q.difficulty === difficulty,
  );
  if (matching.length === 0) return [];
  // Fisher–Yates shuffle so each session feels fresh.
  const shuffled = [...matching];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

export function timeLimitForMode(mode: TrainingMode): number {
  return mode === "fast" ? 7 : 15;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

export function createTrainingSession(input: {
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
}): TrainingSession {
  return {
    id: generateId(),
    category: input.category,
    difficulty: input.difficulty,
    mode: input.mode,
    score: input.score,
    correctCount: input.correctCount,
    totalQuestions: input.totalQuestions,
    averageTimePerQuestion: input.averageTimePerQuestion,
    ratingBefore: input.ratingBefore,
    ratingAfter: input.ratingAfter,
    ratingDelta: input.ratingDelta,
    playedAt: new Date().toISOString(),
  };
}

export function saveTrainingSession(session: TrainingSession): void {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const arr: TrainingSession[] = raw
      ? (JSON.parse(raw) as TrainingSession[])
      : [];
    arr.push(session);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));
  } catch {
    // Ignore storage errors in prototype.
  }
}

export function readTrainingSessions(): TrainingSession[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as TrainingSession[]) : [];
  } catch {
    return [];
  }
}
