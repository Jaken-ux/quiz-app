"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  INTERESTS,
  INTEREST_ICON_BG,
  INTEREST_META,
} from "@/lib/interests";
import { cn } from "@/lib/utils";
import type { Interest } from "@/types/quiz";

const MIN_SELECTED = 3;

type InterestPickerProps = {
  initial?: Interest[];
  title?: string;
  subtitle?: string;
  submitLabel?: string;
  onSubmit: (interests: Interest[]) => void;
  onBack?: () => void;
  /** When true, the picker is rendered inside another scroll container. */
  embedded?: boolean;
};

export function InterestPicker({
  initial = [],
  title = "Vad gillar du?",
  subtitle = "Välj minst 3 — vi använder det till att hitta quiz du tycker är roliga.",
  submitLabel = "Klar",
  onSubmit,
  onBack,
  embedded = false,
}: InterestPickerProps) {
  const [selected, setSelected] = useState<Set<Interest>>(
    () => new Set(initial),
  );

  const toggle = (interest: Interest) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(interest)) {
        next.delete(interest);
      } else {
        next.add(interest);
      }
      return next;
    });
  };

  const count = selected.size;
  const canSubmit = count >= MIN_SELECTED;
  const counterColor = canSubmit ? "text-emerald-700" : "text-muted-foreground";

  const handleSubmit = () => {
    if (!canSubmit) return;
    onSubmit(Array.from(selected));
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-5",
        embedded ? "" : "h-full",
      )}
    >
      <div>
        <h2 className="text-2xl font-extrabold leading-tight text-dark">
          {title}
        </h2>
        <p className="mt-1 text-sm font-semibold text-muted-foreground">
          {subtitle}
        </p>
        <p
          className={cn(
            "mt-3 text-xs font-black uppercase tracking-widest",
            counterColor,
          )}
        >
          {count} av {MIN_SELECTED} valda
          {canSubmit && " ✓"}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-2.5">
        {INTERESTS.map((interest) => {
          const meta = INTEREST_META[interest];
          const isSelected = selected.has(interest);
          return (
            <button
              key={interest}
              type="button"
              onClick={() => toggle(interest)}
              aria-pressed={isSelected}
              className={cn(
                "relative flex aspect-square flex-col items-center justify-center gap-1 rounded-2xl p-2 text-center transition-all duration-150 active:scale-95",
                INTEREST_ICON_BG[interest],
                isSelected
                  ? "shadow-[0_8px_18px_-8px_rgba(29,53,87,0.45)] ring-4 ring-offset-1 ring-offset-white"
                  : "shadow-sm ring-1 ring-black/5",
              )}
              style={
                isSelected
                  ? ({ "--tw-ring-color": meta.color } as React.CSSProperties)
                  : undefined
              }
            >
              <span className="text-2xl drop-shadow-sm" aria-hidden>
                {meta.emoji}
              </span>
              <span className="text-[10px] font-extrabold leading-tight text-dark">
                {meta.name}
              </span>
              {isSelected && (
                <span
                  aria-hidden
                  className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-md"
                >
                  ✓
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "flex gap-2",
          embedded ? "pt-1" : "mt-auto pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-2",
        )}
      >
        {onBack && (
          <Button
            type="button"
            variant="outline"
            onClick={onBack}
            className="h-12 flex-1 rounded-2xl text-sm font-extrabold"
          >
            Tillbaka
          </Button>
        )}
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className={cn(
            "h-12 rounded-2xl text-sm font-extrabold shadow-[0_10px_24px_-8px_rgba(230,57,70,0.45)] transition-all active:scale-[0.98] disabled:shadow-none",
            onBack ? "flex-[2]" : "flex-1",
          )}
        >
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
