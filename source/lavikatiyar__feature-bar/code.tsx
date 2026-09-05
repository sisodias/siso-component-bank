// components/ui/feature-bar.tsx

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming a 'utils' file for merging tailwind classes, common in shadcn projects.

// Define the type for a single feature item
interface FeatureItem {
  icon?: React.ReactNode;
  title: string;
  subtitle?: string;
}

// Define the props for the main component
export interface FeatureBarProps {
  items: FeatureItem[];
  className?: string;
}

// Animation variants for the container to orchestrate staggered animation
const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Animation variants for each item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      ease: "easeOut",
      duration: 0.5,
    },
  },
};

const FeatureBar = React.forwardRef<HTMLDivElement, FeatureBarProps>(
  ({ className, items }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "grid grid-cols-1 divide-y rounded-lg border bg-card text-card-foreground shadow-sm md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-5",
          className
        )}
        aria-label="Feature highlights"
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="flex-1 p-6 text-center"
            role="listitem"
          >
            <div className="flex items-center justify-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                {item.title}
              </h3>
              {/* Render icon if it exists */}
              {item.icon}
            </div>
            {/* Render subtitle if it exists */}
            {item.subtitle && (
              <p className="mt-1 text-sm text-muted-foreground">
                {item.subtitle}
              </p>
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  }
);

FeatureBar.displayName = "FeatureBar";

export { FeatureBar };