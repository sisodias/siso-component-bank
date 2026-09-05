"use client";

import { cn } from "@/lib/utils";"use client";
import React, { useEffect, useState, useRef } from "react";
import {
    motion,
    useMotionValue,
    useTransform,
    useSpring,
    useMotionTemplate,
} from "framer-motion";

export default function WatchClock () {
    // --- State & Time Management ---
    const [isMounted, setIsMounted] = useState(false);
    const [time, setTime] = useState<Date | null>(null);

    const requestRef = useRef<number>();

    useEffect(() => {
        setIsMounted(true);
        setTime(new Date());

        const animate = () => {
            setTime(new Date());
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    // --- Mouse & 3D Tilt Logic ---
    const mouseX = useMotionValue(0); // For Spotlight
    const mouseY = useMotionValue(0); // For Spotlight

    const x = useMotionValue(0); // For Tilt
    const y = useMotionValue(0); // For Tilt

    // Smooth springs for tilt
    const mouseXSpring = useSpring(x, { stiffness: 300, damping: 30 });
    const mouseYSpring = useSpring(y, { stiffness: 300, damping: 30 });

    // Tilt Transforms
    const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["15deg", "-15deg"]);
    const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-15deg", "15deg"]);

    // Glass Glare Physics
    const glareX = useTransform(mouseXSpring, [-0.5, 0.5], ["0%", "100%"]);
    const glareOpacity = useTransform(mouseYSpring, [-0.5, 0.5], [0, 0.4]);

    // --- FIX: Define Motion Template at Top Level ---
    const spotlightBackground = useMotionTemplate`
    radial-gradient(
      650px circle at ${mouseX}px ${mouseY}px,
      rgba(255,255,255,0.06),
      transparent 80%
    )
  `;

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        // Relative to element for tilt
        const localX = e.clientX - rect.left;
        const localY = e.clientY - rect.top;

        // Normalize -0.5 to 0.5
        const xPct = localX / width - 0.5;
        const yPct = localY / height - 0.5;

        x.set(xPct);
        y.set(yPct);

        // For Spotlight Card (absolute coordinates relative to card)
        mouseX.set(localX);
        mouseY.set(localY);
    };

    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
    };

    // --- Time Helpers ---
    const getRotation = (date: Date | null) => {
        if (!date) return { hours: 0, minutes: 0, seconds: 0 };
        const ms = date.getMilliseconds();
        const s = date.getSeconds();
        const m = date.getMinutes();
        const h = date.getHours();

        return {
            hours: ((h % 12) + m / 60) * 30,
            minutes: (m + s / 60) * 6,
            seconds: (s + ms / 1000) * 6
        };
    };

    const { hours, minutes, seconds } = getRotation(time);

    const formatDigital = (date: Date | null) =>
        date ? date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : "--:--";

    const formatDate = (date: Date | null) =>
        date ? date.toLocaleDateString([], { weekday: "short", day: "numeric" }).toUpperCase() : "";

    // --- Render Ticks ---
    const renderTicks = () => {
        return Array.from({ length: 60 }).map((_, i) => {
            const isHour = i % 5 === 0;
            const angle = i * 6;
            return (
                <div
                    key={i}
                    className={`absolute top-0 left-1/2 -translate-x-1/2 origin-bottom ${isHour ? "h-full" : "h-full opacity-40"}`}
                    style={{ transform: `rotate(${angle}deg)` }}
                >
                    <div className={`mx-auto rounded-full ${isHour ? "w-1 h-3 bg-zinc-300" : "w-[1px] h-1.5 bg-zinc-600"} mt-2`} />
                </div>
            );
        });
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen w-full bg-[#050505] flex items-center justify-center overflow-hidden p-6 relative font-sans">

            {/* --- Environment: Dot Grid & Ambient Glow --- */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff1a_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_800px_at_50%_-30%,#1e1e24,transparent)] pointer-events-none" />

            {/* --- Spotlight Card Container --- */}
            <div
                className="group relative flex items-center justify-center rounded-3xl border border-zinc-800 bg-zinc-900/40 p-12 md:p-20 shadow-2xl backdrop-blur-xl"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
            >
                {/* Spotlight Gradient Layer - Uses pre-calculated template */}
                <motion.div
                    className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition duration-300 group-hover:opacity-100"
                    style={{ background: spotlightBackground }}
                />

                {/* 3D Container */}
                <motion.div
                    className="relative w-[300px] h-[300px] md:w-[360px] md:h-[360px] perspective-1000 cursor-default z-10"
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", duration: 1.2, bounce: 0.3 }}
                >
                    {/* The Watch Body */}
                    <motion.div
                        className="w-full h-full rounded-full bg-black relative shadow-[0_40px_100px_-15px_rgba(0,0,0,0.9)] border border-white/10"
                        style={{
                            rotateX,
                            rotateY,
                            transformStyle: "preserve-3d",
                        }}
                    >
                        {/* Subtle Noise Texture on Case */}
                        <div className="absolute inset-0 rounded-full opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] pointer-events-none z-0" />

                        {/* Outer Rim Highlight */}
                        <div className="absolute inset-0 rounded-full ring-1 ring-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] pointer-events-none z-20" />

                        {/* --- GLASS REFLECTION LAYER --- */}
                        <motion.div
                            className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/10 to-transparent z-[50] pointer-events-none"
                            style={{ opacity: glareOpacity, x: glareX }}
                        />

                        {/* Watch Face Content */}
                        <div className="absolute inset-1 rounded-full bg-gradient-to-br from-zinc-900 to-black overflow-hidden flex items-center justify-center transform-gpu z-10">

                            {/* Radial center highlight */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(30,41,59,0.3)_0%,_transparent_70%)]" />

                            {/* Ticks */}
                            <div className="absolute inset-4">{renderTicks()}</div>

                            {/* Digital Complications */}
                            <div className="absolute top-[22%] flex flex-col items-center">
                                <span className="text-[10px] tracking-[0.2em] font-medium text-emerald-500/80 uppercase glow-sm">
                                    Chronograph
                                </span>
                            </div>

                            <div className="absolute bottom-[20%] flex flex-col items-center gap-1">
                                <span className="text-xs font-mono text-zinc-500 tracking-wide">
                                    {formatDate(time)}
                                </span>
                                <span className="text-sm font-mono text-zinc-300 tracking-widest font-variant-numeric tabular-nums">
                                    {formatDigital(time)}
                                </span>
                            </div>

                            {/* --- HANDS --- */}

                            {/* Hour Hand */}
                            <motion.div
                                className="absolute w-2 h-[26%] bg-zinc-200 rounded-full z-10 origin-bottom shadow-lg bottom-1/2 left-[calc(50%-4px)]"
                                style={{ rotate: hours }}
                                transition={{ duration: 0 }}
                            >
                                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-0.5 h-[60%] bg-zinc-800/20 rounded-full" />
                            </motion.div>

                            {/* Minute Hand */}
                            <motion.div
                                className="absolute w-1.5 h-[38%] bg-zinc-300 rounded-full z-10 origin-bottom shadow-lg bottom-1/2 left-[calc(50%-3px)]"
                                style={{ rotate: minutes }}
                                transition={{ duration: 0 }}
                            />

                            {/* Second Hand */}
                            <motion.div
                                className="absolute w-0.5 h-[45%] bg-emerald-500 z-20 origin-bottom bottom-1/2 left-[calc(50%-1px)] shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                                style={{ rotate: seconds }}
                                transition={{ duration: 0 }}
                            >
                                {/* Top Tip */}
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-3 bg-emerald-300 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.8)]" />
                                {/* Counter-balance tail */}
                                <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-1 h-4 bg-emerald-500 rounded-full" />
                            </motion.div>

                            {/* Center Pivot */}
                            <div className="absolute w-3 h-3 bg-zinc-800 rounded-full z-30 ring-2 ring-emerald-500/50 flex items-center justify-center shadow-lg">
                                <div className="w-1 h-1 bg-black rounded-full" />
                            </div>

                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};
