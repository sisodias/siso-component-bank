"use client"

import { useEffect, useRef } from "react"

interface InteractiveCanvasProps {
  gridWidth?: number
  gridHeight?: number
  dotColor?: string
  lineColor?: string
  backgroundColor?: string
  padding?: number
  maxDistance?: number
  dotSizeMultiplier?: number
}

export function InteractiveCanvas({
  gridWidth = 120,
  gridHeight = 120,
  dotColor = "#0000ff",
  lineColor = "#5555550",
  backgroundColor = "transparent", // default to transparent
  padding = 0,
  maxDistance = 2,
  dotSizeMultiplier = 200,
}: InteractiveCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0 })
  const dotsRef = useRef<
    Array<{ x: number; y: number; ox: number; oy: number; size?: number; angle?: number }>
  >([])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: true }) // enable transparency
    if (!ctx) return

    const ratio = window.devicePixelRatio || 1

    const handleResize = () => {
      canvas.width = window.innerWidth * ratio
      canvas.height = window.innerHeight * ratio
      ctx.scale(ratio, ratio)
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.pageX * ratio
      mouseRef.current.y = e.pageY * ratio
    }

    window.addEventListener("mousemove", handleMouseMove)

    const createDots = () => {
      dotsRef.current = []
      const canvasWidth = canvas.width / ratio
      const canvasHeight = canvas.height / ratio

      for (let i = 0; i < gridWidth; i++) {
        const x = Math.floor(((canvasWidth - padding * 2) / (gridWidth - 1)) * i + padding)

        for (let j = 0; j < gridHeight; j++) {
          const y = Math.floor(((canvasHeight - padding * 2) / (gridHeight - 1)) * j + padding)

          dotsRef.current.push({
            x: x * ratio,
            y: y * ratio,
            ox: x * ratio,
            oy: y * ratio,
          })
        }
      }
    }

    createDots()

    const getDistance = (obj1: { x: number; y: number }, obj2: { x: number; y: number }) => {
      const dx = obj1.x - obj2.x
      const dy = obj1.y - obj2.y
      return Math.sqrt(dx * dx + dy * dy)
    }

    const getAngle = (obj1: { x: number; y: number }, obj2: { x: number; y: number }) => {
      const dX = obj2.x - obj1.x
      const dY = obj2.y - obj1.y
      return (Math.atan2(dY, dX) / Math.PI) * 180
    }

    const getVector = (dot: (typeof dotsRef.current)[0]) => {
      const d = getDistance(dot, mouseRef.current)
      dot.size = (dotSizeMultiplier - d) / 20
      dot.size = dot.size < 1 ? 1 : dot.size
      dot.angle = getAngle(dot, mouseRef.current)

      const distance = d > maxDistance ? maxDistance : d
      return {
        x: distance * Math.cos((dot.angle * Math.PI) / 180),
        y: distance * Math.sin((dot.angle * Math.PI) / 180),
      }
    }

    const circleMethod = function (x: number, y: number, r: number) {
      this.beginPath()
      this.arc(x, y, r, 0, 2 * Math.PI, false)
      this.closePath()
    }
    ;(ctx as any).circle = circleMethod

    const animate = () => {
      // Transparent background handling
      if (backgroundColor && backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      }

      ctx.fillStyle = dotColor

      // Draw lines
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i]
        const v = getVector(dot)

        ctx.beginPath()
        ctx.moveTo(dot.x / ratio, dot.y / ratio)
        ctx.lineTo((dot.x + v.x) / ratio, (dot.y + v.y) / ratio)
        ctx.strokeStyle = lineColor
        ctx.lineWidth = 1
        ctx.stroke()
        ctx.closePath()
      }

      // Draw dots
      for (let i = 0; i < dotsRef.current.length; i++) {
        const dot = dotsRef.current[i]
        const v = getVector(dot)
        ;(ctx as any).circle((dot.x + v.x) / ratio, (dot.y + v.y) / ratio, (dot.size || 1) / 2)
        ctx.fill()
      }

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
    }
  }, [gridWidth, gridHeight, dotColor, lineColor, backgroundColor, padding, maxDistance, dotSizeMultiplier])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-screen h-screen"
      style={{
        display: "block",
        margin: 0,
        overflow: "hidden",
        background: "transparent", // ensure CSS transparency
      }}
    />
  )
}
