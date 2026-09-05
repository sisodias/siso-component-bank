"use client";

import * as React from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { IconChevronRight, IconFileText } from "@tabler/icons-react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const SHIMMER_STYLE_ID = "an-search-tool-shimmer-styles";
const SHIMMER_STYLES = `
@keyframes an-search-shimmer {
  from { background-position: 100% center; }
  to { background-position: 0% center; }
}
.an-search-shimmer {
  display: inline-flex;
  align-items: center;
  height: 1rem;
  background-size: 250% 100%;
  background-clip: text;
  -webkit-background-clip: text;
  color: transparent;
  background-image: linear-gradient(90deg, #a3a3a3 0%, #a3a3a3 40%, #525252 50%, #a3a3a3 60%, #a3a3a3 100%);
  background-repeat: no-repeat;
  animation: an-search-shimmer 1.2s linear infinite;
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

export type SearchResult = {
  title: string;
  source: string;
  date?: string;
};

export type SearchToolProps = {
  /** "searching" shows shimmer label; "done" shows result count. Default: "done". */
  state?: "searching" | "done";
  /** Query text shown in the panel header. */
  query: string;
  /** Result rows — empty array (or omitted) hides the panel. */
  results?: SearchResult[];
  /** Initial expand state when results exist. */
  defaultOpen?: boolean;
  /** Controlled expand state (pair with `onToggleExpand`). */
  expanded?: boolean;
  onToggleExpand?: () => void;
  className?: string;
};

export const SearchTool = React.memo(function SearchTool({
  state = "done",
  query,
  results = [],
  defaultOpen = false,
  expanded,
  onToggleExpand,
  className,
}: SearchToolProps) {
  React.useEffect(() => {
    ensureShimmerStyles();
  }, []);

  const isControlled = expanded !== undefined;
  const [internalOpen, setInternalOpen] = React.useState(defaultOpen);
  const isOpen = isControlled ? !!expanded : internalOpen;

  const isAnimating = state === "searching";
  const totalResults = results.length;
  const expandable = totalResults > 0;

  const handleToggle = () => {
    if (!expandable) return;
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
        disabled={!expandable}
        aria-expanded={expandable ? isOpen : undefined}
        className={cn(
          "group flex items-center max-w-full select-none gap-1 bg-transparent border-0 p-0 m-0 text-left",
          expandable ? "cursor-pointer" : "cursor-default",
        )}
      >
        <div className="flex items-center gap-2 min-w-0 text-sm text-neutral-500 dark:text-neutral-400">
          <span className="font-[450] whitespace-nowrap shrink-0">
            {isAnimating ? (
              <span className="an-search-shimmer">Searching...</span>
            ) : (
              `Found ${totalResults} result${totalResults === 1 ? "" : "s"}`
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
        <div className="rounded-[10px] overflow-hidden bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
          <div className="flex items-center px-2.5 py-0 border-b border-neutral-200 dark:border-neutral-800 h-7 text-xs gap-1">
            <span className="text-neutral-900 dark:text-neutral-100 font-medium">
              Searched for
            </span>{" "}
            <span className="text-neutral-500 dark:text-neutral-400 truncate">
              &ldquo;{query}&rdquo;
            </span>
          </div>
          <div className="max-h-[200px] overflow-y-auto bg-white dark:bg-neutral-950">
            <div className="flex flex-col gap-1 p-1">
              {results.map((result, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-2 px-2 py-1 rounded-[6px] cursor-default",
                    "hover:bg-neutral-200/50 dark:hover:bg-neutral-800/50",
                  )}
                >
                  <div className="flex items-center justify-center w-4 h-4 shrink-0 text-neutral-500 dark:text-neutral-400">
                    <IconFileText className="w-4 h-4" />
                  </div>
                  <span className="text-sm text-neutral-900 dark:text-neutral-100 truncate flex-1 min-w-0">
                    {result.title}
                  </span>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 shrink-0 whitespace-nowrap">
                    {result.date || result.source}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
