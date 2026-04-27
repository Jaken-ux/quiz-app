"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { MobileFrame } from "@/components/mobile-frame";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InterestPicker } from "@/features/auth/interest-picker";
import { useUser } from "@/features/auth/use-user";
import { cn } from "@/lib/utils";
import type { Interest } from "@/types/quiz";

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

type Step = "profile" | "interests";

export function Onboarding() {
  const { setUser } = useUser();
  const [step, setStep] = useState<Step>("profile");
  const [username, setUsername] = useState("");
  const [avatar, setAvatar] = useState<string | null>(null);

  const trimmed = username.trim();
  const nameTooShort = trimmed.length > 0 && trimmed.length < MIN_LENGTH;
  const canContinue =
    trimmed.length >= MIN_LENGTH &&
    trimmed.length <= MAX_LENGTH &&
    avatar !== null;

  const handleProfileNext = () => {
    if (!canContinue) return;
    setStep("interests");
  };

  const handleFinish = (interests: Interest[]) => {
    if (!avatar) return;
    setUser({
      username: trimmed,
      avatar,
      interests,
      createdAt: new Date().toISOString(),
    });
  };

  return (
    <MobileFrame>
      <div className="flex h-full flex-col overflow-y-auto">
        <AnimatePresence mode="wait">
          {step === "profile" ? (
            <motion.div
              key="profile"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="flex h-full flex-col"
            >
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
                    🎉 Steg 1 av 2
                  </div>
                  <h1 className="mt-4 text-4xl font-extrabold leading-[1.05] text-white drop-shadow-sm">
                    Vem är du?
                  </h1>
                  <p className="mt-2 max-w-[260px] text-sm font-semibold text-white/95">
                    Välj ett smeknamn och en quiz-doppelganger.
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
                    onClick={handleProfileNext}
                    disabled={!canContinue}
                    className="h-14 w-full rounded-2xl text-base font-extrabold shadow-[0_12px_28px_-8px_rgba(230,57,70,0.55)] transition-all active:scale-[0.98] disabled:shadow-none"
                  >
                    Fortsätt 👉
                  </Button>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="interests"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.22 }}
              className="flex h-full flex-col"
            >
              <div className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#7C3AED] via-[#EC4899] to-[#FFB703] px-6 pt-[calc(env(safe-area-inset-top)+2.5rem)] pb-10">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -top-6 -right-6 h-40 w-40 rounded-full bg-white/20 blur-2xl"
                />
                <div className="relative">
                  <p className="text-[11px] font-black uppercase tracking-widest text-white/80">
                    Smaktest
                  </p>
                  <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white/25 px-3 py-1 text-[11px] font-black uppercase tracking-widest text-white backdrop-blur">
                    🎯 Steg 2 av 2
                  </div>
                  <h1 className="mt-4 text-3xl font-extrabold leading-[1.05] text-white drop-shadow-sm">
                    Vad får dig att skratta?
                  </h1>
                </div>
              </div>

              <div className="flex flex-1 flex-col px-6 pt-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
                <InterestPicker
                  title="Välj minst 3 intressen"
                  subtitle="Vi använder det till att slumpa fram quiz du gillar."
                  submitLabel="Kör hårt 🚀"
                  onSubmit={handleFinish}
                  onBack={() => setStep("profile")}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MobileFrame>
  );
}
