"use client"

import type React from "react"

import { useRef, useEffect, useState, useMemo } from "react"
import { motion, useAnimationFrame, useMotionValue, useTransform } from "framer-motion"

interface TextProps {
  text: string
  font: {
    fontFamily: string
    fontWeight: string
    fontSize: number
    letterSpacing: string
    lineHeight: string
  }
  color: string
  className?: string // Add className prop for theme support
}

interface CurvedLoopProps {
  text: TextProps
  direction: "left" | "right"
  baseVelocity: number
  curveAmount: number
  draggable: boolean
  fade: boolean
}

export default function CurvedLoop({
  text = {
    text: "21st.dev is npm for design engineers",
    font: {
      fontFamily: "sans-serif",
      fontWeight: "400",
      fontSize: 64,
      letterSpacing: "1px",
      lineHeight: "1.5em",
    },
    color: "#999999",
    className: "fill-gray-600 dark:fill-gray-300", // Add default theme classes
  },
  direction = "left",
  baseVelocity = 50,
  curveAmount = 300,
  draggable = true,
  fade = true,
}: Partial<CurvedLoopProps>) {
  const measureRef = useRef<SVGTextElement>(null)
  const tspansRef = useRef<(SVGTSpanElement | null)[]>([])
  const pathRef = useRef<SVGPathElement>(null)
  const [pathLength, setPathLength] = useState(0)
  const [spacing, setSpacing] = useState(0)

  // Use completely static IDs based on component props to ensure consistency
  const staticId = useMemo(() => {
    // Create a deterministic hash from props that will be consistent across SSR/client
    const propsString = `${text.text}-${curveAmount}-${direction}-${baseVelocity}`
    let hash = 0
    for (let i = 0; i < propsString.length; i++) {
      const char = propsString.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36)
  }, [text.text, curveAmount, direction, baseVelocity])

  const pathId = `curve-${staticId}`
  const fadeGradientId = `fadeGradient-${staticId}`
  const fadeMaskId = `fadeMask-${staticId}`
  const pathD = `M-100,400 Q720,${400 + curveAmount} 1540,400`

  const defaultVelocity = useMotionValue(1)
  const isDragging = useRef(false)
  const dragVelocity = useRef(0)

  // Transform scroll velocity into a factor that affects marquee speed
  const velocityFactor = useTransform(defaultVelocity, [0, 1000], [0, 5], {
    clamp: false,
  })

  // Convert baseVelocity to the correct direction
  const actualBaseVelocity = direction === "left" ? -baseVelocity : baseVelocity

  // Reference to track if mouse is hovering
  const isHovered = useRef(false)

  // Direction factor for changing direction based on scroll or drag
  const directionFactor = useRef(1)

  // Process text to ensure proper spacing
  const processedText = useMemo(() => {
    // Remove any trailing spaces first
    const trimmedText = text.text.trim()
    // Add more non-breaking spaces to ensure visible gap between repetitions
    return trimmedText + "\u00A0\u00A0\u00A0\u00A0"
  }, [text.text])

  // Measure text width and set up path
  useEffect(() => {
    if (measureRef.current) {
      setSpacing(measureRef.current.getComputedTextLength())
    }
  }, [text])

  useEffect(() => {
    if (pathRef.current) {
      setPathLength(pathRef.current.getTotalLength())
    }
  }, [curveAmount])

  // Calculate number of repeats needed based on path length and text spacing
  const calculatedRepeats = Math.ceil(pathLength / spacing) + 2
  const ready = pathLength > 0 && spacing > 0

  useAnimationFrame((t, delta) => {
    if (!ready || tspansRef.current.length === 0) return

    if (isDragging.current) {
      // Apply drag velocity directly to text positions
      tspansRef.current.forEach((tspan) => {
        if (!tspan) return
        let x = Number.parseFloat(tspan.getAttribute("x") || "0")
        x += dragVelocity.current

        // Wrap text around when it goes off screen
        const maxX = (tspansRef.current.length - 1) * spacing
        if (x < -spacing) x = maxX
        if (x > maxX) x = -spacing

        tspan.setAttribute("x", x.toString())
      })

      // Add decay to dragVelocity when not moving
      dragVelocity.current *= 0.9

      // Stop completely if velocity is very small
      if (Math.abs(dragVelocity.current) < 0.01) {
        dragVelocity.current = 0
      }
      return
    }

    // Calculate regular movement
    let moveBy = directionFactor.current * actualBaseVelocity * (delta / 1000)

    // Adjust movement based on scroll velocity
    if (!isDragging.current) {
      if (velocityFactor.get() < 0) {
        directionFactor.current = -1
      } else if (velocityFactor.get() > 0) {
        directionFactor.current = 1
      }
    }

    moveBy += directionFactor.current * moveBy * velocityFactor.get()
    moveBy += dragVelocity.current

    // Gradually decay drag velocity back to zero
    if (!isDragging.current && Math.abs(dragVelocity.current) > 0.01) {
      dragVelocity.current *= 0.96
    } else if (!isDragging.current) {
      dragVelocity.current = 0
    }

    // Apply movement to each text span
    tspansRef.current.forEach((tspan) => {
      if (!tspan) return
      let x = Number.parseFloat(tspan.getAttribute("x") || "0")
      x += moveBy

      // Wrap text around when it goes off screen
      const maxX = (tspansRef.current.length - 1) * spacing
      if (x < -spacing) x = maxX
      if (x > maxX) x = -spacing

      tspan.setAttribute("x", x.toString())
    })
  })

  const lastPointerPosition = useRef({ x: 0, y: 0 })

  const handlePointerDown = (e: React.PointerEvent<SVGTextElement>) => {
    if (!draggable) return
    e.currentTarget.setPointerCapture(e.pointerId)
    ;(e.currentTarget as any).style.cursor = "grabbing"
    isDragging.current = true
    lastPointerPosition.current = { x: e.clientX, y: e.clientY }

    // Pause automatic animation by setting velocity to 0
    dragVelocity.current = 0
  }

  const handlePointerMove = (e: React.PointerEvent<SVGTextElement>) => {
    if (!draggable) return
    if (!isDragging.current) return

    const currentPosition = { x: e.clientX, y: e.clientY }

    // Calculate delta from last position
    const deltaX = currentPosition.x - lastPointerPosition.current.x

    // Update drag velocity based on horizontal movement
    dragVelocity.current = deltaX * 0.3

    // Update last position
    lastPointerPosition.current = currentPosition
  }

  const handlePointerUp = (e: React.PointerEvent<SVGTextElement>) => {
    if (!draggable) return
    e.currentTarget.releasePointerCapture(e.pointerId)
    ;(e.currentTarget as any).style.cursor = "grab"
    isDragging.current = false
  }

  const cursorStyle = draggable ? (isDragging.current ? "grabbing" : "grab") : "default"

  return (
    <motion.div
      onHoverStart={() => (isHovered.current = true)}
      onHoverEnd={() => (isHovered.current = false)}
      style={{
        visibility: ready ? "visible" : "hidden",
        minHeight: "100vh",
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        viewBox="0 0 1440 800"
        className={text.className} // Add className support
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          userSelect: "none",
          width: "100%",
          aspectRatio: "1440 / 800",
          overflow: "visible",
          display: "block",
          fill: text.className ? undefined : text.color, // Use fill only if no className
          fontFamily: text.font.fontFamily,
          fontSize: text.font.fontSize,
          letterSpacing: text.font.letterSpacing,
          lineHeight: text.font.lineHeight,
        }}
      >
        <text
          ref={measureRef}
          xmlSpace="preserve"
          style={{
            visibility: "hidden",
            opacity: 0,
            pointerEvents: "none",
            cursor: cursorStyle,
          }}
        >
          {processedText}
        </text>

        <defs>
          <path ref={pathRef} id={pathId} d={pathD} fill="none" stroke="transparent" />
          {fade && (
            <>
              <linearGradient id={fadeGradientId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="white" stopOpacity="0" />
                <stop offset="15%" stopColor="white" stopOpacity="1" />
                <stop offset="80%" stopColor="white" stopOpacity="1" />
                <stop offset="100%" stopColor="white" stopOpacity="0" />
              </linearGradient>
              <mask id={fadeMaskId}>
                <rect width="100%" height="100%" fill={`url(#${fadeGradientId})`} />
              </mask>
            </>
          )}
        </defs>

        {ready && (
          <text
            fontWeight={text.font.fontWeight}
            xmlSpace="preserve"
            mask={fade ? `url(#${fadeMaskId})` : undefined}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          >
            <textPath href={`#${pathId}`} xmlSpace="preserve">
              {Array.from({ length: calculatedRepeats }).map((_, i) => (
                <tspan
                  key={i}
                  x={i * spacing}
                  ref={(el) => {
                    if (el) tspansRef.current[i] = el
                  }}
                >
                  {processedText}
                </tspan>
              ))}
            </textPath>
          </text>
        )}
      </svg>
    </motion.div>
  )
}
