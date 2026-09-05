"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IconChevronRight } from "@tabler/icons-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SHIMMER_STYLE_ID = "an-thinking-tool-shimmer-styles";
const SHIMMER_STYLES = `
@keyframes an-thinking-shimmer {
  from { background-position: 100% center; }
  to { background-position: 0% center; }
}
.an-thinking-shimmer {
  display: inline-flex;
  align-items: center;
  height: 1rem;
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(90deg, #a3a3a3 0%, #a3a3a3 40%, #525252 50%, #a3a3a3 60%, #a3a3a3 100%);
  background-repeat: no-repeat;
  animation: an-thinking-shimmer 1.2s linear infinite;
}
`;

let shimmerStylesInjected = false;
function ensureShimmerStyles() {
  if (typeof document === "undefined") return;
  if (shimmerStylesInjected) return;
  if (document.getElementById(SHIMMER_STYLE_ID)) {
    shimmerStylesInjected = true;
    return;
  }
  const el = document.createElement("style");
  el.id = SHIMMER_STYLE_ID;
  el.textContent = SHIMMER_STYLES;
  document.head.appendChild(el);
  shimmerStylesInjected = true;
}

export type ThinkingToolProps = {
  /** "thinking" shows shimmer header; "thought" shows static header. */
  state?: "thinking" | "thought";
  /** Optional reasoning content. When provided, the row is expandable. */
  content?: string;
  /** Initial open state for uncontrolled usage. */
  defaultOpen?: boolean;
  /** Controlled open state (pair with `onToggleExpand`). */
  expanded?: boolean;
  /** Called when the user toggles the chevron in controlled mode. */
  onToggleExpand?: () => void;
  className?: string;
};

export const ThinkingTool = React.memo(function ThinkingTool({
  state = "thinking",
  content,
  defaultOpen = false,
  expanded,
  onToggleExpand,
  className,
}: ThinkingToolProps) {
  React.useEffect(() => {
    ensureShimmerStyles();
  }, []);

  const isControlled = expanded !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? !!expanded : internalOpen;

  const expandable = !!content;
  const isAnimating = state === "thinking";
  const canToggle = expandable;

  const handleToggle = () => {
    if (!canToggle) return;
    if (isControlled) {
      onToggleExpand?.();
    } else {
      setInternalOpen((v) => !v);
    }
  };

  return (
    <div className={cn("flex flex-col gap-2 w-full", className)}>
      <button
        type="button"
        onClick={handleToggle}
        disabled={!canToggle}
        aria-expanded={canToggle ? isOpen : undefined}
        className={cn(
          "group flex items-center max-w-full select-none gap-1 rounded-[6px] bg-transparent border-0 p-0 m-0 text-left",
          canToggle ? "cursor-pointer" : "cursor-default",
        )}
      >
        <div className="flex items-center gap-2 min-w-0 text-sm text-neutral-500 dark:text-neutral-400">
          <span className="font-[450] whitespace-nowrap shrink-0">
            {isAnimating ? (
              <span className="an-thinking-shimmer">Thinking</span>
            ) : (
              "Thought"
            )}
          </span>
        </div>
        {expandable && (
          <IconChevronRight
            className={cn(
              "shrink-0 text-neutral-500 dark:text-neutral-400 transition-transform duration-150 ease-out size-3",
              isOpen ? "rotate-90" : "rotate-0",
            )}
          />
        )}
      </button>
      {expandable && isOpen && (
        <div className="overflow-hidden">
          <div className="max-h-[175px] overflow-y-auto">
            <p className="text-sm text-neutral-500 dark:text-neutral-400 whitespace-pre-wrap">
              {content}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});
