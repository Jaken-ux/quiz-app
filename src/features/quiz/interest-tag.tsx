"use client";

import { useRouter } from "next/navigation";

import {
  INTEREST_ICON_BG,
  INTEREST_META,
  interestToSlug,
} from "@/lib/interests";
import { cn } from "@/lib/utils";
import type { Interest } from "@/types/quiz";

type InterestTagProps = {
  interest: Interest;
  size?: "sm" | "md";
  className?: string;
};

/**
 * Clickable pill that navigates to /intresse/[slug]. Implemented as a
 * <button> rather than <Link> because tags often live inside other
 * <Link> cards (quiz cards), and nested <a> elements are invalid HTML.
 * The router push gives us the same UX without the markup foot-gun.
 */
export function InterestTag({
  interest,
  size = "sm",
  className,
}: InterestTagProps) {
  const router = useRouter();
  const meta = INTEREST_META[interest];
  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        router.push(`/intresse/${interestToSlug(interest)}`);
      }}
      className={cn(
        "inline-flex items-center gap-1 rounded-full font-bold ring-1 ring-black/5 transition active:scale-95",
        size === "sm"
          ? "px-2 py-0.5 text-[10px]"
          : "px-2.5 py-1 text-xs",
        INTEREST_ICON_BG[interest],
        "text-dark",
        className,
      )}
    >
      <span aria-hidden>{meta.emoji}</span>
      <span>{meta.name}</span>
    </button>
  );
}
