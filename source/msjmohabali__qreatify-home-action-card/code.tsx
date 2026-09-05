"use client";

import type { LucideIcon } from "lucide-react";
import { GithubIcon, PlusIcon, SparklesIcon } from "lucide-react";

import { cn } from "./qreatify-home-action-card-utils/utils";

export type QreatifyHomeActionCardProps = {
  title?: string;
  description?: string;
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  actionIcon?: LucideIcon;
  onClick?: () => void;
  className?: string;
};

export default function QreatifyHomeActionCard({
  title = "Create from framework",
  description = "Pick Next.js, Expo or React before the first build starts.",
  icon: Icon = SparklesIcon,
  variant = "primary",
  actionIcon: ActionIcon = variant === "primary" ? PlusIcon : GithubIcon,
  onClick,
  className,
}: QreatifyHomeActionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex min-h-24 w-full items-center gap-4 rounded-2xl border border-border/70 p-4 text-left transition-colors",
        variant === "primary"
          ? "bg-card/80 shadow-sm hover:border-primary/35 hover:bg-muted/70"
          : "bg-card/45 hover:bg-muted",
        className,
      )}
    >
      <span
        className={cn(
          "grid size-12 shrink-0 place-items-center rounded-xl",
          variant === "primary"
            ? "bg-primary/10 text-primary"
            : "bg-muted text-muted-foreground",
        )}
      >
        <Icon className="size-5" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-base font-semibold text-foreground">
          {title}
        </span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">
          {description}
        </span>
      </span>
      <ActionIcon className="size-4 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
    </button>
  );
}
