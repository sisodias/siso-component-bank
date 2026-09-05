"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Zap, Bitcoin, Shield, Layers } from "lucide-react"

 const featureData = [
  {
    title: "Low Fees, High Scalability",
    description:
      "Bitcoin Chain offers low fees and high scalability as an EVM-compatible chain, ensuring swift transaction processing and enhancing transaction liquidity.",
    icon: <Zap className="w-12 h-12 stroke-[1.5]" />,
  },
  {
    title: "BTC Protocols Support",
    description:
      "Bitcoin Chain supports popular Bitcoin protocols such as BRC20, BRC420, Bitmap, Atomicals, Pipe, Stamp, and more, enabling a more extensive user base to interact on Bitcoin Layer2.",
    icon: <Bitcoin className="w-12 h-12 stroke-[1.5]" />,
  },
  {
    title: "ZK Rollup on Bitcoin",
    description:
      "Bitcoin Chain has implemented ZK-Rollup to enhance efficiency and scalability, with sequencer nodes responsibly managing data transmission via decentralized Oracles, ensuring transparency and security.",
    icon: <Shield className="w-12 h-12 stroke-[1.5]" />,
  },
  {
    title: "Native Innovation",
    description:
      "Bitcoin Chain continues its commitment to fair launches and community-driven native innovations on Layer2, dedicated to delivering unique solutions designed for the Bitcoin network and its users.",
    icon: <Layers className="w-12 h-12 stroke-[1.5]" />,
  },
]

export default function FeatureCards() {
    const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
const canvas = canvasRef.current as HTMLCanvasElement
    if (!canvas) return

const ctx = canvas.getContext("2d") as CanvasRenderingContext2D
if (!(ctx instanceof CanvasRenderingContext2D)) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const stars: { x: number; y: number; radius: number; opacity: number; speed: number }[] = []

    // Create stars
    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5,
        opacity: Math.random(),
        speed: Math.random() * 0.05,
      })
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`
        ctx.fill()

        // Move stars
        star.y += star.speed

        // Reset stars that go off screen
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * canvas.width
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return (
    <section className="relative py-20 overflow-hidden">
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0"
        style={{ background: "linear-gradient(to bottom, #070314, #0c0621)" }}
      />

      <div className="relative z-10 container mx-auto px-4 mt-[20vh]">
    

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featureData.map((feature, index) => (
            <FeatureCard
              key={index}
              title={feature.title}
              description={feature.description}
              icon={feature.icon}
              delay={index * 0.1}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
interface FeatureCardProps {
  title: string
  description: string
  icon: React.ReactNode
  delay?: number
}
const  FeatureCard=({ title, description, icon, delay = 0 }: FeatureCardProps)=> {
  const borderRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const borderElement = borderRef.current
    if (!borderElement) return

    let rotation = 0
    let animationId: number

    const rotateBorder = () => {
      rotation += 0.05
      if (borderElement) {
        borderElement.style.background = `
          linear-gradient(${rotation}deg, 
          rgba(59, 130, 246, 0.1) 0%, 
          rgba(147, 51, 234, 0.7) 50%, 
          rgba(59, 130, 246, 0.1) 100%)
        `
      }
      animationId = requestAnimationFrame(rotateBorder)
    }

    rotateBorder()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{
        y: -10,
        transition: { duration: 0.3 },
      }}
      className="relative group"
    >
      {/* Animated border */}
      <div
        ref={borderRef}
        className="absolute inset-0 rounded-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-300"
        style={{ padding: "1px" }}
      />

      {/* Card content */}
      <div className="relative h-full bg-[#0a0520] rounded-2xl overflow-hidden border border-purple-900/30">
        {/* Futuristic corner cuts */}
        <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-blue-500/50 rounded-tl-lg" />
        <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-blue-500/50 rounded-tr-lg" />
        <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-blue-500/50 rounded-bl-lg" />
        <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-blue-500/50 rounded-bl-lg" />

        <div className="p-6 flex flex-col h-full">
          {/* Icon with glow */}
          <div className="mb-6 flex justify-center">
            <div className="relative w-24 h-24 flex items-center justify-center">
              <div className="absolute inset-0 bg-blue-500/20 rounded-full filter blur-xl group-hover:bg-blue-500/30 transition-all duration-300" />
              <div className="relative z-10 text-blue-400 group-hover:text-blue-300 transition-colors duration-300">
                {icon}
              </div>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-bold text-white mb-3 text-center group-hover:text-blue-200 transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="text-purple-300 text-sm flex-grow text-center">{description}</p>

          {/* Hover indicator */}
          <div className="mt-4 flex justify-center">
            <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
        </div>
      </div>

      {/* Glow effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
    </motion.div>
  )
}

