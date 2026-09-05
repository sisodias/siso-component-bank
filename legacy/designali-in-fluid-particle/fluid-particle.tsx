"use client"

import { useEffect, useRef } from "react"

export function FluidParticles({
  particleDensity = 100,
  particleSize = 1,
  particleColor = "#555555",
  activeColor = "#ffffff", 
  maxBlastRadius = 300, 
  hoverDelay = 100,
  interactionDistance = 10,
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contextRef = useRef<CanvasRenderingContext2D | null>(null)
  const particlesRef = useRef<Particle[]>([])
  const mouseRef = useRef({ x: 0, y: 0, prevX: 0, prevY: 0 })
  const blastRef = useRef({ active: false, x: 0, y: 0, radius: 0, maxRadius: maxBlastRadius })
  const animationRef = useRef<number>(0)
  const hoverTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Particle class with velocity for more fluid movement
  class Particle {
    x: number
    y: number
    size: number
    baseX: number
    baseY: number
    density: number
    color: string
    vx: number
    vy: number
    friction: number

    constructor(x: number, y: number) {
      this.x = x
      this.y = y
      this.baseX = x
      this.baseY = y
      this.size = Math.random() * particleSize + 0.5
      this.density = Math.random() * 3 + 1
      this.color = particleColor
      this.vx = 0
      this.vy = 0
      this.friction = 0.9 - 0.01 * this.density // Friction based on density
    }

    draw() {
      if (!contextRef.current) return

      contextRef.current.fillStyle = this.color
      contextRef.current.beginPath()
      contextRef.current.arc(this.x, this.y, this.size, 0, Math.PI * 1)
      contextRef.current.closePath()
      contextRef.current.fill()
    }

    update() {
      if (!contextRef.current) return

      // Apply velocity with friction
      this.x += this.vx
      this.y += this.vy
      this.vx *= this.friction
      this.vy *= this.friction

      // Calculate distance between mouse and particle
      const dx = mouseRef.current.x - this.x
      const dy = mouseRef.current.y - this.y
      const distance = Math.sqrt(dx * dx + dy * dy)

      // Only calculate force if within interaction distance
      if (distance < interactionDistance) {
        const forceDirectionX = dx / distance
        const forceDirectionY = dy / distance
        const force = (interactionDistance - distance) / interactionDistance

        this.x -= forceDirectionX * force * this.density * 0.6
        this.y -= forceDirectionY * force * this.density * 0.6
        this.color = activeColor
      } else {
        // If particle is far from mouse, return to original position with easing
        if (this.x !== this.baseX) {
          const dx = this.x - this.baseX
          this.x -= dx / 20
        }
        if (this.y !== this.baseY) {
          const dy = this.y - this.baseY
          this.y -= dy / 20
        }
        this.color = particleColor
      }

      // Handle blast effect
      if (blastRef.current.active) {
        const blastDx = this.x - blastRef.current.x
        const blastDy = this.y - blastRef.current.y
        const blastDistance = Math.sqrt(blastDx * blastDx + blastDy * blastDy)

        if (blastDistance < blastRef.current.radius) {
          // Calculate normalized direction vector
          const blastForceX = blastDx / (blastDistance || 1) // Avoid division by zero
          const blastForceY = blastDy / (blastDistance || 1)

          // Calculate force based on distance from blast center
          const blastForce = (blastRef.current.radius - blastDistance) / blastRef.current.radius

          // Apply force as velocity with smoother acceleration
          this.vx += blastForceX * blastForce * 15
          this.vy += blastForceY * blastForce * 15

          // Change color based on blast with smoother transition
          const intensity = Math.min(255, Math.floor(255 - blastDistance))
          this.color = `rgba(${intensity}, 100, 255, 0.8)`
        }
      }

      this.draw()
    }
  }

  // Initialize canvas and particles
  const init = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    contextRef.current = canvas.getContext("2d", { alpha: true })

    // Enable alpha blending for smoother rendering
    if (contextRef.current) {
      contextRef.current.globalCompositeOperation = "lighter"
    }

    // Set canvas to full width/height with device pixel ratio for sharper rendering
    const handleResize = () => {
      const pixelRatio = window.devicePixelRatio || 1
      canvas.width = window.innerWidth * pixelRatio
      canvas.height = window.innerHeight * pixelRatio
      canvas.style.width = `${window.innerWidth}px`
      canvas.style.height = `${window.innerHeight}px`

      if (contextRef.current) {
        contextRef.current.scale(pixelRatio, pixelRatio)
      }

      initParticles()
    }

    window.addEventListener("resize", handleResize)
    handleResize()

    // Track mouse position and detect hover with throttling for performance
    let lastMoveTime = 0
    const moveThrottle = 10 // ms

    window.addEventListener("mousemove", (e) => {
      const now = performance.now()
      if (now - lastMoveTime < moveThrottle) return
      lastMoveTime = now

      const prevX = mouseRef.current.x
      const prevY = mouseRef.current.y
      mouseRef.current = { x: e.x, y: e.y, prevX, prevY }

      // Calculate mouse movement distance
      const dx = mouseRef.current.x - mouseRef.current.prevX
      const dy = mouseRef.current.y - mouseRef.current.prevY
      const distance = Math.sqrt(dx * dx + dy * dy)

      // If mouse is moving very little, start hover timer
      if (distance < 5) {
        if (hoverTimerRef.current === null) {
          hoverTimerRef.current = setTimeout(() => {
            triggerBlast(e.x, e.y)
          }, hoverDelay)
        }
      } else {
        // If mouse moves significantly, clear hover timer
        if (hoverTimerRef.current) {
          clearTimeout(hoverTimerRef.current)
          hoverTimerRef.current = null
        }
      }
    })

    // Handle touch for mobile
    window.addEventListener("touchmove", (e) => {
      if (e.touches[0]) {
        const prevX = mouseRef.current.x
        const prevY = mouseRef.current.y
        mouseRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          prevX,
          prevY,
        }
      }
    })

    // Handle touch start for blast effect on mobile
    window.addEventListener("touchstart", (e) => {
      if (e.touches[0]) {
        const x = e.touches[0].clientX
        const y = e.touches[0].clientY

        // Start hover timer for touch
        hoverTimerRef.current = setTimeout(() => {
          triggerBlast(x, y)
        }, hoverDelay)
      }
    })

    // Handle touch end to clear hover timer
    window.addEventListener("touchend", () => {
      if (hoverTimerRef.current) {
        clearTimeout(hoverTimerRef.current)
        hoverTimerRef.current = null
      }
    })

    // Handle click for immediate blast
    window.addEventListener("click", (e) => {
      triggerBlast(e.x, e.y)
    })

    // Start animation
    animate()

    return () => {
      window.removeEventListener("resize", handleResize)
      window.removeEventListener("mousemove", () => {})
      window.removeEventListener("touchmove", () => {})
      window.removeEventListener("touchstart", () => {})
      window.removeEventListener("touchend", () => {})
      window.removeEventListener("click", () => {})
      if (hoverTimerRef.current) clearTimeout(hoverTimerRef.current)
      cancelAnimationFrame(animationRef.current)
    }
  }

  // Trigger blast effect
  const triggerBlast = (x: number, y: number) => {
    blastRef.current = {
      active: true,
      x,
      y,
      radius: 0,
      maxRadius: maxBlastRadius,
    }

    // Animate the blast radius with smoother expansion
    const startTime = performance.now()
    const duration = 300 // ms for full expansion

    const expandBlast = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / duration, 1)

      // Use easing function for smoother expansion
      const easedProgress = easeOutQuad(progress)
      blastRef.current.radius = easedProgress * blastRef.current.maxRadius

      if (progress < 1) {
        requestAnimationFrame(expandBlast)
      } else {
        // Reset blast after reaching max radius
        setTimeout(() => {
          blastRef.current.active = false
        }, 100)
      }
    }

    requestAnimationFrame(expandBlast)

    // Clear hover timer
    if (hoverTimerRef.current) {
      clearTimeout(hoverTimerRef.current)
      hoverTimerRef.current = null
    }
  }

  // Easing function for smoother animations
  const easeOutQuad = (t: number) => t * (2 - t)

  // Create particles in a grid with higher density
  const initParticles = () => {
    particlesRef.current = []
    const canvas = canvasRef.current
    if (!canvas) return

    // Increase particle density (lower divisor = more particles)
    const particleCount = Math.floor((window.innerWidth * window.innerHeight) / particleDensity)

    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      particlesRef.current.push(new Particle(x, y))
    }
  }

  // Animation loop with timing optimization
  const animate = () => {
    const canvas = canvasRef.current
    const ctx = contextRef.current
    if (!canvas || !ctx) return

    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)

    particlesRef.current.forEach((particle) => {
      particle.update()
    })

    animationRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const cleanup = init()
    return cleanup
  }, [])

  return (
    <div className="">
      <canvas ref={canvasRef} className="absolute inset-0" />
    </div>
  )
}
 