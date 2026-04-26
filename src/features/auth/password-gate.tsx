"use client";

import { useState, useSyncExternalStore } from "react";

import { MobileFrame } from "@/components/mobile-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "quiz-app.access";
const GRANTED_VALUE = "granted";

// Prototype-grade gate: the password ships in the client bundle and the
// "granted" flag lives in localStorage, so anyone with DevTools can bypass
// it. Swap for a middleware + cookie approach once the app goes public.
const PASSWORD = "verysecret";

const listeners = new Set<() => void>();

function readAccess(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === GRANTED_VALUE;
  } catch {
    return false;
  }
}

function subscribe(callback: () => void): () => void {
  listeners.add(callback);
  const onStorage = () => callback();
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(callback);
    window.removeEventListener("storage", onStorage);
  };
}

function getServerSnapshot(): boolean {
  return false;
}

function grantAccess() {
  window.localStorage.setItem(STORAGE_KEY, GRANTED_VALUE);
  listeners.forEach((l) => l());
}

function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

type PasswordGateProps = {
  children: React.ReactNode;
};

export function PasswordGate({ children }: PasswordGateProps) {
  const hasAccess = useSyncExternalStore(
    subscribe,
    readAccess,
    getServerSnapshot,
  );
  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return <MobileFrame />;
  }

  if (!hasAccess) {
    return <PasswordPrompt onUnlock={grantAccess} />;
  }

  return <>{children}</>;
}

type PasswordPromptProps = {
  onUnlock: () => void;
};

function PasswordPrompt({ onUnlock }: PasswordPromptProps) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (password === PASSWORD) {
      onUnlock();
      return;
    }
    setError(true);
    setPassword("");
  };

  return (
    <MobileFrame>
      <form
        onSubmit={handleSubmit}
        className="flex h-full flex-col overflow-y-auto"
      >
        <div className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#1D3557] via-[#2C5282] to-[#E63946] px-6 pt-[calc(env(safe-area-inset-top)+3rem)] pb-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 -right-6 h-40 w-40 rounded-full bg-white/15 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-10 top-10 size-3 rounded-full bg-white/60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-8 bottom-6 size-2.5 rounded-full bg-white/50"
          />

          <div className="relative">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/80">
              Sveriges Roligaste Quiz
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur">
              🔒 Privat
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-white drop-shadow-sm">
              Hemligt
              <br />
              lösenord
            </h1>
            <p className="mt-2 max-w-[260px] text-sm font-semibold text-white/90">
              Skriv in för att komma in i appen.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-5 px-6 pt-7">
          <div>
            <label
              htmlFor="password"
              className="text-sm font-extrabold text-dark"
            >
              Lösenord
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                if (error) setError(false);
              }}
              placeholder="••••••••"
              autoFocus
              autoComplete="current-password"
              className="mt-2 h-14 rounded-2xl border-2 bg-white !text-base font-semibold shadow-[0_4px_14px_-6px_rgba(29,53,87,0.15)]"
              aria-invalid={error || undefined}
            />
            {error && (
              <p className="mt-1.5 text-xs font-semibold text-destructive">
                Fel lösenord — försök igen.
              </p>
            )}
          </div>

          <div className="mt-auto pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-2">
            <Button
              type="submit"
              disabled={password.length === 0}
              className="h-14 w-full rounded-2xl text-base font-extrabold shadow-[0_12px_28px_-8px_rgba(230,57,70,0.55)] transition-all active:scale-[0.98] disabled:shadow-none"
            >
              Öppna 🔓
            </Button>
          </div>
        </div>
      </form>
    </MobileFrame>
  );
}
