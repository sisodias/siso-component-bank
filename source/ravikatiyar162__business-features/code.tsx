// components/ui/business-features.tsx
"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

// Define the type for a single feature item
interface Feature {
  imgSrc: string;
  label: string;
  altText: string;
}

// Define the props for the BusinessFeatures component
export interface BusinessFeaturesProps {
  title: string;
  features: Feature[];
  className?: string;
}

// Framer Motion variants for animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger the animation of children
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  },
};

const BusinessFeatures = React.forwardRef<
  HTMLDivElement,
  BusinessFeaturesProps
>(({ className, title, features }, ref) => {
  return (
    <section
      ref={ref}
      className={cn("w-full py-16 sm:py-20 bg-background", className)}
    >
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-center text-foreground mb-12">
          {title}
        </h2>

        {/* Features Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the element is in view
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="flex flex-col items-center text-center"
              variants={itemVariants}
            >
              {/* Feature Image */}
              <div className="relative mb-4">
                <motion.img
                  src={feature.imgSrc}
                  alt={feature.altText}
                  className="w-40 h-40 object-cover rounded-full border-4 border-transparent group-hover:border-primary transition-colors duration-300"
                  whileHover={{ scale: 1.05, rotate: 3 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </div>

              {/* Feature Label */}
              <p className="text-lg font-medium text-foreground">
                {feature.label}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
});

BusinessFeatures.displayName = "BusinessFeatures";

export { BusinessFeatures };