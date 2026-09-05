"use client";

import { Check, ChevronsUpDown, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useState, useMemo } from "react";

export type ComboboxOption = {
  value: string;
  label: string;
  description?: string;
};

interface ComboboxProps {
  options: ComboboxOption[];
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  className?: string;
  disabled?: boolean;
  clearable?: boolean;
}

export function Combobox({
  options,
  value = "",
  onChange,
  placeholder = "Select an option...",
  emptyMessage = "No results found.",
  className,
  disabled = false,
  clearable = true,
}: ComboboxProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const selectedOption = options.find((o) => o.value === value);

  const filtered = useMemo(() => {
    if (!query) return options;
    const q = query.toLowerCase().replace(/[\s\-]/g, "");
    return options.filter((o) => {
      const haystack = `${o.label}${o.value}${o.description || ""}`
        .toLowerCase()
        .replace(/[\s\-]/g, "");
      return haystack.includes(q);
    });
  }, [query, options]);

  const handleSelect = (opt: ComboboxOption) => {
    onChange?.(opt.value);
    setOpen(false);
    setQuery("");
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange?.("");
    setQuery("");
  };

  return (
    <div className={cn("relative w-full", className)} style={{ width: "100%" }}>
      <div
        className="flex w-full items-center gap-2 rounded-lg border border-border bg-background px-3 py-2.5 cursor-pointer transition-colors"
        style={{ width: "100%" }}
        onClick={() => !disabled && setOpen(!open)}
      >
        <input
          type="text"
          disabled={disabled}
          placeholder={selectedOption ? selectedOption.label : placeholder}
          value={open ? query : selectedOption?.label || ""}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => !disabled && setOpen(true)}
          className="flex-1 min-w-0 w-full bg-transparent text-sm text-foreground placeholder:text-muted-foreground outline-none"
          style={{ width: "100%" }}
        />
        {clearable && value && !open && (
          <button
            onClick={handleClear}
            className="p-0.5 rounded hover:bg-muted transition-colors shrink-0"
          >
            <X className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
        )}
        <ChevronsUpDown className="h-4 w-4 text-muted-foreground shrink-0" />
      </div>

      <AnimatePresence>
        {open && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => {
                setOpen(false);
                setQuery("");
              }}
            />
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.15 }}
              className="absolute z-50 mt-1 w-full rounded-lg border border-border bg-background shadow-lg overflow-hidden"
            >
              <div className="max-h-60 overflow-y-auto p-1">
                {filtered.length === 0 ? (
                  <div className="px-3 py-6 text-center text-sm text-muted-foreground">
                    {emptyMessage}
                  </div>
                ) : (
                  filtered.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect(opt)}
                      className={cn(
                        "flex w-full items-start gap-3 rounded-md px-3 py-2 text-left text-sm transition-colors hover:bg-muted",
                        value === opt.value && "bg-muted/50"
                      )}
                    >
                      <span className="mt-0.5 shrink-0 w-4">
                        {value === opt.value && (
                          <Check className="h-4 w-4 text-foreground" />
                        )}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        <span className="font-medium text-foreground">
                          {opt.label}
                        </span>
                        {opt.description && (
                          <span className="text-xs text-muted-foreground">
                            {opt.description}
                          </span>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}