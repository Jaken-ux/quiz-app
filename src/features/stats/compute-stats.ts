import { quizzes } from "@/data/quizzes";
import type { Play } from "@/types/play";
import type { Category } from "@/types/quiz";

export type CategoryMastery = {
  plays: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
};

export type Stats = {
  totalPlays: number;
  totalScore: number;
  bestScore: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  avgPercentile: number;
  level: number;
  xpForLevel: number;
  xpToNextLevel: number;
  rankTitle: string;
  streakDays: number;
  uniqueCategoryCount: number;
  perCategory: Record<Category, CategoryMastery>;
  mockRank: number;
  mockTotalPlayers: number;
};

const XP_PER_LEVEL = 500;
const MOCK_TOTAL_PLAYERS = 8432;

export function xpToLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

export function rankForLevel(level: number): string {
  if (level >= 25) return "Legend 🏆";
  if (level >= 17) return "Virtuos";
  if (level >= 12) return "Mästare";
  if (level >= 8) return "Expert";
  if (level >= 5) return "Quiz-entusiast";
  if (level >= 3) return "Lovande spelare";
  return "Nybörjare";
}

function getQuizCategory(quizId: string): Category | null {
  return quizzes.find((q) => q.id === quizId)?.category ?? null;
}

function dayKey(iso: string): string {
  return iso.slice(0, 10);
}

function computeStreak(plays: Play[]): number {
  if (plays.length === 0) return 0;
  const dates = new Set(plays.map((p) => dayKey(p.playedAt)));

  const today = dayKey(new Date().toISOString());
  let cursor = today;

  if (!dates.has(today)) {
    const yesterday = new Date(Date.now() - 86_400_000);
    cursor = dayKey(yesterday.toISOString());
    if (!dates.has(cursor)) return 0;
  }

  let streak = 0;
  while (dates.has(cursor)) {
    streak += 1;
    const d = new Date(cursor);
    d.setDate(d.getDate() - 1);
    cursor = dayKey(d.toISOString());
  }
  return streak;
}

function emptyMastery(): CategoryMastery {
  return { plays: 0, correctAnswers: 0, totalAnswers: 0, accuracy: 0 };
}

export function computeStats(plays: Play[]): Stats {
  const totalPlays = plays.length;
  const totalScore = plays.reduce((sum, p) => sum + p.score, 0);
  const bestScore =
    plays.length > 0 ? Math.max(...plays.map((p) => p.score)) : 0;
  const correctAnswers = plays.reduce((sum, p) => sum + p.correctCount, 0);
  const totalAnswers = plays.reduce((sum, p) => sum + p.totalQuestions, 0);
  const accuracy = totalAnswers > 0 ? correctAnswers / totalAnswers : 0;
  // Only official first-attempt plays carry a meaningful percentile; training
  // plays store 0 and would otherwise drag the average down.
  const officialPlays = plays.filter((p) => p.isFirstAttempt);
  const avgPercentile =
    officialPlays.length > 0
      ? officialPlays.reduce((sum, p) => sum + p.percentile, 0) /
        officialPlays.length
      : 0;

  const level = xpToLevel(totalScore);
  const xpStart = (level - 1) * XP_PER_LEVEL;
  const xpForLevel = totalScore - xpStart;
  const xpToNextLevel = XP_PER_LEVEL - xpForLevel;
  const rankTitle = rankForLevel(level);

  const perCategory: Record<Category, CategoryMastery> = {
    kandisar: emptyMastery(),
    politiska_blundrar: emptyMastery(),
    sverige_kuriosa: emptyMastery(),
    dialekt_sprak: emptyMastery(),
    kultur_nostalgi: emptyMastery(),
    folkets_tycke: emptyMastery(),
  };

  for (const play of plays) {
    const cat = getQuizCategory(play.quizId);
    if (!cat) continue;
    const mastery = perCategory[cat];
    mastery.plays += 1;
    mastery.correctAnswers += play.correctCount;
    mastery.totalAnswers += play.totalQuestions;
    mastery.accuracy =
      mastery.totalAnswers > 0
        ? mastery.correctAnswers / mastery.totalAnswers
        : 0;
  }

  const uniqueCategoryCount = Object.values(perCategory).filter(
    (m) => m.plays > 0,
  ).length;

  const streakDays = computeStreak(plays);

  // Fake leaderboard rank that improves as the user scores. Clamped so a
  // fresh user still starts mid-pack (not dead last) and high scorers
  // eventually reach the top.
  const mockRank = Math.max(
    120,
    Math.min(
      MOCK_TOTAL_PLAYERS,
      Math.floor(MOCK_TOTAL_PLAYERS - totalScore * 0.65),
    ),
  );

  return {
    totalPlays,
    totalScore,
    bestScore,
    correctAnswers,
    totalAnswers,
    accuracy,
    avgPercentile,
    level,
    xpForLevel,
    xpToNextLevel,
    rankTitle,
    streakDays,
    uniqueCategoryCount,
    perCategory,
    mockRank,
    mockTotalPlayers: MOCK_TOTAL_PLAYERS,
  };
}

export const XP_PER_LEVEL_CONST = XP_PER_LEVEL;
