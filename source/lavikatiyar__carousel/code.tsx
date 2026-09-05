import * as React from "react";
import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// Prop Definitions (unchanged)
export interface Fact {
  title: string;
  description: string;
  cta: {
    label: string;
    onClick: () => void;
  };
}

export interface FactCarouselProps {
  facts: Fact[];
  autoplayInterval?: number;
  className?: string;
}

// Animation Variants (unchanged)
const variants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 50 : -50,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    zIndex: 0,
    x: direction < 0 ? 50 : -50,
    opacity: 0,
  }),
};

// Component
export const FactCarousel = React.forwardRef<HTMLDivElement, FactCarouselProps>(
  ({ facts, autoplayInterval = 7000, className }, ref) => {
    if (!facts || facts.length === 0) {
      return null;
    }
    
    // FIX: Corrected the state destructuring.
    // 'page' is now the state array itself, like [index, direction].
    const [page, setPage] = useState([0, 0]);

    // FIX: Get index and direction from the 'page' state array.
    const factIndex = page[0];
    const direction = page[1];
    const currentFact = facts[factIndex];

    const paginate = useCallback((newDirection: number) => {
      setPage(prevPage => {
        const newPage = (prevPage[0] + newDirection + facts.length) % facts.length;
        return [newPage, newDirection];
      });
    }, [facts.length]);

    useEffect(() => {
      if (autoplayInterval > 0) {
        const interval = setInterval(() => {
          paginate(1);
        }, autoplayInterval);
        return () => clearInterval(interval);
      }
    }, [autoplayInterval, paginate]);

    return (
      <div
        ref={ref}
        className={cn(
          "relative w-full max-w-2xl mx-auto h-72 md:h-64 rounded-xl p-8 overflow-hidden",
          "flex flex-col items-center justify-center text-center",
          "border border-border/50 bg-card",
          "shadow-lg shadow-black/5",
          className
        )}
        role="region"
        aria-roledescription="carousel"
        aria-label="Key Facts Carousel"
      >
        {/* Background and Nav Buttons (unchanged) */}
        <div className="absolute inset-0 z-0 opacity-20 dark:opacity-30">
            <div className="absolute inset-0 [mask-image:radial-gradient(100%_100%_at_50%_20%,white,transparent)] bg-gradient-to-t from-purple-500/50 via-blue-500/50 to-transparent"></div>
            <div className="absolute w-[200%] h-[200%] left-[-50%] top-[-50%] [mask-image:radial-gradient(white,transparent)] animate-[spin_8s_linear_infinite] bg-[conic-gradient(from_0deg,transparent,theme(colors.blue.300),transparent_30%,theme(colors.purple.300),transparent_70%,theme(colors.indigo.300),transparent)]"></div>
        </div>
        <Button
          variant="outline"
          size="icon"
          className="absolute z-10 left-2 md:-left-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm"
          onClick={() => paginate(-1)}
          aria-label="Previous fact"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="absolute z-10 right-2 md:-right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm"
          onClick={() => paginate(1)}
          aria-label="Next fact"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col items-center justify-between h-full w-full">
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              // FIX: The key should be the factIndex
              key={factIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="absolute top-0 flex flex-col items-center text-center w-full pt-4"
              role="group"
              aria-roledescription="slide"
              aria-label={`Fact ${factIndex + 1} of ${facts.length}`}
            >
              {/* No longer need optional chaining here as currentFact is guaranteed to be valid */}
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {currentFact.title}
              </h3>
              <p className="text-lg md:text-xl text-foreground font-medium leading-snug">
                {currentFact.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Pagination and CTA */}
          <div className="w-full mt-auto flex flex-col items-center gap-4">
            <div className="flex space-x-2">
              {facts.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage([i, i > factIndex ? 1 : -1])}
                  className={cn(
                    "h-2 w-2 rounded-full transition-all duration-300",
                    i === factIndex ? "w-4 bg-primary" : "bg-muted-foreground/50 hover:bg-muted-foreground"
                  )}
                  aria-label={`Go to fact ${i + 1}`}
                />
              ))}
            </div>
            <Button onClick={currentFact.cta.onClick} className="font-semibold" size="sm">
              {currentFact.cta.label}
            </Button>
          </div>
        </div>
      </div>
    );
  }
);

FactCarousel.displayName = "FactCarousel";