import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  image: string;
}

interface AnimatedTestimonialsProps {
  testimonials: Testimonial[];
}

export const AnimatedTestimonials: React.FC<AnimatedTestimonialsProps> = ({
  testimonials,
}) => {
  const [index, setIndex] = useState(0);

  const next = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prev = () =>
    setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  const testimonial = testimonials[index];

  return (
    <section className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 transition-colors duration-500 px-4 sm:px-8 md:px-12 py-16">
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 text-center">
        What Our Clients SaY
      </h2>

      <div className="relative flex flex-col md:flex-row items-center gap-10 md:gap-16 max-w-6xl w-full mx-auto">
        {/* IMAGE */}
        <div className="relative w-56 h-56 sm:w-64 sm:h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.img
              key={index}
              src={testimonial.image}
              alt={testimonial.name}
              initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              exit={{ opacity: 0, scale: 0.8, rotateY: -45 }}
              transition={{ duration: 0.6, type: "spring" }}
              className="absolute w-full h-full object-cover rounded-md shadow-lg"
            />
          </AnimatePresence>
        </div>

        {/* TEXT */}
        <AnimatePresence mode="wait">
          <motion.div
            key={testimonial.name}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            transition={{ duration: 0.5 }}
            className="flex-1 text-center md:text-left px-2 sm:px-4"
          >
            <h3 className="text-xl sm:text-2xl font-semibold text-neutral-900 dark:text-neutral-100">
              {testimonial.name}
            </h3>
            <p className="text-sm sm:text-base text-neutral-500 dark:text-neutral-400 mb-4">
              {testimonial.designation}
            </p>
            <p className="text-base sm:text-lg text-neutral-700 dark:text-neutral-300 leading-relaxed">
              {testimonial.quote}
            </p>
          </motion.div>
        </AnimatePresence>

        {/* CONTROLS */}
        <div className="absolute -bottom-10 sm:-bottom-12 left-1/2 -translate-x-1/2 flex gap-3 sm:gap-4">
          <button
            onClick={prev}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:scale-105 active:scale-95 transition"
            aria-label="Previous"
          >
            {/* Left Arrow SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>

          <button
            onClick={next}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:scale-105 active:scale-95 transition"
            aria-label="Next"
          >
            {/* Right Arrow SVG */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};

// --- DEMO USAGE ---
export const Component: React.FC = () => {
  const testimonials: Testimonial[] = [
    {
      quote:
        "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      image:
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
    },
    {
      quote:
        "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      image:
        "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote:
        "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      image:
        "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop",
    },
  ];

  return <AnimatedTestimonials testimonials={testimonials} />;
};
