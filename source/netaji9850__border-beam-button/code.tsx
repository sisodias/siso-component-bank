"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedBorderButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  beamColor?: string;
}

const AnimatedBorderButton = React.forwardRef<
  HTMLButtonElement,
  AnimatedBorderButtonProps
>(({ className, children, beamColor = "#3b82f6", ...props }, ref) => {
  return (
    <motion.div
      className="relative group/btn isolate inline-block rounded-lg"
      whileTap={{ scale: 0.95 }}
      initial="initial"
      whileHover="hover"
    >
      {/* 0. NEW: Static Border Track 
          This ensures the button shape is visible even when the beam 
          is in the transparent part of its rotation.
      */}
      <div 
        className="absolute -inset-[1.5px] rounded-lg bg-border/40" 
        aria-hidden="true"
      />

      {/* 1. The Moving Gradient Beam 
          ALWAYS VISIBLE NOW (opacity-60).
          Brightens to 100% on hover.
      */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 4,
          ease: "linear",
          repeat: Infinity,
        }}
        variants={{
          initial: { opacity: 0.6, filter: "blur(1px)" },
          hover: { opacity: 1, filter: "blur(2px)" },
        }}
        className={cn(
          "absolute -inset-[1.5px] rounded-lg",
          "bg-[conic-gradient(from_0deg_at_50%_50%,transparent_0%,transparent_60%,var(--beam-color)_100%)]",
          "will-change-transform"
        )}
        style={
          {
            "--beam-color": beamColor,
          } as React.CSSProperties
        }
        aria-hidden="true"
      />

      {/* 2. The Secondary Glow 
          Pulsing glow, stronger on hover
      */}
      <motion.div
        animate={{ scale: [1, 1.02, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -inset-1 rounded-lg bg-blue-500/20 blur-xl opacity-20 group-hover/btn:opacity-50 transition-opacity duration-500"
        aria-hidden="true"
      />

      {/* 3. The Button Surface 
          Standard Shadcn button styling with added interactions
      */}
      <button
        ref={ref}
        className={cn(
          "relative flex h-10 items-center justify-center gap-2 px-8 py-2 w-full overflow-hidden",
          // Use semantic tokens for theming
          "rounded-lg bg-background text-sm font-medium text-foreground",
          "border border-border/50 shadow-sm", // Reduced border opacity so beam shines through
          "transition-colors duration-200 ease-in-out",
          // Hover Background
          "group-hover/btn:bg-accent/50",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>
        
        {/* NEW: Hover "Shimmer" Wipe 
            This slides across the button when hovered
        */}
        <motion.div
          variants={{
            initial: { x: "-100%" },
            hover: { 
              x: "100%", 
              transition: { 
                repeat: Infinity, 
                duration: 1, 
                ease: "linear",
                repeatDelay: 0.5 
              } 
            },
          }}
          className="absolute inset-0 z-0 bg-gradient-to-r from-transparent via-foreground/10 to-transparent pointer-events-none"
        />
        
        {/* Inner Highlight/Shine (Static glow) */}
        <div className="absolute inset-0 rounded-lg bg-gradient-to-b from-foreground/5 to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300 pointer-events-none" />
      </button>
    </motion.div>
  );
});

AnimatedBorderButton.displayName = "AnimatedBorderButton";

// Exporting Component to match the file requirement
export const Component = () => {
  return (
    // Changed bg to neutral-100/950 so the button (which is bg-background) pops out
    <div className="flex h-[300px] w-full items-center justify-center bg-neutral-100 dark:bg-neutral-950">
      <AnimatedBorderButton onClick={() => console.log("Generate Clicked")}>
        Generate Key
        {/* Lucide Icon: Sparkles */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275Z" />
        </svg>
      </AnimatedBorderButton>
    </div>
  );
};