import type { Interest, Quiz } from "@/types/quiz";

export type PickRandomOptions = {
  /** When set, pick only quiz tagged with this interest (no fallback). */
  onlyInterest?: Interest;
  /** User's chosen interests; used for soft weighting (overlap preferred). */
  userInterests?: Interest[];
  /** Quiz IDs to avoid repeating (e.g. recently shown). */
  excludeIds?: string[];
};

/**
 * Pick a random quiz. Two modes:
 *
 * - `onlyInterest`: hard-scope to a single interest. Used by interest
 *   landing pages — never falls back to other interests.
 * - default: soft-weight by overlap with `userInterests`, falling back
 *   to the whole pool if nothing matches. Used by the home randomizer.
 *
 * In both modes, `excludeIds` is treated as best-effort — if everything
 * is excluded, ignore the list rather than return null.
 */
export function pickRandomQuiz(
  allQuizzes: Quiz[],
  options: PickRandomOptions = {},
): Quiz | null {
  const { onlyInterest, userInterests = [], excludeIds = [] } = options;
  const playable = allQuizzes.filter((q) => q.questionPool.length > 0);
  if (playable.length === 0) return null;

  const exclude = new Set(excludeIds);

  if (onlyInterest) {
    const scoped = playable.filter((q) => q.interests.includes(onlyInterest));
    if (scoped.length === 0) return null;
    const fresh = scoped.filter((q) => !exclude.has(q.id));
    return pickOne(fresh.length > 0 ? fresh : scoped);
  }

  const fresh = playable.filter((q) => !exclude.has(q.id));
  const pool = fresh.length > 0 ? fresh : playable;
  const userSet = new Set(userInterests);

  if (userSet.size > 0) {
    const matching = pool.filter((q) =>
      q.interests.some((i) => userSet.has(i)),
    );
    if (matching.length > 0) {
      return pickOne(matching);
    }
  }

  return pickOne(pool);
}

function pickOne<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
