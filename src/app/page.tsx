"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useUser } from "@/features/auth/use-user";
import { CATEGORY_LABEL } from "@/features/quiz/category-meta";
import { CategoryChips } from "@/features/quiz/category-chips";
import { CollectionChips } from "@/features/quiz/collection-chips";
import {
  type FilterId,
  filterQuizzes,
  isCategoryFilter,
  isCollectionId,
} from "@/features/quiz/collections";
import { QuizCard } from "@/features/quiz/quiz-card";
import { usePlays } from "@/features/quiz/use-plays";
import { useRatings } from "@/features/training/use-ratings";
import {
  getRatingLevel,
  getRatingLevelDisplay,
} from "@/lib/rating";

const PEP_MESSAGES = [
  "Redo för dagens utmaning?",
  "Vad ska vi spela idag?",
  "Dags att knipa en topplacering!",
  "Nya frågor väntar 🎯",
  "Hur smart känner du dig idag?",
  "Ett snabbt quiz innan kaffe?",
  "Dags att visa vad du kan 💪",
];

function getPepMessage(): string {
  const idx = new Date().getDay();
  return PEP_MESSAGES[idx % PEP_MESSAGES.length];
}

function sectionHeading(filter: FilterId): string {
  if (filter === "all") return "Utforska";
  if (filter === "for-you") return "För dig";
  if (filter === "top") return "Hetast just nu";
  if (filter === "featured") return "Utvalda av oss";
  return CATEGORY_LABEL[filter];
}

function sectionSubline(filter: FilterId): string | null {
  if (filter === "for-you") return "Baserat på det du spelar.";
  if (filter === "top") return "Mest gillade just nu.";
  if (filter === "featured") return "Handplockade av oss.";
  return null;
}

export default function HomePage() {
  const { user } = useUser();
  const plays = usePlays();
  const { ratings } = useRatings();
  const [filter, setFilter] = useState<FilterId>("all");

  const visible = useMemo(
    () => filterQuizzes(filter, plays),
    [filter, plays],
  );

  const playedIds = useMemo(
    () => new Set(plays.map((p) => p.quizId)),
    [plays],
  );

  const topRating = useMemo(() => {
    if (!ratings) return null;
    const played = Object.values(ratings).filter((r) => r.gamesPlayed > 0);
    if (played.length === 0) return null;
    return played.reduce((best, r) => (r.rating > best.rating ? r : best));
  }, [ratings]);

  const activeCategory =
    filter === "all"
      ? "all"
      : isCategoryFilter(filter)
        ? filter
        : null;
  const activeCollection = isCollectionId(filter) ? filter : null;

  const heading = sectionHeading(filter);
  const subline = sectionSubline(filter);

  return (
    <div className="flex flex-col">
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#E63946] via-[#EE5A6A] to-[#F06292] px-6 pt-[calc(env(safe-area-inset-top)+1.75rem)] pb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-4 bottom-2 h-24 w-24 rounded-full bg-[#FFB703]/30 blur-xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-8 top-6 size-3 rounded-full bg-white/70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-20 top-16 size-2 rounded-full bg-white/50"
        />

        <div className="relative flex items-center gap-4">
          <div className="flex size-16 shrink-0 items-center justify-center rounded-full bg-white/25 text-4xl shadow-lg ring-4 ring-white/40 backdrop-blur">
            {user?.avatar ?? "👋"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/80">
              Välkommen tillbaka
            </p>
            <h1 className="truncate text-2xl font-extrabold text-white drop-shadow-sm">
              Hej {user?.username ?? "spelare"}!
            </h1>
            <p className="mt-0.5 text-sm font-semibold text-white/95">
              {getPepMessage()}
            </p>
          </div>
        </div>
      </header>

      <section className="px-6 pt-5">
        <Link
          href="/traning"
          className="block rounded-3xl transition-transform active:scale-[0.99]"
        >
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-500 via-teal-500 to-emerald-500 p-5 shadow-[0_14px_32px_-10px_rgba(14,165,233,0.5)]">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-6 -right-6 h-28 w-28 rounded-full bg-white/20 blur-xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute left-6 bottom-4 size-3 rounded-full bg-white/50"
            />
            <div className="relative">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur">
                💪 Träningsläge
              </div>
              <h2 className="mt-3 text-xl font-extrabold leading-tight text-white drop-shadow-sm">
                Pusha din kunskap
              </h2>
              <p className="mt-1 text-sm font-semibold text-white/95">
                Random frågor i den kategori du vill öva på. Räknas inte
                officiellt — du följer din kunskap istället.
              </p>
              {ratings && (
                <p className="mt-3 text-[11px] font-semibold text-white/85">
                  {topRating
                    ? (() => {
                        const level = getRatingLevel(topRating.rating);
                        const display = getRatingLevelDisplay(level);
                        return (
                          <>
                            Din topprating: {topRating.rating} i{" "}
                            {CATEGORY_LABEL[topRating.category]} ·{" "}
                            {display.name} {display.emoji}
                          </>
                        );
                      })()
                    : "Spela din första session för att få en rating"}
                </p>
              )}
              <div className="mt-4 flex h-11 items-center justify-center rounded-xl bg-white text-sm font-extrabold text-dark shadow-md">
                Starta träning
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section className="px-6 pt-7">
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <h2 className="truncate text-xl font-extrabold text-dark">
              {heading}
            </h2>
            {subline && (
              <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                {subline}
              </p>
            )}
          </div>
          <p className="shrink-0 text-xs font-bold text-muted-foreground">
            {visible.length} quiz
          </p>
        </div>

        <CategoryChips
          active={activeCategory}
          onChange={setFilter}
          className="mt-3"
        />
        <CollectionChips
          active={activeCollection}
          onChange={setFilter}
          className="mt-2"
        />
      </section>

      <section className="flex flex-col gap-4 px-6 pt-5 pb-4">
        {visible.length === 0 ? (
          <p className="py-8 text-center text-sm font-medium text-muted-foreground">
            Inga quiz här än.
          </p>
        ) : (
          visible.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              isPlayed={playedIds.has(quiz.id)}
            />
          ))
        )}
      </section>
    </div>
  );
}
