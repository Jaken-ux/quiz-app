"use client";

import { BarChart3, Home, User, type LucideIcon } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { MobileFrame } from "@/components/mobile-frame";
import { cn } from "@/lib/utils";

type TabId = "home" | "stats" | "profile";

type Tab = {
  id: TabId;
  label: string;
  icon: LucideIcon;
};

const TABS: Tab[] = [
  { id: "home", label: "Hem", icon: Home },
  { id: "stats", label: "Stats", icon: BarChart3 },
  { id: "profile", label: "Profil", icon: User },
];

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const [activeTab, setActiveTab] = useState<TabId>("home");
  const pathname = usePathname();
  const hideNav = pathname?.startsWith("/quiz/") ?? false;

  return (
    <MobileFrame>
      <main
        className={cn(
          "flex-1 overflow-y-auto",
          !hideNav && "pb-[calc(env(safe-area-inset-bottom)+6rem)]",
        )}
      >
        {children}
      </main>

      {!hideNav && (
        <nav
          aria-label="Primär navigation"
          className="absolute inset-x-0 bottom-0 flex bg-white/95 pt-1.5 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_28px_-8px_rgba(29,53,87,0.15)] backdrop-blur-xl"
        >
          {TABS.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                className="group flex min-h-[64px] flex-1 flex-col items-center justify-center gap-0.5 pt-1 pb-2 transition-transform duration-200 active:scale-90"
              >
                <div
                  className={cn(
                    "flex size-10 items-center justify-center rounded-2xl transition-all duration-200",
                    isActive
                      ? "bg-primary/10 shadow-[0_6px_14px_-6px_rgba(230,57,70,0.55)]"
                      : "",
                  )}
                >
                  <Icon
                    className={cn(
                      "transition-all duration-200",
                      isActive
                        ? "size-[22px] text-primary"
                        : "size-5 text-muted-foreground",
                    )}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={cn(
                    "text-[10px] font-black tracking-wide transition-colors duration-200",
                    isActive ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {tab.label}
                </span>
              </button>
            );
          })}
        </nav>
      )}
    </MobileFrame>
  );
}
