"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Github } from "lucide-react";
import {cn} from "@/lib/utils"

interface SpecialCardProps {
  imageSrc: string;
  name: string;
  role: string;
  socials?: {
    github: string;
  };
  className?: string;
}

// --- Animation Physics & Variants ---

// 1. The "Fluid" Spring: softer and more elastic feeling
const fluidTransition = {
  type: "spring",
  stiffness: 260,
  damping: 28,
  mass: 1,
};

// 2. Container for staggering text elements smoothly
const contentContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // The delay between name and role appearing
      delayChildren: 0.02,   // Start almost immediately upon expansion
    },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 }, // Exit FAST so the box can collapse cleanly
  },
};

// 3. The "Elegant Reveal": slides up while un-blurring
const elegantItemVariants = {
  hidden: { y: 12, opacity: 0, filter: "blur(6px)" },
  visible: {
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
    transition: fluidTransition, // Use the same fluid physics for elements
  },
};


export default function ProfileCard({
  imageSrc,
  name,
  role,
  socials,
  className = "",
}: SpecialCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className={cn(
          "relative z-0 flex items-center overflow-hidden",
          // Base bg + text for both themes
          "bg-white/80 text-zinc-900",
          "dark:bg-zinc-900/80 dark:text-zinc-50"
        )}
        style={{ cursor: "default" }}
        layout
        initial={{ borderRadius: 40, width: 68, height: 68 }}
        animate={{
          width: isHovered ? "auto" : 68,
          borderRadius: 40,
        }}
        transition={fluidTransition}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Decorative layers */}
        <div className="absolute inset-0 z-20 rounded-[40px] border border-white/50 shadow-sm dark:border-zinc-700/40 pointer-events-none" />
        <div className="absolute inset-0 z-0 rounded-[40px] shadow-[0_4px_20px_-2px_rgba(0,0,0,0.08)] dark:shadow-[0_4px_20px_-2px_rgba(0,0,0,0.55)] pointer-events-none" />

        {/* Gradient background reacts to theme */}
        <div
          className={cn(
            "absolute inset-0 transition-opacity duration-500 z-0",
            "bg-gradient-to-br from-zinc-50/90 via-white/90 to-zinc-100/80",
            "dark:from-zinc-900/90 dark:via-zinc-900/80 dark:to-zinc-800/80",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        />

        {/* --- Avatar Wrapper --- */}
        <motion.div
          layout="position" // Keeps avatar anchored smoothly during expansion
          className="relative z-30 h-14 w-14 shrink-0 m-1.5"
        >
          {/* Living Ambient Glow: Rotates slowly to feel alive */}
          <motion.div
            className="absolute inset-0 rounded-full blur-xl"
            animate={{
              scale: isHovered ? 1.6 : 0.8,
              opacity: isHovered ? 1 : 0,
              rotate: isHovered ? [0, 360] : 0, // Slow rotation
            }}
            transition={{
              scale: { duration: 0.4, ease: "easeOut" },
              opacity: { duration: 0.4 },
              rotate: { duration: 15, repeat: Infinity, ease: "linear" }
            }}
          />

          {/* Avatar Image */}
          <motion.img
            src={imageSrc}
            alt={name}
            className="relative h-full w-full rounded-full object-cover border-[2.5px] border-white dark:border-zinc-800 shadow-sm"
            animate={{ scale: isHovered ? 1 : 0.96 }}
            transition={fluidTransition}
          />

          {/* Status Dot Pop-in */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: isHovered ? 1 : 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-[2.5px] border-white dark:border-zinc-800 z-40"
          />
        </motion.div>

        {/* --- Text Content --- */}
        <div className="relative z-20 overflow-hidden">
          {/* Use mode="wait" for cleaner exit/enter transitions */}
          <AnimatePresence mode="wait">
            {isHovered && (
              <motion.div
                // Connect to our staggered container variants
                variants={contentContainerVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className="flex flex-col justify-center pl-4 pr-8 min-w-[180px]"
              >
                {/* Header Row: Name & Social */}
                <div className="flex items-center justify-between gap-6 mb-1">
                  <motion.h3
                    variants={elegantItemVariants}
                    className="text-base font-bold text-zinc-900 dark:text-zinc-50 tracking-tight whitespace-nowrap"
                  >
                    {name}
                  </motion.h3>

                  {socials?.github && (
                    <motion.a
                      href={socials.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={elegantItemVariants}
                      className="flex items-center justify-center h-8 w-8 rounded-full bg-zinc-100/80 dark:bg-zinc-800/80 text-black dark:text-zinc-400 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors"
                    >
                      <Github size={20} />
                    </motion.a>
                  )}
                </div>

                {/* Bottom Row: Role & Action */}
                <motion.div
                  variants={elegantItemVariants}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <span className="text-xs font-medium text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                    {role}
                  </span>
                  <span className="h-0.5 w-0.5 rounded-full bg-zinc-300 dark:bg-zinc-600" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}