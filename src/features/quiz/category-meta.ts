import type { Category, Difficulty } from "@/types/quiz";

export const CATEGORIES: Category[] = [
  "musik",
  "film",
  "sport",
  "geografi",
  "historia",
  "allmänbildning",
];

export const CATEGORY_LABEL: Record<Category, string> = {
  musik: "Musik",
  film: "Film",
  sport: "Sport",
  geografi: "Geografi",
  historia: "Historia",
  allmänbildning: "Allmänbildning",
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  musik: "🎵",
  film: "🎬",
  sport: "⚽",
  geografi: "🌍",
  historia: "📚",
  allmänbildning: "💡",
};

export const CATEGORY_ICON_BG: Record<Category, string> = {
  musik: "bg-pink-100",
  film: "bg-indigo-100",
  sport: "bg-emerald-100",
  geografi: "bg-sky-100",
  historia: "bg-amber-100",
  allmänbildning: "bg-violet-100",
};

export const CATEGORY_ACCENT_BAR: Record<Category, string> = {
  musik: "bg-gradient-to-b from-pink-400 to-rose-500",
  film: "bg-gradient-to-b from-indigo-400 to-blue-500",
  sport: "bg-gradient-to-b from-emerald-400 to-green-500",
  geografi: "bg-gradient-to-b from-sky-400 to-cyan-500",
  historia: "bg-gradient-to-b from-amber-400 to-orange-500",
  allmänbildning: "bg-gradient-to-b from-violet-400 to-fuchsia-500",
};

export const CATEGORY_SOFT_CHIP: Record<Category, string> = {
  musik: "bg-pink-100 text-pink-900",
  film: "bg-indigo-100 text-indigo-900",
  sport: "bg-emerald-100 text-emerald-900",
  geografi: "bg-sky-100 text-sky-900",
  historia: "bg-amber-100 text-amber-900",
  allmänbildning: "bg-violet-100 text-violet-900",
};

export const CATEGORY_TAG_CLASS: Record<Category, string> = {
  musik: "bg-pink-100 text-pink-900",
  film: "bg-indigo-100 text-indigo-900",
  sport: "bg-emerald-100 text-emerald-900",
  geografi: "bg-sky-100 text-sky-900",
  historia: "bg-amber-100 text-amber-900",
  allmänbildning: "bg-violet-100 text-violet-900",
};

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
