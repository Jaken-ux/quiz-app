export type Interest =
  | "politik_samhalle"
  | "reklam_tv_forr"
  | "film_serier"
  | "musik_genom_aren"
  | "sverige_grejer"
  | "bara_skratt"
  | "kuriosa_fakta"
  | "sprak_dialekter"
  | "sport_idrott"
  | "internet_memes"
  | "konst_kultur"
  | "mat_dryck";

export type Difficulty = "easy" | "medium" | "hard";

export type QuizFormat =
  | "text"
  | "image"
  | "audio"
  | "mixed"
  | "voting"
  | "true_false";

// Per-question crowd statistics. Mocked while we lack a backend.
// Used by scoring/percentile and the result-screen breakdown.
export type QuestionMockStats = {
  totalAnswered: number;
  correctRate: number;
  averageTimeSeconds: number;
};

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  timeLimitSeconds: number;
  mockStats: QuestionMockStats;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  interests: Interest[];
  format: QuizFormat;
  difficulty: Difficulty;
  estimatedMinutes: number;
  playCount: number;
  likeCount: number;
  /** Pool of questions; a session draws `questionsPerSession` random ones. */
  questionPool: Question[];
  questionsPerSession: number;
};
