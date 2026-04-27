"use client";

import { useSyncExternalStore } from "react";

import type { Play, SessionAnswer } from "@/types/play";

const STORAGE_KEY = "quiz-app.plays";

const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedPlays: Play[] = [];

function invalidate() {
  cachedRaw = undefined;
}

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

// Older plays predate `id`, `isFirstAttempt`, and `sessionAnswers`.
// Backfill defaults so legacy localStorage data keeps working.
function normalizePlay(raw: unknown): Play | null {
  if (!raw || typeof raw !== "object") return null;
  const value = raw as Partial<Play> & Record<string, unknown>;
  if (typeof value.quizId !== "string") return null;
  return {
    id: typeof value.id === "string" ? value.id : generateId(),
    quizId: value.quizId,
    score: typeof value.score === "number" ? value.score : 0,
    correctCount:
      typeof value.correctCount === "number" ? value.correctCount : 0,
    totalQuestions:
      typeof value.totalQuestions === "number" ? value.totalQuestions : 0,
    percentile:
      typeof value.percentile === "number" ? value.percentile : 0,
    isFirstAttempt:
      typeof value.isFirstAttempt === "boolean" ? value.isFirstAttempt : true,
    playedAt:
      typeof value.playedAt === "string"
        ? value.playedAt
        : new Date().toISOString(),
    sessionAnswers: Array.isArray(value.sessionAnswers)
      ? (value.sessionAnswers as SessionAnswer[])
      : undefined,
  };
}

function getSnapshot(): Play[] {
  const raw = readRaw();
  if (cachedRaw !== undefined && raw === cachedRaw) {
    return cachedPlays;
  }
  cachedRaw = raw;
  if (!raw) {
    cachedPlays = [];
    return cachedPlays;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      cachedPlays = [];
      return cachedPlays;
    }
    cachedPlays = parsed
      .map(normalizePlay)
      .filter((p): p is Play => p !== null);
  } catch {
    cachedPlays = [];
  }
  return cachedPlays;
}

const EMPTY: Play[] = [];
function getServerSnapshot(): Play[] {
  return EMPTY;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = () => {
    invalidate();
    callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function notify() {
  invalidate();
  listeners.forEach((l) => l());
}

export type CreatePlayInput = {
  quizId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  percentile: number;
  isFirstAttempt: boolean;
  sessionAnswers: SessionAnswer[];
};

export function createPlay(input: CreatePlayInput): Play {
  return {
    id: generateId(),
    quizId: input.quizId,
    score: input.score,
    correctCount: input.correctCount,
    totalQuestions: input.totalQuestions,
    percentile: input.percentile,
    isFirstAttempt: input.isFirstAttempt,
    playedAt: new Date().toISOString(),
    sessionAnswers: input.sessionAnswers,
  };
}

export function readPlays(): Play[] {
  return getSnapshot();
}

export function savePlay(play: Play): void {
  try {
    const existing = getSnapshot();
    const next = [...existing, play];
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    notify();
  } catch {
    // Ignore storage errors in prototype.
  }
}

export function hasPlayedQuiz(quizId: string, plays?: Play[]): boolean {
  const list = plays ?? getSnapshot();
  return list.some((p) => p.quizId === quizId);
}

export function getOfficialPlay(
  quizId: string,
  plays?: Play[],
): Play | null {
  const list = plays ?? getSnapshot();
  return list.find((p) => p.quizId === quizId && p.isFirstAttempt) ?? null;
}

export function usePlays(): Play[] {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
