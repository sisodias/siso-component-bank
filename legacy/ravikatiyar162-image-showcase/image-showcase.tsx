// components/ui/photo-stack-card.tsx

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "../_utils/cn"; // Your shadcn utility for merging class names

// --- PROPS INTERFACE ---
interface PhotoStackCardProps extends React.HTMLAttributes<HTMLDivElement> {
  images: string[];
  category: string;
  title: string;
  subtitle: string;
  isActive?: boolean; // New prop to control the active state
}

// --- FRAMER MOTION VARIANTS ---
// For the image stack within the card
const imageContainerVariants = {
  initial: {},
  hover: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const imageVariants = {
  initial: { scale: 1, rotate: 0, y: 0 },
  hover: (i: number) => ({
    scale: 1.05,
    rotate: (i - 1) * 10,
    y: -20,
    boxShadow: "0px 10px 30px rgba(0, 0, 0, 0.2)",
    transition: { type: "spring", stiffness: 300, damping: 20 },
  }),
};

// For the card itself (click interaction)
const cardVariants = {
  inactive: {
    scale: 1,
    y: 0,
    zIndex: 0,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
  active: {
    scale: 1.05,
    y: -15,
    zIndex: 10,
    transition: { type: "spring", stiffness: 300, damping: 20 },
  },
};

export const PhotoStackCard = React.forwardRef<
  HTMLDivElement,
  PhotoStackCardProps
>(({ className, images, category, title, subtitle, isActive, ...props }, ref) => {
  const displayImages = images.slice(0, 3);

  return (
    <motion.div
      ref={ref}
      className={cn(
        "group relative flex h-72 w-72 cursor-pointer flex-col justify-start rounded-xl bg-card p-6 shadow-xl",
        "transition-colors duration-300 ease-in-out hover:bg-card/90",
        className
      )}
      variants={cardVariants}
      animate={isActive ? "active" : "inactive"}
      // The hover animation is now within a nested motion div to avoid conflicts
      {...props}
    >
      {/* Text Content */}
      <div className="z-10">
        <p className="text-xs font-semibold uppercase text-muted-foreground">
          {category}
        </p>
        <h2 className="mt-1 text-3xl font-bold text-card-foreground">
          {title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
      </div>

      {/* Image Stack */}
      <motion.div
        className="absolute bottom-0 right-0 h-48 w-full"
        variants={imageContainerVariants}
        initial="initial"
        whileHover="hover"
      >
        <AnimatePresence>
          {displayImages.map((src, i) => (
            <motion.img
              key={src}
              src={src}
              alt={`${title} memory image ${i + 1}`}
              custom={i}
              variants={imageVariants}
              className="absolute bottom-[-20px] right-6 h-40 w-auto origin-bottom-center rounded-lg border-4 border-background object-cover shadow-lg"
              style={{
                transform: `rotate(${(i - 1) * 4}deg)`,
              }}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
});
PhotoStackCard.displayName = "PhotoStackCard";