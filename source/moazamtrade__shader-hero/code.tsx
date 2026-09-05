"use client"
import { useEffect, useRef, useState } from "react"
import { MeshGradient, PulsingBorder } from "@paper-design/shaders-react"
import { motion } from "framer-motion"

export default function BeautifulHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isActive, setIsActive] = useState(false)

  useEffect(() => {
    const handleMouseEnter = () => setIsActive(true)
    const handleMouseLeave = () => setIsActive(false)

    const container = containerRef.current
    if (container) {
      container.addEventListener("mouseenter", handleMouseEnter)
      container.addEventListener("mouseleave", handleMouseLeave)
    }

    return () => {
      if (container) {
        container.removeEventListener("mouseenter", handleMouseEnter)
        container.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div ref={containerRef} className="min-h-screen bg-black relative overflow-hidden">
      {/* SVG Filters */}
      <svg className="absolute inset-0 w-0 h-0">
        <defs>
          <filter id="glass-effect" x="-50%" y="-50%" width="200%" height="200%">
            <feTurbulence baseFrequency="0.005" numOctaves="1" result="noise" />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="0.3" />
            <feColorMatrix
              type="matrix"
              values="1 0 0 0 0.02
                      0 1 0 0 0.02
                      0 0 1 0 0.05
                      0 0 0 0.9 0"
              result="tint"
            />
          </filter>
          <filter id="gooey-filter" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="gooey"
            />
            <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
          </filter>
        </defs>
      </svg>

      <MeshGradient
        className="absolute inset-0 w-full h-full"
        colors={["#000000", "#14b8a6", "#ff7f50", "#ffd700", "#1e293b"]}
        speed={0.3}
        backgroundColor="#000000"
      />
      <MeshGradient
        className="absolute inset-0 w-full h-full opacity-60"
        colors={["#000000", "#ffffff", "#14b8a6", "#000000"]}
        speed={0.2}
        wireframe="true"
        backgroundColor="transparent"
      />

      {/* Header */}
      <header className="relative z-20 flex items-center justify-between p-6">
        {/* Logo */}
        <div className="flex items-center">
         <h1 className="font-bold">JESSI</h1>
        </div>

        {/* Navigation */}
        <nav className="flex items-center space-x-2">
          <a
            href="#"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Features
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Pricing
          </a>
          <a
            href="#"
            className="text-white/80 hover:text-white text-xs font-light px-3 py-2 rounded-full hover:bg-white/10 transition-all duration-200"
          >
            Docs
          </a>
        </nav>

        {/* Login Button Group with Arrow */}
        <div id="gooey-btn" className="relative flex items-center group" style={{ filter: "url(#gooey-filter)" }}>
          <button className="absolute right-0 px-2.5 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center justify-center -translate-x-10 group-hover:-translate-x-19 z-0">
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 17L17 7M17 7H7M17 7V17" />
            </svg>
          </button>
          <button className="px-6 py-2 rounded-full bg-white text-black font-normal text-xs transition-all duration-300 hover:bg-white/90 cursor-pointer h-8 flex items-center z-10">
            Login
          </button>
        </div>
      </header>

      <main className="absolute inset-0 flex items-center justify-center z-20">
        <div className="text-center max-w-4xl px-8">
          

          <h1 className="text-5xl md:text-8xl lg:text-9xl tracking-tight font-light text-white mb-6 text-balance">
            <span className="font-medium italic instrument">Marketing</span>
            <br />
            <span className="font-light tracking-tight text-white">That</span>{" "}
            <span className="bg-gradient-to-r from-teal-400 via-coral-400 to-yellow-400 bg-clip-text text-transparent font-medium">
              Converts
            </span>
          </h1>

          <p className="text-lg font-light text-white/80 mb-8 leading-relaxed max-w-2xl mx-auto text-pretty">
            Unlock explosive growth with Jessi's data-driven marketing strategies. We turn your audience into loyal
            customers through compelling campaigns that deliver
            <span className="text-teal-400 font-medium"> 300% higher conversion rates</span>.
          </p>

          {/* Marketing Stats */}
          <div className="flex items-center justify-center gap-8 mb-8 flex-wrap">
            <div className="text-center">
              <div className="text-3xl font-bold text-white mb-1">10M+</div>
              <div className="text-sm text-white/60">Campaigns Launched</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-teal-400 mb-1">300%</div>
              <div className="text-sm text-white/60">ROI Increase</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-coral-400 mb-1">24/7</div>
              <div className="text-sm text-white/60">AI Optimization</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <button className="px-10 py-4 rounded-full bg-gradient-to-r from-teal-500 to-coral-500 text-white font-medium text-sm transition-all duration-200 hover:shadow-2xl hover:shadow-teal-500/25 cursor-pointer transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="px-10 py-4 rounded-full bg-transparent border border-white/30 text-white font-normal text-sm transition-all duration-200 hover:bg-white/10 hover:border-white/50 cursor-pointer">
              Watch Demo
            </button>
          </div>

          {/* Trust Indicators */}
          <div className="mt-12 text-center">
            <p className="text-xs text-white/50 mb-4">Trusted by industry leaders</p>
            <div className="flex items-center justify-center gap-8 opacity-40">
              <div className="text-white font-semibold text-sm">SHOPIFY</div>
              <div className="text-white font-semibold text-sm">STRIPE</div>
              <div className="text-white font-semibold text-sm">AIRBNB</div>
              <div className="text-white font-semibold text-sm">UBER</div>
            </div>
          </div>
        </div>
      </main>
 </div>
  )
}
