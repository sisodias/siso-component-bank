"use client"

import { useEffect, useRef } from "react"

interface BezierAnimationProps {
  pointsNumber?: number
  backgroundColor?: string
  lineWidthMax?: number
  animationSpeed?: number
  colorMode?: "rainbow" | "solid"
  solidColor?: string
  className?: string
}

interface Point {
  startPoint: [number, number]
  endPoint: [number, number]
  previousPoint: [number, number]
  nextPoint: [number, number]
  bezierPoint1: [number, number]
  bezierPoint2: [number, number]
  moveCount: number
  moveCountCheck: number
  color: string | null
  lineWidth: number
  cap: string
  speed: number
}

export function BezierAnimation({
  pointsNumber = 300,
  backgroundColor = "rgba(0,0,0,0)",  
  lineWidthMax = 15,
  animationSpeed = 0.4,
  colorMode = "rainbow",
  solidColor = "#ffffff",
  className = "",
}: BezierAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const w = (canvas.width = window.innerWidth)
    const h = (canvas.height = window.innerHeight)
    const c = canvas.getContext("2d", { alpha: true })  
    if (!c) return

    const pointsObjectArray: Point[] = []
    let frameCount = 1

    // Random helper
    const random = (v: number): number => Math.random() * v

    // Bézier interpolation
    const bezierLine = (points: [number, number][], frame: number): [number, number] => {
      frame = frame / 400
      const t = frame
      const mt = 1 - t
      let x = 0
      let y = 0
      switch (points.length) {
        case 2:
          x = mt * points[0][0] + t * points[1][0]
          y = mt * points[0][1] + t * points[1][1]
          break
        case 3:
          x = mt * mt * points[0][0] + 2 * mt * t * points[1][0] + t * t * points[2][0]
          y = mt * mt * points[0][1] + 2 * mt * t * points[1][1] + t * t * points[2][1]
          break
        case 4:
          x =
            mt * mt * mt * points[0][0] +
            3 * mt * mt * t * points[1][0] +
            3 * mt * t * t * points[2][0] +
            t * t * t * points[3][0]
          y =
            mt * mt * mt * points[0][1] +
            3 * mt * mt * t * points[1][1] +
            3 * mt * t * t * points[2][1] +
            t * t * t * points[3][1]
          break
      }
      return [x, y]
    }

    // Point class
    class PointClass implements Point {
      startPoint: [number, number]
      endPoint: [number, number]
      previousPoint: [number, number]
      nextPoint: [number, number]
      bezierPoint1: [number, number]
      bezierPoint2: [number, number]
      moveCount: number
      moveCountCheck: number
      color: string | null
      lineWidth: number
      cap: string
      speed: number

      constructor() {
        this.startPoint = [random(w), random(h)]
        this.endPoint = [random(w), random(h)]
        this.previousPoint = this.startPoint
        this.nextPoint = [0, 0]
        this.bezierPoint1 = [random(w), random(h)]
        this.bezierPoint2 = [random(w), random(h)]
        this.moveCount = 0
        this.moveCountCheck = 0
        this.color = null
        this.lineWidth = random(lineWidthMax)
        this.cap = "round"
        this.speed = animationSpeed
      }

      update(frame: number) {
        frame = frame * this.speed
        this.nextPoint = bezierLine(
          [this.previousPoint, this.bezierPoint1, this.bezierPoint2, this.endPoint],
          frame,
        )

        c.beginPath()
        c.moveTo(this.previousPoint[0], this.previousPoint[1])
        c.lineTo(this.nextPoint[0], this.nextPoint[1])

        if (colorMode === "rainbow") {
          c.strokeStyle = `hsla(${(frame * 5) % 360}, 100%, ${50 + random(50)}%, 0.8)`
        } else {
          c.strokeStyle = solidColor
        }

        c.lineWidth = this.lineWidth
        c.lineCap = this.cap as CanvasLineCap
        c.stroke()

        this.previousPoint = this.nextPoint

        // Reset when path completes
        if (frame > 400) {
          this.startPoint = this.endPoint
          this.endPoint = [random(w), random(h)]
          this.bezierPoint1 = [random(w), random(h)]
          this.bezierPoint2 = [random(w), random(h)]
          this.previousPoint = this.startPoint
        }
      }
    }

    // Initialize points
    for (let i = 0; i < pointsNumber; i++) {
      pointsObjectArray.push(new PointClass())
    }

    // Main animation loop
    const loop = () => { 
      c.fillStyle = backgroundColor === "transparent" ? "rgba(0,0,0,0)" : backgroundColor
      c.clearRect(0, 0, w, h)
      for (const p of pointsObjectArray) p.update(frameCount)
    
      requestAnimationFrame(loop)
    }

    loop()

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [pointsNumber, backgroundColor, lineWidthMax, animationSpeed, colorMode, solidColor])

  return (
    <canvas
      ref={canvasRef}
      className={`block w-full h-screen ${className}`}
      style={{
        backgroundColor: "transparent", // ✅ ensure transparency
        display: "block",
      }}
    />
  )
}
