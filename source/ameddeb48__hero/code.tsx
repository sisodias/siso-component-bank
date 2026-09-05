"use client"

import { useState, useEffect, useRef } from "react"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  duration: number
  delay: number
}

export default function ViralHeroComponent() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [typedText, setTypedText] = useState("")
  const [showCursor, setShowCursor] = useState(true)
  const [currentPhrase, setCurrentPhrase] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const phrases = ["Build the future.", "Ship faster.", "Scale infinitely.", "Create magic."]

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = []
      for (let i = 0; i < 20; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 2,
          duration: Math.random() * 20 + 15,
          delay: Math.random() * 5,
        })
      }
      setParticles(newParticles)
    }

    generateParticles()
    const interval = setInterval(generateParticles, 10000)
    return () => clearInterval(interval)
  }, [])

  // Typewriter effect
  useEffect(() => {
    const currentText = phrases[currentPhrase]
    let index = 0
    setTypedText("")

    const typeInterval = setInterval(() => {
      if (index < currentText.length) {
        setTypedText(currentText.slice(0, index + 1))
        index++
      } else {
        clearInterval(typeInterval)
        setTimeout(() => {
          setCurrentPhrase((prev) => (prev + 1) % phrases.length)
        }, 2000)
      }
    }, 100)

    return () => clearInterval(typeInterval)
  }, [currentPhrase])

  // Cursor blink effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev)
    }, 500)
    return () => clearInterval(cursorInterval)
  }, [])

  return (
    <div ref={containerRef} className="relative min-h-screen bg-background overflow-hidden grid-bg">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20 animate-gradient bg-[length:400%_400%]" />
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60 animate-particle"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animationDuration: `${particle.duration}s`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Grid overlay with fade */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Floating logo/icon */}
        <div className="mb-8 animate-float">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center glass animate-pulse-glow">
            <div className="w-8 h-8 bg-white rounded-lg" />
          </div>
        </div>

        {/* Main heading with gradient text */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight text-balance">
          <span className="gradient-text">The complete platform</span>
          <br />
          <span className="text-foreground">to build the web.</span>
        </h1>

        {/* Animated typewriter subtitle */}
        <div className="mb-8 h-16 flex items-center">
          <p className="text-xl md:text-2xl text-muted-foreground">
            {typedText}
            <span className={`inline-block w-0.5 h-6 bg-purple-500 ml-1 ${showCursor ? "opacity-100" : "opacity-0"}`} />
          </p>
        </div>

        {/* Description */}
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-12 leading-relaxed animate-slide-up text-balance">
          Your team's toolkit to stop configuring and start innovating. Securely build, deploy, and scale the best web
          experiences with cutting-edge technology.
        </p>

   

        {/* Stats cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
          {[
            { metric: "99.9%", label: "Uptime", sublabel: "Enterprise grade" },
            { metric: "10x", label: "Faster", sublabel: "Time to market" },
            { metric: "500K+", label: "Developers", sublabel: "Trust our platform" },
          ].map((stat, index) => (
            <div
              key={index}
              className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 hover:scale-105 group animate-slide-up"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="text-3xl font-bold gradient-text mb-2 group-hover:neon-text transition-all duration-300">
                {stat.metric}
              </div>
              <div className="text-foreground font-semibold mb-1">{stat.label}</div>
              <div className="text-sm text-muted-foreground">{stat.sublabel}</div>
            </div>
          ))}
        </div>

        {/* Floating elements */}
        <div
          className="absolute top-20 left-10 w-20 h-20 bg-purple-500/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-20 right-10 w-32 h-32 bg-blue-500/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-5 w-16 h-16 bg-cyan-500/20 rounded-full blur-xl animate-float"
          style={{ animationDelay: "3s" }}
        />
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </div>
  )
}

export { ViralHeroComponent as HeroComponent }
