"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { PartyPopper } from "lucide-react";

export default function RuixenAlert04() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl mx-auto"
        >
            <div
                className={cn(
                    "relative overflow-hidden rounded-2xl border",
                    "bg-white/60 dark:bg-zinc-900/30 backdrop-blur-md",
                    "border-cyan-200 dark:border-cyan-800/40",
                    "shadow-md p-5 pb-10" // increased bottom padding to make room for tag
                )}
            >
                <div className="flex items-center justify-between gap-6">
                    <div className="space-y-1">
                        <motion.h3
                            initial={{ x: -15, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-cyan-900 dark:text-cyan-200 font-semibold text-base"
                        >
                            Cheers to your progress! 🥂
                        </motion.h3>
                        <motion.p
                            initial={{ x: -15, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-sm text-cyan-700 dark:text-cyan-300"
                        >
                            You've completed your 10th successful project.
                        </motion.p>
                    </div>

                    <motion.div
                        initial={{ scale: 0.6, rotate: 10 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: "spring", stiffness: 200, damping: 15 }}
                        className="p-3 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-500 dark:from-cyan-600 dark:to-blue-600"
                    >
                        <PartyPopper className="h-6 w-6 text-white" />
                    </motion.div>
                </div>

                <div className="absolute bottom-3 left-4 sm:left-5">
                    <motion.div
                        initial={{ y: 10, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-[10px] uppercase tracking-wide font-medium px-2 py-0.5 rounded-full bg-cyan-100 dark:bg-cyan-800 text-cyan-800 dark:text-cyan-100"
                    >
                        Celebration
                    </motion.div>
                </div>
            </div>
        </motion.div>
    );
}
