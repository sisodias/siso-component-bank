"use client";

import type { LucideIcon } from "lucide-react";
import {
  BotIcon,
  DownloadIcon,
  GithubIcon,
  ImageIcon,
  InboxIcon,
  PlusIcon,
  WorkflowIcon,
} from "lucide-react";

import { cn } from "./qreatify-workspace-rail-utils/utils";

export type QreatifyRailItem = {
  label: string;
  icon?: LucideIcon;
  active?: boolean;
};

export type QreatifyWorkspaceRailProps = {
  initial?: string;
  items?: QreatifyRailItem[];
  onNewProject?: () => void;
  className?: string;
};

const defaultItems: QreatifyRailItem[] = [
  { icon: ImageIcon, label: "Media Studio" },
  { icon: InboxIcon, label: "Inbox" },
  { icon: WorkflowIcon, label: "Automations", active: true },
  { icon: BotIcon, label: "Skills" },
];

export default function QreatifyWorkspaceRail({
  initial = "Q",
  items = defaultItems,
  onNewProject,
  className,
}: QreatifyWorkspaceRailProps) {
  return (
    <aside
      className={cn(
        "flex w-16 flex-col items-center border-r border-border/70 bg-background/95 p-2",
        className,
      )}
    >
      <button
        type="button"
        onClick={onNewProject}
        className="grid size-11 place-items-center rounded-xl border border-white/20 bg-gradient-to-br from-amber-400 via-orange-500 to-purple-700 text-sm font-bold text-white shadow-lg shadow-black/20"
        aria-label="Qreatify workspace"
      >
        {initial.slice(0, 1).toUpperCase()}
      </button>
      <button
        type="button"
        onClick={onNewProject}
        className="mt-3 grid size-10 place-items-center rounded-xl border border-dashed border-border text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        aria-label="Create workspace"
      >
        <PlusIcon className="size-4" />
      </button>

      <nav className="mt-6 flex flex-col items-center gap-2">
        {items.map((item) => {
          const Icon = item.icon ?? InboxIcon;
          return (
            <button
              key={item.label}
              type="button"
              className={cn(
                "grid size-10 place-items-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
                item.active && "bg-muted text-foreground",
              )}
              title={item.label}
            >
              <Icon className="size-4" />
            </button>
          );
        })}
      </nav>

      <div className="mt-auto flex flex-col items-center gap-3">
        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Import GitHub"
        >
          <GithubIcon className="size-4" />
        </button>
        <button
          type="button"
          className="grid size-10 place-items-center rounded-xl bg-muted text-muted-foreground transition-colors hover:text-foreground"
          aria-label="Download Qreatify"
        >
          <DownloadIcon className="size-4" />
        </button>
      </div>
    </aside>
  );
}
