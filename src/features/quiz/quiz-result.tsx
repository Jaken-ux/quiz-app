"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

import { LikeButton } from "@/features/quiz/like-button";
import {
  reasonLabel,
  type NextSuggestion,
} from "@/features/quiz/next-quiz";
import {
  DIFFICULTY_LABEL,
  DIFFICULTY_PILL,
} from "@/lib/difficulty";
import {
  INTEREST_ICON_BG,
  INTEREST_META,
  primaryInterest,
} from "@/lib/interests";
import { cn } from "@/lib/utils";
import type { SessionAnswer } from "@/types/play";
import type { Question, Quiz } from "@/types/quiz";

type QuizResultProps = {
  quiz: Quiz;
  answers: SessionAnswer[];
  questions: Question[];
  percentile: number;
  totalScore: number;
  correctCount: number;
  isFirstAttempt: boolean;
  next: NextSuggestion | null;
  onPlayAgain: () => void;
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

const HEADLINES_HIGH = [
  "Quizmästare på lös grund 🌟",
  "Hjärnan på högvarv 🧠",
  "Du är obotligt påläst 😎",
];
const HEADLINES_MID_HIGH = [
  "Snyggt, nästan medel-svensk 🎉",
  "Inte illa pinkat 💪",
  "Snyggt babb 👏",
];
const HEADLINES_MID_LOW = [
  "Gick sådär 🤷",
  "Du skämde inte ut dig — direkt",
  "Halvljumt men hederligt",
];
const HEADLINES_LOW = [
  "Tystnad i baren ikväll 🤫",
  "Kanske en till runda?",
  "Övning ger färdighet (lovar)",
];

const SUBLINES_HIGH = [
  "Det här bjöd du på.",
  "Lite jävla bra, faktiskt.",
  "Kanske dags att starta podd?",
];
const SUBLINES_MID_HIGH = [
  "Du behärskar det här.",
  "Sverige nickar uppskattande.",
  "Bra jobb, fortsätt så.",
];
const SUBLINES_MID_LOW = [
  "Några rätt är en start.",
  "Kompisarna kommer skratta lagom.",
  "Du tog dig igenom — det räknas.",
];
const SUBLINES_LOW = [
  "Det här var inte din kategori.",
  "Var snäll mot dig själv. Snart bättre.",
  "Bättre än Bingolotto i alla fall.",
];

function pickFromBands(
  correctRatio: number,
  score: number,
  bands: {
    high: string[];
    midHigh: string[];
    midLow: string[];
    low: string[];
  },
): string {
  const list =
    correctRatio >= 0.85
      ? bands.high
      : correctRatio >= 0.6
        ? bands.midHigh
        : correctRatio >= 0.3
          ? bands.midLow
          : bands.low;
  const idx = Math.abs(Math.floor(score)) % list.length;
  return list[idx];
}

export function QuizResult({
  quiz,
  answers,
  questions,
  percentile,
  totalScore,
  correctCount,
  isFirstAttempt,
  next,
  onPlayAgain,
  onHome,
}: QuizResultProps) {
  const totalQuestions = answers.length;
  const correctRatio =
    totalQuestions > 0 ? correctCount / totalQuestions : 0;
  const hasMounted = useHasMounted();
  const [breakdownOpen, setBreakdownOpen] = useState(false);

  const headline = pickFromBands(correctRatio, totalScore, {
    high: HEADLINES_HIGH,
    midHigh: HEADLINES_MID_HIGH,
    midLow: HEADLINES_MID_LOW,
    low: HEADLINES_LOW,
  });
  const subline = pickFromBands(correctRatio, totalScore, {
    high: SUBLINES_HIGH,
    midHigh: SUBLINES_MID_HIGH,
    midLow: SUBLINES_MID_LOW,
    low: SUBLINES_LOW,
  });

  const overlineLabel = isFirstAttempt
    ? "🏆 Officiellt resultat"
    : "🔁 Återspel";

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#FEF3C7] via-[#FFE4E6] to-[#FFEDD5] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6",
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
          <p className="mt-1 text-6xl font-black tabular-nums text-primary">
            {totalScore.toLocaleString("sv-SE")}
          </p>
          <p className="mt-1 text-xs font-semibold tabular-nums text-muted-foreground">
            {correctCount} av {totalQuestions} rätt
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mt-5 w-full rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-black/5"
        >
          <p className="text-sm font-extrabold text-dark">
            Du slog{" "}
            <span className="text-base text-primary">{percentile}%</span> av
            alla som spelat!
          </p>
          <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-black/10">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentile}%` }}
              transition={{ duration: 1, delay: 0.75, ease: "easeOut" }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"
            />
            <motion.div
              initial={{ left: "0%", opacity: 0 }}
              animate={{ left: `${percentile}%`, opacity: 1 }}
              transition={{ duration: 1, delay: 0.75, ease: "easeOut" }}
              className="absolute top-1/2 size-5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md ring-2 ring-primary"
            />
          </div>
          <div className="mt-1.5 flex justify-between text-[10px] font-bold text-muted-foreground">
            <span>0%</span>
            <span>100%</span>
          </div>
          <p className="mt-3 text-[11px] font-bold text-amber-700">
            {isFirstAttempt
              ? "🏆 Räknas mot din placering"
              : "🔁 Påverkar inte din officiella placering"}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.65 }}
          className="mt-3 w-full"
        >
          <BreakdownSection
            answers={answers}
            questions={questions}
            open={breakdownOpen}
            onToggle={() => setBreakdownOpen((v) => !v)}
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="mt-4 flex flex-col items-center gap-2"
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
        <button
          type="button"
          onClick={onPlayAgain}
          className="h-12 w-full rounded-2xl bg-primary text-sm font-extrabold text-primary-foreground shadow-[0_10px_24px_-8px_rgba(230,57,70,0.55)] transition-transform active:scale-[0.98]"
        >
          🔁 Spela igen — ny frågemix
        </button>
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

type BreakdownSectionProps = {
  answers: SessionAnswer[];
  questions: Question[];
  open: boolean;
  onToggle: () => void;
};

function BreakdownSection({
  answers,
  questions,
  open,
  onToggle,
}: BreakdownSectionProps) {
  const questionMap = useMemo(() => {
    const map = new Map<string, Question>();
    for (const q of questions) map.set(q.id, q);
    return map;
  }, [questions]);

  return (
    <div className="rounded-2xl bg-white shadow-sm ring-1 ring-black/5">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center gap-2 px-5 py-3.5 text-left transition active:scale-[0.99]"
      >
        <span aria-hidden className="text-base">
          📋
        </span>
        <span className="flex-1 text-sm font-extrabold text-dark">
          {open ? "Dölj per fråga" : "Visa per fråga"}
        </span>
        <ChevronDown
          className={cn(
            "size-4 text-muted-foreground transition-transform duration-200",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="breakdown"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-2 border-t border-black/5 px-5 pt-3 pb-4">
              {answers.map((answer, idx) => {
                const question = questionMap.get(answer.questionId);
                return (
                  <BreakdownRow
                    key={answer.questionId}
                    index={idx}
                    answer={answer}
                    question={question}
                  />
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

type BreakdownRowProps = {
  index: number;
  answer: SessionAnswer;
  question?: Question;
};

function BreakdownRow({ index, answer, question }: BreakdownRowProps) {
  const correct = answer.wasCorrect;
  const text = question?.text ?? "Fråga saknas";
  const percentileLine = correct
    ? `Snabbare än ${answer.percentileForQuestion}% av rätta svar`
    : `Bättre än ${answer.percentileForQuestion}% av spelarna`;

  return (
    <div className="rounded-xl bg-neutral-50 p-3 ring-1 ring-black/5">
      <div className="flex items-start gap-2.5">
        <span
          aria-hidden
          className={cn(
            "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-black",
            correct
              ? "bg-emerald-500 text-white"
              : "bg-rose-500 text-white",
          )}
        >
          {correct ? "✓" : "✕"}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground">
            Fråga {index + 1}
          </p>
          <p className="mt-0.5 line-clamp-2 text-xs font-bold leading-snug text-dark">
            {text}
          </p>
          <div className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] font-semibold tabular-nums text-muted-foreground">
            <span>⏱ {answer.timeUsedSeconds.toFixed(1)}s</span>
            <span>· {answer.scoreEarned} p</span>
            <span>· {percentileLine}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

type NextQuizCardProps = {
  suggestion: NextSuggestion;
};

function NextQuizCard({ suggestion }: NextQuizCardProps) {
  const { quiz, reason } = suggestion;
  const { label, emoji } = reasonLabel(reason);
  const lead = primaryInterest(quiz.interests);
  const leadMeta = INTEREST_META[lead];

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
                INTEREST_ICON_BG[lead],
              )}
              aria-hidden
            >
              {leadMeta.emoji}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-black uppercase tracking-wider text-white/70">
                {leadMeta.name}
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
