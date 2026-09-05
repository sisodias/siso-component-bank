"use client";

import {
  ArrowUpIcon,
  BotIcon,
  ChevronDownIcon,
  MicIcon,
  PaperclipIcon,
  PlusIcon,
  SparklesIcon,
  WrenchIcon,
} from "lucide-react";

import { cn } from "./qreatify-composer-dock-utils/utils";

export type QreatifyComposerMode = "build" | "plan" | "edit" | "discuss";

export type QreatifyComposerDockProps = {
  placeholder?: string;
  value?: string;
  mode?: QreatifyComposerMode;
  suggestions?: string[];
  onSubmit?: () => void;
  className?: string;
};

export default function QreatifyComposerDock({
  placeholder = "What would you like to change?",
  value = "",
  mode = "build",
  suggestions = ["Verbeter hero", "Maak CTA sterker", "Check mobiel"],
  onSubmit,
  className,
}: QreatifyComposerDockProps) {
  return (
    <section className={cn("w-full max-w-2xl", className)}>
      <div className="mb-3 flex flex-wrap gap-2">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            type="button"
            className="h-8 rounded-full border border-border/70 bg-background/80 px-3 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            {suggestion}
          </button>
        ))}
        <button
          type="button"
          className="grid size-8 place-items-center rounded-full border border-border/70 text-muted-foreground hover:bg-muted hover:text-foreground"
          title="More suggestions"
        >
          <PlusIcon className="size-4" />
        </button>
      </div>
      <div className="rounded-3xl border border-input bg-card/85 p-2 shadow-sm backdrop-blur">
        <textarea
          readOnly
          value={value}
          placeholder={placeholder}
          className="min-h-20 w-full resize-none bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
        />
        <div className="flex items-center gap-2 px-2 pb-1">
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Attach"
          >
            <PaperclipIcon className="size-4" />
          </button>
          <button
            type="button"
            className="inline-flex h-8 items-center gap-2 rounded-full bg-muted px-3 text-xs font-semibold text-foreground"
          >
            <SparklesIcon className="size-3.5" />
            {mode.charAt(0).toUpperCase() + mode.slice(1)}
            <ChevronDownIcon className="size-3.5" />
          </button>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Tools"
          >
            <WrenchIcon className="size-4" />
          </button>
          <button
            type="button"
            className="grid size-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            title="Voice"
          >
            <MicIcon className="size-4" />
          </button>
          <button
            type="button"
            className="ml-auto grid size-9 place-items-center rounded-full bg-foreground text-background transition-opacity hover:opacity-90"
            onClick={onSubmit}
            title="Send"
          >
            {mode === "edit" ? (
              <BotIcon className="size-4" />
            ) : (
              <ArrowUpIcon className="size-4" />
            )}
          </button>
        </div>
      </div>
    </section>
  );
}
