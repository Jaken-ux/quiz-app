"use client";

import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "quiz-app.likes";

const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedSet: ReadonlySet<string> = new Set();

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

function getSnapshot(): ReadonlySet<string> {
  const raw = readRaw();
  if (cachedRaw !== undefined && raw === cachedRaw) {
    return cachedSet;
  }
  cachedRaw = raw;
  if (!raw) {
    cachedSet = new Set();
    return cachedSet;
  }
  try {
    const parsed = JSON.parse(raw);
    cachedSet = Array.isArray(parsed) ? new Set(parsed as string[]) : new Set();
  } catch {
    cachedSet = new Set();
  }
  return cachedSet;
}

const EMPTY_SET: ReadonlySet<string> = new Set();
function getServerSnapshot(): ReadonlySet<string> {
  return EMPTY_SET;
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

function persistSet(set: Set<string>) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...set]));
  notify();
}

export type UseLikesValue = {
  likes: ReadonlySet<string>;
  isLiked: (quizId: string) => boolean;
  toggle: (quizId: string) => void;
};

export function useLikes(): UseLikesValue {
  const likes = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  const isLiked = useCallback(
    (quizId: string) => likes.has(quizId),
    [likes],
  );

  const toggle = useCallback((quizId: string) => {
    const next = new Set(getSnapshot());
    if (next.has(quizId)) {
      next.delete(quizId);
    } else {
      next.add(quizId);
    }
    persistSet(next);
  }, []);

  return { likes, isLiked, toggle };
}
