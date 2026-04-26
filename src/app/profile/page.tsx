"use client";

import { useMemo, useSyncExternalStore } from "react";

import { useUser } from "@/features/auth/use-user";
import {
  CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_ICON_BG,
  CATEGORY_LABEL,
} from "@/features/quiz/category-meta";
import { useRatings } from "@/features/training/use-ratings";
import {
  getLevelProgress,
  getRatingLevel,
  getRatingLevelDisplay,
} from "@/lib/rating";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/quiz";
import type { CategoryRating } from "@/types/training";

function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "nyligen";
  }
}

export default function ProfilePage() {
  const { user } = useUser();
  const { ratings } = useRatings();
  const mounted = useHasMounted();

  const sortedRatings = useMemo(() => {
    if (!ratings) return null;
    const list: CategoryRating[] = CATEGORIES.map((cat) => ratings[cat]);
    // Played first (sorted by rating desc), then unplayed.
    const played = list
      .filter((r) => r.gamesPlayed > 0)
      .sort((a, b) => b.rating - a.rating);
    const unplayed = list.filter((r) => r.gamesPlayed === 0);
    return [...played, ...unplayed];
  }, [ratings]);

  return (
    <div className="flex min-h-full flex-col pb-6">
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#1D3557] via-[#2C5282] to-[#E63946] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-6 -right-6 h-40 w-40 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-10 bottom-6 size-3 rounded-full bg-white/50"
        />

        <div className="relative flex flex-col items-center text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-white/25 text-6xl shadow-lg ring-4 ring-white/40 backdrop-blur">
            {user?.avatar ?? "👤"}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-white drop-shadow-sm">
            {user?.username ?? "Spelare"}
          </h1>
          {mounted && user && (
            <p className="mt-1 text-xs font-semibold text-white/90">
              Medlem sedan {formatDate(user.createdAt)}
            </p>
          )}
        </div>
      </header>

      <section className="px-6 pt-6">
        <h2 className="text-lg font-extrabold text-dark">Mina ratings</h2>
        <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
          Rör sig upp och ner när du tränar.
        </p>

        {!sortedRatings ? (
          <div className="mt-3 flex flex-col gap-3">
            {CATEGORIES.map((cat) => (
              <div
                key={cat}
                className="h-[88px] rounded-2xl bg-white/60 ring-1 ring-black/5"
              />
            ))}
          </div>
        ) : (
          <div className="mt-3 flex flex-col gap-3">
            {sortedRatings.map((r) => (
              <RatingRow key={r.category} entry={r} />
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-col items-center gap-3 px-6 pt-10 pb-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
          🚧
        </div>
        <p className="text-sm font-semibold text-dark">
          Inställningar, vänner och topplistor är på väg hit.
        </p>
      </div>
    </div>
  );
}

type RatingRowProps = {
  entry: CategoryRating;
};

function RatingRow({ entry }: RatingRowProps) {
  const played = entry.gamesPlayed > 0;
  const level = played ? getRatingLevel(entry.rating) : null;
  const display = level ? getRatingLevelDisplay(level) : null;
  const progress = played ? getLevelProgress(entry.rating) : 0;
  const cat: Category = entry.category;

  return (
    <div
      className={cn(
        "rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5",
        !played && "opacity-75",
      )}
    >
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-inner",
            CATEGORY_ICON_BG[cat],
          )}
          aria-hidden
        >
          {CATEGORY_EMOJI[cat]}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-extrabold text-dark">
            {CATEGORY_LABEL[cat]}
          </p>
          {played && display ? (
            <p
              className="text-[11px] font-bold leading-tight"
              style={{ color: display.color }}
            >
              {display.name} <span aria-hidden>{display.emoji}</span> ·{" "}
              <span className="text-muted-foreground">
                {entry.gamesPlayed}{" "}
                {entry.gamesPlayed === 1 ? "session" : "sessioner"}
              </span>
            </p>
          ) : (
            <p className="text-[11px] font-semibold text-muted-foreground">
              Inte spelat ännu
            </p>
          )}
        </div>
        {played && display ? (
          <div className="text-right">
            <p
              className="text-2xl font-black tabular-nums leading-none"
              style={{ color: display.color }}
            >
              {entry.rating}
            </p>
          </div>
        ) : (
          <div className="text-right">
            <p className="text-base font-bold text-muted-foreground">—</p>
          </div>
        )}
      </div>

      {played && display && (
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-black/5">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress * 100}%`,
              backgroundColor: display.color,
            }}
          />
        </div>
      )}
    </div>
  );
}
