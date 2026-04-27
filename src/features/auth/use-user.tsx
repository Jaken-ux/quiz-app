"use client";

import {
  createContext,
  useCallback,
  useContext,
  useSyncExternalStore,
} from "react";

import type { User } from "@/types/user";
import type { Interest } from "@/types/quiz";

const STORAGE_KEY = "quiz-app.user";

const listeners = new Set<() => void>();

let cachedRaw: string | null | undefined;
let cachedUser: User | null = null;

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

function getSnapshot(): User | null {
  const raw = readRaw();
  if (cachedRaw !== undefined && raw === cachedRaw) {
    return cachedUser;
  }
  cachedRaw = raw;
  if (!raw) {
    cachedUser = null;
    return null;
  }
  try {
    cachedUser = JSON.parse(raw) as User;
  } catch {
    cachedUser = null;
  }
  return cachedUser;
}

function getServerSnapshot(): null {
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
  listeners.forEach((listener) => listener());
}

function writeUser(user: User) {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
  notify();
}

function removeUser() {
  window.localStorage.removeItem(STORAGE_KEY);
  notify();
}

// Returns false during SSR and the very first client render (before hydration),
// true afterwards. Lets us distinguish "nothing loaded yet" from "no user".
function useHasHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type UserContextValue = {
  user: User | null;
  setUser: (user: User) => void;
  updateInterests: (interests: Interest[]) => void;
  clearUser: () => void;
  isLoading: boolean;
};

const UserContext = createContext<UserContextValue | null>(null);

type UserProviderProps = {
  children: React.ReactNode;
};

export function UserProvider({ children }: UserProviderProps) {
  const user = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const hasHydrated = useHasHydrated();

  const setUser = useCallback((next: User) => {
    writeUser(next);
  }, []);

  const updateInterests = useCallback(
    (interests: Interest[]) => {
      const current = getSnapshot();
      if (!current) return;
      writeUser({ ...current, interests });
    },
    [],
  );

  const clearUser = useCallback(() => {
    removeUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        updateInterests,
        clearUser,
        isLoading: !hasHydrated,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return ctx;
}
