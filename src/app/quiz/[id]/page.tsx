"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";

import { quizzes } from "@/data/quizzes";
import {
  computePercentile,
  maxPossibleScore,
} from "@/features/quiz/game-utils";
import { savePlay } from "@/features/quiz/plays-storage";
import { QuizIntro } from "@/features/quiz/quiz-intro";
import { QuizPlay, type Answer } from "@/features/quiz/quiz-play";
import { QuizResult } from "@/features/quiz/quiz-result";

type Phase =
  | { kind: "intro" }
  | { kind: "playing" }
  | { kind: "result"; answers: Answer[]; percentile: number };

type QuizPageProps = {
  params: Promise<{ id: string }>;
};

export default function QuizPage({ params }: QuizPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const quiz = quizzes.find((q) => q.id === id);
  const [phase, setPhase] = useState<Phase>({ kind: "intro" });

  if (!quiz) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="text-2xl font-extrabold text-dark">Quiz hittades inte</p>
        <button
          type="button"
          onClick={() => router.push("/")}
          className="h-12 rounded-2xl bg-primary px-6 font-extrabold text-primary-foreground"
        >
          Tillbaka till hem
        </button>
      </div>
    );
  }

  if (phase.kind === "playing") {
    return (
      <QuizPlay
        quiz={quiz}
        onComplete={(answers) => {
          const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
          const maxScore = maxPossibleScore(quiz.questions);
          const percentile = computePercentile(totalScore, maxScore);
          savePlay({
            quizId: quiz.id,
            score: totalScore,
            correctCount: answers.filter((a) => a.correct).length,
            totalQuestions: quiz.questions.length,
            percentile,
            playedAt: new Date().toISOString(),
          });
          setPhase({ kind: "result", answers, percentile });
        }}
        onAbort={() => router.push("/")}
      />
    );
  }

  if (phase.kind === "result") {
    return (
      <QuizResult
        quiz={quiz}
        answers={phase.answers}
        percentile={phase.percentile}
        onHome={() => router.push("/")}
      />
    );
  }

  return (
    <QuizIntro quiz={quiz} onStart={() => setPhase({ kind: "playing" })} />
  );
}
