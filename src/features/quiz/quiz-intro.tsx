"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  CATEGORY_ACCENT_BAR,
  CATEGORY_EMOJI,
  CATEGORY_ICON_BG,
  CATEGORY_LABEL,
  DIFFICULTY_EMOJI,
  DIFFICULTY_LABEL,
} from "@/features/quiz/category-meta";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/types/quiz";

type QuizIntroProps = {
  quiz: Quiz;
  onStart: () => void;
};

export function QuizIntro({ quiz, onStart }: QuizIntroProps) {
  const router = useRouter();
  const hasQuestions = quiz.questions.length > 0;

  return (
    <div className="flex h-full flex-col px-6 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="flex items-center gap-1.5 self-start rounded-full bg-white px-3 py-1.5 text-sm font-bold text-dark shadow-sm ring-1 ring-black/5 transition-transform active:scale-95"
        aria-label="Tillbaka"
      >
        <ArrowLeft className="size-4" />
        Tillbaka
      </button>

      <div className="mt-6 flex flex-1 flex-col">
        <div className="relative flex items-center gap-4 rounded-3xl bg-white p-5 shadow-[0_8px_28px_-10px_rgba(29,53,87,0.22)] ring-1 ring-black/5">
          <div
            className={cn(
              "absolute inset-y-3 left-2 w-1.5 rounded-full",
              CATEGORY_ACCENT_BAR[quiz.category],
            )}
            aria-hidden
          />
          <div
            className={cn(
              "ml-2 flex size-[88px] shrink-0 items-center justify-center rounded-2xl text-5xl shadow-inner",
              CATEGORY_ICON_BG[quiz.category],
            )}
            aria-hidden
          >
            {CATEGORY_EMOJI[quiz.category]}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              {CATEGORY_LABEL[quiz.category]}
            </p>
            <h1 className="mt-0.5 text-2xl font-extrabold leading-tight text-dark">
              {quiz.title}
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {quiz.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <Stat
            emoji="📝"
            label="Frågor"
            value={String(quiz.questionCount)}
          />
          <Stat
            emoji="⏱️"
            label="Tid"
            value={`~${quiz.estimatedMinutes} min`}
          />
          <Stat
            label="Svårighet"
            value={`${DIFFICULTY_EMOJI[quiz.difficulty]} ${DIFFICULTY_LABEL[quiz.difficulty]}`}
          />
          <Stat
            emoji="👥"
            label="Spelat"
            value={quiz.playCount.toLocaleString("sv-SE")}
          />
        </div>

        <div className="mt-auto pb-6">
          {hasQuestions ? (
            <Button
              type="button"
              onClick={onStart}
              className="h-16 w-full rounded-2xl text-lg font-extrabold shadow-[0_12px_28px_-8px_rgba(230,57,70,0.55)] transition-all active:scale-[0.98]"
            >
              Starta quiz 🚀
            </Button>
          ) : (
            <div className="rounded-2xl bg-amber-100 p-5 text-center ring-1 ring-amber-200">
              <p className="text-lg font-extrabold text-amber-900">
                Kommer snart!
              </p>
              <p className="mt-1 text-sm font-semibold text-amber-800">
                Vi jobbar på frågorna för det här quizet.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

type StatProps = {
  label: string;
  value: string;
  emoji?: string;
};

function Stat({ label, value, emoji }: StatProps) {
  return (
    <div className="rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5">
      <p className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">
        {emoji && <span aria-hidden>{emoji} </span>}
        {label}
      </p>
      <p className="mt-0.5 text-base font-extrabold text-dark">{value}</p>
    </div>
  );
}
