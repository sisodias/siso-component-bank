"use client";

import { cn } from "@/lib/utils";
import React, { useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Lock, ShieldCheck, Fingerprint, Activity } from "lucide-react";

// --- Types ---
interface HolographicCardProps {
  children?: React.ReactNode;
  className?: string;
}

// --- The Main Component ---
export function Card({ children, className }: HolographicCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Motion Values (Direct GPU updates, no React re-renders for mouse movement)
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Spring Physics configuration
  const springConfig = { damping: 20, stiffness: 300, mass: 0.5 };
  
  // Smooth out the raw mouse values
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [15, -15]), springConfig);
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-15, 15]), springConfig);
  
  // Spotlight and Sheen calculations
  const spotlightX = useSpring(useTransform(x, [-0.5, 0.5], [0, 100]), springConfig);
  const spotlightY = useSpring(useTransform(y, [-0.5, 0.5], [0, 100]), springConfig);

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Calculate mouse position relative to center of card (-0.5 to 0.5)
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;

    x.set(xPct);
    y.set(yPct);
  }

  function handleMouseLeave() {
    // Reset to center on leave
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      initial="initial"
      whileHover="hover"
      className={cn(
        "relative w-full max-w-sm h-96 group perspective-1000",
        className
      )}
      style={{
        perspective: "1000px", // Essential for 3D effect
      }}
    >
      <motion.div
        className="relative w-full h-full rounded-xl bg-gradient-to-br from-neutral-900 to-black border border-white/10 overflow-hidden shadow-2xl"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d", // Allows children to float in 3D
        }}
      >
        {/* --- LAYER 1: Dynamic Spotlight (Background) --- */}
        <motion.div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{
            background: useTransform(
              [spotlightX, spotlightY],
              ([sx, sy]) => `radial-gradient(600px circle at ${sx}% ${sy}%, rgba(120, 119, 198, 0.15), transparent 40%)`
            ),
            transform: "translateZ(1px)",
          }}
        />

        {/* --- LAYER 2: Grid Texture --- */}
        <div 
            className="absolute inset-0 opacity-[0.15] pointer-events-none"
            style={{
                backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
                backgroundSize: "32px 32px",
                transform: "translateZ(10px)", // Subtle depth
            }}
        />

        {/* --- LAYER 3: The Content --- */}
        <div className="relative h-full flex flex-col items-center justify-center p-8 z-10">
          
          {/* Floating Icon Container */}
          <motion.div 
            className="mb-6 relative"
            style={{ transform: "translateZ(50px)" }} // Pops out significantly
          >
             <div className="absolute inset-0 bg-blue-500 blur-[40px] opacity-20 rounded-full animate-pulse" />
             <div className="relative size-20 bg-black/50 backdrop-blur-md rounded-2xl border border-white/10 flex items-center justify-center shadow-inner">
                <Fingerprint className="size-10 text-blue-400" strokeWidth={1.5} />
             </div>
             
             {/* Floating Badges */}
             <motion.div 
                className="absolute -right-4 -top-4 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut", delay: 1 }}
             >
                <Lock className="size-3 text-emerald-400" />
             </motion.div>
             <motion.div 
                className="absolute -left-4 -bottom-2 bg-zinc-900 border border-zinc-800 p-1.5 rounded-lg shadow-lg"
                animate={{ y: [0, -5, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
             >
                <ShieldCheck className="size-3 text-rose-400" />
             </motion.div>
          </motion.div>

          {/* Text Content */}
          <motion.div 
            className="text-center space-y-2"
            style={{ transform: "translateZ(30px)" }}
          >
            <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
              Secure Enclave
            </h3>
            <p className="text-sm text-zinc-400 max-w-[200px] leading-relaxed">
              Biometric authentication with holographic depth verification.
            </p>
          </motion.div>

          {/* Active Status Line */}
          <motion.div 
             className="mt-8 flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/5"
             style={{ transform: "translateZ(20px)" }}
          >
             <Activity className="size-3 text-green-500 animate-pulse" />
             <span className="text-[10px] font-medium uppercase tracking-widest text-zinc-500">System Active</span>
          </motion.div>
        </div>

        {/* --- LAYER 4: Border Glow (Follows Mouse) --- */}
        <motion.div
            className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
                background: useTransform(
                [spotlightX, spotlightY],
                ([sx, sy]) => `radial-gradient(400px circle at ${sx}% ${sy}%, rgba(255, 255, 255, 0.1), transparent 40%)`
                ),
                transform: "translateZ(0px)",
            }} 
        />
        
      </motion.div>
    </motion.div>
  );
}

// --- Usage Example ---
export default function HolographicCard() {
  return (
    <div className="min-h-[500px] flex items-center justify-center bg-neutral-950 p-6">
       <Card />
    </div>
  );
}
