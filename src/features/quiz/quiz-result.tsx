"use client";

import { motion } from "framer-motion";
import { useMemo, useSyncExternalStore } from "react";

import { maxPossibleScore } from "@/features/quiz/game-utils";
import type { Answer } from "@/features/quiz/quiz-play";
import type { Quiz } from "@/types/quiz";

type QuizResultProps = {
  quiz: Quiz;
  answers: Answer[];
  percentile: number;
  onHome: () => void;
};

const CONFETTI_EMOJIS = ["🎉", "✨", "🎊", "⭐", "🎈", "🌟"];

// Pre-generate decorative confetti at module evaluation so render stays pure.
// The hasMounted guard below keeps SSR and client hydration in sync.
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

function getHeadline(correctRatio: number): string {
  if (correctRatio >= 0.85) return "Otroligt! 🌟";
  if (correctRatio >= 0.6) return "Snyggt jobbat! 🎉";
  if (correctRatio >= 0.3) return "Bra försök! 💪";
  return "Kanske en till runda?";
}

function getSubline(correctRatio: number): string {
  if (correctRatio >= 0.85) return "Du är en quiz-stjärna!";
  if (correctRatio >= 0.6) return "Du behärskar det här.";
  if (correctRatio >= 0.3) return "Några rätt är en start.";
  return "Övning ger färdighet.";
}

export function QuizResult({
  quiz,
  answers,
  percentile,
  onHome,
}: QuizResultProps) {
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  const correctCount = answers.filter((a) => a.correct).length;
  const totalQuestions = answers.length;
  const correctRatio = totalQuestions > 0 ? correctCount / totalQuestions : 0;
  const maxScore = useMemo(
    () => maxPossibleScore(quiz.questions),
    [quiz.questions],
  );
  const hasMounted = useHasMounted();

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#FEF3C7] via-[#FFE4E6] to-[#FFEDD5] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6">
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
          transition={{ delay: 0.1 }}
          className="text-[11px] font-black uppercase tracking-widest text-muted-foreground"
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
          className="mt-2 text-4xl font-extrabold leading-tight text-dark"
        >
          {getHeadline(correctRatio)}
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-1 text-sm font-semibold text-muted-foreground"
        >
          {getSubline(correctRatio)}
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
          <p className="mt-1 text-6xl font-black tabular-nums text-primary">
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
          <span className="text-primary">
            {correctCount} av {totalQuestions}
          </span>{" "}
          rätt
        </motion.p>

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
        </motion.div>
      </div>

      <div className="relative mt-6">
        <button
          type="button"
          onClick={onHome}
          className="h-14 w-full rounded-2xl bg-primary text-base font-extrabold text-primary-foreground shadow-[0_12px_28px_-8px_rgba(230,57,70,0.55)] transition-all active:scale-[0.98]"
        >
          Tillbaka till hem
        </button>
      </div>
    </div>
  );
}
