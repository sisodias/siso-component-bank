"use client";

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

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

export function useHoverCapable() {
  const [canHover, setCanHover] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const update = () => setCanHover(mq.matches);

    update();
    mq.addEventListener?.("change", update);

    return () => mq.removeEventListener?.("change", update);
  }, []);

  return canHover;
}

type IslandContextValue = {
  view: string | null;
};

const IslandContext = createContext<IslandContextValue | null>(null);

const SHELL_SPRING = {
  type: "spring",
  duration: 0.8,
  bounce: 0.2,
} as const;

const CONTENT_SPRING = {
  type: "spring",
  duration: 0.8,
  bounce: 0.35,
} as const;

const RADIUS = 32;
const PILL_WIDTH = 126;
const PILL_HEIGHT = 37;

function useContentSize() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState<{ width: number; height: number } | null>(
    null,
  );

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;

    setSize({ width: el.offsetWidth, height: el.offsetHeight });
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof ResizeObserver === "undefined") return;

    const observer = new ResizeObserver(() => {
      setSize({ width: el.offsetWidth, height: el.offsetHeight });
    });

    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}

function Slot({
  keyId,
  children,
  className,
}: {
  keyId: string;
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      key={keyId}
      initial={
        reduce
          ? { opacity: 0, filter: "blur(0px)" }
          : { opacity: 0, scale: 0.9, y: -8, filter: "blur(5px)" }
      }
      animate={
        reduce
          ? { opacity: 1, filter: "blur(0px)" }
          : { opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }
      }
      exit={
        reduce
          ? { opacity: 0, filter: "blur(0px)", transition: { duration: 0.1 } }
          : {
              opacity: 0,
              scale: 0.9,
              y: -6,
              filter: "blur(0px)",
              transition: { duration: 0.08, ease: EASE_OUT },
            }
      }
      transition={reduce ? { duration: 0.15 } : CONTENT_SPRING}
      style={{
        transformOrigin: "top center",
        willChange: "transform, opacity, filter",
      }}
      className={cn("flex items-center justify-center", className)}
    >
      {children}
    </motion.div>
  );
}

export interface DynamicIslandProps {
  view: string | null;
  compact?: ReactNode;
  children?: ReactNode;
  className?: string;
}

export function DynamicIsland({
  view,
  compact,
  children,
  className,
}: DynamicIslandProps) {
  const reduce = useReducedMotion();
  const expanded = view !== null;
  const [sizerRef, size] = useContentSize();

  return (
    <IslandContext.Provider value={{ view }}>
      <motion.div
        role="status"
        aria-live="polite"
        initial={false}
        animate={
          size
            ? { width: size.width, height: size.height }
            : { width: PILL_WIDTH, height: PILL_HEIGHT }
        }
        transition={reduce ? { duration: 0 } : SHELL_SPRING}
        style={{ borderRadius: RADIUS }}
        className={cn(
          "relative inline-flex items-start justify-center overflow-hidden",
          "bg-foreground text-background shadow-2xl",
          className,
        )}
      >
        <div ref={sizerRef} className="w-max">
          <AnimatePresence mode="popLayout" initial={false}>
            {!expanded && compact ? (
              <Slot
                keyId="compact"
                className="min-h-[37px] min-w-[126px] gap-2 px-4 py-1.5 text-xs font-medium"
              >
                {compact}
              </Slot>
            ) : null}
          </AnimatePresence>

          {children}
        </div>
      </motion.div>
    </IslandContext.Provider>
  );
}

export interface DynamicIslandViewProps {
  id: string;
  children: ReactNode;
  className?: string;
}

export function DynamicIslandView({
  id,
  children,
  className,
}: DynamicIslandViewProps) {
  const ctx = useContext(IslandContext);

  if (!ctx) {
    throw new Error("DynamicIslandView must be used inside <DynamicIsland>");
  }

  const active = ctx.view === id;

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      {active ? (
        <Slot keyId={id} className={cn("px-6 py-4", className)}>
          {children}
        </Slot>
      ) : null}
    </AnimatePresence>
  );
}

export interface NumberTickerProps {
  value: number;
  format?: (value: number) => string;
  duration?: number;
  className?: string;
  startOnView?: boolean;
}

export function NumberTicker({
  value,
  format = String,
  duration = 0.5,
  className,
}: NumberTickerProps) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration }}
      className={className}
    >
      {format(value)}
    </motion.span>
  );
}