// components/ui/branding-card.tsx
import * as React from "react";
import { motion, Variants } from "framer-motion";
import { cn } from "../_utils/cn"; // Assuming you have a `cn` utility from shadcn

// JSDoc for props documentation
export interface BrandingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** The main category label displayed at the top. */
  category: string;
  /** The primary title for the branding element. */
  title: string;
  /** The subtitle or specific name (e.g., font name). */
  subtitle: string;
  /** The visual element to display, typically text or an icon. */
  displayElement: React.ReactNode;
  /** An array of color strings (e.g., hex, rgb) for the palette. */
  colors: string[];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
};

const swatchVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

const BrandingCard = React.forwardRef<HTMLDivElement, BrandingCardProps>(
  ({ className, category, title, subtitle, displayElement, colors, ...props }, ref) => {
    return (
      <motion.div
        ref={ref}
        className={cn(
          "w-full max-w-sm overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-shadow duration-300 hover:shadow-lg",
          className
        )}
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover={{ y: -5, transition: { duration: 0.2 } }}
        aria-label={`${category}: ${title}`}
        role="group"
        {...props}
      >
        {/* Main content area */}
        <div className="p-6">
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-muted-foreground">
            {category}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold tracking-tight">{title}</h3>
              <p className="text-lg text-muted-foreground">{subtitle}</p>
            </div>
            <div className="text-5xl font-bold tracking-tighter">{displayElement}</div>
          </div>
        </div>

        {/* Color palette section */}
        <div className="flex h-24 w-full">
          {colors.map((color, index) => (
            <motion.div
              key={index}
              className="h-full flex-1"
              style={{ backgroundColor: color }}
              variants={swatchVariants}
              aria-label={`Color swatch ${index + 1}: ${color}`}
            />
          ))}
        </div>
      </motion.div>
    );
  }
);

BrandingCard.displayName = "BrandingCard";

export { BrandingCard };