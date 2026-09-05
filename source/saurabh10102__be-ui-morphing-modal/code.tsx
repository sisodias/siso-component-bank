"use client";

import { type ReactNode, useEffect, useState } from "react";

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

export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}

export interface MorphingModalProps {
  viewId: string | null;
  onClose: () => void;
  children: ReactNode;
  placement?: "bottom" | "center";
  className?: string;
}

export function MorphingModal({
  viewId,
  onClose,
  children,
  placement = "bottom",
  className,
}: MorphingModalProps) {
  const open = viewId !== null;
  const [mounted, setMounted] = useState(open);
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => setVisible(true));
      return;
    }

    setVisible(false);

    const timer = setTimeout(() => {
      setMounted(false);
    }, 220);

    return () => clearTimeout(timer);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  const enterY = placement === "bottom" ? 40 : 20;

  if (!mounted) return null;

  return (
    <div
      aria-hidden={!open}
      className={cn(
        "fixed inset-0 z-[80]",
        open ? "pointer-events-auto" : "pointer-events-none",
      )}
    >
      <div
        onClick={onClose}
        className={cn(
          "absolute inset-0 bg-background/5 [backdrop-filter:blur(14px)_saturate(140%)] [-webkit-backdrop-filter:blur(14px)_saturate(140%)]",
          visible ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{
          transition: `opacity 200ms ${EASE_OUT_CSS}`,
        }}
      />

      <div
        className={cn(
          "pointer-events-none absolute inset-0 flex justify-center px-4",
          placement === "bottom" ? "items-end pb-8" : "items-center",
        )}
      >
        <div
          className={cn(
            "pointer-events-auto relative w-full max-w-sm overflow-hidden rounded-3xl border border-border bg-card shadow-2xl will-change-transform",
            className,
          )}
          style={{
            opacity: visible ? 1 : 0,
            transform: visible
              ? "translateY(0px) scale(1)"
              : `translateY(${enterY}px) scale(0.97)`,
            transition: `opacity 220ms ${EASE_OUT_CSS}, transform 260ms ${EASE_OUT_CSS}`,
          }}
        >
          <div className="p-5">
            <div
              key={viewId ?? "closed"}
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0px)" : "translateY(8px)",
                filter: visible ? "blur(0px)" : "blur(4px)",
                transition: `opacity 220ms ${EASE_OUT_CSS}, transform 240ms ${EASE_OUT_CSS}, filter 240ms ${EASE_OUT_CSS}`,
              }}
            >
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}