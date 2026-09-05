"use client"

import { useEffect, useRef } from "react"

type MatrixNoiseProps = {
  color?: string
  dim?: number
  fps?: number
  chars?: string
  fontFamily?: string
  className?: string
}

export function MatrixNoise({
  color = "#0000ff", 
  dim = 10,
  fps = 30,
  chars = "aA#!",
  fontFamily = "Montserrat, monospace",
  className = "",
}: MatrixNoiseProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const thenRef = useRef<number>(Date.now())

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const ratio = 0.43
    const dimOffset = dim
    const interval = 1000 / fps

    function setupSize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.font = `normal ${dim}px ${fontFamily}`
      ctx.fillStyle = color
    }

    function randomString(length: number, chars = "aA#!") {
      let mask = ""
      if (chars.includes("a")) mask += "abcdefghijklmnopqrstuvwxyz"
      if (chars.includes("A")) mask += "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
      if (chars.includes("#")) mask += "0123456789"
      if (chars.includes("!")) mask += "~`!@#$%^&*()_+-={}[]:\";',.<>?/|\\"
      let result = ""
      for (let i = 0; i < length; i++) {
        result += mask[Math.floor(Math.random() * mask.length)]
      }
      return result
    }

    function render() {
      const maxWidth = canvas.width / (dim * ratio)
      const maxHeight = canvas.height / dim
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (let i = 0; i < maxHeight; i++) {
        ctx.fillText(randomString(maxWidth, chars), 0, i * dim + dimOffset)
      }
    }

    function update() {
      const now = Date.now()
      const delta = now - thenRef.current
      if (delta >= interval) {
        thenRef.current = now - (delta % interval)
        render()
      }
      rafRef.current = window.requestAnimationFrame(update)
    }

    setupSize()
    rafRef.current = window.requestAnimationFrame(update)

    const onResize = () => {
      setupSize()
      render()
    }
    window.addEventListener("resize", onResize)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", onResize)
    }
  }, [color, dim, fps, chars, fontFamily])

  return (
    <div
      className={`fixed inset-0 w-full h-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
