"use client";
import { FolderX, User } from "lucide-react";
import type React from "react";
type Props = {
  icon?: "friends" | "groups";
  title?: string;
  message?: string;
  children?: React.ReactNode;
};

export function EmptyState({
  icon = "friends",
  title = "Nothing here",
  message = "There is no data to show.",
  children,
}: Props) {
  const Icon = icon === "friends" ? User : FolderX;

  return (
    <div className="w-full relative">
          <div className="min-h-full top-0 left-0 -z-10 w-full bg-transparent absolute">
      {/* Top Fade Grid Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `
        linear-gradient(to right, var(--muted) 1px, transparent 1px),
        linear-gradient(to bottom, var(--muted) 1px, transparent 1px)
      `,
          backgroundSize: "20px 30px",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
          maskImage:
            "radial-gradient(ellipse 70% 60% at 50% 0%, #000 60%, transparent 100%)",
        }}
      />
      {/* Your Content/Components */}
    </div>
      <div className="flex flex-col items-center justify-center text-center py-12 px-4 backdrop-blur-[1px] border border-border/40 bg-transparent">
        <Icon className="h-14 w-14 text-zinc-500 mb-3 rounded-full bg-muted-foreground/10" />

        <h2 className="text-2xl font-semibold text-zinc-800 dark:text-zinc-200">
          {title}
        </h2>

        <p className="mt-1 text-zinc-600 dark:text-zinc-400 max-w-sm">
          {message}
        </p>

        {children && (
          <div className="mt-4 text-zinc-700 dark:text-zinc-300">{children}</div>
        )}
      </div>
    </div>
  );
}

