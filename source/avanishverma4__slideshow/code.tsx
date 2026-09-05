import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Moon, Sun, Lightbulb } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const slides = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?w=800&h=600&fit=crop',
    title: 'Urban Nights',
    description: 'Explore the vibrant city life'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=800&h=600&fit=crop',
    title: 'Mountain Peaks',
    description: 'Discover breathtaking landscapes'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    title: 'Ocean Views',
    description: 'Experience coastal serenity'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1511593358241-7eea1f3c84e5?w=800&h=600&fit=crop',
    title: 'Desert Sands',
    description: 'Journey through endless horizons'
  }
];

const Slideshow = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDark, setIsDark] = useState(true);
  const [direction, setDirection] = useState(0);

  const goToPrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
  };

  const goToSlide = (index) => {
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  useEffect(() => {
    const timer = setInterval(goToNext, 5000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const slideVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1
    },
    exit: (direction) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.8
    })
  };

  return (
    <div className={`w-full min-h-screen ${isDark ? 'bg-gray-950' : 'bg-gray-50'} transition-colors duration-300`}>
      {/* Orthogonal Grid Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div 
          className={`w-full h-full ${isDark ? 'opacity-10' : 'opacity-20'}`}
          style={{
            backgroundImage: `
              linear-gradient(${isDark ? '#3b82f6' : '#64748b'} 1px, transparent 1px),
              linear-gradient(90deg, ${isDark ? '#3b82f6' : '#64748b'} 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Theme Toggle */}
      <button
        onClick={() => setIsDark(!isDark)}
        className={`fixed top-6 right-6 z-50 p-3 rounded-full ${
          isDark ? 'bg-gray-800 text-blue-400' : 'bg-white text-orange-500'
        } shadow-lg hover:scale-110 transition-transform`}
      >
        {isDark ? <Sun size={24} /> : <Moon size={24} />}
      </button>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`text-4xl md:text-5xl font-bold mb-12 ${
            isDark ? 'text-white' : 'text-gray-900'
          }`}
        >
          AnimateActivity: Slideshow
        </motion.h1>

        {/* Slideshow Container */}
        <div className="relative w-full max-w-5xl">
          <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl">
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 }
                }}
                className="absolute inset-0"
              >
                <img
                  src={slides[currentIndex].image}
                  alt={slides[currentIndex].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                
                {/* Slide Info */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="absolute bottom-0 left-0 right-0 p-8 text-white"
                >
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">
                    {slides[currentIndex].title}
                  </h2>
                  <p className="text-lg md:text-xl text-gray-200">
                    {slides[currentIndex].description}
                  </p>
                </motion.div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <button
              onClick={goToPrevious}
              className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full ${
                isDark ? 'bg-gray-800/80 hover:bg-gray-700/90' : 'bg-white/80 hover:bg-white/90'
              } ${isDark ? 'text-white' : 'text-gray-900'} shadow-lg backdrop-blur-sm transition-all hover:scale-110`}
            >
              <ChevronLeft size={28} />
            </button>
            
            <button
              onClick={goToNext}
              className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full ${
                isDark ? 'bg-gray-800/80 hover:bg-gray-700/90' : 'bg-white/80 hover:bg-white/90'
              } ${isDark ? 'text-white' : 'text-gray-900'} shadow-lg backdrop-blur-sm transition-all hover:scale-110`}
            >
              <ChevronRight size={28} />
            </button>
          </div>

          {/* Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentIndex
                    ? isDark 
                      ? 'w-12 bg-blue-500' 
                      : 'w-12 bg-blue-600'
                    : isDark
                      ? 'w-2 bg-gray-600 hover:bg-gray-500'
                      : 'w-2 bg-gray-400 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`text-center mt-6 text-lg ${
              isDark ? 'text-gray-400' : 'text-gray-600'
            }`}
          >
            {currentIndex + 1} / {slides.length}
          </motion.div>
        </div>

        {/* Pro Tip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className={`mt-12 max-w-2xl mx-auto p-6 rounded-xl ${
            isDark 
              ? 'bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-800/30' 
              : 'bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200'
          } backdrop-blur-sm`}
        >
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${
              isDark ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-600/20 text-blue-600'
            }`}>
              <Lightbulb size={24} className="animate-pulse" />
            </div>
            <div className="flex-1">
              <h3 className={`font-semibold mb-1 ${
                isDark ? 'text-blue-400' : 'text-blue-600'
              }`}>
                Pro Tip
              </h3>
              <p className={`text-sm leading-relaxed ${
                isDark ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Use keyboard arrows to navigate through slides, or click the dots below to jump to a specific slide. The slideshow auto-advances every 5 seconds.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Slideshow;
