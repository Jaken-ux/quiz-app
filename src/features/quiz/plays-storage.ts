import type { Play } from "@/types/play";

const STORAGE_KEY = "quiz-app.plays";

export function savePlay(play: Play): void {
  try {
    const existing = readPlays();
    existing.push(play);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // Ignore storage errors in prototype
  }
}

export function readPlays(): Play[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Play[]) : [];
  } catch {
    return [];
  }
}
