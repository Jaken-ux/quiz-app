"use client";

import { BarChart3, Home, User, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { MobileFrame } from "@/components/mobile-frame";
import { cn } from "@/lib/utils";

type TabId = "home" | "stats" | "profile";

type Tab = {
  id: TabId;
  label: string;
  icon: LucideIcon;
  href: string;
};

const TABS: Tab[] = [
  { id: "home", label: "Hem", icon: Home, href: "/" },
  { id: "stats", label: "Stats", icon: BarChart3, href: "/stats" },
  { id: "profile", label: "Profil", icon: User, href: "/profile" },
];

function activeTabFromPath(pathname: string | null): TabId {
  if (!pathname) return "home";
  if (pathname === "/stats" || pathname.startsWith("/stats/")) return "stats";
  if (pathname === "/profile" || pathname.startsWith("/profile/")) {
    return "profile";
  }
  return "home";
}

type AppShellProps = {
  children: React.ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const hideNav = pathname?.startsWith("/quiz/") ?? false;
  const activeTab = activeTabFromPath(pathname);

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
              <Link
                key={tab.id}
                href={tab.href}
                aria-label={tab.label}
                aria-current={isActive ? "page" : undefined}
                className="flex min-h-[64px] flex-1 flex-col items-center justify-center gap-0.5 pt-1 pb-2 transition-transform duration-200 active:scale-90"
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
              </Link>
            );
          })}
        </nav>
      )}
    </MobileFrame>
  );
}
