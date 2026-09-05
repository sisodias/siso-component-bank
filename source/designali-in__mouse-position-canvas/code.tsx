"use client"

import { useEffect, useRef } from "react"

type MousePositionCanvasProps = {
  colors?: string[]
  gridSize?: number
  particleCount?: number
  fadeSpeed?: number
  className?: string
  transparentBackground?: boolean
}

export function MousePositionCanvas({
  colors = ["#ff0000", "#00ff00", "#0000ff"],
  gridSize = 8,
  particleCount = 200,
  fadeSpeed = 0.01,
  className = "",
  transparentBackground = true,
}: MousePositionCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d", { alpha: transparentBackground })
    if (!ctx) return

    let width = window.innerWidth
    let height = window.innerHeight
    let pixels: Array<[number, number, number, number, string, number]> = []
    const coloredPixels: Array<{
      x: number
      y: number
      alpha: number
      color: string
      vx: number
      vy: number
    }> = []
    let currentPixel = 0
    const mousePosition = { x: width / 2, y: height / 2 }

    const drawGrid = () => {
      ctx.clearRect(0, 0, width, height)

      for (let i = 0; i < pixels.length; i++) {
        pixels[i][4] = transparentBackground ? "transparent" : "#222"
        pixels[i][5] = 1
      }

      for (let i = 0; i < coloredPixels.length; i++) {
        const pix =
          Math.floor(coloredPixels[i].y / gridSize) * (Math.floor(width / gridSize) + 1) +
          Math.floor(coloredPixels[i].x / gridSize)
        if (pixels[pix]) {
          pixels[pix][4] = coloredPixels[i].color
          pixels[pix][5] = coloredPixels[i].alpha
        }

        if (coloredPixels[i].alpha > 0) coloredPixels[i].alpha -= fadeSpeed
        if (coloredPixels[i].alpha < 0) coloredPixels[i].alpha = 0
        coloredPixels[i].x += coloredPixels[i].vx
        coloredPixels[i].y += coloredPixels[i].vy
      }

      for (let i = 0; i < pixels.length; i++) {
        ctx.globalAlpha = pixels[i][5]
        ctx.fillStyle = pixels[i][4]
        ctx.fillRect(pixels[i][0], pixels[i][1], pixels[i][2], pixels[i][3])
      }
    }

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width
      canvas.height = height
      pixels = []
      for (let y = 0; y < height / gridSize; y++) {
        for (let x = 0; x < width / gridSize; x++) {
          pixels.push([x * gridSize, y * gridSize, gridSize - 2, gridSize - 2, "transparent", 1])
        }
      }
    }

    const initColoredPixels = () => {
      for (let i = 0; i < particleCount; i++) {
        coloredPixels.push({
          x: width / 2,
          y: height / 2,
          alpha: 0,
          color: colors[i % colors.length],
          vx: -1 + Math.random() * 2,
          vy: -1 + Math.random() * 2,
        })
      }
    }

    const launchPixel = () => {
      coloredPixels[currentPixel].x = mousePosition.x
      coloredPixels[currentPixel].y = mousePosition.y
      coloredPixels[currentPixel].alpha = 1

      currentPixel++
      if (currentPixel > particleCount - 1) currentPixel = 0
    }

    const draw = () => {
      launchPixel()
      launchPixel()
      drawGrid()
      requestAnimationFrame(draw)
    }

    // Initialize
    resize()
    initColoredPixels()
    draw()

    // Event listeners
    const handleResize = () => resize()
    const handleMouseMove = (e: MouseEvent) => {
      mousePosition.x = e.pageX
      mousePosition.y = e.pageY
    }
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      mousePosition.x = e.touches[0].pageX
      mousePosition.y = e.touches[0].pageY
    }

    window.addEventListener("resize", handleResize)
    window.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("touchstart", handleTouchMove)
    document.addEventListener("touchmove", handleTouchMove)

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchstart", handleTouchMove)
      document.removeEventListener("touchmove", handleTouchMove)
    }
  }, [colors, gridSize, particleCount, fadeSpeed, transparentBackground])

  return (
    <div className={`fixed inset-0 overflow-hidden pointer-events-none ${className}`}>
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        width={100}
        height={100}
        style={{ background: transparentBackground ? "transparent" : "#000" }}
      />
    </div>
  )
}
