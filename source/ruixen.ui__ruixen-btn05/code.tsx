"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ClipboardSignature } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

interface RuixenBtn05Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    textToCopy: string;
    successDuration?: number;
}

export default function RuixenBtn05({
    textToCopy,
    successDuration = 1500,
    className,
    ...props
}: RuixenBtn05Props) {
    const [showTooltip, setShowTooltip] = useState(false);

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(textToCopy);
            setShowTooltip(true);
            setTimeout(() => setShowTooltip(false), successDuration);
        } catch (err) {
            console.error("Copy failed:", err);
        }
    }

    return (
        <div className="relative inline-block">
            <Button
                onClick={handleCopy}
                className={cn(
                    "flex items-center gap-2 px-4 py-2 rounded-lg",
                    "bg-emerald-400 text-white hover:bg-emerald-500",
                    className
                )}
                {...props}
            >
                <ClipboardSignature className="w-4 h-4" />
                Copy Link
            </Button>

            <AnimatePresence>
                {showTooltip && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: -20 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute left-1/2 -translate-x-1/2 top-0 text-xs bg-black text-white px-2 py-1 rounded-md shadow-md"
                    >
                        Copied!
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
