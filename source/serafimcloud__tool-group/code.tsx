"use client";

import {
  memo,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ComponentType,
  type ReactNode,
} from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SHIMMER_KEY = "an-tool-group-shimmer";

function ensureShimmerStyles() {
  if (typeof document === "undefined") return;
  if (document.getElementById(SHIMMER_KEY)) return;
  const style = document.createElement("style");
  style.id = SHIMMER_KEY;
  style.textContent = `
@keyframes an-tg-shimmer {
  from { background-position: 100% center; }
  to { background-position: 0% center; }
}
.an-tg-shimmer {
  display: inline-block;
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(90deg, var(--an-tg-shimmer-base, #a3a3a3) 0%, var(--an-tg-shimmer-base, #a3a3a3) 40%, var(--an-tg-shimmer-hi, #525252) 50%, var(--an-tg-shimmer-base, #a3a3a3) 60%, var(--an-tg-shimmer-base, #a3a3a3) 100%);
  background-repeat: no-repeat;
  animation: an-tg-shimmer 2s linear infinite;
}
.dark .an-tg-shimmer {
  --an-tg-shimmer-base: #525252;
  --an-tg-shimmer-hi: #a3a3a3;
}
`;
  document.head.appendChild(style);
}

function IconChevronRight({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M9 6l6 6l-6 6" />
    </svg>
  );
}

function IconFile({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14 3v4a1 1 0 0 0 1 1h4" />
      <path d="M17 21h-10a2 2 0 0 1 -2 -2v-14a2 2 0 0 1 2 -2h7l5 5v11a2 2 0 0 1 -2 2z" />
    </svg>
  );
}

function IconSearch({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="10" cy="10" r="7" />
      <path d="M21 21l-6 -6" />
    </svg>
  );
}

function IconTerminal({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M5 7l5 5l-5 5" />
      <path d="M12 19h7" />
    </svg>
  );
}

const CATEGORY_ICONS: Record<NestedToolCategory, ComponentType<{ className?: string }>> = {
  file: IconFile,
  search: IconSearch,
  command: IconTerminal,
  generic: IconFile,
};

export type NestedToolCategory = "file" | "search" | "command" | "generic";

export type NestedTool = {
  category?: NestedToolCategory;
  icon?: ComponentType<{ className?: string }>;
  title: string;
  subtitle?: string;
  isError?: boolean;
};

function formatCount(value: number, label: string) {
  return `${value} ${value === 1 ? label : `${label}s`}`;
}

function summarizeCounts(tools: NestedTool[]): string {
  let fileCount = 0;
  let searchCount = 0;
  let commandCount = 0;
  for (const t of tools) {
    if (t.category === "file") fileCount += 1;
    else if (t.category === "search") searchCount += 1;
    else if (t.category === "command") commandCount += 1;
  }
  const parts: string[] = [];
  if (fileCount > 0) parts.push(formatCount(fileCount, "file"));
  if (searchCount > 0)
    parts.push(`${searchCount} ${searchCount === 1 ? "search" : "searches"}`);
  if (commandCount > 0) parts.push(formatCount(commandCount, "command"));
  if (parts.length === 0) return "";
  if (parts.length === 1) return parts[0];
  if (parts.length === 2) return `${parts[0]} and ${parts[1]}`;
  return `${parts.slice(0, -1).join(", ")}, and ${parts[parts.length - 1]}`;
}

function streamingCountsLabel(tools: NestedTool[]): string {
  let fileCount = 0;
  let searchCount = 0;
  for (const t of tools) {
    if (t.category === "file") fileCount += 1;
    else if (t.category === "search") searchCount += 1;
  }
  const parts: string[] = [];
  if (fileCount > 0) parts.push(formatCount(fileCount, "file"));
  if (searchCount > 0)
    parts.push(`${searchCount} ${searchCount === 1 ? "search" : "searches"}`);
  return parts.join(", ");
}

function NestedToolRow({
  tool,
  isShimmer,
}: {
  tool: NestedTool;
  isShimmer?: boolean;
}) {
  const Icon = tool.icon ?? CATEGORY_ICONS[tool.category ?? "generic"];
  return (
    <div className="flex items-center gap-2 h-7 text-sm text-neutral-700 dark:text-neutral-300">
      <Icon
        className={cn(
          "w-3.5 h-3.5 shrink-0",
          tool.isError
            ? "text-red-500"
            : "text-neutral-500 dark:text-neutral-400",
        )}
      />
      <span
        className={cn(
          "truncate",
          isShimmer && "an-tg-shimmer",
          tool.isError && "text-red-500",
        )}
      >
        {tool.title}
      </span>
      {tool.subtitle && (
        <span className="text-neutral-500 dark:text-neutral-400 truncate">
          {tool.subtitle}
        </span>
      )}
    </div>
  );
}

export type ToolGroupState = "completed" | "pending" | "interrupted";

export type ToolGroupProps = {
  state?: ToolGroupState;
  /** Optional summary text used when no nested tools are provided. */
  description?: string;
  nestedTools?: NestedTool[];
  completeLabel: string;
  shimmerLabel?: string;
  interruptedLabel: string;
  /** Pre-formatted elapsed time string, e.g. "6s" or "1m 12s". */
  elapsedTime?: string;
  defaultOpen?: boolean;
  maxVisibleTools?: number;
  showElapsed?: boolean;
  className?: string;
};

export const ToolGroup = memo(function ToolGroup({
  state = "completed",
  description,
  nestedTools = [],
  completeLabel,
  shimmerLabel,
  interruptedLabel,
  elapsedTime,
  defaultOpen,
  maxVisibleTools = 5,
  showElapsed = true,
  className,
}: ToolGroupProps) {
  useEffect(() => {
    ensureShimmerStyles();
  }, []);

  const isPending = state === "pending";
  const isInterrupted = state === "interrupted";
  const hasNestedTools = nestedTools.length > 0;
  const [expanded, setExpanded] = useState(
    defaultOpen ?? (isPending && hasNestedTools),
  );
  const [visibleCount, setVisibleCount] = useState(
    isPending ? 0 : nestedTools.length,
  );
  const listRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isPending || nestedTools.length === 0) {
      setVisibleCount(nestedTools.length);
      return;
    }
    let index = 1;
    setVisibleCount(Math.min(index, nestedTools.length));
    const interval = setInterval(() => {
      index += 1;
      setVisibleCount(Math.min(index, nestedTools.length));
      if (index >= nestedTools.length) clearInterval(interval);
    }, 450);
    return () => clearInterval(interval);
  }, [isPending, nestedTools.length]);

  useEffect(() => {
    if (!isPending || !listRef.current) return;
    listRef.current.scrollTop = listRef.current.scrollHeight;
  }, [isPending, visibleCount]);

  if (isInterrupted) {
    return (
      <div
        className={cn(
          "flex items-center gap-2 h-8 text-sm text-neutral-500 dark:text-neutral-400",
          className,
        )}
      >
        <span>{interruptedLabel}</span>
      </div>
    );
  }

  const visibleTools = isPending
    ? nestedTools.slice(0, Math.max(visibleCount, 0))
    : nestedTools;
  const visibleToolCount = visibleTools.length;
  const subtitle = isPending
    ? streamingCountsLabel(visibleTools)
    : hasNestedTools
      ? summarizeCounts(nestedTools)
      : description
        ? description.length > 60
          ? `${description.slice(0, 57)}...`
          : description
        : "";
  const headerLabel = isPending ? shimmerLabel ?? completeLabel : completeLabel;
  const showElapsedDisplay = showElapsed && elapsedTime;
  const maskThreshold = 4;
  const streamHeight = Math.max(1, maxVisibleTools) * 28;

  return (
    <div className={cn("w-full", className)}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        disabled={!hasNestedTools}
        className={cn(
          "group w-full flex items-center gap-2 h-8 text-sm text-left",
          hasNestedTools
            ? "cursor-pointer text-neutral-700 dark:text-neutral-300"
            : "cursor-default text-neutral-700 dark:text-neutral-300",
        )}
      >
        {hasNestedTools && (
          <IconChevronRight
            className={cn(
              "w-3.5 h-3.5 shrink-0 text-neutral-500 dark:text-neutral-400 transition-transform",
              expanded ? "rotate-90" : "rotate-0",
            )}
          />
        )}
        <span
          className={cn(
            "shrink-0",
            isPending && "an-tg-shimmer",
          )}
        >
          {headerLabel}
        </span>
        {subtitle && (
          <span className="text-neutral-500 dark:text-neutral-400 truncate min-w-0 flex-1">
            {subtitle}
          </span>
        )}
        {showElapsedDisplay && (
          <span className="font-normal tabular-nums shrink-0 text-neutral-400 dark:text-neutral-500">
            {elapsedTime}
          </span>
        )}
      </button>

      {hasNestedTools && expanded && (
        <div className="relative">
          {isPending && visibleToolCount > maskThreshold && (
            <div className="absolute inset-x-0 top-0 h-10 z-10 pointer-events-none bg-gradient-to-b from-white dark:from-neutral-950 to-transparent" />
          )}
          <div
            ref={listRef}
            className={cn(
              "pl-5",
              nestedTools.length > 1 ? "space-y-1" : "space-y-0",
              isPending &&
                visibleToolCount > maskThreshold &&
                "overflow-y-auto",
            )}
            style={
              isPending && visibleToolCount > maskThreshold
                ? { height: `${streamHeight}px` }
                : undefined
            }
          >
            {visibleTools.map((tool, idx) => (
              <NestedToolRow
                key={idx}
                tool={tool}
                isShimmer={isPending && idx === visibleCount - 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
});
