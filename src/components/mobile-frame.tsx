import { cn } from "@/lib/utils";

type MobileFrameProps = {
  children?: React.ReactNode;
  className?: string;
};

export function MobileFrame({ children, className }: MobileFrameProps) {
  return (
    <div className="flex min-h-[100dvh] w-full justify-center bg-neutral-200 min-[431px]:items-center min-[431px]:py-4">
      <div
        className={cn(
          "relative flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-background min-[431px]:h-[calc(100dvh-2rem)] min-[431px]:rounded-[2.5rem] min-[431px]:shadow-[0_20px_60px_-15px_rgba(29,53,87,0.35)] min-[431px]:ring-1 min-[431px]:ring-black/5",
          className,
        )}
      >
        {children}
      </div>
    </div>
  );
}
