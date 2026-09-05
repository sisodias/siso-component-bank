"use client";

import { BotIcon, CheckCircleIcon, PlayIcon, ShieldCheckIcon } from "lucide-react";

import { cn } from "./qreatify-super-agent-card-utils/utils";

export type QreatifySuperAgentCardProps = {
  name?: string;
  role?: string;
  description?: string;
  status?: "active" | "draft" | "paused";
  tools?: string[];
  trigger?: string;
  onRun?: () => void;
  className?: string;
};

export default function QreatifySuperAgentCard({
  name = "Web builder agent",
  role = "App delivery",
  description = "Plans, edits, verifies, and ships app changes from chat.",
  status = "active",
  tools = ["files.read", "files.write", "build.run", "deploy.prepare"],
  trigger = "When the user asks Qreatify to build or improve a project",
  onRun,
  className,
}: QreatifySuperAgentCardProps) {
  return (
    <article
      className={cn(
        "w-full max-w-md rounded-2xl border border-border/70 bg-background p-4 shadow-sm",
        className,
      )}
    >
      <div className="flex items-start gap-3">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
          <BotIcon className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <h3 className="truncate font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-xs font-semibold",
                status === "active" && "bg-emerald-500/10 text-emerald-600",
                status === "paused" && "bg-amber-500/10 text-amber-600",
                status === "draft" && "bg-muted text-muted-foreground",
              )}
            >
              {status}
            </span>
          </div>
          <p className="mt-3 text-sm leading-5 text-muted-foreground">
            {description}
          </p>
        </div>
      </div>

      <div className="mt-4 rounded-xl border bg-muted/30 p-3">
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
          <ShieldCheckIcon className="size-3.5" />
          Trigger
        </div>
        <p className="mt-1 text-sm text-foreground">{trigger}</p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {tools.map((tool) => (
          <span
            key={tool}
            className="inline-flex h-7 items-center gap-1 rounded-full bg-muted px-2.5 text-xs text-muted-foreground"
          >
            <CheckCircleIcon className="size-3" />
            {tool}
          </span>
        ))}
      </div>

      <button
        type="button"
        onClick={onRun}
        className="mt-5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-foreground text-sm font-semibold text-background transition-opacity hover:opacity-90"
      >
        <PlayIcon className="size-4" />
        Run agent
      </button>
    </article>
  );
}
