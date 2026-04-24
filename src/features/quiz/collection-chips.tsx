"use client";

import {
  COLLECTIONS,
  type CollectionId,
} from "@/features/quiz/collections";
import { cn } from "@/lib/utils";

type CollectionChipsProps = {
  active: CollectionId | null;
  onChange: (id: CollectionId) => void;
  className?: string;
};

export function CollectionChips({
  active,
  onChange,
  className,
}: CollectionChipsProps) {
  return (
    <div className={cn("relative", className)}>
      <div
        role="tablist"
        aria-label="Samlingar"
        className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {COLLECTIONS.map((item) => {
          const isActive = active === item.id;
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
                  ? "scale-105 bg-dark text-white shadow-[0_8px_20px_-6px_rgba(29,53,87,0.55)]"
                  : "bg-white text-dark ring-1 ring-dark/15",
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
