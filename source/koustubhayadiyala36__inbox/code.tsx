"use client"

import { useEffect, useState } from "react"

function ConfettiPiece({
  delay,
  left,
  color,
  duration,
}: { delay: number; left: number; color: string; duration: number }) {
  return (
    <div
      className="confetti-piece absolute h-2 w-2 rounded-sm"
      style={{
        left: `${left}%`,
        top: "40%",
        backgroundColor: color,
        animationDelay: `${delay}s`,
        animationDuration: `${duration}s`,
      }}
    />
  )
}

export function Component() {
  const [showConfetti, setShowConfetti] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setShowConfetti(true), 800)
    return () => clearTimeout(timer)
  }, [])

  const confettiColors = ["#8B5CF6", "#EC4899", "#F59E0B", "#10B981", "#3B82F6"]
  const confettiPieces = Array.from({ length: 20 }, (_, i) => ({
    delay: Math.random() * 2,
    left: 20 + Math.random() * 60,
    color: confettiColors[i % confettiColors.length],
    duration: 2 + Math.random() * 2,
  }))

  return (
    <>
      <style jsx>{`
        @keyframes envelope-open {
          0% {
            transform: rotateX(0deg);
          }
          100% {
            transform: rotateX(180deg);
          }
        }
        @keyframes letter-reveal {
          0% {
            transform: translateX(-50%) translateY(0);
          }
          100% {
            transform: translateX(-50%) translateY(-20px);
          }
        }
        @keyframes confetti-fall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(150px) rotate(720deg);
            opacity: 0;
          }
        }
        .animate-envelope-open {
          animation: envelope-open 0.8s ease-out forwards;
          transform-origin: top center;
        }
        .animate-letter-reveal {
          animation: letter-reveal 0.6s ease-out 0.4s forwards;
        }
        .confetti-piece {
          animation: confetti-fall 3s ease-out forwards;
        }
      `}</style>
      <div className="relative flex min-h-[400px] w-full max-w-md flex-col items-center justify-center overflow-hidden rounded-2xl bg-white p-8 shadow-sm">
        {/* Confetti */}
        {showConfetti &&
          confettiPieces.map((piece, i) => (
            <ConfettiPiece
              key={i}
              delay={piece.delay}
              left={piece.left}
              color={piece.color}
              duration={piece.duration}
            />
          ))}

        {/* Animated Envelope */}
        <div className="relative mb-8 h-24 w-32">
          {/* Envelope body */}
          <div className="absolute bottom-0 h-16 w-32 rounded-lg bg-gradient-to-br from-emerald-400 to-teal-500 shadow-lg">
            {/* Envelope bottom flap lines */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <div className="absolute left-0 top-0 h-full w-full">
                <div
                  className="absolute left-1/2 top-0 h-10 w-px -translate-x-1/2 rotate-45 transform bg-white/20"
                  style={{ transformOrigin: "top center", left: "0", transform: "rotate(45deg)" }}
                />
                <div
                  className="absolute right-0 top-0 h-10 w-px -translate-x-1/2 -rotate-45 transform bg-white/20"
                  style={{ transformOrigin: "top center", transform: "rotate(-45deg)" }}
                />
              </div>
            </div>
          </div>

          {/* Letter */}
          <div className="animate-letter-reveal absolute bottom-4 left-1/2 h-12 w-24 -translate-x-1/2 rounded bg-white shadow-md">
            <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
              <div className="h-1 w-12 rounded bg-gray-200" />
              <div className="h-1 w-8 rounded bg-gray-200" />
            </div>
          </div>

          {/* Envelope flap (opens) */}
          <div
            className="animate-envelope-open absolute left-0 top-2 h-0 w-0"
            style={{
              borderLeft: "64px solid transparent",
              borderRight: "64px solid transparent",
              borderTop: "40px solid #34D399",
              transformOrigin: "top center",
            }}
          />

          {/* Envelope flap back */}
          <div
            className="absolute left-0 top-2 -z-10 h-0 w-0"
            style={{
              borderLeft: "64px solid transparent",
              borderRight: "64px solid transparent",
              borderTop: "40px solid #10B981",
            }}
          />
        </div>

        {/* Text Content */}
        <h2 className="mb-2 text-2xl font-semibold text-gray-800">All caught up!</h2>
        <p className="max-w-xs text-center text-sm text-gray-500">
          You have no new messages. Enjoy your clean inbox and take a moment to relax.
        </p>

        {/* Subtle success indicator */}
        <div className="mt-6 flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-medium text-emerald-700">Inbox zero achieved</span>
        </div>
      </div>
    </>
  )
}
