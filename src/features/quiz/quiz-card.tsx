import Link from "next/link";

import { Card } from "@/components/ui/card";
import {
  CATEGORY_ACCENT_BAR,
  CATEGORY_EMOJI,
  CATEGORY_ICON_BG,
  CATEGORY_LABEL,
  DIFFICULTY_LABEL,
  DIFFICULTY_PILL,
} from "@/features/quiz/category-meta";
import { cn } from "@/lib/utils";
import type { Quiz } from "@/types/quiz";

type QuizCardProps = {
  quiz: Quiz;
};

function formatPlayCount(n: number): string {
  if (n < 1000) return n.toLocaleString("sv-SE");
  let formatted = (n / 1000).toFixed(1);
  if (formatted.endsWith(".0")) formatted = formatted.slice(0, -2);
  return formatted.replace(".", ",") + "k";
}

export function QuizCard({ quiz }: QuizCardProps) {
  return (
    <Link
      href={`/quiz/${quiz.id}`}
      className="block rounded-3xl transition-all duration-150 active:scale-[0.98] active:opacity-90"
    >
      <Card className="relative gap-3 overflow-hidden rounded-3xl border-0 bg-white p-5 pl-6 shadow-[0_8px_28px_-10px_rgba(29,53,87,0.22)] ring-1 ring-black/5">
        <div
          className={cn(
            "absolute inset-y-3 left-2 w-1.5 rounded-full",
            CATEGORY_ACCENT_BAR[quiz.category],
          )}
          aria-hidden
        />

        <div className="flex items-start gap-4">
          <div
            className={cn(
              "flex size-[72px] shrink-0 items-center justify-center rounded-2xl text-4xl shadow-inner",
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
            <h3 className="mt-0.5 text-lg font-extrabold leading-tight text-dark">
              {quiz.title}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm leading-snug text-muted-foreground">
              {quiz.description}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-0.5 text-xs">
          <span
            className={cn(
              "inline-flex items-center rounded-full px-2.5 py-1 font-bold",
              DIFFICULTY_PILL[quiz.difficulty],
            )}
          >
            {DIFFICULTY_LABEL[quiz.difficulty]}
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
            <span aria-hidden>📝</span>
            {quiz.questionCount} frågor
          </span>
          <span className="inline-flex items-center gap-1 font-semibold text-muted-foreground">
            <span aria-hidden>👥</span>
            {formatPlayCount(quiz.playCount)}
          </span>
          <span
            aria-hidden
            className="ml-auto text-lg font-black text-primary"
          >
            →
          </span>
        </div>
      </Card>
    </Link>
  );
}
