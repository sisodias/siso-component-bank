"use client";

import * as React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import {
  Command,
  Search,
  ArrowDown,
  ArrowUp,
  CornerDownLeft,
  X,
  Pin,
  History,
  ExternalLink,
  ChevronRight,
  Loader2,
  Moon,
  Sun,
} from "lucide-react";

// Utility: className merger (avoid an extra dep)
function cn(...classes: Array<string | undefined | null | false>) {
  return classes.filter(Boolean).join(" ");
}

/**
 * Types
 */
export type OmniItem = {
  id: string;
  label: string;
  groupId: string; // which group it belongs to
  subtitle?: string;
  href?: string; // optional navigation
  icon?: React.ReactNode;
  shortcut?: string[]; // e.g., ["⌘", "K"]
  pinned?: boolean;
  disabled?: boolean;
  keywords?: string[];
  onAction?: () => void; // if set, executes on select
};

export type OmniSource = {
  id: string;
  label: string;
  // Return items for a query; can be sync or async.
  fetch: (query: string) => Promise<OmniItem[]> | OmniItem[];
  // Show when no matches for this source
  emptyHint?: React.ReactNode;
  // Optional min query length before calling fetch
  minQuery?: number;
};

type RecentEntry = Pick<OmniItem, "id" | "label" | "groupId" | "href" | "shortcut">;

export type OmniCommandPaletteProps = {
  open?: boolean;
  onOpenChange?: (v: boolean) => void;

  // Data
  sources: OmniSource[];

  // UX
  placeholder?: string;
  storageKey?: string; // for recents
  showRecents?: boolean;
  maxRecents?: number;
  showPinnedFirst?: boolean;

  // Visuals
  className?: string;
  contentClassName?: string;

  // Behavior
  debounceMs?: number; // input debounce for async sources
  onItemExecuted?: (item: OmniItem) => void;

  // Render overrides
  renderItem?: (item: OmniItem, active: boolean) => React.ReactNode;
  renderHeader?: (query: string) => React.ReactNode;
  renderFooter?: (activeItem: OmniItem | null) => React.ReactNode;

  // Keyboard
  openKeys?: Array<{ key: string; meta?: boolean; ctrl?: boolean; alt?: boolean; shift?: boolean }>;

  // Portal container (optional): if your theme variables are scoped to a container, portal into it
  portalContainer?: HTMLElement | null;
};

const DEFAULT_OPEN_KEYS = [{ key: "k", meta: true }, { key: "k", ctrl: true }];

const DEFAULT_PLACEHOLDER = "Search commands, pages, people…";
const DEFAULT_STORAGE_KEY = "omni:recents";
const DEFAULT_DEBOUNCE = 120;
const DEFAULT_MAX_RECENTS = 8;

/**
 * Lightweight fuzzy scoring and highlighting
 * Scores substrings and subsequences; returns score and highlight positions.
 */
function fuzzyScore(query: string, text: string, keywords: string[] = []) {
  const q = query.trim().toLowerCase();
  const t = text.toLowerCase();

  if (!q) return { score: 0, indices: [] as number[] };

  // Strong bonus for prefix and whole-word matches
  let score = 0;
  const indices: number[] = [];

  // Simple substring highlight
  const idx = t.indexOf(q);
  if (idx >= 0) {
    score += 100 + Math.max(0, 20 - idx); // earlier is better
    for (let i = 0; i < q.length; i++) indices.push(idx + i);
  } else {
    // Subsequence scoring
    let tPos = 0;
    let chain = 0;
    for (let i = 0; i < q.length; i++) {
      const c = q[i];
      const found = t.indexOf(c, tPos);
      if (found === -1) {
        // penalty
        score -= 5;
      } else {
        indices.push(found);
        // adjacency bonus
        if (found === tPos) chain += 2;
        else chain = 0;
        score += 2 + chain;
        tPos = found + 1;

        // word-start bonus
        if (found === 0 || /\s|-|_|\/|\./.test(text[found - 1])) score += 3;
      }
    }
  }

  // Keyword bonus
  for (const k of keywords) {
    const kk = k.toLowerCase();
    if (kk.includes(q) || q.includes(kk)) score += 8;
  }

  return { score, indices: Array.from(new Set(indices)).sort((a, b) => a - b) };
}

function useDebouncedValue<T>(value: T, delay = DEFAULT_DEBOUNCE) {
  const [v, setV] = React.useState(value);
  React.useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

function useHotkeys(
  handlers: Array<{
    key: string;
    handler: (e: KeyboardEvent) => void;
    meta?: boolean;
    ctrl?: boolean;
    alt?: boolean;
    shift?: boolean;
  }>
) {
  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      for (const h of handlers) {
        const match =
          e.key.toLowerCase() === h.key.toLowerCase() &&
          (!!h.meta === e.metaKey) &&
          (!!h.ctrl === e.ctrlKey) &&
          (!!h.alt === e.altKey) &&
          (!!h.shift === e.shiftKey);
        if (match) {
          e.preventDefault();
          h.handler(e);
          break;
        }
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [handlers]);
}

export function OmniCommandPalette({
  open: controlledOpen,
  onOpenChange,
  sources,
  placeholder = DEFAULT_PLACEHOLDER,
  storageKey = DEFAULT_STORAGE_KEY,
  showRecents = true,
  maxRecents = DEFAULT_MAX_RECENTS,
  showPinnedFirst = true,
  className,
  contentClassName,
  debounceMs = DEFAULT_DEBOUNCE,
  onItemExecuted,
  renderItem,
  renderHeader,
  renderFooter,
  openKeys = DEFAULT_OPEN_KEYS,
  portalContainer,
}: OmniCommandPaletteProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = React.useState(false);
  const open = controlledOpen ?? uncontrolledOpen;

  const [query, setQuery] = React.useState("");
  const debouncedQuery = useDebouncedValue(query, debounceMs);

  const [loadingIds, setLoadingIds] = React.useState<Set<string>>(new Set());
  const [results, setResults] = React.useState<Record<string, OmniItem[]>>({});
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const listRef = React.useRef<HTMLDivElement | null>(null);
  const inputRef = React.useRef<HTMLInputElement | null>(null);

  // Recents
  const [recents, setRecents] = React.useState<RecentEntry[]>([]);
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) setRecents(JSON.parse(raw));
    } catch {}
  }, [storageKey]);

  function setOpen(v: boolean) {
    if (controlledOpen === undefined) setUncontrolledOpen(v);
    onOpenChange?.(v);
  }

  // Global hotkeys to open/close
  useHotkeys([
    ...openKeys.map(kb => ({
      ...kb,
      handler: () => setOpen(!open),
    })),
    { key: "Escape", handler: () => setOpen(false) },
  ]);

  // Fetch per source
  React.useEffect(() => {
    let cancelled = false;

    async function go() {
      const q = debouncedQuery;
      const nextResults: Record<string, OmniItem[]> = {};
      for (const src of sources) {
        if (q.length < (src.minQuery ?? 0)) {
          nextResults[src.id] = [];
          continue;
        }
        const markLoading = (on: boolean) =>
          setLoadingIds(prev => {
            const copy = new Set(prev);
            if (on) copy.add(src.id);
            else copy.delete(src.id);
            return copy;
          });

        try {
          markLoading(true);
          const raw = await src.fetch(q);
          nextResults[src.id] = Array.isArray(raw) ? raw : [];
        } catch {
          nextResults[src.id] = [];
        } finally {
          markLoading(false);
        }
      }

      if (!cancelled) {
        setResults(nextResults);
        // reset activeId when query changes
        setActiveId(null);
      }
    }

    go();
    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, sources]);

  // Compute visible items with fuzzy sort, pinned-first, grouped by source
  const groups = React.useMemo(() => {
    const q = debouncedQuery.trim();
    const out: Array<{
      id: string;
      label: string;
      items: Array<OmniItem & { _score: number; _indices: number[] }>;
    }> = [];

    const sourceById = new Map(sources.map(s => [s.id, s]));
    const pinned: OmniItem[] = [];

    for (const [sid, items] of Object.entries(results)) {
      const srcMeta = sourceById.get(sid);
      if (!srcMeta) continue;
      let arr = (items ?? []).map(item => {
        const { score, indices } = fuzzyScore(q, item.label, item.keywords ?? []);
        return { ...item, _score: q ? score : 0, _indices: q ? indices : [] };
      });

      if (!q && showPinnedFirst) {
        for (const it of arr) if (it.pinned && !it.disabled) pinned.push(it);
        // exclude pinned from regular group when query empty
        arr = arr.filter(i => !i.pinned);
      }

      // sort by score, then label
      if (q) arr.sort((a, b) => b._score - a._score || a.label.localeCompare(b.label));
      else arr.sort((a, b) => a.label.localeCompare(b.label));

      out.push({
        id: sid,
        label: sourceById.get(sid)?.label ?? sid,
        items: arr,
      });
    }

    // Insert a virtual group for pinned at top
    const finalGroups: typeof out = [];
    if (!debouncedQuery && showPinnedFirst && pinned.length) {
      finalGroups.push({
        id: "__pinned",
        label: "Pinned",
        items: pinned.map(p => ({ ...p, _score: 0, _indices: [] })),
      });
    }

    // Recents when empty
    if (!debouncedQuery && showRecents && recents.length) {
      finalGroups.push({
        id: "__recents",
        label: "Recent",
        items: recents.map(r => ({
          id: r.id,
          label: r.label,
          subtitle: "Recently used",
          groupId: r.groupId,
          href: r.href,
          shortcut: r.shortcut,
          _score: 0,
          _indices: [],
        })),
      });
    }

    finalGroups.push(...out);
    return finalGroups;
  }, [results, sources, debouncedQuery, showPinnedFirst, showRecents, recents]);

  const flatItems = React.useMemo(
    () => groups.flatMap(g => g.items),
    [groups]
  );

  const activeIndex = React.useMemo(() => {
    if (!activeId) return -1;
    return flatItems.findIndex(i => i.id === activeId);
  }, [activeId, flatItems]);

  function moveActive(delta: number) {
    if (!flatItems.length) return;
    let next = activeIndex + delta;
    if (next < 0) next = flatItems.length - 1;
    if (next >= flatItems.length) next = 0;
    setActiveId(flatItems[next].id);
    // ensure scroll into view
    const node = listRef.current?.querySelector<HTMLElement>(`[data-id="${flatItems[next].id}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }

  function execute(item: OmniItem) {
    // store in recents
    try {
      const entry: RecentEntry = {
        id: item.id,
        label: item.label,
        groupId: item.groupId,
        href: item.href,
        shortcut: item.shortcut,
      };
      const next = [entry, ...recents.filter(r => r.id !== entry.id)].slice(0, maxRecents);
      setRecents(next);
      localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {}

    item.onAction?.();
    if (item.href) {
      // consumer decides navigation; for demo we use window.open same tab if absolute else same tab
      if (item.href.startsWith("http")) window.open(item.href, "_blank", "noopener");
      else window.location.href = item.href;
    }
    onItemExecuted?.(item);
    setOpen(false);
  }

  // Focus input each time it opens
  React.useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 10);
    } else {
      setQuery("");
      setActiveId(null);
    }
  }, [open]);

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal container={portalContainer ?? undefined}>
        <Dialog.Overlay
          className="fixed inset-0 z-[100] bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0"
        />
        <Dialog.Content
          aria-label="Command palette"
          className={cn(
            "fixed z-[101] inset-x-2 top-16 mx-auto w-[min(720px,100%-16px)] rounded-xl border bg-[hsl(var(--popover))] text-[hsl(var(--foreground))] shadow-lg backdrop-blur supports-[backdrop-filter]:bg-[color-mix(in_oklab,hsl(var(--popover))_85%,transparent)]",
            "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:zoom-in-95 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=closed]:fade-out-0",
            "outline-none",
            contentClassName
          )}
        >
          {/* Header */}
          <div className="border-b">
            {renderHeader ? (
              renderHeader(query)
            ) : (
              <div className="flex items-center gap-2 px-3 py-2">
                <span className="text-[hsl(var(--muted-foreground))]">
                  <Search className="size-4" aria-hidden />
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  role="combobox"
                  aria-expanded="true"
                  aria-controls="omni-listbox"
                  aria-activedescendant={activeId ? `omni-item-${activeId}` : undefined}
                  placeholder={placeholder}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "ArrowDown") {
                      e.preventDefault();
                      moveActive(1);
                    } else if (e.key === "ArrowUp") {
                      e.preventDefault();
                      moveActive(-1);
                    } else if (e.key === "Enter") {
                      e.preventDefault();
                      if (activeIndex >= 0) execute(flatItems[activeIndex]);
                    }
                  }}
                  className="flex-1 bg-transparent outline-none placeholder:text-[hsl(var(--muted-foreground))] text-sm"
                />
                <kbd className="rounded bg-[hsl(var(--muted))] px-1.5 py-0.5 text-[10px] text-[hsl(var(--muted-foreground))]">
                  ⌘K
                </kbd>
                <Dialog.Close asChild>
                  <button
                    aria-label="Close"
                    className="ml-2 rounded p-1 text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))]"
                  >
                    <X className="size-4" aria-hidden />
                  </button>
                </Dialog.Close>
              </div>
            )}
          </div>

          {/* Body */}
          <div
            id="omni-listbox"
            role="listbox"
            aria-label="Command results"
            className={cn("max-h-[60vh] overflow-auto p-1", className)}
            ref={listRef}
          >
            {/* Loading bar */}
            {loadingIds.size > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 text-[hsl(var(--muted-foreground))] text-xs">
                <Loader2 className="size-3 animate-spin" aria-hidden />
                Fetching results…
              </div>
            )}

            {/* Groups */}
            {groups.map((g) => (
              <div key={g.id} className="py-1">
                {g.items.length > 0 && (
                  <div className="px-3 py-1 text-[10px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">
                    {g.label}
                  </div>
                )}
                <div className="flex flex-col">
                  {g.items.map((item, idx) => {
                    const active = item.id === activeId || (activeId == null && idx === 0 && g.id !== "__recents");
                    const nodeId = `omni-item-${item.id}`;
                    return (
                      <button
                        key={item.id}
                        id={nodeId}
                        data-id={item.id}
                        role="option"
                        aria-selected={active}
                        disabled={item.disabled}
                        onMouseEnter={() => setActiveId(item.id)}
                        onFocus={() => setActiveId(item.id)}
                        onClick={() => !item.disabled && execute(item)}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm",
                          active
                            ? "bg-[hsl(var(--accent))]/60 text-[hsl(var(--accent-foreground))]"
                            : "hover:bg-[hsl(var(--accent))]/40",
                          item.disabled && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        {renderItem ? (
                          renderItem(item, active)
                        ) : (
                          <>
                            {/* Icon */}
                            <div className="shrink-0 text-[hsl(var(--muted-foreground))] group-aria-selected:text-[hsl(var(--accent-foreground))]">
                              {item.icon ?? <Command className="size-4" aria-hidden />}
                            </div>

                            {/* Labels with highlight */}
                            <div className="min-w-0 flex-1">
                              <div className="truncate">
                                {renderHighlighted(item.label, item as any)}
                              </div>
                              {item.subtitle && (
                                <div className="truncate text-xs text-[hsl(var(--muted-foreground))] group-aria-selected:text-[hsl(var(--accent-foreground))]/80">
                                  {item.subtitle}
                                </div>
                              )}
                            </div>

                            {/* Shortcut / affordances */}
                            {item.pinned && (
                              <span
                                title="Pinned"
                                className="text-[hsl(var(--muted-foreground))]"
                                aria-hidden
                              >
                                <Pin className="size-3.5" />
                              </span>
                            )}
                            {item.href && (
                              <span className="text-[hsl(var(--muted-foreground))]" aria-hidden>
                                <ExternalLink className="size-3.5" />
                              </span>
                            )}
                            {item.shortcut && (
                              <span className="ml-2 hidden items-center gap-1 text-[10px] text-[hsl(var(--muted-foreground))] sm:flex">
                                {item.shortcut.map((s, i) => (
                                  <kbd key={i} className="rounded bg-[hsl(var(--muted))] px-1 py-0.5">
                                    {s}
                                  </kbd>
                                ))}
                              </span>
                            )}
                            <ChevronRight className="ml-1 size-3.5 text-[hsl(var(--muted-foreground))] opacity-0 group-hover:opacity-100" aria-hidden />
                          </>
                        )}
                      </button>
                    );
                  })}
                </div>
                {/* Empty hint per group */}
                {g.items.length === 0 && debouncedQuery && (
                  <div className="px-3 py-2 text-xs text-[hsl(var(--muted-foreground))]">
                    No matches in {g.label}.
                  </div>
                )}
              </div>
            ))}

            {/* Global empty state */}
            {flatItems.length === 0 && (
              <div className="px-3 py-8 text-center text-sm text-[hsl(var(--muted-foreground))]">
                <div className="mx-auto mb-2 flex size-8 items-center justify-center rounded-full bg-[hsl(var(--muted))]">
                  <History className="size-4" aria-hidden />
                </div>
                Try a different query, like “settings” or “invite”.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t">
            {renderFooter ? (
              renderFooter(activeIndex >= 0 ? flatItems[activeIndex] : null)
            ) : (
              <div className="flex items-center justify-between px-3 py-2 text-xs text-[hsl(var(--muted-foreground))]">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1">
                    <CornerDownLeft className="size-3" /> to select
                  </span>
                  <span className="flex items-center gap-1">
                    <ArrowUp className="size-3" />
                    <ArrowDown className="size-3" /> to navigate
                  </span>
                  <span className="hidden items-center gap-1 sm:flex">
                    <X className="size-3" /> to close
                  </span>
                </div>
                <ThemeIndicator />
              </div>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

// Highlight helper: uses indices computed on the fly for visible items
function renderHighlighted(label: string, item: OmniItem & { _indices?: number[] }) {
  const inds = item._indices ?? [];
  if (!inds.length) return label;

  const out: React.ReactNode[] = [];
  let i = 0;
  for (let pos = 0; pos < label.length; pos++) {
    const ch = label[pos];
    const isHi = inds.includes(pos);
    if (isHi) {
      // collect continuous run
      let run = ch;
      let p = pos + 1;
      while (inds.includes(p) && p < label.length) {
        run += label[p];
        p++;
      }
      out.push(
        <mark
          key={`m-${pos}-${run}`}
          className="rounded-[2px] bg-[hsl(var(--accent))]/60 px-0.5 text-[inherit]"
        >
          {run}
        </mark>
      );
      pos = p - 1;
      i++;
    } else {
      out.push(<React.Fragment key={`t-${pos}`}>{ch}</React.Fragment>);
    }
  }
  return out;
}

/**
 * Passive theme indicator. Does not mutate the theme.
 * The palette styling itself reads CSS variables and auto-updates with your app's theme.
 */
function useIsDarkMode() {
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    const body = document.body;
    const mql = window.matchMedia?.("(prefers-color-scheme: dark)");

    const compute = () => {
      const rootAttr = root.getAttribute("data-theme");
      const bodyAttr = body.getAttribute("data-theme");
      if (rootAttr === "dark" || bodyAttr === "dark") return true;
      if (rootAttr === "light" || bodyAttr === "light") return false;
      if (root.classList.contains("dark") || body.classList.contains("dark")) return true;
      if (root.classList.contains("light") || body.classList.contains("light")) return false;
      return !!mql?.matches;
    };

    setIsDark(compute());

    const onMql = () => setIsDark(compute());
    const obsRoot = new MutationObserver(() => setIsDark(compute()));
    const obsBody = new MutationObserver(() => setIsDark(compute()));

    mql?.addEventListener?.("change", onMql);
    obsRoot.observe(root, { attributes: true, attributeFilter: ["class", "data-theme"] });
    obsBody.observe(body, { attributes: true, attributeFilter: ["class", "data-theme"] });

    return () => {
      mql?.removeEventListener?.("change", onMql);
      obsRoot.disconnect();
      obsBody.disconnect();
    };
  }, []);

  return isDark;
}

function ThemeIndicator() {
  const dark = useIsDarkMode();
  return (
    <div className="inline-flex items-center gap-1 rounded px-2 py-1 text-[hsl(var(--muted-foreground))]">
      {dark ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
      <span>{dark ? "Dark" : "Light"}</span>
    </div>
  );
}