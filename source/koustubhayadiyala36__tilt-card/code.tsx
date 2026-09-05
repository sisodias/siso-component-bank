"use client"

import { useRef, MouseEvent, ReactNode } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface TiltCardProps {
  children: ReactNode
  className?: string
  maxTilt?: number
  scale?: number
  glare?: boolean
}

export function TiltCard({
  children,
  className,
  maxTilt = 12,
  scale = 1.03,
  glare = true,
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null)

  const rotateX = useMotionValue(0)
  const rotateY = useMotionValue(0)
  const scaleValue = useMotionValue(1)

  const rotateXSpring = useSpring(rotateX, { stiffness: 200, damping: 20 })
  const rotateYSpring = useSpring(rotateY, { stiffness: 200, damping: 20 })
  const scaleSpring = useSpring(scaleValue, { stiffness: 200, damping: 20 })

  const glareX = useTransform(rotateY, (value) => value * -2)
  const glareY = useTransform(rotateX, (value) => value * 2)

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return

    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const x = e.clientX - rect.left - centerX
    const y = e.clientY - rect.top - centerY

    const rotX = (y / centerY) * maxTilt
    const rotY = (x / centerX) * -maxTilt

    rotateX.set(rotX)
    rotateY.set(rotY)
    scaleValue.set(scale)
  }

  const handleMouseLeave = () => {
    rotateX.set(0)
    rotateY.set(0)
    scaleValue.set(1)
  }

  return (
    <motion.div
      ref={ref}
      style={{
        perspective: "1000px",
        rotateX: rotateXSpring,
        rotateY: rotateYSpring,
        scale: scaleSpring,
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn("relative will-change-transform", className)}
    >
      {glare && (
        <motion.div
          style={{
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.2), transparent 60%)`
            ),
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
          }}
        />
      )}
      {children}
    </motion.div>
  )
}
