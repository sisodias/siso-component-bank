"use client"

import { useEffect, useRef } from "react"

type Particle = {
  x: number
  y: number
  size: number
  color: string
  Hvelocity: number
  Vvelocity: number
  dead: boolean
}

type Props = {
  className?: string
  /** Canvas background color or 'transparent' */
  background?: string
  /** Maximum number of active particles */
  maxParticles?: number
  /** Particles created at mount */
  initialParticles?: number
  /** Particles generated per frame */
  particlesPerFrame?: number
  /** Array of color strings (CSS rgba/hsla/hex) */
  colors?: string[]
  /** Range for particle size (min, max) */
  sizeRange?: [number, number]
  /** Range for particle velocity (min, max) */
  velocityRange?: [number, number]
  /** Whether particles fall down (true) or move upward (false) */
  downward?: boolean
  /** Global opacity multiplier (0–1) */
  opacity?: number
  /** Whether to blend with lighter effect or normal */
  blendMode?: "lighter" | "source-over"
}

export function ParticleCanvas({
  className,
  background = "transparent",
  maxParticles = 1000,
  initialParticles = 50,
  particlesPerFrame = 20,
  colors = [
    "rgba(255, 0, 128, 0.25)", 
  ],
  sizeRange = [2, 40],
  velocityRange = [2, 4],
  downward = true,
  opacity = 1,
  blendMode = "lighter",
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const ctxRef = useRef<CanvasRenderingContext2D | null>(null)

  // Resize canvas based on parent and DPR
  const resizeCanvas = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const parent = canvas.parentElement
    const dpr = Math.max(1, Math.floor(window.devicePixelRatio || 1))
    const width = parent?.clientWidth ?? window.innerWidth
    const height = parent?.clientHeight ?? window.innerHeight
    canvas.style.width = `${width}px`
    canvas.style.height = `${height}px`
    canvas.width = width * dpr
    canvas.height = height * dpr
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    ctxRef.current = ctx
  }

  const drawCanvasBackground = (ctx: CanvasRenderingContext2D) => {
    const canvas = canvasRef.current
    if (!canvas) return
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    if (background !== "transparent") {
      ctx.fillStyle = background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }
  }

  const randomBetween = (min: number, max: number) =>
    Math.random() * (max - min) + min

  const generateParticle = () => {
    const canvas = canvasRef.current
    if (!canvas) return
    const color = colors[Math.floor(Math.random() * colors.length)]
    const size = randomBetween(sizeRange[0], sizeRange[1])
    const Hvelocity = randomBetween(velocityRange[0], velocityRange[1])
    const Vvelocity = randomBetween(velocityRange[0], velocityRange[1])
    const particle: Particle = {
      x: Math.random() * -100,
      y: Math.random() * -100,
      size,
      color,
      Hvelocity,
      Vvelocity,
      dead: false,
    }
    particlesRef.current.push(particle)
  }

  const draw = () => {
    const ctx = ctxRef.current
    const canvas = canvasRef.current
    if (!ctx || !canvas) return

    drawCanvasBackground(ctx)
    const particles = particlesRef.current
    ctx.globalCompositeOperation = blendMode

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i]
      if (p.dead) {
        particles.splice(i, 1)
        i--
        continue
      }

      ctx.beginPath()
      const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size)
      gradient.addColorStop(1, "transparent")
      gradient.addColorStop(0, p.color)
      ctx.globalAlpha = opacity
      ctx.fillStyle = gradient
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2, true)
      ctx.closePath()
      ctx.fill()

      p.x += p.Hvelocity
      p.y += downward ? p.Vvelocity : -p.Vvelocity

      const cssWidth = canvas.width / Math.max(1, Math.floor(window.devicePixelRatio || 1))
      const cssHeight = canvas.height / Math.max(1, Math.floor(window.devicePixelRatio || 1))
      if (p.x - p.size > cssWidth || p.y - p.size > cssHeight || p.y + p.size < 0) {
        p.dead = true
      }
    }

    if (particles.length < maxParticles) {
      for (let i = 0; i < particlesPerFrame; i++) generateParticle()
    }

    rafRef.current = requestAnimationFrame(draw)
  }

  useEffect(() => {
    resizeCanvas()
    particlesRef.current = []
    for (let i = 0; i < initialParticles; i++) generateParticle()
    rafRef.current = requestAnimationFrame(draw)

    const handleResize = () => resizeCanvas()
    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      particlesRef.current = []
    }
  }, [
    background,
    colors,
    maxParticles,
    initialParticles,
    particlesPerFrame,
    sizeRange,
    velocityRange,
    downward,
    opacity,
    blendMode,
  ])

  return (
    <div className={className} aria-hidden="true">
      <canvas ref={canvasRef} />
    </div>
  )
}
