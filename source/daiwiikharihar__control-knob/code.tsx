"use client";

import { cn } from "@/lib/utils";// reactor-knob.tsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, useMotionValue, useTransform, useSpring, useMotionValueEvent } from "framer-motion";

export default function ReactorKnob() {
  // --- CONFIGURATION ---
  const MIN_DEG = -135;
  const MAX_DEG = 135;
  const TOTAL_TICKS = 40;
  const DEGREES_PER_TICK = (MAX_DEG - MIN_DEG) / TOTAL_TICKS;

  // --- STATE & PHYSICS ---
  const [isDragging, setIsDragging] = useState(false);
  
  // 1. RAW ANGLE: The exact, unsnapped position of your mouse (For the Light)
  const rawRotation = useMotionValue(-45); // 37% = (-135 + 37% of 270°) = -45°

  // 2. SNAPPED ANGLE: The position of the mechanical knob (For the Physical Body)
  const snappedRotation = useMotionValue(-45); // Default to 37%
  
  // 3. SMOOTHED PHYSICS: Adds weight/inertia to the knob movement
  const smoothRotation = useSpring(snappedRotation, { 
    stiffness: 400, 
    damping: 35, 
    mass: 0.8
  });

  // --- TRANSFORMATIONS ---

  // Display Value (0-100) based on the PHYSICAL knob position
  const displayValue = useTransform(smoothRotation, [MIN_DEG, MAX_DEG], [0, 100]);

  // Light Opacity based on the RAW mouse position (Instant Feedback)
  const lightOpacity = useTransform(rawRotation, [MIN_DEG, MAX_DEG], [0.05, 0.5]);
  
  // Light Blur Radius (Grows as energy increases)
  const lightBlur = useTransform(rawRotation, [MIN_DEG, MAX_DEG], ["0px", "20px"]);

  // --- INTERACTION LOGIC ---
  const knobRef = useRef<HTMLDivElement>(null);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    document.body.style.cursor = "grabbing";
    document.body.style.userSelect = "none";
  }, []);

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (!knobRef.current) return;

      const rect = knobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const x = e.clientX - centerX;
      const y = e.clientY - centerY;
     
      // Calculate Angle
      let rads = Math.atan2(y, x);
      let degs = rads * (180 / Math.PI) + 90;

      // Normalize
      if (degs > 180) degs -= 360;

      // Constraints
      if (degs < MIN_DEG && degs > -180) degs = MIN_DEG;
      if (degs > MAX_DEG) degs = MAX_DEG;

      // 1. UPDATE RAW (Instant Light)
      rawRotation.set(degs);

      // 2. UPDATE SNAPPED (Mechanical Knob)
      const snap = Math.round(degs / DEGREES_PER_TICK) * DEGREES_PER_TICK;
      snappedRotation.set(snap);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, rawRotation, snappedRotation, DEGREES_PER_TICK, MAX_DEG, MIN_DEG]);

  // Generate tick marks
  const ticks = Array.from({ length: TOTAL_TICKS + 1 });

  return (
    // FULL SCREEN CONTAINER
    <div className="fixed inset-0 w-full h-full bg-neutral-950 flex flex-col items-center justify-center overflow-hidden">
     
      {/* BACKGROUND TEXTURE */}
      <div 
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ 
            backgroundImage: "linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)",
            backgroundSize: "60px 60px"
        }}
      />
      {/* VIGNETTE SHADOW */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_10%,rgba(0,0,0,0.8)_100%)] pointer-events-none" />

      {/* COMPONENT WRAPPER */}
      <div className="relative z-10 scale-125 md:scale-150">
        
        <div className="relative w-64 h-64 select-none">
          
          {/* Background Glow (Linked to Raw Input) */}
          <motion.div 
              className="absolute inset-0 bg-orange-500 rounded-full blur-3xl transition-opacity duration-75" 
              style={{ opacity: lightOpacity }}
          />

          {/* --- TICK MARKS RING --- */}
          <div className="absolute inset-0 pointer-events-none">
          {ticks.map((_, i) => {
              const angle = (i / TOTAL_TICKS) * (MAX_DEG - MIN_DEG) + MIN_DEG;
              return (
              <div
                  key={i}
                  className="absolute top-0 left-1/2 w-1 h-full -translate-x-1/2"
                  style={{ transform: `rotate(${angle}deg)` }}
              >
                  <TickMark currentRotation={smoothRotation} angle={angle} />
              </div>
              );
          })}
          </div>

          {/* --- THE KNOB --- */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40">
              <motion.div
                  ref={knobRef}
                  className={`relative w-full h-full rounded-full touch-none z-20 ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
                  style={{ rotate: smoothRotation }}
                  onPointerDown={handlePointerDown}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
              >
                  {/* Knob Body */}
                  <div className="w-full h-full rounded-full bg-neutral-900 shadow-[0_10px_30px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] border border-neutral-800 flex items-center justify-center relative overflow-hidden">
                    
                      {/* Brushed Metal Texture */}
                      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_50%),conic-gradient(from_0deg,transparent_0deg,#000_360deg)]" />
                      
                      {/* Top Cap */}
                      <div className="relative w-24 h-24 rounded-full bg-neutral-950 shadow-[inset_0_2px_5px_rgba(0,0,0,1)] border border-neutral-800/50 flex items-center justify-center">
                          
                          {/* Orange Indicator Line */}
                          <motion.div 
                              className="absolute top-3 w-1.5 h-5 bg-orange-500 rounded-full" 
                              style={{ boxShadow: useTransform(rawRotation, (r) => `0 0 ${Math.max(5, (r + 135) / 10)}px orange`) }} 
                          />
                          
                          <div className="flex flex-col items-center mt-4 opacity-50">
                              <span className="font-mono text-[10px] text-neutral-500 tracking-widest">LEVEL</span>
                          </div>
                      </div>
                  </div>
              </motion.div>
          </div>

          {/* Digital Readout */}
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none">
              <span className="text-[10px] text-neutral-600 font-mono tracking-[0.2em] mb-1">OUTPUT</span>
              <DisplayValue value={displayValue} />
          </div>

        </div>
      </div>
    </div>
  );
}

function TickMark({ currentRotation, angle }: { currentRotation: any, angle: number }) {
    const opacity = useTransform(currentRotation, (r: number) => {
        return r >= angle ? 1 : 0.2;
    });
    const color = useTransform(currentRotation, (r: number) => {
        return r >= angle ? "#f97316" : "#404040";
    });
    const boxShadow = useTransform(currentRotation, (r: number) => {
        return r >= angle ? "0 0 8px rgba(249, 115, 22, 0.6)" : "none";
    });

    return (
        <motion.div 
            style={{ backgroundColor: color, opacity, boxShadow }}
            className="w-1 h-2.5 rounded-full transition-colors duration-75"
        />
    );
}

function DisplayValue({ value }: { value: any }) {
    const [display, setDisplay] = useState(37); // Default to 37
    useMotionValueEvent(value, "change", (latest) => setDisplay(Math.round(latest)));
    
    return (
        <div className="relative">
            <span className="absolute inset-0 blur-sm text-orange-500/50 font-mono text-3xl font-black tabular-nums tracking-widest">
                {display.toString().padStart(3, '0')}
            </span>
            <span className="relative font-mono text-3xl text-orange-500 font-black tabular-nums tracking-widest">
                {display.toString().padStart(3, '0')}
                <span className="text-sm text-neutral-600 ml-1">%</span>
            </span>
        </div>
    );
}
