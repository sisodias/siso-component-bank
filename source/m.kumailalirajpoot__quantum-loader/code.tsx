'use client'

import React, { useEffect, useState } from 'react'
import {motion,useMotionTemplate,useSpring} from "framer-motion";

export function QuantumSparkLoader() {
  const [sparkCount, setSparkCount] = useState(0)
  const scaleSpring = useSpring(1);
  const scaleValue = useMotionTemplate`${scaleSpring}`;
  // Status texts to cycle through
  const statusTexts = [
    'Charging...',
    'Stabilizing Core...',
    'Quantum Flux...',
    'Energizing...',
    'Synchronizing...',
    'Preparing Launch...',
  ]

  // Current status index
  const [statusIndex, setStatusIndex] = useState(0)
  const [direction, setDirection] = useState<'top' | 'left' | 'bottom'>('top')

  // Spark animation loop
  useEffect(() => {
    const sparkInterval = setInterval(() => {
      setSparkCount((prev) => (prev + 1) % 8)
    }, 50)
    return () => clearInterval(sparkInterval)
  }, [])

  // Status text animation loop
  useEffect(() => {
    const statusInterval = setInterval(() => {
      setStatusIndex((prev) => (prev + 1) % statusTexts.length)
      // Randomly pick a direction for each new text
      const dirs: ('top' | 'left' | 'bottom')[] = ['top', 'left', 'bottom']
      if(scaleSpring.get() === 1) {
          scaleSpring.set(0.5);
      }else {
        scaleSpring.set(1);
      }
      setDirection(dirs[Math.floor(Math.random() * dirs.length)])
    }, 500) // every 500ms
    return () => clearInterval(statusInterval)
  }, [])

  // Compute animation classes based on direction
  const getAnimationStyle = () => {
    switch (direction) {
      case 'top':
        return {
          transform: 'translateY(-20px)',
          animation: 'textAnimTop 0.5s forwards',
        }
      case 'left':
        return {
          transform: 'translateX(-20px)',
          animation: 'textAnimLeft 0.5s forwards',
        }
      case 'bottom':
        return {
          transform: 'translateY(20px)',
          animation: 'textAnimBottom 0.5s forwards',
        }
    }
  }

  return (
    <motion.div
     className="flex flex-col items-center justify-center gap-3">
      {/* Loader Base */}
      <div className="animate-spin border-3 border-dotted border-green-700 dark:border-cyan-300 rounded-full">
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* Core Circle */}
        <motion.div 
        style={{
          scale:scaleValue
        }}
        className="w-4 h-4 rounded-full dark:border-cyan-400 border border-dashed shadow-[0_0_12px_rgba(16,185,129,0.7)] dark:shadow-[0_0_12px_rgba(34,211,238,0.7)] animate-pulse" />

        {/* Sparks */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className={`absolute w-1.5 h-1.5 rounded-full bg-green-700 dark:bg-cyan-300`}
            style={{
              transform: `rotate(${i * 45}deg) translateY(-18px) scale(${
                i === sparkCount ? 1.5 : 0.7
              })`,
              opacity: i === sparkCount ? 1 : 0.5,
              transition: 'all 0.15s ease-in-out',
              boxShadow:
                i === sparkCount
                  ? '0 0 6px rgba(16,185,129,0.8)'
                  : 'none',
            }}
          />
        ))}
      </div>
      </div>
      {/* Animated Status Text */}
      <span
        key={statusIndex}
        className="text-xs font-medium text-green-700 dark:text-cyan-300 tracking-widest"
        style={{
          ...getAnimationStyle(),
          opacity: 0,
        }}
      >
        {statusTexts[statusIndex]}
      </span>

      {/* Text Animation Keyframes */}
      <style jsx>{`
        @keyframes textAnimTop {
          0% {
            transform: translateY(-20px);
            opacity: 0;
          }
          50% {
            transform: translateY(0px);
            opacity: 1;
          }
          100% {
            transform: translateY(10px);
            opacity: 0;
          }
        }
        @keyframes textAnimLeft {
          0% {
            transform: translateX(-20px);
            opacity: 0;
          }
          50% {
            transform: translateX(0px);
            opacity: 1;
          }
          100% {
            transform: translateX(10px);
            opacity: 0;
          }
        }
        @keyframes textAnimBottom {
          0% {
            transform: translateY(20px);
            opacity: 0;
          }
          50% {
            transform: translateY(0px);
            opacity: 1;
          }
          100% {
            transform: translateY(-10px);
            opacity: 0;
          }
        }
      `}</style>
    </motion.div>
  )
}
