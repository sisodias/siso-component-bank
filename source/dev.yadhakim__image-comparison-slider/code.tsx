"use client";

import { cn } from "@/lib/utils";
import { motion, useMotionValue, useTransform } from "framer-motion";
import { useRef, useState, useCallback, useEffect } from "react";
import { GripVertical } from "lucide-react";

interface ImageComparisonProps {
  beforeSrc: string;
  afterSrc: string;
  beforeLabel?: string;
  afterLabel?: string;
  initialPosition?: number;
  className?: string;
}

export function Component({
  beforeSrc,
  afterSrc,
  beforeLabel = "Before",
  afterLabel = "After",
  initialPosition = 50,
  className,
}: ImageComparisonProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const x = useMotionValue((initialPosition / 100) * containerWidth);
  const clipPercent = useTransform(x, (val) =>
    containerWidth > 0 ? (val / containerWidth) * 100 : initialPosition
  );

  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        const w = containerRef.current.offsetWidth;
        setContainerWidth(w);
        x.set((initialPosition / 100) * w);
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [initialPosition, x]);

  const handleDrag = useCallback(
    (_: any, info: { point: { x: number } }) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const newX = Math.max(0, Math.min(info.point.x - rect.left, containerWidth));
      x.set(newX);
    },
    [containerWidth, x]
  );

  return (
    <div className={cn("w-full max-w-3xl mx-auto px-4", className)}>
      <div
        ref={containerRef}
        className="relative w-full aspect-[16/10] rounded-2xl overflow-hidden border border-border cursor-col-resize select-none"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* After Image (background, full) */}
        <img
          src={afterSrc}
          alt={afterLabel}
          className="absolute inset-0 w-full h-full object-cover"
          draggable={false}
        />

        {/* Before Image (clipped) */}
        <motion.div
          className="absolute inset-0"
          style={{
            clipPath: useTransform(
              clipPercent,
              (v) => `inset(0 ${100 - v}% 0 0)`
            ),
          }}
        >
          <img
            src={beforeSrc}
            alt={beforeLabel}
            className="absolute inset-0 w-full h-full object-cover"
            draggable={false}
          />
        </motion.div>

        {/* Slider Line */}
        <motion.div
          className="absolute inset-y-0 z-10"
          style={{
            left: useTransform(x, (v) => `${v}px`),
            x: "-50%",
          }}
        >
          <div
            className={cn(
              "w-px h-full transition-colors duration-200",
              isDragging
                ? "bg-white"
                : "bg-white/70"
            )}
          />
        </motion.div>

        {/* Drag Handle */}
        <motion.div
          className="absolute inset-y-0 z-20 touch-none"
          style={{
            left: useTransform(x, (v) => `${v}px`),
            x: "-50%",
          }}
          drag="x"
          dragConstraints={containerRef}
          dragElastic={0}
          dragMomentum={false}
          onDrag={handleDrag}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
        >
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2">
            <motion.div
              className={cn(
                "flex items-center justify-center size-10 rounded-full bg-white shadow-lg border border-white/20 backdrop-blur-sm cursor-grab active:cursor-grabbing",
              )}
              animate={{
                scale: isDragging ? 1.15 : isHovering ? 1.05 : 1,
              }}
              transition={{ duration: 0.2 }}
            >
              <GripVertical className="size-4 text-neutral-600" />
            </motion.div>
          </div>
        </motion.div>

        {/* Labels */}
        <motion.div
          className="absolute top-4 left-4 z-10"
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <span className="text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
            {beforeLabel}
          </span>
        </motion.div>

        <motion.div
          className="absolute top-4 right-4 z-10"
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <span className="text-[11px] font-semibold tracking-widest uppercase px-2.5 py-1 rounded-full bg-black/50 text-white backdrop-blur-sm">
            {afterLabel}
          </span>
        </motion.div>
      </div>
    </div>
  );
}