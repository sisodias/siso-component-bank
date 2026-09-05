import * as React from "react";
import { motion } from "framer-motion";
import { Clock, Users, Heart, ClipboardList } from "lucide-react";
import { cn } from "@/lib/utils"; // Assuming you have a utils file for clsx

// Define the props for the RecipeCard component for type safety and reusability
interface RecipeCardProps {
  title: string;
  description: string;
  ingredients: string[];
  imageUrl: string;
  cookTime: string;
  servings: number;
  calories: number;
  className?: string;
}

// Define animation variants for framer-motion
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 10,
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

const RecipeCard = React.forwardRef<HTMLDivElement, RecipeCardProps>(
  (
    {
      title,
      description,
      ingredients,
      imageUrl,
      cookTime,
      servings,
      calories,
      className,
    },
    ref
  ) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "bg-card text-card-foreground border rounded-xl overflow-hidden shadow-sm transition-shadow hover:shadow-md",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ scale: 1.02, transition: { type: "spring", stiffness: 300 } }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left Side: Content */}
          <div className="p-6 md:p-8 flex-1">
            <motion.h2 variants={itemVariants} className="text-2xl md:text-3xl font-bold tracking-tight">
              {title}
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-2 text-muted-foreground">
              {description}
            </motion.p>
            <motion.div variants={itemVariants} className="mt-4">
              <span className="font-semibold">Ingredients:</span>
              <span className="text-muted-foreground ml-2">{ingredients.join(", ")}</span>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={itemVariants}
              className="mt-6 pt-4 border-t flex flex-wrap gap-x-6 gap-y-4 text-sm"
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-semibold">{cookTime}</span>
                  <span className="text-muted-foreground -mt-1">Cook Time</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-muted-foreground" />
                <div className="flex flex-col">
                  <span className="font-semibold">{servings}</span>
                  <span className="text-muted-foreground -mt-1">Servings</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-muted-foreground" />
                 <div className="flex flex-col">
                    <span className="font-semibold">Recipe</span>
                    <span className="text-muted-foreground -mt-1">Details</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-muted-foreground" />
                 <div className="flex flex-col">
                    <span className="font-semibold">{calories} kCal</span>
                    <span className="text-muted-foreground -mt-1">Energy</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Image */}
          <motion.div variants={itemVariants} className="md:w-1/3 relative">
            <img
              src={imageUrl}
              alt={title}
              className="object-cover w-full h-64 md:h-full"
              aria-label={`Image of ${title}`}
            />
            {/* Subtle gradient overlay for better text-on-image scenarios if needed */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent md:bg-gradient-to-l"></div>
          </motion.div>
        </div>
      </motion.div>
    );
  }
);

RecipeCard.displayName = "RecipeCard";

export { RecipeCard };