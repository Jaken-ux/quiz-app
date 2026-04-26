"use client";

import { useRouter } from "next/navigation";
import { use, useState } from "react";

import { quizzes } from "@/data/quizzes";
import {
  computePercentile,
  maxPossibleScore,
} from "@/features/quiz/game-utils";
import {
  pickNextQuiz,
  type NextSuggestion,
} from "@/features/quiz/next-quiz";
import { QuizIntro } from "@/features/quiz/quiz-intro";
import {
  PlayQuestions,
  type Answer,
} from "@/features/quiz/play-questions";
import { QuizResult } from "@/features/quiz/quiz-result";
import {
  createPlay,
  getOfficialPlay,
  savePlay,
  usePlays,
} from "@/features/quiz/use-plays";
import type { Play } from "@/types/play";

type Phase =
  | { kind: "intro" }
  | { kind: "playing"; isFirstAttempt: boolean; officialPlay: Play | null }
  | {
      kind: "result";
      answers: Answer[];
      percentile: number;
      isFirstAttempt: boolean;
      officialPlay: Play | null;
      next: NextSuggestion | null;
    };

type QuizPageProps = {
  params: Promise<{ id: string }>;
};

export default function QuizPage({ params }: QuizPageProps) {
  const { id } = use(params);
  const router = useRouter();
  const quiz = quizzes.find((q) => q.id === id);
  const plays = usePlays();
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
      <PlayQuestions
        questions={quiz.questions}
        theme="quiz"
        abortTitle="Avbryta quiz?"
        abortConfirmLabel="Avbryt quiz"
        onComplete={(answers) => {
          const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
          const correctCount = answers.filter((a) => a.correct).length;
          const accuracy =
            answers.length > 0 ? correctCount / answers.length : 0;
          const maxScore = maxPossibleScore(quiz.questions);
          const percentile = phase.isFirstAttempt
            ? computePercentile(totalScore, maxScore)
            : 0;
          const newPlay = createPlay({
            quizId: quiz.id,
            score: totalScore,
            correctCount,
            totalQuestions: quiz.questions.length,
            percentile,
            isFirstAttempt: phase.isFirstAttempt,
          });
          savePlay(newPlay);
          const next = pickNextQuiz(quiz, accuracy, quizzes);
          setPhase({
            kind: "result",
            answers,
            percentile,
            isFirstAttempt: phase.isFirstAttempt,
            officialPlay: phase.officialPlay,
            next,
          });
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
        isFirstAttempt={phase.isFirstAttempt}
        officialPlay={phase.officialPlay}
        next={phase.next}
        onHome={() => router.push("/")}
      />
    );
  }

  const officialPlay = getOfficialPlay(quiz.id, plays);

  return (
    <QuizIntro
      quiz={quiz}
      officialPlay={officialPlay}
      onStart={() =>
        setPhase({
          kind: "playing",
          isFirstAttempt: officialPlay === null,
          officialPlay,
        })
      }
    />
  );
}
