"use client";

import {
  BookOpenIcon,
  ExternalLinkIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";

import { cn } from "./qreatify-skill-registry-card-utils/utils";

export type RegistrySkillCardProps = {
  actionLabel?: string;
  command?: string;
  description: string;
  disabled?: boolean;
  enabled?: boolean;
  isDefault?: boolean;
  name: string;
  onAction?: () => void;
  onRemove?: () => void;
  onToggle?: () => void;
  repo?: string;
  scope?: string;
  source?: "workspace" | "skills.sh";
  sourceUrl?: string;
  tone?: "auto" | "light";
  variant?: "installed" | "template";
};

export default function RegistrySkillCard({
  actionLabel,
  command,
  description,
  disabled = false,
  enabled = false,
  isDefault = false,
  name,
  onAction,
  onRemove,
  onToggle,
  repo,
  scope,
  source,
  sourceUrl,
  tone = "auto",
  variant = "installed",
}: RegistrySkillCardProps) {
  const isTemplate = variant === "template";
  const forcedLight = tone === "light";

  return (
    <article
      className={cn(
        "group relative overflow-hidden rounded-xl border border-black/10 bg-white p-4 shadow-sm transition-all duration-200",
        !forcedLight && "dark:border-white/10 dark:bg-card dark:hover:border-white/20",
        "hover:-translate-y-0.5 hover:border-black/20 hover:shadow-md",
        isDefault &&
          "before:absolute before:inset-x-0 before:top-0 before:h-1 before:bg-gradient-to-r before:from-emerald-400 before:via-sky-400 before:to-violet-400",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="truncate font-semibold">{name}</p>
            {source === "skills.sh" && (
              <span
                className={cn(
                  "rounded-full bg-sky-500/10 px-2 py-0.5 text-[10px] font-semibold text-sky-700",
                  !forcedLight && "dark:text-sky-300",
                )}
              >
                skills.sh
              </span>
            )}
            {isDefault && (
              <span
                className={cn(
                  "rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-700",
                  !forcedLight && "dark:text-emerald-300",
                )}
              >
                Default
              </span>
            )}
          </div>
          {(scope || repo) && (
            <p className="mt-1 truncate text-sm text-muted-foreground">
              {scope ?? repo}
            </p>
          )}
          <p
            className={cn(
              "mt-2 line-clamp-2 text-sm leading-5",
              isTemplate ? "text-slate-500" : "text-muted-foreground",
            )}
          >
            {description}
          </p>
          {repo && !scope && (
            <p className="mt-2 truncate text-xs text-slate-500">{repo}</p>
          )}
          {command && (
            <code className="mt-3 block rounded-md bg-muted px-2 py-1 text-[11px] text-muted-foreground">
              {command}
            </code>
          )}
        </div>
        {isTemplate ? (
          <BookOpenIcon className="size-4 shrink-0 text-muted-foreground" />
        ) : (
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-xs font-medium",
              enabled
                ? cn(
                    "bg-emerald-500/10 text-emerald-700",
                    !forcedLight && "dark:text-emerald-300",
                  )
                : "bg-muted text-muted-foreground",
            )}
          >
            {enabled ? "Enabled" : "Off"}
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {sourceUrl && !isTemplate && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium hover:bg-accent"
          >
            Open source
            <ExternalLinkIcon className="size-3.5" />
          </a>
        )}
        {isTemplate ? (
          <button
            type="button"
            className="inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-black/10 text-sm font-medium hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={disabled}
            onClick={onAction}
          >
            <PlusIcon className="size-4" />
            {actionLabel ?? "Add"}
          </button>
        ) : (
          <>
            <button
              type="button"
              disabled={disabled}
              onClick={onToggle}
              className="h-9 rounded-md border px-3 text-sm font-medium hover:bg-accent disabled:cursor-not-allowed disabled:opacity-45"
            >
              {enabled ? "Disable" : "Enable"}
            </button>
            <button
              type="button"
              disabled={disabled}
              onClick={onRemove}
              className="inline-flex h-9 items-center gap-2 rounded-md border px-3 text-sm font-medium text-red-600 hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-45"
            >
              <Trash2Icon className="size-4" />
              Remove
            </button>
          </>
        )}
      </div>
    </article>
  );
}
