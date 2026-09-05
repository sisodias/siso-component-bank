"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";

interface Btn04Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

export default function RuixenBtn04({ className, ...props }: Btn04Props) {
    return (
        <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
        >
            <Button
                className={cn(
                    "relative px-6 py-3 rounded-full font-medium overflow-hidden",
                    "bg-gradient-to-r from-pink-500 to-purple-600",
                    "text-white shadow-lg",
                    "hover:shadow-pink-400/60 dark:hover:shadow-purple-500/40",
                    "transition-all duration-600 ease-in-out",
                    className
                )}
                {...props}
            >
                Launch Magic
            </Button>
        </motion.div>
    );
}
