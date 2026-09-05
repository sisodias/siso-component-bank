import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "./button"; // Assuming shadcn button is in this path

// Define the props for the component
interface FormBuilderHeroProps {
  /** The source URL for the main illustration. */
  illustrationSrc: string;
  /** The alt text for the illustration. */
  illustrationAlt?: string;
  /** The main heading text. */
  title: React.ReactNode;
  /** The descriptive paragraph below the title. */
  description: string;
  /** The text to display on the call-to-action button. */
  buttonText: string;
  /** The URL the button should link to. */
  buttonHref?: string;
}

/**
 * A responsive hero section component with animations.
 */
export const FormBuilderHero: React.FC<FormBuilderHeroProps> = ({
  illustrationSrc,
  illustrationAlt = "Hero Illustration",
  title,
  description,
  buttonText,
  buttonHref = "#",
}) => {
  // Animation variants for staggering children
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  // Animation variant for individual elements
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="flex w-full items-center justify-center bg-background px-4 py-20 md:py-32">
      <motion.div
        className="mx-auto flex max-w-2xl flex-col items-center text-center"
        initial="hidden"
        animate="show"
        variants={containerVariants}
      >
        {/* Illustration */}
        <motion.div variants={itemVariants} className="mb-8">
          <img
            src={illustrationSrc}
            alt={illustrationAlt}
            className="h-auto w-64 select-none"
          />
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="mb-4 text-4xl font-bold tracking-tight text-foreground md:text-5xl"
        >
          {title}
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mb-8 max-w-lg text-base text-muted-foreground md:text-lg"
        >
          {description}
        </motion.p>

        {/* Call to Action Button */}
        <motion.div variants={itemVariants}>
          <Button asChild size="lg">
            <a href={buttonHref}>
              {buttonText}
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};