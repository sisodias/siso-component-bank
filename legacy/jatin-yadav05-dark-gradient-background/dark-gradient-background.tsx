import type React from "react"

interface GradientBackgroundProps {
  children?: React.ReactNode
  className?: string
}

export function GradientBackground({ children, className = "" }: GradientBackgroundProps) {
  return (
    <div className={`relative min-h-screen w-full overflow-hidden ${className}`}>
      {/* Main gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-800 to-cyan-400"
        style={{
          background: "linear-gradient(180deg, #000000 0%, #05080F 20%, #032F3A 40%, #0891b2 70%, #22d3ee 100%)",
        }}
      />

<div
          className="absolute inset-0 opacity-5 bg-repeat"
          style={{
            backgroundImage: 'url("https://framerusercontent.com/images/6mcf62RlDfRfU61Yg5vb2pefpi4.png")',
            backgroundSize: '149.76px'
          }}
        />

      {/* Geometric grid overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Diagonal lines overlay for additional texture */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(-45deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
        }}
      />

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  )
}
