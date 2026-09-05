"use client";

import {
  ChevronDownIcon,
  GithubIcon,
  RocketIcon,
  SettingsIcon,
} from "lucide-react";

import { cn } from "./qreatify-builder-topbar-utils/utils";
import QreatifyAgentStatusPill, {
  type QreatifyAgentStatus,
} from "./qreatify-builder-topbar-utils/qreatify-agent-status-pill";
import QreatifyBuilderToolbar, {
  type QreatifyBuilderToolId,
} from "./qreatify-builder-topbar-utils/qreatify-builder-toolbar";

export type QreatifyBuilderTopbarProps = {
  appName?: string;
  workspaceName?: string;
  activeTool?: QreatifyBuilderToolId;
  status?: QreatifyAgentStatus;
  path?: string;
  onPublish?: () => void;
  className?: string;
};

export default function QreatifyBuilderTopbar({
  appName = "Mini portfolio website",
  workspaceName = "Project Workspace",
  activeTool = "preview",
  status = "ready",
  path = "/",
  onPublish,
  className,
}: QreatifyBuilderTopbarProps) {
  return (
    <header
      className={cn(
        "flex h-12 items-center gap-3 border-b border-border/70 bg-background/95 px-3 shadow-sm",
        className,
      )}
    >
      <div className="grid size-8 place-items-center rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-purple-700 text-xs font-bold text-white">
        {appName.slice(0, 1).toUpperCase()}
      </div>
      <button
        type="button"
        className="min-w-0 text-left"
        title={appName}
      >
        <span className="flex min-w-0 items-center gap-1 text-sm font-semibold">
          <span className="max-w-56 truncate">{appName}</span>
          <ChevronDownIcon className="size-3.5 text-muted-foreground" />
        </span>
        <span className="block truncate text-xs text-muted-foreground">
          {workspaceName}
        </span>
      </button>

      <QreatifyBuilderToolbar activeTool={activeTool} className="ml-3" />

      <div className="mx-auto flex min-w-40 max-w-md flex-1 items-center justify-center rounded-md bg-muted/50 px-3 py-1 text-sm font-medium text-muted-foreground">
        {path}
      </div>

      <QreatifyAgentStatusPill status={status} />
      <button
        type="button"
        className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="GitHub repository"
      >
        <GithubIcon className="size-4" />
      </button>
      <button
        type="button"
        onClick={onPublish}
        className="inline-flex h-8 items-center gap-2 rounded-md bg-foreground px-3 text-xs font-semibold text-background transition-colors hover:bg-foreground/90"
      >
        <RocketIcon className="size-3.5" />
        Publish
      </button>
      <button
        type="button"
        className="grid size-8 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        title="Settings"
      >
        <SettingsIcon className="size-4" />
      </button>
    </header>
  );
}
