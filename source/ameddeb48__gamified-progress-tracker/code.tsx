"use client"

import { useState } from "react"

interface ConfettiPiece {
  id: number
  x: number
  y: number
  rotation: number
  color: string
  delay: number
}

export default function GamifiedProgressTracker() {
  const [progress, setProgress] = useState(0)
  const [showLevelUp, setShowLevelUp] = useState(false)
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([])
  const [isAnimating, setIsAnimating] = useState(false)

  // Level markers at 20%, 40%, 60%, 80%, 100%
  const levelMarkers = [20, 40, 60, 80, 100]

  const confettiColors = [
    "#FF6B6B",
    "#4ECDC4",
    "#45B7D1",
    "#96CEB4",
    "#FFEAA7",
    "#DDA0DD",
    "#98D8C8",
    "#F7DC6F",
    "#BB8FCE",
    "#85C1E9",
  ]

  const createConfetti = () => {
    const pieces: ConfettiPiece[] = []
    for (let i = 0; i < 50; i++) {
      pieces.push({
        id: i,
        x: Math.random() * 100,
        y: -10,
        rotation: Math.random() * 360,
        color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
        delay: Math.random() * 0.5,
      })
    }
    setConfetti(pieces)

    // Clear confetti after animation
    setTimeout(() => setConfetti([]), 3000)
  }

  const handleProgressChange = (newProgress: number) => {
    const oldProgress = progress
    setProgress(newProgress)

    if (newProgress === 100 && oldProgress < 100) {
      setIsAnimating(true)
      setShowLevelUp(true)
      createConfetti()

      // Hide level up badge after animation
      setTimeout(() => {
        setShowLevelUp(false)
        setIsAnimating(false)
      }, 2000)
    } else if (newProgress < 100) {
      setShowLevelUp(false)
      setIsAnimating(false)
    }
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto p-8 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 rounded-2xl shadow-2xl overflow-hidden">
      {/* Confetti Animation */}
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 pointer-events-none animate-bounce"
          style={{
            left: `${piece.x}%`,
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
            animationDuration: "3s",
            transform: `rotate(${piece.rotation}deg)`,
            top: `${piece.y}%`,
            animation: `confettiFall 3s ease-out ${piece.delay}s forwards`,
          }}
        />
      ))}

      {/* Level Up Badge */}
      <div
        className={`absolute top-4 left-1/2 transform -translate-x-1/2 transition-all duration-500 ${
          showLevelUp ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-75 -translate-y-4"
        }`}
      >
        <div className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 text-white px-6 py-2 rounded-full font-bold text-lg shadow-lg animate-pulse">
          🎉 LEVEL UP! 🎉
        </div>
      </div>

      {/* Progress Percentage */}
      <div className="text-center mb-6">
        <div
          className={`text-4xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent transition-all duration-300 ${
            isAnimating ? "animate-pulse scale-110" : ""
          }`}
        >
          {progress}%
        </div>
        <div className="text-gray-300 text-sm mt-1">Progress to Next Level</div>
      </div>

      {/* Progress Bar Container */}
      <div className="relative mb-8">
        {/* Background Track */}
        <div className="w-full h-6 bg-gray-700 rounded-full shadow-inner overflow-hidden">
          {/* Progress Fill */}
          <div
            className={`h-full bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-full transition-all duration-700 ease-out relative overflow-hidden ${
              isAnimating ? "animate-pulse" : ""
            }`}
            style={{ width: `${progress}%` }}
          >
            {/* Shimmer Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse" />
          </div>
        </div>

        {/* Level Markers */}
        {levelMarkers.map((marker, index) => (
          <div
            key={marker}
            className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2"
            style={{ left: `${marker}%` }}
          >
            <div
              className={`w-4 h-4 rounded-full border-2 transition-all duration-300 ${
                progress >= marker
                  ? "bg-gradient-to-r from-yellow-400 to-orange-500 border-yellow-300 shadow-lg shadow-yellow-400/50 animate-pulse"
                  : "bg-gray-600 border-gray-500"
              }`}
            >
              {progress >= marker && (
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 animate-ping opacity-75" />
              )}
            </div>
            {/* Level Number */}
            <div
              className={`absolute top-6 left-1/2 transform -translate-x-1/2 text-xs font-semibold transition-colors duration-300 ${
                progress >= marker ? "text-yellow-300" : "text-gray-400"
              }`}
            >
              L{index + 1}
            </div>
          </div>
        ))}
      </div>

      {/* Control Buttons */}
      <div className="flex justify-center space-x-4">
        <button
          onClick={() => handleProgressChange(Math.max(0, progress - 10))}
          className="px-6 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        >
          -10%
        </button>
        <button
          onClick={() => handleProgressChange(Math.min(100, progress + 10))}
          className="px-6 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        >
          +10%
        </button>
        <button
          onClick={() => handleProgressChange(100)}
          className="px-6 py-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200 active:scale-95"
        >
          Complete!
        </button>
      </div>

      {/* Achievement Stats */}
      <div className="mt-6 grid grid-cols-3 gap-4 text-center">
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="text-2xl font-bold text-cyan-400">{Math.floor(progress / 20)}</div>
          <div className="text-xs text-gray-300">Levels</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="text-2xl font-bold text-green-400">{progress}</div>
          <div className="text-xs text-gray-300">Points</div>
        </div>
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3">
          <div className="text-2xl font-bold text-purple-400">{100 - progress}</div>
          <div className="text-xs text-gray-300">To Go</div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(-10px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(400px) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
