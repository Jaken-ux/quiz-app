"use client";

import { useMemo, useSyncExternalStore } from "react";

import { useUser } from "@/features/auth/use-user";
import { readPlays } from "@/features/quiz/use-plays";
import { BADGES } from "@/features/stats/badges";
import {
  XP_PER_LEVEL_CONST,
  computeStats,
} from "@/features/stats/compute-stats";
import {
  INTERESTS,
  INTEREST_ACCENT_BAR,
  INTEREST_ICON_BG,
  INTEREST_META,
} from "@/lib/interests";
import { cn } from "@/lib/utils";

function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type Tier = "minimal" | "growing" | "full";

function tierFor(totalPlays: number): Tier {
  if (totalPlays >= 10) return "full";
  if (totalPlays >= 3) return "growing";
  return "minimal";
}

export default function StatsPage() {
  const { user } = useUser();
  const mounted = useHasMounted();

  const plays = useMemo(() => (mounted ? readPlays() : []), [mounted]);
  const stats = useMemo(() => computeStats(plays), [plays]);
  const tier = tierFor(stats.totalPlays);

  const badgeStates = useMemo(
    () =>
      BADGES.map((b) => ({
        ...b,
        earned: mounted && b.isEarned(plays, stats),
      })),
    [mounted, plays, stats],
  );
  const earnedCount = badgeStates.filter((b) => b.earned).length;

  const xpProgress = Math.min(
    100,
    (stats.xpForLevel / XP_PER_LEVEL_CONST) * 100,
  );

  return (
    <div className="flex flex-col pb-6">
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#1D3557] via-[#7C3AED] to-[#EC4899] px-6 pt-[calc(env(safe-area-inset-top)+1.75rem)] pb-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-10 top-20 size-3 rounded-full bg-white/60"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-16 bottom-10 size-4 rounded-full bg-[#FCD34D]/60"
        />

        <div className="relative flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/80">
              {tier === "minimal" ? "Välkommen" : "Din nivå"}
            </p>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-6xl font-black leading-none text-white drop-shadow-sm">
                {stats.level}
              </span>
              <span className="text-lg font-extrabold text-white/90">LVL</span>
            </div>
            <p className="mt-1 text-sm font-bold text-white">
              {stats.rankTitle}
            </p>
          </div>
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/25 text-4xl shadow-lg ring-4 ring-white/40 backdrop-blur">
            {user?.avatar ?? "🎮"}
          </div>
        </div>

        {tier !== "minimal" && (
          <div className="relative mt-5">
            <div className="flex items-baseline justify-between text-[11px] font-black tabular-nums text-white/90">
              <span>{stats.xpForLevel} XP</span>
              <span>{XP_PER_LEVEL_CONST} XP</span>
            </div>
            <div className="mt-1 h-2.5 overflow-hidden rounded-full bg-white/25">
              <div
                className="h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.6)] transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="mt-2 text-xs font-semibold text-white/90">
              {stats.xpToNextLevel} XP till Level {stats.level + 1}
            </p>
          </div>
        )}
      </header>

      <div className="flex flex-col gap-5 px-6 pt-5">
        {tier === "minimal" && (
          <MinimalView totalPlays={stats.totalPlays} />
        )}

        {tier !== "minimal" && (
          <>
            <section className="flex items-center gap-4 rounded-3xl bg-white p-5 shadow-[0_8px_28px_-10px_rgba(29,53,87,0.18)] ring-1 ring-black/5">
              <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-300 to-rose-400 text-3xl shadow-inner">
                🔥
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-2xl font-extrabold tabular-nums text-dark">
                  {stats.streakDays}{" "}
                  {stats.streakDays === 1 ? "dag" : "dagar"}
                </p>
                <p className="text-xs font-semibold text-muted-foreground">
                  {stats.streakDays === 0
                    ? "Spela idag och starta en streak!"
                    : "Fortsätt spela för att hålla den vid liv."}
                </p>
              </div>
            </section>

            <section className="grid grid-cols-2 gap-3">
              <StatTile
                emoji="🏆"
                label="Total poäng"
                value={stats.totalScore.toLocaleString("sv-SE")}
              />
              <StatTile
                emoji="⭐"
                label="Bästa spel"
                value={stats.bestScore.toLocaleString("sv-SE")}
              />
              <StatTile
                emoji="🎮"
                label="Spelade"
                value={String(stats.totalPlays)}
              />
              <StatTile
                emoji="🎯"
                label="Träffsäkerhet"
                value={
                  stats.totalAnswers > 0
                    ? `${Math.round(stats.accuracy * 100)}%`
                    : "—"
                }
              />
            </section>
          </>
        )}

        {tier === "full" && (
          <section className="rounded-3xl bg-white p-5 shadow-[0_8px_28px_-10px_rgba(29,53,87,0.18)] ring-1 ring-black/5">
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-extrabold text-dark">Intressen</h3>
              <p className="text-[11px] font-bold text-muted-foreground">
                {stats.uniqueInterestCount}/{INTERESTS.length} utforskade
              </p>
            </div>
            <div className="mt-4 flex flex-col gap-3.5">
              {INTERESTS.map((interest) => {
                const m = stats.perInterest[interest];
                const meta = INTEREST_META[interest];
                const hasPlays = m.plays > 0;
                const pct = m.accuracy * 100;
                return (
                  <div key={interest} className="flex items-center gap-3">
                    <div
                      className={cn(
                        "flex size-11 shrink-0 items-center justify-center rounded-xl text-xl shadow-inner",
                        INTEREST_ICON_BG[interest],
                      )}
                      aria-hidden
                    >
                      {meta.emoji}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-baseline justify-between gap-2">
                        <p className="truncate text-sm font-bold text-dark">
                          {meta.name}
                        </p>
                        <p className="text-[11px] font-black tabular-nums text-muted-foreground">
                          {hasPlays ? `${Math.round(pct)}%` : "oprövad"}
                        </p>
                      </div>
                      <div className="mt-1 h-2 overflow-hidden rounded-full bg-black/5">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-500",
                            INTEREST_ACCENT_BAR[interest],
                          )}
                          style={{
                            width: `${hasPlays ? Math.max(pct, 4) : 0}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {tier !== "minimal" && (
          <section>
            <div className="flex items-baseline justify-between">
              <h3 className="text-lg font-extrabold text-dark">Utmärkelser</h3>
              <p className="text-[11px] font-bold text-muted-foreground">
                {earnedCount} av {BADGES.length} upplåsta
              </p>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {badgeStates.map((badge) => (
                <div
                  key={badge.id}
                  className={cn(
                    "flex flex-col items-center rounded-2xl p-3 text-center",
                    badge.earned
                      ? "bg-white shadow-[0_6px_20px_-8px_rgba(29,53,87,0.25)] ring-1 ring-black/5"
                      : "bg-white/60 ring-1 ring-black/5",
                  )}
                >
                  <div
                    className={cn(
                      "flex size-14 items-center justify-center rounded-2xl text-3xl shadow-inner",
                      badge.earned
                        ? "bg-gradient-to-br from-amber-100 to-amber-200"
                        : "bg-neutral-100",
                    )}
                    aria-hidden
                  >
                    <span
                      className={cn(!badge.earned && "grayscale opacity-40")}
                    >
                      {badge.earned ? badge.emoji : "🔒"}
                    </span>
                  </div>
                  <p
                    className={cn(
                      "mt-2 text-[11px] font-black leading-tight",
                      badge.earned ? "text-dark" : "text-muted-foreground",
                    )}
                  >
                    {badge.label}
                  </p>
                  <p className="mt-0.5 text-[10px] font-medium leading-tight text-muted-foreground">
                    {badge.description}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {tier === "full" && (
          <section>
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D3557] via-[#2C5282] to-[#7C3AED] p-5 text-white shadow-[0_10px_28px_-10px_rgba(29,53,87,0.4)]">
              <div
                aria-hidden
                className="pointer-events-none absolute -bottom-4 -right-4 h-28 w-28 rounded-full bg-white/10 blur-xl"
              />
              <div className="relative flex items-center gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-white/20 text-3xl backdrop-blur">
                  🌐
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white/70">
                    Din globala placering
                  </p>
                  <p className="mt-0.5 text-2xl font-black tabular-nums">
                    #{stats.mockRank.toLocaleString("sv-SE")}
                  </p>
                  <p className="text-xs font-semibold text-white/90">
                    av {stats.mockTotalPlayers.toLocaleString("sv-SE")} spelare
                  </p>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

type MinimalViewProps = { totalPlays: number };

function MinimalView({ totalPlays }: MinimalViewProps) {
  return (
    <section className="rounded-3xl bg-white p-6 text-center shadow-[0_8px_28px_-10px_rgba(29,53,87,0.18)] ring-1 ring-black/5">
      <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-200 to-pink-300 text-4xl shadow-inner">
        🌱
      </div>
      <h3 className="mt-3 text-xl font-extrabold text-dark">
        {totalPlays === 0
          ? "Här växer din statistik"
          : "Bra start! Fortsätt så."}
      </h3>
      <p className="mt-1 text-sm font-medium text-muted-foreground">
        {totalPlays === 0
          ? "Spela ett quiz så börjar vi räkna XP, streaks och utmärkelser."
          : `Du har spelat ${totalPlays} quiz. Spela ${
              3 - totalPlays
            } till så låser vi upp mer statistik.`}
      </p>
    </section>
  );
}

type StatTileProps = {
  emoji: string;
  label: string;
  value: string;
};

function StatTile({ emoji, label, value }: StatTileProps) {
  return (
    <div className="rounded-2xl bg-white p-3.5 shadow-[0_6px_20px_-10px_rgba(29,53,87,0.18)] ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        <span className="text-lg" aria-hidden>
          {emoji}
        </span>
        <p className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
      </div>
      <p className="mt-1.5 text-2xl font-extrabold tabular-nums text-dark">
        {value}
      </p>
    </div>
  );
}
