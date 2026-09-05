// 1. IMPORT LIBRARIES
import * as React from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// 2. IMPORT UTILITIES
import { cn } from "../_utils/cn"; // Your utility for merging Tailwind classes

// 3. DEFINE COMPONENT PROP TYPES
interface ChallengeCardProps {
  /** The main title of the challenge */
  title: string;
  /** A brief description of the challenge */
  description: string;
  /** Text to display on the action button */
  buttonText: string;
  /** Custom class name for overriding or extending styles */
  className?: string;
  /** Background color using tailwind classes */
  backgroundColor?: string;
}

// 4. DEFINE HOVER ANIMATION VARIANTS
const cardVariants = {
  initial: {
    scale: 1,
    boxShadow: "0px 10px 20px -5px hsl(var(--card) / 0.1)",
  },
  hover: {
    scale: 1.03,
    boxShadow: "0px 15px 30px -5px hsl(var(--card) / 0.2)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

const arrowVariants = {
  initial: { x: 0 },
  hover: { x: 4, transition: { type: "spring", stiffness: 400, damping: 15 } },
};

// 5. CREATE THE COMPONENT
const ChallengeCard = React.forwardRef<HTMLDivElement, ChallengeCardProps>(
  (
    {
      title,
      description,
      buttonText,
      className,
      backgroundColor = "bg-green-500", // Default background color
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "group relative flex w-full max-w-sm flex-col justify-between overflow-hidden rounded-2xl p-8 text-white",
          backgroundColor,
          className
        )}
        variants={cardVariants}
        initial="initial"
        whileHover="hover"
        aria-label={`${title}: ${description}`}
      >
        {/* Card Content */}
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
          <p className="max-w-xs text-base font-medium opacity-80">{description}</p>
        </div>

        {/* Action Button */}
        <button
          className="group mt-8 flex w-full items-center justify-between rounded-full bg-white pl-6 pr-2 py-2 text-sm font-semibold text-zinc-900 transition-colors hover:bg-zinc-200"
          aria-label={buttonText}
        >
          <span>{buttonText}</span>
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-zinc-900">
            <motion.div variants={arrowVariants}>
              <ArrowRight className="h-4 w-4 text-white" />
            </motion.div>
          </div>
        </button>
      </motion.div>
    );
  }
);

ChallengeCard.displayName = "ChallengeCard";

export { ChallengeCard };