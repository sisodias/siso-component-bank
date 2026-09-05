"use client"

import React, { useEffect, useState } from "react"
import { motion, useSpring, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CountdownProps {
  endDate: Date
  startDate?: Date
  className?: string
}

interface TimeLeft {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function AnimatedDigit({ 
  value, 
  className = "",
  minimumIntegerDigits = 1 
}) {
  const [displayValue, setDisplayValue] = useState(value)
  const [prevValue, setPrevValue] = useState(value)
  
  const spring = useSpring(value, { 
    stiffness: 300, 
    damping: 30,
    restDelta: 0.001
  })

  useEffect(() => {
    if (value !== prevValue) {
      setPrevValue(displayValue)
      spring.set(value)
    }
  }, [value, spring, prevValue, displayValue])

  useEffect(() => {
    return spring.on("change", (latest) => {
      setDisplayValue(Math.round(latest))
    })
  }, [spring])

  const formatNumber = (num) => {
    return num.toString().padStart(minimumIntegerDigits, '0')
  }

  return (
    <motion.div 
      className={cn("relative overflow-hidden", className)}
      key={value}
    >
      <AnimatePresence mode="wait">
        <motion.span
          key={displayValue}
          initial={{ y: value > prevValue ? -20 : 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: value > prevValue ? 20 : -20, opacity: 0 }}
          transition={{ 
            type: "spring", 
            stiffness: 400, 
            damping: 30,
            duration: 0.3
          }}
          className="block"
        >
          {formatNumber(displayValue)}
        </motion.span>
      </AnimatePresence>
    </motion.div>
  )
}

function TimeUnit({ 
  value, 
  label, 
  isLast = false 
}) {
  return (
    <>
      <div className="flex flex-col items-center">
        <div className="relative">
          <div className="bg-card border border-border rounded-lg p-4 shadow-sm min-w-[80px] flex items-center justify-center">
            <AnimatedDigit
              value={value}
              className="text-4xl md:text-5xl font-bold font-mono text-foreground tracking-tighter"
              minimumIntegerDigits={2}
            />
          </div>
          {/* Subtle glow effect */}
          <div className="absolute inset-0 bg-primary/5 rounded-lg blur-xl -z-10" />
        </div>
        <span className="text-xs md:text-sm text-muted-foreground mt-2 font-medium uppercase tracking-wide">
          {label}
        </span>
      </div>
      {!isLast && (
        <motion.div 
          className="text-2xl md:text-3xl font-bold text-muted-foreground/60 self-start mt-4"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ 
            duration: 1, 
            repeat: Infinity, 
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          :
        </motion.div>
      )}
    </>
  )
}

export function AnimatedNumberCountdown({
  endDate,
  startDate,
  className,
}: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  })

  const [isExpired, setIsExpired] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const end = new Date(endDate).getTime()
      const difference = end - now

      if (difference > 0) {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24))
        const hours = Math.floor((difference / (1000 * 60 * 60)) % 24)
        const minutes = Math.floor((difference / 1000 / 60) % 60)
        const seconds = Math.floor((difference / 1000) % 60)
        
        setTimeLeft({ days, hours, minutes, seconds })
        setIsExpired(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsExpired(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [endDate, startDate])

  if (isExpired) {
    return (
      <motion.div 
        className={cn("flex items-center justify-center", className)}
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="text-center p-8 rounded-lg bg-card border border-border shadow-lg">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="text-6xl mb-4"
          >
            🎉
          </motion.div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Time's Up!</h2>
          <p className="text-muted-foreground">The countdown has ended</p>
        </div>
      </motion.div>
    )
  }

  return (
    <motion.div 
      className={cn("flex items-center justify-center gap-6 md:gap-8", className)}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <TimeUnit value={timeLeft.days} label="Days" />
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <TimeUnit value={timeLeft.seconds} label="Seconds" isLast />
    </motion.div>
  )
}

// Demo component
export default function Demo() {
  // Set end date to 2 minutes from now for demo
  const [endDate] = useState(new Date(Date.now() + 2 * 60 * 1000))
  
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Countdown Timer
          </h1>
          <p className="text-muted-foreground">
            Demo countdown ending in 2 minutes
          </p>
        </div>
        
        <AnimatedNumberCountdown 
          endDate={endDate}
          className="mb-8"
        />
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Target: {endDate.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}