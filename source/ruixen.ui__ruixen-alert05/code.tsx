"use client";

import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { CircleDollarSign } from "lucide-react";

export default function RuixenAlert05() {
    return (
        <motion.div
            initial={{ y: -10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full"
        >
            <div
                className={cn(
                    "mx-auto max-w-xl",
                    "bg-cyan-50 dark:bg-cyan-900 border border-cyan-200 dark:border-cyan-700",
                    "rounded-md px-4 py-2 flex items-center justify-between",
                    "text-sm shadow-sm"
                )}
            >
                <div className="flex items-center gap-2">
                    <CircleDollarSign className="h-4 w-4 text-cyan-700 dark:text-cyan-300 hover:scale-110 transition-transform" />
                    <span className="text-cyan-800 dark:text-cyan-200 font-medium">
                        ₹1,98,000 received successfully
                    </span>
                </div>

                <span className="text-xs text-cyan-600 dark:text-cyan-400 hover:underline cursor-pointer">
                    View details →
                </span>
            </div>
        </motion.div>
    );
}
