"use client"

import { useEffect, useRef } from "react"

interface InteractiveDotsProps {
  dotColor?: string
  dotSize?: number
  className?: string
}

export function InteractiveDots({
  dotColor = "#F44336",
  dotSize = 20,
  className = "",
}: InteractiveDotsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mousePos = useRef({ x: 0, y: 0 })
  const frameCountRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Constants
    const CIRCLE_W = dotSize
    const ACTUAL_W = CIRCLE_W * 0.72
    const MIN_W = 0
    const CIRCLE_DIST = CIRCLE_W / 2
    const COLS = Math.ceil(canvas.width / CIRCLE_DIST) + 1
    const ROWS = Math.ceil(canvas.height / CIRCLE_DIST) + 1
    const GREATER = Math.max(canvas.width, canvas.height)

    // Simple noise function for organic motion
    const noise = (x: number, y: number, z: number) => {
      const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453
      return n - Math.floor(n)
    }

    // Dot class
    class Dot {
      position: { x: number; y: number }

      constructor(posX: number, posY: number) {
        this.position = { x: posX, y: posY }
      }

      calcWidth(): number {
        const dx = mousePos.current.x - this.position.x
        const dy = mousePos.current.y - this.position.y
        let delta = Math.sqrt(dx * dx + dy * dy)

        // Add noise variation
        const noiseVal = noise(this.position.x, this.position.y, frameCountRef.current)
        const noiseMap = 0.7 + noiseVal * 0.5
        delta *= noiseMap

        if (delta > GREATER / 2) {
          delta = GREATER / 2
        }

        return ACTUAL_W - (delta / (GREATER / 2)) * (ACTUAL_W - MIN_W)
      }

      render() {
        const w = this.calcWidth()
        ctx!.fillStyle = dotColor
        ctx!.beginPath()
        ctx!.arc(this.position.x, this.position.y, w / 2, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    // Create dots grid
    const dots: Dot[] = []
    for (let ci = 0; ci < COLS; ci++) {
      for (let ri = 0; ri < ROWS; ri++) {
        dots.push(new Dot(ci * CIRCLE_DIST, ri * CIRCLE_DIST))
      }
    }

    // Mouse and touch tracking
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY }
    }

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mousePos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
      }
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("touchmove", handleTouchMove)

    // Animation loop
    const animate = () => {
      // Transparent background
      ctx!.clearRect(0, 0, canvas.width, canvas.height)

      dots.forEach((dot) => dot.render())

      frameCountRef.current++
      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("touchmove", handleTouchMove)
    }
  }, [dotColor, dotSize])

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-screen ${className}`}
      style={{ display: "block", background: "transparent" }}
    />
  )
}
