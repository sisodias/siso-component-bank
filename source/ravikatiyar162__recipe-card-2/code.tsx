// components/ui/recipe-card.tsx
import * as React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Your utility for merging Tailwind classes

// Define the types for the component props for type-safety and clarity
interface NutritionFact {
  label: string;
  value: string;
}

interface RecipeCardProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  heading: string;
  imageSrc: string;
  nutrition: NutritionFact[];
  ingredients: string[];
}

// Framer Motion variants for animations
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const RecipeCard = React.forwardRef<HTMLDivElement, RecipeCardProps>(
  ({ className, title, heading, imageSrc, nutrition, ingredients, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "bg-card text-card-foreground rounded-xl shadow-lg overflow-hidden max-w-4xl w-full border",
          className
        )}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        {...props}
      >
        <div className="grid md:grid-cols-2">
          {/* Left Section: Image and Nutrition */}
          <div className="flex flex-col">
            <motion.div variants={itemVariants} className="p-8">
              <p className="text-sm text-muted-foreground">{title}</p>
              <h2 className="text-5xl font-bold tracking-tighter text-amber-500 uppercase mt-1">
                {heading}
              </h2>
            </motion.div>
            <motion.div variants={itemVariants} className="px-8 pb-1 mt-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
                {nutrition.map((fact) => (
                  <div key={fact.label}>
                    <p className="text-4xl font-bold">{fact.value}</p>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider">
                      {fact.label}
                    </p>
                  </div>
                ))}
              </div>
            </motion.div>
            <motion.div variants={itemVariants} className="relative w-full h-48 md:h-full mt-4">
              <img
                src={imageSrc}
                alt={heading}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Right Section: Ingredients */}
          <div className="bg-muted/30 p-8">
            <motion.h3
              variants={itemVariants}
              className="text-xs font-semibold text-muted-foreground tracking-widest uppercase mb-6"
            >
              Ingredients
            </motion.h3>
            <motion.ul
              variants={itemVariants}
              className="space-y-4"
            >
              {ingredients.map((item, index) => {
                const [quantity, ...rest] = item.split(/ (.*)/s);
                const ingredient = rest[0];
                return (
                  <li key={index} className="flex items-start text-sm">
                    <span className="font-medium w-24 text-muted-foreground">{quantity}</span>
                    <span className="flex-1 font-semibold">{ingredient}</span>
                  </li>
                );
              })}
            </motion.ul>
          </div>
        </div>
      </motion.div>
    );
  }
);

RecipeCard.displayName = "RecipeCard";

export { RecipeCard };