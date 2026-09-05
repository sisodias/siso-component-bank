
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// --- Interfaces ---
export interface SlideData {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  imageUrl: string;
  category: string;
  ctaText: string;
}

// --- Constants ---
export const SLIDES: SlideData[] = [
  {
    id: 1,
    category: "Architecture",
    subtitle: "Modern Minimalist",
    title: "Concrete Reverie",
    description: "Discover the intersection of raw materiality and geometric precision in modern architectural masterpieces.",
    imageUrl: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=2070",
    ctaText: "Explore Project"
  },
  {
    id: 2,
    category: "Nature",
    subtitle: "Untamed Landscapes",
    title: "Celestial Peaks",
    description: "An immersive journey through the high altitudes where the earth meets the endless indigo sky.",
    imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2070",
    ctaText: "View Gallery"
  },
  {
    id: 3,
    category: "Interior",
    subtitle: "Urban Sanctuary",
    title: "The Nordic Loft",
    description: "Where functional simplicity meets warm textures to create the ultimate haven for city dwellers.",
    imageUrl: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1974",
    ctaText: "See Details"
  },
  {
    id: 4,
    category: "Lifestyle",
    subtitle: "Daily Rituals",
    title: "Quiet Mornings",
    description: "Celebrating the art of slow living and the beauty found in the quietest moments of our day.",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=2070",
    ctaText: "Read Story"
  }
];

// --- Sub-component: ProgressBar ---
interface ProgressBarProps {
  duration: number;
  isActive: boolean;
  onComplete: () => void;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ duration, isActive, onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval: number;
    if (isActive) {
      setProgress(0);
      const startTime = Date.now();
      
      interval = window.setInterval(() => {
        const elapsed = Date.now() - startTime;
        const nextProgress = Math.min((elapsed / duration) * 100, 100);
        setProgress(nextProgress);
        
        if (nextProgress >= 100) {
          clearInterval(interval);
          onComplete();
        }
      }, 16);
    } else {
      setProgress(0);
    }
    
    return () => clearInterval(interval);
  }, [isActive, duration, onComplete]);

  return (
    <div className="w-full h-[2px] bg-white/10 relative overflow-hidden">
      <div 
        className="absolute top-0 left-0 h-full bg-white transition-all duration-75 ease-linear"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// --- Sub-component: SliderControls ---
interface SliderControlsProps {
  onPrev: () => void;
  onNext: () => void;
  current: number;
  total: number;
}

const SliderControls: React.FC<SliderControlsProps> = ({ onPrev, onNext, current, total }) => {
  return (
    <div className="flex items-center space-x-6">
      <div className="flex flex-col text-white/50 text-xs font-medium tracking-widest uppercase">
        <span className="text-white text-lg font-bold">0{current + 1}</span>
        <div className="w-8 h-[1px] bg-white/20 my-1"></div>
        <span>0{total}</span>
      </div>
      
      <div className="flex space-x-2">
        <button
          onClick={onPrev}
          className="group relative w-12 h-12 flex items-center justify-center border border-white/20 rounded-full hover:border-white transition-colors duration-300 pointer-events-auto"
          aria-label="Previous slide"
        >
          <svg className="w-5 h-5 text-white transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <button
          onClick={onNext}
          className="group relative w-12 h-12 flex items-center justify-center border border-white/20 rounded-full hover:border-white transition-colors duration-300 pointer-events-auto"
          aria-label="Next slide"
        >
          <svg className="w-5 h-5 text-white transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

// --- Main App Component ---
const App: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 for next, -1 for prev
  const [isAnimating, setIsAnimating] = useState(false);
  const autoPlayDuration = 6000;

  const handleNext = useCallback(() => {
    if (isAnimating) return;
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % SLIDES.length);
  }, [isAnimating]);

  const handlePrev = useCallback(() => {
    if (isAnimating) return;
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + SLIDES.length) % SLIDES.length);
  }, [isAnimating]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev]);

  const currentSlide = SLIDES[currentIndex];

  // Animation Variants
  const textContainerVariants: Variants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
    exit: { opacity: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 } }
  };

  const textItemVariants: Variants = {
    initial: { y: 40, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        duration: 0.8, 
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number] 
      } 
    },
    exit: { y: -20, opacity: 0, transition: { duration: 0.4, ease: "easeIn" } }
  };

  const imageVariants: Variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      scale: 1.1,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      scale: 1,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? '100%' : '-100%',
      scale: 1.1,
      opacity: 0
    })
  };

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden flex flex-col md:flex-row">
      {/* Background Image Container */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <AnimatePresence initial={false} custom={direction} onExitComplete={() => setIsAnimating(false)}>
          <motion.div
            key={currentIndex}
            custom={direction}
            variants={imageVariants}
            initial="enter"
            animate="center"
            exit="exit"
            onAnimationStart={() => setIsAnimating(true)}
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.6 },
              scale: { duration: 1.2, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }
            }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-transparent z-10" />
            <img
              src={currentSlide.imageUrl}
              alt={currentSlide.title}
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Main Content Area */}
      <div className="relative z-20 flex-1 flex flex-col justify-end md:justify-center p-8 md:p-24 lg:p-32 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide.id}
            variants={textContainerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="flex flex-col"
          >
            <motion.p 
              variants={textItemVariants}
              className="text-white/60 uppercase tracking-[0.3em] text-xs md:text-sm font-semibold mb-4"
            >
              {currentSlide.category} — {currentSlide.subtitle}
            </motion.p>

            <motion.h1 
              variants={textItemVariants}
              className="text-white text-5xl md:text-7xl lg:text-8xl font-serif italic mb-6 leading-tight"
            >
              {currentSlide.title}
            </motion.h1>

            <motion.p 
              variants={textItemVariants}
              className="text-white/70 text-lg md:text-xl max-w-lg leading-relaxed mb-10"
            >
              {currentSlide.description}
            </motion.p>

            <motion.div variants={textItemVariants}>
              <button className="group relative px-8 py-4 bg-white text-black font-bold uppercase tracking-widest text-xs overflow-hidden transition-all duration-300 hover:bg-black hover:text-white border border-white">
                <span className="relative z-10">{currentSlide.ctaText}</span>
                <div className="absolute inset-0 bg-black transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
              </button>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Interface */}
      <div className="absolute bottom-0 left-0 w-full z-30 p-8 md:p-12 flex flex-col md:flex-row items-end md:items-center justify-between pointer-events-none">
        <div className="w-full md:w-1/3 mb-8 md:mb-0 pointer-events-auto">
          <div className="flex space-x-4 mb-4">
            {SLIDES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-[2px] transition-all duration-500 ${idx === currentIndex ? 'w-12 bg-white' : 'w-4 bg-white/20'}`}
              />
            ))}
          </div>
          <ProgressBar 
            duration={autoPlayDuration} 
            isActive={!isAnimating} 
            onComplete={handleNext} 
          />
        </div>

        <div className="pointer-events-auto">
          <SliderControls 
            onPrev={handlePrev} 
            onNext={handleNext} 
            current={currentIndex} 
            total={SLIDES.length} 
          />
        </div>
      </div>

      {/* Decorative Overlay */}
      <div className="absolute top-12 left-12 z-30 hidden md:block">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-white font-bold tracking-tighter text-2xl flex items-center"
        >
          <div className="w-8 h-8 bg-white text-black flex items-center justify-center mr-3 text-sm">R</div>
          REMIX<span className="font-light text-white/40 ml-1">STUDIO</span>
        </motion.div>
      </div>
    </div>
  );
};

export default App;