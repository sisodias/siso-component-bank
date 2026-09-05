"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Define the props for the component
interface AnimatedHeroProps {
  title: string;
  description: string;
  buttonText: string;
  imageUrl: string;
  imageAlt?: string;
  onButtonClick?: () => void;
  className?: string;
}

// Animation variants for the container to orchestrate children animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger the animation of children
      delayChildren: 0.1,
    },
  },
};

// Animation variants for individual child elements
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

export const AnimatedHero = ({
  title,
  description,
  buttonText,
  imageUrl,
  imageAlt = "Hero Image",
  onButtonClick,
  className,
}: AnimatedHeroProps) => {
  return (
    <motion.section
      className={cn("w-full py-12 md:py-24 lg:py-32", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      aria-label="Hero Section"
    >
      <div className="container px-4 md:px-6">
        <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 xl:gap-24">
          {/* Left Column: Text content and CTA */}
          <div className="flex flex-col justify-center space-y-4">
            <motion.h1
              className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none"
              variants={itemVariants}
            >
              {title}
            </motion.h1>
            <motion.p
              className="max-w-[600px] text-muted-foreground md:text-xl"
              variants={itemVariants}
            >
              {description}
            </motion.p>
            <motion.div variants={itemVariants} className="w-fit">
              <Button size="lg" onClick={onButtonClick}>
                {buttonText}
              </Button>
            </motion.div>
          </div>

          {/* Right Column: Image */}
          <motion.div
            className="flex items-center justify-center"
            variants={itemVariants}
          >
            <img
              src={imageUrl}
              alt={imageAlt}
              className="mx-auto aspect-video overflow-hidden rounded-xl object-contain sm:w-full"
            />
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};