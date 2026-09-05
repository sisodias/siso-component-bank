"use client"

import React, { useState, useRef, MouseEvent } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagnetButtonProps {
  children: React.ReactNode
  className?: string
  strength?: number
  radius?: number
}

export function MagnetButton({
  children,
  className,
  strength = 0.4,
  radius = 120,
}: MagnetButtonProps) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const xSpring = useSpring(x, { stiffness: 150, damping: 15 })
  const ySpring = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    const distance = Math.sqrt(
      Math.pow(e.clientX - centerX, 2) + Math.pow(e.clientY - centerY, 2)
    )

    if (distance < radius) {
      const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX)
      const force = (1 - distance / radius) * strength * 50

      x.set(Math.cos(angle) * force)
      y.set(Math.sin(angle) * force)
    }
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative", className)}
    >
      <motion.div style={{ x: xSpring, y: ySpring }}>
        {children}
      </motion.div>
    </div>
  )
}
