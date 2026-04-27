import type { QuizFormat } from "@/types/quiz";

export type FormatMeta = {
  emoji: string;
  name: string;
  description: string;
};

export const FORMAT_META: Record<QuizFormat, FormatMeta> = {
  text: {
    emoji: "📝",
    name: "Frågor",
    description: "Klassiska quizfrågor",
  },
  image: {
    emoji: "📷",
    name: "Bildquiz",
    description: "Gissa utifrån bilder",
  },
  audio: {
    emoji: "🔊",
    name: "Ljudquiz",
    description: "Hör och gissa",
  },
  mixed: {
    emoji: "🎲",
    name: "Blandat",
    description: "Olika frågetyper",
  },
  voting: {
    emoji: "🗳️",
    name: "Omröstning",
    description: "Inget rätt svar — bara åsikter",
  },
  true_false: {
    emoji: "⚡",
    name: "Sant eller falskt",
    description: "Snabba ja/nej-frågor",
  },
};

// Stable order for landing-page sections.
export const FORMATS: QuizFormat[] = [
  "text",
  "image",
  "audio",
  "mixed",
  "voting",
  "true_false",
];
