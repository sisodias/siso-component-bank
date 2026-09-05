"use client";
import { cn } from "@/lib/utils";
import React, { useState, useRef } from "react";
import { motion, useSpring, useMotionValue, useTransform } from "framer-motion";

export default function FluidText({
  text = "MORPHIC",
  className = "",
}: {
  text?: string;
  className?: string;
}) {
  const containerRef = useRef<HTMLDivElement>(null);

  // Mouse tracking physics
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Ultra-smooth spring config for that "heavy liquid" feel
  const smoothX = useSpring(mouseX, { stiffness: 60, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 60, damping: 20 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    // Normalize position from -0.5 to 0.5
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  const characters = text.split("");

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        "relative flex flex-col items-center justify-center min-h-screen w-full",
        "bg-white dark:bg-[#050505] transition-colors duration-1000 overflow-hidden",
        className
      )}
    >
      {/* Dynamic Background: Reacts to mouse movement */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <motion.div 
          style={{ 
            x: useTransform(smoothX, [-0.5, 0.5], [-100, 100]),
            y: useTransform(smoothY, [-0.5, 0.5], [-100, 100])
          }}
          className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-indigo-500/10 dark:bg-emerald-500/10 blur-[120px] rounded-full" 
        />
        <motion.div 
          style={{ 
            x: useTransform(smoothX, [-0.5, 0.5], [100, -100]),
            y: useTransform(smoothY, [-0.5, 0.5], [100, -100])
          }}
          className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-500/10 dark:bg-blue-500/10 blur-[120px] rounded-full" 
        />
      </div>

      <div className="relative z-10 select-none flex flex-wrap justify-center items-center gap-[0.4vw]">
        {characters.map((char, i) => {
          // Dynamic transforms per character
          const rotate = useTransform(smoothX, [-0.5, 0.5], [-15 + i, 15 - i]);
          const skewX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
          const y = useTransform(smoothY, [-0.5, 0.5], [-40, 40]);
          
          // Variable weight shift based on mouse X position
          const fontWeight = useTransform(
            smoothX, 
            [-0.5, 0, 0.5], 
            [900, 100, 900]
          );

          return (
            <motion.span
              key={i}
              style={{ 
                rotate, 
                skewX, 
                y,
                fontWeight,
                transformOrigin: "center"
              }}
              className="text-[15vw] font-black text-zinc-950 dark:text-white leading-[0.8] tracking-tighter will-change-transform inline-block"
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          );
        })}
      </div>

      {/* Visual Cursor Follower (Native cursor is still visible) */}
      <motion.div 
        style={{ 
          x: useTransform(smoothX, [-0.5, 0.5], [500, -500]), 
          y: useTransform(smoothY, [-0.5, 0.5], [250, -250]),
          left: "50%",
          top: "50%"
        }}
        className="fixed w-20 h-20 rounded-full border border-zinc-200 dark:border-zinc-800 pointer-events-none mix-blend-difference z-50 flex items-center justify-center -translate-x-1/2 -translate-y-1/2"
      >
        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
      </motion.div>

      {/* Modern UI Accents */}
      <div className="absolute top-12 left-12 flex flex-col gap-1 opacity-20">
        <div className="w-8 h-[1px] bg-zinc-900 dark:bg-white" />
        <span className="text-[10px] font-bold tracking-widest uppercase">Fluid_Logic_v2</span>
      </div>

      <div className="absolute bottom-12 text-center opacity-30">
        <p className="text-[10px] uppercase tracking-[1em] font-medium text-zinc-400">
          Move Mouse to Morph
        </p>
      </div>
    </div>
  );
}