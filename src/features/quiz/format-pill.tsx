"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { FORMAT_META } from "@/lib/formats";
import { cn } from "@/lib/utils";
import type { QuizFormat } from "@/types/quiz";

type FormatPillProps = {
  format: QuizFormat;
  className?: string;
  size?: "sm" | "md";
  showName?: boolean;
};

export function FormatPill({
  format,
  className,
  size = "sm",
  showName = true,
}: FormatPillProps) {
  const meta = FORMAT_META[format];
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label={`${meta.name} – mer info`}
        className={cn(
          "inline-flex items-center gap-1 rounded-full bg-neutral-100 font-bold text-muted-foreground ring-1 ring-black/5 transition active:scale-95",
          size === "sm"
            ? "px-2 py-0.5 text-[10px]"
            : "px-2.5 py-1 text-xs",
          className,
        )}
      >
        <span aria-hidden>{meta.emoji}</span>
        {showName && <span>{meta.name}</span>}
      </button>

      <AnimatePresence>
        {open && (
          <FormatInfoSheet format={format} onClose={() => setOpen(false)} />
        )}
      </AnimatePresence>
    </>
  );
}

type FormatInfoSheetProps = {
  format: QuizFormat;
  onClose: () => void;
};

function FormatInfoSheet({ format, onClose }: FormatInfoSheetProps) {
  const meta = FORMAT_META[format];
  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={onClose}
        className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
      />
      <motion.div
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        className="fixed inset-x-0 bottom-0 z-50 rounded-t-[2rem] bg-white px-6 pt-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.25)]"
      >
        <div
          aria-hidden
          className="mx-auto h-1.5 w-12 rounded-full bg-black/10"
        />
        <div className="mt-5 flex items-center gap-3">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-neutral-100 text-3xl shadow-inner">
            {meta.emoji}
          </div>
          <div>
            <h3 className="text-lg font-extrabold text-dark">{meta.name}</h3>
            <p className="text-xs font-bold text-muted-foreground">
              Format
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm font-medium text-muted-foreground">
          {meta.description}
        </p>
        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-2xl bg-neutral-100 text-sm font-extrabold text-dark transition active:scale-[0.98]"
        >
          Stäng
        </button>
      </motion.div>
    </>
  );
}
