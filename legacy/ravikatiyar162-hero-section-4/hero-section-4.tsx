// components/ui/hero-section.tsx

import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility
import { Button } from "./button"; // Assuming shadcn Button component

// Props interface for type safety
interface HeroSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonHref: string;
  secondaryButtonText: string;
  secondaryButtonHref: string;
  imageUrl: string;
}

// Animation variants for the container to orchestrate staggered animations
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

// Animation variants for child elements (text and buttons)
const itemVariants: Variants = {
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

const HeroSection = React.forwardRef<HTMLDivElement, HeroSectionProps>(
  (
    {
      className,
      title,
      subtitle,
      primaryButtonText,
      primaryButtonHref,
      secondaryButtonText,
      secondaryButtonHref,
      imageUrl,
      ...props
    },
    ref
  ) => {
    return (
      <section
        ref={ref}
        className={cn(
          "relative flex h-screen min-h-[700px] w-full items-center justify-center overflow-hidden",
          className
        )}
        {...props}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 z-[-1] bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${imageUrl})` }}
          aria-hidden="true"
        />

        {/* Optional: Add a subtle overlay for better text readability */}
        <div className="absolute inset-0 z-0 bg-black/20" aria-hidden="true" />

        {/* Content Container */}
        <motion.div
          className="z-10 flex max-w-4xl flex-col items-center justify-center text-center text-primary-foreground"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Animated Title */}
          <motion.h1
            className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl"
            variants={itemVariants}
          >
            {title}
          </motion.h1>

          {/* Animated Subtitle */}
          <motion.p
            className="mt-6 max-w-2xl text-lg leading-8 md:text-xl"
            variants={itemVariants}
          >
            {subtitle}
          </motion.p>

          {/* Animated Button Group */}
          <motion.div className="mt-10 flex items-center gap-x-6" variants={itemVariants}>
            <Button asChild size="lg">
              <a href={primaryButtonHref}>{primaryButtonText}</a>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href={secondaryButtonHref}>{secondaryButtonText}</a>
            </Button>
          </motion.div>
        </motion.div>
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export { HeroSection };