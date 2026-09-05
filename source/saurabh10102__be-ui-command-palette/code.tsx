"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, useReducedMotion } from "motion/react";
import { Search, type LucideIcon } from "lucide-react";
import {
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;

export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

export const SPRING_PRESS = {
  type: "spring",
  stiffness: 500,
  damping: 30,
  mass: 0.6,
} as const;

export const SPRING_SWAP = {
  type: "spring",
  stiffness: 460,
  damping: 30,
  mass: 0.55,
} as const;

export const SPRING_PANEL = {
  type: "spring",
  stiffness: 420,
  damping: 40,
  mass: 0.5,
} as const;

export const SPRING_LAYOUT = {
  type: "spring",
  stiffness: 360,
  damping: 32,
  mass: 0.6,
} as const;

export const SPRING_MOUSE = {
  stiffness: 200,
  damping: 15,
  mass: 0.3,
} as const;

export type CommandItem = {
  id: string;
  label: string;
  group?: string;
  hint?: string;
  keywords?: string[];
  icon?: LucideIcon;
  badge?: ReactNode;
  onSelect: () => void;
};

export interface CommandPaletteProps {
  items: CommandItem[];
  shortcut?: string;
  placeholder?: string;
  emptyMessage?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

function fuzzyMatch(needle: string, hay: string) {
  if (!needle) return true;

  needle = needle.toLowerCase();
  hay = hay.toLowerCase();

  let i = 0;

  for (const ch of hay) {
    if (ch === needle[i]) i++;
    if (i === needle.length) return true;
  }

  return false;
}

const PANEL_SPRING = {
  type: "spring",
  stiffness: 560,
  damping: 40,
  mass: 0.5,
} as const;

export function CommandPalette({
  items,
  shortcut = "k",
  placeholder = "Type a command or search…",
  emptyMessage = "No results found.",
  open: controlledOpen,
  onOpenChange,
}: CommandPaletteProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const controlled = controlledOpen !== undefined;
  const open = controlled ? controlledOpen : internalOpen;

  const setOpen = useCallback(
    (value: boolean) => {
      if (!controlled) setInternalOpen(value);
      onOpenChange?.(value);
    },
    [controlled, onOpenChange],
  );

  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  const uid = useId();
  const reduce = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const updateQuery = useCallback((value: string) => {
    setQuery(value);
    setActive(0);
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (
        (event.metaKey || event.ctrlKey) &&
        event.key.toLowerCase() === shortcut.toLowerCase()
      ) {
        event.preventDefault();
        setOpen(!open);
        return;
      }

      if (event.key === "Escape" && open) {
        event.preventDefault();
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => window.removeEventListener("keydown", onKey);
  }, [open, shortcut, setOpen]);

  useEffect(() => {
    if (!open) return;

    updateQuery("");
    setActive(0);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [open, updateQuery]);

  useEffect(() => {
    if (!open) return;

    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const filtered = useMemo(() => {
    if (!query) return items;

    return items.filter((item) => {
      const haystacks = [
        item.label,
        item.group ?? "",
        ...(item.keywords ?? []),
      ];

      return haystacks.some((haystack) => fuzzyMatch(query, haystack));
    });
  }, [items, query]);

  const hasIcons = useMemo(() => items.some((item) => item.icon), [items]);

  const grouped = useMemo(() => {
    const map = new Map<string, CommandItem[]>();

    filtered.forEach((item) => {
      const group = item.group ?? "Results";
      const groupItems = map.get(group) ?? [];
      groupItems.push(item);
      map.set(group, groupItems);
    });

    return Array.from(map.entries());
  }, [filtered]);

  const onKeyDown = (event: ReactKeyboardEvent) => {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => Math.min(filtered.length - 1, value + 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => Math.max(0, value - 1));
    } else if (event.key === "Enter") {
      event.preventDefault();

      const item = filtered[active];

      if (item) {
        item.onSelect();
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    if (!open) return;

    const el = listRef.current?.querySelector<HTMLButtonElement>(
      `[data-index="${active}"]`,
    );

    el?.scrollIntoView({ block: "nearest" });
  }, [active, open]);

  let cursor = 0;

  if (!mounted) return null;

  return createPortal(
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[100]",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <motion.div
        initial={false}
        animate={{ opacity: open ? 1 : 0 }}
        transition={{ duration: open ? 0.18 : 0.12, ease: EASE_OUT }}
        onClick={() => setOpen(false)}
        className={cn(
          "absolute inset-0 bg-background/5 [backdrop-filter:blur(12px)_saturate(140%)] [-webkit-backdrop-filter:blur(12px)_saturate(140%)]",
          open ? "pointer-events-auto" : "pointer-events-none",
        )}
      />

      <div className="pointer-events-none absolute inset-0 flex items-start justify-center p-4 pt-[18vh]">
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Command palette"
          initial={false}
          animate={{
            opacity: open ? 1 : 0,
            y: open || reduce ? 0 : -8,
            scale: open || reduce ? 1 : 0.97,
          }}
          transition={
            reduce
              ? { duration: 0.1 }
              : open
                ? PANEL_SPRING
                : { duration: 0.12, ease: EASE_OUT }
          }
          onKeyDown={onKeyDown}
          className={cn(
            "w-full max-w-xl overflow-hidden rounded-2xl border border-border bg-card shadow-2xl will-change-transform",
            open ? "pointer-events-auto" : "pointer-events-none",
          )}
        >
          <div className="flex items-center gap-3 border-b border-border px-4">
            <Search className="h-4 w-4 text-muted-foreground" />

            <input
              ref={inputRef}
              value={query}
              onChange={(event) => updateQuery(event.target.value)}
              placeholder={placeholder}
              tabIndex={open ? 0 : -1}
              role="combobox"
              aria-expanded={open}
              aria-controls={`${uid}-list`}
              aria-activedescendant={
                filtered.length > 0 ? `${uid}-opt-${active}` : undefined
              }
              aria-autocomplete="list"
              className="h-12 flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
            />

            <kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground sm:inline-block">
              ESC
            </kbd>
          </div>

          <div
            ref={listRef}
            id={`${uid}-list`}
            role="listbox"
            aria-label="Commands"
            className="max-h-[60vh] overflow-y-auto p-2"
          >
            {filtered.length === 0 ? (
              <div className="p-8 text-center text-sm text-muted-foreground">
                {emptyMessage}
              </div>
            ) : (
              grouped.map(([group, list]) => (
                <div key={group} className="mb-1 last:mb-0">
                  <div
                    aria-hidden
                    className="px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
                  >
                    {group}
                  </div>

                  {list.map((item) => {
                    const idx = cursor++;
                    const isActive = idx === active;
                    const Icon = item.icon;

                    return (
                      <button
                        key={item.id}
                        type="button"
                        id={`${uid}-opt-${idx}`}
                        role="option"
                        aria-selected={isActive}
                        data-index={idx}
                        onMouseEnter={() => setActive(idx)}
                        onClick={() => {
                          item.onSelect();
                          setOpen(false);
                        }}
                        tabIndex={open ? 0 : -1}
                        className={cn(
                          "relative isolate flex w-full items-center gap-3 rounded-md px-2 py-2 text-left text-sm transition-colors",
                          isActive
                            ? "text-foreground"
                            : "text-muted-foreground",
                        )}
                      >
                        {isActive ? (
                          <motion.span
                            layoutId={`${uid}-active`}
                            className="absolute inset-0 z-0 rounded-md bg-primary/[0.05]"
                            transition={
                              reduce
                                ? { duration: 0 }
                                : {
                                    type: "spring",
                                    stiffness: 480,
                                    damping: 38,
                                  }
                            }
                          />
                        ) : null}

                        {Icon ? (
                          <Icon className="relative z-10 h-4 w-4" />
                        ) : hasIcons ? (
                          <span className="relative z-10 h-4 w-4" />
                        ) : null}

                        <span className="relative z-10 flex-1 truncate">
                          {item.label}
                        </span>

                        {item.badge ? (
                          <span className="relative z-10 shrink-0">
                            {item.badge}
                          </span>
                        ) : null}

                        {item.hint ? (
                          <kbd className="relative z-10 rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
                            {item.hint}
                          </kbd>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>,
    document.body,
  );
}