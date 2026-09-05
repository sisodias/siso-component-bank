"use client";

import type { LucideIcon } from "lucide-react";
import {
  FilePlus2Icon,
  GithubIcon,
  SearchIcon,
  SlidersHorizontalIcon,
  SparklesIcon,
  WorkflowIcon,
} from "lucide-react";

import { cn } from "./qreatify-home-command-center-utils/utils";
import QreatifyHomeActionCard from "./qreatify-home-command-center-utils/qreatify-home-action-card";

export type QreatifyPromptChip = {
  label: string;
  icon?: LucideIcon;
  prompt?: string;
};

export type QreatifyHomeCommandCenterProps = {
  greeting?: string;
  name?: string;
  description?: string;
  promptChips?: QreatifyPromptChip[];
  onCreate?: () => void;
  onImport?: () => void;
  onPrompt?: (prompt: string) => void;
  className?: string;
};

const defaultPromptChips: QreatifyPromptChip[] = [
  {
    icon: SearchIcon,
    label: "Search & Summarize",
    prompt: "Search this workspace and summarize the project context.",
  },
  {
    icon: FilePlus2Icon,
    label: "Create",
    prompt: "Create the next useful Qreatify build.",
  },
  {
    icon: WorkflowIcon,
    label: "Automate",
    prompt: "Find one workflow that can be automated safely.",
  },
  {
    icon: SlidersHorizontalIcon,
    label: "Across your tools",
    prompt: "Review connected tools and propose the best next integration.",
  },
];

export default function QreatifyHomeCommandCenter({
  greeting = "Good morning",
  name = "builder",
  description = "Ask Qreatify to build, improve, connect, deploy, or review your app.",
  promptChips = defaultPromptChips,
  onCreate,
  onImport,
  onPrompt,
  className,
}: QreatifyHomeCommandCenterProps) {
  return (
    <section
      className={cn(
        "flex w-full max-w-2xl flex-col items-center text-center",
        className,
      )}
    >
      <div className="mb-5 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-purple-700 text-lg font-bold text-white shadow-xl md:hidden">
        Q
      </div>
      <h1 className="text-3xl font-medium tracking-tight text-foreground md:text-4xl">
        {greeting}, {name}!
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
        {description}
      </p>

      <div className="mt-7 grid w-full gap-3 sm:grid-cols-[1.15fr_0.85fr]">
        <QreatifyHomeActionCard onClick={onCreate} />
        <QreatifyHomeActionCard
          title="Import repo"
          description="Continue from existing code."
          icon={GithubIcon}
          variant="secondary"
          onClick={onImport}
        />
      </div>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        {promptChips.map((chip) => {
          const Icon = chip.icon ?? SparklesIcon;
          return (
            <button
              key={chip.label}
              type="button"
              onClick={() => onPrompt?.(chip.prompt ?? chip.label)}
              className="inline-flex h-9 items-center gap-2 rounded-full border border-border/70 bg-background/75 px-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <Icon className="size-4" />
              {chip.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
