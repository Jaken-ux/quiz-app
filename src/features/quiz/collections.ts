import { quizzes } from "@/data/quizzes";
import { INTERESTS } from "@/lib/interests";
import type { Play } from "@/types/play";
import type { Interest, Quiz } from "@/types/quiz";

export type CollectionId = "for-you" | "top" | "featured";

export type CollectionMeta = {
  id: CollectionId;
  label: string;
  emoji: string;
};

export const COLLECTIONS: CollectionMeta[] = [
  { id: "for-you", label: "För dig", emoji: "⭐" },
  { id: "top", label: "Hetast", emoji: "🔥" },
  { id: "featured", label: "Utvalda", emoji: "💎" },
];

export type FilterId = "all" | Interest | CollectionId;

const FEATURED_IDS: string[] = [];
const FOR_YOU_MIN_RESULTS = 3;
const TOP_LIMIT = 10;

export function isCollectionId(id: string): id is CollectionId {
  return id === "for-you" || id === "top" || id === "featured";
}

export function isInterestFilter(id: string): id is Interest {
  return (INTERESTS as readonly string[]).includes(id);
}

export function getTopQuizzes(limit = TOP_LIMIT): Quiz[] {
  return [...quizzes]
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, limit);
}

export function getFeaturedQuizzes(): Quiz[] {
  return FEATURED_IDS.map((id) => quizzes.find((q) => q.id === id)).filter(
    (q): q is Quiz => q !== undefined,
  );
}

export function getForYouQuizzes(plays: Play[]): Quiz[] {
  if (plays.length === 0) {
    const featured = getFeaturedQuizzes();
    const popular = getTopQuizzes(4);
    const seen = new Set(featured.map((q) => q.id));
    return [...featured, ...popular.filter((q) => !seen.has(q.id))];
  }

  const countByInterest = new Map<Interest, number>();
  for (const play of plays) {
    const quiz = quizzes.find((q) => q.id === play.quizId);
    if (!quiz) continue;
    for (const interest of quiz.interests) {
      countByInterest.set(interest, (countByInterest.get(interest) ?? 0) + 1);
    }
  }

  const topInterests = [...countByInterest.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([interest]) => interest);

  const matched = quizzes
    .filter((q) => q.interests.some((i) => topInterests.includes(i)))
    .sort((a, b) => b.playCount - a.playCount);

  if (matched.length >= FOR_YOU_MIN_RESULTS) return matched;

  const padding = quizzes
    .filter((q) => !matched.some((m) => m.id === q.id))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, FOR_YOU_MIN_RESULTS - matched.length);

  return [...matched, ...padding];
}

export function filterQuizzes(filter: FilterId, plays: Play[]): Quiz[] {
  if (filter === "all") return quizzes;
  if (filter === "for-you") return getForYouQuizzes(plays);
  if (filter === "top") return getTopQuizzes(TOP_LIMIT);
  if (filter === "featured") return getFeaturedQuizzes();
  return quizzes.filter((q) => q.interests.includes(filter));
}
