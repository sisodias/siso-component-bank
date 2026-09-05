import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "../_utils/cn"; // Assuming a 'cn' utility from shadcn

// Props interface for type-safety and reusability
interface AnimatedFeatureCardProps {
  title: string;
  description: string;
  imageSrc: string;
  featureNumber: string;
  handle: string;
  className?: string;
}

/**
 * A reusable card component for showcasing features with an animation effect.
 * It's designed to be responsive and theme-adaptive using shadcn's CSS variables.
 */
export const AnimatedFeatureCard = ({
  title,
  description,
  imageSrc,
  featureNumber,
  handle,
  className,
}: AnimatedFeatureCardProps) => {
  // Animation variants for framer-motion
  const cardVariants = {
    offscreen: {
      y: 50,
      opacity: 0,
    },
    onscreen: {
      y: 0,
      opacity: 1,
      transition: {
        type: 'spring',
        bounce: 0.4,
        duration: 0.8,
      },
    },
  };

  return (
    <motion.div
      className={cn(
        'relative flex w-full max-w-sm flex-col overflow-hidden rounded-2xl bg-card p-6 shadow-sm',
        className
      )}
      initial="offscreen"
      whileInView="onscreen"
      viewport={{ once: true, amount: 0.5 }}
      variants={cardVariants}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    >
      {/* Top section: Title */}
      <div className="mb-6 rounded-lg bg-background/50 p-3 text-center text-sm text-card-foreground">
        <p>{title}</p>
      </div>

      {/* Middle section: Image */}
      <div className="flex flex-grow items-center justify-center">
        <img
          src={imageSrc}
          alt={title}
          className="h-auto w-full max-w-[250px] object-contain"
        />
      </div>

      {/* Bottom section: Description and metadata */}
      <div className="mt-6 flex flex-col items-center text-center">
        <p className="text-lg font-medium text-foreground">{description}</p>
      </div>

      <div className="mt-8 flex items-center justify-between text-muted-foreground">
        <span className="text-sm font-mono">{featureNumber}</span>
        <span className="text-sm font-medium">{handle}</span>
      </div>
    </motion.div>
  );
};