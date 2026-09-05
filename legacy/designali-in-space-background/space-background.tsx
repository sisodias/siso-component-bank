"use client"

import { useEffect, useRef, useState } from "react"

interface Particle {
  color: string
  radius: number
  x: number
  y: number
  ring: number
  move: number
  random: number
}

interface SpaceBackgroundProps {
  particleCount?: number
  particleColor?: string // override
  backgroundColor?: string
  className?: string
}

// --- Utility: parse RGB/hex colors ---
function parseRGB(cssColor: string) {
  if (!cssColor) return null
  cssColor = cssColor.trim()

  // hex
  if (cssColor[0] === "#") {
    let hex = cssColor.slice(1)
    if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("")
    const r = parseInt(hex.slice(0, 2), 16)
    const g = parseInt(hex.slice(2, 4), 16)
    const b = parseInt(hex.slice(4, 6), 16)
    return [r, g, b]
  }

  // rgb/rgba
  const m = cssColor.match(/rgba?\(([^)]+)\)/)
  if (m) {
    const parts = m[1].split(",").map((s) => parseFloat(s.trim()))
    return [parts[0], parts[1], parts[2]]
  }

  return null
}

function luminanceFromRgb([r, g, b]: number[]) {
  const srgb = [r / 255, g / 255, b / 255].map((v) =>
    v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)
  )
  return 0.2126 * srgb[0] + 0.7152 * srgb[1] + 0.0722 * srgb[2]
}

export function SpaceBackground({
  particleCount = 450,
  particleColor = "blue",
  backgroundColor = "transparent",
  className = "",
}: SpaceBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const animationRef = useRef<number | null>(null)
  const [resolvedColor, setResolvedColor] = useState<string | undefined>(undefined)

  // --- Detect effective background color ---
  const detectBackgroundColor = () => {
    if (backgroundColor && backgroundColor !== "transparent") return backgroundColor

    const candidates = [document.body, document.documentElement]
    for (const el of candidates) {
      if (!el) continue
      const cs = getComputedStyle(el)
      const bg = cs.backgroundColor || cs.background
      if (!bg) continue
      const rgb = parseRGB(bg)
      if (!rgb) continue

      if (/rgba/.test(bg)) {
        const alpha = parseFloat(bg.split(",").pop() || "1")
        if (isNaN(alpha) || alpha === 0) continue
      }
      return bg
    }

    const media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
    return media && media.matches ? "black" : "white"
  }

  // --- Compute high contrast particle color ---
  useEffect(() => {
    if (particleColor) {
      setResolvedColor(particleColor)
      return
    }

    const setContrast = () => {
      let bg = detectBackgroundColor()
      if (!bg || bg === "transparent") {
        const isDark = window.matchMedia("(prefers-color-scheme: dark)").matches
        bg = isDark ? "black" : "white"
      }

      const rgb = parseRGB(bg)
      if (rgb) {
        const lum = luminanceFromRgb(rgb)
        // improved opacity for visibility in light mode
        if (lum < 0.5) {
          setResolvedColor("rgba(255,255,255,0.85)") // dark background → bright stars
        } else {
          setResolvedColor("rgba(0,0,0,0.85)") // light background → visible dark stars
        }
      } else {
        const media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
        setResolvedColor(media && media.matches ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)")
      }
    }

    setContrast()

    const media = window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)")
    const onMedia = () => setContrast()
    if (media && media.addEventListener) media.addEventListener("change", onMedia)

    const mo = new MutationObserver(() => setTimeout(setContrast, 10))
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class", "style"] })
    mo.observe(document.body, { attributes: true, attributeFilter: ["class", "style"] })

    return () => {
      if (media && media.removeEventListener) media.removeEventListener("change", onMedia)
      mo.disconnect()
    }
  }, [particleColor, backgroundColor])

  // --- Draw / animate ---
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    if (!resolvedColor) return

    let ratio = window.innerHeight < 400 ? 0.6 : 1
    const state = {
      particles: [] as Particle[],
      r: 120,
      counter: 0,
    }

    const setupCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      ctx.setTransform(ratio, 0, 0, -ratio, canvas.width / 2, canvas.height / 2)
    }
    setupCanvas()

    const createParticle = () => {
      state.particles.push({
        color: resolvedColor,
        radius: Math.random() * 5,
        x: Math.cos(Math.random() * 7 + Math.PI) * state.r,
        y: Math.sin(Math.random() * 7 + Math.PI) * state.r,
        ring: Math.random() * state.r * 3,
        move: (Math.random() * 4 + 1) / 500,
        random: Math.random() * 7,
      })
    }
    for (let i = 0; i < particleCount; i++) createParticle()

    const moveParticle = (p: Particle) => {
      p.ring = Math.max(p.ring - 1, state.r)
      p.random += p.move
      p.x = Math.cos(p.random + Math.PI) * p.ring
      p.y = Math.sin(p.random + Math.PI) * p.ring
    }

    const resetParticle = (p: Particle) => {
      p.ring = Math.random() * state.r * 3
      p.radius = Math.random() * 5
    }

    const disappear = (p: Particle) => {
      if (p.radius < 0.8) resetParticle(p)
      p.radius *= 0.994
    }

    const draw = (p: Particle) => {
      ctx.beginPath()
      ctx.fillStyle = p.color
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
      ctx.fill()
    }

    const loop = () => {
      ctx.clearRect(-canvas.width, -canvas.height, canvas.width * 2, canvas.height * 2)
      if (state.counter < state.particles.length) state.counter++
      for (let i = 0; i < state.counter; i++) {
        disappear(state.particles[i])
        moveParticle(state.particles[i])
        draw(state.particles[i])
      }
      animationRef.current = requestAnimationFrame(loop)
    }

    animationRef.current = requestAnimationFrame(loop)

    const handleResize = () => {
      ratio = window.innerHeight < 400 ? 0.6 : 1
      setupCanvas()
    }
    window.addEventListener("resize", handleResize)

    return () => {
      window.removeEventListener("resize", handleResize)
      if (animationRef.current) cancelAnimationFrame(animationRef.current)
    }
  }, [particleCount, resolvedColor])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: -1,
        display: "block",
        width: "100%",
        height: "100%",
        background: backgroundColor,
        pointerEvents: "none",
      }}
    />
  )
}
