"use client";

import { cn } from "../_utils/cn";
import React, { useState } from "react";
import { motion } from "framer-motion";

export default function CinematicSwitch () {
    const [isOn, setIsOn] = useState(false);

    return (
        <div className="min-h-screen w-full bg-zinc-950 flex items-center justify-center">
            {/* Switch Container */}
            <div
                className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800 backdrop-blur-sm shadow-xl cursor-pointer"
                onClick={() => setIsOn(!isOn)}
            >
                {/* 'OFF' Label */}
                <span className={`text-xs font-bold tracking-wider transition-colors duration-300 ${!isOn ? "text-zinc-400" : "text-zinc-700"}`}>
                    OFF
                </span>

                {/* Switch Track */}
                <motion.div
                    className="relative w-16 h-8 rounded-full shadow-inner"
                    initial={false}
                    animate={{
                        backgroundColor: isOn ? "#064e3b" : "#27272a", // Emerald-900 vs Zinc-800
                    }}
                    transition={{ duration: 0.3 }}
                >
                    {/* Switch Thumb */}
                    <motion.div
                        className="absolute top-1 left-1 w-6 h-6 rounded-full border border-white/10 shadow-md"
                        initial={false}
                        animate={{
                            x: isOn ? 32 : 0,
                            backgroundColor: isOn ? "#34d399" : "#52525b", // Emerald-400 vs Zinc-600
                        }}
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        whileTap={{ scale: 0.9 }}
                    >
                        {/* Thumb Highlight (Gloss) */}
                        <div className="absolute top-1 left-1.5 w-2 h-1 bg-white/30 rounded-full blur-[1px]" />
                    </motion.div>
                </motion.div>

                {/* 'ON' Label */}
                <span className={`text-xs font-bold tracking-wider transition-colors duration-300 ${isOn ? "text-emerald-400 drop-shadow-[0_0_8px_rgba(52,211,153,0.5)]" : "text-zinc-700"}`}>
                    ON
                </span>
            </div>
        </div>
    );
};
