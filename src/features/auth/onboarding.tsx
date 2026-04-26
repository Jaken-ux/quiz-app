"use client";

import { useState } from "react";

import { MobileFrame } from "@/components/mobile-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUser } from "@/features/auth/use-user";
import { cn } from "@/lib/utils";

type AvatarOption = {
  emoji: string;
  bg: string;
};

const AVATARS: AvatarOption[] = [
  { emoji: "🦊", bg: "bg-orange-100" },
  { emoji: "🐻", bg: "bg-amber-100" },
  { emoji: "🦁", bg: "bg-yellow-100" },
  { emoji: "🐼", bg: "bg-slate-100" },
  { emoji: "🦉", bg: "bg-violet-100" },
  { emoji: "🐙", bg: "bg-pink-100" },
];

const MIN_LENGTH = 2;
const MAX_LENGTH = 20;

export function Onboarding() {
  const { setUser } = useUser();
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const trimmed = username.trim();
  const nameTooShort = trimmed.length > 0 && trimmed.length < MIN_LENGTH;
  const canSubmit =
    trimmed.length >= MIN_LENGTH &&
    trimmed.length <= MAX_LENGTH &&
    avatar !== null;

  const handleSubmit = () => {
    if (!canSubmit || !avatar) return;
    setUser({
      username: trimmed,
      avatar,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <MobileFrame>
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#E63946] via-[#EE5A6A] to-[#FFB703] px-6 pt-[calc(env(safe-area-inset-top)+2.5rem)] pb-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 -right-6 h-40 w-40 rounded-full bg-white/20 blur-2xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-10 top-12 size-4 rounded-full bg-white/70"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute right-24 top-6 size-2.5 rounded-full bg-white/60"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute left-8 bottom-6 size-3 rounded-full bg-white/50"
          />

          <div className="relative">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/80">
              Sveriges Roligaste Quiz
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur">
              🎉 Välkommen
            </div>
            <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-white drop-shadow-sm">
              Vem är du?
            </h1>
            <p className="mt-2 max-w-[260px] text-sm font-semibold text-white/95">
              Välj ett smeknamn och en quiz-doppelganger — sen kör vi.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-7 px-6 pt-7">
          <div>
            <label
              htmlFor="username"
              className="text-sm font-extrabold text-dark"
            >
              Ditt smeknamn
            </label>
            <Input
              id="username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Vad ska vi kalla dig?"
              maxLength={MAX_LENGTH}
              autoComplete="off"
              autoCapitalize="off"
              spellCheck={false}
              className="mt-2 h-14 rounded-2xl border-2 bg-white !text-base font-semibold shadow-[0_4px_14px_-6px_rgba(29,53,87,0.15)]"
              aria-invalid={nameTooShort || undefined}
            />
            {nameTooShort && (
              <p className="mt-1.5 text-xs font-semibold text-destructive">
                Minst {MIN_LENGTH} tecken
              </p>
            )}
          </div>

          <div>
            <p className="text-sm font-extrabold text-dark">
              Välj din quiz-doppelganger
            </p>
            <div className="mt-3 grid grid-cols-3 gap-3">
              {AVATARS.map(({ emoji, bg }) => {
                const isSelected = avatar === emoji;
                return (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => setAvatar(emoji)}
                    aria-pressed={isSelected}
                    aria-label={`Avatar ${emoji}`}
                    className={cn(
                      "relative flex aspect-square items-center justify-center rounded-3xl text-5xl transition-all duration-200 active:scale-95",
                      bg,
                      isSelected
                        ? "scale-[1.06] shadow-[0_12px_28px_-8px_rgba(230,57,70,0.55)] ring-4 ring-primary"
                        : "shadow-sm ring-1 ring-black/5",
                    )}
                  >
                    <span className="drop-shadow-sm">{emoji}</span>
                    {isSelected && (
                      <span
                        aria-hidden
                        className="absolute -top-1.5 -right-1.5 flex size-6 items-center justify-center rounded-full bg-primary text-xs font-black text-primary-foreground shadow-md"
                      >
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="mt-auto pb-[max(env(safe-area-inset-bottom),1.5rem)] pt-2">
            <Button
              type="button"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="h-14 w-full rounded-2xl text-base font-extrabold shadow-[0_12px_28px_-8px_rgba(230,57,70,0.55)] transition-all active:scale-[0.98] disabled:shadow-none"
            >
              Kör hårt 🚀
            </Button>
          </div>
        </div>
      </div>
    </MobileFrame>
  );
}
