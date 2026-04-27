"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { useState, useSyncExternalStore } from "react";

import { InterestPicker } from "@/features/auth/interest-picker";
import { useUser } from "@/features/auth/use-user";
import {
  INTEREST_ICON_BG,
  INTEREST_META,
  interestToSlug,
} from "@/lib/interests";
import { cn } from "@/lib/utils";
import type { Interest } from "@/types/quiz";

function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "nyligen";
  }
}

export default function ProfilePage() {
  const { user, updateInterests } = useUser();
  const mounted = useHasMounted();
  const [editorOpen, setEditorOpen] = useState(false);

  const interests = user?.interests ?? [];

  return (
    <div className="flex min-h-full flex-col pb-6">
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#1D3557] via-[#2C5282] to-[#E63946] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-6 -right-6 h-40 w-40 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-10 bottom-6 size-3 rounded-full bg-white/50"
        />

        <div className="relative flex flex-col items-center text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-white/25 text-6xl shadow-lg ring-4 ring-white/40 backdrop-blur">
            {user?.avatar ?? "👤"}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-white drop-shadow-sm">
            {user?.username ?? "Spelare"}
          </h1>
          {mounted && user && (
            <p className="mt-1 text-xs font-semibold text-white/90">
              Medlem sedan {formatDate(user.createdAt)}
            </p>
          )}
        </div>
      </header>

      <section className="px-6 pt-6">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-extrabold text-dark">Mina intressen</h2>
          <button
            type="button"
            onClick={() => setEditorOpen(true)}
            className="text-xs font-extrabold text-primary underline-offset-2 transition active:scale-95 hover:underline"
          >
            Ändra
          </button>
        </div>
        <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
          Vi använder dem till att slumpa fram quiz du gillar.
        </p>

        {interests.length === 0 ? (
          <div className="mt-3 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5">
            <p className="text-sm font-medium text-muted-foreground">
              Inga intressen valda än.
            </p>
            <button
              type="button"
              onClick={() => setEditorOpen(true)}
              className="mt-3 h-10 rounded-xl bg-primary px-4 text-xs font-extrabold text-primary-foreground shadow-sm transition active:scale-95"
            >
              Gör smaktestet
            </button>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {interests.map((i) => (
              <Link
                key={i}
                href={`/intresse/${interestToSlug(i)}`}
                className={cn(
                  "inline-flex items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-bold ring-1 ring-black/5 transition active:scale-95",
                  INTEREST_ICON_BG[i],
                )}
              >
                <span aria-hidden>{INTEREST_META[i].emoji}</span>
                <span className="text-dark">{INTEREST_META[i].name}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <div className="flex flex-col items-center gap-3 px-6 pt-10 pb-2 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-amber-100 text-2xl">
          🚧
        </div>
        <p className="text-sm font-semibold text-dark">
          Inställningar, vänner och topplistor är på väg hit.
        </p>
      </div>

      <InterestEditorSheet
        open={editorOpen}
        initial={interests}
        onClose={() => setEditorOpen(false)}
        onSubmit={(next) => {
          updateInterests(next);
          setEditorOpen(false);
        }}
      />
    </div>
  );
}

type InterestEditorSheetProps = {
  open: boolean;
  initial: Interest[];
  onClose: () => void;
  onSubmit: (interests: Interest[]) => void;
};

function InterestEditorSheet({
  open,
  initial,
  onClose,
  onSubmit,
}: InterestEditorSheetProps) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            key="editor-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.div
            key="editor-sheet"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 32 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[90dvh] overflow-y-auto rounded-t-[2rem] bg-white px-6 pt-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-[0_-12px_32px_-12px_rgba(0,0,0,0.25)]"
          >
            <div
              aria-hidden
              className="mx-auto mb-5 h-1.5 w-12 rounded-full bg-black/10"
            />
            <InterestPicker
              embedded
              initial={initial}
              title="Ändra dina intressen"
              subtitle="Vi använder dem till att slumpa rätt quiz."
              submitLabel="Spara"
              onSubmit={onSubmit}
              onBack={onClose}
            />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
