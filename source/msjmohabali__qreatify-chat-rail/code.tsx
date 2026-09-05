"use client";

import { BookOpenIcon, PlusIcon, WorkflowIcon } from "lucide-react";

import { cn } from "./qreatify-chat-rail-utils/utils";

export type QreatifyChatRailPanel = "prompts" | "automations" | null;

export type QreatifyChatRailProps = {
  workspaceInitial?: string;
  activePanel?: QreatifyChatRailPanel;
  onNewChat?: () => void;
  onPanelChange?: (panel: QreatifyChatRailPanel) => void;
  className?: string;
};

export default function QreatifyChatRail({
  workspaceInitial = "Q",
  activePanel = null,
  onNewChat,
  onPanelChange,
  className,
}: QreatifyChatRailProps) {
  const togglePanel = (panel: Exclude<QreatifyChatRailPanel, null>) => {
    onPanelChange?.(activePanel === panel ? null : panel);
  };

  return (
    <div
      className={cn(
        "flex w-10 flex-col items-center gap-1.5 rounded-2xl border bg-background/92 p-1.5 shadow-lg backdrop-blur",
        className,
      )}
    >
      <div className="grid size-8 place-items-center rounded-lg bg-orange-500 text-xs font-semibold text-white">
        {workspaceInitial.slice(0, 1).toUpperCase()}
      </div>
      <button
        type="button"
        onClick={onNewChat}
        className="grid size-8 place-items-center rounded-lg border border-dashed text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="New chat"
      >
        <PlusIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => togglePanel("prompts")}
        className={cn(
          "grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          activePanel === "prompts" && "bg-muted text-foreground",
        )}
        title="Plans and prompts"
      >
        <BookOpenIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={() => togglePanel("automations")}
        className={cn(
          "grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground",
          activePanel === "automations" && "bg-muted text-foreground",
        )}
        title="Automations"
      >
        <WorkflowIcon className="size-4" />
      </button>
    </div>
  );
}
