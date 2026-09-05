"use client";

import * as React from "react";

export type CommandIconType =
  | "search"
  | "file"
  | "settings"
  | "user"
  | "code"
  | "mail"
  | "calendar"
  | "folder"
  | "star"
  | "clock"
  | "terminal"
  | "play"
  | "home"
  | "keyboard";

export interface Command {
  id: string;
  label: string;
  description?: string;
  category: string;
  shortcut?: string;
  icon: CommandIconType;
  action?: () => void;
}

export interface CommandPaletteProps {
  commands: Command[];
  onSelect?: (cmd: Command) => void;
  placeholder?: string;
  recentSearches?: string[];
  onSearch?: (query: string) => void;
}

function CommandIcon({ icon }: { icon: CommandIconType }) {
  return (
    <svg
      width="18"
      height="18"
      strokeWidth="1.5"
      fill="none"
      viewBox="0 0 24 24"
      className="stroke-current"
    >
      {/* Simplified icon set */}
      {icon === "search" && (
        <>
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </>
      )}
      {icon === "user" && (
        <>
          <circle cx="12" cy="7" r="4" />
          <path d="M5 21v-2a4 4 0 014-4h6a4 4 0 014 4v2" />
        </>
      )}
      {icon === "file" && (
        <>
          <path d="M14.5 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V7.5z" />
          <polyline points="14 2 14 8 20 8" />
        </>
      )}
      {/* fallback */}
      {!icon && <circle cx="12" cy="12" r="10" />}
    </svg>
  );
}

export function Component({
  commands,
  onSelect,
  placeholder = "Search…",
  recentSearches = [],
  onSearch,
}: CommandPaletteProps) {
  const [open, setOpen] = React.useState(false);
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);

  const filtered = React.useMemo(() => {
    if (!query) return commands;
    const q = query.toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.description?.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q)
    );
  }, [query, commands]);

  React.useEffect(() => {
    function handleGlobal(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, filtered.length - 1));
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
      }
      if (e.key === "Enter") {
        const cmd = filtered[selectedIndex];
        if (cmd) handleSelect(cmd);
      }
    }
    document.addEventListener("keydown", handleGlobal);
    return () => document.removeEventListener("keydown", handleGlobal);
  }, [open, filtered, selectedIndex]);

  React.useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const grouped = React.useMemo(() => {
    const r: Record<string, Command[]> = {};
    filtered.forEach((c) => {
      (r[c.category] ||= []).push(c);
    });
    return r;
  }, [filtered]);

  function handleSelect(cmd: Command) {
    cmd.action?.();
    onSelect?.(cmd);
    setOpen(false);
    setQuery("");
  }

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm text-card-foreground shadow-sm"
      >
        <CommandIcon icon="search" />
        <span>Search Commands</span>
        <kbd className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">⌘K</kbd>
      </button>

      {!open ? null : (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/40 pt-[10vh] backdrop-blur-sm"
          onClick={() => setOpen(false)}
        >
          {/* Panel */}
          <div
            className="w-full max-w-lg rounded-xl bg-card shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search input */}
            <div className="flex items-center gap-3 border-b px-4 py-3">
              <CommandIcon icon="search" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  onSearch?.(e.target.value);
                }}
                placeholder={placeholder}
                className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
              />
            </div>

            {/* Results */}
            <div className="max-h-[300px] overflow-y-auto py-2">
              {Object.entries(grouped).map(([category, cmds]) => (
                <div key={category}>
                  <p className="px-4 pb-1 pt-3 text-xs font-semibold text-muted-foreground uppercase">
                    {category}
                  </p>

                  {cmds.map((cmd) => {
                    const idx = filtered.findIndex((c) => c.id === cmd.id);
                    const selected = idx === selectedIndex;

                    return (
                      <button
                        key={cmd.id}
                        data-index={idx}
                        onClick={() => handleSelect(cmd)}
                        className={
                          "flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors " +
                          (selected ? "bg-muted" : "hover:bg-muted/50")
                        }
                        onMouseEnter={() => setSelectedIndex(idx)}
                      >
                        <CommandIcon icon={cmd.icon} />
                        <div className="flex-1">
                          <div className="font-medium text-foreground">{cmd.label}</div>
                          {cmd.description && (
                            <p className="text-xs text-muted-foreground">{cmd.description}</p>
                          )}
                        </div>

                        {cmd.shortcut && (
                          <kbd className="rounded bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            {cmd.shortcut}
                          </kbd>
                        )}
                      </button>
                    );
                  })}
                </div>
              ))}

              {filtered.length === 0 && (
                <p className="px-4 py-8 text-center text-sm text-muted-foreground">
                  No results for "{query}"
                </p>
              )}
            </div>

            {/* Footer */}
            <div className="flex gap-4 border-t px-4 py-3 text-xs text-muted-foreground">
              <span>↑↓ Navigate</span>
              <span>↵ Select</span>
              <span>esc Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
