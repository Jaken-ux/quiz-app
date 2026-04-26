import type { Category, Difficulty } from "@/types/quiz";

export const CATEGORIES: Category[] = [
  "kandisar",
  "politiska_blundrar",
  "sverige_kuriosa",
  "dialekt_sprak",
  "kultur_nostalgi",
  "folkets_tycke",
];

export const CATEGORY_LABEL: Record<Category, string> = {
  kandisar: "Kändisar",
  politiska_blundrar: "Politiska blundrar",
  sverige_kuriosa: "Sverige-kuriosa",
  dialekt_sprak: "Dialekt & språk",
  kultur_nostalgi: "Kultur & nostalgi",
  folkets_tycke: "Folkets tycke",
};

export const CATEGORY_EMOJI: Record<Category, string> = {
  kandisar: "🕶️",
  politiska_blundrar: "🎤",
  sverige_kuriosa: "🇸🇪",
  dialekt_sprak: "🗣️",
  kultur_nostalgi: "📺",
  folkets_tycke: "🤔",
};

// Pastel backgrounds used in category icon boxes (e.g. quiz card icon).
export const CATEGORY_ICON_BG: Record<Category, string> = {
  kandisar: "bg-pink-100",
  politiska_blundrar: "bg-violet-100",
  sverige_kuriosa: "bg-blue-100",
  dialekt_sprak: "bg-teal-100",
  kultur_nostalgi: "bg-orange-100",
  folkets_tycke: "bg-fuchsia-100",
};

// Strong gradients used as accent bars on quiz cards.
export const CATEGORY_ACCENT_BAR: Record<Category, string> = {
  kandisar: "bg-gradient-to-b from-pink-300 to-rose-400",
  politiska_blundrar: "bg-gradient-to-b from-violet-400 to-violet-600",
  sverige_kuriosa: "bg-gradient-to-b from-sky-300 to-blue-500",
  dialekt_sprak: "bg-gradient-to-b from-teal-300 to-teal-500",
  kultur_nostalgi: "bg-gradient-to-b from-orange-300 to-orange-500",
  folkets_tycke: "bg-gradient-to-b from-violet-300 to-fuchsia-500",
};

// Soft chip styles for the inactive state of category chips.
export const CATEGORY_SOFT_CHIP: Record<Category, string> = {
  kandisar: "bg-pink-100 text-pink-900",
  politiska_blundrar: "bg-violet-100 text-violet-900",
  sverige_kuriosa: "bg-blue-100 text-blue-900",
  dialekt_sprak: "bg-teal-100 text-teal-900",
  kultur_nostalgi: "bg-orange-100 text-orange-900",
  folkets_tycke: "bg-fuchsia-100 text-fuchsia-900",
};

// Tag-style chip used inside cards (e.g. small category pill).
export const CATEGORY_TAG_CLASS: Record<Category, string> = {
  kandisar: "bg-pink-100 text-pink-900",
  politiska_blundrar: "bg-violet-100 text-violet-900",
  sverige_kuriosa: "bg-blue-100 text-blue-900",
  dialekt_sprak: "bg-teal-100 text-teal-900",
  kultur_nostalgi: "bg-orange-100 text-orange-900",
  folkets_tycke: "bg-fuchsia-100 text-fuchsia-900",
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
