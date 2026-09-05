"use client";

import {
  AnimatePresence,
  motion,
  useDragControls,
  useMotionValue,
  useReducedMotion,
  type PanInfo,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";



export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}



export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IN_OUT = [0.77, 0, 0.175, 1] as const;
export const EASE_DRAWER = [0.32, 0.72, 0, 1] as const;


export const EASE_OUT_CSS = "cubic-bezier(0.16, 1, 0.3, 1)";

/** Press feedback on buttons and other tappable surfaces. */
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



export interface BottomSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Heights: 0-1 = fraction of viewport, or "auto". First entry is default. */
  snapPoints?: (number | "auto")[];
  defaultSnap?: number;
  title?: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  /** Min drag distance in px past current snap to dismiss. */
  dismissThreshold?: number;
}

export function BottomSheet({
  open,
  onOpenChange,
  snapPoints = [0.5, 0.92],
  defaultSnap = 0,
  title,
  description,
  children,
  className,
  dismissThreshold = 120,
}: BottomSheetProps) {
  const [snap, setSnap] = useState(defaultSnap);
  const [mounted, setMounted] = useState(false);

  const dragY = useMotionValue(0);
  const dragControls = useDragControls();

  const sheetRef = useRef<HTMLDivElement>(null);
  const heightRef = useRef(0);

  const reduce = useReducedMotion();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) setSnap(defaultSnap);
  }, [open, defaultSnap]);

  // Lock background scroll while open.
  useEffect(() => {
    if (!open) return;

    const body = document.body;
    const scrollY = window.scrollY;

    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      overflow: body.style.overflow,
    };

    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.overflow = "hidden";

    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.overflow = prev.overflow;

      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const onDragEnd = (_: unknown, info: PanInfo) => {
    const velocity = info.velocity.y;
    const offset = info.offset.y;

    // Strong downward fling or large drag → dismiss.
    if (velocity > 600 || offset > dismissThreshold) {
      const smaller = snapPoints.map((_, i) => i).filter((i) => i < snap);

      if (
        smaller.length &&
        velocity < 800 &&
        offset < dismissThreshold * 1.6
      ) {
        setSnap(smaller[smaller.length - 1]);
      } else {
        onOpenChange(false);
      }

      dragY.set(0);
      return;
    }

    // Strong upward fling → next snap.
    if (velocity < -500) {
      setSnap(Math.min(snapPoints.length - 1, snap + 1));
      dragY.set(0);
      return;
    }

    // Otherwise snap to nearest by current offset.
    if (offset > 80 && snap > 0) {
      setSnap(snap - 1);
    } else if (offset < -80 && snap < snapPoints.length - 1) {
      setSnap(snap + 1);
    }

    dragY.set(0);
  };

  const snapValue = snapPoints[snap];

  const heightStyle =
    snapValue === "auto"
      ? { maxHeight: "92vh" }
      : { height: `${snapValue * 100}vh` };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open ? (
        <div className="pointer-events-none fixed inset-0 z-50">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            onClick={() => onOpenChange(false)}
            className="pointer-events-auto absolute inset-0 bg-background/5 backdrop-blur-md backdrop-saturate-150"
          />

          <motion.div
            ref={sheetRef}
            drag="y"
            dragControls={dragControls}
            dragListener={false}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0.02, bottom: 0.4 }}
            dragMomentum={false}
            onDrag={(_, info) => dragY.set(Math.max(0, info.offset.y))}
            onDragEnd={onDragEnd}
            initial={reduce ? { y: 0, opacity: 0 } : { y: "100%" }}
            animate={reduce ? { y: 0, opacity: 1 } : { y: 0 }}
            exit={reduce ? { y: 0, opacity: 0 } : { y: "100%" }}
            transition={
              reduce ? { duration: 0.18, ease: EASE_OUT } : SPRING_PANEL
            }
            onAnimationComplete={() => {
              if (sheetRef.current) {
                heightRef.current = sheetRef.current.offsetHeight;
              }
            }}
            style={heightStyle}
            className={cn(
              "pointer-events-auto absolute bottom-0 left-0 right-0 mx-auto flex max-w-2xl flex-col overflow-hidden rounded-t-3xl will-change-transform",
              "border border-border bg-card shadow-xl",
              className,
            )}
            role="dialog"
            aria-modal="true"
            aria-label={title}
          >
            <div
              onPointerDown={(event) => dragControls.start(event)}
              className="flex cursor-grab touch-none flex-col items-center px-4 pb-2 pt-3 active:cursor-grabbing"
            >
              <div className="h-1.5 w-10 rounded-full bg-muted-foreground/40" />

              {title || description ? (
                <div className="mt-3 w-full">
                  {title ? (
                    <h2 className="text-base font-semibold text-foreground">
                      {title}
                    </h2>
                  ) : null}

                  {description ? (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {description}
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>

            <div className="flex-1 overflow-y-auto overscroll-contain px-4 pb-6">
              {children}
            </div>
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}