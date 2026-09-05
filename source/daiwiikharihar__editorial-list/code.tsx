"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

export interface StaggeredListProps extends React.HTMLAttributes<HTMLUListElement> {
  children: React.ReactNode;
  staggerDelay?: number;
  /**
   * Automatically handles grid layouts for 'cards' variant
   * @default false
   */
  grid?: boolean;
}

const StaggeredList = React.forwardRef<HTMLUListElement, StaggeredListProps>(
  ({ children, className, staggerDelay = 0.1, grid = false, ...props }, ref) => {
    const prefersReducedMotion = useReducedMotion();

    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: prefersReducedMotion ? 0 : staggerDelay,
        },
      },
    };

    return (
      <motion.ul
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-20px" }}
        className={cn(
          "flex w-full",
          grid 
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6" 
            : "flex-col",
          className
        )}
        {...props}
      >
        {children}
      </motion.ul>
    );
  }
);
StaggeredList.displayName = "StaggeredList";

export interface StaggeredListItemProps extends React.LiHTMLAttributes<HTMLLIElement> {
  children: React.ReactNode;
  variant?: "border-bottom" | "cards" | "minimal";
}

const StaggeredListItem = React.forwardRef<HTMLLIElement, StaggeredListItemProps>(
  ({ children, className, variant = "border-bottom", ...props }, ref) => {
    const itemVariants = {
      hidden: { opacity: 0, y: 15 },
      visible: {
        opacity: 1,
        y: 0,
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 25, // Slightly increased damping for smoother mobile feel
          mass: 0.8
        },
      },
    };

    const variantStyles = {
      "border-bottom": "border-b border-zinc-200 dark:border-zinc-800 py-5 md:py-8 last:border-0",
      "cards": "bg-white dark:bg-zinc-900 p-5 md:p-6 rounded-2xl shadow-sm border border-zinc-100 dark:border-zinc-800",
      "minimal": "py-2 md:py-3 opacity-80 hover:opacity-100 transition-opacity"
    };

    return (
      <motion.li
        ref={ref}
        variants={itemVariants}
        className={cn(
          "w-full group list-none",
          variantStyles[variant],
          className
        )}
        {...props}
      >
        {children}
      </motion.li>
    );
  }
);
StaggeredListItem.displayName = "StaggeredListItem";

export { StaggeredList, StaggeredListItem };