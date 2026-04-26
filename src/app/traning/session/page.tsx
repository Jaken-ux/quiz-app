"use client";

import { useRouter } from "next/navigation";
import { useMemo, useSyncExternalStore } from "react";

import {
  CATEGORY_LABEL,
  DIFFICULTY_LABEL,
} from "@/features/quiz/category-meta";
import {
  PlayQuestions,
  type Answer,
} from "@/features/quiz/play-questions";
import { updateRating } from "@/features/training/use-ratings";
import { calculateSessionDelta } from "@/lib/rating";
import {
  createTrainingSession,
  saveTrainingSession,
  timeLimitForMode,
} from "@/lib/training";
import type { Category, Difficulty, Question } from "@/types/quiz";
import type { TrainingMode } from "@/types/training";

const SESSION_KEY = "quiz-app.current-training";

type StoredConfig = {
  category: Category;
  difficulty: Difficulty;
  mode: TrainingMode;
  questions: Question[];
  startedAt: number;
};

function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function readStoredConfig(): StoredConfig | null {
  try {
    const raw = window.sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as StoredConfig;
  } catch {
    return null;
  }
}

export default function TrainingSessionPage() {
  const router = useRouter();
  const mounted = useHasMounted();
  const config = useMemo(
    () => (mounted ? readStoredConfig() : null),
    [mounted],
  );

  if (!mounted) {
    return <div className="h-full" />;
  }

  if (!config) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 pt-[calc(env(safe-area-inset-top)+2rem)] text-center">
        <p className="text-2xl font-extrabold text-dark">
          Ingen aktiv träningssession
        </p>
        <p className="text-sm font-medium text-muted-foreground">
          Starta en ny session för att komma igång.
        </p>
        <button
          type="button"
          onClick={() => router.replace("/traning")}
          className="mt-2 h-12 rounded-2xl bg-gradient-to-br from-sky-500 to-emerald-500 px-6 font-extrabold text-white shadow-md"
        >
          Starta en träning
        </button>
      </div>
    );
  }

  const handleComplete = (answers: Answer[]) => {
    const score = answers.reduce((sum, a) => sum + a.score, 0);
    const correctCount = answers.filter((a) => a.correct).length;
    const totalQuestions = answers.length;
    const totalTimeMs = answers.reduce((sum, a) => sum + a.timeSpentMs, 0);
    const averageTimePerQuestion =
      totalQuestions > 0 ? totalTimeMs / 1000 / totalQuestions : 0;

    const timeLimitSeconds = timeLimitForMode(config.mode);
    const ratingDelta = calculateSessionDelta(
      answers.map((a) => ({
        difficulty: config.difficulty,
        isCorrect: a.correct,
        timeUsedSeconds: a.timeSpentMs / 1000,
        timeLimitSeconds,
      })),
      config.mode,
    );

    const { before: ratingBefore, after: ratingAfter } = updateRating(
      config.category,
      ratingDelta,
    );

    const session = createTrainingSession({
      category: config.category,
      difficulty: config.difficulty,
      mode: config.mode,
      score,
      correctCount,
      totalQuestions,
      averageTimePerQuestion,
      ratingBefore,
      ratingAfter,
      ratingDelta,
    });
    saveTrainingSession(session);

    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }

    const params = new URLSearchParams({
      score: String(score),
      correct: String(correctCount),
      total: String(totalQuestions),
      avgTime: averageTimePerQuestion.toFixed(1),
      totalTime: (totalTimeMs / 1000).toFixed(1),
      mode: config.mode,
      category: config.category,
      difficulty: config.difficulty,
      ratingBefore: String(ratingBefore),
      ratingAfter: String(ratingAfter),
      ratingDelta: String(ratingDelta),
    });
    router.replace(`/traning/result?${params.toString()}`);
  };

  const handleAbort = () => {
    try {
      window.sessionStorage.removeItem(SESSION_KEY);
    } catch {
      // ignore
    }
    router.replace("/traning");
  };

  const subtitle = `${CATEGORY_LABEL[config.category]} · ${DIFFICULTY_LABEL[config.difficulty]}`;

  return (
    <PlayQuestions
      questions={config.questions}
      theme="training"
      subtitle={subtitle}
      abortTitle="Avbryta träningssessionen?"
      abortDescription="Dina svar i denna session försvinner."
      abortConfirmLabel="Avbryt session"
      onComplete={handleComplete}
      onAbort={handleAbort}
    />
  );
}
