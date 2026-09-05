// components/ui/testimonial-slider.tsx

import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Quote } from 'lucide-react';
import { cn } from "../_utils/cn"; // Assumes shadcn/ui setup

// Defines the data structure for a single testimonial
export interface Testimonial {
  image: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
}

// Defines the props accepted by the TestimonialSlider component
interface TestimonialSliderProps {
  testimonials: Testimonial[];
  className?: string;
}

// A reusable StarRating component to display ratings visually
const StarRating = ({ rating, className }: { rating: number; className?: string }) => {
  return (
    <div className={cn("flex items-center gap-1", className)}>
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-4 w-4",
            i < rating ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50"
          )}
        />
      ))}
    </div>
  );
};

// The main TestimonialSlider component
export const TestimonialSlider = ({ testimonials, className }: TestimonialSliderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  // Memoized function to handle the "next" slide transition
  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
  }, [testimonials.length]);

  // Memoized function to handle the "previous" slide transition
  const handlePrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  const currentTestimonial = testimonials[currentIndex];

  // Animation variants for the slide transition using Framer Motion
  const slideVariants = {
    hidden: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    visible: {
      x: '0%',
      opacity: 1,
      transition: { type: 'spring', stiffness: 260, damping: 30 },
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
      transition: { type: 'spring', stiffness: 260, damping: 30 },
    }),
  };

  return (
    <div className={cn("relative w-full max-w-2xl mx-auto overflow-hidden", className)}>
      <div className="relative min-h-[350px] md:min-h-[280px] flex items-center justify-center">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute w-full h-full"
          >
            <div className="flex flex-col md:flex-row items-center justify-center w-full h-full p-4">
              {/* Image Section */}
              <div className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 mb-4 md:mb-0 md:mr-[-4rem] z-10">
                <img
                  src={currentTestimonial.image}
                  alt={currentTestimonial.name}
                  className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
              </div>

              {/* Text & Controls Section */}
              <div className="relative w-full bg-card text-card-foreground rounded-2xl shadow-xl pt-8 md:pt-4 pl-4 md:pl-24 pr-4 pb-4">
                 <Quote className="absolute top-4 left-4 h-8 w-8 text-primary/20" aria-hidden="true" />
                <blockquote className="text-sm md:text-base mb-4 leading-relaxed">
                  {currentTestimonial.quote}
                </blockquote>
                <StarRating rating={currentTestimonial.rating} className="mb-4" />
                <div className="flex items-center justify-between">
                  <div className="pr-12">
                    <p className="font-bold text-lg text-foreground">{currentTestimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{currentTestimonial.role}</p>
                  </div>
                  {/* Navigation Controls */}
                   <div className="flex items-center gap-2">
                    <button
                      onClick={handlePrevious}
                      className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-background/80 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      aria-label="Previous testimonial"
                    >
                      <ChevronLeft className="h-5 w-5" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="inline-flex items-center justify-center rounded-full h-10 w-10 bg-background/80 hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                      aria-label="Next testimonial"
                    >
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Dot Indicators */}
      <div className="flex justify-center gap-2 mt-4">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "h-2 w-2 rounded-full transition-all duration-300",
              currentIndex === index ? 'w-4 bg-primary' : 'bg-muted-foreground/50'
            )}
            aria-label={`Go to testimonial ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};