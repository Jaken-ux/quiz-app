"use client";

import { useSyncExternalStore } from "react";

import { useUser } from "@/features/auth/use-user";

function useHasMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

function formatDate(iso: string): string {
  try {
    return new Date(iso).toLocaleDateString("sv-SE", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return "nyligen";
  }
}

export default function ProfilePage() {
  const { user } = useUser();
  const mounted = useHasMounted();

  return (
    <div className="flex h-full flex-col">
      <header className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#1D3557] via-[#2C5282] to-[#E63946] px-6 pt-[calc(env(safe-area-inset-top)+2rem)] pb-10">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-6 -right-6 h-40 w-40 rounded-full bg-white/15 blur-2xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-10 bottom-6 size-3 rounded-full bg-white/50"
        />

        <div className="relative flex flex-col items-center text-center">
          <div className="flex size-24 items-center justify-center rounded-full bg-white/25 text-6xl shadow-lg ring-4 ring-white/40 backdrop-blur">
            {user?.avatar ?? "👤"}
          </div>
          <h1 className="mt-4 text-3xl font-extrabold text-white drop-shadow-sm">
            {user?.username ?? "Spelare"}
          </h1>
          {mounted && user && (
            <p className="mt-1 text-xs font-semibold text-white/90">
              Medlem sedan {formatDate(user.createdAt)}
            </p>
          )}
        </div>
      </header>

      <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 pt-8 pb-8 text-center">
        <div className="flex size-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
          🚧
        </div>
        <h2 className="text-xl font-extrabold text-dark">Kommer snart</h2>
        <p className="max-w-[260px] text-sm font-medium text-muted-foreground">
          Inställningar, byta avatar, vänner och topplistor är på väg hit.
        </p>
      </div>
    </div>
  );
}
