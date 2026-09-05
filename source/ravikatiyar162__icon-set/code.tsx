import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Your utility for classname merging

// Define the shape of each item in the grid
export interface IconGridItem {
  id: string;
  icon: React.ReactNode; // Use ReactNode to allow for SVG components or images
  name: string; // Used for accessibility (aria-label)
}

// Define the props for the IconGrid component
export interface IconGridProps {
  items: IconGridItem[];
  className?: string;
}

// Animation variants for the container to orchestrate children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08, // Time delay between each child animating in
    },
  },
};

// Animation variants for each individual grid item
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

const IconGrid = React.forwardRef<HTMLDivElement, IconGridProps>(
  ({ items, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          "grid grid-cols-3 gap-4 text-center sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6",
          className
        )}
      >
        {items.map((item) => (
          <motion.div
            key={item.id}
            variants={itemVariants}
            className="group relative flex flex-col items-center justify-center"
            aria-label={item.name}
          >
            <div className="flex h-24 w-24 items-center justify-center rounded-lg border bg-card p-4 transition-all duration-300 ease-in-out hover:bg-card/60 hover:shadow-md hover:-translate-y-1">
              {item.icon}
            </div>
          </motion.div>
        ))}
      </motion.div>
    );
  }
);

IconGrid.displayName = "IconGrid";

export { IconGrid };