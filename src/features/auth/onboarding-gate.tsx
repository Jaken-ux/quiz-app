"use client";

import { MobileFrame } from "@/components/mobile-frame";
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

  return <>{children}</>;
}
