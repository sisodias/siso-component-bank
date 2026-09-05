'use client';

import { useState } from 'react';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';

export default function AnimatedCounter() {
  const [count, setCount] = useState(0);
  const [prevCount, setPrevCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Spring animation for smooth count transitions
  const springCount = useSpring(count, { stiffness: 100, damping: 15 });
  
  // Color transformation based on count
  const backgroundColor = useTransform(
    springCount,
    [0, 50, 100],
    ['rgb(245, 245, 245)', 'rgb(219, 234, 254)', 'rgb(196, 181, 253)']
  );
  
  const textColor = useTransform(
    springCount,
    [0, 50, 100],
    ['rgb(23, 23, 23)', 'rgb(30, 64, 175)', 'rgb(91, 33, 182)']
  );

  const increment = () => {
    setPrevCount(count);
    setCount(prev => prev + 1);
    triggerAnimation();
  };
  
  const decrement = () => {
    setPrevCount(count);
    setCount(prev => prev - 1);
    triggerAnimation();
  };

  const triggerAnimation = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 300);
  };


  // Convert count to padded string for digit animation with proper negative handling
  const formatNumber = (num: number) => {
    const isNegative = num < 0;
    const absNum = Math.abs(num);
    const paddedNum = absNum.toString().padStart(3, '0');
    return { digits: paddedNum.split(''), isNegative };
  };

  const currentFormatted = formatNumber(count);
  const previousFormatted = formatNumber(prevCount);
  
  const currentDigits = currentFormatted.digits;
  const previousDigits = previousFormatted.digits;
  const showNegativeSign = currentFormatted.isNegative;
  const showPreviousNegativeSign = previousFormatted.isNegative;

  return (
    <motion.div 
      className="relative bg-white border border-neutral-200 rounded-2xl p-8 shadow-lg overflow-hidden"
      style={{ backgroundColor }}
      animate={{ 
        scale: isAnimating ? 1.02 : 1,
        rotateX: isAnimating ? 2 : 0
      }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {/* Animated Background Gradient */}
      <motion.div
        className="absolute inset-0 opacity-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 50%, rgb(59, 130, 246) 0%, transparent 50%)",
            "radial-gradient(circle at 80% 50%, rgb(147, 51, 234) 0%, transparent 50%)",
            "radial-gradient(circle at 50% 20%, rgb(34, 197, 94) 0%, transparent 50%)",
            "radial-gradient(circle at 20% 50%, rgb(59, 130, 246) 0%, transparent 50%)"
          ]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      />


      <div className="relative flex items-center justify-center gap-6">
        {/* Decrease Button with Ripple Effect */}
        <motion.button
          onClick={decrement}
          className="relative w-14 h-14 bg-gradient-to-br from-neutral-100 to-neutral-200 hover:from-neutral-200 hover:to-neutral-300 text-neutral-700 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md overflow-hidden group"
          whileHover={{ scale: 1.05, rotateZ: -5 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Decrease counter"
        >
          <motion.div
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20"
            whileHover={{ scale: 1.5 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={{ rotateZ: isAnimating && count < prevCount ? [0, -180, 0] : 0 }}
            transition={{ duration: 0.3 }}
          >
            −
          </motion.span>
        </motion.button>

        {/* Enhanced Counter Display */}
        <div className="relative">
          {/* 3D Counter Display */}
          <motion.div 
            className="min-w-[140px] h-20 bg-gradient-to-br from-white to-neutral-50 rounded-2xl border-2 border-neutral-200 flex items-center justify-center relative overflow-hidden shadow-inner"
            style={{ 
              perspective: '1000px',
              transformStyle: 'preserve-3d'
            }}
            animate={{ 
              rotateY: isAnimating ? [0, 5, 0] : 0,
              boxShadow: isAnimating 
                ? "0 25px 50px -12px rgba(0, 0, 0, 0.25), inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
                : "0 10px 25px -5px rgba(0, 0, 0, 0.1), inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)"
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Shimmer Effect */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0"
              animate={{ 
                x: isAnimating ? [-100, 200] : -100,
                opacity: isAnimating ? [0, 0.3, 0] : 0
              }}
              transition={{ duration: 0.6 }}
            />

            <div className="flex items-center justify-center relative z-10">
              {/* Negative Sign */}
              <AnimatePresence>
                {showNegativeSign && (
                  <motion.span
                    key="negative-sign"
                    className="text-3xl font-bold font-mono"
                    style={{ color: textColor }}
                    initial={{ opacity: 0, scale: 0.7, x: 15, rotateX: 90 }}
                    animate={{ opacity: 1, scale: 1, x: 0, rotateX: 0 }}
                    exit={{ opacity: 0, scale: 0.7, x: 15, rotateX: -90 }}
                    transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                  >
                    −
                  </motion.span>
                )}
              </AnimatePresence>
              
              {/* Digits */}
              <div className="flex">
                {currentDigits.map((digit, index) => {
                  const hasChanged = digit !== previousDigits[index] || showNegativeSign !== showPreviousNegativeSign;
                  const isIncreasing = count > prevCount;
                  
                  return (
                    <div key={index} className="relative w-6 h-10 flex items-center justify-center overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={`${index}-${digit}-${showNegativeSign}`}
                          className="text-3xl font-bold font-mono absolute"
                          style={{ color: textColor }}
                          initial={hasChanged ? {
                            y: isIncreasing ? -40 : 40,
                            opacity: 0,
                            scale: 0.7,
                            rotateX: isIncreasing ? 90 : -90
                          } : {
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            rotateX: 0
                          }}
                          animate={{
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            rotateX: 0
                          }}
                          exit={hasChanged ? {
                            y: isIncreasing ? 40 : -40,
                            opacity: 0,
                            scale: 0.7,
                            rotateX: isIncreasing ? -90 : 90
                          } : {
                            y: 0,
                            opacity: 1,
                            scale: 1,
                            rotateX: 0
                          }}
                          transition={{
                            duration: 0.4,
                            ease: [0.25, 0.46, 0.45, 0.94]
                          }}
                        >
                          {digit}
                        </motion.span>
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Increase Button with Enhanced Animation */}
        <motion.button
          onClick={increment}
          className="relative w-14 h-14 bg-gradient-to-br from-neutral-800 to-neutral-900 hover:from-neutral-700 hover:to-neutral-800 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-md overflow-hidden group"
          whileHover={{ scale: 1.05, rotateZ: 5 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Increase counter"
        >
          <motion.div
            className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10"
            whileHover={{ scale: 1.5 }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            animate={{ 
              rotateZ: isAnimating && count > prevCount ? [0, 180, 0] : 0,
              scale: isAnimating && count > prevCount ? [1, 1.2, 1] : 1
            }}
            transition={{ duration: 0.3 }}
          >
            +
          </motion.span>
        </motion.button>
      </div>

    </motion.div>
  );
}