"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Suspense,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";

import { Button } from "@/components/ui/button";
import {
  CATEGORY_EMOJI,
  CATEGORY_ICON_BG,
  CATEGORY_LABEL,
  DIFFICULTY_LABEL,
  DIFFICULTY_PILL,
} from "@/features/quiz/category-meta";
import {
  compareLevels,
  getLevelProgress,
  getRatingLevel,
  getRatingLevelDisplay,
  getRatingLevelRange,
} from "@/lib/rating";
import { drawQuestions, timeLimitForMode } from "@/lib/training";
import { cn } from "@/lib/utils";
import type { Category, Difficulty, Question } from "@/types/quiz";
import type { TrainingMode } from "@/types/training";

const SESSION_KEY = "quiz-app.current-training";
const QUESTIONS_PER_SESSION = 10;

const CONFETTI_EMOJIS = ["✨", "💪", "🎯", "⭐", "🌟"];

const CONFETTI = Array.from({ length: 22 }, (_, i) => ({
  emoji: CONFETTI_EMOJIS[i % CONFETTI_EMOJIS.length],
  startX: Math.random() * 100,
  delay: Math.random() * 0.5,
  duration: 2.0 + Math.random() * 1.5,
  rotate: Math.random() * 720 - 360,
}));

const LEVELUP_CONFETTI = Array.from({ length: 18 }, (_, i) => ({
  emoji: ["🎉", "🏆", "⭐", "✨", "🌟"][i % 5],
  startX: Math.random() * 100,
  delay: 0.4 + Math.random() * 0.4,
  duration: 1.8 + Math.random() * 1.2,
  rotate: Math.random() * 720 - 360,
}));

function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function getHeadline(correctRatio: number): string {
  if (correctRatio >= 0.85) return "Toppenövning! 💪";
  if (correctRatio >= 0.6) return "Bra träning! 🎯";
  if (correctRatio >= 0.3) return "Fortsätt så!";
  return "Repetition är nyckeln.";
}

export default function TrainingResultPage() {
  return (
    <Suspense fallback={null}>
      <TrainingResultContent />
    </Suspense>
  );
}

function TrainingResultContent() {
  const router = useRouter();
  const params = useSearchParams();
  const hasMounted = useHasMounted();

  const data = useMemo(() => {
    const total = Number(params.get("total") ?? 0);
    if (!Number.isFinite(total) || total <= 0) return null;
    const mode = params.get("mode");
    const category = params.get("category");
    const difficulty = params.get("difficulty");
    if (!mode || !category || !difficulty) return null;
    return {
      score: Number(params.get("score") ?? 0),
      correct: Number(params.get("correct") ?? 0),
      total,
      avgTime: Number(params.get("avgTime") ?? 0),
      totalTime: Number(params.get("totalTime") ?? 0),
      mode: mode as TrainingMode,
      category: category as Category,
      difficulty: difficulty as Difficulty,
      ratingBefore: Number(params.get("ratingBefore") ?? 1000),
      ratingAfter: Number(params.get("ratingAfter") ?? 1000),
      ratingDelta: Number(params.get("ratingDelta") ?? 0),
    };
  }, [params]);

  if (!data) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 pt-[calc(env(safe-area-inset-top)+2rem)] text-center">
        <p className="text-2xl font-extrabold text-dark">
          Inget resultat att visa
        </p>
        <Link
          href="/traning"
          className="h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 px-6 py-3 font-extrabold text-white shadow-md"
        >
          Starta en träning
        </Link>
      </div>
    );
  }

  const {
    score,
    correct,
    total,
    avgTime,
    totalTime,
    mode,
    category,
    difficulty,
    ratingBefore,
    ratingAfter,
    ratingDelta,
  } = data;
  const correctRatio = total > 0 ? correct / total : 0;
  const headline = getHeadline(correctRatio);

  const levelBefore = getRatingLevel(ratingBefore);
  const levelAfter = getRatingLevel(ratingAfter);
  const levelCmp = compareLevels(levelBefore, levelAfter);
  const leveledUp = levelCmp < 0;
  const leveledDown = levelCmp > 0;
  const afterDisplay = getRatingLevelDisplay(levelAfter);
  const afterRange = getRatingLevelRange(levelAfter);
  const afterProgress = getLevelProgress(ratingAfter);
  const ratingToNextLevel = Math.max(0, afterRange.max - ratingAfter);
  const isMaster = levelAfter === "master";

  const handleStartNew = () => {
    const items = drawQuestions(category, difficulty, QUESTIONS_PER_SESSION);
    if (items.length === 0) {
      router.push("/traning");
      return;
    }
    const timeLimitSeconds = timeLimitForMode(mode);
    const questions: Question[] = items.map((item) => ({
      id: item.id,
      text: item.text,
      options: item.options,
      correctIndex: item.correctIndex,
      timeLimitSeconds,
    }));
    const config = {
      category,
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
    <div className="relative flex h-full flex-col overflow-hidden bg-gradient-to-b from-[#E0F2FE] via-[#D1FAE5] to-[#FEFCE8] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-6">
      {hasMounted && (
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden"
        >
          {CONFETTI.map((c, i) => (
            <motion.span
              key={i}
              initial={{ y: -40, opacity: 1, rotate: 0 }}
              animate={{ y: 900, opacity: 0, rotate: c.rotate }}
              transition={{
                duration: c.duration,
                delay: c.delay,
                ease: "linear",
              }}
              className="absolute text-2xl"
              style={{ left: `${c.startX}%`, top: 0 }}
            >
              {c.emoji}
            </motion.span>
          ))}
          {leveledUp &&
            LEVELUP_CONFETTI.map((c, i) => (
              <motion.span
                key={`up-${i}`}
                initial={{ y: -40, opacity: 1, rotate: 0 }}
                animate={{ y: 900, opacity: 0, rotate: c.rotate }}
                transition={{
                  duration: c.duration,
                  delay: c.delay,
                  ease: "linear",
                }}
                className="absolute text-3xl"
                style={{ left: `${c.startX}%`, top: 0 }}
              >
                {c.emoji}
              </motion.span>
            ))}
        </div>
      )}

      <div className="relative flex flex-1 flex-col items-center overflow-y-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-full bg-sky-200/70 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-sky-900"
        >
          💪 Träningspass klart
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 180,
            damping: 16,
            delay: 0.15,
          }}
          className="mt-3 text-4xl font-extrabold leading-tight text-dark"
        >
          {headline}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          className="mt-3 flex items-center gap-2"
        >
          <div
            className={cn(
              "flex size-10 items-center justify-center rounded-xl text-xl shadow-inner",
              CATEGORY_ICON_BG[category],
            )}
            aria-hidden
          >
            {CATEGORY_EMOJI[category]}
          </div>
          <div className="text-left">
            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
              {CATEGORY_LABEL[category]}
            </p>
            <p
              className={cn(
                "mt-0.5 inline-flex rounded-full px-2 py-0.5 text-[10px] font-bold",
                DIFFICULTY_PILL[difficulty],
              )}
            >
              {DIFFICULTY_LABEL[difficulty]} ·{" "}
              {mode === "fast" ? "Snabb ⚡" : "Klassisk 🎯"}
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 160,
            damping: 14,
            delay: 0.3,
          }}
          className="mt-6 rounded-[2rem] bg-white px-10 py-5 shadow-[0_12px_40px_-10px_rgba(29,53,87,0.25)] ring-1 ring-black/5"
        >
          <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
            Poäng
          </p>
          <p className="mt-1 text-6xl font-black tabular-nums text-emerald-600">
            {score.toLocaleString("sv-SE")}
          </p>
          <p className="mt-1 text-xs font-bold text-muted-foreground">
            {correct} av {total} rätt
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-5 grid w-full grid-cols-2 gap-3"
        >
          <StatTile
            label="Snittid / fråga"
            value={`${avgTime.toFixed(1)} s`}
          />
          <StatTile label="Total tid" value={`${Math.round(totalTime)} s`} />
        </motion.div>

        {leveledUp && (
          <LevelUpBanner
            levelName={afterDisplay.name}
            levelEmoji={afterDisplay.emoji}
            levelColor={afterDisplay.color}
          />
        )}

        <RatingChangeCard
          category={category}
          ratingBefore={ratingBefore}
          ratingAfter={ratingAfter}
          ratingDelta={ratingDelta}
          levelName={afterDisplay.name}
          levelEmoji={afterDisplay.emoji}
          levelColor={afterDisplay.color}
          progress={afterProgress}
          ratingToNextLevel={ratingToNextLevel}
          isMaster={isMaster}
        />

        {leveledDown && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="mt-3 text-xs font-semibold text-muted-foreground"
          >
            Du landade i {afterDisplay.name} {afterDisplay.emoji}
          </motion.p>
        )}
      </div>

      <div className="relative mt-5 flex flex-col gap-2.5">
        <Button
          type="button"
          onClick={handleStartNew}
          className="h-14 w-full rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 text-base font-extrabold text-white shadow-[0_12px_28px_-8px_rgba(14,165,233,0.55)] transition-all hover:from-sky-500 hover:to-emerald-500 active:scale-[0.98]"
        >
          Starta ny session
        </Button>
        <Link
          href="/traning"
          className="flex h-12 w-full items-center justify-center rounded-2xl bg-white text-sm font-extrabold text-dark shadow-sm ring-1 ring-black/10 transition-transform active:scale-[0.98]"
        >
          Byt kategori
        </Link>
        <Link
          href="/"
          className="flex h-10 w-full items-center justify-center text-sm font-bold text-muted-foreground transition-transform active:scale-[0.98]"
        >
          Tillbaka till hem
        </Link>
      </div>
    </div>
  );
}

type LevelUpBannerProps = {
  levelName: string;
  levelEmoji: string;
  levelColor: string;
};

function LevelUpBanner({
  levelName,
  levelEmoji,
  levelColor,
}: LevelUpBannerProps) {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{
        type: "spring",
        stiffness: 220,
        damping: 14,
        delay: 0.4,
      }}
      className="relative mt-5 w-full overflow-hidden rounded-2xl bg-gradient-to-br from-amber-300 via-pink-400 to-purple-500 p-5 text-center text-white shadow-[0_16px_36px_-10px_rgba(168,85,247,0.55)]"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/30 blur-xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-4 -left-4 h-20 w-20 rounded-full bg-white/20 blur-xl"
      />
      <motion.p
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 1.2, repeat: 2 }}
        className="text-[11px] font-black uppercase tracking-[0.25em] drop-shadow"
      >
        ⬆️ Level up!
      </motion.p>
      <p className="mt-1 text-xl font-extrabold drop-shadow-sm">
        Du nådde {levelName}{" "}
        <span aria-hidden style={{ color: levelColor }}>
          {levelEmoji}
        </span>
      </p>
    </motion.div>
  );
}

type RatingChangeCardProps = {
  category: Category;
  ratingBefore: number;
  ratingAfter: number;
  ratingDelta: number;
  levelName: string;
  levelEmoji: string;
  levelColor: string;
  progress: number;
  ratingToNextLevel: number;
  isMaster: boolean;
};

function RatingChangeCard({
  category,
  ratingBefore,
  ratingAfter,
  ratingDelta,
  levelName,
  levelEmoji,
  levelColor,
  progress,
  ratingToNextLevel,
  isMaster,
}: RatingChangeCardProps) {
  const deltaSign = ratingDelta > 0 ? "+" : "";
  const deltaArrow =
    ratingDelta > 0 ? "⬆️" : ratingDelta < 0 ? "⬇️" : "→";
  const deltaClass =
    ratingDelta > 0
      ? "bg-emerald-100 text-emerald-700"
      : ratingDelta < 0
        ? "bg-rose-100 text-rose-700"
        : "bg-neutral-100 text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="mt-5 w-full rounded-2xl bg-white p-5 text-left shadow-sm ring-1 ring-black/5"
    >
      <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground">
        Rating · {CATEGORY_LABEL[category]}
      </p>

      <div className="mt-2 flex items-baseline gap-3">
        <span className="text-sm font-bold tabular-nums text-muted-foreground">
          {ratingBefore.toLocaleString("sv-SE")}
        </span>
        <span className="text-base text-muted-foreground" aria-hidden>
          →
        </span>
        <span
          className="text-3xl font-black tabular-nums"
          style={{ color: levelColor }}
        >
          <AnimatedNumber from={ratingBefore} to={ratingAfter} />
        </span>
        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-extrabold tabular-nums",
            deltaClass,
          )}
        >
          <span aria-hidden>{deltaArrow}</span>
          {deltaSign}
          {ratingDelta}
        </span>
      </div>

      <div className="mt-4">
        <p className="flex items-center gap-1.5 text-sm font-extrabold">
          <span aria-hidden>{levelEmoji}</span>
          <span style={{ color: levelColor }}>{levelName}</span>
        </p>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-black/5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
            className="h-full rounded-full"
            style={{ backgroundColor: levelColor }}
          />
        </div>
        <p className="mt-1.5 text-[11px] font-semibold text-muted-foreground">
          {isMaster
            ? "Maxnivå nådd"
            : `${ratingToNextLevel} XP kvar till nästa nivå`}
        </p>
      </div>
    </motion.div>
  );
}

type AnimatedNumberProps = {
  from: number;
  to: number;
  duration?: number;
};

function AnimatedNumber({
  from,
  to,
  duration = 1100,
}: AnimatedNumberProps) {
  const [display, setDisplay] = useState(from);

  useEffect(() => {
    let raf: number | null = null;
    const startedAt = performance.now();
    const tick = () => {
      const elapsed = performance.now() - startedAt;
      const t = Math.min(1, elapsed / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const value = Math.round(from + (to - from) * eased);
      setDisplay(value);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => {
      if (raf !== null) cancelAnimationFrame(raf);
    };
  }, [from, to, duration]);

  return <>{display.toLocaleString("sv-SE")}</>;
}

type StatTileProps = {
  label: string;
  value: string;
};

function StatTile({ label, value }: StatTileProps) {
  return (
    <div className="rounded-2xl bg-white p-3.5 text-left shadow-sm ring-1 ring-black/5">
      <p className="text-[11px] font-black uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 text-xl font-extrabold tabular-nums text-dark">
        {value}
      </p>
    </div>
  );
}
