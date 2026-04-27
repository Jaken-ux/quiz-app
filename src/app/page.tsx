"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";

import { quizzes } from "@/data/quizzes";
import { useUser } from "@/features/auth/use-user";
import { FormatPill } from "@/features/quiz/format-pill";
import { InterestTag } from "@/features/quiz/interest-tag";
import { usePlays } from "@/features/quiz/use-plays";
import { DIFFICULTY_LABEL, DIFFICULTY_PILL } from "@/lib/difficulty";
import {
  INTERESTS,
  INTEREST_ICON_BG,
  INTEREST_META,
  interestToSlug,
  primaryInterest,
} from "@/lib/interests";
import { pickRandomQuiz } from "@/lib/smart-random";
import { cn } from "@/lib/utils";
import type { Interest, Quiz } from "@/types/quiz";

const PEP_MESSAGES = [
  "Vad ska vi babba om idag?",
  "Redo att skämmas eller skina?",
  "Pinsamma fakta väntar 🤭",
  "Slumpa fram något kul 🎲",
  "Hur svensk är du egentligen?",
  "Dags att testa hjärnan.",
  "Quiz först, kaffe sen.",
];

const RECENT_LIMIT = 3;

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
  const [recent, setRecent] = useState<string[]>([]);
  const [filter, setFilter] = useState<Interest | "all">("all");
  const [filterOpen, setFilterOpen] = useState(false);
  const [whyOpen, setWhyOpen] = useState(false);

  const playedIds = useMemo(
    () => new Set(plays.map((p) => p.quizId)),
    [plays],
  );

  const userInterests = user?.interests ?? [];

  const browseList = useMemo(() => {
    if (filter === "all") return playableQuizzes;
    return playableQuizzes.filter((q) => q.interests.includes(filter));
  }, [playableQuizzes, filter]);

  const spin = () => {
    const next = pickRandomQuiz(playableQuizzes, {
      userInterests,
      excludeIds: recent,
    });
    if (!next) return;
    setRevealed(next);
    setRecent((prev) => {
      const updated = [next.id, ...prev.filter((id) => id !== next.id)];
      return updated.slice(0, RECENT_LIMIT);
    });
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
          isEmpty={noQuizzes}
          isPlayed={revealed ? playedIds.has(revealed.id) : false}
        />

        {userInterests.length > 0 && !noQuizzes && (
          <button
            type="button"
            onClick={() => setWhyOpen(true)}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 text-[11px] font-bold text-muted-foreground shadow-sm ring-1 ring-black/5 transition active:scale-95"
          >
            <span aria-hidden>✨</span>
            Anpassat efter dig
            <span
              aria-hidden
              className="flex size-4 items-center justify-center rounded-full bg-muted text-[10px] font-black text-muted-foreground"
            >
              ?
            </span>
          </button>
        )}
      </section>

      <InterestExploreSection
        userInterests={userInterests.length > 0 ? userInterests : INTERESTS}
        showAllPill
      />

      <section className="px-6 pt-7">
        <div className="flex items-end justify-between gap-2">
          <h2 className="text-lg font-extrabold text-dark">
            Eller bläddra själv
          </h2>
          <p className="shrink-0 text-xs font-bold text-muted-foreground">
            {browseList.length} quiz
          </p>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilterOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-extrabold text-dark shadow-sm ring-1 ring-black/5 transition active:scale-95"
          >
            <span aria-hidden>🎛️</span>
            {filter === "all" ? "Alla intressen" : INTEREST_META[filter].name}
          </button>
          {filter !== "all" && (
            <button
              type="button"
              onClick={() => setFilter("all")}
              className="text-xs font-bold text-muted-foreground underline-offset-2 hover:underline"
            >
              Rensa
            </button>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-2.5">
          {browseList.length === 0 ? (
            <p className="py-6 text-center text-sm font-medium text-muted-foreground">
              {noQuizzes
                ? "Roliga quiz är på väg — håll koll!"
                : "Inga quiz för det intresset än."}
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

      <FilterSheet
        open={filterOpen}
        active={filter}
        onClose={() => setFilterOpen(false)}
        onSelect={(value) => {
          setFilter(value);
          setFilterOpen(false);
        }}
      />

      <WhySheet
        open={whyOpen}
        onClose={() => setWhyOpen(false)}
        interests={userInterests}
      />
    </div>
  );
}

type RandomizerProps = {
  revealed: Quiz | null;
  onSpin: () => void;
  isEmpty: boolean;
  isPlayed: boolean;
};

function Randomizer({ revealed, onSpin, isEmpty, isPlayed }: RandomizerProps) {
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
                  <RevealedCard quiz={revealed} isPlayed={isPlayed} />
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

type RevealedCardProps = { quiz: Quiz; isPlayed: boolean };

function RevealedCard({ quiz, isPlayed }: RevealedCardProps) {
  const lead = primaryInterest(quiz.interests);
  const meta = INTEREST_META[lead];
  return (
    <div className="flex items-start gap-3">
      <div
        className={cn(
          "flex size-14 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-inner",
          INTEREST_ICON_BG[lead],
        )}
        aria-hidden
      >
        {meta.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          {quiz.interests.map((i) => (
            <InterestTag key={i} interest={i} />
          ))}
        </div>
        <h3 className="mt-1 text-base font-extrabold leading-tight text-dark">
          {quiz.title}
        </h3>
        <p className="mt-1 line-clamp-2 text-xs font-semibold text-muted-foreground">
          {quiz.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-[10px]">
          <FormatPill format={quiz.format} />
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2 py-0.5 font-bold",
              DIFFICULTY_PILL[quiz.difficulty],
            )}
          >
            {DIFFICULTY_LABEL[quiz.difficulty]}
          </span>
          {isPlayed && (
            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-2 py-0.5 font-bold text-emerald-800">
              ✓ Spelad
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

type InterestExploreSectionProps = {
  userInterests: Interest[];
  showAllPill: boolean;
};

function InterestExploreSection({
  userInterests,
  showAllPill,
}: InterestExploreSectionProps) {
  return (
    <section className="pt-7">
      <div className="flex items-baseline justify-between gap-2 px-6">
        <h2 className="text-lg font-extrabold text-dark">
          Utforska intressen
        </h2>
        <Link
          href="/intressen"
          className="text-xs font-extrabold text-primary underline-offset-2 transition active:scale-95 hover:underline"
        >
          Visa alla
        </Link>
      </div>
      <div className="mt-3 flex gap-2.5 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {userInterests.map((interest) => {
          const meta = INTEREST_META[interest];
          return (
            <Link
              key={interest}
              href={`/intresse/${interestToSlug(interest)}`}
              className={cn(
                "flex h-24 w-28 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl px-2 text-center shadow-sm ring-1 ring-black/5 transition active:scale-95",
                INTEREST_ICON_BG[interest],
              )}
            >
              <span className="text-2xl drop-shadow-sm" aria-hidden>
                {meta.emoji}
              </span>
              <span className="text-[11px] font-extrabold leading-tight text-dark">
                {meta.name}
              </span>
            </Link>
          );
        })}
        {showAllPill && (
          <Link
            href="/intressen"
            className="flex h-24 w-28 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl bg-white px-2 text-center shadow-sm ring-1 ring-dashed ring-black/15 transition active:scale-95"
          >
            <span className="text-2xl" aria-hidden>
              ➕
            </span>
            <span className="text-[11px] font-extrabold leading-tight text-muted-foreground">
              Visa alla
            </span>
          </Link>
        )}
      </div>
    </section>
  );
}

type CompactQuizRowProps = {
  quiz: Quiz;
  isPlayed: boolean;
};

function CompactQuizRow({ quiz, isPlayed }: CompactQuizRowProps) {
  const lead = primaryInterest(quiz.interests);
  const meta = INTEREST_META[lead];
  return (
    <Link
      href={`/quiz/${quiz.id}`}
      className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.99]"
    >
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl text-2xl shadow-inner",
          INTEREST_ICON_BG[lead],
        )}
        aria-hidden
      >
        {meta.emoji}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <InterestTag interest={lead} />
          <FormatPill format={quiz.format} showName={false} />
        </div>
        <h3 className="mt-0.5 truncate text-sm font-extrabold leading-tight text-dark">
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

type FilterSheetProps = {
  open: boolean;
  active: Interest | "all";
  onClose: () => void;
  onSelect: (value: Interest | "all") => void;
};

function FilterSheet({ open, active, onClose, onSelect }: FilterSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="filter-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            key="filter-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[85dvh] overflow-y-auto rounded-t-[2rem] bg-white px-6 pt-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.25)]"
          >
            <div
              aria-hidden
              className="mx-auto h-1.5 w-12 rounded-full bg-black/10"
            />
            <h3 className="mt-4 text-lg font-extrabold text-dark">
              Filtrera på intresse
            </h3>
            <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
              Välj ett intresse — eller visa allt.
            </p>

            <div className="mt-4 grid grid-cols-3 gap-2.5">
              <FilterOption
                label="Alla"
                emoji="✨"
                active={active === "all"}
                onClick={() => onSelect("all")}
                bg="bg-neutral-100"
              />
              {INTERESTS.map((interest) => {
                const meta = INTEREST_META[interest];
                return (
                  <FilterOption
                    key={interest}
                    label={meta.name}
                    emoji={meta.emoji}
                    active={active === interest}
                    onClick={() => onSelect(interest)}
                    bg={INTEREST_ICON_BG[interest]}
                  />
                );
              })}
            </div>

            <button
              type="button"
              onClick={onClose}
              className="mt-5 h-12 w-full rounded-2xl bg-neutral-100 text-sm font-extrabold text-dark transition active:scale-[0.98]"
            >
              Stäng
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

type FilterOptionProps = {
  label: string;
  emoji: string;
  active: boolean;
  onClick: () => void;
  bg: string;
};

function FilterOption({
  label,
  emoji,
  active,
  onClick,
  bg,
}: FilterOptionProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl p-2 text-center transition-all duration-150 active:scale-95",
        bg,
        active
          ? "shadow-[0_8px_18px_-8px_rgba(29,53,87,0.45)] ring-4 ring-primary/70 ring-offset-1 ring-offset-white"
          : "shadow-sm ring-1 ring-black/5",
      )}
    >
      <span className="text-2xl drop-shadow-sm" aria-hidden>
        {emoji}
      </span>
      <span className="text-[10px] font-extrabold leading-tight text-dark">
        {label}
      </span>
    </button>
  );
}

type WhySheetProps = {
  open: boolean;
  onClose: () => void;
  interests: Interest[];
};

function WhySheet({ open, onClose, interests }: WhySheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="why-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            key="why-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-white px-6 pt-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.25)]"
          >
            <div
              aria-hidden
              className="mx-auto h-1.5 w-12 rounded-full bg-black/10"
            />
            <h3 className="mt-4 text-lg font-extrabold text-dark">
              Hur vi väljer åt dig
            </h3>
            <p className="mt-2 text-sm font-medium text-muted-foreground">
              När du trycker <strong className="font-extrabold text-dark">Slumpa</strong>{" "}
              prioriterar vi quiz som matchar dina intressen — utan att låsa
              ute andra. Hittar vi inget i dina intressen får du något annat så
              du aldrig fastnar.
            </p>

            {interests.length > 0 && (
              <div className="mt-4">
                <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                  Dina intressen
                </p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {interests.map((i) => (
                    <span
                      key={i}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold",
                        INTEREST_ICON_BG[i],
                      )}
                    >
                      <span aria-hidden>{INTEREST_META[i].emoji}</span>
                      {INTEREST_META[i].name}
                    </span>
                  ))}
                </div>
                <p className="mt-3 text-xs font-medium text-muted-foreground">
                  Du kan ändra dem på{" "}
                  <Link
                    href="/profile"
                    className="font-extrabold text-dark underline underline-offset-2"
                  >
                    profilen
                  </Link>
                  .
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={onClose}
              className="mt-5 h-12 w-full rounded-2xl bg-neutral-100 text-sm font-extrabold text-dark transition active:scale-[0.98]"
            >
              Okej
            </button>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
