"use client"

import { useEffect, useRef, useState } from "react"

interface InteractiveLinesProps {
  /** Color of the lines in rgba format */
  lineColor?: string
  /** Separation between grid points */
  separation?: number
  /** Maximum distance for line interaction */
  maxDistance?: number
  /** Maximum radius for line bending */
  maxRadius?: number
  /** Minimum radius for line bending */
  minRadius?: number
  /** Animation smoothing factor (1-20, higher = smoother) */
  smoothing?: number
  /** Canvas width (defaults to window width) */
  width?: number
  /** Canvas height (defaults to window height) */
  height?: number
  /** Additional CSS classes */
  className?: string
}

interface Line {
  x0: number
  y0: number
  x: number
  y: number
  radio: number
  alpha: number
  lineWidth: number
  color: string
  update: (mouse: { x: number; y: number }, maxDist: number, maxRadio: number) => void
  draw: (context: CanvasRenderingContext2D) => void
}

export function InteractiveLines({
  lineColor = "#fff200",
  separation = 80,
  maxDistance = 100,
  maxRadius,
  minRadius = 1,
  smoothing = 10,
  width,
  height,
  className = "bg-background",
}: InteractiveLinesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  const mouseRef = useRef({ x: 0, y: 0 })
  const cursorRef = useRef({ x: 0, y: 0 })
  const linesRef = useRef<Line[]>([])

  // Calculate max radius based on separation if not provided
  const calculatedMaxRadius = maxRadius || separation / 2

  useEffect(() => {
    const updateDimensions = () => {
      const newWidth = width || window.innerWidth
      const newHeight = height || window.innerHeight
      setDimensions({ width: newWidth, height: newHeight })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [width, height])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !dimensions.width || !dimensions.height) return

    const context = canvas.getContext("2d")
    if (!context) return

    // Set canvas size
    canvas.width = dimensions.width
    canvas.height = dimensions.height
    canvas.style.width = dimensions.width + "px"
    canvas.style.height = dimensions.height + "px"

    // Initialize cursor position
    cursorRef.current = {
      x: dimensions.width / 2,
      y: dimensions.height / 2,
    }

    // Create Line class
    const createLine = (x: number, y: number): Line => ({
      x0: x,
      y0: y,
      x: x,
      y: y,
      radio: 0,
      alpha: 1,
      lineWidth: 1,
      color: lineColor,

      update(mouse: { x: number; y: number }, maxDist: number, maxRadio: number) {
        const dx = mouse.x - this.x0
        const dy = mouse.y - this.y0
        const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
        const angle = Math.atan2(dx, dy)
        const near = Math.min(dist / maxDist, 1)

        this.radio = near * maxRadio
        this.x = Math.sin(angle) * this.radio + this.x0
        this.y = Math.cos(angle) * this.radio + this.y0
        this.alpha = 1 - near * 0.5
        this.lineWidth = this.alpha * 5

        // Extract base color and apply alpha
        const baseColor = lineColor.includes("rgba")
          ? lineColor.replace(/[\d.]+\)$/g, `${this.alpha})`)
          : lineColor.replace("rgb", "rgba").replace(")", `, ${this.alpha})`)
        this.color = baseColor
      },

      draw(context: CanvasRenderingContext2D) {
        context.beginPath()
        context.moveTo(this.x0, this.y0)
        context.lineTo(this.x, this.y)
        context.lineWidth = this.lineWidth
        context.strokeStyle = this.color
        context.stroke()
      },
    })

    // Create grid of lines
    const lines: Line[] = []
    for (let x = 0; x <= dimensions.width; x += separation) {
      for (let y = 0; y <= dimensions.height; y += separation) {
        lines.push(createLine(x, y))
      }
    }
    linesRef.current = lines

    // Mouse/touch event handlers
    const handlePointerMove = (event: MouseEvent | TouchEvent) => {
      event.preventDefault()
      const rect = canvas.getBoundingClientRect()
      const point = "touches" in event ? event.touches[0] : event
      cursorRef.current = {
        x: point.clientX - rect.left,
        y: point.clientY - rect.top,
      }
    }

    // Animation loop
    const animate = () => {
      // Smooth mouse movement
      mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / smoothing
      mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / smoothing

      // Clear canvas
      context.clearRect(0, 0, dimensions.width, dimensions.height)
      context.lineCap = "round"

      // Update and draw lines
      linesRef.current.forEach((line) => {
        line.update(mouseRef.current, maxDistance, calculatedMaxRadius)
        line.draw(context)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Add event listeners
    canvas.addEventListener("mousemove", handlePointerMove)
    canvas.addEventListener("touchmove", handlePointerMove, { passive: false })

    // Start animation
    animate()

    // Cleanup
    return () => {
      canvas.removeEventListener("mousemove", handlePointerMove)
      canvas.removeEventListener("touchmove", handlePointerMove)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, lineColor, separation, maxDistance, calculatedMaxRadius, smoothing])

  return (
    <canvas
      ref={canvasRef}
      className={className} 
    />
  )
}
