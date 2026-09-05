"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  type PanInfo,
} from "framer-motion";
import {
  useState,
  useCallback,
  type ReactNode,
  Children,
  useEffect,
} from "react";

/* ═══════════════════════════════════════════════════════════
   TYPES
   ═══════════════════════════════════════════════════════════ */

interface SwipeStackProps {
  children: ReactNode;
  className?: string;
  /** Callback when a card is swiped with direction and index */
  onSwipe?: (direction: "left" | "right", index: number) => void;
  /** Callback when all cards are swiped */
  onEmpty?: () => void;
  /** Swipe threshold in px to trigger dismiss */
  swipeThreshold?: number;
  /** Max visible cards in stack */
  visibleCount?: number;
  /** Rotation factor on drag */
  rotationFactor?: number;
  /** Scale step between stacked cards */
  scaleStep?: number;
  /** Y offset step between stacked cards */
  offsetStep?: number;
  /** Enable left/right indicator overlays */
  showIndicators?: boolean;
  /** Left indicator content */
  leftIndicator?: ReactNode;
  /** Right indicator content */
  rightIndicator?: ReactNode;
}

/* ═══════════════════════════════════════════════════════════
   SWIPEABLE CARD
   ═══════════════════════════════════════════════════════════ */

interface CardProps {
  children: ReactNode;
  active: boolean;
  stackIndex: number;
  visibleCount: number;
  scaleStep: number;
  offsetStep: number;
  rotationFactor: number;
  swipeThreshold: number;
  showIndicators: boolean;
  leftIndicator?: ReactNode;
  rightIndicator?: ReactNode;
  onDismiss: (dir: "left" | "right") => void;
}

function SwipeCard({
  children,
  active,
  stackIndex,
  visibleCount,
  scaleStep,
  offsetStep,
  rotationFactor,
  swipeThreshold,
  showIndicators,
  leftIndicator,
  rightIndicator,
  onDismiss,
}: CardProps) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-300, 0, 300], [-rotationFactor, 0, rotationFactor]);
  const leftOpacity = useTransform(x, [-swipeThreshold, -20], [1, 0]);
  const rightOpacity = useTransform(x, [20, swipeThreshold], [0, 1]);

  // Stack transforms — cards behind are smaller + lower
  const scale = 1 - stackIndex * scaleStep;
  const yOffset = stackIndex * offsetStep;
  const zIndex = visibleCount - stackIndex;

  const handleDragEnd = useCallback(
    (_: unknown, info: PanInfo) => {
      const offset = info.offset.x;
      const velocity = info.velocity.x;

      // Flick detection: either dragged past threshold or moving fast
      if (Math.abs(offset) > swipeThreshold || Math.abs(velocity) > 500) {
        const dir = offset > 0 ? "right" : "left";
        const flyTo = dir === "right" ? 600 : -600;

        animate(x, flyTo, {
          type: "spring",
          stiffness: 300,
          damping: 30,
          velocity: velocity,
          onComplete: () => onDismiss(dir),
        });
      } else {
        // Snap back
        animate(x, 0, { type: "spring", stiffness: 500, damping: 35 });
      }
    },
    [x, swipeThreshold, onDismiss]
  );

  if (stackIndex >= visibleCount) return null;

  return (
    <motion.div
      className="absolute inset-0 touch-none"
      style={{
        x: active ? x : 0,
        rotate: active ? rotate : 0,
        scale,
        y: yOffset,
        zIndex,
        cursor: active ? "grab" : "default",
      }}
      drag={active ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={active ? handleDragEnd : undefined}
      whileDrag={{ cursor: "grabbing" }}
      initial={false}
      animate={{
        scale,
        y: yOffset,
      }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Card content */}
      <div className="relative w-full h-full select-none pointer-events-none">
        {children}

        {/* Swipe indicators */}
        {active && showIndicators && (
          <>
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-[inherit] pointer-events-none"
              style={{ opacity: leftOpacity }}
            >
              {leftIndicator || (
                <div className="rounded-full border-2 border-red-400 bg-red-500/10 backdrop-blur-sm px-6 py-3 rotate-[-12deg]">
                  <span className="text-red-400 text-lg font-bold tracking-wider">NOPE</span>
                </div>
              )}
            </motion.div>
            <motion.div
              className="absolute inset-0 flex items-center justify-center rounded-[inherit] pointer-events-none"
              style={{ opacity: rightOpacity }}
            >
              {rightIndicator || (
                <div className="rounded-full border-2 border-emerald-400 bg-emerald-500/10 backdrop-blur-sm px-6 py-3 rotate-[12deg]">
                  <span className="text-emerald-400 text-lg font-bold tracking-wider">LIKE</span>
                </div>
              )}
            </motion.div>
          </>
        )}
      </div>
    </motion.div>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */

export function Component({
  children,
  className,
  onSwipe,
  onEmpty,
  swipeThreshold = 100,
  visibleCount = 3,
  rotationFactor = 15,
  scaleStep = 0.05,
  offsetStep = 12,
  showIndicators = true,
  leftIndicator,
  rightIndicator,
}: SwipeStackProps) {
  const items = Children.toArray(children);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleDismiss = useCallback(
    (dir: "left" | "right") => {
      onSwipe?.(dir, currentIndex);
      setCurrentIndex((prev) => prev + 1);
    },
    [currentIndex, onSwipe]
  );

  useEffect(() => {
    if (currentIndex >= items.length) {
      onEmpty?.();
    }
  }, [currentIndex, items.length, onEmpty]);

  return (
    <div className={cn("relative", className)}>
      {items
        .slice(currentIndex, currentIndex + visibleCount)
        .reverse()
        .map((child, reverseIdx) => {
          const stackIndex =
            currentIndex + visibleCount - 1 - reverseIdx - currentIndex;
          const actualIdx = currentIndex + (visibleCount - 1 - reverseIdx);

          return (
            <SwipeCard
              key={actualIdx}
              active={actualIdx === currentIndex}
              stackIndex={actualIdx - currentIndex}
              visibleCount={visibleCount}
              scaleStep={scaleStep}
              offsetStep={offsetStep}
              rotationFactor={rotationFactor}
              swipeThreshold={swipeThreshold}
              showIndicators={showIndicators}
              leftIndicator={leftIndicator}
              rightIndicator={rightIndicator}
              onDismiss={handleDismiss}
            >
              {child}
            </SwipeCard>
          );
        })}

      {/* Empty state */}
      {currentIndex >= items.length && (
        <div className="absolute inset-0 flex items-center justify-center">
          <p className="text-sm text-neutral-500">No more cards</p>
        </div>
      )}
    </div>
  );
}