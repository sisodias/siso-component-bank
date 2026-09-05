"use client";

import { BookOpenIcon, WorkflowIcon, XIcon } from "lucide-react";

import { cn } from "./qreatify-chat-empty-state-utils/utils";

export type QreatifyChatEmptyStateProps = {
  variant?: "prompts" | "automations";
  conversationTitle?: string;
  onClose?: () => void;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
  className?: string;
};

export default function QreatifyChatEmptyState({
  variant = "prompts",
  conversationTitle = "This chat",
  onClose,
  onPrimaryAction,
  onSecondaryAction,
  className,
}: QreatifyChatEmptyStateProps) {
  const isAutomation = variant === "automations";
  const Icon = isAutomation ? WorkflowIcon : BookOpenIcon;

  return (
    <section
      className={cn(
        "flex min-h-96 w-full max-w-md flex-col border-r bg-zinc-950 text-white shadow-2xl",
        className,
      )}
    >
      <div className="flex h-12 shrink-0 items-center justify-between border-b border-white/10 px-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h2 className="text-lg font-semibold">
              {isAutomation ? "Automations" : "Plans and prompts"}
            </h2>
            <span className="text-xs text-white/45">
              {isAutomation ? "0 for this chat" : "0 saved"}
            </span>
          </div>
          <p className="truncate text-xs text-white/45">
            {conversationTitle}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="grid size-7 shrink-0 place-items-center rounded-md text-white/55 hover:bg-white/10 hover:text-white"
          title="Close"
        >
          <XIcon className="size-4" />
        </button>
      </div>

      <div className="flex flex-1 items-center justify-center p-8 text-center">
        <div className="max-w-xs">
          <div className="mx-auto mb-4 grid size-12 place-items-center rounded-full bg-white/7 text-white/65">
            <Icon className="size-5" />
          </div>
          <p className="font-semibold">
            {isAutomation
              ? "No chat automations yet"
              : "No plans or prompts yet"}
          </p>
          <p className="mt-2 text-sm leading-5 text-white/55">
            {isAutomation
              ? "Automations here belong to this conversation. Use them for follow ups, recurring checks, reminders, or agent tasks."
              : "Save useful prompts and implementation plans for this chat here."}
          </p>
          <div className="mt-6 flex justify-center gap-2">
            <button
              type="button"
              className="rounded-lg bg-white px-3 py-2 text-sm font-semibold text-black"
              onClick={onPrimaryAction}
            >
              {isAutomation ? "Create via chat" : "Draft plan"}
            </button>
            <button
              type="button"
              className="rounded-lg bg-white/8 px-3 py-2 text-sm font-semibold text-white hover:bg-white/12"
              onClick={onSecondaryAction}
            >
              {isAutomation ? "Create manually" : "Save prompt"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
