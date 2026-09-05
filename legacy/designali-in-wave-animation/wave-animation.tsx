"use client"

import { useEffect, useRef } from "react"

export function WaveAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size to full window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const palette = ["#005f73", "#0a9396", "#94d2bd", "#e9d8a6", "#ee9b00", "#ca6702", "#bb3e03", "#ae2012", "#9b2226"]

    const animate = (timeStart: number) => (time: number) => {
      requestAnimationFrame(() => animate(timeStart)(Date.now() + timeStart))

      let x = 0
      const arr = Array(20)

      // Semi-transparent overlay for trailing effect
      ctx.fillStyle = `rgba(0, 0, 0, 0.03)`
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Create wave bars
      for (let i = 0; i < arr.length; i++) {
        arr[i] = 2 - (Math.sin(i + time / 200) / 2) * canvas.height

        const r = arr[i]
        ctx.fillStyle = palette[Math.floor(i + time / 200) % palette.length]
        const w = 100
        ctx.fillRect(x, canvas.height / 2, w, arr[i])
        x += w
      }
    }

    // Start animations with different time offsets
    animate(0)(0)
    animate(100)(0)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  return (
    <div className="fixed inset-0 w-full h-full">
      <canvas
        ref={canvasRef}
        id="c"
        className="block"
        style={{
          margin: 0,
          padding: 0,
          display: "block",
        }}
      />
    </div>
  )
}
