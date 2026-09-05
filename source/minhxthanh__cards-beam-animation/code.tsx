"use client"

import type React from "react"

import { useEffect, useRef, useState, useCallback } from "react"

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  decay: number
  originalAlpha: number
  life: number
  time: number
  startX: number
  twinkleSpeed: number
  twinkleAmount: number
}

const cardImages = [
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b55e654d1341fb06f8_4.1.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5a080a31ee7154b19_1.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5c1e4919fd69672b8_3.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5f6a5e232e7beb4be_2.png",
  "https://cdn.prod.website-files.com/68789c86c8bc802d61932544/689f20b5bea2f1b07392d936_4.png",
]

const codeChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789(){}[]<>;:,._-+=!@#$%^&*|\\/\"'`~?"

export default function CardsBeamAnimation() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardLineRef = useRef<HTMLDivElement>(null)
  const scannerCanvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()
  const cardAnimationRef = useRef<number>()

  const [position, setPosition] = useState(0)
  const [velocity, setVelocity] = useState(120)
  const [direction, setDirection] = useState(-1)
  const [isAnimating, setIsAnimating] = useState(true)
  const [isDragging, setIsDragging] = useState(false)
  const [scanningActive, setScanningActive] = useState(false)

  const lastMouseX = useRef(0)
  const mouseVelocity = useRef(0)
  const lastTime = useRef(0)
  const lastCardTime = useRef(0)
  const particles = useRef<{ [key: number]: Particle }>({})
  const particleCount = useRef(0)
  const gradientCanvas = useRef<HTMLCanvasElement>()

  // Generate ASCII code content
  const generateCode = useCallback((width: number, height: number) => {
    const randInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min
    const pick = (arr: string[]) => arr[randInt(0, arr.length - 1)]

    const header = [
      "// compiled preview • scanner demo",
      "/* generated for visual effect – not executed */",
      "const SCAN_WIDTH = 8;",
      "const FADE_ZONE = 35;",
      "const MAX_PARTICLES = 2500;",
      "const TRANSITION = 0.05;",
    ]

    const helpers = [
      "function clamp(n, a, b) { return Math.max(a, Math.min(b, n)); }",
      "function lerp(a, b, t) { return a + (b - a) * t; }",
      "const now = () => performance.now();",
      "function rng(min, max) { return Math.random() * (max - min) + min; }",
    ]

    const library = [...header, ...helpers]

    for (let i = 0; i < 40; i++) {
      const n1 = randInt(1, 9)
      const n2 = randInt(10, 99)
      library.push(`const v${i} = (${n1} + ${n2}) * 0.${randInt(1, 9)};`)
    }

    let flow = library.join(" ")
    flow = flow.replace(/\s+/g, " ").trim()
    const totalChars = width * height

    while (flow.length < totalChars + width) {
      const extra = pick(library).replace(/\s+/g, " ").trim()
      flow += " " + extra
    }

    let out = ""
    let offset = 0
    for (let row = 0; row < height; row++) {
      let line = flow.slice(offset, offset + width)
      if (line.length < width) line = line + " ".repeat(width - line.length)
      out += line + (row < height - 1 ? "\n" : "")
      offset += width
    }
    return out
  }, [])

  // Create gradient for particles
  const createGradientCache = useCallback(() => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")!
    canvas.width = 16
    canvas.height = 16

    const half = canvas.width / 2
    const gradient = ctx.createRadialGradient(half, half, 0, half, half, half)
    gradient.addColorStop(0, "rgba(255, 255, 255, 1)")
    gradient.addColorStop(0.3, "rgba(196, 181, 253, 0.8)")
    gradient.addColorStop(0.7, "rgba(139, 92, 246, 0.4)")
    gradient.addColorStop(1, "transparent")

    ctx.fillStyle = gradient
    ctx.beginPath()
    ctx.arc(half, half, half, 0, Math.PI * 2)
    ctx.fill()

    gradientCanvas.current = canvas
  }, [])

  // Create particle
  const createParticle = useCallback((): Particle => {
    const randomFloat = (min: number, max: number) => Math.random() * (max - min) + min

    return {
      x: window.innerWidth / 2 + randomFloat(-1.5, 1.5),
      y: randomFloat(0, 300),
      vx: randomFloat(0.2, 1.0),
      vy: randomFloat(-0.15, 0.15),
      radius: randomFloat(0.4, 1),
      alpha: randomFloat(0.6, 1),
      decay: randomFloat(0.005, 0.025),
      originalAlpha: 0,
      life: 1.0,
      time: 0,
      startX: 0,
      twinkleSpeed: randomFloat(0.02, 0.08),
      twinkleAmount: randomFloat(0.1, 0.25),
    }
  }, [])

  // Update particle position and properties
  const updateParticle = useCallback((particle: Particle) => {
    particle.x += particle.vx
    particle.y += particle.vy
    particle.time++

    particle.alpha =
      particle.originalAlpha * particle.life + Math.sin(particle.time * particle.twinkleSpeed) * particle.twinkleAmount

    particle.life -= particle.decay

    if (particle.x > window.innerWidth + 10 || particle.life <= 0) {
      // Reset particle
      particle.x = window.innerWidth / 2 + (Math.random() - 0.5) * 3
      particle.y = Math.random() * 300
      particle.vx = Math.random() * 0.8 + 0.2
      particle.vy = (Math.random() - 0.5) * 0.3
      particle.alpha = Math.random() * 0.4 + 0.6
      particle.originalAlpha = particle.alpha
      particle.life = 1.0
      particle.time = 0
    }
  }, [])

  // Draw particle on canvas
  const drawParticle = useCallback(
    (ctx: CanvasRenderingContext2D, particle: Particle) => {
      if (particle.life <= 0 || !gradientCanvas.current) return

      let fadeAlpha = 1
      const fadeZone = scanningActive ? 35 : 60

      if (particle.y < fadeZone) {
        fadeAlpha = particle.y / fadeZone
      } else if (particle.y > 300 - fadeZone) {
        fadeAlpha = (300 - particle.y) / fadeZone
      }

      fadeAlpha = Math.max(0, Math.min(1, fadeAlpha))

      ctx.globalAlpha = particle.alpha * fadeAlpha
      ctx.drawImage(
        gradientCanvas.current,
        particle.x - particle.radius,
        particle.y - particle.radius,
        particle.radius * 2,
        particle.radius * 2,
      )
    },
    [scanningActive],
  )

  // Draw scanner beam
  const drawLightBar = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      const w = window.innerWidth
      const h = 300
      const lightBarX = w / 2
      const lightBarWidth = 5 // increased beam width from 3 to 8 pixels
      const fadeZone = scanningActive ? 35 : 60

      // Vertical gradient for masking
      const verticalGradient = ctx.createLinearGradient(0, 0, 0, h)
      verticalGradient.addColorStop(0, "rgba(255, 255, 255, 0)")
      verticalGradient.addColorStop(fadeZone / h, "rgba(255, 255, 255, 1)")
      verticalGradient.addColorStop(1 - fadeZone / h, "rgba(255, 255, 255, 1)")
      verticalGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.globalCompositeOperation = "lighter"

      const glowIntensity = scanningActive ? 3.5 : 1

      // Core beam
      const coreGradient = ctx.createLinearGradient(lightBarX - lightBarWidth / 2, 0, lightBarX + lightBarWidth / 2, 0)
      coreGradient.addColorStop(0, "rgba(255, 255, 255, 0)")
      coreGradient.addColorStop(0.3, `rgba(255, 255, 255, ${0.9 * glowIntensity})`)
      coreGradient.addColorStop(0.5, `rgba(255, 255, 255, ${1 * glowIntensity})`)
      coreGradient.addColorStop(0.7, `rgba(255, 255, 255, ${0.9 * glowIntensity})`)
      coreGradient.addColorStop(1, "rgba(255, 255, 255, 0)")

      ctx.globalAlpha = 1
      ctx.fillStyle = coreGradient
      ctx.fillRect(lightBarX - lightBarWidth / 2, 0, lightBarWidth, h)

      // Glow effects
      const glow1Gradient = ctx.createLinearGradient(lightBarX - lightBarWidth * 2, 0, lightBarX + lightBarWidth * 2, 0)
      glow1Gradient.addColorStop(0, "rgba(139, 92, 246, 0)")
      glow1Gradient.addColorStop(0.5, `rgba(196, 181, 253, ${0.8 * glowIntensity})`)
      glow1Gradient.addColorStop(1, "rgba(139, 92, 246, 0)")

      ctx.globalAlpha = scanningActive ? 1.0 : 0.8
      ctx.fillStyle = glow1Gradient
      ctx.fillRect(lightBarX - lightBarWidth * 2, 0, lightBarWidth * 4, h)

      // Apply vertical gradient mask
      ctx.globalCompositeOperation = "destination-in"
      ctx.globalAlpha = 1
      ctx.fillStyle = verticalGradient
      ctx.fillRect(0, 0, w, h)
    },
    [scanningActive],
  )

  // Update card clipping based on scanner position
  const updateCardClipping = useCallback(() => {
    const scannerX = window.innerWidth / 2
    const scannerWidth = 12 // increased scanner width from 8 to 12 pixels to match larger beam
    const scannerLeft = scannerX - scannerWidth / 2
    const scannerRight = scannerX + scannerWidth / 2
    let anyScanningActive = false

    document.querySelectorAll(".card-wrapper").forEach((wrapper) => {
      const rect = wrapper.getBoundingClientRect()
      const cardLeft = rect.left
      const cardRight = rect.right
      const cardWidth = rect.width

      const normalCard = wrapper.querySelector(".card-normal") as HTMLElement
      const asciiCard = wrapper.querySelector(".card-ascii") as HTMLElement

      if (cardLeft < scannerRight && cardRight > scannerLeft) {
        anyScanningActive = true
        const scannerIntersectLeft = Math.max(scannerLeft - cardLeft + 7, 0)
        const scannerIntersectRight = Math.min(scannerRight - cardLeft, cardWidth)

        const normalClipRight = (scannerIntersectLeft / cardWidth) * 100
        const asciiClipLeft = (scannerIntersectRight / cardWidth) * 100

        normalCard?.style.setProperty("--clip-right", `${normalClipRight}%`)
        asciiCard?.style.setProperty("--clip-left", `${asciiClipLeft}%`)
      } else {
        if (cardRight < scannerLeft) {
          normalCard?.style.setProperty("--clip-right", "100%")
          asciiCard?.style.setProperty("--clip-left", "100%")
        } else if (cardLeft > scannerRight) {
          normalCard?.style.setProperty("--clip-right", "0%")
          asciiCard?.style.setProperty("--clip-left", "0%")
        }
      }
    })

    setScanningActive(anyScanningActive)
  }, [])

  // Mouse/touch event handlers
  const handleMouseDown = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setIsAnimating(false)

    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
    lastMouseX.current = clientX
    mouseVelocity.current = 0
  }, [])

  const handleMouseMove = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!isDragging) return
      e.preventDefault()

      const clientX = "touches" in e ? e.touches[0].clientX : e.clientX
      const deltaX = clientX - lastMouseX.current
      setPosition((prev) => prev + deltaX)
      mouseVelocity.current = deltaX * 60
      lastMouseX.current = clientX
    },
    [isDragging],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDragging) return

    setIsDragging(false)

    const minVelocity = 30
    if (Math.abs(mouseVelocity.current) > minVelocity) {
      setVelocity(Math.abs(mouseVelocity.current))
      setDirection(mouseVelocity.current > 0 ? 1 : -1)
    } else {
      setVelocity(120)
    }

    setIsAnimating(true)
  }, [isDragging])

  // Animation loop for particles and scanner
  useEffect(() => {
    const animate = () => {
      const canvas = scannerCanvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")!
      const currentTime = performance.now()
      const deltaTime = (currentTime - lastTime.current) / 1000
      lastTime.current = currentTime

      // Clear canvas
      ctx.globalCompositeOperation = "source-over"
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw scanner beam
      drawLightBar(ctx)

      // Update and draw particles
      ctx.globalCompositeOperation = "lighter"

      const maxParticles = scanningActive ? 2500 : 800
      const intensity = scanningActive ? 1.8 : 0.8

      // Update existing particles
      for (let i = 1; i <= particleCount.current; i++) {
        if (particles.current[i]) {
          updateParticle(particles.current[i])
          drawParticle(ctx, particles.current[i])
        }
      }

      // Create new particles
      if (Math.random() < intensity && particleCount.current < maxParticles) {
        const particle = createParticle()
        particle.originalAlpha = particle.alpha
        particle.startX = particle.x
        particleCount.current++
        particles.current[particleCount.current] = particle
      }

      // Remove excess particles
      if (particleCount.current > maxParticles + 200) {
        const excessCount = Math.min(15, particleCount.current - maxParticles)
        for (let i = 0; i < excessCount; i++) {
          delete particles.current[particleCount.current - i]
        }
        particleCount.current -= excessCount
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    console.log("[v0] Starting particle animation...")
    lastTime.current = performance.now()
    animate()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [scanningActive, drawLightBar, updateParticle, drawParticle, createParticle])

  useEffect(() => {
    const animateCards = () => {
      const currentTime = performance.now()
      const deltaTime = (currentTime - lastCardTime.current) / 1000
      lastCardTime.current = currentTime

      if (isAnimating && !isDragging) {
        const friction = 0.95
        const minVelocity = 30

        setVelocity((currentVelocity) => {
          let newVelocity = currentVelocity
          if (newVelocity > minVelocity) {
            newVelocity *= friction
          } else {
            newVelocity = Math.max(minVelocity, newVelocity)
          }
          return newVelocity
        })

        setPosition((currentPosition) => {
          let newPosition = currentPosition + velocity * direction * deltaTime

          if (cardLineRef.current) {
            const cardLineWidth = cardLineRef.current.scrollWidth / 2 // Half because we duplicate cards

            if (newPosition < -cardLineWidth) {
              newPosition += cardLineWidth
            }
            if (newPosition > 0) {
              newPosition -= cardLineWidth
            }
          }

          // Update card line transform
          if (cardLineRef.current) {
            cardLineRef.current.style.transform = `translateX(${newPosition}px)`
          }

          return newPosition
        })
      }

      // Update card clipping
      updateCardClipping()

      cardAnimationRef.current = requestAnimationFrame(animateCards)
    }

    console.log("[v0] Starting card animation...")
    lastCardTime.current = performance.now()
    animateCards()

    return () => {
      if (cardAnimationRef.current) {
        cancelAnimationFrame(cardAnimationRef.current)
      }
    }
  }, [isAnimating, isDragging, velocity, direction, updateCardClipping])

  // Initialize everything
  useEffect(() => {
    console.log("[v0] Initializing animation...")
    createGradientCache()

    // Initialize particles
    for (let i = 0; i < 800; i++) {
      const particle = createParticle()
      particle.originalAlpha = particle.alpha
      particle.startX = particle.x
      particleCount.current++
      particles.current[particleCount.current] = particle
    }

    // Setup canvas
    const canvas = scannerCanvasRef.current
    if (canvas) {
      canvas.width = window.innerWidth
      canvas.height = 300
    }

    // Setup event listeners
    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("touchmove", handleMouseMove)
    document.addEventListener("touchend", handleMouseUp)

    console.log("[v0] Animation initialized!")

    return () => {
      console.log("[v0] Cleaning up animations...")
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("touchmove", handleMouseMove)
      document.removeEventListener("touchend", handleMouseUp)
    }
  }, [createGradientCache, createParticle, handleMouseMove, handleMouseUp])

  // Update ASCII content periodically
  useEffect(() => {
    const interval = setInterval(() => {
      document.querySelectorAll(".ascii-content").forEach((content) => {
        if (Math.random() < 0.15) {
          const element = content as HTMLElement
          const width = Math.floor(400 / 6) // char width
          const height = Math.floor(250 / 13) // line height
          element.textContent = generateCode(width, height)
        }
      })
    }, 200)

    return () => clearInterval(interval)
  }, [generateCode])

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans">
      {/* Main Container */}
      <div ref={containerRef} className="relative w-screen h-screen flex items-center justify-center">
        {/* Scanner Canvas */}
        <canvas
          ref={scannerCanvasRef}
          className="absolute top-1/2 left-0 -translate-y-1/2 w-screen h-[300px] z-[15] pointer-events-none"
        />

        {/* Card Stream */}
        <div className="absolute w-screen h-[180px] flex items-center overflow-visible">
          <div
            ref={cardLineRef}
            className="flex items-center gap-[60px] whitespace-nowrap cursor-grab select-none will-change-transform active:cursor-grabbing"
            onMouseDown={handleMouseDown}
            onTouchStart={handleMouseDown}
            style={{ transform: `translateX(${position}px)` }}
          >
            {[...Array.from({ length: 30 }, (_, i) => i), ...Array.from({ length: 30 }, (_, i) => i + 30)].map((i) => (
              <div key={i} className="card-wrapper relative w-[400px] h-[250px] flex-shrink-0">
                {/* Normal Card */}
                <div
                  className="card-normal absolute top-0 left-0 w-[400px] h-[250px] rounded-[15px] overflow-hidden bg-transparent shadow-[0_15px_40px_rgba(0,0,0,0.4)] z-[2]"
                  style={{ clipPath: "inset(0 0 0 var(--clip-right, 0%))" }}
                >
                  <img
                    className="w-full h-full object-cover rounded-[15px] transition-all duration-300 brightness-110 contrast-110 shadow-[inset_0_0_20px_rgba(0,0,0,0.1)] hover:brightness-120 hover:contrast-120"
                    src={cardImages[i % cardImages.length] || "/placeholder.svg"}
                    alt="Credit Card"
                    onError={(e) => {
                      const canvas = document.createElement("canvas")
                      canvas.width = 400
                      canvas.height = 250
                      const ctx = canvas.getContext("2d")!

                      const gradient = ctx.createLinearGradient(0, 0, 400, 250)
                      gradient.addColorStop(0, "#667eea")
                      gradient.addColorStop(1, "#764ba2")

                      ctx.fillStyle = gradient
                      ctx.fillRect(0, 0, 400, 250)

                      e.currentTarget.src = canvas.toDataURL()
                    }}
                  />
                </div>

                {/* ASCII Card */}
                <div
                  className="card-ascii absolute top-0 left-0 w-[400px] h-[250px] rounded-[15px] overflow-hidden bg-transparent z-[1]"
                  style={{ clipPath: "inset(0 calc(100% - var(--clip-left, 0%)) 0 0)" }}
                >
                  <div className="ascii-content absolute top-0 left-0 w-full h-full text-[rgba(220,210,255,0.6)] font-mono text-[11px] leading-[13px] overflow-hidden whitespace-pre m-0 p-0 text-left align-top box-border animate-pulse">
                    {generateCode(Math.floor(400 / 6), Math.floor(250 / 13))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .card-wrapper {
          --clip-right: 0%;
          --clip-left: 0%;
        }
        
        .ascii-content {
          -webkit-mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.8) 30%,
            rgba(0, 0, 0, 0.6) 50%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.2) 100%
          );
          mask-image: linear-gradient(
            to right,
            rgba(0, 0, 0, 1) 0%,
            rgba(0, 0, 0, 0.8) 30%,
            rgba(0, 0, 0, 0.6) 50%,
            rgba(0, 0, 0, 0.4) 80%,
            rgba(0, 0, 0, 0.2) 100%
          );
        }
      `}</style>
    </div>
  )
}
