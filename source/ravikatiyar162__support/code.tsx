"use client";

import * as React from "react";
import { Headphones, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assumes you have a `cn` utility from shadcn/ui

// Type definition for each support link item
export interface SupportItem {
  title: string;
  href: string;
  imageSrc: string;
}

// Props for the main SupportLinks component
export interface SupportLinksProps {
  icon?: React.ReactNode;
  title: string;
  items: SupportItem[];
}

/**
 * A responsive and theme-adaptive component to display support links.
 * Uses framer-motion for entry animations on the support cards.
 */
export const SupportLinks = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & SupportLinksProps
>(({ className, icon, title, items, ...props }, ref) => {
  // Animation variants for the container to orchestrate children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Animation variants for each card item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <section
      ref={ref}
      className={cn(
        "w-full max-w-4xl mx-auto rounded-xl border bg-card text-card-foreground p-6 md:p-8",
        className,
      )}
      {...props}
    >
      {/* Header section with icon and title */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
          {icon || <Headphones className="h-5 w-5 text-muted-foreground" />}
        </div>
        <h2 className="text-lg font-semibold text-foreground">{title}</h2>
      </div>

      {/* Grid container for animated support cards */}
      <motion.div
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {items.map((item, index) => (
          <motion.a
            key={index}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            variants={itemVariants}
            className="group relative flex flex-col items-center justify-center p-6 text-center transition-all duration-300 bg-transparent border rounded-lg hover:border-primary/80 hover:bg-accent focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            {/* Card image with a subtle hover effect */}
            <div className="mb-4">
              <img
                src={item.imageSrc}
                alt={`${item.title} Illustration`}
                className="h-20 w-20 object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </div>

            {/* Title with an animated external link icon */}
            <span className="flex items-center justify-center text-sm font-medium text-foreground">
              {item.title}
              <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
});

SupportLinks.displayName = "SupportLinks";