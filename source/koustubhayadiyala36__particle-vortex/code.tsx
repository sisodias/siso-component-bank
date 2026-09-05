"use client"

import type React from "react"

import { useRef, useEffect, useState, useCallback } from "react"

export interface ParticleVortexProps {
  className?: string
  particleCount?: number
  colors?: string[]
  vortexStrength?: number
  particleSize?: number
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  color: string
  angle: number
  speed: number
}

export function Component({
  className = "",
  particleCount = 150,
  colors = ["#00ffff", "#ff00ff", "#ffff00", "#00ff00"],
  vortexStrength = 0.02,
  particleSize = 3,
}: ParticleVortexProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: -1000, y: -1000 })
  const animationRef = useRef<number | null>(null)
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 })

  // Initialize particles
  useEffect(() => {
    const particles: Particle[] = []
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: particleSize + Math.random() * particleSize,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1.5,
      })
    }
    particlesRef.current = particles
  }, [particleCount, colors, particleSize, dimensions])

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const rect = canvasRef.current.getBoundingClientRect()
        setDimensions({ width: rect.width, height: rect.height })
      }
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return
    const rect = canvasRef.current.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    }
  }, [])

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = { x: -1000, y: -1000 }
  }, [])

  // Animation loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const animate = () => {
      ctx.fillStyle = "rgba(8, 8, 20, 0.1)"
      ctx.fillRect(0, 0, dimensions.width, dimensions.height)

      const mouse = mouseRef.current
      const particles = particlesRef.current

      particles.forEach((particle) => {
        const dx = mouse.x - particle.x
        const dy = mouse.y - particle.y
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < 200 && distance > 0) {
          // Vortex effect - perpendicular force
          const perpX = -dy / distance
          const perpY = dx / distance
          const force = (200 - distance) * vortexStrength

          particle.vx += perpX * force
          particle.vy += perpY * force

          // Slight attraction
          particle.vx += (dx / distance) * force * 0.1
          particle.vy += (dy / distance) * force * 0.1
        }

        // Add some random movement
        particle.angle += 0.02
        particle.vx += Math.cos(particle.angle) * 0.1
        particle.vy += Math.sin(particle.angle) * 0.1

        // Damping
        particle.vx *= 0.98
        particle.vy *= 0.98

        // Update position
        particle.x += particle.vx
        particle.y += particle.vy

        // Wrap around edges
        if (particle.x < 0) particle.x = dimensions.width
        if (particle.x > dimensions.width) particle.x = 0
        if (particle.y < 0) particle.y = dimensions.height
        if (particle.y > dimensions.height) particle.y = 0

        // Draw particle with glow
        const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2)
        const glowSize = particle.size + speed * 2

        ctx.beginPath()
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, glowSize)
        gradient.addColorStop(0, particle.color)
        gradient.addColorStop(0.4, particle.color + "88")
        gradient.addColorStop(1, "transparent")
        ctx.fillStyle = gradient
        ctx.arc(particle.x, particle.y, glowSize, 0, Math.PI * 2)
        ctx.fill()

        // Draw connections to nearby particles
        particles.forEach((other) => {
          const d = Math.sqrt((particle.x - other.x) ** 2 + (particle.y - other.y) ** 2)
          if (d < 80 && d > 0) {
            ctx.beginPath()
            ctx.strokeStyle = `${particle.color}${Math.round((1 - d / 80) * 50)
              .toString(16)
              .padStart(2, "0")}`
            ctx.lineWidth = 0.5
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(other.x, other.y)
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [dimensions, vortexStrength])

  return (
    <canvas
      ref={canvasRef}
      width={dimensions.width}
      height={dimensions.height}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`bg-background ${className}`}
      style={{ touchAction: "none" }}
    />
  )
}
