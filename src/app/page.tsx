"use client";

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
  const [filter, setFilter] = useState<FilterId>("all");

  const visible = useMemo(
    () => filterQuizzes(filter, plays),
    [filter, plays],
  );

  const playedIds = useMemo(
    () => new Set(plays.map((p) => p.quizId)),
    [plays],
  );

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
