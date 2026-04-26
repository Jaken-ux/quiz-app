"use client";

import { Heart } from "lucide-react";
import { motion } from "framer-motion";

import { useLikes } from "@/features/quiz/use-likes";
import { cn } from "@/lib/utils";

type LikeButtonProps = {
  quizId: string;
  baseCount: number;
  variant?: "compact" | "stacked" | "pill";
  className?: string;
};

export function LikeButton({
  quizId,
  baseCount,
  variant = "compact",
  className,
}: LikeButtonProps) {
  const { isLiked, toggle } = useLikes();
  const liked = isLiked(quizId);
  const count = baseCount + (liked ? 1 : 0);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    toggle(quizId);
  };

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={liked}
        aria-label={liked ? "Ta bort gillamarkering" : "Gilla quiz"}
        className={cn(
          "inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold transition-all duration-150 active:scale-95",
          liked
            ? "bg-rose-500 text-white shadow-[0_8px_20px_-6px_rgba(244,63,94,0.55)]"
            : "bg-white text-dark ring-1 ring-black/10 shadow-sm",
          className,
        )}
      >
        <motion.span
          animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(
              "size-4 transition-colors",
              liked && "fill-current",
            )}
            strokeWidth={2.5}
          />
        </motion.span>
        <span className="tabular-nums">{count.toLocaleString("sv-SE")}</span>
      </button>
    );
  }

  if (variant === "stacked") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-pressed={liked}
        aria-label={liked ? "Ta bort gillamarkering" : "Gilla quiz"}
        className={cn(
          "flex flex-col items-center gap-0.5 rounded-2xl px-3 py-2 transition-all duration-150 active:scale-90",
          liked
            ? "text-rose-500"
            : "text-muted-foreground hover:text-rose-400",
          className,
        )}
      >
        <motion.span
          animate={liked ? { scale: [1, 1.4, 1] } : { scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Heart
            className={cn(
              "size-6 transition-colors",
              liked && "fill-current",
            )}
            strokeWidth={2}
          />
        </motion.span>
        <span className="text-[10px] font-black tabular-nums">
          {count.toLocaleString("sv-SE")}
        </span>
      </button>
    );
  }

  // compact
  return (
    <button
      type="button"
      onClick={handleClick}
      aria-pressed={liked}
      aria-label={liked ? "Ta bort gillamarkering" : "Gilla quiz"}
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-bold transition-all duration-150 active:scale-90",
        liked ? "text-rose-500" : "text-muted-foreground",
        className,
      )}
    >
      <motion.span
        animate={liked ? { scale: [1, 1.3, 1] } : { scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <Heart
          className={cn(
            "size-3.5 transition-colors",
            liked && "fill-current",
          )}
          strokeWidth={2.5}
        />
      </motion.span>
      <span className="tabular-nums">{count.toLocaleString("sv-SE")}</span>
    </button>
  );
}
