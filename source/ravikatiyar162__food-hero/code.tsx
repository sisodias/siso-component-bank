import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Updated props interface, removing secondaryAction
interface ActionProps {
  text: string;
  onClick: () => void;
}

interface FoodHeroBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Source URL for the background image */
  backgroundImageSrc: string;
  /** Source URL for the logo image */
  logoSrc: string;
  /** The main title text */
  title: React.ReactNode;
  /** The main description text */
  description: string;
  /** Props for the primary call-to-action button */
  primaryAction: ActionProps;
}

/**
 * A responsive hero banner component for food delivery services.
 * It uses framer-motion for entry animations and is styled with shadcn/ui variables.
 */
const FoodHeroBanner = React.forwardRef<HTMLDivElement, FoodHeroBannerProps>(
  (
    {
      className,
      backgroundImageSrc,
      logoSrc,
      title,
      description,
      primaryAction,
      ...props
    },
    ref
  ) => {
    // Animation variants for Framer Motion
    const containerVariants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: 0.2,
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
      <section
        ref={ref}
        className={cn(
          "relative flex h-[80vh] min-h-[600px] w-full items-center justify-center overflow-hidden rounded-lg",
          className
        )}
        {...props}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImageSrc})` }}
        />

        {/* Solid Color Overlay (Replaced Gradient) */}
        <div className="absolute inset-0 z-0 bg-emerald-80/80" />

        {/* Content Container */}
        <motion.div
          className="relative z-10 grid h-full w-full max-w-7xl grid-cols-1 items-center px-4 md:grid-cols-2 md:px-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Left Side: Text Content */}
          <div className="flex flex-col items-start text-left text-white">
            <motion.img
              src={logoSrc}
              alt="Bistro Logo"
              className="mb-8 h-16"
              variants={itemVariants}
            />
            <motion.h1
              className="mb-4 text-5xl font-extrabold tracking-tight md:text-7xl"
              variants={itemVariants}
            >
              {title}
            </motion.h1>
            <motion.p
              className="mb-8 max-w-md text-lg text-gray-200"
              variants={itemVariants}
            >
              {description}
            </motion.p>
            <motion.div variants={itemVariants}>
              <Button
                size="lg"
                onClick={primaryAction.onClick}
                className="bg-white font-bold text-emerald-800 shadow-lg transition-transform hover:bg-gray-100 hover:scale-105"
                aria-label={primaryAction.text}
              >
                {primaryAction.text}
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </section>
    );
  }
);
FoodHeroBanner.displayName = "FoodHeroBanner";

export { FoodHeroBanner };