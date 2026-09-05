/*
 * components/ui/component.tsx
 *
 * This is the reusable TravelHeroSlider component.
 * It uses framer-motion for animations and is styled with
 * Tailwind CSS and shadcn/ui theme variables.
 */
"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";

/**
 * Defines the data structure for a single slide in the hero slider.
 */
export interface HeroSlide {
  id: string;
  location: string;
  title: string;
  description: string;
  href: string;
  imageUrl: string;
  thumbnail: {
    title: string;
    subtitle: string;
    imageUrl: string;
  };
}

/**
 * Props for the TravelHeroSlider component.
 */
export interface TravelHeroSliderProps {
  /**
   * An array of slide items to display.
   */
  items: HeroSlide[];
  /**
   * Optional class name to apply to the root element.
   */
  className?: string;
}

/**
 * A full-page, animated hero slider component.
 */
export const TravelHeroSlider = ({
  items,
  className,
}: TravelHeroSliderProps) => {
  const [currentIndex, setCurrentIndex] = React.useState(0);
  const [direction, setDirection] = React.useState<"next" | "prev">("next");

  // Get the active item
  const activeItem = items[currentIndex];

  // --- Handlers ---

  const handleNext = () => {
    setDirection("next");
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const handlePrev = () => {
    setDirection("prev");
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const handleThumbnailClick = (index: number) => {
    setDirection(index > currentIndex ? "next" : "prev");
    setCurrentIndex(index);
  };

  // --- Thumbnail Calculation ---

  // Get the 4 thumbnails to display.
  // It will be the next 4 items, looping around.
  const visibleThumbnails = React.useMemo(() => {
    return Array.from({ length: 4 }).map((_, i) => {
      const index = (currentIndex + i + 1) % items.length;
      return {
        ...items[index],
        originalIndex: index, // Keep track of original index for click handler
      };
    });
  }, [currentIndex, items]);

  // --- Animation Variants ---

  const bgVariants = {
    initial: (direction: string) => ({
      opacity: 0,
      scale: 1.05,
      x: direction === "next" ? "10%" : "-10%",
    }),
    animate: {
      opacity: 1,
      scale: 1,
      x: "0%",
      transition: { duration: 1, ease: [0.4, 0, 0.2, 1] },
    },
    exit: (direction: string) => ({
      opacity: 0,
      scale: 0.95,
      x: direction === "next" ? "-10%" : "10%",
      transition: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  const textVariants = {
    initial: (direction: string) => ({
      opacity: 0,
      x: direction === "next" ? 100 : -100,
    }),
    animate: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, delay: 0.3, ease: [0.4, 0, 0.2, 1] },
    },
    exit: (direction: string) => ({
      opacity: 0,
      x: direction === "next" ? -100 : 100,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    }),
  };

  const thumbVariants = {
    initial: { opacity: 0, x: 50 },
    animate: (i: number) => ({
      opacity: 0.6,
      x: 0,
      transition: { duration: 0.5, delay: 0.1 * i, ease: "easeInOut" },
    }),
    exit: {
      opacity: 0,
      x: -50,
      transition: { duration: 0.3, ease: "easeInOut" },
    },
    hover: {
      opacity: 1,
      transform: "translateY(-4px)",
      transition: { duration: 0.3 },
    },
  };

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Travel Destinations"
      className={cn(
        "relative w-screen h-[100vh] min-h-[700px] overflow-hidden bg-background text-primary-foreground",
        className
      )}
    >
      {/* Background Image */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={activeItem.id}
          custom={direction}
          variants={bgVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${activeItem.imageUrl})` }}
          aria-hidden="true"
        />
      </AnimatePresence>

      {/* Dark Overlay */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/40 to-transparent"
        aria-hidden="true"
      />

      {/* Placeholder Top Nav (as seen in image) */}
      <header className="absolute top-0 left-0 right-0 z-20 flex justify-between items-center p-8 md:p-12 text-sm">
        <div className="font-bold tracking-wider">GLOBE EXPRESS</div>
        <nav className="hidden md:flex gap-6 items-center uppercase tracking-widest">
          <a>Home</a>
          <a>Holidays</a>
          <a>Destinations</a>
        </nav>
        <div className="flex gap-4 items-center">
          {/* Placeholder icons */}
          <span>Search</span>
          <span>User</span>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="relative z-10 h-full flex flex-col md:flex-row items-center p-8 md:p-12">
        {/* Left: Text Content */}
        <div
          className="w-full max-w-lg md:max-w-xl pt-32 md:pt-0"
          aria-live="polite"
          aria-atomic="true"
        >
          <AnimatePresence initial={false} custom={direction}>
            <motion.div
              key={activeItem.id}
              custom={direction}
              variants={textVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <p className="text-sm uppercase tracking-[0.3em] text-primary-foreground/80">
                {activeItem.location}
              </p>
              <h2 className="text-6xl lg:text-8xl font-bold uppercase my-6 leading-none">
                {activeItem.title}
              </h2>
              <p className="text-base text-primary-foreground/70 max-w-sm mb-10">
                {activeItem.description}
              </p>
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-semibold px-6 py-3"
                asChild
              >
                <a href={activeItem.href}>
                  Discover Location
                  <ArrowRight className="w-4 h-4 ml-2" />
                </a>
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right: Thumbnails */}
        <div className="flex-1 flex justify-center md:justify-end items-center w-full md:w-auto mt-16 md:mt-0">
          <div className="flex gap-3 items-center">
            <div className="flex flex-row md:flex-col gap-3">
              <AnimatePresence initial={false}>
                {visibleThumbnails.map((item, i) => (
                  <motion.button
                    key={item.id}
                    custom={i}
                    variants={thumbVariants}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    whileHover="hover"
                    onClick={() => handleThumbnailClick(item.originalIndex)}
                    className="relative w-28 h-40 md:w-40 md:h-60 rounded-xl overflow-hidden shrink-0 cursor-pointer shadow-lg outline-none focus-visible:ring-2 focus-visible:ring-primary"
                    aria-label={`Go to slide ${item.originalIndex + 1}: ${
                      item.thumbnail.title
                    }`}
                  >
                    <img
                      src={item.thumbnail.imageUrl}
                      alt={item.thumbnail.title}
                      className="absolute inset-0 w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    <div className="absolute bottom-0 left-0 p-3 md:p-4 text-left">
                      <h3 className="text-sm md:text-base font-semibold">
                        {item.thumbnail.title}
                      </h3>
                      <p className="text-xs md:text-sm text-white/70">
                        {item.thumbnail.subtitle}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            {/* Counter (Vertical on Desktop) */}
            <div className="hidden md:block text-4xl font-bold ml-4">
              {String(currentIndex + 1).padStart(2, "0")}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Controls */}
      <div className="absolute bottom-0 left-0 right-0 z-20 flex justify-between items-center p-8 md:p-12">
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrev}
            className="rounded-full bg-black/20 border-white/30 text-white hover:bg-white/10"
            aria-label="Previous slide"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNext}
            className="rounded-full bg-black/20 border-white/30 text-white hover:bg-white/10"
            aria-label="Next slide"
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>
        {/* Counter (Horizontal on Mobile) */}
        <div className="block md:hidden text-4xl font-bold">
          {String(currentIndex + 1).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
};