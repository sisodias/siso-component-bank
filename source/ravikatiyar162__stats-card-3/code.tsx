import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn

// --- TYPE DEFINITIONS ---
// Defines the shape of a single statistic item
interface Stat {
  value: React.ReactNode;
  label: string;
  icon: React.ReactNode;
}

// Defines the props for the StatsCard component
export interface StatsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * An array of statistics to display.
   * Each object should contain a value, label, and icon.
   */
  stats: Stat[];
}

// --- ANIMATION VARIANTS ---
// Defines the animation for the container to orchestrate children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger the animation of children by 0.2s
    },
  },
};

// Defines the animation for each individual stat item
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

// --- COMPONENT DEFINITION ---
const StatsCard = React.forwardRef<HTMLDivElement, StatsCardProps>(
  ({ className, stats, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-4xl rounded-xl border bg-card text-card-foreground shadow-sm",
          className
        )}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }} // Trigger animation when 50% of the element is in view
        {...props}
      >
        <div className="grid grid-cols-1 divide-y sm:grid-cols-3 sm:divide-x sm:divide-y-0 p-6 text-center">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="flex items-center justify-center gap-4 py-6 sm:py-0"
              aria-label={`${stat.value} ${stat.label}`}
              variants={itemVariants}
            >
              {/* Stat Text Content */}
              <div className="text-left">
                <p className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {stat.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{stat.label}</p>
              </div>
              {/* Icon */}
              <div className="flex-shrink-0">{stat.icon}</div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    );
  }
);

StatsCard.displayName = "StatsCard";

export { StatsCard };