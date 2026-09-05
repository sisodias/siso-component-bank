"use client";

import { cn } from "@/lib/utils";
import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

// Embedded noise texture to remove external network dependency
const NOISE_DATA_URI = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.05'/%3E%3C/svg%3E`;

interface CinematicSwitchProps {
    /** Optional callback when state changes */
    onChange?: (isOn: boolean) => void;
    /** Optional class for the container */
    className?: string;
    /** Initial state (default: false) */
    defaultOn?: boolean;
}

/**
 * CinematicSwitch
 * A high-fidelity, physically modeled toggle switch inspired by high-end audio equipment
 * and cinematic lighting.
 * * Supports Light Mode and Dark Mode automatically via Tailwind 'dark' classes.
 */
const CinematicSwitch: React.FC<CinematicSwitchProps> = ({
    onChange,
    className = "",
    defaultOn = false,
}) => {
    const [isOn, setIsOn] = useState(defaultOn);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleSwitch = useCallback(() => {
        const newState = !isOn;
        setIsOn(newState);
        if (onChange) onChange(newState);
    }, [isOn, onChange]);

    // Spring physics for the mechanical movement (crisp, heavy, no bounce)
    const spring = {
        type: "spring",
        stiffness: 700,
        damping: 30,
    };

    return (
        <div
            ref={containerRef}
            className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden 
      bg-neutral-50 dark:bg-[#050505] 
      font-sans selection:bg-amber-500/30 transition-colors duration-700 ${className}`}
        >
            {/* -------------------------------------------
          AMBIENT ATMOSPHERE & NOISE
          ------------------------------------------- */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Noise texture - darker in light mode for visibility */}
                <div
                    className="absolute inset-0 opacity-[0.03] dark:opacity-[0.15] brightness-100 contrast-150 mix-blend-multiply dark:mix-blend-normal"
                    style={{ backgroundImage: `url("${NOISE_DATA_URI}")` }}
                />
                {/* Vignette - subtle grey in light mode, deep black in dark mode */}
                <div className="absolute inset-0 bg-radial-gradient from-transparent via-neutral-200/50 to-neutral-300/80 dark:via-[#050505]/80 dark:to-[#050505]" />
            </div>

            {/* -------------------------------------------
          AMBIENT WARMTH (The Brightener)
          ------------------------------------------- 
          Washes the screen with golden light when ON. 
      */}
            <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                animate={{ opacity: isOn ? 1 : 0 }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            >
                <div className="absolute inset-0 bg-radial-gradient from-amber-200/40 via-amber-100/10 to-transparent dark:from-amber-900/20 dark:via-transparent" />
            </motion.div>

            {/* -------------------------------------------
          VOLUMETRIC LIGHTING (GOD RAYS)
          ------------------------------------------- */}
            <AnimatePresence>
                {isOn && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, filter: "blur(20px)" }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                            filter: "blur(0px)",
                        }}
                        exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[80vh] -mt-20 pointer-events-none z-0"
                    >
                        {/* The warm beam - adjusted for visibility on white background */}
                        <div
                            className="w-full h-full bg-gradient-to-b from-amber-500/30 via-amber-500/5 to-transparent dark:from-amber-500/10 dark:via-amber-500/5"
                            style={{
                                clipPath: "polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)",
                            }}
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* -------------------------------------------
          FLOOR REFLECTION / GLOW
          ------------------------------------------- */}
            <motion.div
                // In light mode: use multiply to "burn" the color into the white background
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full 
        bg-amber-400/30 dark:bg-amber-600/20 
        blur-[80px] pointer-events-none z-0 mix-blend-multiply dark:mix-blend-screen"
                animate={{
                    opacity: isOn ? 0.6 : 0,
                    scale: isOn ? 1 : 0.8,
                }}
                transition={{ duration: 1 }}
            />

            {/* -------------------------------------------
          THE SWITCH ASSEMBLY
          ------------------------------------------- */}
            <div className="relative z-20 flex flex-col items-center gap-12">
                {/* Main Interactive Button */}
                <button
                    onClick={toggleSwitch}
                    className="group relative focus:outline-none cursor-pointer"
                    role="switch"
                    aria-checked={isOn}
                    aria-label="Toggle Cinematic Light"
                >
                    {/* OUTER BEZEL */}
                    <motion.div
                        className="relative w-28 h-14 rounded-full overflow-hidden transition-all duration-500
            bg-zinc-200 dark:bg-[#1a1a1a] 
            shadow-[inset_0_1px_1px_rgba(255,255,255,1),0_4px_10px_-2px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.05)]
            dark:shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_20px_40px_-10px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(0,0,0,0.8)]"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    >
                        {/* Background Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-b from-zinc-100 to-zinc-300 dark:from-[#0a0a0a] dark:to-[#141414] transition-colors duration-500" />

                        {/* Active Glow Trace */}
                        <motion.div
                            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                            style={{
                                background: isOn
                                    ? "radial-gradient(circle at 75% 50%, rgba(245, 158, 11, 0.3), transparent 60%)" // Stronger amber in light mode
                                    : "radial-gradient(circle at 25% 50%, rgba(0,0,0, 0.05), transparent 60%)",
                            }}
                        />

                        {/* THE THUMB (The Moving Part) */}
                        <motion.div
                            className="absolute top-1.5 left-1.5 w-11 h-11 rounded-full z-10 will-change-transform"
                            animate={{
                                x: isOn ? 56 : 0,
                            }}
                            transition={spring}
                        >
                            {/* Thumb Visuals - Silver/White in Light Mode */}
                            <div
                                className={`
                  w-full h-full rounded-full transition-all duration-500
                  border border-white dark:border-white/5
                  bg-gradient-to-b from-white via-zinc-50 to-zinc-200 dark:from-zinc-600 dark:via-zinc-700 dark:to-zinc-800
                  shadow-[0_2px_4px_rgba(0,0,0,0.1),inset_0_1px_0_rgba(255,255,255,0.8)] dark:shadow-[0_2px_8px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.3)]
                  flex items-center justify-center relative
                `}
                            >
                                {/* Micro-texture: Grip lines */}
                                <div className="flex gap-[3px] opacity-20 dark:opacity-40">
                                    <div className="w-[1px] h-4 bg-black" />
                                    <div className="w-[1px] h-4 bg-black" />
                                    <div className="w-[1px] h-4 bg-black" />
                                </div>
                            </div>
                        </motion.div>

                        {/* STATUS LABELS */}
                        <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                            <span
                                className={`text-[9px] font-bold tracking-widest uppercase transition-colors duration-300 ${!isOn
                                        ? "text-zinc-400 dark:text-zinc-500"
                                        : "text-zinc-300 dark:text-zinc-800"
                                    }`}
                            >
                                Off
                            </span>
                            <span
                                className={`text-[9px] font-bold tracking-widest uppercase transition-colors duration-300 ${isOn
                                        ? "text-amber-600 dark:text-amber-100 drop-shadow-sm dark:drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]"
                                        : "text-zinc-300 dark:text-zinc-800"
                                    }`}
                            >
                                On
                            </span>
                        </div>
                    </motion.div>

                    {/* Focus Ring for Accessibility */}
                    <div className="absolute -inset-2 rounded-full border border-amber-500/0 group-focus-visible:border-amber-500/50 transition-colors" />
                </button>

                {/* -------------------------------------------
            TYPOGRAPHY
            ------------------------------------------- */}
                <div className="flex flex-col items-center gap-2 text-center">
                    <motion.h1
                        className="text-4xl md:text-5xl font-bold tracking-tighter text-transparent bg-clip-text 
            bg-gradient-to-b from-zinc-900 to-zinc-400 dark:from-white dark:to-white/40 
            transition-all duration-500"
                        animate={{
                            opacity: isOn ? 1 : 0.3,
                            filter: isOn ? "blur(0px)" : "blur(1px)",
                        }}
                        transition={{ duration: 1 }}
                    >
                        STUDIO A
                    </motion.h1>
                    <motion.p
                        className="text-xs font-mono tracking-[0.3em] uppercase transition-colors duration-500"
                        animate={{
                            color: isOn ? "#d97706" : "#a1a1aa", // Light Mode: Amber-600 / Zinc-400
                        }}
                        // Use inline style for dark mode override since 'animate' handles the colors dynamically
                        style={{
                            color: undefined, // Let Tailwind dark classes take over if needed, or manage fully in animate
                        }}
                    >
                        {/* We render a span to handle the dark mode color switch cleaner via CSS classes */}
                        <span
                            className={`transition-colors duration-500 ${isOn
                                    ? "text-amber-600 dark:text-amber-400"
                                    : "text-zinc-400 dark:text-zinc-600"
                                }`}
                        >
                            {isOn ? "System Online" : "Standby Mode"}
                        </span>
                    </motion.p>
                </div>
            </div>

            {/* OVERLAY VIGNETTE - lighter in light mode */}
            <motion.div
                className="fixed inset-0 pointer-events-none z-50 bg-radial-gradient from-transparent via-transparent to-black/5 dark:to-black/80 transition-colors duration-500"
                animate={{ opacity: isOn ? 0 : 1 }}
                transition={{ duration: 1.5 }}
            />
        </div>
    );
};

export default CinematicSwitch;