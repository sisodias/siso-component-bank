"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "./button"

const textContent = [
  {
    title: "Welcome",
    description: "Experience the future of digital interaction with our premium platform",
  },
  {
    title: "Innovation",
    description: "Cutting-edge technology meets elegant design in perfect harmony",
  },
  {
    title: "Excellence",
    description: "Crafted with precision and attention to every detail that matters",
  },
  {
    title: "Premium",
    description: "Elevate your experience with sophisticated and refined solutions",
  },
  {
    title: "Success",
    description: "Join thousands who have transformed their workflow with our platform",
  },
]

export default function Component() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleNext = () => {
    if (isAnimating) return
    setIsAnimating(true)

    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % textContent.length)
      setIsAnimating(false)
    }, 500)
  }

  const handleBack = () => {
    if (isAnimating) return
    setIsAnimating(true)

    setTimeout(() => {
      setCurrentIndex((prev) => (prev - 1 + textContent.length) % textContent.length)
      setIsAnimating(false)
    }, 500)
  }

  const currentContent = textContent[currentIndex]

  return (
    <div className="flex flex-col w-full items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-8">
      <div className="flex flex-col items-center space-y-8">
        {/* Main Animation Container */}
        <div className="relative">
          <motion.div
            className="w-32 h-32 rounded-full bg-white flex items-center justify-center relative overflow-hidden"
            style={{
              boxShadow:
                "0 20px 40px rgba(0, 0, 0, 0.08), 0 8px 16px rgba(0, 0, 0, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.9)",
            }}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Background Gradient Ring */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: "conic-gradient(from 0deg, #059669, #10b981, #34d399, #059669)",
              }}
              animate={{ rotate: isAnimating ? 360 : 0 }}
              transition={{
                duration: isAnimating ? 0.8 : 0.8,
                ease: isAnimating ? "linear" : [0.16, 1, 0.3, 1],
                repeat: 0,
              }}
            />

            {/* Inner Circle */}
            <motion.div
              className="w-28 h-28 rounded-full bg-white flex items-center justify-center relative z-10"
              style={{
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
              }}
              animate={{
                scale: isAnimating ? [1, 1.03, 1] : 1,
              }}
              transition={{
                duration: 0.8,
                ease: "easeInOut",
              }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{
                    duration: 0.4,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="flex items-center justify-center"
                >
                  <motion.div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg"
                    style={{
                      background: "linear-gradient(135deg, #10b981, #059669)",
                      boxShadow: "0 4px 16px rgba(16, 185, 129, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.2)",
                    }}
                  >
                    {currentIndex + 1}
                  </motion.div>
                </motion.div>
              </AnimatePresence>
            </motion.div>
          </motion.div>

          {/* Pulse Effect for Animation */}
          {isAnimating && (
            <motion.div
              className="absolute inset-0 w-32 h-32 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)",
              }}
              initial={{ scale: 1, opacity: 0.8 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            />
          )}
        </div>

        {/* Text Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-md"
          >
            <h2 className="text-2xl font-medium text-slate-900 mb-3 tracking-tight">{currentContent.title}</h2>
            <p className="text-slate-500 text-sm leading-relaxed">{currentContent.description}</p>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Buttons */}
        <div className="flex gap-4 items-center">
          <Button
            onClick={handleBack}
            disabled={isAnimating}
            variant="outline"
            className="p-3 rounded-xl transition-all duration-200 bg-white/80 backdrop-blur-sm disabled:opacity-50 hover:bg-transparent cursor-pointer"
            style={{
              border: "1px solid rgba(148, 163, 184, 0.3)",
              color: "#475569",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>

          {/* Progress Indicators */}
          <div className="flex gap-2">
            {textContent.map((_, index) => (
              <motion.div
                key={index}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{
                  backgroundColor: index === currentIndex ? "#10b981" : "#cbd5e1",
                }}
                animate={{
                  scale: index === currentIndex ? 1.2 : 1,
                }}
              />
            ))}
          </div>

          <Button
            onClick={handleNext}
            disabled={isAnimating}
            variant="outline"
            className="p-3 rounded-xl transition-all duration-200 bg-white  backdrop-blur-sm disabled:opacity-50 hover:bg-transparent cursor-pointer"
            style={{
              border: "1px solid rgba(148, 163, 184, 0.3)",
              color: "#475569",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </div>

        {/* Current Position Indicator */}
        <motion.div
          className="text-xs text-slate-400 font-medium"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {currentIndex + 1} of {textContent.length}
        </motion.div>
      </div>
    </div>
  )
}
