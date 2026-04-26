export type Play = {
  id: string;
  quizId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  // Percentile is meaningful only for the first official attempt.
  // Training plays store 0 here.
  percentile: number;
  isFirstAttempt: boolean;
  playedAt: string;
};
