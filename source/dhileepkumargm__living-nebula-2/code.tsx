// src/components/living-nebula.tsx
import React, { useRef, useEffect } from 'react'

export interface LivingNebulaProps {
  /** Number of particles in the simulation */
  particleCount?: number
  /** Opacity of the trailing effect (0 = no trail, 1 = full persistence) */
  trailLength?: number
  /** Speed at which the nebula’s hue drifts over time */
  hueSpeed?: number
  /** Canvas shadow blur for the glowing effect */
  canvasGlow?: number
  /** Frequency of the emission “pulse” */
  pulseFrequency?: number
  /** How many particles to rebirth per pulse */
  emissionRate?: number
  /** Fixed width of the canvas; defaults to 100vw */
  width?: number
  /** Fixed height of the canvas; defaults to 100vh */
  height?: number
  /** Additional classname for the container */
  className?: string
  /** Any overlay content (e.g., headings, buttons) */
  children?: React.ReactNode
}

const LivingNebula: React.FC<LivingNebulaProps> = ({
  particleCount = 1500,
  trailLength = 0.2,
  hueSpeed = 0.1,
  canvasGlow = 10,
  pulseFrequency = 0.0015,
  emissionRate = 2,
  width,
  height,
  className = '',
  children,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!
    let w = (canvas.width = width ?? window.innerWidth)
    let h = (canvas.height = height ?? window.innerHeight)

    // Center point
    const emission = { x: w / 2, y: h / 2 }

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      lifetime: number
      age: number

      constructor() {
        this.rebirth()
      }

      rebirth() {
        this.x = emission.x
        this.y = emission.y
        const angle = Math.random() * Math.PI * 2
        const speed = Math.random() * 4 + 0.5
        this.vx = Math.cos(angle) * speed
        this.vy = Math.sin(angle) * speed
        this.lifetime = Math.random() * 200 + 200
        this.age = 0
      }

      update() {
        this.age++
        if (this.age > this.lifetime) this.rebirth()
        this.vx *= 0.99
        this.vy *= 0.99
        this.x += this.vx
        this.y += this.vy
      }

      draw() {
        const ratio = this.age / this.lifetime
        const opacity = Math.sin(ratio * Math.PI) * 0.9
        const dist = Math.hypot(this.x - emission.x, this.y - emission.y)
        const hue = 260 - dist * 0.1

        ctx.beginPath()
        ctx.fillStyle = `hsla(${hue},100%,70%,${opacity})`
        ctx.arc(this.x, this.y, 1.5 + (1 - ratio) * 2, 0, Math.PI * 2)
        ctx.fill()
      }
    }

    let particles = Array.from({ length: particleCount }, () => new Particle())
    let time = 0
    let rafId: number

    const animate = () => {
      // semi-transparent overlay for trails
      ctx.fillStyle = `rgba(0,0,15,${trailLength})`
      ctx.fillRect(0, 0, w, h)

      // glowing effect
      ctx.shadowBlur = canvasGlow
      ctx.shadowColor = `hsla(${260 + time * 0.02},100%,60%,1)`

      // pulse-based extra rebirths
      const pulse = (Math.sin(time * pulseFrequency) + 1) / 2
      const extra = Math.floor(pulse * emissionRate)
      for (let i = 0; i < extra; i++) {
        const p = particles[Math.floor(Math.random() * particles.length)]
        if (p.age > p.lifetime) p.rebirth()
      }

      // update & draw
      particles.forEach((p) => {
        p.update()
        p.draw()
      })

      ctx.shadowBlur = 0
      time++
      rafId = requestAnimationFrame(animate)
    }

    const handleResize = () => {
      cancelAnimationFrame(rafId)
      w = canvas.width = width ?? window.innerWidth
      h = canvas.height = height ?? window.innerHeight
      particles = Array.from({ length: particleCount }, () => new Particle())
      time = 0
      animate()
    }

    window.addEventListener('resize', handleResize)
    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
    }
  }, [
    particleCount,
    trailLength,
    hueSpeed,
    canvasGlow,
    pulseFrequency,
    emissionRate,
    width,
    height,
  ])

  return (
    <div
      className={`relative overflow-hidden bg-[hsl(var(--background))] ${className}`}
      style={{ width: width ?? '100vw', height: height ?? '100vh' }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ display: 'block', width: '100%', height: '100%' }}
      />
      {children}
    </div>
  )
}

export default LivingNebula
