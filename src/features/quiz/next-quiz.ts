import type { Difficulty, Quiz } from "@/types/quiz";

export type NextReason = "harder" | "same" | "easier" | "explore";

export type NextSuggestion = {
  quiz: Quiz;
  reason: NextReason;
};

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const FEATURED_FALLBACK = ["harry-potter", "sagan-om-ringen", "marvel"];

export function pickNextQuiz(
  current: Quiz,
  accuracy: number,
  pool: Quiz[],
): NextSuggestion | null {
  const playable = pool.filter(
    (q) => q.questions.length > 0 && q.id !== current.id,
  );
  if (playable.length === 0) return null;

  const sharedInterest = playable.filter((q) =>
    q.interests.some((i) => current.interests.includes(i)),
  );
  const currentIdx = DIFFICULTIES.indexOf(current.difficulty);

  let preferred: Difficulty;
  let reason: NextReason;
  if (accuracy >= 0.7) {
    preferred = DIFFICULTIES[Math.min(currentIdx + 1, DIFFICULTIES.length - 1)];
    reason = "harder";
  } else if (accuracy < 0.4) {
    preferred = DIFFICULTIES[Math.max(currentIdx - 1, 0)];
    reason = "easier";
  } else {
    preferred = current.difficulty;
    reason = "same";
  }

  // 1) Shared interest, preferred difficulty.
  const exact = sharedInterest.find((q) => q.difficulty === preferred);
  if (exact) return { quiz: exact, reason };

  // 2) Shared interest, closest available difficulty.
  if (sharedInterest.length > 0) {
    const sorted = [...sharedInterest].sort((a, b) => {
      const da = Math.abs(DIFFICULTIES.indexOf(a.difficulty) - currentIdx);
      const db = Math.abs(DIFFICULTIES.indexOf(b.difficulty) - currentIdx);
      return da - db;
    });
    return { quiz: sorted[0], reason: "same" };
  }

  // 3) Featured cross-category fallback.
  for (const id of FEATURED_FALLBACK) {
    const featured = playable.find((q) => q.id === id);
    if (featured) return { quiz: featured, reason: "explore" };
  }

  // 4) Most popular remaining.
  const popular = [...playable].sort((a, b) => b.playCount - a.playCount);
  return { quiz: popular[0], reason: "explore" };
}

export function reasonLabel(reason: NextReason): { label: string; emoji: string } {
  switch (reason) {
    case "harder":
      return { label: "Nivå upp", emoji: "🔥" };
    case "easier":
      return { label: "Något lättare", emoji: "🌱" };
    case "same":
      return { label: "Mer av samma", emoji: "🎯" };
    case "explore":
      return { label: "Utforska något nytt", emoji: "✨" };
  }
}
