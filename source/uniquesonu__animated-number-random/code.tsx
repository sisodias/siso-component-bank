"use client"

import React, { useState, useEffect } from "react"
import { motion, useSpring, useTransform } from "framer-motion"
import { ArrowUp } from "lucide-react"
import { cn } from "@/lib/utils"

const MotionArrowUp = motion.create(ArrowUp)

function AnimatedNumber({ 
  value, 
  format, 
  className = "",
  layoutId 
}) {
  const [displayValue, setDisplayValue] = useState(value)
  const spring = useSpring(value, { 
    stiffness: 100, 
    damping: 30,
    restDelta: 0.001
  })
  
  useEffect(() => {
    spring.set(value)
  }, [value, spring])

  useEffect(() => {
    return spring.on("change", (latest) => {
      setDisplayValue(latest)
    })
  }, [spring])

  const formatNumber = (num) => {
    if (format?.style === "currency") {
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: format.currency || "USD",
      }).format(num)
    }
    if (format?.style === "percent") {
      return new Intl.NumberFormat("en-US", {
        style: "percent",
        maximumFractionDigits: format.maximumFractionDigits || 2,
      }).format(num)
    }
    return num.toLocaleString()
  }

  return (
    <motion.span 
      className={className}
      layoutId={layoutId}
    >
      {formatNumber(displayValue)}
    </motion.span>
  )
}

export function AnimatedNumberRandom({
  value,
  diff,
}) {
  return (
    <span className="flex items-center justify-center gap-2">
      <AnimatedNumber
        value={value}
        className="text-5xl font-semibold text-foreground"
        format={{ style: "currency", currency: "USD" }}
      />
      <motion.span
        className={cn(
          diff > 0 
            ? "bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700" 
            : "bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700",
          "inline-flex items-center px-[0.3em] text-primary-foreground transition-colors duration-300 shadow-sm"
        )}
        style={{ borderRadius: 999 }}
        layout
        transition={{ layout: { duration: 0.9, bounce: 0, type: "spring" } }}
      >
        <MotionArrowUp
          className="mr-0.5 size-[0.75em]"
          strokeWidth={3}
          transition={{
            rotate: { type: "spring", duration: 0.5, bounce: 0 },
          }}
          animate={{ rotate: diff > 0 ? 0 : -180 }}
          initial={false}
        />
        <AnimatedNumber
          value={diff}
          className="font-semibold"
          format={{ style: "percent", maximumFractionDigits: 2 }}
          layoutId="diff-number"
        />
      </motion.span>
    </span>
  )
}

// Demo component to show it in action
export default function Demo() {
  const [value, setValue] = useState(1234.56)
  const [diff, setDiff] = useState(0.0523)

  const generateRandomValues = () => {
    setValue(Math.random() * 10000)
    setDiff((Math.random() - 0.5) * 0.2) // Random between -0.1 and 0.1
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background gap-8">
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-8">
        <AnimatedNumberRandom value={value} diff={diff} />
      </div>
      <button
        onClick={generateRandomValues}
        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
      >
        Generate Random Values
      </button>
    </div>
  )
}