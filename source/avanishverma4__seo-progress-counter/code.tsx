/**
 * SEO Score Animation Component
 * 
 * A visually stunning animated circular progress indicator that displays SEO performance scores.
 * Features smooth spring animations, glowing effects, orbiting particles, and a modern grid background.
 * 
 * @component
 * @example
 * return <SeoScoreAnimation />
 */

import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

export default function SeoScoreAnimation() {
  // Track component mount state to prevent hydration issues
  const [mounted, setMounted] = useState(false);
  
  // Core animation value that drives the score from 0 to 100
  const progress = useMotionValue(0);
  
  /**
   * Initialize animation on component mount
   * Sets mounted state and triggers the progress animation after a brief delay
   */
  useEffect(() => {
    setMounted(true);
    const animation = setTimeout(() => {
      progress.set(100);
    }, 100);
    return () => clearTimeout(animation);
  }, []);

  /**
   * Spring physics applied to progress for smooth, natural motion
   * Settings: stiffness=50, damping=40 for a gentle, professional feel
   */
  const smoothProgress = useSpring(progress, {
    stiffness: 50,
    damping: 40,
    restDelta: 0.001
  });

  /**
   * Transform smooth progress to rounded integer for display
   * Maps continuous value to whole numbers (0-100)
   */
  const displayNumber = useTransform(smoothProgress, (v) => Math.round(v));
  
  /**
   * Calculate stroke dash offset for circular progress animation
   * Formula: circumference (440px) minus progress percentage
   * Creates the visual effect of circle filling as score increases
   */
  const strokeOffset = useTransform(smoothProgress, [0, 100], [440, 0]);
  
  /**
   * Shadow intensity grows with progress for dramatic reveal effect
   * 0 = no shadow, 1 = full shadow with green glow
   */
  const shadowIntensity = useTransform(smoothProgress, [0, 100], [0, 1]);

  return (
    <div className="w-full min-h-screen bg-black flex items-center justify-center p-8 relative overflow-hidden">
      {/* Orthogonal Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black pointer-events-none" />
      <div className="text-center space-y-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl font-bold text-white mb-2">SEO Performance</h1>
          <p className="text-gray-400 text-lg">Analyzing your website optimization</p>
        </motion.div>

        {/* Main circular score indicator container */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="relative inline-block"
        >
          {/* 
            Core circle component with dynamic shadow
            Shadow intensity increases as score progresses for dramatic effect
            Uses green color scheme (rgba 34, 197, 94) for environmental/success theme
          */}
          <motion.div
            style={{
              boxShadow: useTransform(
                shadowIntensity,
                [0, 1],
                [
                  'none',
                  '0 2px 1.6px -0.34px rgba(34, 197, 94, 0.14), 0 4.8px 3.8px -0.69px rgba(34, 197, 94, 0.14), 0 8.7px 7px -1.03px rgba(34, 197, 94, 0.14), 0 14.5px 11.6px -1.38px rgba(34, 197, 94, 0.13), 0 23.4px 18.7px -1.72px rgba(34, 197, 94, 0.13), 0 38.3px 30.6px -2.06px rgba(34, 197, 94, 0.13), 0 66px 52.8px -2.41px rgba(34, 197, 94, 0.13), 0 120px 96px -2.75px rgba(34, 197, 94, 0.11)'
                ]
              )
            }}
            className="w-fit h-fit rounded-full p-3 bg-gradient-to-br from-green-500 to-emerald-600 relative flex items-center justify-center"
          >
            <svg
              width="180"
              height="180"
              viewBox="0 0 180 180"
              className="-rotate-90"
              fill="none"
            >
              {/* Background circle */}
              <circle
                cx="90"
                cy="90"
                r="70"
                strokeWidth="10"
                className="stroke-white/20"
              />
              
              {/* Animated progress circle */}
              <motion.circle
                cx="90"
                cy="90"
                r="70"
                strokeWidth="10"
                className="stroke-white"
                strokeLinecap="round"
                strokeDasharray="440"
                style={{
                  strokeDashoffset: strokeOffset
                }}
                initial={{ strokeDashoffset: 440 }}
              />
            </svg>

            {/* Center content */}
            <motion.div 
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <motion.div className="text-6xl font-bold text-white">
                {mounted && displayNumber}
              </motion.div>
              <div className="text-white/80 text-sm font-medium mt-1">/ 100</div>
            </motion.div>

            {/* Pulsing glow effect */}
            <motion.div
              className="absolute inset-0 rounded-full bg-green-500/30 blur-xl"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.3, 0.5, 0.3]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>

          {/* 
            Orbiting particles - three dots rotating around the circle
            Each particle starts at a different rotation (0°, 120°, 240°)
            Creates a planetary orbit effect with staggered delays
            transformOrigin: '0 0' ensures rotation around the center point
          */}
          {[0, 120, 240].map((rotation, i) => (
            <motion.div
              key={i}
              className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5"
              style={{
                transformOrigin: '0 0'
              }}
              animate={{
                rotate: [rotation, rotation + 360]
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "linear",
                delay: i * 0.3
              }}
            >
              {/* Particle positioned 110px from center */}
              <div className="w-3 h-3 rounded-full bg-white shadow-lg" style={{
                transform: 'translateX(110px)'
              }} />
            </motion.div>
          ))}
        </motion.div>

        {/* 
          Metric cards - display additional performance scores
          Three cards arranged in a grid: Performance, Accessibility, Best Practices
          Staggered entrance animation for polished feel
        */}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="grid grid-cols-3 gap-6 max-w-2xl mx-auto"
        >
          {[
            { label: 'Performance', score: 98, color: 'text-white' },
            { label: 'Accessibility', score: 95, color: 'text-white' },
            { label: 'Best Practices', score: 100, color: 'text-white' }
          ].map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5 + index * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 border border-gray-800"
            >
              <div className={`text-3xl font-bold ${metric.color}`}>
                {metric.score}
              </div>
              <div className="text-gray-500 text-sm mt-1">{metric.label}</div>
            </motion.div>
          ))}
        </motion.div>

        {/* 
          Rerun Analysis Button
          Interactive button that resets and restarts the animation
          Includes hover and tap scale effects for tactile feedback
        */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 px-8 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-full shadow-lg hover:shadow-green-500/50 transition-shadow"
          onClick={() => {
            // Reset progress to 0, then animate back to 100
            progress.set(0);
            setTimeout(() => progress.set(100), 100);
          }}
        >
          Rerun Analysis
        </motion.button>
      </div>
    </div>
  );
}