"use client"

import { useEffect, useRef } from "react"

export const Component=()=> {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const globeCanvasRef = useRef<HTMLCanvasElement>(null)

  // Stars animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const stars: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number }[] = []

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      initStars()
    }

    function initStars() {
      stars.splice(0, stars.length)
      const starCount = Math.floor((canvas.width * canvas.height) / 1000)
      for (let i = 0; i < starCount; i++) {
        stars.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          radius: Math.random() * 1.5,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          alpha: Math.random(),
        })
      }
    }

    function drawStars() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.fillStyle = "#000"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(135, 206, 250, ${star.alpha})`
        ctx.fill()

        star.x += star.vx
        star.y += star.vy
        star.alpha += (Math.random() - 0.5) * 0.05
        star.alpha = Math.max(0, Math.min(1, star.alpha))

        if (star.x < 0) star.x = canvas.width
        if (star.x > canvas.width) star.x = 0
        if (star.y < 0) star.y = canvas.height
        if (star.y > canvas.height) star.y = 0
      })

      requestAnimationFrame(drawStars)
    }

    window.addEventListener("resize", handleResize)
    handleResize()
    drawStars()

    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Globe animation
  useEffect(() => {
    const canvas = globeCanvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = 600
    canvas.height = 600

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    const radius = 220

    const dots: { x: number; y: number; z: number; radius: number; alpha: number }[] = []

    for (let i = 0; i < 2000; i++) {
      const phi = Math.acos(2 * Math.random() - 1)
      const theta = 2 * Math.PI * Math.random()
      const x = radius * Math.sin(phi) * Math.cos(theta)
      const y = radius * Math.sin(phi) * Math.sin(theta)
      const z = radius * Math.cos(phi)
      if (z > -radius / 2) {
        dots.push({
          x, y, z,
          radius: Math.random() * 1.5 + 1,
          alpha: 0.6 + Math.random() * 0.4,
        })
      }
    }

    function addContinentDots(dotsArray: any[], centerLat: number, centerLng: number, latSpread: number, lngSpread: number, radius: number, count: number) {
      for (let i = 0; i < count; i++) {
        const lat = ((centerLat + (Math.random() - 0.5) * latSpread) * Math.PI) / 180
        const lng = ((centerLng + (Math.random() - 0.5) * lngSpread) * Math.PI) / 180
        const x = radius * Math.cos(lat) * Math.cos(lng)
        const y = radius * Math.sin(lat)
        const z = radius * Math.cos(lat) * Math.sin(lng)
        dotsArray.push({
          x, y, z,
          radius: Math.random() * 2 + 1.5,
          alpha: 0.7 + Math.random() * 0.3,
        })
      }
    }

    addContinentDots(dots, -30, -100, 60, 40, radius, 200) // North America
    addContinentDots(dots, 10, -60, 40, 40, radius, 150)   // South America
    addContinentDots(dots, 0, 20, 60, 70, radius, 250)     // Europe/Africa
    addContinentDots(dots, 30, 100, 70, 60, radius, 300)   // Asia
    addContinentDots(dots, 25, 135, 30, 30, radius, 100)   // Australia

    let rotation = 0
    function drawGlobe() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      const gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, radius * 1.2)
      gradient.addColorStop(0, "rgba(30, 144, 255, 0.1)")
      gradient.addColorStop(0.5, "rgba(30, 144, 255, 0.05)")
      gradient.addColorStop(1, "rgba(30, 144, 255, 0)")

      ctx.fillStyle = gradient
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius * 1.2, 0, Math.PI * 2)
      ctx.fill()

      dots.sort((a, b) => a.z - b.z)
      dots.forEach(dot => {
        const cosR = Math.cos(rotation)
        const sinR = Math.sin(rotation)
        const x = dot.x * cosR + dot.z * sinR
        const z = -dot.x * sinR + dot.z * cosR

        const scale = (radius + z) / (radius * 2)
        const projectedX = centerX + x
        const projectedY = centerY + dot.y

        if (z > -radius / 2) {
          const alpha = Math.min(1, (z + radius) / (radius * 1.5)) * dot.alpha
          const dotSize = dot.radius * scale

          ctx.beginPath()
          ctx.arc(projectedX, projectedY, dotSize, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(135, 206, 250, ${alpha})`
          ctx.fill()
        }
      })

      rotation += 0.005
      requestAnimationFrame(drawGlobe)
    }

    drawGlobe()
  }, [])

  return (
    <div className="relative w-full h-screen overflow-hidden bg-black text-white font-sans">
      {/* Stars background */}
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0" />

      {/* Globe */}
      <div className="absolute right-10 bottom-10 z-10">
        <canvas ref={globeCanvasRef} className="w-[300px] h-[300px] md:w-[600px] md:h-[600px] mr-[20vw] " />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-between h-full py-8">
        {/* Header */}
        <div className="w-full flex justify-end px-8">
          <button className="bg-transparent hover:bg-blue-900/30 text-white border border-blue-500 rounded-full px-8 py-2 transition-colors duration-300">
            Get Access
          </button>
        </div>

        {/* Main heading */}
        <div className="text-center px-4 mt-8">
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-blue-100 leading-tight tracking-tight">
            Empower with <span className="text-blue-200">Blockchain</span>
            <br />
            Elevate with <span className="text-blue-200">AI.</span>
          </h1>
        </div>

        {/* Logos marquee */}
        <div className="w-full overflow-hidden my-8 whitespace-nowrap">
          <div className="inline-block animate-marquee space-x-16 px-8">
           
          </div>
        </div>
      </div>
    </div>
  )
}
