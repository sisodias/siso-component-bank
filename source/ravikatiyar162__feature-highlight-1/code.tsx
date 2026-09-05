import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils"; // Assumes shadcn's 'cn' utility

// --- Animation Variants ---

// Variant for the container to stagger children
const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Variant for individual elements to fade in and slide up
const fadeInUp: Variants = {
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

// --- Prop Types ---

/**
 * Represents a single statistic to be displayed.
 */
interface StatProps {
  /** The main value, e.g., "29 hrs" or "5,000 mAh" */
  value: string;
  /** An optional label displayed above the value, e.g., "Watch up to" */
  label?: string;
}

/**
 * Props for the FeatureHighlight component.
 */
export interface FeatureHighlightProps extends React.HTMLAttributes<HTMLElement> {
  /** The main headline text. */
  headline: string;
  /** The subheadline or product name. */
  subheadline: string;
  /** An array of stats to display. */
  stats: StatProps[];
  /** The URL for the main product image. */
  imageUrl: string;
  /** Alt text for the product image (for accessibility). */
  imageAlt: string;
  /** Optional disclaimer text shown at the bottom. */
  disclaimerText?: string;
}

// --- Component ---

/**
 * A responsive component to highlight product features with stats and an image,
 * animated with Framer Motion.
 */
export const FeatureHighlight = React.forwardRef<HTMLElement, FeatureHighlightProps>(
  (
    {
      className,
      headline,
      subheadline,
      stats,
      imageUrl,
      imageAlt,
      disclaimerText,
      ...props
    },
    ref
  ) => {
    return (
      <motion.section
        ref={ref}
        className={cn(
          "flex w-full max-w-4xl flex-col items-center justify-center",
          "overflow-hidden bg-background py-12 px-6 text-center md:py-20",
          className
        )}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        aria-label="Product Feature Highlight"
        {...props}
      >
        {/* 1. Headline */}
        <motion.h2
          className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl"
          variants={fadeInUp}
        >
          {headline}
        </motion.h2>

        {/* 2. Subheadline */}
        <motion.p
          className="mt-2 text-lg font-medium text-muted-foreground"
          variants={fadeInUp}
        >
          {subheadline}
        </motion.p>

        {/* 3. Stats Section */}
        <motion.div
          className="mt-10 flex flex-col md:items-end justify-center gap-8 sm:flex-row sm:gap-16"
          variants={fadeInUp}
        >
          {stats.map((stat, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Optional label above stat */}
              {stat.label && (
                <span className="text-lg font-medium text-muted-foreground">
                  {stat.label}
                </span>
              )}
              {/* Stat value */}
              <span className="text-6xl font-extrabold text-primary lg:text-7xl">
                {stat.value}
              </span>
            </div>
          ))}
        </motion.div>

        {/* 4. Main Image */}
        <motion.div
          className="mt-12 w-full max-w-3xl"
          variants={fadeInUp}
        >
          <img
            src={imageUrl}
            alt={imageAlt}
            width={1200}
            height={675}
            className="h-auto w-full rounded-lg object-cover"
          />
        </motion.div>

        {/* 5. Disclaimer */}
        {disclaimerText && (
          <motion.p
            className="mt-12 max-w-2xl text-xs text-muted-foreground/80"
            variants={fadeInUp}
          >
            {disclaimerText}
          </motion.p>
        )}
      </motion.section>
    );
  }
);

FeatureHighlight.displayName = "FeatureHighlight";

export default FeatureHighlight;