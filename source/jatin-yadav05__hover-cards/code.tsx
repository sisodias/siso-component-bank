"use client"

import type React from "react"
import { useState } from "react"

interface StackedIconCardProps {
  icon: React.ReactNode
  backIcon1?: React.ReactNode
  backIcon2?: React.ReactNode
  color?: string
}

export default function StackedIconCard({
  icon,
  backIcon1,
  backIcon2,
  color = "from-blue-500 to-cyan-500",
}: StackedIconCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className="relative w-40 h-40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Back card - appears from right on hover */}
      <div
        className={`absolute inset-0 bg-card border border-border rounded-lg shadow-md transition-all duration-500 ease-out flex items-center justify-center`}
        style={{
          transform: isHovered
            ? "translateX(120px) translateY(0px) rotate(0deg)"
            : "translateX(24px) translateY(24px) rotate(2deg)",
          opacity: isHovered ? 0.9 : 0.65,
        }}
      >
        {backIcon1 && <div className="text-foreground text-5xl opacity-80">{backIcon1}</div>}
      </div>

      {/* Back card - appears from left on hover */}
      <div
        className={`absolute inset-0 bg-card border border-border rounded-lg shadow-md transition-all duration-500 ease-out flex items-center justify-center`}
        style={{
          transform: isHovered
            ? "translateX(-120px) translateY(0px) rotate(0deg)"
            : "translateX(-16px) translateY(16px) rotate(-3deg)",
          opacity: isHovered ? 0.9 : 0.65,
        }}
      >
        {backIcon2 && <div className="text-foreground text-5xl opacity-80">{backIcon2}</div>}
      </div>

      {/* Main card with icon - Added upward movement on hover */}
      <div
        className={`absolute inset-0 bg-gradient-to-br ${color} rounded-lg shadow-lg flex items-center justify-center transition-all duration-500`}
        style={{
          transform: isHovered ? "translateY(-20px)" : "translateY(0px)",
        }}
      >
        <div className="text-white text-6xl drop-shadow-lg">{icon}</div>
      </div>
    </div>
  )
}
