"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { MeshGradient } from "@paper-design/shaders-react"
import { ArrowRight, Sparkles } from "lucide-react"


const letterAnimation = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const containerAnimation = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.05 },
  },
}

export const Component = () => {
  const title = "Elevate Your Experience"
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
    <div
      ref= { containerRef }
  className = "min-h-screen bg-black relative overflow-hidden w-full"
    >

    <svg className="absolute inset-0 w-0 h-0" >
      <defs>
      <filter id="glass-effect" x = "-50%" y = "-50%" width = "200%" height = "200%" >
        <feTurbulence baseFrequency="0.004" numOctaves = "1" result = "noise" />
          <feDisplacementMap in="SourceGraphic" in2 = "noise" scale = "0.25" />
            <feColorMatrix
              type="matrix"
  values = "1 0 0 0 0  
  0 1 0 0 0
  0 0 1 0 0
  0 0 0 0.9 0"
  result = "tint"
    />
    </filter>
    < /defs>
    < /svg>


    < MeshGradient
  className = "absolute inset-0 w-full h-full"
  colors = { ["#000000", "#1a1a1a", "#2e2e2e", "#ffffff"]}
  speed = { 0.25}
  backgroundColor = "#000000"
    />
    <MeshGradient
        className="absolute inset-0 w-full h-full opacity-40"
  colors = { ["#000000", "#ffffff", "#2e2e2e"]}
  speed = { 0.15}
  wireframe = "true"
  backgroundColor = "transparent"
    />


    <div className="relative z-10 flex flex-col items-center justify-center text-center min-h-screen px-4" >

      <motion.div
          initial={ { opacity: 0, y: -20 } }
  animate = {{ opacity: 1, y: 0 }
}
transition = {{ delay: 0.3, duration: 0.8 }}
className = "mb-6 px-4 py-1.5 rounded-full bg-white/10 text-white text-sm font-medium flex items-center gap-2 backdrop-blur-lg border border-white/20"
  >
  <Sparkles className="w-4 h-4 text-gray-200" />
    A Minimalist Future
      < /motion.div>


      < motion.h1
variants = { containerAnimation }
initial = "hidden"
animate = "visible"
className = "text-5xl md:text-7xl font-extrabold tracking-tight text-white drop-shadow-lg flex flex-wrap justify-center"
  >
{
  title.split("").map((char, index) => (
    <motion.span
              key= { index }
              variants = { letterAnimation }
              className = { char === " " ? "w-2" : ""}
  >
  { char }
  < /motion.span>
          ))}
</motion.h1>


  < motion.p
initial = {{ opacity: 0, y: 20 }}
animate = {{ opacity: 1, y: 0 }}
transition = {{ delay: 1.2, duration: 0.8 }}
className = "mt-6 max-w-2xl text-lg md:text-xl text-gray-300"
  >
  A timeless black & white aesthetic, crafted for creators who seek
          elegance, clarity, and impact in every detail.
        < /motion.p>


  < motion.div
initial = {{ opacity: 0 }}
animate = {{ opacity: 1 }}
transition = {{ delay: 2, duration: 0.8 }}
className = "mt-10 flex gap-4"
  >
  <Button
            size="lg"
className = "rounded-2xl px-6 py-6 text-lg bg-white text-black hover:bg-gray-200"
  >
  Get Started < ArrowRight className = "ml-2 h-5 w-5" />
    </Button>

    < /motion.div>
    < /div>
    < /div>
  )
}
