"use client"

import { useEffect, useRef } from "react"

interface RippleCanvasProps {
  gridSize?: number
  spacing?: number
  rippleSpeed?: number
  maxRadius?: number
  rippleWidth?: number
  autoRipple?: boolean
  autoRippleInterval?: number
  className?: string
}

export function RippleCanvas({
  gridSize = 200,
  spacing = 10,
  rippleSpeed = 10,
  maxRadius = 20,
  rippleWidth = 20,
  autoRipple = true,
  autoRippleInterval = 1000,
  className = "",
}: RippleCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef = useRef({ x: 0, y: 0, old_x: 0, old_y: 0 })
  const ripplesRef = useRef<Array<{ x: number; y: number; distance: number }>>([])
  const gridRef = useRef<Array<Array<{ radius: number; color: string }>>>([])
  const animationRef = useRef<number>()
  const sampleTimerRef = useRef<NodeJS.Timeout>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    handleResize()
    window.addEventListener("resize", handleResize)

    // Initialize grid with random colors
    gridRef.current = []
    for (let y = 0; y < gridSize; y++) {
      gridRef.current[y] = []
      for (let x = 0; x < gridSize; x++) {
        gridRef.current[y][x] = {
          radius: 2,
          color: "#" + Math.floor(Math.random() * 16777215).toString(16),
        }
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.old_x = mouseRef.current.x
      mouseRef.current.old_y = mouseRef.current.y
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    const handleClick = (e: MouseEvent) => {
      addRipple(e.clientX, e.clientY)
      if (sampleTimerRef.current) clearTimeout(sampleTimerRef.current)
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)

    const angleTools = {
      getAngle: (obj1: { x: number; y: number }, obj2: { x: number; y: number }) => {
        const dX = obj2.x - obj1.x
        const dY = obj2.y - obj1.y
        return (Math.atan2(dY, dX) / Math.PI) * 180
      },
      getDistance: (obj1: { x: number; y: number }, obj2: { x: number; y: number }) => {
        const dx = obj1.x - obj2.x
        const dy = obj1.y - obj2.y
        return Math.sqrt(dx * dx + dy * dy)
      },
    }

    const addRipple = (x: number, y: number) => {
      ripplesRef.current.push({
        x,
        y,
        distance: 0,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update ripple distances
      for (let i = 0; i < ripplesRef.current.length; i++) {
        ripplesRef.current[i].distance += rippleSpeed
      }

      // Draw grid
      for (let y = 0; y < gridRef.current.length; y++) {
        for (let x = 0; x < gridRef.current[y].length; x++) {
          ctx.fillStyle = gridRef.current[y][x].color

          const pos = { x: x * spacing, y: y * spacing }
          let radius = gridRef.current[y][x].radius

          // Check ripple collision
          for (let j = 0; j < ripplesRef.current.length; j++) {
            const distanceFromRippleCenter = angleTools.getDistance(ripplesRef.current[j], pos)
            if (
              distanceFromRippleCenter > ripplesRef.current[j].distance - rippleWidth &&
              distanceFromRippleCenter < ripplesRef.current[j].distance + rippleWidth
            ) {
              radius *= 2
              if (radius > maxRadius) radius = maxRadius
            }
          }

          ctx.beginPath()
          ctx.arc(pos.x, pos.y, radius, 0, 2 * Math.PI, false)
          ctx.closePath()
          ctx.fill()
        }
      }
    }

    const animloop = () => {
      render()
      animationRef.current = requestAnimationFrame(animloop)
    }

    animationRef.current = requestAnimationFrame(animloop)

    if (autoRipple) {
      let sampleX = 0
      const sample = () => {
        sampleX = sampleX ? 0 : 1
        addRipple(
          sampleX ? canvas.width / 2 - canvas.width / 4 : canvas.width / 2 + canvas.width / 4,
          canvas.height / 2,
        )
        sampleTimerRef.current = setTimeout(sample, autoRippleInterval)
      }
      sampleTimerRef.current = setTimeout(sample, autoRippleInterval)
    }

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
      if (sampleTimerRef.current) clearTimeout(sampleTimerRef.current)
    }
  }, [gridSize, spacing, rippleSpeed, maxRadius, rippleWidth, autoRipple, autoRippleInterval])

  return <canvas ref={canvasRef} className={`block w-full h-screen ${className}`} />
}
