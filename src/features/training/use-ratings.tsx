"use client";

import { useCallback, useSyncExternalStore } from "react";

import { CATEGORIES } from "@/features/quiz/category-meta";
import { applyRating, RATING_INITIAL_VALUE } from "@/lib/rating";
import type { Category } from "@/types/quiz";
import type { CategoryRating } from "@/types/training";

const STORAGE_KEY = "quiz-app.ratings";

export type RatingsMap = Record<Category, CategoryRating>;

const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedRatings: RatingsMap | null = null;

function freshRatings(): RatingsMap {
  const map = {} as RatingsMap;
  for (const category of CATEGORIES) {
    map[category] = {
      category,
      rating: RATING_INITIAL_VALUE,
      gamesPlayed: 0,
      lastUpdated: "",
    };
  }
  return map;
}

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

function getSnapshot(): RatingsMap {
  const raw = readRaw();
  if (cachedRaw !== undefined && raw === cachedRaw && cachedRatings) {
    return cachedRatings;
  }
  cachedRaw = raw;
  if (!raw) {
    cachedRatings = freshRatings();
    return cachedRatings;
  }
  try {
    const parsed = JSON.parse(raw) as Partial<RatingsMap>;
    const merged = freshRatings();
    for (const category of CATEGORIES) {
      const stored = parsed[category];
      if (
        stored &&
        typeof stored.rating === "number" &&
        typeof stored.gamesPlayed === "number"
      ) {
        merged[category] = {
          category,
          rating: stored.rating,
          gamesPlayed: stored.gamesPlayed,
          lastUpdated:
            typeof stored.lastUpdated === "string" ? stored.lastUpdated : "",
        };
      }
    }
    cachedRatings = merged;
  } catch {
    cachedRatings = freshRatings();
  }
  return cachedRatings;
}

function getServerSnapshot(): RatingsMap | null {
  return null;
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

function persist(ratings: RatingsMap) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ratings));
    notify();
  } catch {
    // Ignore storage errors in prototype.
  }
}

export function readRatings(): RatingsMap {
  return getSnapshot();
}

export function getRating(category: Category): CategoryRating {
  return getSnapshot()[category];
}

export function updateRating(category: Category, delta: number): {
  before: number;
  after: number;
} {
  const current = getSnapshot();
  const previous = current[category];
  const after = applyRating(previous.rating, delta);
  const next: RatingsMap = {
    ...current,
    [category]: {
      category,
      rating: after,
      gamesPlayed: previous.gamesPlayed + 1,
      lastUpdated: new Date().toISOString(),
    },
  };
  persist(next);
  return { before: previous.rating, after };
}

export type UseRatingsValue = {
  ratings: RatingsMap | null;
  getRating: (category: Category) => CategoryRating | null;
  updateRating: (
    category: Category,
    delta: number,
  ) => { before: number; after: number };
  isLoading: boolean;
};

export function useRatings(): UseRatingsValue {
  const ratings = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const get = useCallback(
    (category: Category): CategoryRating | null =>
      ratings ? ratings[category] : null,
    [ratings],
  );
  const update = useCallback(
    (category: Category, delta: number) => updateRating(category, delta),
    [],
  );
  return {
    ratings,
    getRating: get,
    updateRating: update,
    isLoading: ratings === null,
  };
}
