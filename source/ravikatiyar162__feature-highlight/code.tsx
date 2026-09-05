import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "@/lib/utils"; // Assuming you have a utility for class names

// Props definition for the FeatureHighlight component
interface FeatureHighlightProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The main icon displayed at the top. Can be any React node.
   */
  icon?: React.ReactNode;
  /**
   * The main title text.
   */
  title: string;
  /**
   * An array of React nodes, where each node represents a line in the feature list.
   * This allows for mixed content like text and images on the same line.
   */
  features: React.ReactNode[];
  /**
   * An optional footer element.
   */
  footer?: React.ReactNode;
}

// Animation variants for the main container
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Time delay between each child animation
    },
  },
};

// Animation variants for each child element (icon, title, features, footer)
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15,
    },
  },
};

const FeatureHighlight = React.forwardRef<
  HTMLDivElement,
  FeatureHighlightProps
>(({ className, icon, title, features, footer, ...props }, ref) => {
  return (
    <motion.div
      ref={ref}
      className={cn(
        "flex max-w-lg flex-col items-start space-y-4 p-8 text-left",
        className
      )}
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      {...props}
    >
      {/* Animated Icon */}
      {icon && <motion.div variants={itemVariants}>{icon}</motion.div>}

      {/* Animated Title */}
      <motion.h2
        variants={itemVariants}
        className="text-4xl font-bold tracking-tight text-foreground"
      >
        {title}
      </motion.h2>

      {/* Animated Feature List */}
      <div className="flex flex-col space-y-2">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            variants={itemVariants}
            className="text-2xl text-muted-foreground"
          >
            {feature}
          </motion.div>
        ))}
      </div>
      
      {/* Animated Footer */}
      {footer && <motion.div variants={itemVariants}>{footer}</motion.div>}
    </motion.div>
  );
});

FeatureHighlight.displayName = "FeatureHighlight";

export { FeatureHighlight };