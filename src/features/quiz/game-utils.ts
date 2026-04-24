import type { Question } from "@/types/quiz";

export function computeQuestionScore(
  correct: boolean,
  timeLeftSeconds: number,
): number {
  if (!correct) return 0;
  const bonus = Math.max(0, Math.ceil(timeLeftSeconds)) * 10;
  return 100 + bonus;
}

export function maxPossibleScore(questions: Question[]): number {
  return questions.reduce(
    (sum, q) => sum + 100 + q.timeLimitSeconds * 10,
    0,
  );
}

// Turn a raw score into a trust-worthy-looking percentile.
// Uses bands so a user with 70% of max lands roughly where they belong
// against a fake population, with a bit of randomness per play.
export function computePercentile(score: number, maxScore: number): number {
  if (maxScore === 0) return 50;
  const ratio = score / maxScore;
  let lo: number;
  let hi: number;
  if (ratio < 0.3) {
    lo = 10;
    hi = 30;
  } else if (ratio < 0.6) {
    lo = 30;
    hi = 60;
  } else if (ratio < 0.85) {
    lo = 60;
    hi = 85;
  } else {
    lo = 85;
    hi = 99;
  }
  return Math.floor(lo + Math.random() * (hi - lo + 1));
}
