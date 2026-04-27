"use client";

import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { LikeButton } from "@/features/quiz/like-button";
import {
  DIFFICULTY_EMOJI,
  DIFFICULTY_LABEL,
} from "@/lib/difficulty";
import {
  INTEREST_ACCENT_BAR,
  INTEREST_ICON_BG,
  INTEREST_META,
  primaryInterest,
} from "@/lib/interests";
import { cn } from "@/lib/utils";
import type { Play } from "@/types/play";
import type { Quiz } from "@/types/quiz";

type QuizIntroProps = {
  quiz: Quiz;
  officialPlay: Play | null;
  onStart: () => void;
};

export function QuizIntro({ quiz, officialPlay, onStart }: QuizIntroProps) {
  const router = useRouter();
  const hasQuestions = quiz.questions.length > 0;
  const isTrainingNext = officialPlay !== null;
  const lead = primaryInterest(quiz.interests);
  const leadMeta = INTEREST_META[lead];

  return (
    <div className="flex min-h-full flex-col px-6 pt-[calc(env(safe-area-inset-top)+1.25rem)]">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="flex items-center gap-1.5 self-start rounded-full bg-white px-3 py-1.5 text-sm font-bold text-dark shadow-sm ring-1 ring-black/5 transition-transform active:scale-95"
        aria-label="Tillbaka"
      >
        <ArrowLeft className="size-4" />
        Tillbaka
      </button>

      {isTrainingNext && officialPlay && (
        <TrainingBanner play={officialPlay} />
      )}

      <div className="mt-6 flex flex-1 flex-col">
        <div className="relative flex items-center gap-4 rounded-3xl bg-white p-5 shadow-[0_8px_28px_-10px_rgba(29,53,87,0.22)] ring-1 ring-black/5">
          <div
            className={cn(
              "absolute inset-y-3 left-2 w-1.5 rounded-full",
              INTEREST_ACCENT_BAR[lead],
            )}
            aria-hidden
          />
          <div
            className={cn(
              "ml-2 flex size-[88px] shrink-0 items-center justify-center rounded-2xl text-5xl shadow-inner",
              INTEREST_ICON_BG[lead],
            )}
            aria-hidden
          >
            {leadMeta.emoji}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-black uppercase tracking-wider text-muted-foreground">
              {leadMeta.name}
            </p>
            <h1 className="mt-0.5 text-2xl font-extrabold leading-tight text-dark">
              {quiz.title}
            </h1>
          </div>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
          {quiz.description}
        </p>

        <div className="mt-4">
          <LikeButton
            quizId={quiz.id}
            baseCount={quiz.likeCount}
            variant="pill"
          />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
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
          {!hasQuestions ? (
            <div className="rounded-2xl bg-amber-100 p-5 text-center ring-1 ring-amber-200">
              <p className="text-lg font-extrabold text-amber-900">
                Kommer snart!
              </p>
              <p className="mt-1 text-sm font-semibold text-amber-800">
                Vi jobbar på frågorna för det här quizet.
              </p>
            </div>
          ) : isTrainingNext ? (
            <>
              <Button
                type="button"
                onClick={onStart}
                className="h-16 w-full rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-lg font-extrabold text-white shadow-[0_12px_28px_-8px_rgba(14,165,233,0.55)] transition-all hover:from-sky-500 hover:to-emerald-500 active:scale-[0.98]"
              >
                Spela igen (träning) 💪
              </Button>
              <p className="mt-2 text-center text-xs font-semibold text-muted-foreground">
                Träningsförsök — påverkar inte din placering.
              </p>
            </>
          ) : (
            <>
              <Button
                type="button"
                onClick={onStart}
                className="h-16 w-full rounded-2xl text-lg font-extrabold shadow-[0_12px_28px_-8px_rgba(230,57,70,0.55)] transition-all active:scale-[0.98]"
              >
                Starta quiz 🚀
              </Button>
              <p className="mt-2 text-center text-xs font-semibold text-amber-700">
                🏆 Ditt första försök — räknas officiellt.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

type TrainingBannerProps = {
  play: Play;
};

function TrainingBanner({ play }: TrainingBannerProps) {
  const accuracy =
    play.totalQuestions > 0 ? play.correctCount / play.totalQuestions : 0;

  return (
    <div className="mt-4 overflow-hidden rounded-3xl bg-gradient-to-br from-sky-100 via-cyan-50 to-emerald-100 p-5 shadow-[0_6px_20px_-10px_rgba(14,165,233,0.4)] ring-1 ring-sky-200">
      <div className="flex items-start gap-3">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">
          💪
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-black uppercase tracking-widest text-sky-900">
            Träningsläge
          </p>
          <p className="mt-0.5 text-sm font-bold leading-snug text-dark">
            Du har redan spelat detta officiellt — nästa runda räknas inte mot
            din placering.
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-2xl bg-white/70 p-3 ring-1 ring-sky-200/60 backdrop-blur">
        <div className="flex items-baseline justify-between gap-2">
          <p className="text-[11px] font-black uppercase tracking-wider text-sky-900">
            🏆 Ditt officiella resultat
          </p>
          <p className="text-[10px] font-semibold text-sky-900/80">
            {Math.round(accuracy * 100)}% rätt
          </p>
        </div>
        <div className="mt-1.5 flex items-baseline gap-2">
          <p className="text-2xl font-black tabular-nums text-dark">
            {play.score.toLocaleString("sv-SE")}
          </p>
          <p className="text-xs font-bold text-muted-foreground">poäng</p>
        </div>
        <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
          Du slog{" "}
          <span className="font-black text-sky-700">{play.percentile}%</span>{" "}
          av spelarna · {play.correctCount} av {play.totalQuestions} rätt
        </p>
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
