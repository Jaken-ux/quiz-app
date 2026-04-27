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

export type Question = {
  id: string;
  text: string;
  options: string[];
  correctIndex: number;
  timeLimitSeconds: number;
};

export type Quiz = {
  id: string;
  title: string;
  description: string;
  interests: Interest[];
  format: QuizFormat;
  difficulty: Difficulty;
  questionCount: number;
  estimatedMinutes: number;
  playCount: number;
  likeCount: number;
  questions: Question[];
};
