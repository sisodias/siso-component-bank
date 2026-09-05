"use client";

// vector-pad.tsx
import { cn } from "../_utils/cn";
import React, { useState, useRef } from "react";
import { 
  motion, 
  useMotionValue, 
  useSpring, 
  useTransform, 
  useMotionValueEvent,
  AnimatePresence
} from "framer-motion";

export default function VectorPad() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isActive, setIsActive] = useState(false); // Tracks Hover
  const [isLocked, setIsLocked] = useState(false); // Tracks Click
  const [coords, setCoords] = useState({ x: 50, y: 50 });

  // 1. RAW INPUTS (Instant)
  const x = useMotionValue(50);
  const y = useMotionValue(50);

  // 2. SMOOTHED OUTPUTS (Physics)
  // Stiffness 300, Damping 28 gives a responsive but fluid "hydraulic" feel
  const smoothX = useSpring(x, { stiffness: 300, damping: 28 });
  const smoothY = useSpring(y, { stiffness: 300, damping: 28 });

  // 3. TRANSFORMS
  const crosshairX = useTransform(smoothX, (val) => `${val}%`);
  const crosshairY = useTransform(smoothY, (val) => `${val}%`);
  
  // Calculate a "tilt" effect based on velocity
  const velocityX = useTransform(smoothX, (latest) => (latest - x.get()) * 0.5);
  const velocityY = useTransform(smoothY, (latest) => (latest - y.get()) * 0.5);

  // Update digital readout
  useMotionValueEvent(smoothX, "change", (latest) => {
      setCoords(prev => ({ ...prev, x: Math.round(latest) }));
  });
  useMotionValueEvent(smoothY, "change", (latest) => {
      setCoords(prev => ({ ...prev, y: Math.round(latest) }));
  });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      
      const newX = ((e.clientX - rect.left) / rect.width) * 100;
      const newY = ((e.clientY - rect.top) / rect.height) * 100;

      // Clamp 0-100
      const clampedX = Math.min(Math.max(newX, 0), 100);
      const clampedY = Math.min(Math.max(newY, 0), 100);

      x.set(clampedX);
      y.set(clampedY);
    }
  };

  const handlePointerEnter = () => setIsActive(true);
  
  const handlePointerLeave = () => {
    setIsActive(false);
    setIsLocked(false);
    // Reset to center on leave
    x.set(50);
    y.set(50);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-neutral-950 flex flex-col items-center justify-center font-mono overflow-hidden select-none">
      
      {/* 1. ATMOSPHERIC BACKGROUND */}
      <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,white_0%,transparent_80%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] opacity-20" />
      </div>

      <div className="relative z-10 flex flex-col items-center gap-8 scale-110">
        
        {/* HEADER */}
        <div className="flex justify-between w-[320px] text-cyan-500/80 text-[10px] tracking-[0.2em] uppercase font-bold">
          <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isActive ? (isLocked ? "bg-red-500 shadow-[0_0_10px_red]" : "bg-cyan-400 shadow-[0_0_10px_cyan]") : "bg-cyan-900"}`} />
              <span>VECTOR_CONTROLLER</span>
          </div>
          <span className={`${isActive ? (isLocked ? "text-red-500 animate-pulse" : "text-cyan-400") : "text-neutral-600"}`}>
              {isActive ? (isLocked ? "LOCKED" : "TRACKING") : "IDLE"}
          </span>
        </div>

        {/* --- MAIN PAD AREA --- */}
        <div className="relative group">
            
            {/* Corner Brackets */}
            <div className={`absolute -top-2 -left-2 w-4 h-4 border-t border-l transition-colors duration-300 ${isLocked ? "border-red-500/50" : "border-cyan-500/50"}`} />
            <div className={`absolute -top-2 -right-2 w-4 h-4 border-t border-r transition-colors duration-300 ${isLocked ? "border-red-500/50" : "border-cyan-500/50"}`} />
            <div className={`absolute -bottom-2 -left-2 w-4 h-4 border-b border-l transition-colors duration-300 ${isLocked ? "border-red-500/50" : "border-cyan-500/50"}`} />
            <div className={`absolute -bottom-2 -right-2 w-4 h-4 border-b border-r transition-colors duration-300 ${isLocked ? "border-red-500/50" : "border-cyan-500/50"}`} />

            <div 
                ref={containerRef}
                className={`relative w-[320px] h-[320px] bg-neutral-900/80 rounded-sm border shadow-[0_0_50px_rgba(0,0,0,0.5)] overflow-hidden cursor-crosshair touch-none transition-colors duration-300 ${isLocked ? "border-red-900" : "border-neutral-800"}`}
                onPointerEnter={handlePointerEnter}
                onPointerLeave={handlePointerLeave}
                onPointerMove={handlePointerMove}
                onPointerDown={() => setIsLocked(true)}
                onPointerUp={() => setIsLocked(false)}
            >
            
            {/* Grid Pattern */}
            <div 
                className="absolute inset-0 opacity-20 pointer-events-none transition-opacity duration-500 group-hover:opacity-40"
                style={{ 
                    backgroundImage: `linear-gradient(${isLocked ? "rgba(239,68,68,0.3)" : "rgba(6,182,212,0.3)"} 1px, transparent 1px), linear-gradient(90deg, ${isLocked ? "rgba(239,68,68,0.3)" : "rgba(6,182,212,0.3)"} 1px, transparent 1px)`,
                    backgroundSize: "40px 40px",
                    backgroundPosition: "-1px -1px"
                }}
            />

            {/* Dynamic "Radar" Sweep */}
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent ${isLocked ? "via-red-500/10" : "via-cyan-500/5"} to-transparent h-[200%] w-full animate-[scan_4s_linear_infinite] pointer-events-none`} />

            {/* CROSSHAIRS */}
            <motion.div 
                className={`absolute top-0 bottom-0 w-[1px] bg-gradient-to-b from-transparent ${isLocked ? "via-red-400/80" : "via-cyan-400/50"} to-transparent pointer-events-none transition-colors duration-300`} 
                style={{ left: crosshairX }}
            />
            <motion.div 
                className={`absolute left-0 right-0 h-[1px] bg-gradient-to-r from-transparent ${isLocked ? "via-red-400/80" : "via-cyan-400/50"} to-transparent pointer-events-none transition-colors duration-300`} 
                style={{ top: crosshairY }}
            />

            {/* --- THE RETICLE / PUCK --- */}
            <motion.div
                className="absolute w-0 h-0 z-20"
                style={{ left: crosshairX, top: crosshairY }}
            >
                <motion.div 
                    className="relative -translate-x-1/2 -translate-y-1/2 flex items-center justify-center"
                    // Scale logic: Normal=0.8, Active=1, Locked=0.9 (Tight)
                    animate={{ scale: isActive ? (isLocked ? 0.9 : 1) : 0 }}
                    style={{ rotateX: velocityY, rotateY: velocityX }}
                >
                    {/* Center Dot */}
                    <div className={`w-1 h-1 shadow-[0_0_10px_currentColor] rounded-full transition-colors duration-300 ${isLocked ? "bg-red-50 text-red-50" : "bg-cyan-50 text-cyan-50"}`} />
                    
                    {/* Outer Box */}
                    <motion.div 
                        className={`absolute border shadow-[0_0_15px_rgba(0,0,0,0.3)] transition-colors duration-300 ${isLocked ? "border-red-500 shadow-red-500/20" : "border-cyan-400/80 shadow-cyan-400/30"}`}
                        initial={false}
                        animate={{ 
                            width: isActive ? (isLocked ? 30 : 50) : 0, 
                            height: isActive ? (isLocked ? 30 : 50) : 0,
                            opacity: isActive ? 1 : 0
                        }}
                    >
                         {/* Corner accents */}
                         <div className={`absolute top-0 left-0 w-1.5 h-1.5 border-t border-l transition-colors duration-300 ${isLocked ? "border-red-200" : "border-cyan-200"}`} />
                         <div className={`absolute top-0 right-0 w-1.5 h-1.5 border-t border-r transition-colors duration-300 ${isLocked ? "border-red-200" : "border-cyan-200"}`} />
                         <div className={`absolute bottom-0 left-0 w-1.5 h-1.5 border-b border-l transition-colors duration-300 ${isLocked ? "border-red-200" : "border-cyan-200"}`} />
                         <div className={`absolute bottom-0 right-0 w-1.5 h-1.5 border-b border-r transition-colors duration-300 ${isLocked ? "border-red-200" : "border-cyan-200"}`} />
                    </motion.div>

                    {/* Ping Wave (Only on Hover, stops on Lock) */}
                    <AnimatePresence>
                        {isActive && !isLocked && (
                            <motion.div 
                                initial={{ scale: 0.5, opacity: 1 }}
                                animate={{ scale: 2, opacity: 0 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 1, repeat: Infinity }}
                                className="absolute border border-cyan-500 rounded-full w-10 h-10"
                            />
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>

            {/* Coordinates Overlay inside box */}
            <motion.div 
                className={`absolute bottom-3 right-3 text-[9px] pointer-events-none font-mono transition-colors duration-300 ${isLocked ? "text-red-500" : "text-cyan-500/50"}`}
                animate={{ opacity: isActive ? 1 : 0.3 }}
            >
                {isLocked ? "TARGET_ACQUIRED" : "SEEKING..."}
            </motion.div>
            </div>
        </div>

        {/* DATA READOUT PANELS */}
        <div className="flex gap-4 w-[320px]">
            <DataPanel label="COORD_X" value={coords.x} isActive={isActive} isLocked={isLocked} />
            <DataPanel label="COORD_Y" value={coords.y} isActive={isActive} isLocked={isLocked} />
        </div>

      </div>
    </div>
  );
}

function DataPanel({ label, value, isActive, isLocked }: { label: string, value: number, isActive: boolean, isLocked: boolean }) {
    return (
        <div className="relative flex-1 bg-neutral-900 border border-neutral-800 p-2 overflow-hidden group">
            <div className={`absolute inset-0 transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"} ${isLocked ? "bg-red-900/20" : "bg-cyan-900/20"}`} />
            
            <div className={`relative z-10 flex flex-col items-start pl-2 border-l-2 transition-colors duration-300 ${isLocked ? "border-red-500" : (isActive ? "border-cyan-500" : "border-neutral-800")}`}>
                <span className="text-[9px] text-neutral-500 tracking-widest mb-1">{label}</span>
                <div className="flex items-baseline gap-1">
                    <span className={`text-2xl font-bold tabular-nums leading-none tracking-tighter transition-colors duration-300 ${isLocked ? "text-red-400" : (isActive ? "text-cyan-400" : "text-neutral-400")}`}>
                        {value.toString().padStart(3, '0')}
                    </span>
                    <span className="text-[9px] text-neutral-600">%</span>
                </div>
            </div>
        </div>
    )
}