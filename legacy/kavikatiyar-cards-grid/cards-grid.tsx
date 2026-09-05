// components/ui/resource-cards-grid.tsx

import * as React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "../_utils/cn"; // Your utility for merging class names

// Define the type for each card item
export interface ResourceCardItem {
  iconSrc: string;
  title: string;
  lastUpdated: string;
  href: string;
}

// Define the props for the main grid component
interface ResourceCardsGridProps {
  items: ResourceCardItem[];
  className?: string;
}

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
  },
};

export const ResourceCardsGrid = ({ items, className }: ResourceCardsGridProps) => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3",
        className
      )}
    >
      {items.map((item, index) => (
        <motion.a
          key={index}
          href={item.href}
          variants={itemVariants}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          className="group block"
          target="_blank"
          rel="noopener noreferrer"
        >
          <div className="flex h-full flex-col justify-between rounded-lg border border-border bg-card p-6 shadow-sm transition-shadow duration-300 hover:shadow-md">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img src={item.iconSrc} alt={`${item.title} icon`} className="h-10 w-10" />
                <div>
                  <h3 className="text-lg font-semibold text-card-foreground">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Last updated: {item.lastUpdated}
                  </p>
                </div>
              </div>
              <ArrowUpRight className="h-5 w-5 text-muted-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" />
            </div>
          </div>
        </motion.a>
      ))}
    </motion.div>
  );
};