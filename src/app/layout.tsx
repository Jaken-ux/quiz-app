import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { AppShell } from "@/components/app-shell";
import { OnboardingGate } from "@/features/auth/onboarding-gate";
import { PasswordGate } from "@/features/auth/password-gate";
import { UserProvider } from "@/features/auth/use-user";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quiz-app",
  description: "Spela korta quiz och se hur du placerar dig mot alla andra.",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
  themeColor: "#F1FAEE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="sv"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`}
    >
      <body>
        <PasswordGate>
          <UserProvider>
            <OnboardingGate>
              <AppShell>{children}</AppShell>
            </OnboardingGate>
          </UserProvider>
        </PasswordGate>
      </body>
    </html>
  );
}
