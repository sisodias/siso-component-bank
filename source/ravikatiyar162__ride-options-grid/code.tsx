import * as React from "react";
import { motion } from "framer-motion";

// Define the type for a single option card
type RideOption = {
  imageSrc: string;
  altText: string;
  eyebrow: string;
  title: string;
  description: string;
  icon?: React.ReactNode; // Optional icon to display next to the title
};

// Define the props for the main grid component
interface RideOptionsGridProps {
  /** The main title to display above the grid. */
  title: string;
  /** An array of option objects to render as cards. */
  options: RideOption[];
}

/**
 * A responsive grid component to display a set of feature/option cards.
 * It includes a staggered animation for the cards on load.
 */
export const RideOptionsGrid: React.FC<RideOptionsGridProps> = ({ title, options }) => {
  // Animation variants for the container to orchestrate staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  // Animation variants for each individual card
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    <section className="w-full bg-background py-12 md:py-20">
      <div className="container mx-auto px-4">
        {/* Main Title */}
        <h2 className="mb-10 max-w-2xl text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
          {title}
        </h2>

        {/* Grid of Option Cards */}
        <motion.div
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {options.map((option, index) => (
            <motion.div
              key={index}
              className="flex flex-col rounded-lg border bg-card p-6 pt-2 text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-md"
              variants={itemVariants}
            >
              {/* Card Image */}
              <img
                src={option.imageSrc}
                alt={option.altText}
                className="mb-1 h-32 w-auto self-start"
              />
              
              <div className="flex flex-col">
                 {/* Eyebrow Text */}
                <p className="mb-1 text-sm font-medium text-muted-foreground">
                  {option.eyebrow}
                </p>
                
                {/* Card Title with Optional Icon */}
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-semibold text-foreground">{option.title}</h3>
                  {option.icon && <span className="text-green-500">{option.icon}</span>}
                </div>

                {/* Card Description */}
                <p className="mt-2 text-base text-muted-foreground">
                  {option.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};