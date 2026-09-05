"use client";
import React, { useRef, useMemo } from "react";
import { 
  motion, 
  useSpring, 
  useMotionValue, 
  useTransform, 
  useVelocity,
} from "framer-motion";
import { cn } from "@/lib/utils";

export default function FluidText({
  text = "KINETIC",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking with high-precision motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth global coordinates
  const smoothX = useSpring(mouseX, { stiffness: 40, damping: 25 });
  const smoothY = useSpring(mouseY, { stiffness: 40, damping: 25 });
  
  const velocity = useVelocity(smoothX);
  const skewX = useTransform(velocity, [-2000, 2000], [-30, 30]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const { left, top, width, height } = containerRef.current.getBoundingClientRect();
    // Normalize values from -0.5 to 0.5
    mouseX.set((e.clientX - left) / width - 0.5);
    mouseY.set((e.clientY - top) / height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const characters = useMemo(() => text.split(""), [text]);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex flex-col items-center justify-center min-h-screen w-full select-none",
        "bg-[#fafafa] dark:bg-[#050505] transition-colors duration-700 overflow-hidden",
        className
      )}
    >
      {/* 1. INTERACTIVE REACTIVE GRID */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0 opacity-[0.15] dark:opacity-[0.2]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)`,
            backgroundSize: "40px 40px",
            maskImage: "radial-gradient(circle at center, black, transparent 80%)"
          }}
        />
        {/* Animated Spotlight that follows mouse behind text */}
        <motion.div 
          style={{
            x: useTransform(smoothX, [-0.5, 0.5], ["-20%", "20%"]),
            y: useTransform(smoothY, [-0.5, 0.5], ["-20%", "20%"]),
          }}
          className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,#6366f120,transparent_50%)]"
        />
      </div>

      {/* 2. THE FLUID TEXT ENGINE */}
      <div className="relative z-10 flex flex-row items-center justify-center gap-[0.1em]">
        {characters.map((char, i) => (
          <Character 
            key={i} 
            char={char} 
            index={i} 
            total={characters.length}
            mouseX={mouseX} 
            mouseY={mouseY}
            skewX={skewX}
          />
        ))}
      </div>

      {/* 3. DYNAMIC UNDERLINE (Morphing bar) */}
      <motion.div 
        style={{
          scaleX: useTransform(smoothX, [-0.5, 0, 0.5], [1.5, 0.8, 1.5]),
          x: useTransform(smoothX, [-0.5, 0.5], [-50, 50]),
          skewX
        }}
        className="mt-8 h-[2px] w-48 bg-zinc-900 dark:bg-white origin-center"
      />
    </div>
  );
}

function Character({ char, index, total, mouseX, mouseY, skewX }: any) {
  // Each character gets its own spring with a delay based on its index
  // This creates the "snake" or "liquid" trailing effect
  const delay = index * 0.05;
  
  const x = useSpring(useTransform(mouseX, [-0.5, 0.5], [-100, 100]), {
    stiffness: 60 - index * 2,
    damping: 15 + index,
  });
  
  const y = useSpring(useTransform(mouseY, [-0.5, 0.5], [-60, 60]), {
    stiffness: 60 - index * 2,
    damping: 15 + index,
  });

  const weight = useTransform(x, [-100, 0, 100], [900, 400, 900]);
  const opacity = useTransform(y, [-60, 0, 60], [0.4, 1, 0.4]);

  return (
    <motion.span
      style={{
        x,
        y,
        fontWeight: weight,
        opacity,
        skewX,
        rotate: useTransform(x, [-100, 100], [-10, 10]),
      }}
      className="text-[12vw] font-bold tracking-tighter text-zinc-900 dark:text-zinc-100 will-change-transform"
    >
      {char === " " ? "\u00A0" : char}
    </motion.span>
  );
}