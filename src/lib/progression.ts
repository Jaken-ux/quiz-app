export type ProgressionLevel =
  | "beginner"
  | "devoted"
  | "skilled"
  | "expert"
  | "master";

export type ProgressionLevelMeta = {
  name: string;
  color: string;
  emoji: string;
};

export const PROGRESSION_META: Record<ProgressionLevel, ProgressionLevelMeta> = {
  beginner: { name: "Nybörjare", color: "#9CA3AF", emoji: "🌱" },
  devoted: { name: "Hängiven", color: "#3B82F6", emoji: "💙" },
  skilled: { name: "Skicklig", color: "#10B981", emoji: "🌟" },
  expert: { name: "Expert", color: "#A855F7", emoji: "🏅" },
  master: { name: "Mästare", color: "#F59E0B", emoji: "👑" },
};

export const PROGRESSION_LEVELS: ProgressionLevel[] = [
  "beginner",
  "devoted",
  "skilled",
  "expert",
  "master",
];

/**
 * Map raw activity to a progression level. The mastery levels gate on
 * both volume (questions answered) and quality (average percentile)
 * so a one-hit wonder can't reach Master without sustained play.
 */
export function getProgressionLevel(
  questionsAnswered: number,
  averagePercentile: number,
): ProgressionLevel {
  if (questionsAnswered < 10) return "beginner";
  if (averagePercentile >= 90 && questionsAnswered >= 100) return "master";
  if (averagePercentile >= 75 && questionsAnswered >= 50) return "expert";
  if (averagePercentile >= 60 && questionsAnswered >= 25) return "skilled";
  return "devoted";
}
