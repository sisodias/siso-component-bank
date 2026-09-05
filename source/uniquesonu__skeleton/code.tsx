import React from 'react';
import { motion } from 'framer-motion';
import { cn } from "@/lib/utils"; // Assumes shadcn's utility for class merging

// --- Internal Configuration (Tailwind Custom Utility for Shimmer) ---
// NOTE: For a true "shimmer" effect that moves across the skeleton, you would define
// a custom animation and gradient in your global CSS/Tailwind config (e.g., 'skeleton-shimmer').
// Here, we use a simpler, but common, "pulse" effect, which works out-of-the-box with Tailwind.

// --- 📦 API (Props) Definition ---
export interface SkeletonLoaderProps {
  /** The type of placeholder to render (e.g., text line, circle, square). */
  variant?: 'line' | 'circle' | 'square';
  /** The width of the skeleton. Use Tailwind utility classes (e.g., 'w-full', 'w-1/2', 'w-32'). */
  width?: string;
  /** The height of the skeleton. Use Tailwind utility classes (e.g., 'h-4', 'h-10'). */
  height?: string;
  /** Custom class name for the motion container. */
  className?: string;
}

/**
 * A professional, theme-aware skeleton loading component with a subtle pulse animation.
 * Used to improve perceived loading performance and reduce layout shift.
 */
const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({
  variant = 'line',
  width = 'w-full',
  height = 'h-4',
  className,
}) => {
  const baseClasses = "bg-muted animate-pulse rounded-md transition-opacity duration-300";
  let specificClasses = `${width} ${height}`;

  if (variant === 'circle') {
    specificClasses = `rounded-full ${height} ${height}`; // Ensure height/width are equal
  } else if (variant === 'square') {
    specificClasses = `${height} ${height}`;
  }

  // Framer motion is used here simply to allow this skeleton to be composable
  // with other animated elements or containers, but the main animation is pure Tailwind.
  return (
    <motion.div
      className={cn(baseClasses, specificClasses, className)}
      // Add optional Framer Motion config if you want a custom, complex shimmer effect
      // or entry fade-in for the skeleton itself.
      role="status"
      aria-busy="true"
      aria-live="polite"
    />
  );
};

// --- Example Component for Structured Loading ---

interface CardSkeletonProps {
  repeat?: number;
}

/**
 * An example composable component using SkeletonLoader to mock a data card list.
 */
const CardSkeleton: React.FC<CardSkeletonProps> = ({ repeat = 3 }) => {
  const cards = Array.from({ length: repeat });

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 p-4 md:p-6 bg-card border rounded-lg">
      {cards.map((_, index) => (
        <div key={index} className="space-y-4 p-4 border rounded-lg">
          {/* Header/Icon placeholder */}
          <div className="flex items-center space-x-3">
            <SkeletonLoader variant="circle" height="h-10" />
            <SkeletonLoader width="w-2/5" height="h-6" />
          </div>

          {/* Value placeholder */}
          <div className="mt-4">
            <SkeletonLoader width="w-1/4" height="h-8" className="mb-2" />
          </div>

          {/* Description text lines */}
          <SkeletonLoader width="w-full" height="h-3" />
          <SkeletonLoader width="w-3/4" height="h-3" />

          {/* Button placeholder */}
          <div className="pt-2">
            <SkeletonLoader width="w-full" height="h-9" />
          </div>
        </div>
      ))}
    </div>
  );
};



const ExampleUsage = () => {
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    // Simulate data fetch delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="p-8 bg-background">
      <h3 className="text-xl font-semibold text-foreground mb-4">Content Loader Demo</h3>
      
      {isLoading ? (
        <CardSkeleton repeat={4} />
      ) : (
        <div className="p-8 bg-primary/10 border border-primary/20 rounded-lg text-primary text-center font-medium">
          Data Loaded Successfully! (Content would appear here)
        </div>
      )}
    </div>
  );
};

export default ExampleUsage;