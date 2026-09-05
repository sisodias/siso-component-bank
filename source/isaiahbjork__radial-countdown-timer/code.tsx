"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useReducedMotion } from "framer-motion"
import { Play, Pause, RotateCcw } from "lucide-react"
import { cn } from "@/lib/utils"

interface TimerProps {
  initialTime?: number // in seconds
  duration?: number // total duration in seconds
  strokeWidth?: number // thickness of the progress line
  tickLength?: number // length of the radial tick marks
  tickColor?: string // color of the tick marks
  textColor?: string // color of the time text
  titleColor?: string // color of the title text
  gradientFrom?: string // start color for progress gradient
  gradientTo?: string // end color for progress gradient
  gradientVia?: string // middle color for progress gradient
  primaryButtonColor?: string // color for play/pause button
  primaryButtonHover?: string // hover color for play/pause button
  secondaryButtonColor?: string // color for reset button
  secondaryButtonHover?: string // hover color for reset button
  className?: string
  title?: string
}

export function Timer({ 
  initialTime = 0,
  duration = 10,
  strokeWidth = 24,
  tickLength = 10,
  tickColor = "rgba(0,0,0,0.2)",
  textColor = "rgb(31, 41, 55)", // gray-800
  titleColor = "rgb(107, 114, 128)", // gray-500
  gradientFrom = "#FFD700", // gold
  gradientTo = "#FF8F00", // orange
  gradientVia = "#FFC107", // amber
  primaryButtonColor = "rgb(31, 41, 55)", // gray-800
  primaryButtonHover = "rgb(55, 65, 81)", // gray-700
  secondaryButtonColor = "rgb(243, 244, 246)", // gray-100
  secondaryButtonHover = "rgb(229, 231, 235)", // gray-200
  className = "",
  title = "Work Time"
}: TimerProps) {
  const [time, setTime] = useState(initialTime)
  const [isRunning, setIsRunning] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const shouldReduceMotion = useReducedMotion()

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // Calculate progress (0 to 1)
  const progress = duration > 0 ? time / duration : 0
  const circumference = 2 * Math.PI * 140 // radius of 140
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (progress * circumference)

  // Generate radial tick marks
  const generateTickMarks = () => {
    const tickCount = 60 // number of tick marks
    const centerX = 160
    const centerY = 160
    const innerRadius = 140 - tickLength / 2
    const outerRadius = 140 + tickLength / 2
    const ticks = []

    for (let i = 0; i < tickCount; i++) {
      const angle = (i * 360) / tickCount
      const radian = (angle * Math.PI) / 180

      const x1 = Math.round((centerX + innerRadius * Math.cos(radian)) * 100) / 100
      const y1 = Math.round((centerY + innerRadius * Math.sin(radian)) * 100) / 100
      const x2 = Math.round((centerX + outerRadius * Math.cos(radian)) * 100) / 100
      const y2 = Math.round((centerY + outerRadius * Math.sin(radian)) * 100) / 100

      ticks.push(
        <line
          key={i}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke={tickColor}
          strokeWidth="2"
          className="opacity-40"
        />
      )
    }
    return ticks
  }

  // Timer logic using time-based approach
  useEffect(() => {
    if (isRunning && startTime) {
      intervalRef.current = setInterval(() => {
        const now = Date.now()
        const elapsed = Math.floor((now - startTime) / 1000) + initialTime
        
        if (elapsed >= duration) {
          setTime(duration)
          setIsRunning(false)
          setStartTime(null)
        } else {
          setTime(elapsed)
        }
      }, 100) // Update more frequently for smoother display
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
        intervalRef.current = null
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isRunning, startTime, duration, initialTime])

  const handlePlayPause = () => {
    if (!isRunning) {
      // Starting the timer - set start time accounting for current progress
      const now = Date.now()
      setStartTime(now - (time - initialTime) * 1000)
      setIsRunning(true)
    } else {
      // Pausing the timer
      setIsRunning(false)
      setStartTime(null)
    }
  }

  const handleReset = () => {
    setIsRunning(false)
    setStartTime(null)
    setTime(initialTime)
  }



  // Animation variants
  const containerVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: 20
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 25 }
    }
  }

  const buttonVariants = {
    tap: { scale: 0.95 }
  }

  return (
    <motion.div
      className={cn("relative", className)}
      variants={containerVariants}
      initial="hidden"
      animate="visible"

    >
      {/* Timer Circle */}
      <motion.div 
        className="relative flex items-center justify-center mb-8"
        variants={itemVariants}
      >
                <svg
          width="320"
          height="320"
          viewBox="0 0 320 320"
          className="transform -rotate-90"
        >
          {/* Radial tick marks */}
          {generateTickMarks()}
          
          {/* Progress circle */}
          <motion.circle
            cx="160"
            cy="160"
            r="140"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            initial={{ strokeDashoffset: circumference }}
            animate={{ 
              strokeDashoffset: shouldReduceMotion ? strokeDashoffset : strokeDashoffset
            }}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
              mass: 1
            }}
            style={{
              filter: `drop-shadow(0 4px 8px ${gradientFrom}30)`
            }}
          />
          
          {/* Gradient definition */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={gradientFrom} />
              <stop offset="50%" stopColor={gradientVia} />
              <stop offset="100%" stopColor={gradientTo} />
            </linearGradient>
          </defs>
        </svg>

        {/* Center content */}
        <motion.div 
          className="absolute inset-0 flex flex-col items-center justify-center"
          variants={itemVariants}
        >
          <motion.div 
            className="text-7xl font-light mb-2"
            style={{ color: textColor }}
            key={time}
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            {formatTime(time)}
          </motion.div>
          <motion.div 
            className="text-sm"
            style={{ color: titleColor }}
            variants={itemVariants}
          >
            {title}
          </motion.div>
        </motion.div>
      </motion.div>

             {/* Controls */}
      <motion.div 
        className="flex items-center justify-center gap-4"
        variants={itemVariants}
      >
        <motion.button
          onClick={handlePlayPause}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 text-white"
          style={{ 
            backgroundColor: primaryButtonColor,
          }}
          variants={buttonVariants}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: primaryButtonHover,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }}
          whileTap="tap"
        >
          <motion.div
            key={isRunning ? "pause" : "play"}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 25
            }}
          >
            {isRunning ? (
              <Pause className="w-5 h-5" />
            ) : (
              <Play className="w-5 h-5 ml-0.5" />
            )}
          </motion.div>
        </motion.button>

        <motion.button
          onClick={handleReset}
          className="w-12 h-12 rounded-full flex items-center justify-center transition-colors"
          style={{ 
            backgroundColor: secondaryButtonColor,
            color: textColor
          }}
          variants={buttonVariants}
          whileHover={{ 
            scale: 1.05,
            backgroundColor: secondaryButtonHover,
            transition: { type: "spring", stiffness: 400, damping: 25 }
          }}
          whileTap="tap"
        >
          <RotateCcw className="w-5 h-5 text-gray-600" />
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
