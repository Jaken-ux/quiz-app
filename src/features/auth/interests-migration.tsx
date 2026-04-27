"use client";

import { MobileFrame } from "@/components/mobile-frame";
import { InterestPicker } from "@/features/auth/interest-picker";
import { useUser } from "@/features/auth/use-user";
import type { Interest } from "@/types/quiz";

export function InterestsMigration() {
  const { updateInterests } = useUser();

  const handleSubmit = (interests: Interest[]) => {
    updateInterests(interests);
  };

  return (
    <MobileFrame>
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="relative overflow-hidden rounded-b-[2.5rem] bg-gradient-to-br from-[#7C3AED] via-[#EC4899] to-[#FFB703] px-6 pt-[calc(env(safe-area-inset-top)+2.5rem)] pb-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-6 -right-6 h-40 w-40 rounded-full bg-white/20 blur-2xl"
          />
          <div className="relative">
            <p className="text-[11px] font-black uppercase tracking-widest text-white/80">
              Snabbt smaktest
            </p>
            <h1 className="mt-3 text-3xl font-extrabold leading-[1.05] text-white drop-shadow-sm">
              Vad gillar du?
            </h1>
            <p className="mt-2 max-w-[280px] text-sm font-semibold text-white/95">
              Vi har lagt till intressen — välj minst 3 så slumpar vi rätt quiz.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col px-6 pt-6 pb-[max(env(safe-area-inset-bottom),1.5rem)]">
          <InterestPicker
            title="Välj minst 3 intressen"
            subtitle="Du kan alltid ändra dem senare i profilen."
            submitLabel="Klar 🚀"
            onSubmit={handleSubmit}
          />
        </div>
      </div>
    </MobileFrame>
  );
}
