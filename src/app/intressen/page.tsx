"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";

import { quizzes } from "@/data/quizzes";
import { useUser } from "@/features/auth/use-user";
import {
  INTERESTS,
  INTEREST_BLURB,
  INTEREST_ICON_BG,
  INTEREST_META,
  interestToSlug,
} from "@/lib/interests";
import { cn } from "@/lib/utils";
import type { Interest } from "@/types/quiz";

export default function AllInterestsPage() {
  const router = useRouter();
  const { user } = useUser();
  const userInterests = useMemo(
    () => new Set(user?.interests ?? []),
    [user?.interests],
  );

  const counts = useMemo(() => {
    const map = {} as Record<Interest, number>;
    for (const interest of INTERESTS) map[interest] = 0;
    for (const quiz of quizzes) {
      for (const i of quiz.interests) {
        map[i] += 1;
      }
    }
    return map;
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="flex flex-col pb-8"
    >
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#1D3557] via-[#2C5282] to-[#7C3AED] px-6 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-9">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-10 -right-10 h-44 w-44 rounded-full bg-white/15 blur-2xl"
        />
        <button
          type="button"
          onClick={() => router.back()}
          className="relative inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1.5 text-sm font-bold text-white shadow-sm backdrop-blur transition-transform active:scale-95"
          aria-label="Tillbaka"
        >
          <ArrowLeft className="size-4" />
          Tillbaka
        </button>

        <div className="relative mt-6">
          <p className="text-[11px] font-black uppercase tracking-widest text-white/80">
            Alla intressen
          </p>
          <h1 className="mt-1 text-3xl font-extrabold leading-tight text-white drop-shadow-sm">
            Vad sneglar du på idag?
          </h1>
          <p className="mt-1 max-w-[280px] text-sm font-semibold text-white/90">
            12 teman, en knapptryckning bort. Dina valda är markerade.
          </p>
        </div>
      </header>

      <section className="grid grid-cols-2 gap-3 px-6 pt-6">
        {INTERESTS.map((interest) => {
          const meta = INTEREST_META[interest];
          const count = counts[interest];
          const selected = userInterests.has(interest);
          return (
            <Link
              key={interest}
              href={`/intresse/${interestToSlug(interest)}`}
              className={cn(
                "relative flex flex-col gap-1.5 rounded-2xl p-4 shadow-sm ring-1 ring-black/5 transition-transform active:scale-[0.97]",
                INTEREST_ICON_BG[interest],
              )}
            >
              {selected && (
                <span
                  aria-label="Ditt valda intresse"
                  className="absolute right-2.5 top-2.5 flex size-5 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-black text-white shadow-sm"
                >
                  ✓
                </span>
              )}
              <span className="text-3xl drop-shadow-sm" aria-hidden>
                {meta.emoji}
              </span>
              <p className="text-sm font-extrabold leading-tight text-dark">
                {meta.name}
              </p>
              <p className="line-clamp-2 text-[11px] font-medium leading-snug text-dark/70">
                {INTEREST_BLURB[interest]}
              </p>
              <p className="mt-1 text-[10px] font-black uppercase tracking-wider text-dark/60 tabular-nums">
                {count} {count === 1 ? "quiz" : "quiz"}
              </p>
            </Link>
          );
        })}
      </section>
    </motion.div>
  );
}
