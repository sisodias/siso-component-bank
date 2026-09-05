'use client'

import React, { useEffect, useRef } from 'react'

export function NeonFlow() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let time = 0
    let particles: Particle[] = []
    
    // Configuration
    const PARTICLE_COUNT = 1500 // High density for complex look
    const NOISE_SCALE = 0.003
    const SPEED_SCALE = 2
    const COLOR_SPEED = 0.5
    
    // Simplex Noise implementation (simplified for containment)
    const fluid = {
      noise: (x: number, y: number, z: number) => {
        // Simple pseudo-random hash for visual variation
        return Math.sin(x * 12.9898 + y * 78.233 + z) * 43758.5453 % 1
      }
    }

    class Particle {
      x: number
      y: number
      vx: number
      vy: number
      life: number
      maxLife: number
      color: string
      size: number

      constructor(w: number, h: number) {
        this.x = Math.random() * w
        this.y = Math.random() * h
        this.vx = 0
        this.vy = 0
        this.life = 0
        this.maxLife = Math.random() * 200 + 100
        this.size = Math.random() * 3 + 1
        
        // Cyberpunk/Neon Palette
        const colors = [
          'rgba(60, 20, 255, 0.4)',  // Electric Blue
          'rgba(255, 20, 150, 0.4)', // Neon Pink
          'rgba(0, 255, 255, 0.4)',  // Cyan
          'rgba(140, 20, 255, 0.4)'  // Purple
        ]
        this.color = colors[Math.floor(Math.random() * colors.length)]
      }

      update(w: number, h: number, t: number) {
        // Calculate flow angle using noise
        const angle = fluid.noise(this.x * NOISE_SCALE, this.y * NOISE_SCALE, t * 0.1) * Math.PI * 4
        
        // Fluid physics
        this.vx += Math.cos(angle) * 0.1
        this.vy += Math.sin(angle) * 0.1
        this.vx *= 0.9 // Friction
        this.vy *= 0.9
        
        this.x += this.vx * SPEED_SCALE
        this.y += this.vy * SPEED_SCALE
        this.life++

        // Wrap around screen
        if (this.x > w) this.x = 0
        if (this.x < 0) this.x = w
        if (this.y > h) this.y = 0
        if (this.y < 0) this.y = h

        // Reset if "dead"
        if (this.life > this.maxLife) {
          this.x = Math.random() * w
          this.y = Math.random() * h
          this.vx = 0
          this.vy = 0
          this.life = 0
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        // Dynamic opacity based on life
        const opacity = Math.sin((this.life / this.maxLife) * Math.PI)
        ctx.globalAlpha = opacity * 0.6
        ctx.fillStyle = this.color
        // Draw Box instead of circle
        ctx.fillRect(this.x, this.y, this.size, this.size)
      }
    }

    const init = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      particles = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(new Particle(canvas.width, canvas.height))
      }
    }

    const render = () => {
      time += 0.002
      
      // Creating trails effect
      ctx.globalAlpha = 0.05 // Trail fade speed
      ctx.fillStyle = '#020617' // Deep slate background
      ctx.fillRect(0, 0, canvas.width, canvas.height)
      
      particles.forEach(p => {
        p.update(canvas.width, canvas.height, time)
        p.draw(ctx)
      })

      animationFrameId = requestAnimationFrame(render)
    }

    window.addEventListener('resize', init)
    init()
    render()

    return () => {
      window.removeEventListener('resize', init)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10 w-full h-full bg-slate-950"
    />
  )
}
