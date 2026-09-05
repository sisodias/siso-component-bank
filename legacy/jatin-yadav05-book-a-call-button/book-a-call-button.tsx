"use client"

import { Phone } from "lucide-react"
import { cn } from "../_utils/cn"
import { motion } from "framer-motion"
import { useState } from "react"

interface BookCallButtonProps {
  className?: string
  onClick?: () => void
}

export function BookCallButton({ className, onClick }: BookCallButtonProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={cn(
        "group relative overflow-hidden",
        "px-6 py-3 rounded-xl",
        "bg-gradient-to-r from-blue-600 to-blue-700",
        "hover:from-blue-700 hover:to-blue-800",
        "text-white font-semibold text-lg",
        "shadow-lg hover:shadow-xl",
        "transition-all duration-300 ease-out",
        "transform active:scale-95",
        "border border-blue-500/20",
        "focus:outline-none focus:ring-4 focus:ring-blue-500/30",
        className,
      )}
    >
      <div className="relative flex items-center justify-center gap-3">
        <span className="relative flex items-center justify-center" style={{ width: 20, height: 20 }}>
          <motion.span
            initial={false}
            animate={isHovered ? { y: -18, opacity: 0 } : { y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            style={{ position: "absolute", left: 0, right: 0 }}
          >
            <Phone className="w-5 h-5 text-white" />
          </motion.span>
          <motion.span
            initial={false}
            animate={isHovered ? { y: 0, opacity: 1 } : { y: 18, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            style={{ position: "absolute", left: 0, right: 0 }}
          >
            <Phone className="w-5 h-5 text-white" />
          </motion.span>
        </span>

        {/* Text with subtle shift */}
        <span className="transition-transform duration-300 ease-out group-hover:translate-x-1">Book A Call</span>
      </div>

      {/* Subtle shine effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                        transform -skew-x-12 -translate-x-full group-hover:translate-x-full 
                        transition-transform duration-1000 ease-out"
        />
      </div>
    </button>
  )
}
