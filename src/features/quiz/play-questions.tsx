"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { computeQuestionScore } from "@/features/quiz/game-utils";
import { cn } from "@/lib/utils";
import type { Question } from "@/types/quiz";

export type Answer = {
  questionId: string;
  selectedIndex: number | null;
  correct: boolean;
  score: number;
  timeSpentMs: number;
};

type LockedState = {
  selectedIndex: number | null;
  correct: boolean;
  answer: Answer;
};

const ADVANCE_DELAY_MS = 1500;

export type PlayTheme = "quiz" | "training";

type ThemeStyles = {
  bgClass: string;
  progressBarClass: string;
  letterPillClass: string;
};

const THEMES: Record<PlayTheme, ThemeStyles> = {
  quiz: {
    bgClass:
      "bg-gradient-to-b from-[#FFF4DE] via-[#FCE7F3] to-[#EEF2FF]",
    progressBarClass: "bg-primary",
    letterPillClass: "bg-primary/10 text-primary",
  },
  training: {
    bgClass:
      "bg-gradient-to-b from-[#E0F7FA] via-[#D1FAE5] to-[#FEFCE8]",
    progressBarClass: "bg-sky-500",
    letterPillClass: "bg-sky-100 text-sky-700",
  },
};

type PlayQuestionsProps = {
  questions: Question[];
  theme?: PlayTheme;
  /** Subtitle shown next to "Fråga X av Y" (e.g. "Träning · Musik · Medel"). */
  subtitle?: string;
  abortTitle?: string;
  abortDescription?: string;
  abortConfirmLabel?: string;
  onComplete: (answers: Answer[]) => void;
  onAbort: () => void;
};

export function PlayQuestions({
  questions,
  theme = "quiz",
  subtitle,
  abortTitle = "Avbryta quiz?",
  abortDescription = "Dina svar kommer att förloras.",
  abortConfirmLabel = "Avbryt quiz",
  onComplete,
  onAbort,
}: PlayQuestionsProps) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [locked, setLocked] = useState<LockedState | null>(null);
  const [showAbortDialog, setShowAbortDialog] = useState(false);

  const question = questions[questionIndex];
  const totalQuestions = questions.length;

  const startTimeRef = useRef<number>(0);
  const lockedRef = useRef<LockedState | null>(null);

  useEffect(() => {
    startTimeRef.current = performance.now();
  }, [questionIndex]);

  useEffect(() => {
    if (!locked) return;
    const pending = locked;
    const timeoutId = window.setTimeout(() => {
      const newAnswers = [...answers, pending.answer];
      if (questionIndex + 1 < totalQuestions) {
        setAnswers(newAnswers);
        lockedRef.current = null;
        setLocked(null);
        setQuestionIndex(questionIndex + 1);
      } else {
        onComplete(newAnswers);
      }
    }, ADVANCE_DELAY_MS);
    return () => window.clearTimeout(timeoutId);
  }, [locked, answers, questionIndex, totalQuestions, onComplete]);

  const handleSelect = (index: number) => {
    if (lockedRef.current || !question) return;
    const correct = index === question.correctIndex;
    // eslint-disable-next-line react-hooks/purity -- event handler, runs on click not during render
    const elapsedMs = performance.now() - startTimeRef.current;
    const timeLeftSec = Math.max(
      0,
      (question.timeLimitSeconds * 1000 - elapsedMs) / 1000,
    );
    const score = computeQuestionScore(correct, timeLeftSec);
    const next: LockedState = {
      selectedIndex: index,
      correct,
      answer: {
        questionId: question.id,
        selectedIndex: index,
        correct,
        score,
        timeSpentMs: elapsedMs,
      },
    };
    lockedRef.current = next;
    setLocked(next);
  };

  const handleTimerEnd = useCallback(() => {
    if (lockedRef.current || !question) return;
    const next: LockedState = {
      selectedIndex: null,
      correct: false,
      answer: {
        questionId: question.id,
        selectedIndex: null,
        correct: false,
        score: 0,
        timeSpentMs: question.timeLimitSeconds * 1000,
      },
    };
    lockedRef.current = next;
    setLocked(next);
  }, [question]);

  if (!question) {
    return null;
  }

  const progressPct =
    ((questionIndex + (locked ? 1 : 0)) / totalQuestions) * 100;

  const styles = THEMES[theme];

  return (
    <div
      className={cn(
        "relative flex h-full flex-col overflow-hidden px-5 pt-[calc(env(safe-area-inset-top)+1rem)] pb-6",
        styles.bgClass,
      )}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setShowAbortDialog(true)}
          aria-label={abortConfirmLabel}
          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform active:scale-90"
        >
          <ArrowLeft className="size-5 text-dark" />
        </button>
        <div className="flex-1">
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Fråga {questionIndex + 1} av {totalQuestions}
            {subtitle ? ` · ${subtitle}` : ""}
          </p>
          <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/10">
            <div
              className={cn(
                "h-full rounded-full transition-all duration-500",
                styles.progressBarClass,
              )}
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-black/10">
        <div
          key={questionIndex}
          onAnimationEnd={handleTimerEnd}
          className={cn(
            "animate-quiz-timer h-full rounded-full",
            locked && "[animation-play-state:paused]",
          )}
          style={{ animationDuration: `${question.timeLimitSeconds}s` }}
        />
      </div>

      <div className="relative mt-6 flex flex-1 flex-col">
        <AnimatePresence mode="wait">
          <motion.div
            key={questionIndex}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="flex flex-1 flex-col"
          >
            <div>
              <p className="text-center text-[11px] font-black uppercase tracking-widest text-muted-foreground">
                Fråga {questionIndex + 1}
              </p>
              <h2 className="mt-2 text-center text-2xl font-extrabold leading-snug text-balance text-dark">
                {question.text}
              </h2>
            </div>

            <div className="mt-auto flex flex-col gap-3 pt-6">
              {question.options.map((option, idx) => {
                const isLocked = locked !== null;
                const isSelected = locked?.selectedIndex === idx;
                const isCorrect = idx === question.correctIndex;

                let variantClass =
                  "bg-white text-dark ring-1 ring-black/10 shadow-[0_6px_16px_-8px_rgba(29,53,87,0.2)]";
                if (isLocked) {
                  if (isCorrect) {
                    variantClass =
                      "bg-emerald-500 text-white ring-1 ring-emerald-600/20 shadow-[0_10px_24px_-8px_rgba(16,185,129,0.55)]";
                  } else if (isSelected) {
                    variantClass =
                      "bg-rose-500 text-white ring-1 ring-rose-600/20 shadow-[0_10px_24px_-8px_rgba(244,63,94,0.55)]";
                  } else {
                    variantClass =
                      "bg-white/70 text-muted-foreground opacity-60 ring-1 ring-black/5";
                  }
                }

                const labelClass =
                  isLocked && (isCorrect || isSelected)
                    ? "bg-white/25 text-white"
                    : styles.letterPillClass;

                return (
                  <motion.button
                    key={idx}
                    type="button"
                    onClick={() => handleSelect(idx)}
                    disabled={isLocked}
                    whileTap={!isLocked ? { scale: 0.98 } : undefined}
                    animate={
                      isLocked && isCorrect
                        ? { scale: [1, 1.04, 1] }
                        : isLocked && isSelected
                          ? { x: [0, -5, 5, -4, 4, 0] }
                          : { scale: 1, x: 0 }
                    }
                    transition={{ duration: 0.4 }}
                    className={cn(
                      "relative flex min-h-[64px] items-center gap-3 rounded-2xl px-4 py-3 text-left font-bold transition-colors duration-200 disabled:cursor-default",
                      variantClass,
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-black",
                        labelClass,
                      )}
                    >
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-base leading-snug">
                      {option}
                    </span>
                    {isLocked && isCorrect && (
                      <span className="text-xl font-black" aria-hidden>
                        ✓
                      </span>
                    )}
                    {isLocked && isSelected && !isCorrect && (
                      <span className="text-xl font-black" aria-hidden>
                        ✕
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {showAbortDialog && (
          <AbortDialog
            key="abort"
            title={abortTitle}
            description={abortDescription}
            confirmLabel={abortConfirmLabel}
            onConfirm={onAbort}
            onCancel={() => setShowAbortDialog(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

type AbortDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

function AbortDialog({
  title,
  description,
  confirmLabel,
  onConfirm,
  onCancel,
}: AbortDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 z-10 flex items-end justify-center bg-black/45 backdrop-blur-sm"
      onClick={onCancel}
    >
      <motion.div
        initial={{ y: 220 }}
        animate={{ y: 0 }}
        exit={{ y: 220 }}
        transition={{ type: "spring", damping: 24, stiffness: 260 }}
        className="w-full rounded-t-[2rem] bg-white p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-[0_-8px_32px_-4px_rgba(29,53,87,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-xl font-extrabold text-dark">{title}</h3>
        <p className="mt-1 text-sm font-medium text-muted-foreground">
          {description}
        </p>
        <div className="mt-5 flex flex-col gap-2">
          <button
            type="button"
            onClick={onConfirm}
            className="h-12 w-full rounded-2xl bg-rose-500 font-extrabold text-white transition-transform active:scale-[0.98]"
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="h-12 w-full rounded-2xl bg-white font-extrabold text-dark ring-1 ring-black/10 transition-transform active:scale-[0.98]"
          >
            Fortsätt spela
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
