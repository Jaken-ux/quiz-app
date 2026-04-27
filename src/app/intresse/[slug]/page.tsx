"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
import { use, useMemo } from "react";

import { quizzes } from "@/data/quizzes";
import { FormatPill } from "@/features/quiz/format-pill";
import { InterestTag } from "@/features/quiz/interest-tag";
import { usePlays } from "@/features/quiz/use-plays";
import {
  DIFFICULTY_LABEL,
  DIFFICULTY_PILL,
} from "@/lib/difficulty";
import { FORMATS, FORMAT_META } from "@/lib/formats";
import {
  INTEREST_BLURB,
  INTEREST_BUTTON_BG,
  INTEREST_HERO_DARK_TEXT,
  INTEREST_HERO_GRADIENT,
  INTEREST_ICON_BG,
  INTEREST_META,
  primaryInterest,
  slugToInterest,
} from "@/lib/interests";
import { pickRandomQuiz } from "@/lib/smart-random";
import { cn } from "@/lib/utils";
import type { Interest, Quiz, QuizFormat } from "@/types/quiz";

type PageParams = { slug: string };

export default function InterestLandingPage({
  params,
}: {
  params: Promise<PageParams>;
}) {
  const { slug } = use(params);
  const interest = slugToInterest(slug);
  if (!interest) {
    notFound();
  }

  return <InterestLanding interest={interest} />;
}

type InterestLandingProps = { interest: Interest };

function InterestLanding({ interest }: InterestLandingProps) {
  const router = useRouter();
  const plays = usePlays();
  const meta = INTEREST_META[interest];
  const blurb = INTEREST_BLURB[interest];
  const darkText = INTEREST_HERO_DARK_TEXT[interest];

  const quizzesInInterest = useMemo(
    () =>
      quizzes
        .filter((q) => q.interests.includes(interest))
        .sort((a, b) => b.playCount - a.playCount),
    [interest],
  );

  const playableInInterest = useMemo(
    () => quizzesInInterest.filter((q) => q.questions.length > 0),
    [quizzesInInterest],
  );

  const totalPlays = useMemo(
    () => quizzesInInterest.reduce((sum, q) => sum + q.playCount, 0),
    [quizzesInInterest],
  );

  const playedIds = useMemo(
    () => new Set(plays.map((p) => p.quizId)),
    [plays],
  );

  const byFormat = useMemo(() => {
    const groups: Partial<Record<QuizFormat, Quiz[]>> = {};
    for (const q of quizzesInInterest) {
      const arr = groups[q.format] ?? [];
      arr.push(q);
      groups[q.format] = arr;
    }
    return groups;
  }, [quizzesInInterest]);

  const handleSpin = () => {
    const next = pickRandomQuiz(quizzes, { onlyInterest: interest });
    if (!next) return;
    router.push(`/quiz/${next.id}`);
  };

  const heroTextColor = darkText ? "text-dark" : "text-white";
  const heroSubColor = darkText ? "text-dark/70" : "text-white/90";
  const heroBackPill = darkText
    ? "bg-white/85 text-dark"
    : "bg-white/25 text-white backdrop-blur";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col pb-8"
    >
      <header
        className={cn(
          "relative overflow-hidden rounded-b-[2.5rem] px-6 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-10",
          INTEREST_HERO_GRADIENT[interest],
        )}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/20 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -left-6 bottom-2 h-28 w-28 rounded-full bg-white/15 blur-xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-12 top-16 size-3 rounded-full bg-white/60"
        />

        <button
          type="button"
          onClick={() => router.back()}
          className={cn(
            "relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-bold shadow-sm transition-transform active:scale-95",
            heroBackPill,
          )}
          aria-label="Tillbaka"
        >
          <ArrowLeft className="size-4" />
          Tillbaka
        </button>

        <div className="relative mt-6 flex flex-col items-center text-center">
          <div
            className={cn(
              "flex size-20 items-center justify-center rounded-3xl text-5xl shadow-lg ring-4",
              darkText
                ? "bg-white/70 ring-white/60"
                : "bg-white/25 ring-white/40 backdrop-blur",
            )}
            aria-hidden
          >
            {meta.emoji}
          </div>
          <h1
            className={cn(
              "mt-4 text-3xl font-extrabold leading-tight drop-shadow-sm",
              heroTextColor,
            )}
          >
            {meta.name}
          </h1>
          <p
            className={cn(
              "mt-2 max-w-[300px] text-sm font-semibold",
              heroSubColor,
            )}
          >
            {blurb}
          </p>
          <p
            className={cn(
              "mt-4 text-[11px] font-black uppercase tracking-widest tabular-nums",
              heroSubColor,
            )}
          >
            {quizzesInInterest.length}{" "}
            {quizzesInInterest.length === 1 ? "quiz" : "quiz"} ·{" "}
            {totalPlays.toLocaleString("sv-SE")} har spelat
          </p>
        </div>
      </header>

      <section className="px-6 pt-6">
        {playableInInterest.length === 0 ? (
          <div className="rounded-3xl bg-amber-50 p-5 text-center ring-1 ring-amber-200">
            <p className="text-sm font-extrabold text-amber-900">
              Inga quiz här ännu — kommer snart!
            </p>
          </div>
        ) : (
          <button
            type="button"
            onClick={handleSpin}
            className={cn(
              "flex h-14 w-full items-center justify-center gap-2 rounded-2xl text-base font-extrabold text-white shadow-[0_12px_28px_-8px_rgba(29,53,87,0.45)] transition-all active:scale-[0.98]",
              INTEREST_BUTTON_BG[interest],
            )}
          >
            <span aria-hidden>🎲</span>
            Slumpa från {meta.name}
          </button>
        )}
      </section>

      {FORMATS.map((format) => {
        const list = byFormat[format];
        if (!list || list.length === 0) return null;
        return (
          <FormatSection
            key={format}
            format={format}
            quizzes={list}
            playedIds={playedIds}
            interest={interest}
          />
        );
      })}

      {quizzesInInterest.length > 0 && (
        <section className="px-6 pt-8">
          <h2 className="text-lg font-extrabold text-dark">Alla quiz</h2>
          <div className="mt-3 flex flex-col gap-2.5">
            {quizzesInInterest.map((quiz) => (
              <FullQuizRow
                key={quiz.id}
                quiz={quiz}
                isPlayed={playedIds.has(quiz.id)}
              />
            ))}
          </div>
        </section>
      )}

      <section className="mt-8 flex items-center justify-center gap-5 px-6 text-xs font-bold text-muted-foreground">
        <Link href="/" className="underline-offset-2 hover:underline">
          Tillbaka till hem
        </Link>
        <span aria-hidden className="text-muted-foreground/40">
          ·
        </span>
        <Link
          href="/intressen"
          className="underline-offset-2 hover:underline"
        >
          Utforska andra intressen
        </Link>
      </section>
    </motion.div>
  );
}

type FormatSectionProps = {
  format: QuizFormat;
  quizzes: Quiz[];
  playedIds: Set<string>;
  interest: Interest;
};

function FormatSection({
  format,
  quizzes: list,
  playedIds,
  interest,
}: FormatSectionProps) {
  const meta = FORMAT_META[format];
  const horizontal = list.length >= 3;
  return (
    <section className="pt-8">
      <div className="flex items-baseline justify-between gap-2 px-6">
        <div>
          <h2 className="text-lg font-extrabold text-dark">
            <span aria-hidden>{meta.emoji}</span> {meta.name}
          </h2>
          <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
            {meta.description}
          </p>
        </div>
        <p className="shrink-0 text-[11px] font-bold text-muted-foreground tabular-nums">
          {list.length}
        </p>
      </div>

      {horizontal ? (
        <div className="mt-3 flex gap-3 overflow-x-auto px-6 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {list.map((quiz) => (
            <CompactInterestCard
              key={quiz.id}
              quiz={quiz}
              isPlayed={playedIds.has(quiz.id)}
              interest={interest}
            />
          ))}
        </div>
      ) : (
        <div className="mt-3 flex flex-col gap-2.5 px-6">
          {list.map((quiz) => (
            <FullQuizRow
              key={quiz.id}
              quiz={quiz}
              isPlayed={playedIds.has(quiz.id)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

type CompactInterestCardProps = {
  quiz: Quiz;
  isPlayed: boolean;
  interest: Interest;
};

function CompactInterestCard({
  quiz,
  isPlayed,
  interest,
}: CompactInterestCardProps) {
  const meta = INTEREST_META[interest];
  return (
    <Link
      href={`/quiz/${quiz.id}`}
      className="flex w-56 shrink-0 flex-col gap-2 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.97]"
    >
      <div
        className={cn(
          "flex size-12 items-center justify-center rounded-xl text-2xl shadow-inner",
          INTEREST_ICON_BG[interest],
        )}
        aria-hidden
      >
        {meta.emoji}
      </div>
      <h3 className="line-clamp-2 text-sm font-extrabold leading-tight text-dark">
        {quiz.title}
      </h3>
      <div className="mt-auto flex flex-wrap items-center gap-1.5 text-[10px]">
        <FormatPill format={quiz.format} showName={false} />
        <span
          className={cn(
            "inline-flex items-center rounded-full px-1.5 py-0.5 font-bold",
            DIFFICULTY_PILL[quiz.difficulty],
          )}
        >
          {DIFFICULTY_LABEL[quiz.difficulty]}
        </span>
        {isPlayed && (
          <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 font-bold text-emerald-800">
            ✓
          </span>
        )}
      </div>
    </Link>
  );
}

type FullQuizRowProps = {
  quiz: Quiz;
  isPlayed: boolean;
};

function FullQuizRow({ quiz, isPlayed }: FullQuizRowProps) {
  const lead = primaryInterest(quiz.interests);
  const meta = INTEREST_META[lead];
  return (
    <Link
      href={`/quiz/${quiz.id}`}
      className="flex items-start gap-3 rounded-2xl bg-white p-3.5 shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.99]"
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
          {quiz.interests.map((i) => (
            <InterestTag key={i} interest={i} />
          ))}
        </div>
        <h3 className="mt-1 text-sm font-extrabold leading-tight text-dark">
          {quiz.title}
        </h3>
        <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-[10px]">
          <FormatPill format={quiz.format} />
          <span
            className={cn(
              "inline-flex items-center rounded-full px-1.5 py-0.5 font-bold",
              DIFFICULTY_PILL[quiz.difficulty],
            )}
          >
            {DIFFICULTY_LABEL[quiz.difficulty]}
          </span>
          <span className="font-semibold text-muted-foreground">
            {quiz.questionCount} frågor
          </span>
        </div>
      </div>
      {isPlayed && (
        <span
          aria-label="Du har spelat"
          className="mt-1 flex size-6 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-[11px] font-black text-white shadow-sm"
        >
          ✓
        </span>
      )}
    </Link>
  );
}
