"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

// Animation variants for the container to stagger children
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

// Animation variants for each grid item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
    },
  },
};

/**
 * Props for the BentoGridShowcase component.
 * Each prop represents a "slot" in the grid.
 */
interface BentoGridShowcaseProps {
  /** Slot for the top-left card (Integrations) */
  integrations: React.ReactNode;
  /** Slot for the top-right card (Feature Tags) */
  featureTags: React.ReactNode;
  /** Slot for the tall middle card (Main Feature) */
  mainFeature: React.ReactNode;
  /** Slot for the middle-left card (Secondary Feature) */
  secondaryFeature: React.ReactNode;
  /** Slot for the middle-right card (Statistic) */
  statistic: React.ReactNode;
  /** Slot for the bottom-left card (Journey) */
  journey: React.ReactNode;
  /** Optional class names for the grid container */
  className?: string;
}

/**
 * A responsive, animated 3-column bento grid layout component.
 * It arranges six content slots in a specific 3-row vertical layout.
 */
export const BentoGridShowcase = ({
  integrations,
  featureTags,
  mainFeature,
  secondaryFeature,
  statistic,
  journey,
  className,
}: BentoGridShowcaseProps) => {
  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        // Core grid layout: 1 col on mobile, 3 on desktop
        "grid w-full grid-cols-1 gap-6 md:grid-cols-3",
        // Defines 3 explicit rows on medium screens and up
        "md:grid-rows-3",
        // Use minmax to ensure cards can grow but have a minimum height
        "auto-rows-[minmax(200px,auto)]",
        className
      )}
    >
      {/* The order of these divs is important for CSS grid auto-placement 
        to match the new layout.
      */}

      {/* Slot 1: Integrations (1,1) */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {integrations}
      </motion.div>

      {/* Slot 2: Main Feature (1,2) - Spans 3 rows */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-3">
        {mainFeature}
      </motion.div>

      {/* Slot 3: Feature Tags (1,3) */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {featureTags}
      </motion.div>

      {/* Slot 4: Secondary Feature (2,1) */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {secondaryFeature}
      </motion.div>

      {/* Slot 5: Statistic (2,3) - Spans 2 rows */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-2">
        {statistic}
      </motion.div>

      {/* Slot 6: Journey (3,1) */}
      <motion.div variants={itemVariants} className="md:col-span-1 md:row-span-1">
        {journey}
      </motion.div>
    </motion.section>
  );
};