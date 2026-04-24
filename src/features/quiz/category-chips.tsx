"use client";

import {
  CATEGORIES,
  CATEGORY_EMOJI,
  CATEGORY_LABEL,
  CATEGORY_SOFT_CHIP,
} from "@/features/quiz/category-meta";
import { cn } from "@/lib/utils";
import type { Category } from "@/types/quiz";

export type CategoryFilter = Category | "all";

type CategoryChipsProps = {
  active: CategoryFilter;
  onChange: (filter: CategoryFilter) => void;
  className?: string;
};

type ChipItem = {
  id: CategoryFilter;
  label: string;
  emoji: string;
};

const ITEMS: ChipItem[] = [
  { id: "all", label: "Alla", emoji: "✨" },
  ...CATEGORIES.map<ChipItem>((c) => ({
    id: c,
    label: CATEGORY_LABEL[c],
    emoji: CATEGORY_EMOJI[c],
  })),
];

export function CategoryChips({
  active,
  onChange,
  className,
}: CategoryChipsProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        role="tablist"
        aria-label="Filtrera på kategori"
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {ITEMS.map((item) => {
          const isActive = active === item.id;
          const inactiveClass =
            item.id === "all"
              ? "bg-white text-dark ring-1 ring-black/5"
              : CATEGORY_SOFT_CHIP[item.id];
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => onChange(item.id)}
              className={cn(
                "inline-flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2.5 text-sm font-bold whitespace-nowrap transition-all duration-150 active:scale-95",
                isActive
                  ? "scale-105 bg-primary text-primary-foreground shadow-[0_8px_20px_-6px_rgba(230,57,70,0.55)]"
                  : inactiveClass,
              )}
            >
              <span aria-hidden className="text-base leading-none">
                {item.emoji}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute right-0 top-0 h-full w-10 bg-gradient-to-l from-background via-background/80 to-transparent"
      />
    </div>
  );
}
