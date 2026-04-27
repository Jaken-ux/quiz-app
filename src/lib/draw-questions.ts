import type { Question, Quiz } from "@/types/quiz";

/**
 * Draw `count` random questions from a quiz's pool using Fisher-Yates.
 * Returns the whole pool (shuffled) when the pool is smaller than `count`.
 * Defaults `count` to the quiz's own `questionsPerSession`.
 */
export function drawSessionQuestions(
  quiz: Quiz,
  count: number = quiz.questionsPerSession,
): Question[] {
  const pool = quiz.questionPool;
  if (pool.length === 0) return [];
  const shuffled = pool.slice();
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, Math.min(count, shuffled.length));
}
