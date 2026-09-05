"use client";

import { BotIcon, PlusIcon } from "lucide-react";

import { cn } from "./qreatify-agent-template-card-utils/utils";

export type QreatifyAgentTemplateCardProps = {
  name?: string;
  role?: string;
  source?: string;
  group?: string;
  description?: string;
  onApply?: () => void;
  className?: string;
};

export default function QreatifyAgentTemplateCard({
  name = "Registry agent",
  role = "Component library operator",
  source = "21st.dev",
  group = "Registry + UI quality",
  description = "Prepares components for team reuse with safe metadata, demos, and publish checks.",
  onApply,
  className,
}: QreatifyAgentTemplateCardProps) {
  return (
    <button
      type="button"
      onClick={onApply}
      className={cn(
        "flex w-full items-start gap-3 rounded-xl border border-border/70 bg-background p-3 text-left transition-colors hover:bg-muted/60",
        className,
      )}
    >
      <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
        <BotIcon className="size-4" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="truncate text-sm font-semibold">{name}</span>
          <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {source}
          </span>
        </span>
        <span className="mt-1 block text-xs font-medium text-muted-foreground">
          {role}
        </span>
        <span className="mt-2 block text-xs leading-5 text-muted-foreground">
          {description}
        </span>
        <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
          <PlusIcon className="size-3.5" />
          Use template
        </span>
      </span>
      <span className="sr-only">{group}</span>
    </button>
  );
}
