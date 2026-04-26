export type Category =
  | "musik"
  | "film"
  | "sport"
  | "geografi"
  | "historia"
  | "allmänbildning";

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
