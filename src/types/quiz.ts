export type Category =
  | "kandisar"
  | "politiska_blundrar"
  | "sverige_kuriosa"
  | "dialekt_sprak"
  | "kultur_nostalgi"
  | "folkets_tycke";

export type Difficulty = "easy" | "medium" | "hard";

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
  category: Category;
  difficulty: Difficulty;
  questionCount: number;
  estimatedMinutes: number;
  playCount: number;
  likeCount: number;
  questions: Question[];
};
