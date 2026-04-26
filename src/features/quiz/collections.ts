import { quizzes } from "@/data/quizzes";
import { CATEGORIES } from "@/features/quiz/category-meta";
import type { Play } from "@/types/play";
import type { Category, Quiz, Region } from "@/types/quiz";

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

export type FilterId = "all" | Category | CollectionId;

// Hand-picked highlights per region.
const FEATURED_IDS: Record<Region, string[]> = {
  world: ["harry-potter", "sagan-om-ringen", "marvel"],
  sweden: ["sveriges-lan", "svensk-popmusik", "svenska-kandisar"],
};
const FOR_YOU_MIN_RESULTS = 3;
const TOP_LIMIT = 10;

export function isCollectionId(id: string): id is CollectionId {
  return id === "for-you" || id === "top" || id === "featured";
}

export function isCategoryFilter(id: string): id is Category {
  return (CATEGORIES as readonly string[]).includes(id);
}

function inRegion(quiz: Quiz, region: Region): boolean {
  return quiz.region === region;
}

export function getTopQuizzes(region: Region, limit = TOP_LIMIT): Quiz[] {
  return [...quizzes]
    .filter((q) => inRegion(q, region))
    .sort((a, b) => b.likeCount - a.likeCount)
    .slice(0, limit);
}

export function getFeaturedQuizzes(region: Region): Quiz[] {
  return FEATURED_IDS[region]
    .map((id) => quizzes.find((q) => q.id === id))
    .filter((q): q is Quiz => q !== undefined && inRegion(q, region));
}

export function getForYouQuizzes(plays: Play[], region: Region): Quiz[] {
  const inRegionList = quizzes.filter((q) => inRegion(q, region));

  if (plays.length === 0) {
    const featured = getFeaturedQuizzes(region);
    const popular = getTopQuizzes(region, 4);
    const seen = new Set(featured.map((q) => q.id));
    return [...featured, ...popular.filter((q) => !seen.has(q.id))];
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

  const matched = inRegionList
    .filter((q) => topCategories.includes(q.category))
    .sort((a, b) => b.playCount - a.playCount);

  if (matched.length >= FOR_YOU_MIN_RESULTS) return matched;

  const padding = inRegionList
    .filter((q) => !matched.some((m) => m.id === q.id))
    .sort((a, b) => b.playCount - a.playCount)
    .slice(0, FOR_YOU_MIN_RESULTS - matched.length);

  return [...matched, ...padding];
}

export function filterQuizzes(
  filter: FilterId,
  plays: Play[],
  region: Region,
): Quiz[] {
  if (filter === "all") {
    return quizzes.filter((q) => inRegion(q, region));
  }
  if (filter === "for-you") {
    return getForYouQuizzes(plays, region);
  }
  if (filter === "top") {
    return getTopQuizzes(region, TOP_LIMIT);
  }
  if (filter === "featured") {
    return getFeaturedQuizzes(region);
  }
  return quizzes.filter(
    (q) => q.category === filter && inRegion(q, region),
  );
}
