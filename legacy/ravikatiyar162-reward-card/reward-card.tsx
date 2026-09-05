import React, { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';
import { cn } from "../_utils/cn";

// ---PROPS---
interface SlideToUnlockProps {
  children: React.ReactNode;
  onUnlock: () => void;
  sliderText?: string;
  unlockedContent: React.ReactNode;
  className?: string;
  shimmer?: boolean;
}

// ---COMPONENT---
export const SlideToUnlock = ({
  children,
  onUnlock,
  sliderText = 'Swipe to open the gift',
  unlockedContent,
  className,
  shimmer = true,
}: SlideToUnlockProps) => {
  const [unlocked, setUnlocked] = useState(false);
  const [dragConstraint, setDragConstraint] = useState(0);
  const x = useMotionValue(0);

  const sliderRef = useRef<HTMLDivElement>(null);
  const handleRef = useRef<HTMLDivElement>(null);

  // Effect to calculate the correct drag constraint after the component mounts
  useEffect(() => {
    const sliderWidth = sliderRef.current?.offsetWidth || 0;
    const handleWidth = handleRef.current?.offsetWidth || 0;
    setDragConstraint(sliderWidth - handleWidth);
  }, []);

  // When the drag ends, check if it's past the threshold
  const onDragEnd = (event: any, info: any) => {
    if (info.offset.x > dragConstraint * 0.8) { // Unlock if dragged over 80%
      setUnlocked(true);
      onUnlock();
    } else {
      // Snap back to the start
      x.set(0);
    }
  };

  const textOpacity = useTransform(x, [0, 50], [1, 0]);

  return (
    <div className={cn("relative w-full max-w-xs overflow-hidden rounded-2xl border bg-card p-6 text-card-foreground shadow-sm", className)}>
      {children}
      <AnimatePresence mode="wait">
        {!unlocked ? (
          <motion.div
            key="slider"
            initial={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="relative mt-6"
          >
            <div ref={sliderRef} className="relative h-14 w-full rounded-full bg-secondary">
              <motion.div
                ref={handleRef}
                drag="x"
                dragConstraints={{ left: 0, right: dragConstraint }}
                dragElastic={0.1}
                style={{ x }}
                onDragEnd={onDragEnd}
                className="absolute left-0 top-0 z-10 flex h-14 w-14 cursor-grab items-center justify-center rounded-full bg-foreground active:cursor-grabbing"
              >
                <ChevronRightIcon className="h-6 w-6 text-background" />
              </motion.div>
              <motion.span
                style={{ opacity: textOpacity }}
                className={cn(
                  "absolute inset-0 flex items-center justify-center text-sm font-medium text-muted-foreground",
                  shimmer && "animate-shimmer bg-[linear-gradient(110deg,#9ca3af,45%,#e5e7eb,55%,#9ca3af)] bg-[length:200%_100%] bg-clip-text text-transparent"
                )}
              >
                {sliderText}
              </motion.span>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="unlocked"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {unlockedContent}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ---ICON---
const ChevronRightIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m9 18 6-6-6-6" />
  </svg>
);
