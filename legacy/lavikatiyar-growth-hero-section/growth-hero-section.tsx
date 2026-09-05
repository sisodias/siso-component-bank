"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a utility for class names

// Prop definition for the component
interface GrowthHeroSectionProps {
  /** The main title, can include <br /> for line breaks */
  title: React.ReactNode;
  /** The first paragraph of description text */
  description1: string;
  /** The second paragraph of description text */
  description2: string;
  /** An array of 4 image source URLs for the growth animation */
  images: [string, string, string, string];
  /** Call-to-action details */
  cta: {
    text: string;
    href: string;
  };
  /** Optional brand name to display at the top */
  brandName?: string;
  /** Optional className to override styles */
  className?: string;
}

/**
 * A responsive hero section with an animated image gallery.
 * Uses shadcn's theme variables for light/dark mode support.
 */
export const GrowthHeroSection = ({
  title,
  description1,
  description2,
  images,
  cta,
  brandName,
  className,
}: GrowthHeroSectionProps) => {

  // Animation variants for the container to orchestrate children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Each child will animate 0.2s after the previous one
        delayChildren: 0.3,
      },
    },
  };

  // Animation variants for each individual item (image, text)
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: "easeInOut",
      },
    },
  };

  return (
    <section
      className={cn(
        "w-full bg-background text-foreground antialiased",
        className
      )}
    >
      <div className="container mx-auto flex min-h-screen flex-col items-center justify-center px-4 text-center">
        {/* Optional Brand Name */}
        {brandName && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute top-8 text-lg font-medium tracking-wide text-muted-foreground"
          >
            {brandName}
          </motion.div>
        )}

        {/* Animated Images */}
        <motion.div
          className="mb-8 flex items-end justify-center space-x-4 sm:space-x-6 md:space-x-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          aria-label="Illustration of a plant growing in four stages"
        >
          {images.map((src, index) => (
            <motion.div key={index} variants={itemVariants}>
              <img
                src={src}
                alt={`Plant growth stage ${index + 1}`}
                className="h-auto max-h-[120px] w-full"
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Main Title */}
        <motion.h1
          className="mb-6 max-w-3xl text-3xl font-medium tracking-tight text-foreground md:text-5xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          {title}
        </motion.h1>
        
        {/* Description Paragraphs */}
        <motion.div
          className="max-w-3xl space-y-4 text-base text-muted-foreground md:text-lg"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          <p>{description1}</p>
          <p>{description2}</p>
        </motion.div>

        {/* Call to Action Link */}
        <motion.a
          href={cta.href}
          className="mt-12 text-sm font-medium text-primary underline-offset-4 transition-colors hover:text-primary/80 hover:underline"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          aria-label={cta.text}
        >
          {cta.text}
        </motion.a>
      </div>
    </section>
  );
};