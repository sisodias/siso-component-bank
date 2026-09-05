"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  Calendar,
  Files,
  Flag,
  FolderClosed,
  NotebookPen,
  Plus,
  Trophy,
  X,
} from "lucide-react";
import { type ComponentType, useEffect, useId, useRef, useState } from "react";

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

const SPRING_FOLDER = {
  type: "spring",
  stiffness: 320,
  damping: 24,
  mass: 0.9,
} as const;

type MenuItem = {
  label: string;
  icon: ComponentType<{ className?: string }>;
};

const ITEMS: MenuItem[] = [
  { label: "Project", icon: FolderClosed },
  { label: "Notebook", icon: NotebookPen },
  { label: "Notes", icon: Files },
  { label: "Goal", icon: Trophy },
  { label: "Milestone", icon: Flag },
  { label: "Event", icon: Calendar },
];

export interface CreateMenuProps {
  items?: MenuItem[];
  onSelect?: (label: string) => void;
  className?: string;
}

export function CreateMenu({
  items = ITEMS,
  onSelect,
  className,
}: CreateMenuProps) {
  const [open, setOpen] = useState(false);
  const reduce = useReducedMotion();
  const layoutId = useId();
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };

    const onPointer = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointer);

    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const morph = reduce ? { duration: 0.15 } : SPRING_FOLDER;

  return (
    <div ref={ref} className={cn("relative inline-flex", className)}>
      <div className="h-12 w-44" aria-hidden />

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-30 grid h-[360px] w-[min(86vw,520px)] -translate-x-1/2 -translate-y-1/2 place-items-center [&>*]:pointer-events-auto">
        <AnimatePresence initial={false} mode="popLayout">
          {open ? (
            <motion.div
              key="panel"
              layoutId={layoutId}
              transition={morph}
              style={{ borderRadius: 18 }}
              className="w-[min(86vw,520px)] overflow-hidden border border-border bg-card"
            >
              <motion.div
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: reduce ? 0 : 0.12, duration: 0.2 }}
              >
                <div className="flex items-center justify-between border-b border-border px-5 py-4">
                  <span className="text-sm font-medium text-muted-foreground">
                    Create new
                  </span>

                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close menu"
                    className="text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <motion.div
                  initial={reduce ? false : { clipPath: "inset(0 0 100% 0)" }}
                  animate={{ clipPath: "inset(0 0 0% 0)" }}
                  transition={{
                    delay: reduce ? 0 : 0.1,
                    duration: 0.4,
                    ease: EASE_OUT,
                  }}
                  className="grid grid-cols-3"
                >
                  {items.map((item, i) => (
                    <button
                      key={item.label}
                      type="button"
                      onClick={() => {
                        onSelect?.(item.label);
                        setOpen(false);
                      }}
                      className={cn(
                        "flex items-center justify-center px-4 py-8 text-muted-foreground transition-colors hover:text-foreground",
                        i % 3 !== 2 && "border-r border-border",
                        i < 3 && "border-b border-border",
                      )}
                    >
                      <motion.span
                        initial={
                          reduce
                            ? { opacity: 0 }
                            : { opacity: 0, scale: 0.85, filter: "blur(6px)" }
                        }
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        transition={{
                          delay: reduce ? 0 : 0.14 + i * 0.04,
                          type: "spring",
                          stiffness: 460,
                          damping: 30,
                        }}
                        className="flex flex-col items-center gap-3"
                      >
                        <item.icon className="h-6 w-6" />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </motion.span>
                    </button>
                  ))}
                </motion.div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.button
              key="trigger"
              type="button"
              layoutId={layoutId}
              transition={morph}
              style={{ borderRadius: 18 }}
              onClick={() => setOpen(true)}
              aria-haspopup="menu"
              aria-expanded={open}
              whileTap={reduce ? undefined : { scale: 0.97 }}
              className="inline-flex h-12 w-44 items-center justify-center border border-border bg-card text-sm font-medium text-foreground"
            >
              <motion.span
                layout
                className="inline-flex items-center gap-2 whitespace-nowrap"
              >
                Create new
                <Plus className="h-4 w-4" />
              </motion.span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}