"use client";

// iso-fader.tsx
import { cn } from "@/lib/utils";
import { useState, useEffect, useRef, useCallback } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useSpring,
  useMotionValueEvent,
} from "framer-motion";

export default function IsoFader() {
  // --- CONFIG ---
  const FADER_HEIGHT = 300;
  const HANDLE_HEIGHT = 40;
  const TOTAL_TICKS = 20;
  const MAX_Y = FADER_HEIGHT - HANDLE_HEIGHT;

  // --- PHYSICS ---
  const [isDragging, setIsDragging] = useState(false);

  // 1. Raw Y position (clamped 0 to MAX_Y)
  // We start at bottom (MAX_Y) because in DOM, 0 is top.
  const rawY = useMotionValue(MAX_Y);

  // 2. Smoothed Y (The physical handle lag)
  const smoothY = useSpring(rawY, {
    stiffness: 250,
    damping: 30,
    mass: 1.2, // Heavier than the knob
  });

  // --- TRANSFORMS ---
  // Invert logic: 0px (top) = 100%, MAX_Y (bottom) = 0%
  const outputValue = useTransform(smoothY, [0, MAX_Y], [100, 0]);

  // Dynamic glow color based on intensity
  const glowColor = useTransform(
    outputValue,
    [0, 50, 100],
    ["#404040", "#f97316", "#ff2200"] // Grey -> Orange -> RedHot
  );

  const glowOpacity = useTransform(outputValue, [0, 100], [0.1, 0.8]);

  // --- INTERACTION ---
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback(() => {
    setIsDragging(true);
    document.body.style.cursor = "grabbing";
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();

      // Calculate relative Y inside the track
      let newY = e.clientY - rect.top - HANDLE_HEIGHT / 2;

      // Clamp
      if (newY < 0) newY = 0;
      if (newY > MAX_Y) newY = MAX_Y;

      rawY.set(newY);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, MAX_Y, rawY]);

  // Generate Tick Marks
  const ticks = Array.from({ length: TOTAL_TICKS + 1 });

  return (
    <div className="fixed inset-0 w-full h-full bg-neutral-950 flex flex-col items-center justify-center">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#444_1px,transparent_1px)] bg-size:20px_20px" />

      <div className="relative flex gap-8 p-12 bg-neutral-900/50 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm">
        {/* --- LEFT: LED METER --- */}
        <div className="flex flex-col justify-between py-1 h-75">
          {ticks.map((_, i) => (
            <LEDSegment
              key={i}
              index={i}
              total={TOTAL_TICKS}
              currentValue={outputValue}
            />
          ))}
        </div>

        {/* --- RIGHT: THE FADER TRACK --- */}
        <div
          ref={containerRef}
          className="relative w-16 bg-neutral-950 rounded-full border border-neutral-800 shadow-[inset_0_0_10px_rgba(0,0,0,1)]"
          style={{ height: FADER_HEIGHT }}
        >
          {/* Center Line */}
          <div className="absolute left-1/2 top-4 bottom-4 w-px bg-neutral-800 -translate-x-1/2" />

          {/* The Handle */}
          <motion.div
            className={`absolute left-1 w-14 h-10 rounded-md bg-neutral-800 border-t border-white/10 shadow-[0_4px_10px_rgba(0,0,0,0.5)] z-20 ${
              isDragging ? "cursor-grabbing" : "cursor-grab"
            }`}
            style={{ y: smoothY }}
            onPointerDown={handlePointerDown}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Handle Texture (Grip Lines) */}
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-[2px] opacity-30">
              <div className="w-8 h-[2px] bg-black" />
              <div className="w-8 h-[2px] bg-black" />
              <div className="w-8 h-[2px] bg-black" />
            </div>

            {/* Active Indicator Light on Handle */}
            <motion.div
              className="absolute inset-x-2 top-1/2 h-[2px] -translate-y-1/2 bg-orange-500 shadow-[0_0_10px_orange]"
              style={{ backgroundColor: glowColor, opacity: glowOpacity }}
            />
          </motion.div>
        </div>

        {/* Digital Readout */}
        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 font-mono text-orange-500 font-bold tracking-widest text-xl">
          <NumberDisplay value={outputValue} />
        </div>
      </div>
    </div>
  );
}

// Component to handle individual LED segments lighting up
function LEDSegment({
  index,
  total,
  currentValue,
}: {
  index: number;
  total: number;
  currentValue: any;
}) {
  // Inverse index because DOM renders top to bottom, but value goes bottom to top
  const threshold = ((total - index) / total) * 100;

  const opacity = useTransform(currentValue, (v: number) =>
    v >= threshold ? 1 : 0.1
  );
  const color = useTransform(currentValue, (v: number) =>
    v >= 90 ? "#ef4444" : "#f97316"
  ); // Red at top, Orange otherwise
  const shadow = useTransform(currentValue, (v: number) =>
    v >= threshold ? "0 0 5px rgba(249, 115, 22, 0.5)" : "none"
  );

  return (
    <motion.div
      className="w-8 h-1.5 rounded-[1px] bg-orange-500"
      style={{ opacity, backgroundColor: color, boxShadow: shadow }}
    />
  );
}

function NumberDisplay({ value }: { value: any }) {
  const [display, setDisplay] = useState(0);
  useMotionValueEvent(value, "change", (latest) =>
    setDisplay(Math.round(latest))
  );
  return <>{display.toString().padStart(3, "0")}%</>;
}
