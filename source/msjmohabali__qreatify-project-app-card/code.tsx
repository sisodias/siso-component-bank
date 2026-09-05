"use client";

import { CalendarClockIcon, MessageSquareIcon } from "lucide-react";

import { cn } from "./qreatify-project-app-card-utils/utils";

export type QreatifyProjectAppCardProps = {
  name?: string;
  description?: string;
  editedAt?: string;
  conversations?: number;
  status?: "draft" | "preview" | "live";
  initial?: string;
  onClick?: () => void;
  className?: string;
};

export default function QreatifyProjectAppCard({
  name = "Mini portfolio website",
  description = "Dark hero, responsive sections, custom contact flow and deploy-ready preview.",
  editedAt = "Edited just now",
  conversations = 0,
  status = "draft",
  initial,
  onClick,
  className,
}: QreatifyProjectAppCardProps) {
  const statusLabel = {
    draft: "Draft",
    preview: "Preview",
    live: "Live",
  }[status];

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group flex min-h-28 w-full items-center gap-3 rounded-2xl border border-border/70 bg-background/80 p-3 text-left shadow-sm transition-colors hover:border-primary/30 hover:bg-background",
        className,
      )}
    >
      <span className="grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl bg-gradient-to-br from-amber-400 via-orange-500 to-purple-700 text-base font-bold text-white shadow-lg shadow-black/10">
        {(initial ?? name.trim().charAt(0) ?? "Q").toUpperCase()}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center gap-2">
          <span className="block truncate text-sm font-semibold text-foreground">
            {name}
          </span>
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-semibold",
              status === "live" && "bg-emerald-500/15 text-emerald-600",
              status === "preview" && "bg-orange-500/15 text-orange-600",
              status === "draft" && "bg-muted text-muted-foreground",
            )}
          >
            {statusLabel}
          </span>
        </span>
        <span className="mt-1 line-clamp-2 block text-xs leading-4 text-muted-foreground">
          {description}
        </span>
        <span className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <CalendarClockIcon className="size-3" />
            {editedAt}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <MessageSquareIcon className="size-3" />
            {conversations} chat{conversations === 1 ? "" : "s"}
          </span>
        </span>
      </span>
    </button>
  );
}
