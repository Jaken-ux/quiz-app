import { quizzes } from "@/data/quizzes";
import { INTERESTS } from "@/lib/interests";
import {
  getProgressionLevel,
  type ProgressionLevel,
} from "@/lib/progression";
import type { Play } from "@/types/play";
import type { Interest } from "@/types/quiz";

export type InterestMastery = {
  questionsAnswered: number;
  correctAnswers: number;
  averagePercentile: number;
  plays: number;
  level: ProgressionLevel;
};

export type Stats = {
  totalPlays: number;
  totalScore: number;
  bestScore: number;
  correctAnswers: number;
  totalAnswers: number;
  accuracy: number;
  averagePercentile: number;
  level: number;
  xpForLevel: number;
  xpToNextLevel: number;
  rankTitle: string;
  streakDays: number;
  uniqueInterestCount: number;
  perInterest: Record<Interest, InterestMastery>;
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

function getQuizInterests(quizId: string): Interest[] {
  return quizzes.find((q) => q.id === quizId)?.interests ?? [];
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

type InterestAcc = {
  questionsAnswered: number;
  correctAnswers: number;
  percentileSum: number;
  percentileSamples: number;
  plays: number;
};

function emptyAcc(): InterestAcc {
  return {
    questionsAnswered: 0,
    correctAnswers: 0,
    percentileSum: 0,
    percentileSamples: 0,
    plays: 0,
  };
}

export function computeStats(plays: Play[]): Stats {
  const totalPlays = plays.length;
  const totalScore = plays.reduce((sum, p) => sum + p.score, 0);
  const bestScore =
    plays.length > 0 ? Math.max(...plays.map((p) => p.score)) : 0;
  const correctAnswers = plays.reduce((sum, p) => sum + p.correctCount, 0);
  const totalAnswers = plays.reduce((sum, p) => sum + p.totalQuestions, 0);
  const accuracy = totalAnswers > 0 ? correctAnswers / totalAnswers : 0;
  const averagePercentile =
    plays.length > 0
      ? plays.reduce((sum, p) => sum + p.percentile, 0) / plays.length
      : 0;

  const level = xpToLevel(totalScore);
  const xpStart = (level - 1) * XP_PER_LEVEL;
  const xpForLevel = totalScore - xpStart;
  const xpToNextLevel = XP_PER_LEVEL - xpForLevel;
  const rankTitle = rankForLevel(level);

  const accs = {} as Record<Interest, InterestAcc>;
  for (const interest of INTERESTS) accs[interest] = emptyAcc();

  for (const play of plays) {
    const interests = getQuizInterests(play.quizId);
    if (interests.length === 0) continue;
    for (const interest of interests) {
      const acc = accs[interest];
      acc.plays += 1;
      acc.questionsAnswered += play.totalQuestions;
      acc.correctAnswers += play.correctCount;
      acc.percentileSum += play.percentile;
      acc.percentileSamples += 1;
    }
  }

  const perInterest = {} as Record<Interest, InterestMastery>;
  for (const interest of INTERESTS) {
    const acc = accs[interest];
    const avg =
      acc.percentileSamples > 0
        ? acc.percentileSum / acc.percentileSamples
        : 0;
    perInterest[interest] = {
      questionsAnswered: acc.questionsAnswered,
      correctAnswers: acc.correctAnswers,
      averagePercentile: Math.round(avg),
      plays: acc.plays,
      level: getProgressionLevel(acc.questionsAnswered, avg),
    };
  }

  const uniqueInterestCount = Object.values(perInterest).filter(
    (m) => m.questionsAnswered > 0,
  ).length;

  const streakDays = computeStreak(plays);

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
    averagePercentile: Math.round(averagePercentile),
    level,
    xpForLevel,
    xpToNextLevel,
    rankTitle,
    streakDays,
    uniqueInterestCount,
    perInterest,
    mockRank,
    mockTotalPlayers: MOCK_TOTAL_PLAYERS,
  };
}

export const XP_PER_LEVEL_CONST = XP_PER_LEVEL;
