"use client"
import { cn } from "@/lib/utils";
import React, { useEffect, useState, useRef } from "react";
import {
  motion,
  useSpring,
  useMotionValue,
  useTransform,
  useMotionValueEvent,
} from "framer-motion";

interface AnalogueGaugeProps {
  value?: number; // 0 to 100
  label?: string;
  className?: string;
}

export default function AnalogueGauge({
  value = 0,
  label = "PRESSURE",
  className = "",
}: AnalogueGaugeProps) {
  // --- Physics & Animation State ---

  const targetValue = useMotionValue(value);
  const physicsValue = useSpring(targetValue, {
    stiffness: 60,
    damping: 10,
    mass: 1.5,
  });

  const rotation = useTransform(physicsValue, [0, 100], [-110, 110]);
  const [displayNumber, setDisplayNumber] = useState(value);
  const [isOverload, setIsOverload] = useState(false);
  const [isWarning, setIsWarning] = useState(false);

  useMotionValueEvent(physicsValue, "change", (latest) => {
    const clamped = Math.min(Math.max(latest, 0), 100);
    setDisplayNumber(clamped);
    setIsOverload(clamped >= 98);
    setIsWarning(clamped > 70 && clamped < 98);
  });

  // --- Interaction Logic (Press & Hold) ---

  const isPressed = useRef(false);
  const animationFrameId = useRef<number | null>(null);
  const pressureVelocity = useRef(0);

  useEffect(() => {
    if (!isPressed.current) {
      targetValue.set(Math.min(Math.max(value, 0), 100));
    }
  }, [value, targetValue]);

  const simulatePressure = () => {
    if (!isPressed.current) return;
    const currentTarget = targetValue.get();

    if (currentTarget >= 100) {
      // Violent jitter at max pressure
      const jitter = (Math.random() - 0.5) * 5;
      targetValue.set(100 + jitter);
      animationFrameId.current = requestAnimationFrame(simulatePressure);
      return;
    }

    pressureVelocity.current *= 1.05;
    const nextValue = Math.min(currentTarget + pressureVelocity.current, 100);
    targetValue.set(nextValue);

    animationFrameId.current = requestAnimationFrame(simulatePressure);
  };

  const handlePressStart = (e: React.PointerEvent | React.TouchEvent) => {
    isPressed.current = true;
    pressureVelocity.current = 0.2;
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    animationFrameId.current = requestAnimationFrame(simulatePressure);
  };

  const handlePressEnd = () => {
    isPressed.current = false;
    if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    targetValue.set(Math.min(Math.max(value, 0), 100));
  };

  const renderTicks = () => {
    return [...Array(11)].map((_, i) => {
      const angle = (i / 10) * 220 - 110;
      const isMajor = i % 5 === 0;
      return (
        <div
          key={i}
          className={`absolute top-0 left-1/2 -translate-x-1/2 origin-[50%_150px] ${
            isMajor ? "h-4 w-1 bg-neutral-400" : "h-2 w-0.5 bg-neutral-600"
          }`}
          style={{ transform: `rotate(${angle}deg)` }}
        />
      );
    });
  };

  // --- Visual Effects Calculations ---
  
  // Background pulse opacity based on overload
  const dangerOpacity = isOverload ? 0.6 : isWarning ? 0.2 : 0;
  
  // Shake animation for the container
  const shakeVariants = {
    idle: { x: 0, y: 0, rotate: 0 },
    shaking: {
      x: [0, -2, 2, -1, 1, 0],
      y: [0, 1, -1, 2, -2, 0],
      rotate: [0, -0.5, 0.5, 0],
      transition: { repeat: Infinity, duration: 0.1 }
    }
  };

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen p-8 bg-neutral-950 overflow-hidden ${className}`}>
      
      {/* 1. DYNAMIC BACKGROUND ENVIRONMENT */}
      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{ 
            backgroundImage: "linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)",
            backgroundSize: "40px 40px"
        }}
      />
      
      {/* Radial Warning Light (Pulses Red when Overload) */}
      <div 
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 ease-in-out"
        style={{ 
            background: "radial-gradient(circle at center, rgba(220, 38, 38, 0.4) 0%, transparent 70%)",
            opacity: dangerOpacity
        }}
      >
        {isOverload && (
           <div className="absolute inset-0 bg-red-500/10 animate-pulse" /> 
        )}
      </div>

      {/* 2. TEXT HUD ELEMENTS */}
      <motion.div 
        className="mb-12 text-center max-w-md relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className={`text-3xl md:text-4xl font-black tracking-tighter uppercase mb-2 transition-colors duration-200 ${isOverload ? "text-red-500 animate-pulse" : isWarning ? "text-yellow-500" : "text-white"}`}>
          {isOverload ? "CRITICAL FAILURE" : isWarning ? "HIGH PRESSURE" : "SYSTEM NORMAL"}
        </h2>
        <div className="flex items-center justify-center gap-2">
            <div className={`w-2 h-2 rounded-full ${isPressed.current ? "bg-green-500 animate-ping" : "bg-neutral-600"}`} />
            <p className="text-sm md:text-base text-neutral-500 font-mono tracking-widest">
            HOLD TO PRESSURIZE
            </p>
        </div>
      </motion.div>

      {/* 3. GAUGE CONTAINER WRAPPER (Handles the Shake) */}
      <motion.div
        variants={shakeVariants}
        animate={isOverload ? "shaking" : "idle"}
        className="relative"
      >
        {/* Decorative HUD Circle behind gauge */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-85 h-85 rounded-full border border-dashed border-neutral-800 animate-[spin_10s_linear_infinite]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-75 h-75 rounded-full border border-neutral-800 opacity-50" />

        {/* --- ORIGINAL GAUGE STRUCTURE (UNTOUCHED STYLES) --- */}
        <div className="flex items-center justify-center relative">
            
          {/* Glitch Effect Duplicate (Visible only on overload) */}
          {isOverload && (
             <div className="absolute inset-0 opacity-50 blur-[1px] translate-x-1 animate-pulse mix-blend-screen">
                 {/* This creates a ghosting effect during high stress */}
                 <div className="w-64 h-64 rounded-full bg-red-900/20" />
             </div>
          )}

          <div className="relative w-64 h-64 select-none">
            {/* INTERACTIVE HOTSPOT */}
            <div 
              className="absolute inset-0 z-30 rounded-full cursor-pointer touch-none active:scale-[0.98] transition-transform"
              onPointerDown={handlePressStart}
              onPointerUp={handlePressEnd}
              onPointerLeave={handlePressEnd}
            />

            {/* OUTER HOUSING */}
            <div className={`w-full h-full rounded-full bg-neutral-800 p-2 shadow-[0_20px_50px_rgba(0,0,0,0.5),inset_0_2px_2px_rgba(255,255,255,0.1)] transition-shadow duration-300 ${isOverload ? "shadow-[0_0_50px_rgba(220,38,38,0.6)]" : ""}`}>
              
              {/* INNER DIAL FACE */}
              <div className="relative w-full h-full rounded-full bg-neutral-900 shadow-[inset_0_10px_20px_rgba(0,0,0,1)] border border-neutral-700/50 flex items-center justify-center overflow-hidden">
                
                {/* Subtle Grid Texture */}
                <div 
                   className="absolute inset-0 opacity-20"
                   style={{ backgroundImage: "radial-gradient(circle, #333 1px, transparent 1px)", backgroundSize: "10px 10px" }}
                />

                {/* TICKS CONTAINER */}
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="relative w-0 h-0 -top-5">
                     {renderTicks()}
                   </div>
                </div>

                {/* DANGER ZONE */}
                <svg className="absolute inset-0 w-full h-full rotate-110 pointer-events-none opacity-40">
                    <circle 
                      cx="50%" cy="50%" r="40%" 
                      fill="none" stroke="#ef4444" strokeWidth="8"
                      strokeDasharray="251"
                      strokeDashoffset="210"
                      className="blur-[1px]"
                    />
                </svg>

                {/* LABEL */}
                <div className="absolute top-[65%] flex flex-col items-center">
                   <span className={`text-[10px] tracking-[0.3em] font-bold ${isOverload ? "text-red-500" : "text-neutral-500"}`}>{label}</span>
                   <span className={`text-xl font-mono font-bold tabular-nums mt-1 ${isOverload ? "text-red-400" : "text-white"}`}>
                     {displayNumber.toFixed(0)}
                   </span>
                </div>

                {/* THE NEEDLE */}
                <motion.div
                  className="absolute top-1/2 left-1/2 w-1 h-32 origin-bottom bg-orange-500 rounded-full z-10 shadow-[0_0_10px_rgba(249,115,22,0.5)]"
                  style={{ 
                     rotate: rotation,
                     marginTop: "-128px", 
                     marginLeft: "-2px"
                  }}
                >
                   <div className="absolute -bottom-2 -left-1 w-3 h-10 bg-neutral-800 rounded-sm" />
                </motion.div>
                
                {/* CENTER CAP */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-linear-to-br from-neutral-700 to-neutral-900 shadow-[0_4px_10px_rgba(0,0,0,1)] z-20 border border-neutral-600" />

                {/* GLASS REFLECTION */}
                <div className="absolute inset-0 rounded-full bg-linear-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
      
      {/* 4. BOTTOM STATUS READOUT */}
      <div className="mt-12 flex gap-8 text-xs font-mono text-neutral-600">
          <div className="flex flex-col items-center gap-1">
              <span>STATUS</span>
              <span className={isOverload ? "text-red-500 font-bold" : "text-neutral-400"}>{isOverload ? "ERR_01" : "OK"}</span>
          </div>
          <div className="w-px h-8 bg-neutral-800" />
          <div className="flex flex-col items-center gap-1">
              <span>PEAK</span>
              <span className="text-neutral-400">100 PSI</span>
          </div>
      </div>
    </div>
  );
}