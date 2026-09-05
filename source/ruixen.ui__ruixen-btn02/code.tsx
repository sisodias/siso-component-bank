"use client"

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

interface Btn01Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children?: React.ReactNode;
}

export default function RuixenBtn02({
    className,
    children = "Start Now",
    ...props
}: Btn01Props) {
    return (
        <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block"
        >
            <Button
                className={cn(
                    "relative py-2.5 pl-5 pr-12",
                    "bg-gradient-to-tr from-blue-400 to-indigo-400",
                    "text-white font-semibold text-sm",
                    "rounded-full shadow-md",
                    "overflow-hidden group",
                    "transition-all duration-300 ease-in-out",
                    className
                )}
                {...props}
            >
                <span className="z-10 relative">{children}</span>
                <motion.span
                    initial={{ x: 6 }}
                    animate={{ x: 0 }}
                    transition={{ repeat: Infinity, repeatType: "mirror", duration: 1.2 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                >
                    <ArrowRight className="w-4 h-4 text-white" />
                </motion.span>
            </Button>
        </motion.div>
    );
}
