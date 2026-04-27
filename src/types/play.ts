export type SessionAnswer = {
  questionId: string;
  wasCorrect: boolean;
  timeUsedSeconds: number;
  scoreEarned: number;
  percentileForQuestion: number;
};

export type Play = {
  id: string;
  quizId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  /** Aggregated session percentile (0-100). */
  percentile: number;
  isFirstAttempt: boolean;
  playedAt: string;
  /**
   * Per-question breakdown. Optional so plays from before pool-mode
   * keep deserializing. Newer plays always carry it.
   */
  sessionAnswers?: SessionAnswer[];
};
