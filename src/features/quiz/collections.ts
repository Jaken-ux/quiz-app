import { quizzes } from "@/data/quizzes";
import { CATEGORIES } from "@/features/quiz/category-meta";
import type { Play } from "@/types/play";
import type { Category, Quiz } from "@/types/quiz";

export type CollectionId = "for-you" | "top" | "featured";

export type CollectionMeta = {
  id: CollectionId;
  label: string;
  emoji: string;
};

export const COLLECTIONS: CollectionMeta[] = [
  { id: "for-you", label: "För dig", emoji: "⭐" },
  { id: "top", label: "Top 10", emoji: "🔥" },
  { id: "featured", label: "Utvalda", emoji: "💎" },
];

export type FilterId = "all" | Category | CollectionId;

const FEATURED_IDS = ["harry-potter", "sagan-om-ringen", "marvel"];
const FOR_YOU_MIN_RESULTS = 3;
const TOP_LIMIT = 10;

export function isCollectionId(id: string): id is CollectionId {
  return id === "for-you" || id === "top" || id === "featured";
}

export function isCategoryFilter(id: string): id is Category {
  return (CATEGORIES as readonly string[]).includes(id);
}

export function getTopQuizzes(limit = TOP_LIMIT): Quiz[] {
  return [...quizzes]
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, limit);
}

export function getFeaturedQuizzes(): Quiz[] {
  return FEATURED_IDS.map((id) => quizzes.find((q) => q.id === id)).filter(
    (q): q is Quiz => q !== undefined,
  );
}

export function getForYouQuizzes(plays: Play[]): Quiz[] {
  if (plays.length === 0) {
    // Fresh user — surface featured picks with a few popular ones mixed in.
    const featured = getFeaturedQuizzes();
    const popular = getTopQuizzes(4);
    const seen = new Set(featured.map((q) => q.id));
    return [
      ...featured,
      ...popular.filter((q) => !seen.has(q.id)),
    ];
  }

  const countByCategory = new Map<Category, number>();
  for (const play of plays) {
    const quiz = quizzes.find((q) => q.id === play.quizId);
    if (!quiz) continue;
    countByCategory.set(
      quiz.category,
      (countByCategory.get(quiz.category) ?? 0) + 1,
    );
  }

  const topCategories = [...countByCategory.entries()]
    .sort(([, a], [, b]) => b - a)
    .slice(0, 2)
    .map(([cat]) => cat);

  const matched = quizzes
    .filter((q) => topCategories.includes(q.category))
    .sort((a, b) => b.playCount - a.playCount);

  if (matched.length >= FOR_YOU_MIN_RESULTS) return matched;

  // Pad with next-most-popular from other categories so the shelf never
  // looks empty even for a user who's only tried one small category.
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
  return quizzes.filter((q) => q.category === filter);
}
