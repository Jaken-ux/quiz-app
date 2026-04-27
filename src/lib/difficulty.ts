import type { Difficulty } from "@/types/quiz";

export const DIFFICULTY_LABEL: Record<Difficulty, string> = {
  easy: "Lätt",
  medium: "Medel",
  hard: "Svår",
};

export const DIFFICULTY_EMOJI: Record<Difficulty, string> = {
  easy: "🟢",
  medium: "🟡",
  hard: "🔴",
};

export const DIFFICULTY_PILL: Record<Difficulty, string> = {
  easy: "bg-emerald-100 text-emerald-800",
  medium: "bg-amber-100 text-amber-900",
  hard: "bg-rose-100 text-rose-800",
};
