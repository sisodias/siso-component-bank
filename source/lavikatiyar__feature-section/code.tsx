// components/ui/feature-section.tsx

'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming you have a `cn` utility from shadcn

/**
 * Type definition for a single feature item.
 */
export interface Feature {
  /** The URL source for the feature's icon. */
  iconSrc: string;
  /** The title of the feature. */
  title: string;
  /** A brief description of the feature. */
  description: string;
}

/**
 * Props for the FeatureSection component.
 */
export interface FeatureSectionProps {
  /** The main title for the section. */
  title: string;
  /** An array of feature objects to be displayed. */
  features: Feature[];
  /** Optional className to be applied to the section container. */
  className?: string;
}

/**
 * A responsive and animated section to display a list of features.
 * Each feature consists of an icon, title, and description.
 * Requires `framer-motion` for animations.
 */
export const FeatureSection = ({ title, features, className }: FeatureSectionProps) => {
  // Animation variants for the container to orchestrate children animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger the animation of children by 0.2s
      },
    },
  };

  // Animation variants for each feature item
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: 'easeOut',
      },
    },
  };

  return (
    <section className={cn('w-full py-12 md:py-16', className)}>
      <div className="container px-4 md:px-6">
        {/* Section Title */}
        <h2 className="mb-10 text-3xl font-bold tracking-tight text-center text-foreground sm:text-4xl">
          {title}
        </h2>

        {/* Features List */}
        <motion.ul
          className="mx-auto grid max-w-3xl gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // Trigger animation when 30% of the element is in view
          variants={containerVariants}
        >
          {features.map((feature, index) => (
            <motion.li key={index} className="flex items-start gap-4" variants={itemVariants}>
              {/* Icon */}
              <div className="flex-shrink-0">
                <img
                  src={feature.iconSrc}
                  alt={`${feature.title} icon`}
                  className="h-16 w-16  object-contain"
                />
              </div>

              {/* Text Content */}
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground">{feature.title}</h3>
                <p className="mt-1 text-muted-foreground">{feature.description}</p>
              </div>
            </motion.li>
          ))}
        </motion.ul>
      </div>
    </section>
  );
};