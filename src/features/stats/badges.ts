import type { Stats } from "@/features/stats/compute-stats";
import type { Play } from "@/types/play";

export type BadgeDef = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  isEarned: (plays: Play[], stats: Stats) => boolean;
};

export const BADGES: BadgeDef[] = [
  {
    id: "first-step",
    emoji: "🏁",
    label: "Första steget",
    description: "Spela ditt första quiz",
    isEarned: (plays) => plays.length >= 1,
  },
  {
    id: "perfect",
    emoji: "💯",
    label: "Fullpott",
    description: "Alla rätt i ett quiz",
    isEarned: (plays) =>
      plays.some(
        (p) => p.totalQuestions > 0 && p.correctCount === p.totalQuestions,
      ),
  },
  {
    id: "top-percentile",
    emoji: "🎯",
    label: "Träffsäker",
    description: "Nå top 10% i ett quiz",
    isEarned: (plays) => plays.some((p) => p.percentile >= 90),
  },
  {
    id: "streak-3",
    emoji: "🔥",
    label: "Glöd",
    description: "3 dagar i rad",
    isEarned: (_plays, stats) => stats.streakDays >= 3,
  },
  {
    id: "quick",
    emoji: "⚡",
    label: "Blixtsnabb",
    description: "500+ poäng på ett spel",
    isEarned: (plays) => plays.some((p) => p.score >= 500),
  },
  {
    id: "explorer",
    emoji: "🌍",
    label: "Upptäckaren",
    description: "Spela quiz från 4 intressen",
    isEarned: (_plays, stats) => stats.uniqueInterestCount >= 4,
  },
  {
    id: "stonecold",
    emoji: "❄️",
    label: "Iskall",
    description: "Nå top 1% i ett quiz",
    isEarned: (plays) => plays.some((p) => p.percentile >= 99),
  },
  {
    id: "veteran",
    emoji: "🧠",
    label: "Veteran",
    description: "Spela 10 quiz totalt",
    isEarned: (plays) => plays.length >= 10,
  },
  {
    id: "diamond",
    emoji: "💎",
    label: "Diamant",
    description: "Samla 5 000 XP",
    isEarned: (_plays, stats) => stats.totalScore >= 5000,
  },
];
