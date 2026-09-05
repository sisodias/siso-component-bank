"use client"

import { useEffect, useRef } from "react"

interface ParticleGravityProps {
  particleCount?: number
  colorRotationSpeed?: number
  dragFactor?: number
  gravityStrength?: number
  backgroundColor?: string
  className?: string
  isPlaying?: boolean
}

export function ParticleGravity({
  particleCount = 10000,
  colorRotationSpeed = 0.1,
  dragFactor = 0.96,
  gravityStrength = 50,
  backgroundColor = "transparent",  
  className = "",
  isPlaying: initialPlaying = true,
}: ParticleGravityProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const stateRef = useRef({
    particles: [] as Array<[number, number, number, number]>,
    oldPixels: [] as number[],
    mousePos: [0, 0] as [number, number],
    isPlaying: initialPlaying,
    colorRotation: 1,
    width: 0,
    height: 0,
  })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Enable transparent background
    const ctx = canvas.getContext("2d", { alpha: true })
    if (!ctx) return

    const state = stateRef.current
    state.isPlaying = initialPlaying

    const setupCanvas = () => {
      state.width = window.innerWidth
      state.height = window.innerHeight
      canvas.width = state.width
      canvas.height = state.height
      // only fill background if not transparent
      if (backgroundColor !== "transparent") {
        ctx.fillStyle = backgroundColor
        ctx.fillRect(0, 0, state.width, state.height)
      } else {
        ctx.clearRect(0, 0, state.width, state.height)
      }
    }

    const initializeParticles = () => {
      state.particles = []
      for (let i = 0; i < particleCount; i++) {
        state.particles.push([Math.random() * state.width, Math.random() * state.height, 0, 0])
      }
    }

    const animate = () => {
      const imageData = ctx.getImageData(0, 0, state.width, state.height)
      const data = imageData.data

      // Fade out old pixels slightly for a trailing effect
      for (let i = 3; i < data.length; i += 4) {
        data[i] *= 0.8 // controls fade speed; lower = faster fade
      }

      state.oldPixels = []

      // Update color rotation
      state.colorRotation =
        state.colorRotation < 0 ? state.colorRotation + 360 : state.colorRotation - colorRotationSpeed

      const radians = (state.colorRotation * Math.PI) / 180
      const colorCenter = 128.5
      const colorAmplitude = 127

      const r = Math.floor(Math.sin(radians) * colorAmplitude + colorCenter)
      const g = Math.floor(Math.sin(radians + (2 * Math.PI) / 3) * colorAmplitude + colorCenter)
      const b = Math.floor(Math.sin(radians + (4 * Math.PI) / 3) * colorAmplitude + colorCenter)

      // Update particles
      for (let i = 0; i < state.particles.length; i++) {
        const particle = state.particles[i]
        const dx = state.mousePos[0] - particle[0]
        const dy = state.mousePos[1] - particle[1]
        const angle = Math.atan2(dy, dx)
        const distance = Math.sqrt(dx * dx + dy * dy)
        const force = gravityStrength / (distance || 1) // avoid division by zero

        particle[2] += Math.cos(angle) * force
        particle[3] += Math.sin(angle) * force

        particle[0] += particle[2]
        particle[1] += particle[3]

        particle[2] *= dragFactor
        particle[3] *= dragFactor

        // Wrap particles around screen edges
        if (particle[0] >= state.width) particle[0] -= state.width
        else if (particle[0] < 0) particle[0] += state.width - 1
        if (particle[1] >= state.height) particle[1] -= state.height
        else if (particle[1] < 0) particle[1] += state.height - 1

        const pixelIndex = (Math.floor(particle[1]) * state.width + Math.floor(particle[0])) * 4
        data[pixelIndex] = r
        data[pixelIndex + 1] = g
        data[pixelIndex + 2] = b
        data[pixelIndex + 3] = 255 // alpha
      }

      ctx.putImageData(imageData, 0, 0)

      if (state.isPlaying) requestAnimationFrame(animate)
    }

    setupCanvas()
    initializeParticles()

    const handleMouseMove = (e: MouseEvent) => {
      state.mousePos = [e.pageX, e.pageY]
    }

    const handleClick = () => {
      state.isPlaying = !state.isPlaying
      if (state.isPlaying) animate()
    }

    const handleResize = () => setupCanvas()

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("click", handleClick)
    window.addEventListener("resize", handleResize)

    animate()

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("click", handleClick)
      window.removeEventListener("resize", handleResize)
    }
  }, [particleCount, colorRotationSpeed, dragFactor, gravityStrength, backgroundColor, initialPlaying])

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 ${className}`}
      style={{
        margin: 0,
        padding: 0,
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    />
  )
}
