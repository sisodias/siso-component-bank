"use client"

import { useEffect, useRef } from "react"

interface VectorFieldProps {
  backgroundColor?: string  
  lineColor?: string
  lineWeight?: number
  proximity?: number
  vectorSize?: number
  fullHeight?: boolean
  transparent?: boolean  
}

export function VectorField({
  backgroundColor,
  lineColor = "blue",
  lineWeight = 4,
  proximity = 8,
  vectorSize = 10,
  fullHeight = true,
  transparent = true,
}: VectorFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const vectorsRef = useRef<Array<{ x: number; y: number }>>([])
  const mouseRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initializeVectors()
    }

    const initializeVectors = () => {
      vectorsRef.current = []
      const row = Math.ceil(canvas.width / proximity) + 1
      const column = Math.ceil(canvas.height / proximity) + 1

      for (let j = 0; j < column; j++) {
        for (let i = 0; i < row; i++) {
          vectorsRef.current.push({
            x: proximity * i,
            y: proximity * j,
          })
        }
      }
    }

    const calcVec = (x: number, y: number) => {
      const newX = y - x
      const newY = -x - y
      return Math.atan2(newY, newX)
    }

    const animate = () => {
     
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
      const effectiveBg = backgroundColor ?? (prefersDark ? "black" : "white")

      if (transparent) {
        ctx.clearRect(0, 0, canvas.width, canvas.height)
      } else {
        ctx.fillStyle = effectiveBg
        ctx.fillRect(0, 0, canvas.width, canvas.height)
      }

      ctx.strokeStyle = lineColor
      ctx.lineWidth = lineWeight
      ctx.lineCap = "round"

      vectorsRef.current.forEach((vector) => {
        const dx = vector.x - mouseRef.current.x
        const dy = vector.y - mouseRef.current.y
        const heading = calcVec(dx, dy)

        ctx.beginPath()
        ctx.moveTo(vector.x, vector.y)
        ctx.lineTo(
          vector.x + vectorSize * Math.cos(heading),
          vector.y + vectorSize * Math.sin(heading)
        )
        ctx.stroke()
      })

      requestAnimationFrame(animate)
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }

    const handleResize = () => {
      resizeCanvas()
    }

    resizeCanvas()
    animate()

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("resize", handleResize)
    }
  }, [backgroundColor, lineColor, lineWeight, proximity, vectorSize, transparent])

  return (
    <canvas
      ref={canvasRef}
      className={fullHeight ? "fixed inset-0" : "block w-full"}
      style={{ display: "block" }}
    />
  )
}
