"use client";

import { MobileFrame } from "@/components/mobile-frame";
import { InterestsMigration } from "@/features/auth/interests-migration";
import { Onboarding } from "@/features/auth/onboarding";
import { useUser } from "@/features/auth/use-user";

type OnboardingGateProps = {
  children: React.ReactNode;
};

export function OnboardingGate({ children }: OnboardingGateProps) {
  const { user, isLoading } = useUser();

  if (isLoading) {
    return <MobileFrame />;
  }

  if (!user) {
    return <Onboarding />;
  }

  // Migration path for users created before the smaktest existed.
  if (!Array.isArray(user.interests) || user.interests.length === 0) {
    return <InterestsMigration />;
  }

  return <>{children}</>;
}
