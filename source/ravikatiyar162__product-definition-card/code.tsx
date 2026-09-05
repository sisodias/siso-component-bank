import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a `cn` utility from shadcn

// Props interface for type-safety and reusability
interface ProductDefinitionCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  cardHeaderIcon: React.ReactNode;
  cardHeaderText: string;
  cardTitle: string;
  cardDescription: string;
  buttonText: string;
  onButtonClick?: () => void;
  className?: string;
}

// Animation variants for a staggered fade-in effect
const FADE_UP_ANIMATION_VARIANTS = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { type: "spring" } },
};

export const ProductDefinitionCard = ({
  icon,
  title,
  description,
  cardHeaderIcon,
  cardHeaderText,
  cardTitle,
  cardDescription,
  buttonText,
  onButtonClick,
  className,
}: ProductDefinitionCardProps) => {
  return (
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={{
        hidden: {},
        show: {
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
      className={cn(
        "flex flex-col items-center justify-center text-center p-4",
        className
      )}
    >
      {/* Main Icon with Gradient */}
      <motion.div
        variants={FADE_UP_ANIMATION_VARIANTS}
        className="flex items-center justify-center w-16 h-16 mb-6 rounded-2xl bg-gradient-to-br from-orange-400 to-rose-500 text-white shadow-lg"
      >
        {icon}
      </motion.div>

      {/* Main Title */}
      <motion.h1
        variants={FADE_UP_ANIMATION_VARIANTS}
        className="text-3xl md:text-4xl font-bold tracking-tight text-foreground"
      >
        {title}
      </motion.h1>

      {/* Main Description */}
      <motion.p
        variants={FADE_UP_ANIMATION_VARIANTS}
        className="mt-2 max-w-md text-muted-foreground"
      >
        {description}
      </motion.p>

      {/* Content Card */}
      <motion.div
        variants={FADE_UP_ANIMATION_VARIANTS}
        className="relative mt-8 w-full max-w-md overflow-hidden rounded-2xl border bg-card p-6 text-left shadow-sm"
      >
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          {cardHeaderIcon}
          <span>{cardHeaderText}</span>
        </div>
        <h2 className="mt-4 text-xl font-semibold text-card-foreground">
          {cardTitle}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{cardDescription}</p>
      </motion.div>

      {/* Action Button */}
      <motion.button
        variants={FADE_UP_ANIMATION_VARIANTS}
        onClick={onButtonClick}
        className="mt-8 inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-medium text-white transition-all duration-300 bg-gradient-to-br from-orange-400 to-rose-500 hover:scale-105 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
      >
        {buttonText}
      </motion.button>
    </motion.div>
  );
};