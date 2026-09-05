import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Your utility for combining class names

// Define the types for the component props
interface NutritionFact {
  value: string | number;
  label: string;
}

interface RecipeCardProps {
  recipeTitle?: string;
  nutritionTitle?: string;
  steps: string[];
  nutrition: NutritionFact[];
  className?: string;
}

// Animation variants for the container and its items
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12,
    },
  },
};

/**
 * A responsive card component to display recipe steps and nutrition facts.
 * It features entry animations and is styled using shadcn/ui theme variables.
 */
export const RecipeCard = React.forwardRef<HTMLDivElement, RecipeCardProps>(
  (
    {
      recipeTitle = "Recipe",
      nutritionTitle = "Nutrition",
      steps,
      nutrition,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-4xl mx-auto rounded-lg border bg-card text-card-foreground p-6 md:p-8",
          className
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Recipe Section */}
          <div className="md:col-span-2">
            <motion.h2
              className="text-2xl font-bold tracking-tight mb-6"
              variants={itemVariants}
            >
              {recipeTitle}
            </motion.h2>
            <ol className="space-y-4">
              {steps.map((step, index) => (
                <motion.li key={index} className="flex items-start gap-4" variants={itemVariants}>
                  <span className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-muted text-muted-foreground text-sm font-semibold">
                    {index + 1}
                  </span>
                  <p className="text-muted-foreground flex-1 pt-0.5">{step}</p>
                </motion.li>
              ))}
            </ol>
          </div>

          {/* Nutrition Section */}
          <div>
            <motion.h2
              className="text-2xl font-bold tracking-tight mb-6"
              variants={itemVariants}
            >
              {nutritionTitle}
            </motion.h2>
            <div className="grid grid-cols-2 gap-3">
              {nutrition.map((fact) => (
                <motion.div
                  key={fact.label}
                  className="flex flex-col items-center justify-center rounded-md bg-muted p-4 text-center"
                  variants={itemVariants}
                >
                  <p className="text-lg font-bold text-foreground">{fact.value}</p>
                  <p className="text-sm text-muted-foreground">{fact.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }
);

RecipeCard.displayName = "RecipeCard";