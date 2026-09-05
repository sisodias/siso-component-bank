"use client";

import { Check, X } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";

export default function RuixenAlert02() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="max-w-lg mx-auto w-full bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm p-5 flex items-center gap-4"
        >
            {/* Avatar Section */}
            <div className="relative">
                <Image
                    src="https://github.com/shadcn.png"
                    alt="ruixen"
                    width={48}
                    height={48}
                    className="rounded-full border border-white dark:border-zinc-950 shadow"
                />
                <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-green-500 ring-2 ring-white dark:ring-zinc-950" />
            </div>

            {/* Message Section */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-zinc-900 dark:text-zinc-100">
                    <span className="font-semibold">grok</span> invited you to{" "}
                    <span className="text-blue-600 dark:text-blue-400 font-medium">Ruixen UI</span>
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
                    2 minutes ago
                </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
                <button
                    className="group h-8 w-8 flex items-center justify-center rounded-md hover:bg-red-100 dark:hover:bg-red-900 transition"
                    aria-label="Decline"
                >
                    <X className="h-4 w-4 text-red-500 group-hover:scale-110 transition-transform" />
                </button>
                <button
                    className="group h-8 w-8 flex items-center justify-center rounded-md hover:bg-emerald-100 dark:hover:bg-emerald-900 transition"
                    aria-label="Accept"
                >
                    <Check className="h-4 w-4 text-emerald-500 group-hover:scale-110 transition-transform" />
                </button>
            </div>
        </motion.div>
    );
}
