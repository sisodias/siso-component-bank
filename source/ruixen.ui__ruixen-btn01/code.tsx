"use client";

import { cn } from "@/lib/utils";
import { useState, useRef, MouseEvent } from "react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles } from "lucide-react";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export default function RuixenBtn03({
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  const [ripples, setRipples] = useState<Ripple[]>([]);
  const rippleId = useRef(0);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const createRipple = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = buttonRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newRipple = {
      id: rippleId.current++,
      x,
      y,
    };

    setRipples((prev) => [...prev, newRipple]);

    setTimeout(() => {
      setRipples((prev) => prev.filter((r) => r.id !== newRipple.id));
    }, 600);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.03 }}
      transition={{ type: "spring", stiffness: 250, damping: 15 }}
    >
      <Button
        ref={buttonRef}
        onClick={(e) => {
          createRipple(e);
          props.onClick?.(e);
        }}
        className={cn(
          "relative overflow-hidden isolate bg-indigo-100 dark:bg-indigo-900",
          "text-indigo-700 dark:text-indigo-300 border border-indigo-300 dark:border-indigo-700",
          "hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-all duration-300",
          "px-6 py-3 rounded-full shadow-md group"
        )}
        {...props}
      >
        {/* Ripple animation */}
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{ opacity: 0.4, scale: 0 }}
              animate={{ opacity: 0, scale: 4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="absolute bg-indigo-400/30 dark:bg-indigo-200/20 rounded-full pointer-events-none"
              style={{
                width: 60,
                height: 60,
                top: ripple.y - 30,
                left: ripple.x - 30,
              }}
            />
          ))}
        </AnimatePresence>

        {/* Button content with animation */}
        <motion.span
          initial={false}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative z-10 flex items-center gap-2"
        >
          <motion.span
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{
              repeat: Infinity,
              repeatDelay: 3,
              duration: 2,
              ease: "easeInOut",
            }}
          >
            <Sparkles className="w-4 h-4 text-indigo-500 dark:text-indigo-300" />
          </motion.span>
          <span className="font-medium text-sm">Click Me</span>
        </motion.span>
      </Button>
    </motion.div>
  );
}
