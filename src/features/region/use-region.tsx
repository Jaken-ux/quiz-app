"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { Region } from "@/types/quiz";

const STORAGE_KEY = "quiz-app.region";
const DEFAULT_REGION: Region = "world";

const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedRegion: Region = DEFAULT_REGION;

function readRaw(): string | null {
  try {
    return window.localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function getSnapshot(): Region {
  const raw = readRaw();
  if (cachedRaw !== undefined && raw === cachedRaw) {
    return cachedRegion;
  }
  cachedRaw = raw;
  cachedRegion = raw === "sweden" ? "sweden" : "world";
  return cachedRegion;
}

function getServerSnapshot(): Region {
  return DEFAULT_REGION;
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = () => {
    cachedRaw = undefined;
    callback();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function notify() {
  cachedRaw = undefined;
  listeners.forEach((l) => l());
}

function persist(region: Region) {
  try {
    window.localStorage.setItem(STORAGE_KEY, region);
    notify();
  } catch {
    // Ignore storage errors in prototype.
  }
}

export type UseRegionValue = {
  region: Region;
  setRegion: (region: Region) => void;
};

export function useRegion(): UseRegionValue {
  const region = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const setRegion = useCallback((next: Region) => persist(next), []);
  return { region, setRegion };
}
