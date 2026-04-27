import type { SessionAnswer } from "@/types/play";
import type { Question } from "@/types/quiz";

export type QuestionScoreResult = {
  score: number;
  percentile: number;
};

const BASE_CORRECT = 100;
const TIME_BONUS_PER_SECOND = 10;

/**
 * Score one question and place the player on a percentile relative to
 * everyone else who answered it (per `question.mockStats`).
 *
 * Score:
 * - 100 baseline if correct, 0 if wrong (or timeout).
 * - Time bonus: +10 per remaining second when correct.
 * - Difficulty multiplier from crowd correct-rate:
 *     <0.30 → ×1.5  (very hard)
 *     ≥0.60 → ×0.8  (easy)
 *     else  → ×1.0
 *
 * Percentile:
 * - Wrong: 100 - correctRate*100, jittered ±5 (so missing an "easy"
 *   question lands near the bottom; missing a "hard" one is more lenient).
 * - Correct & faster than the crowd's averageTime: 50–95 by speed gap.
 * - Correct & slower: 30–70 by how much slower.
 */
export function calculateQuestionScore(
  question: Question,
  wasCorrect: boolean,
  timeUsedSeconds: number,
): QuestionScoreResult {
  const { mockStats, timeLimitSeconds } = question;

  let raw = 0;
  if (wasCorrect) {
    const remaining = Math.max(0, timeLimitSeconds - timeUsedSeconds);
    raw = BASE_CORRECT + Math.floor(remaining * TIME_BONUS_PER_SECOND);
  }

  let multiplier = 1.0;
  if (mockStats.correctRate < 0.3) multiplier = 1.5;
  else if (mockStats.correctRate > 0.6) multiplier = 0.8;

  const score = Math.round(raw * multiplier);
  const percentile = computePercentile(question, wasCorrect, timeUsedSeconds);

  return { score, percentile };
}

function clamp(value: number, lo: number, hi: number): number {
  return Math.max(lo, Math.min(hi, value));
}

function jitter(amount: number): number {
  return (Math.random() * 2 - 1) * amount;
}

function computePercentile(
  question: Question,
  wasCorrect: boolean,
  timeUsedSeconds: number,
): number {
  const { mockStats } = question;
  const { correctRate, averageTimeSeconds } = mockStats;

  if (!wasCorrect) {
    const base = (1 - correctRate) * 100;
    return Math.round(clamp(base + jitter(5), 1, 60));
  }

  if (averageTimeSeconds <= 0) {
    return 70;
  }

  if (timeUsedSeconds <= averageTimeSeconds) {
    const speedGap =
      (averageTimeSeconds - timeUsedSeconds) / averageTimeSeconds;
    const percentile = 50 + speedGap * 45 + jitter(3);
    return Math.round(clamp(percentile, 50, 95));
  }

  const slownessGap =
    (timeUsedSeconds - averageTimeSeconds) /
    Math.max(1, question.timeLimitSeconds - averageTimeSeconds);
  const percentile = 70 - slownessGap * 40 + jitter(3);
  return Math.round(clamp(percentile, 30, 70));
}

export type SessionAggregate = {
  totalScore: number;
  correctCount: number;
  averagePercentile: number;
  overallPercentile: number;
};

/**
 * Roll up per-question results into a single session number. The
 * "overall" percentile leans on the per-question average but tilts
 * slightly toward the top score — a near-perfect player should
 * outrank someone who scraped through with mid-tier per-question stats.
 */
export function calculateSessionAggregate(
  sessionAnswers: SessionAnswer[],
): SessionAggregate {
  if (sessionAnswers.length === 0) {
    return {
      totalScore: 0,
      correctCount: 0,
      averagePercentile: 0,
      overallPercentile: 0,
    };
  }

  const totalScore = sessionAnswers.reduce((sum, a) => sum + a.scoreEarned, 0);
  const correctCount = sessionAnswers.filter((a) => a.wasCorrect).length;
  const averagePercentile =
    sessionAnswers.reduce((sum, a) => sum + a.percentileForQuestion, 0) /
    sessionAnswers.length;

  const correctRatio = correctCount / sessionAnswers.length;
  // Weighted blend: 70% per-question average, 30% raw correct ratio.
  // Same-percentile sessions still distinguish "got most right" from
  // "got few right but quickly".
  const overall = averagePercentile * 0.7 + correctRatio * 100 * 0.3;

  return {
    totalScore,
    correctCount,
    averagePercentile: Math.round(averagePercentile),
    overallPercentile: Math.round(clamp(overall, 1, 99)),
  };
}
