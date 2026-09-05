import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState, createContext, useContext } from 'react'
export const Component = () => {

// ScrollManager Context
interface ScrollContextType {
  scrollTo: (target: number | HTMLElement, options?: { offset?: number }) => void
  scrollProgress: number
}

const ScrollContext = createContext<ScrollContextType>({
  scrollTo: () => {},
  scrollProgress: 0,
})

const useScroll = () => useContext(ScrollContext)

// ScrollManager Component
const ScrollManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [scrollProgress, setScrollProgress] = useState(0)
  const frameRef = useRef<number | null>(null)
  const scrolling = useRef(false)
  const targetY = useRef(0)
  const currentY = useRef(0)
  const ease = 0.08

  const smoothScroll = () => {
    const distance = targetY.current - currentY.current
    const delta = distance * ease

    if (Math.abs(distance) > 0.5) {
      currentY.current += delta
      window.scrollTo(0, currentY.current)
      frameRef.current = requestAnimationFrame(smoothScroll)
    } else {
      window.scrollTo(0, targetY.current)
      currentY.current = targetY.current
      scrolling.current = false
      frameRef.current = null
    }
  }

  const scrollTo = (target: number | HTMLElement, options = { offset: 0 }) => {
    const offset = options.offset || 0
    currentY.current = window.scrollY

    if (typeof target === 'number') {
      targetY.current = target + offset
    } else {
      const rect = target.getBoundingClientRect()
      targetY.current = window.scrollY + rect.top + offset
    }

    scrolling.current = true
    if (frameRef.current) cancelAnimationFrame(frameRef.current)
    frameRef.current = requestAnimationFrame(smoothScroll)
  }

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement
      const scrollHeight = doc.scrollHeight - window.innerHeight
      const progress = scrollHeight > 0 ? window.scrollY / scrollHeight : 0
      setScrollProgress(progress)
    }

    document.documentElement.style.scrollBehavior = 'auto'
    onScroll()

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      document.documentElement.style.scrollBehavior = ''
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  useEffect(() => {
    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY
      currentY.current = window.scrollY
      targetY.current = currentY.current + delta

      if (!scrolling.current) {
        scrolling.current = true
        frameRef.current = requestAnimationFrame(smoothScroll)
      }
    }

    window.addEventListener('wheel', handleWheel, { passive: false })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [])

  return (
    <ScrollContext.Provider value={{ scrollTo, scrollProgress }}>
      {children}
    </ScrollContext.Provider>
  )
}

// Hook for scroll progress
const useScrollProgress = () => {
  const { scrollProgress } = useScroll()
  return { scrollProgress }
}

// ScrollProgressIndicator Component
const ScrollProgressIndicator = () => {
  const { scrollProgress } = useScrollProgress()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const starsRef = useRef<{
    x: number
    y: number
    radius: number
    alpha: number
    speed: number
  }[]>([])

  const trailRef = useRef<{ x: number; y: number; alpha: number; radius: number }[]>([])
  const animationRef = useRef<number | null>(null)

  useEffect(() => {
    const generateStars = (height: number, width: number) => {
      const stars = []
      for (let i = 0; i < 1000; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.5,
          alpha: Math.random() * 0.5 + 0.5,
          speed: Math.random() * 0.8 + 0.2,
        })
      }
      return stars
    }

    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.width = 60
      canvas.height = window.innerHeight
      starsRef.current = generateStars(canvas.height, canvas.width)
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = 60
    canvas.height = window.innerHeight
    let lastTime = 0

    const draw = (time: number) => {
      if (!ctx) return
      if (time - lastTime < 33) {
        animationRef.current = requestAnimationFrame(draw)
        return
      }
      lastTime = time
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw background stars
      starsRef.current.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        const alpha = Math.abs(Math.sin(time * star.speed * 0.01)) * 0.3 + 0.4
        ctx.fillStyle = `rgba(215, 255, 255, ${alpha})`
        ctx.fill()
      })

      // Planet coords
      const planetX = canvas.width - 30
      const planetY = canvas.height * scrollProgress

      // Update trail
      trailRef.current.unshift({
        x: planetX,
        y: planetY,
        alpha: 30,
        radius: 6 * 5,
      })
      if (trailRef.current.length > 300) {
        trailRef.current.pop()
      }

      // Draw tail
      trailRef.current.forEach((point, i) => {
        const fade = 1 - i / trailRef.current.length
        ctx.beginPath()
        ctx.arc(point.x, point.y, point.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0, 0, 0, ${fade * 0.2})`
        ctx.fill()
      })

      // Draw textured planet
      const radius = 30
      
      // Base planet color
      const baseGradient = ctx.createRadialGradient(
        planetX - radius * 0.3, planetY - radius * 0.3, 0,
        planetX, planetY, radius
      )
       baseGradient.addColorStop(0, '#4A90E2')
      baseGradient.addColorStop(0.4, '#000000')
      baseGradient.addColorStop(1, '#1A365D')
      ctx.beginPath()
      ctx.arc(planetX, planetY, radius, 0, Math.PI * 2)
      ctx.fillStyle = baseGradient
      ctx.fill()
      // Add continent textures
      ctx.save()
      ctx.beginPath()
      ctx.arc(planetX, planetY, radius, 0, Math.PI * 2)
      ctx.clip()
      // Create landmasses using noise-like patterns
      const rotation = time * 0.00002
      for (let i = 0; i < 12; i++) {
        const angle = (i / 12) * Math.PI * 2 + rotation
        const distance = radius * (1.3 + Math.sin(i * 0.7) * 0.01)
        const landX = planetX + Math.cos(angle) * distance / 0.1
        const landY = planetY + Math.sin(angle) * distance * 0.6
        // Ensure landSize is always positive by using a smaller multiplier for sin
        const landSize = radius * Math.max(0.15 + Math.sin(i * 0.3) * 0.3, 2.1)
        ctx.beginPath()
        ctx.ellipse(
          landX,
          landY,
          landSize,
          landSize * 1.7,
          angle,
          0,
          Math.PI * 2,
        )
        ctx.fillStyle = '#00000'
        ctx.fill()
      }
      // Add smaller land details with guaranteed positive sizes
      for (let i = 0; i < 20; i++) {
        const angle = (i / 20) * Math.PI * 2 + rotation * 1.5
        const distance = radius * (10.2 + Math.sin(i * 2.1) * 0.3)
        const landX = planetX + Math.cos(angle) * distance
        const landY = planetY + Math.sin(angle) * distance * 0.8
        // Ensure landSize is always positive
        const landSize =
          radius * Math.max(0.05 + Math.sin(i * 3.1) * 0.03, 0.02)
        ctx.beginPath()
        ctx.arc(landX, landY, landSize, 0, Math.PI * 12)
        ctx.fillStyle = '#FF0000'
        ctx.fill()
      }
      // Add cloud patterns
      ctx.globalAlpha = 0.1
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2 + rotation * 3
        const distance = radius * (0.4 + Math.sin(i * 100.3) * 2)
        const cloudX = planetX + Math.cos(angle) * distance
        const cloudY = planetY + Math.sin(angle) * distance * 0.5
        const cloudSize = radius * (0.1 + Math.sin(i * 0.1) * 0.1)
        ctx.beginPath()
        ctx.ellipse(
          cloudX,
          cloudY,
          cloudSize,
          cloudSize,
          angle,
          0,
          Math.PI * 2,
        )
        ctx.fillStyle = '#FFFFFF'
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.restore()
      // Add terminator shadow
      ctx.save()
      ctx.beginPath()
      ctx.arc(planetX, planetY, radius, 0, Math.PI * 2)
      ctx.clip()
      const shadowGradient = ctx.createLinearGradient(
        planetX - radius * 0.1,
        planetY,
        planetX + radius * 20,
        planetY,
      )
      shadowGradient.addColorStop(0, 'rgba(0, 0, 0, 0)')
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0)')
      shadowGradient.addColorStop(1, 'rgba(0, 0, 0, 0.6)')
      
      ctx.fillStyle = shadowGradient
      ctx.fillRect(planetX - radius, planetY - radius, radius * 2, radius * 2)
      ctx.restore()

      // Add atmospheric highlight
            ctx.beginPath()
      ctx.arc(
        planetX - radius * 0.4,
        planetY - radius * 0.4,
        radius * 0.003,
        0,
        Math.PI * 2,
      )
      ctx.fillStyle = 'rgba(155, 255, 25, 0.05)'
      ctx.fill()
      animationRef.current = requestAnimationFrame(draw)
    }
    animationRef.current = requestAnimationFrame(draw)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [scrollProgress])

  return (
    <canvas
      ref={canvasRef}
      className="fixed right-0 top-0 z-50 pointer-events-none"
      style={{ width: '60px' }}
    />
  )
}

// Demo Content Sections
const Section = ({ title, color, height = "100vh" }: { title: string; color: string; height?: string }) => (
  <div 
    className={`flex items-center justify-center text-white text-4xl font-bold ${color}`}
    style={{ height }}
  >
    <div className="text-center">
      <h2>{title}</h2>
      <p className="text-lg mt-4 opacity-80">Scroll to see the planet move!</p>
    </div>
  </div>
)

// Main App Component
  return (
    <ScrollManager>
      <div className="relative">
        <ScrollProgressIndicator />
        
        {/* Demo content sections */}
        <Section title="🌍 Scroll Progress Planet" color="bg-gradient-to-br from-black-900 to-gray-1000" />
        <Section title="🚀 Watch the Planet Travel" color="bg-gradient-to-br from-gray-1000 to-black-900" />
        <Section title="⭐ Through the Stars" color="bg-gradient-to-br from-black-900 to-gray-1000" />
        <Section title="🌌 As You Scroll Down" color="bg-gradient-to-br from-gray-1000 to-black-900" />
        <Section title="🛰️ Smooth Animation" color="bg-gradient-to-br from-black-900 to-gray-1000" />
        <Section title="🌟 Textured Planet Surface" color="bg-gradient-to-br from-gray-1000 to-black-900" />
        <Section title="🌍 Ready for Easy Use!" color="bg-gradient-to-br from-black-900 to-gray-1000" height="150vh" />
      </div>
    </ScrollManager>
  )
}