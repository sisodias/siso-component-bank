import React, { useState } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Quote, Star, Moon, Sun, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';

/**
 * ============================================================================
 * TESTIMONIAL DATA STRUCTURE
 * ============================================================================
 * Each testimonial contains:
 * - text: The review content
 * - author: Name of the person giving the testimonial
 * - role: Their position/title
 * - image: URL to their profile photo
 * - rating: Numeric rating (typically 5.0)
 * - color: Tailwind gradient classes for unique card tinting
 */
const testimonials = [
  {
    text: "Working with Jin was transformative. The design elevated our brand and user experience to new heights. Their attention to detail is unmatched.",
    author: "Divya Verma",
    role: "CEO, GrowthLabs",
    image: "https://cdn.pixabay.com/photo/2022/05/24/06/23/indian-face-7217717_1280.jpg",
    rating: 5.0,
    color: "from-rose-500/20 to-yellow-500/20"
  },
  {
    text: "Jin's expertise in both UX and visual design made our project seamless. They delivered beyond expectations and on time every milestone.",
    author: "Alexa Rivera",
    role: "Director, PixelCraft",
    image: "https://cdn.pixabay.com/photo/2018/07/28/09/23/woman-3567600_1280.jpg",
    rating: 5.0,
    color: "from-pink-500/20 to-rose-500/20"
  },
  {
    text: "Exceptional designer with a strategic mindset. Jin helped us rethink our entire product experience from the ground up.",
    author: "Marcus Webb",
    role: "VP Product, Velocity",
    image: "https://cdn.pixabay.com/photo/2024/08/28/21/51/men-9005146_1280.jpg",
    rating: 5.0,
    color: "from-rose-500/20 to-green-500/20"
  },
  {
    text: "The level of creativity and technical skill Jin brings is remarkable. Our conversion rates increased by 200% after the redesign.",
    author: "Sarah Chen",
    role: "Founder, TechFlow",
    image: "https://cdn.pixabay.com/photo/2018/01/29/17/01/woman-3116587_1280.jpg",
    rating: 5.0,
    color: "from-cyan-500/20 to-sky-500/20"
  },
  {
    text: "A true professional who understands business goals as well as design principles. Jin is our go-to designer for all major projects.",
    author: "Chang Yu",
    role: "CMO, Innovate Co",
    image: "https://cdn.pixabay.com/photo/2022/01/18/15/46/vietnam-6947358_1280.jpg",
    rating: 5.0,
    color: "from-rose-500/20 to-indigo-500/20"
  }
];

/**
 * ============================================================================
 * MAIN TESTIMONIAL CAROUSEL COMPONENT
 * ============================================================================
 * A fully-featured testimonial carousel with:
 * - Swipe gestures (drag left/right)
 * - Navigation arrows
 * - Pagination dots
 * - Glassmorphic design with background images
 * - Smooth Framer Motion animations
 * - Light/dark theme toggle
 * 
 * @component
 * @example
 * <TestimonialSection />
 */
export default function TestimonialSection() {
  // =========================================================================
  // STATE MANAGEMENT
  // =========================================================================
  
  /** Controls the theme: true = dark mode, false = light mode */
  const [isDark, setIsDark] = useState(true);
  
  /** 
   * Tracks current page and swipe direction
   * [page, direction] where direction: 1 = right, -1 = left
   */
  const [[page, direction], setPage] = useState([0, 0]);

  // =========================================================================
  // COMPUTED VALUES
  // =========================================================================
  
  /** Calculate current testimonial index with wrapping for infinite loop */
  const testimonialIndex = ((page % testimonials.length) + testimonials.length) % testimonials.length;

  // =========================================================================
  // NAVIGATION FUNCTIONS
  // =========================================================================
  
  /**
   * Navigate to next/previous testimonial
   * @param {number} newDirection - 1 for next, -1 for previous
   */
  const paginate = (newDirection: number) => {
    setPage([page + newDirection, newDirection]);
  };

  /**
   * Calculate swipe power based on velocity and distance
   * Higher values = more confident swipe
   */
  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  /**
   * Handle drag end event for swipe gestures
   * Determines if swipe was strong enough to navigate
   */
  const handleDragEnd = (e: any, { offset, velocity }: PanInfo) => {
    const swipe = swipePower(offset.x, velocity.x);

    if (swipe < -swipeConfidenceThreshold) {
      paginate(1); // Swipe left = next
    } else if (swipe > swipeConfidenceThreshold) {
      paginate(-1); // Swipe right = previous
    }
  };

  // =========================================================================
  // ANIMATION VARIANTS
  // =========================================================================
  
  /**
   * Framer Motion variants for card transitions
   * Defines enter, center (active), and exit states
   */
  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,  // Enter from right or left
        opacity: 0,
        scale: 0.8,
        rotate: direction > 0 ? 20 : -20,  // Rotate while entering
        filter: "blur(10px)"               // Blur during transition
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
      rotate: 0,
      filter: "blur(0px)"
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,   // Exit to right or left
        opacity: 0,
        scale: 0.8,
        rotate: direction < 0 ? 20 : -20,  // Rotate while exiting
        filter: "blur(10px)"               // Blur during transition
      };
    }
  };

  // =========================================================================
  // RENDER
  // =========================================================================
  
  return (
    <div className={`w-full min-h-screen relative overflow-hidden transition-colors duration-500 ${isDark ? 'bg-neutral-950' : 'bg-neutral-50'}`}>
      
      {/* ===================================================================
          BACKGROUND EFFECTS
          - Orthogonal grid pattern
          - Animated gradient orbs for ambient effect
          =================================================================== */}
      <div className="absolute inset-0 z-0">
        {/* SVG Grid Pattern */}
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <motion.path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke={isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.05)"}
                strokeWidth="1"
                // Animate grid lines drawing in on load
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
        
        {/* Floating Gradient Orb - Top Left */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute top-20 left-20 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-blue-500/5' : 'bg-blue-500/10'
          }`}
        />
        
        {/* Floating Gradient Orb - Bottom Right */}
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
            y: [0, 100, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className={`absolute bottom-20 right-20 w-96 h-96 rounded-full blur-3xl ${
            isDark ? 'bg-purple-500/5' : 'bg-purple-500/10'
          }`}
        />
      </div>

      {/* ===================================================================
          THEME TOGGLE BUTTON
          Fixed position in top-right corner
          =================================================================== */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="fixed top-6 right-6 z-50"
      >
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDark(!isDark)}
          className={`p-3 rounded-full backdrop-blur-xl transition-all duration-300 ${
            isDark 
              ? 'bg-white/10 text-yellow-400 hover:bg-white/20 border border-white/20' 
              : 'bg-black/5 text-amber-600 hover:bg-black/10 shadow-lg border border-black/10'
          }`}
          aria-label="Toggle theme"
        >
          {/* Icon rotation animation on theme change */}
          <motion.div
            initial={false}
            animate={{ rotate: isDark ? 0 : 180 }}
            transition={{ duration: 0.5, type: "spring" }}
          >
            {isDark ? (
              // Sun icon with continuous rotation in dark mode
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <Sun className="w-5 h-5" />
              </motion.div>
            ) : (
              <Moon className="w-5 h-5" />
            )}
          </motion.div>
        </motion.button>
      </motion.div>

      {/* ===================================================================
          MAIN CONTENT SECTION
          =================================================================== */}
      <section className="pt-16 pb-16 sm:py-24 relative z-10">
        
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-12 text-center"
        >
          {/* Decorative sparkles with subtitle */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="inline-flex items-center gap-2 mb-4"
          >
            {/* Left sparkle - wiggling animation */}
            <motion.div
              animate={{ 
                rotate: [0, 10, -10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            </motion.div>
            
            {/* Section subtitle */}
            <p className={`text-xs uppercase tracking-widest ${
              isDark ? 'text-neutral-500' : 'text-neutral-400'
            }`}>
              Featured Reviews
            </p>
            
            {/* Right sparkle - opposite phase animation */}
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5  // Offset for alternating effect
              }}
            >
              <Sparkles className={`w-4 h-4 ${isDark ? 'text-amber-400' : 'text-amber-600'}`} />
            </motion.div>
          </motion.div>
          
          {/* Section title */}
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className={`text-3xl sm:text-4xl font-medium tracking-tighter ${
              isDark ? 'text-white' : 'text-neutral-900'
            }`}
          >
            Client Highlights
          </motion.h2>
        </motion.div>

        {/* ===================================================================
            CAROUSEL CONTAINER
            =================================================================== */}
        <div className="relative flex items-center justify-center py-12 sm:py-20" style={{ minHeight: '500px' }}>
          <div className="container max-w-4xl mx-auto px-4">
            <div className="relative flex items-center justify-center h-[420px]">
              
              {/* AnimatePresence manages enter/exit animations */}
              <AnimatePresence initial={false} custom={direction} mode="popLayout">
                <motion.div
                  key={page}  // Key changes trigger re-render with animations
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.3 },
                    scale: { duration: 0.4 },
                    rotate: { type: "spring", stiffness: 200, damping: 25 },
                    filter: { duration: 0.3 }
                  }}
                  // Enable drag for swipe gestures
                  drag="x"
                  dragConstraints={{ left: 0, right: 0 }}
                  dragElastic={1}
                  onDragEnd={handleDragEnd}
                  className="absolute w-full max-w-md h-[400px] rounded-2xl cursor-grab active:cursor-grabbing overflow-hidden"
                  // Background image visible through glass effect
                  style={{
                    backgroundImage: `url(${testimonials[testimonialIndex].image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  {/* =========================================================
                      GLASSMORPHIC OVERLAY
                      Creates frosted glass effect over background image
                      ========================================================= */}
                  <div className={`absolute inset-0 backdrop-blur-xl ${
                    isDark 
                      ? 'bg-gradient-to-br from-neutral-900/95 via-neutral-900/90 to-neutral-900/95' 
                      : 'bg-gradient-to-br from-white/95 via-white/90 to-white/95'
                  }`}>
                    {/* Color tint overlay (unique per testimonial) */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${testimonials[testimonialIndex].color}`} />
                  </div>

                  {/* Border glow effect */}
                  <div className={`absolute inset-0 rounded-2xl ${
                    isDark ? 'ring-1 ring-white/10' : 'ring-1 ring-black/10'
                  }`} />

                  {/* =========================================================
                      CARD CONTENT
                      ========================================================= */}
                  <motion.div 
                    className="relative h-full p-8 flex flex-col"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    {/* Quote Icon */}
                    <motion.div 
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ 
                        delay: 0.2, 
                        type: "spring",
                        stiffness: 200,
                        damping: 15
                      }}
                      // Wiggle on hover
                      whileHover={{ 
                        rotate: [0, -10, 10, -10, 0],
                        transition: { duration: 0.5 }
                      }}
                      className={`inline-flex items-center justify-center h-12 w-12 rounded-xl ring-1 mb-6 backdrop-blur-sm ${
                        isDark 
                          ? 'bg-white/5 ring-white/10' 
                          : 'bg-black/5 ring-black/10'
                      }`}
                    >
                      {/* Pulsing quote icon */}
                      <motion.div
                        animate={{ 
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ 
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        <Quote className={`h-6 w-6 ${isDark ? 'text-neutral-300' : 'text-neutral-700'}`} />
                      </motion.div>
                    </motion.div>
                    
                    {/* Testimonial Text */}
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className={`text-base leading-relaxed mb-6 flex-grow ${
                        isDark ? 'text-neutral-100' : 'text-neutral-800'
                      }`}
                    >
                      {testimonials[testimonialIndex].text}
                    </motion.p>
                    
                    {/* =====================================================
                        AUTHOR INFO & RATING
                        ===================================================== */}
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className={`pt-4 border-t flex items-center justify-between backdrop-blur-sm ${
                        isDark ? 'border-white/10' : 'border-black/10'
                      }`}
                    >
                      {/* Author Info */}
                      <div className="flex items-center gap-3">
                        {/* Profile Image with spin-in animation */}
                        <motion.div
                          initial={{ scale: 0, rotate: -180 }}
                          animate={{ scale: 1, rotate: 0 }}
                          transition={{ delay: 0.5, type: "spring" }}
                          whileHover={{ scale: 1.1, rotate: 5 }}
                        >
                          <img 
                            src={testimonials[testimonialIndex].image} 
                            alt={testimonials[testimonialIndex].author}
                            className={`h-12 w-12 rounded-full object-cover ring-2 ring-offset-2 ${
                              isDark 
                                ? 'ring-white/20 ring-offset-neutral-900' 
                                : 'ring-black/10 ring-offset-white'
                            }`}
                          />
                        </motion.div>
                        
                        {/* Name and Role */}
                        <div>
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className={`text-sm font-medium ${
                              isDark ? 'text-neutral-100' : 'text-neutral-900'
                            }`}
                          >
                            {testimonials[testimonialIndex].author}
                          </motion.div>
                          <motion.div 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.7 }}
                            className={`text-xs ${
                              isDark ? 'text-neutral-400' : 'text-neutral-500'
                            }`}
                          >
                            {testimonials[testimonialIndex].role}
                          </motion.div>
                        </div>
                      </div>
                      
                      {/* Rating Display */}
                      <motion.div 
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.8, type: "spring" }}
                        whileHover={{ scale: 1.1 }}
                        className="flex items-center gap-1"
                      >
                        {/* Wiggling star icon */}
                        <motion.div
                          animate={{ 
                            rotate: [0, 10, -10, 10, 0],
                            scale: [1, 1.2, 1]
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut"
                          }}
                        >
                          <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                        </motion.div>
                        <span className={`text-sm font-medium ${
                          isDark ? 'text-neutral-100' : 'text-neutral-900'
                        }`}>
                          {testimonials[testimonialIndex].rating}
                        </span>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </AnimatePresence>

              {/* =========================================================
                  NAVIGATION ARROWS
                  ========================================================= */}
              
              {/* Previous Button */}
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(-1)}
                className={`absolute left-0 z-10 p-3 rounded-full backdrop-blur-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                    : 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg border border-black/10'
                }`}
                aria-label="Previous testimonial"
              >
                {/* Arrow with sliding animation */}
                <motion.div
                  animate={{ x: [-2, 0, -2] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </motion.div>
              </motion.button>

              {/* Next Button */}
              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => paginate(1)}
                className={`absolute right-0 z-10 p-3 rounded-full backdrop-blur-xl transition-all duration-300 ${
                  isDark 
                    ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20' 
                    : 'bg-white text-neutral-900 hover:bg-neutral-100 shadow-lg border border-black/10'
                }`}
                aria-label="Next testimonial"
              >
                {/* Arrow with sliding animation */}
                <motion.div
                  animate={{ x: [2, 0, 2] }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                >
                  <ChevronRight className="w-6 h-6" />
                </motion.div>
              </motion.button>
            </div>

            {/* =========================================================
                PAGINATION DOTS
                Visual indicator of position in carousel
                ========================================================= */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex justify-center gap-2 mt-8"
            >
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.3 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setPage([index, index > testimonialIndex ? 1 : -1])}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    index === testimonialIndex 
                      ? 'w-8 bg-amber-500'  // Active dot is wider
                      : isDark 
                        ? 'w-2 bg-white/20 hover:bg-white/40' 
                        : 'w-2 bg-black/20 hover:bg-black/40'
                  }`}
                  // Pulse animation for active dot
                  animate={index === testimonialIndex ? {
                    scale: [1, 1.1, 1],
                  } : {}}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  aria-label={`Go to testimonial ${index + 1}`}
                  aria-current={index === testimonialIndex ? 'true' : 'false'}
                />
              ))}
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}