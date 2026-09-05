import * as React from "react";
import { motion, Variants } from "framer-motion";

// A small, reusable diamond icon component for the feature list
const DiamondIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 2L2 12l10 10 10-10L12 2z" />
  </svg>
);

// Define the props for the component
interface SustainabilitySectionProps {
  title: string;
  features: string[];
  imageUrl: string;
  imageAlt?: string;
}

/**
 * A section component to highlight features with an accompanying image.
 * Designed to be animated, responsive, and theme-adaptive.
 */
export const SustainabilitySection = ({
  title,
  features,
  imageUrl,
  imageAlt = "Feature image",
}: SustainabilitySectionProps) => {
  // Animation variants for the container and its children
  const sectionVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants: Variants = {
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

  const imageVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, x: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      transition: {
        duration: 0.7,
        ease: [0.25, 1, 0.5, 1], // A nice elastic ease
      },
    },
  };

  return (
    <motion.section
      className="w-full max-w-6xl mx-auto py-12 px-4 md:py-20 lg:py-24"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={sectionVariants}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 items-center">
        {/* Left side: Text content */}
        <div className="flex flex-col gap-6">
          <motion.h2
            className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground"
            variants={itemVariants}
          >
            {title}
          </motion.h2>
          <motion.ul className="space-y-4" variants={itemVariants}>
            {features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3">
                <DiamondIcon className="w-4 h-4 mt-1.5 flex-shrink-0 text-primary" />
                <span className="text-base md:text-lg text-muted-foreground">
                  {feature}
                </span>
              </li>
            ))}
          </motion.ul>
        </div>

        {/* Right side: Image content with decorative background */}
        <motion.div className="relative" variants={imageVariants}>
          <div
            aria-hidden="true"
            className="absolute -inset-4 md:-inset-8 bg-primary/10 rounded-full blur-3xl -z-10"
          />
          <img
            src={imageUrl}
            alt={imageAlt}
            width={500}
            height={500}
            className="relative w-full h-auto max-w-md mx-auto object-contain"
          />
        </motion.div>
      </div>
    </motion.section>
  );
};