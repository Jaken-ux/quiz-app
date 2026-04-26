"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

import { quizzes } from "@/data/quizzes";
import { useUser } from "@/features/auth/use-user";
import {
  CategoryChips,
  type CategoryFilter,
} from "@/features/quiz/category-chips";
import {
  CATEGORY_EMOJI,
  CATEGORY_ICON_BG,
  CATEGORY_LABEL,
  DIFFICULTY_LABEL,
  DIFFICULTY_PILL,
} from "@/features/quiz/category-meta";
import { usePlays } from "@/features/quiz/use-plays";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/types/quiz";

const PEP_MESSAGES = [
  "Vad ska vi babba om idag?",
  "Redo att skämmas eller skina?",
  "Pinsamma fakta väntar 🤭",
  "Slumpa fram något kul 🎲",
  "Hur svensk är du egentligen?",
  "Dags att testa hjärnan.",
  "Quiz först, kaffe sen.",
];

function getPepMessage(): string {
  const idx = new Date().getDay();
  return PEP_MESSAGES[idx % PEP_MESSAGES.length];
}

export default function HomePage() {
  const { user } = useUser();
  const plays = usePlays();

  const playableQuizzes = useMemo(
    () => quizzes.filter((q) => q.questions.length > 0),
    [],
  );

  const [revealed, setRevealed] = useState<Quiz | null>(null);
  const [browseCategory, setBrowseCategory] =
    useState<CategoryFilter>("all");

  const playedIds = useMemo(
    () => new Set(plays.map((p) => p.quizId)),
    [plays],
  );

  const browseList = useMemo(() => {
    if (browseCategory === "all") return playableQuizzes;
    return playableQuizzes.filter((q) => q.category === browseCategory);
  }, [playableQuizzes, browseCategory]);

  const spin = () => {
    if (playableQuizzes.length === 0) return;
    if (playableQuizzes.length === 1) {
      setRevealed(playableQuizzes[0]);
      return;
    }
    let next: Quiz;
    do {
      next =
        playableQuizzes[
          Math.floor(Math.random() * playableQuizzes.length)
        ];
    } while (next.id === revealed?.id);
    setRevealed(next);
  };

  const noQuizzes = playableQuizzes.length === 0;

  return (
    <div className="flex flex-col">
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#E63946] via-[#EE5A6A] to-[#F06292] px-6 pt-[calc(env(safe-area-inset-top)+1.75rem)] pb-9">
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

        <div className="relative flex items-start gap-4">
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-[0.18em] text-white/85">
              Sveriges Roligaste Quiz
            </p>
            <h1 className="mt-1 truncate text-3xl font-extrabold text-white drop-shadow-sm">
              Hej {user?.username ?? "du där"}!
            </h1>
            <p className="mt-1 text-sm font-semibold text-white/95">
              {getPepMessage()}
            </p>
          </div>
          <div className="flex size-14 shrink-0 items-center justify-center rounded-full bg-white/25 text-3xl shadow ring-4 ring-white/40 backdrop-blur">
            {user?.avatar ?? "👋"}
          </div>
        </div>
      </header>

      <section className="px-6 pt-6">
        <Randomizer
          revealed={revealed}
          onSpin={spin}
          onPlay={() => {
            // navigation handled by Link
          }}
          isEmpty={noQuizzes}
          isPlayed={revealed ? playedIds.has(revealed.id) : false}
        />
      </section>

      <section className="px-6 pt-7">
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-lg font-extrabold text-dark">
            Eller bläddra själv
          </h2>
          <p className="shrink-0 text-xs font-bold text-muted-foreground">
            {browseList.length} quiz
          </p>
        </div>
        <CategoryChips
          active={browseCategory}
          onChange={(value) => {
            if (value === "all" || typeof value !== "string") {
              setBrowseCategory(value as CategoryFilter);
            } else {
              setBrowseCategory(value);
            }
          }}
          className="mt-3"
        />
        <div className="mt-4 flex flex-col gap-2.5">
          {browseList.length === 0 ? (
            <p className="py-6 text-center text-sm font-medium text-muted-foreground">
              {noQuizzes
                ? "Roliga quiz är på väg — håll koll!"
                : "Inga quiz i den kategorin än."}
            </p>
          ) : (
            browseList.map((quiz) => (
              <CompactQuizRow
                key={quiz.id}
                quiz={quiz}
                isPlayed={playedIds.has(quiz.id)}
              />
            ))
          )}
        </div>
      </section>

      <div className="pb-2" />
    </div>
  );
}

type RandomizerProps = {
  revealed: Quiz | null;
  onSpin: () => void;
  onPlay: () => void;
  isEmpty: boolean;
  isPlayed: boolean;
};

function Randomizer({
  revealed,
  onSpin,
  isEmpty,
  isPlayed,
}: RandomizerProps) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-amber-300 via-pink-400 to-purple-500 p-5 shadow-[0_18px_44px_-12px_rgba(168,85,247,0.55)]">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-10 -right-10 h-40 w-40 rounded-full bg-white/25 blur-2xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-6 bottom-2 h-28 w-28 rounded-full bg-white/15 blur-xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute right-6 top-3 size-2 rounded-full bg-white/70"
      />

      <div className="relative">
        <AnimatePresence mode="wait">
          {revealed && !isEmpty ? (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
              className="flex flex-col gap-4"
            >
              <p className="text-center text-[11px] font-black uppercase tracking-[0.2em] text-white/90">
                🎯 Det blev:
              </p>
              <AnimatePresence mode="wait">
                <motion.div
                  key={revealed.id}
                  initial={{ opacity: 0, y: 24, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16, scale: 0.94 }}
                  transition={{
                    type: "spring",
                    stiffness: 280,
                    damping: 22,
                  }}
                  className="rounded-2xl bg-white p-4 shadow-lg ring-1 ring-black/5"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={cn(
                        "flex size-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-inner",
                        CATEGORY_ICON_BG[revealed.category],
                      )}
                      aria-hidden
                    >
                      {CATEGORY_EMOJI[revealed.category]}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
                        {CATEGORY_LABEL[revealed.category]}
                      </p>
                      <h3 className="mt-0.5 text-base font-extrabold leading-tight text-dark">
                        {revealed.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-xs font-semibold text-muted-foreground">
                        {revealed.description}
                      </p>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
                        <span
                          className={cn(
                            "inline-flex items-center rounded-full px-2 py-0.5 font-bold",
                            DIFFICULTY_PILL[revealed.difficulty],
                          )}
                        >
                          {DIFFICULTY_LABEL[revealed.difficulty]}
                        </span>
                        <span className="font-semibold text-muted-foreground">
                          📝 {revealed.questionCount} frågor
                        </span>
                        {isPlayed && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
                            ✓ Spelad
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>

              <div className="flex gap-2">
                <Link
                  href={`/quiz/${revealed.id}`}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-dark shadow-md transition-transform active:scale-[0.97]"
                >
                  Kör det här
                </Link>
                <button
                  type="button"
                  onClick={onSpin}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-2xl bg-white/25 text-sm font-extrabold text-white shadow-sm ring-1 ring-white/30 backdrop-blur transition-transform active:scale-[0.97]"
                >
                  <span aria-hidden>🎲</span> Slumpa annat
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col items-center gap-3 py-2 text-center"
            >
              <motion.div
                animate={
                  isEmpty
                    ? { scale: 1 }
                    : { rotate: [0, 8, -8, 6, -6, 0], scale: [1, 1.06, 1] }
                }
                transition={{
                  duration: 2.6,
                  repeat: isEmpty ? 0 : Infinity,
                  ease: "easeInOut",
                }}
                className="text-7xl drop-shadow"
                aria-hidden
              >
                🎲
              </motion.div>
              <h2 className="text-2xl font-extrabold text-white drop-shadow-sm">
                Slumpa ett quiz
              </h2>
              <p className="text-xs font-semibold text-white/90">
                {isEmpty
                  ? "Roliga quiz fylls på snart."
                  : "Tryck och få något kul."}
              </p>
              <button
                type="button"
                onClick={onSpin}
                disabled={isEmpty}
                className="mt-1 h-12 rounded-2xl bg-white px-8 text-base font-extrabold text-dark shadow-lg transition-transform active:scale-[0.97] disabled:cursor-default disabled:opacity-60 disabled:shadow-none"
              >
                {isEmpty ? "Inga quiz än" : "Slumpa nu"}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

type CompactQuizRowProps = {
  quiz: Quiz;
  isPlayed: boolean;
};

function CompactQuizRow({ quiz, isPlayed }: CompactQuizRowProps) {
  return (
    <Link
      href={`/quiz/${quiz.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.99]"
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl shadow-inner",
          CATEGORY_ICON_BG[quiz.category],
        )}
        aria-hidden
      >
        {CATEGORY_EMOJI[quiz.category]}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
          {CATEGORY_LABEL[quiz.category]}
        </p>
        <h3 className="truncate text-sm font-extrabold leading-tight text-dark">
          {quiz.title}
        </h3>
        <p className="text-[10px] font-semibold text-muted-foreground">
          {quiz.questionCount} frågor
        </p>
      </div>
      {isPlayed && (
        <span
          aria-label="Du har spelat"
          className="flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-black text-white shadow-sm"
        >
          ✓
        </span>
      )}
    </Link>
  );
}
