import { Check } from "lucide-react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { FormatPill } from "@/features/quiz/format-pill";
import { InterestTag } from "@/features/quiz/interest-tag";
import { LikeButton } from "@/features/quiz/like-button";
import {
  DIFFICULTY_LABEL,
  DIFFICULTY_PILL,
} from "@/lib/difficulty";
import {
  INTEREST_ACCENT_BAR,
  INTEREST_ICON_BG,
  INTEREST_META,
  primaryInterest,
} from "@/lib/interests";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/types/quiz";

type QuizCardProps = {
  quiz: Quiz;
  isPlayed?: boolean;
};

function formatPlayCount(n: number): string {
  if (n < 1000) return n.toLocaleString("sv-SE");
  let formatted = (n / 1000).toFixed(1);
  if (formatted.endsWith(".0")) formatted = formatted.slice(0, -2);
  return formatted.replace(".", ",") + "k";
}

export function QuizCard({ quiz, isPlayed = false }: QuizCardProps) {
  const lead = primaryInterest(quiz.interests);
  const meta = INTEREST_META[lead];

  return (
    <Link
      href={`/quiz/${quiz.id}`}
      className="block rounded-3xl transition-all duration-150 active:scale-[0.98] active:opacity-90"
    >
      <Card className="relative gap-3 overflow-hidden rounded-3xl border-0 bg-white p-5 pl-6 shadow-[0_8px_28px_-10px_rgba(29,53,87,0.22)] ring-1 ring-black/5">
        <div
          className={cn(
            "absolute inset-y-3 left-2 w-1.5 rounded-full",
            INTEREST_ACCENT_BAR[lead],
          )}
          aria-hidden
        />

        {isPlayed && (
          <div
            className="absolute right-3 top-3 z-10 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm"
            aria-label="Du har spelat detta quiz"
          >
            <Check className="size-3" strokeWidth={3} />
            Spelad
          </div>
        )}

        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-[72px] shrink-0 items-center justify-center rounded-2xl text-4xl shadow-inner",
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
            <h3
              className={cn(
                "mt-1.5 text-lg font-extrabold leading-tight text-dark",
                isPlayed && "pr-20",
              )}
            >
              {quiz.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
              {quiz.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
          <FormatPill format={quiz.format} />
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 font-bold",
              DIFFICULTY_PILL[quiz.difficulty],
            )}
          >
            {DIFFICULTY_LABEL[quiz.difficulty]}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
            <span aria-hidden>👥</span>
            {formatPlayCount(quiz.playCount)}
          </span>
          <LikeButton
            quizId={quiz.id}
            baseCount={quiz.likeCount}
            variant="compact"
            className="ml-auto"
          />
        </div>
      </Card>
    </Link>
  );
}
