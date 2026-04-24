"use client";

import { useMemo, useState } from "react";

import { quizzes } from "@/data/quizzes";
import { useUser } from "@/features/auth/use-user";
import {
  CategoryChips,
  type CategoryFilter,
} from "@/features/quiz/category-chips";
import { QuizCard } from "@/features/quiz/quiz-card";

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

export default function HomePage() {
  const { user } = useUser();
  const [filter, setFilter] = useState<CategoryFilter>("all");

  const visible = useMemo(
    () =>
      filter === "all"
        ? quizzes
        : quizzes.filter((q) => q.category === filter),
    [filter],
  );

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
        <div className="flex items-end justify-between">
          <h2 className="text-xl font-extrabold text-dark">Utforska</h2>
          <p className="text-xs font-bold text-muted-foreground">
            {visible.length} quiz
          </p>
        </div>
        <CategoryChips
          active={filter}
          onChange={setFilter}
          className="mt-3"
        />
      </section>

      <section className="flex flex-col gap-4 px-6 pt-5 pb-4">
        {visible.length === 0 ? (
          <p className="py-8 text-center text-sm font-medium text-muted-foreground">
            Inga quiz i den här kategorin än.
          </p>
        ) : (
          visible.map((quiz) => <QuizCard key={quiz.id} quiz={quiz} />)
        )}
      </section>
    </div>
  );
}
