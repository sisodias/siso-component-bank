"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface GlowCardProps {
  color?: "green" | "blue" | "pink" | "violet" | "emerald"
  className?: string
  children?: React.ReactNode
}

const gradientMap: Record<NonNullable<GlowCardProps["color"]>, string> = {
  green: "from-green-400 to-green-600",
  blue: "from-blue-400 to-blue-600",
  pink: "from-pink-400 to-pink-600",
  violet: "from-violet-400 to-violet-600",
  emerald: "from-emerald-400 to-emerald-600",
}

export function GlowCard({
  color = "green",
  className,
  children,
}: GlowCardProps) {
  const selectedGradient = gradientMap[color]

  return (
    <motion.div
      className={cn("w-[300px] h-[500px] perspective cursor-pointer", className)}
      whileHover={{ scale: 1.05 }}
    >
      <motion.div
        className="relative w-full h-full rounded-xl"
        whileHover={{ rotateX: -12, rotateY: 12 }}
        transition={{ type: "spring", stiffness: 120, damping: 10 }}
      >
        {/* Soft Glow Background */}
        <motion.div
          className={cn(
            "absolute inset-0 rounded-xl bg-gradient-to-tr opacity-20 blur-3xl",
            selectedGradient
          )}
          animate={{ opacity: [0.2, 0.6, 0.2] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        />

        {/* Main Card */}
        <Card
          className={cn(
            "relative w-full h-full p-6 rounded-xl dark:bg-[#13111C] bg-white shadow-2xl overflow-hidden"
          )}
        >
          {/* Animated Glowing Circles */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{ rotate: [0, 360] }}
            transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
          >
            <div className="absolute w-24 h-24 rounded-full bg-green-400/25 top-[-10%] left-[-10%] blur-3xl" />
            <div className="absolute w-24 h-24 rounded-full bg-blue-400/25 bottom-[-10%] right-[-10%] blur-3xl" />
          </motion.div>

          {/* Content (props.children) */}
          <div className="relative z-10 flex flex-col items-center justify-center h-full text-center space-y-4">
            {children}
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}
