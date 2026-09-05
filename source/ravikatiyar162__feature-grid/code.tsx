// components/ui/feature-grid.tsx

import * as React from "react";
import { motion } from "framer-motion";

// Define the type for a single feature item
interface Feature {
  iconSrc: string;
  iconAlt: string;
  title: string;
  description: string;
}

// Define the props for the FeatureGrid component
interface FeatureGridProps {
  title: React.ReactNode;
  features: Feature[];
  className?: string;
}

/**
 * A responsive grid component to display features with icons, titles, and descriptions.
 * Animates into view using Framer Motion.
 */
export const FeatureGrid = ({ title, features, className }: FeatureGridProps) => {
  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className={`w-full py-16 sm:py-20 md:py-24 ${className}`}>
      <div className="container mx-auto px-4 md:px-6">
        {/* Main Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <h2 className="text-3xl font-bold tracking-tighter text-foreground sm:text-4xl md:text-5xl">
            {title}
          </h2>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-1 gap-x-8 gap-y-12 sm:mt-12 md:grid-cols-2 lg:mt-16"
        >
          {features.map((feature, index) => (
            <motion.div key={index} variants={itemVariants} className="flex flex-col items-start gap-4">
              {/* Feature Icon */}
              <div className="flex h-12 w-12 items-center justify-center">
                 <img src={feature.iconSrc} alt={feature.iconAlt} className="h-full w-full object-contain" />
              </div>

              {/* Feature Title */}
              <h3 className="text-xl font-semibold text-foreground">{feature.title}</h3>

              {/* Feature Description */}
              <p className="text-muted-foreground">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};