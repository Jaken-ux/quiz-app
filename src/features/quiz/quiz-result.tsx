"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useSyncExternalStore } from "react";

import {
  CATEGORY_EMOJI,
  CATEGORY_ICON_BG,
  CATEGORY_LABEL,
  DIFFICULTY_LABEL,
  DIFFICULTY_PILL,
} from "@/features/quiz/category-meta";
import { maxPossibleScore } from "@/features/quiz/game-utils";
import { LikeButton } from "@/features/quiz/like-button";
import {
  reasonLabel,
  type NextSuggestion,
} from "@/features/quiz/next-quiz";
import type { Answer } from "@/features/quiz/play-questions";
import { cn } from "@/lib/utils";
import type { Play } from "@/types/play";
import type { Quiz } from "@/types/quiz";

type QuizResultProps = {
  quiz: Quiz;
  answers: Answer[];
  percentile: number;
  isFirstAttempt: boolean;
  officialPlay: Play | null;
  next: NextSuggestion | null;
  onHome: () => void;
};

const CONFETTI_EMOJIS = ["🎉", "✨", "🎊", "⭐", "🎈", "🌟"];

const CONFETTI = Array.from({ length: 28 }, (_, i) => ({
  emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
  startX: Math.random() * 100,
  delay: Math.random() * 0.5,
  duration: 2.2 + Math.random() * 1.5,
  rotate: Math.random() * 720 - 360,
}));

function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function getOfficialHeadline(correctRatio: number): string {
  if (correctRatio >= 0.85) return "Otroligt! 🌟";
  if (correctRatio >= 0.6) return "Snyggt jobbat! 🎉";
  if (correctRatio >= 0.3) return "Bra försök! 💪";
  return "Kanske en till runda?";
}

function getOfficialSubline(correctRatio: number): string {
  if (correctRatio >= 0.85) return "Du är en quiz-stjärna!";
  if (correctRatio >= 0.6) return "Du behärskar det här.";
  if (correctRatio >= 0.3) return "Några rätt är en start.";
  return "Övning ger färdighet.";
}

function getTrainingHeadline(correctRatio: number): string {
  if (correctRatio >= 0.85) return "Toppenövning! 💪";
  if (correctRatio >= 0.6) return "Bra träning!";
  if (correctRatio >= 0.3) return "Fortsätt så.";
  return "Fler försök = mer kunskap.";
}

function getTrainingSubline(
  newCorrect: number,
  officialCorrect: number | null,
): string {
  if (officialCorrect === null) {
    return "Träningsförsök sparat.";
  }
  if (newCorrect > officialCorrect) {
    return "Bättre än ditt officiella!";
  }
  if (newCorrect < officialCorrect) {
    return "Strax under ditt officiella.";
  }
  return "Lika bra som ditt officiella.";
}

export function QuizResult({
  quiz,
  answers,
  percentile,
  isFirstAttempt,
  officialPlay,
  next,
  onHome,
}: QuizResultProps) {
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const correctCount = answers.filter((a) => a.correct).length;
  const totalQuestions = answers.length;
  const correctRatio =
    totalQuestions > 0 ? correctCount / totalQuestions : 0;
  const maxScore = useMemo(
    () => maxPossibleScore(quiz.questions),
    [quiz.questions],
  );
  const hasMounted = useHasMounted();

  const headline = isFirstAttempt
    ? getOfficialHeadline(correctRatio)
    : getTrainingHeadline(correctRatio);
  const subline = isFirstAttempt
    ? getOfficialSubline(correctRatio)
    : getTrainingSubline(correctCount, officialPlay?.correctCount ?? null);

  const bgClass = isFirstAttempt
    ? "bg-gradient-to-b from-[#FEF3C7] via-[#FFE4E6] to-[#FFEDD5]"
    : "bg-gradient-to-b from-[#E0F2FE] via-[#D1FAE5] to-[#FEFCE8]";

  const scoreColorClass = isFirstAttempt
    ? "text-primary"
    : "text-emerald-600";

  const overlineLabel = isFirstAttempt
    ? "🏆 Officiellt resultat"
    : "💪 Träningsresultat";

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6",
        bgClass,
      )}
    >
      {hasMounted && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {CONFETTI.map((c, i) => (
            <motion.span
              key={i}
              initial={{ y: -40, opacity: 1, rotate: 0 }}
              animate={{ y: 900, opacity: 0, rotate: c.rotate }}
              transition={{
                duration: c.duration,
                delay: c.delay,
                ease: "linear",
              }}
              className="absolute text-2xl"
              style={{ left: `${c.startX}%`, top: 0 }}
            >
              {c.emoji}
            </motion.span>
          ))}
        </div>
      )}

      <div className="relative flex flex-1 flex-col items-center overflow-y-auto text-center">
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className={cn(
            "rounded-full px-3 py-1 text-[11px] font-black uppercase tracking-widest",
            isFirstAttempt
              ? "bg-amber-200/70 text-amber-900"
              : "bg-sky-200/70 text-sky-900",
          )}
        >
          {overlineLabel}
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mt-2 text-[11px] font-black uppercase tracking-widest text-muted-foreground"
        >
          {quiz.title}
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 16,
            delay: 0.15,
          }}
          className="mt-1 text-4xl font-extrabold leading-tight text-dark"
        >
          {headline}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-1 text-sm font-semibold text-muted-foreground"
        >
          {subline}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 14,
            delay: 0.3,
          }}
          className="mt-7 rounded-[2rem] bg-white px-10 py-5 shadow-[0_12px_40px_-10px_rgba(29,53,87,0.25)] ring-1 ring-black/5"
        >
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Poäng
          </p>
          <p
            className={cn(
              "mt-1 text-6xl font-black tabular-nums",
              scoreColorClass,
            )}
          >
            {totalScore}
          </p>
          <p className="mt-1 text-xs font-semibold tabular-nums text-muted-foreground">
            av {maxScore} möjliga
          </p>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-5 text-base font-bold text-dark"
        >
          Du svarade{" "}
          <span className={scoreColorClass}>
            {correctCount} av {totalQuestions}
          </span>{" "}
          rätt
        </motion.p>

        {isFirstAttempt ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-5 w-full rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-black/5"
          >
            <p className="text-sm font-extrabold text-dark">
              Du slog{" "}
              <span className="text-primary text-base">{percentile}%</span> av
              alla som spelat!
            </p>
            <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-black/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percentile}%` }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"
              />
              <motion.div
                initial={{ left: "0%", opacity: 0 }}
                animate={{ left: `${percentile}%`, opacity: 1 }}
                transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
                className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md ring-2 ring-primary"
              />
            </div>
            <div className="mt-1.5 flex justify-between text-[10px] font-bold text-muted-foreground">
              <span>0%</span>
              <span>100%</span>
            </div>
            <p className="mt-3 text-[11px] font-bold text-amber-700">
              🏆 Räknas mot din placering
            </p>
          </motion.div>
        ) : (
          <TrainingComparison
            officialPlay={officialPlay}
            newCorrect={correctCount}
            newScore={totalScore}
            totalQuestions={totalQuestions}
          />
        )}

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-5 flex flex-col items-center gap-2"
        >
          <p className="text-xs font-semibold text-muted-foreground">
            Gillade du quizet?
          </p>
          <LikeButton
            quizId={quiz.id}
            baseCount={quiz.likeCount}
            variant="pill"
          />
        </motion.div>
      </div>

      <div className="relative mt-5 flex flex-col gap-2.5">
        {next && <NextQuizCard suggestion={next} />}
        <button
          type="button"
          onClick={onHome}
          className="h-12 w-full rounded-2xl bg-white text-sm font-extrabold text-dark shadow-sm ring-1 ring-black/10 transition-transform active:scale-[0.98]"
        >
          Tillbaka till hem
        </button>
      </div>
    </div>
  );
}

type TrainingComparisonProps = {
  officialPlay: Play | null;
  newCorrect: number;
  newScore: number;
  totalQuestions: number;
};

function TrainingComparison({
  officialPlay,
  newCorrect,
  newScore,
  totalQuestions,
}: TrainingComparisonProps) {
  if (!officialPlay) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-5 w-full rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-black/5"
      >
        <p className="text-sm font-bold text-dark">
          Träningsförsök sparat. Påverkar inte din placering.
        </p>
      </motion.div>
    );
  }

  const diff = newCorrect - officialPlay.correctCount;
  let comparisonLine: string;
  let comparisonEmoji: string;
  let comparisonClass: string;
  if (diff > 0) {
    comparisonLine = `${diff} ${diff === 1 ? "fler rätt" : "fler rätt"} än officiellt`;
    comparisonEmoji = "🎯";
    comparisonClass = "text-emerald-700";
  } else if (diff < 0) {
    const abs = Math.abs(diff);
    comparisonLine = `${abs} ${abs === 1 ? "färre rätt" : "färre rätt"} än officiellt`;
    comparisonEmoji = "💪";
    comparisonClass = "text-sky-700";
  } else {
    comparisonLine = "Samma som officiellt";
    comparisonEmoji = "🎯";
    comparisonClass = "text-emerald-700";
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-5 w-full rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
    >
      <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
        Jämfört med officiellt försök
      </p>
      <div className="mt-3 grid grid-cols-2 gap-3">
        <div className="rounded-xl bg-emerald-50 p-3 ring-1 ring-emerald-200/60">
          <p className="text-[10px] font-black uppercase tracking-wider text-emerald-700">
            Detta försök
          </p>
          <p className="mt-1 text-2xl font-black tabular-nums text-dark">
            {newScore.toLocaleString("sv-SE")}
          </p>
          <p className="mt-0.5 text-[11px] font-bold text-muted-foreground">
            {newCorrect} av {totalQuestions} rätt
          </p>
        </div>
        <div className="rounded-xl bg-amber-50 p-3 ring-1 ring-amber-200/60">
          <p className="text-[10px] font-black uppercase tracking-wider text-amber-800">
            🏆 Officiellt
          </p>
          <p className="mt-1 text-2xl font-black tabular-nums text-dark">
            {officialPlay.score.toLocaleString("sv-SE")}
          </p>
          <p className="mt-0.5 text-[11px] font-bold text-muted-foreground">
            {officialPlay.correctCount} av {officialPlay.totalQuestions} rätt
          </p>
        </div>
      </div>
      <p className={cn("mt-3 text-sm font-extrabold", comparisonClass)}>
        <span aria-hidden>{comparisonEmoji}</span> {comparisonLine}
      </p>
    </motion.div>
  );
}

type NextQuizCardProps = {
  suggestion: NextSuggestion;
};

function NextQuizCard({ suggestion }: NextQuizCardProps) {
  const { quiz, reason } = suggestion;
  const { label, emoji } = reasonLabel(reason);

  return (
    <Link
      href={`/quiz/${quiz.id}`}
      className="block rounded-3xl transition-transform active:scale-[0.98]"
    >
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1D3557] via-[#2C5282] to-[#7C3AED] p-4 shadow-[0_14px_32px_-10px_rgba(29,53,87,0.5)]">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-4 -right-4 h-24 w-24 rounded-full bg-white/15 blur-xl"
        />
        <div className="relative">
          <div className="inline-flex items-center gap-1 rounded-full bg-white/20 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest text-white backdrop-blur">
            <span aria-hidden>{emoji}</span> {label}
          </div>
          <div className="mt-2.5 flex items-center gap-3">
            <div
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-2xl text-2xl shadow-inner",
                CATEGORY_ICON_BG[quiz.category],
              )}
              aria-hidden
            >
              {CATEGORY_EMOJI[quiz.category]}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/70">
                {CATEGORY_LABEL[quiz.category]}
              </p>
              <h3 className="text-base font-extrabold leading-tight text-white drop-shadow-sm">
                {quiz.title}
              </h3>
              <span
                className={cn(
                  "mt-1 inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-bold",
                  DIFFICULTY_PILL[quiz.difficulty],
                )}
              >
                {DIFFICULTY_LABEL[quiz.difficulty]}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
