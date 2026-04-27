"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, Check, Info } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

import { Button } from "@/components/ui/button";
import { useRatings } from "@/features/training/use-ratings";
import {
  DIFFICULTY_EMOJI,
  DIFFICULTY_LABEL,
} from "@/lib/difficulty";
import {
  INTEREST_ICON_BG,
  INTEREST_META,
  INTERESTS,
} from "@/lib/interests";
import {
  getRatingLevel,
  getRatingLevelDisplay,
} from "@/lib/rating";
import {
  drawQuestions,
  getPoolSize,
  timeLimitForMode,
} from "@/lib/training";
import { cn } from "@/lib/utils";
import type { Difficulty, Interest, Question } from "@/types/quiz";
import type { TrainingMode } from "@/types/training";

const DIFFICULTIES: Difficulty[] = ["easy", "medium", "hard"];
const SESSION_KEY = "quiz-app.current-training";
const QUESTIONS_PER_SESSION = 10;

function isInterestValue(value: string | null): value is Interest {
  return value !== null && (INTERESTS as readonly string[]).includes(value);
}

function isDifficulty(value: string | null): value is Difficulty {
  return value !== null && (DIFFICULTIES as readonly string[]).includes(value);
}

export default function TrainingStartPage() {
  return (
    <Suspense fallback={null}>
      <TrainingStartContent />
    </Suspense>
  );
}

function TrainingStartContent() {
  const router = useRouter();
  const params = useSearchParams();
  const { ratings } = useRatings();

  const presetInterest = params.get("interest");
  const presetDifficulty = params.get("difficulty");

  const [interest, setInterest] = useState<Interest | null>(
    isInterestValue(presetInterest) ? presetInterest : null,
  );
  const [difficulty, setDifficulty] = useState<Difficulty | null>(
    isDifficulty(presetDifficulty) ? presetDifficulty : null,
  );
  const [mode, setMode] = useState<TrainingMode>("classic");
  const [infoOpen, setInfoOpen] = useState(false);

  const poolSize =
    interest && difficulty ? getPoolSize(interest, difficulty) : null;
  const canStart = poolSize !== null && poolSize > 0;

  const handleStart = () => {
    if (!interest || !difficulty || !canStart) return;
    const items = drawQuestions(
      interest,
      difficulty,
      QUESTIONS_PER_SESSION,
    );
    if (items.length === 0) return;
    const timeLimitSeconds = timeLimitForMode(mode);
    const questions: Question[] = items.map((item) => ({
      id: item.id,
      text: item.text,
      options: item.options,
      correctIndex: item.correctIndex,
      timeLimitSeconds,
    }));
    const config = {
      interest,
      difficulty,
      mode,
      questions,
      startedAt: Date.now(),
    };
    try {
      window.sessionStorage.setItem(SESSION_KEY, JSON.stringify(config));
    } catch {
      // ignore
    }
    router.push("/traning/session");
  };

  return (
    <div className="relative flex min-h-full flex-col px-6 pt-[calc(env(safe-area-inset-top)+1.25rem)] pb-6">
      <button
        type="button"
        onClick={() => router.push("/")}
        className="flex items-center gap-1.5 self-start rounded-full bg-white px-3 py-1.5 text-sm font-bold text-dark shadow-sm ring-1 ring-black/5 transition-transform active:scale-95"
        aria-label="Tillbaka"
      >
        <ArrowLeft className="size-4" />
        Tillbaka
      </button>

      <div className="mt-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-emerald-800">
              💪 Träningsläge
            </div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight text-dark">
              Pusha din kunskap
            </h1>
            <p className="mt-1 text-sm font-semibold text-muted-foreground">
              Välj intresse, svårighet och läge — vi drar slumpmässiga frågor.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setInfoOpen(true)}
            aria-label="Hur fungerar rating?"
            className="mt-1 flex size-10 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5 transition-transform active:scale-95"
          >
            <Info className="size-5 text-sky-700" />
          </button>
        </div>
      </div>

      <section className="mt-7">
        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
          Steg 1 · Intresse
        </p>
        <div className="mt-3 grid grid-cols-3 gap-3">
          {INTERESTS.map((option) => {
            const isSelected = interest === option;
            const meta = INTEREST_META[option];
            const r = ratings ? ratings[option] : null;
            const played = r !== null && r.gamesPlayed > 0;
            const level = played ? getRatingLevel(r.rating) : null;
            const display = level ? getRatingLevelDisplay(level) : null;
            return (
              <button
                key={option}
                type="button"
                onClick={() => setInterest(option)}
                aria-pressed={isSelected}
                className={cn(
                  "relative flex min-h-[112px] flex-col items-center justify-center gap-1 rounded-2xl px-2 py-3 text-center transition-all duration-150 active:scale-95",
                  INTEREST_ICON_BG[option],
                  isSelected
                    ? "shadow-[0_10px_24px_-8px_rgba(14,165,233,0.5)] ring-4 ring-sky-500 ring-offset-2 ring-offset-background"
                    : "shadow-sm ring-1 ring-black/5",
                )}
              >
                <span className="text-3xl leading-none" aria-hidden>
                  {meta.emoji}
                </span>
                <span className="text-[11px] font-black leading-tight text-dark">
                  {meta.name}
                </span>
                {played && r && display ? (
                  <span
                    className="text-[9px] font-extrabold leading-tight tabular-nums"
                    style={{ color: display.color }}
                  >
                    {r.rating} · {display.name}{" "}
                    <span aria-hidden>{display.emoji}</span>
                  </span>
                ) : (
                  <span className="text-[9px] font-semibold leading-tight text-muted-foreground">
                    Inte spelat ännu
                  </span>
                )}
                {isSelected && (
                  <span
                    aria-hidden
                    className="absolute -top-1.5 -right-1.5 flex size-5 items-center justify-center rounded-full bg-sky-500 text-white shadow-md"
                  >
                    <Check className="size-3" strokeWidth={3} />
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
          Steg 2 · Svårighet
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2">
          {DIFFICULTIES.map((d) => {
            const isSelected = difficulty === d;
            return (
              <button
                key={d}
                type="button"
                onClick={() => setDifficulty(d)}
                aria-pressed={isSelected}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl px-3 py-3 transition-all duration-150 active:scale-95",
                  isSelected
                    ? "bg-sky-500 text-white shadow-[0_8px_20px_-6px_rgba(14,165,233,0.5)]"
                    : "bg-white text-dark ring-1 ring-black/10",
                )}
              >
                <span className="text-lg" aria-hidden>
                  {DIFFICULTY_EMOJI[d]}
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider">
                  {DIFFICULTY_LABEL[d]}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-6">
        <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
          Steg 3 · Läge
        </p>
        <div className="mt-3 grid grid-cols-2 gap-3">
          <ModeCard
            selected={mode === "classic"}
            onSelect={() => setMode("classic")}
            emoji="🎯"
            title="Klassisk"
            subtitle="15 sek per fråga"
          />
          <ModeCard
            selected={mode === "fast"}
            onSelect={() => setMode("fast")}
            emoji="⚡"
            title="Snabb"
            subtitle="7 sek · dubbel rating"
          />
        </div>
      </section>

      <div className="mt-auto pt-6">
        {poolSize !== null && poolSize === 0 && (
          <p className="mb-3 rounded-2xl bg-amber-100 px-4 py-3 text-center text-xs font-bold text-amber-900 ring-1 ring-amber-200">
            För få frågor i denna kombination ännu — prova en annan.
          </p>
        )}
        {poolSize !== null && poolSize > 0 && (
          <p className="mb-3 text-center text-xs font-semibold text-muted-foreground">
            {poolSize} {poolSize === 1 ? "fråga" : "frågor"} tillgängliga · vi
            drar {Math.min(QUESTIONS_PER_SESSION, poolSize)}
          </p>
        )}
        <Button
          type="button"
          onClick={handleStart}
          disabled={!canStart}
          className="h-14 w-full rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-base font-extrabold text-white shadow-[0_12px_28px_-8px_rgba(14,165,233,0.55)] transition-all hover:from-sky-500 hover:to-emerald-500 active:scale-[0.98] disabled:bg-neutral-300 disabled:bg-none disabled:shadow-none"
        >
          Starta session
        </Button>
      </div>

      <AnimatePresence>
        {infoOpen && (
          <RatingInfoDialog
            key="rating-info"
            onClose={() => setInfoOpen(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

type RatingInfoDialogProps = {
  onClose: () => void;
};

function RatingInfoDialog({ onClose }: RatingInfoDialogProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="absolute inset-0 z-20 flex items-end justify-center bg-black/45 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 280 }}
        animate={{ y: 0 }}
        exit={{ y: 280 }}
        transition={{ type: "spring", damping: 24, stiffness: 260 }}
        className="w-full rounded-t-[2rem] bg-white p-6 pb-[max(env(safe-area-inset-bottom),1.5rem)] shadow-[0_-8px_32px_-4px_rgba(29,53,87,0.25)]"
        onClick={(event) => event.stopPropagation()}
      >
        <h3 className="text-xl font-extrabold text-dark">
          Hur fungerar rating?
        </h3>
        <p className="mt-1 text-xs font-semibold text-muted-foreground">
          Ett betyg per intresse — ditt mått på kunskap.
        </p>

        <ul className="mt-5 space-y-2.5 text-sm font-medium text-dark">
          <li className="flex items-start gap-2">🎯 Alla startar på 1000.</li>
          <li className="flex items-start gap-2">
            ✅ Rätt svar höjer din rating, fel sänker den.
          </li>
          <li className="flex items-start gap-2">
            🔥 Svårare frågor påverkar mer (svår: +15 / -5, lätt: +6 / -10).
          </li>
          <li className="flex items-start gap-2">
            ⚡ Snabba svar (under halva tiden) ger +3 bonus.
          </li>
          <li className="flex items-start gap-2">
            💨 Snabb-läget fördubblar all rating-effekt.
          </li>
        </ul>

        <button
          type="button"
          onClick={onClose}
          className="mt-5 h-12 w-full rounded-2xl bg-dark font-extrabold text-white transition-transform active:scale-[0.98]"
        >
          Stäng
        </button>
      </motion.div>
    </motion.div>
  );
}

type ModeCardProps = {
  selected: boolean;
  onSelect: () => void;
  emoji: string;
  title: string;
  subtitle: string;
};

function ModeCard({
  selected,
  onSelect,
  emoji,
  title,
  subtitle,
}: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={selected}
      className={cn(
        "relative flex flex-col items-start gap-1 rounded-2xl p-4 text-left transition-all duration-150 active:scale-[0.98]",
        selected
          ? "bg-gradient-to-br from-sky-500 to-emerald-500 text-white shadow-[0_10px_24px_-8px_rgba(14,165,233,0.5)]"
          : "bg-white text-dark ring-1 ring-black/10",
      )}
    >
      <span className="text-2xl" aria-hidden>
        {emoji}
      </span>
      <span className="text-base font-extrabold">{title}</span>
      <span
        className={cn(
          "text-[11px] font-semibold",
          selected ? "text-white/90" : "text-muted-foreground",
        )}
      >
        {subtitle}
      </span>
      {selected && (
        <span
          aria-hidden
          className="absolute top-3 right-3 flex size-5 items-center justify-center rounded-full bg-white text-sky-600 shadow-sm"
        >
          <Check className="size-3" strokeWidth={3} />
        </span>
      )}
    </button>
  );
}
