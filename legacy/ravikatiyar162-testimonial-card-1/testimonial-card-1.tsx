"use client";

import * as React from "react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, CheckCircle2, ChevronLeft, ChevronRight, Pilcrow } from "lucide-react";

import { cn } from "../_utils/cn";
import { Button } from "./button";

// Define the types for the component props for type safety and clarity
interface Testimonial {
  name: string;
  rating: number;
  quote: string;
}

interface TestimonialCardProps extends React.HTMLAttributes<HTMLDivElement> {
  logo?: React.ReactNode;
  companyName?: string;
  overallRating: number;
  totalRatingsText: string;
  title: string;
  features: string[];
  testimonials: Testimonial[];
}

// A small helper component for rendering stars
const StarRating = ({ rating, className }: { rating: number; className?: string }) => (
  <div className={cn("flex items-center gap-0.5", className)}>
    {[...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={cn(
          "h-5 w-5",
          i < Math.round(rating) ? "text-yellow-400 fill-yellow-400" : "text-muted-foreground/50"
        )}
      />
    ))}
  </div>
);

const TestimonialCard = React.forwardRef<HTMLDivElement, TestimonialCardProps>(
  (
    {
      className,
      logo,
      companyName = "Trustpilot",
      overallRating,
      totalRatingsText,
      title,
      features,
      testimonials,
      ...props
    },
    ref
  ) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length);
    };

    const handlePrev = () => {
      setCurrentIndex((prevIndex) => (prevIndex - 1 + testimonials.length) % testimonials.length);
    };

    const currentTestimonial = testimonials[currentIndex];

    return (
      <div
        ref={ref}
        className={cn(
          "w-full max-w-md rounded-xl border bg-card text-card-foreground shadow-lg p-6 sm:p-8 space-y-6",
          className
        )}
        {...props}
      >
        {/* Header Section */}
        <div className="flex items-center gap-3">
          {logo}
          <span className="text-xl font-bold">{companyName}</span>
        </div>

        {/* Overall Rating Section */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
             {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-7 w-7 text-green-500 fill-green-500" />
            ))}
          </div>
          <p className="text-muted-foreground text-sm">{totalRatingsText}</p>
        </div>

        {/* Features Section */}
        <div className="space-y-3">
          <h3 className="text-lg font-semibold">{title}</h3>
          <ul className="space-y-2 text-muted-foreground">
            {features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-500" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </div>
        
        {/* Testimonial Slider Section */}
        <div className="rounded-lg bg-muted p-4 space-y-4 relative overflow-hidden">
           <AnimatePresence mode="wait">
             <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="space-y-3"
             >
                <StarRating rating={currentTestimonial.rating} />
                <p className="font-semibold text-card-foreground">{currentTestimonial.name}</p>
                <blockquote className="text-sm text-muted-foreground italic leading-relaxed">
                    "{currentTestimonial.quote}"
                </blockquote>
             </motion.div>
           </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-2 pt-2">
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={handlePrev} aria-label="Previous testimonial">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8 rounded-full" onClick={handleNext} aria-label="Next testimonial">
                <ChevronRight className="h-4 w-4" />
              </Button>
          </div>
        </div>
      </div>
    );
  }
);
TestimonialCard.displayName = "TestimonialCard";

export { TestimonialCard };