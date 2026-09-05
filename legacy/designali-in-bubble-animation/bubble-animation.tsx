"use client"

import { useEffect, useRef, useState } from "react"

interface BubbleAnimationProps {
  width?: number
  height?: number
  totalBubbles?: number
  colors?: string[]
  className?: string
}

interface BubbleData {
  x: number
  y: number
  move: number
  color: string
  radius: number
}

const BubbleAnimation = ({
  width = 800,
  height = 600,
  totalBubbles = 25,
  colors = ["#018ddc", "#f12a00", "#ec6546", "#b0c90d"],
  className = "",
}: BubbleAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const bubblesRef = useRef<BubbleData[]>([])
  const [isClient, setIsClient] = useState(false)

  const PI2 = Math.PI * 2

  // Initialize bubbles
  const initializeBubbles = (canvasWidth: number, canvasHeight: number) => {
    bubblesRef.current = []
    for (let i = 0; i < totalBubbles; i++) {
      const bubble: BubbleData = {
        x: Math.random() * canvasWidth,
        y: Math.random() * canvasHeight,
        move: Math.random() * 5 - 10,
        color: colors[Math.floor(Math.random() * colors.length)],
        radius: Math.floor(Math.random() * 250),
      }
      bubblesRef.current.push(bubble)
    }
  }

  // Update bubble position
  const updateBubble = (bubble: BubbleData, time: number) => {
    bubble.x -= Math.sin(time + bubble.move) * bubble.move
    bubble.y += Math.cos(time - bubble.move) * bubble.move
  }

  // Draw bubble
  const drawBubble = (ctx: CanvasRenderingContext2D, bubble: BubbleData, time: number) => {
    updateBubble(bubble, time)
    ctx.beginPath()
    ctx.fillStyle = bubble.color
    ctx.arc(bubble.x, bubble.y, bubble.radius, 0, PI2, false)
    ctx.fill()
    ctx.closePath()
  }

  // Create gradient background
  const drawGradient = (ctx: CanvasRenderingContext2D, time: number, canvasWidth: number, canvasHeight: number) => {
    const centerX = canvasWidth / 2
    const centerY = canvasHeight / 2
    const x = centerX + Math.cos(time + 100) * 300
    const y = centerY + Math.sin(time + 100) * 300

    const grd = ctx.createRadialGradient(x, y, 0, canvasWidth, canvasHeight, canvasWidth)
    grd.addColorStop(0, "rgb(255, 252, 0)")
    grd.addColorStop(0.1, "rgb(1, 141, 220)")
    grd.addColorStop(0.8, "rgb(241, 42, 0)")
    grd.addColorStop(1, "rgb(176, 201, 13)")

    ctx.fillStyle = grd
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)
  }

  // Animation loop
  const animate = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const time = new Date().getTime() * 0.0005

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Apply blur filter
    ctx.filter = "blur(30px)"

    // Draw gradient background
    drawGradient(ctx, time, canvas.width, canvas.height)

    // Draw bubbles with lighter composite operation
    ctx.save()
    ctx.globalCompositeOperation = "lighter"

    bubblesRef.current.forEach((bubble) => {
      drawBubble(ctx, bubble, time)
    })

    ctx.restore()

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (!isClient) return

    const canvas = canvasRef.current
    if (!canvas) return

    // Set canvas size
    canvas.width = width
    canvas.height = height

    // Initialize bubbles
    initializeBubbles(width, height)

    // Start animation
    animate()

    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isClient, width, height, totalBubbles, colors])

  if (!isClient) {
    return <div style={{ width, height }} className={className} />
  }

  return <canvas ref={canvasRef} width={width} height={height} className={className} style={{ display: "block" }} />
}

export { BubbleAnimation }
