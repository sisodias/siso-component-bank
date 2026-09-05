import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn

// --- PROPS INTERFACE ---
interface StarshipCardProps {
  logoSrc: string;
  imageSrc: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  className?: string;
}

// --- FADE-IN ANIMATION VARIANTS ---
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger the animation of children
      delayChildren: 0.3,
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

/**
 * A responsive, theme-adaptive, and animated card component 
 * inspired by the provided UI.
 */
export const StarshipCard = React.forwardRef<HTMLDivElement, StarshipCardProps>(
  ({ logoSrc, imageSrc, title, description, buttonText, buttonLink, className }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "relative flex aspect-[16/9] w-full max-w-4xl flex-col justify-between overflow-hidden rounded-2xl p-6 md:p-8 lg:p-10",
          "border border-border/20 shadow-lg", // Subtle border and shadow
          className
        )}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.5 }}
        variants={containerVariants}
      >
        {/* Background Image with Parallax Hover Effect */}
        <motion.img
          src={imageSrc}
          alt="Background Image"
          className="absolute inset-0 h-full w-full object-cover"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        />
        
        {/* Gradient Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

        {/* Content Container */}
        <div className="relative z-10 flex h-full flex-col justify-between">
          
          {/* Top Logo */}
          <motion.img
            src={logoSrc}
            alt="Company Logo"
            className="h-6 w-32 md:h-8"
            variants={itemVariants}
          />
          
          {/* Bottom Text and Button */}
          <div className="text-left">
            <motion.h2
              className="text-3xl font-bold text-primary-foreground md:text-4xl lg:text-5xl"
              variants={itemVariants}
            >
              {title}
            </motion.h2>
            <motion.p
              className="mt-2 max-w-lg text-base text-muted-foreground md:text-lg"
              variants={itemVariants}
            >
              {description}
            </motion.p>
            <motion.a
              href={buttonLink}
              className={cn(
                "group mt-6 inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium",
                "bg-secondary/20 text-secondary-foreground backdrop-blur-sm",
                "transition-all duration-300 hover:bg-secondary/40 hover:shadow-xl"
              )}
              variants={itemVariants}
            >
              {buttonText}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    );
  }
);

StarshipCard.displayName = "StarshipCard";