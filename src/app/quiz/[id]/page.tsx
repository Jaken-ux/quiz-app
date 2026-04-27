"use client";

import { useRouter } from "next/navigation";
import { use, useMemo, useState } from "react";

import { quizzes } from "@/data/quizzes";
import {
  pickNextQuiz,
  type NextSuggestion,
} from "@/features/quiz/next-quiz";
import { PlayQuestions } from "@/features/quiz/play-questions";
import { QuizIntro } from "@/features/quiz/quiz-intro";
import { QuizResult } from "@/features/quiz/quiz-result";
import {
  createPlay,
  getOfficialPlay,
  savePlay,
  usePlays,
} from "@/features/quiz/use-plays";
import { drawSessionQuestions } from "@/lib/draw-questions";
import { calculateSessionAggregate } from "@/lib/scoring";
import type { SessionAnswer } from "@/types/play";
import type { Question } from "@/types/quiz";

type Phase =
  | { kind: "intro"; runId: number }
  | {
      kind: "playing";
      runId: number;
      isFirstAttempt: boolean;
      questions: Question[];
    }
  | {
      kind: "result";
      runId: number;
      answers: SessionAnswer[];
      questions: Question[];
      percentile: number;
      totalScore: number;
      correctCount: number;
      isFirstAttempt: boolean;
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
  const [phase, setPhase] = useState<Phase>({ kind: "intro", runId: 0 });

  const officialPlay = useMemo(
    () => (quiz ? getOfficialPlay(quiz.id, plays) : null),
    [quiz, plays],
  );

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
        questions={phase.questions}
        onComplete={(answers) => {
          const aggregate = calculateSessionAggregate(answers);
          const newPlay = createPlay({
            quizId: quiz.id,
            score: aggregate.totalScore,
            correctCount: aggregate.correctCount,
            totalQuestions: phase.questions.length,
            percentile: aggregate.overallPercentile,
            isFirstAttempt: phase.isFirstAttempt,
            sessionAnswers: answers,
          });
          savePlay(newPlay);
          const accuracy =
            phase.questions.length > 0
              ? aggregate.correctCount / phase.questions.length
              : 0;
          const next = pickNextQuiz(quiz, accuracy, quizzes);
          setPhase({
            kind: "result",
            runId: phase.runId,
            answers,
            questions: phase.questions,
            percentile: aggregate.overallPercentile,
            totalScore: aggregate.totalScore,
            correctCount: aggregate.correctCount,
            isFirstAttempt: phase.isFirstAttempt,
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
        questions={phase.questions}
        percentile={phase.percentile}
        totalScore={phase.totalScore}
        correctCount={phase.correctCount}
        isFirstAttempt={phase.isFirstAttempt}
        next={phase.next}
        onPlayAgain={() => {
          const drawn = drawSessionQuestions(quiz);
          setPhase({
            kind: "playing",
            runId: phase.runId + 1,
            isFirstAttempt: false,
            questions: drawn,
          });
        }}
        onHome={() => router.push("/")}
      />
    );
  }

  return (
    <QuizIntro
      quiz={quiz}
      previousPlay={officialPlay}
      onStart={() => {
        const drawn = drawSessionQuestions(quiz);
        setPhase({
          kind: "playing",
          runId: phase.runId,
          isFirstAttempt: officialPlay === null,
          questions: drawn,
        });
      }}
    />
  );
}
