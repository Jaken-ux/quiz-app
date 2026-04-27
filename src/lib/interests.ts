import type { Interest } from "@/types/quiz";

export type InterestMeta = {
  emoji: string;
  name: string;
  /** Hex color used for badges, accents and chip text. */
  color: string;
};

export const INTEREST_META: Record<Interest, InterestMeta> = {
  politik_samhalle: {
    emoji: "🎤",
    name: "Politik & samhälle",
    color: "#A78BFA",
  },
  reklam_tv_forr: {
    emoji: "📺",
    name: "Reklam & TV förr",
    color: "#FDBA74",
  },
  film_serier: {
    emoji: "🎬",
    name: "Filmer & serier",
    color: "#7C3AED",
  },
  musik_genom_aren: {
    emoji: "🎵",
    name: "Musik genom åren",
    color: "#F9A8D4",
  },
  sverige_grejer: {
    emoji: "🇸🇪",
    name: "Sverige-grejer",
    color: "#93C5FD",
  },
  bara_skratt: {
    emoji: "😂",
    name: "Bara skratt",
    color: "#FCD34D",
  },
  kuriosa_fakta: {
    emoji: "🤓",
    name: "Kuriosa & fakta",
    color: "#5EEAD4",
  },
  sprak_dialekter: {
    emoji: "🗣️",
    name: "Språk & dialekter",
    color: "#67E8F9",
  },
  sport_idrott: {
    emoji: "🏃",
    name: "Sport & idrott",
    color: "#86EFAC",
  },
  internet_memes: {
    emoji: "🎮",
    name: "Internet & memes",
    color: "#F472B6",
  },
  konst_kultur: {
    emoji: "🎨",
    name: "Konst & kultur",
    color: "#C084FC",
  },
  mat_dryck: {
    emoji: "🍔",
    name: "Mat & dryck",
    color: "#FCA5A5",
  },
};

export const INTERESTS: Interest[] = [
  "politik_samhalle",
  "reklam_tv_forr",
  "film_serier",
  "musik_genom_aren",
  "sverige_grejer",
  "bara_skratt",
  "kuriosa_fakta",
  "sprak_dialekter",
  "sport_idrott",
  "internet_memes",
  "konst_kultur",
  "mat_dryck",
];

// Tailwind utility classes per interest. Static strings so the JIT picks
// them up. Keep in sync with INTEREST_META colors above.
export const INTEREST_ICON_BG: Record<Interest, string> = {
  politik_samhalle: "bg-violet-100",
  reklam_tv_forr: "bg-orange-100",
  film_serier: "bg-purple-100",
  musik_genom_aren: "bg-pink-100",
  sverige_grejer: "bg-blue-100",
  bara_skratt: "bg-amber-100",
  kuriosa_fakta: "bg-teal-100",
  sprak_dialekter: "bg-cyan-100",
  sport_idrott: "bg-green-100",
  internet_memes: "bg-rose-100",
  konst_kultur: "bg-fuchsia-100",
  mat_dryck: "bg-red-100",
};

export const INTEREST_ACCENT_BAR: Record<Interest, string> = {
  politik_samhalle: "bg-gradient-to-b from-violet-300 to-violet-500",
  reklam_tv_forr: "bg-gradient-to-b from-orange-300 to-orange-500",
  film_serier: "bg-gradient-to-b from-purple-400 to-purple-600",
  musik_genom_aren: "bg-gradient-to-b from-pink-300 to-rose-400",
  sverige_grejer: "bg-gradient-to-b from-sky-300 to-blue-500",
  bara_skratt: "bg-gradient-to-b from-amber-300 to-yellow-500",
  kuriosa_fakta: "bg-gradient-to-b from-teal-300 to-teal-500",
  sprak_dialekter: "bg-gradient-to-b from-cyan-300 to-cyan-500",
  sport_idrott: "bg-gradient-to-b from-green-300 to-emerald-500",
  internet_memes: "bg-gradient-to-b from-rose-300 to-pink-500",
  konst_kultur: "bg-gradient-to-b from-fuchsia-300 to-fuchsia-500",
  mat_dryck: "bg-gradient-to-b from-red-300 to-red-500",
};

export const INTEREST_TAG_CLASS: Record<Interest, string> = {
  politik_samhalle: "bg-violet-100 text-violet-900",
  reklam_tv_forr: "bg-orange-100 text-orange-900",
  film_serier: "bg-purple-100 text-purple-900",
  musik_genom_aren: "bg-pink-100 text-pink-900",
  sverige_grejer: "bg-blue-100 text-blue-900",
  bara_skratt: "bg-amber-100 text-amber-900",
  kuriosa_fakta: "bg-teal-100 text-teal-900",
  sprak_dialekter: "bg-cyan-100 text-cyan-900",
  sport_idrott: "bg-green-100 text-green-900",
  internet_memes: "bg-rose-100 text-rose-900",
  konst_kultur: "bg-fuchsia-100 text-fuchsia-900",
  mat_dryck: "bg-red-100 text-red-900",
};

// Convenience selectors: many call sites expect a primary interest
// (a quiz can be tagged with several).
export function primaryInterest(interests: Interest[]): Interest {
  return interests[0] ?? "kuriosa_fakta";
}

// Short blurbs used on landing pages. Keep them punchy; tone matches the
// humor-app vibe.
export const INTEREST_BLURB: Record<Interest, string> = {
  politik_samhalle:
    "Märkliga citat, glömda skandaler och politiska gaffes",
  reklam_tv_forr: "Reklamer du minns och program du försökt glömma",
  film_serier: "Allt om film och TV — gamla och nya pärlor",
  musik_genom_aren: "Musikquizzar från 60-tal till idag",
  sverige_grejer: "Allt det märkliga, fula och oväntade om Sverige",
  bara_skratt: "Bara här för att skratta",
  kuriosa_fakta: "Konstig kunskap som ingen behöver men alla vill ha",
  sprak_dialekter: "Dialekter, uttryck och svenska språkets baksidor",
  sport_idrott: "Idrott — på riktigt och på skämt",
  internet_memes: "Internet-kultur, memes och digitala skämt",
  konst_kultur: "Konst, kultur och kreativitet — högt och lågt",
  mat_dryck: "Mat, dryck och svenska kulinariska udda",
};

// Hero gradient per interest. Deeper, richer colors than the pastel
// icon backgrounds so the landing-page hero pops.
export const INTEREST_HERO_GRADIENT: Record<Interest, string> = {
  politik_samhalle: "bg-gradient-to-br from-violet-400 via-violet-500 to-purple-700",
  reklam_tv_forr: "bg-gradient-to-br from-orange-300 via-orange-400 to-rose-500",
  film_serier: "bg-gradient-to-br from-purple-500 via-fuchsia-600 to-indigo-700",
  musik_genom_aren: "bg-gradient-to-br from-pink-400 via-rose-500 to-fuchsia-600",
  sverige_grejer: "bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600",
  bara_skratt: "bg-gradient-to-br from-amber-300 via-yellow-400 to-orange-400",
  kuriosa_fakta: "bg-gradient-to-br from-teal-300 via-teal-400 to-emerald-600",
  sprak_dialekter: "bg-gradient-to-br from-cyan-300 via-cyan-500 to-sky-600",
  sport_idrott: "bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600",
  internet_memes: "bg-gradient-to-br from-rose-400 via-pink-500 to-fuchsia-600",
  konst_kultur: "bg-gradient-to-br from-fuchsia-400 via-fuchsia-500 to-purple-600",
  mat_dryck: "bg-gradient-to-br from-red-400 via-red-500 to-rose-600",
};

// Whether the hero gradient is light enough that text needs to be
// dark for AA contrast. The bright/yellow/light-cyan ones are.
export const INTEREST_HERO_DARK_TEXT: Record<Interest, boolean> = {
  politik_samhalle: false,
  reklam_tv_forr: false,
  film_serier: false,
  musik_genom_aren: false,
  sverige_grejer: false,
  bara_skratt: true,
  kuriosa_fakta: false,
  sprak_dialekter: true,
  sport_idrott: false,
  internet_memes: false,
  konst_kultur: false,
  mat_dryck: false,
};

// Solid color used for accents (CTA buttons, section underlines) on a
// landing page. Mirrors INTEREST_META.color but as Tailwind utility.
export const INTEREST_BUTTON_BG: Record<Interest, string> = {
  politik_samhalle: "bg-violet-500 hover:bg-violet-600",
  reklam_tv_forr: "bg-orange-500 hover:bg-orange-600",
  film_serier: "bg-purple-600 hover:bg-purple-700",
  musik_genom_aren: "bg-pink-500 hover:bg-pink-600",
  sverige_grejer: "bg-blue-500 hover:bg-blue-600",
  bara_skratt: "bg-amber-500 hover:bg-amber-600",
  kuriosa_fakta: "bg-teal-500 hover:bg-teal-600",
  sprak_dialekter: "bg-cyan-500 hover:bg-cyan-600",
  sport_idrott: "bg-emerald-500 hover:bg-emerald-600",
  internet_memes: "bg-rose-500 hover:bg-rose-600",
  konst_kultur: "bg-fuchsia-500 hover:bg-fuchsia-600",
  mat_dryck: "bg-red-500 hover:bg-red-600",
};

// `'sverige_grejer'` <-> `'sverige-grejer'`.
export function interestToSlug(interest: Interest): string {
  return interest.replace(/_/g, "-");
}

export function slugToInterest(slug: string): Interest | null {
  const candidate = slug.replace(/-/g, "_");
  return (INTERESTS as readonly string[]).includes(candidate)
    ? (candidate as Interest)
    : null;
}
