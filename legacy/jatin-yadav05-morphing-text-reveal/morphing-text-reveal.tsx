"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "../_utils/cn"

interface MorphingTextRevealProps {
  texts: string[]
  className?: string
  interval?: number
  glitchOnHover?: boolean
}

export function MorphingTextReveal({
  texts,
  className,
  interval = 3000,
  glitchOnHover = true,
}: MorphingTextRevealProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [displayText, setDisplayText] = useState("")
  const [isAnimating, setIsAnimating] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const morphToNext = useCallback(() => {
    if (isAnimating) return

    setIsAnimating(true)
    const currentText = texts[currentIndex]
    const nextIndex = (currentIndex + 1) % texts.length
    const nextText = texts[nextIndex]

    // Determine the longer text for animation
    const maxLength = Math.max(currentText.length, nextText.length)

    // Animate character by character
    let step = 0
    const animateStep = () => {
      if (step <= maxLength) {
        let newText = ""

        for (let i = 0; i < maxLength; i++) {
          if (i < step) {
            // Show next character
            newText += nextText[i] || ""
          } else if (i < currentText.length) {
            // Show current character with random glitch
            const shouldGlitch = Math.random() > 0.7
            newText += shouldGlitch ? getRandomChar() : currentText[i]
          }
        }

        setDisplayText(newText)
        step++
        setTimeout(animateStep, 80) // increased from 50ms to 80ms to slow down character morphing
      } else {
        setDisplayText(nextText)
        setCurrentIndex(nextIndex)
        setIsAnimating(false)
      }
    }

    animateStep()
  }, [currentIndex, texts, isAnimating])

  const getRandomChar = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    return chars[Math.floor(Math.random() * chars.length)]
  }

  useEffect(() => {
    if (texts.length === 0) return
    setDisplayText(texts[0])
  }, [texts])

  useEffect(() => {
    if (texts.length <= 1) return

    const timer = setInterval(morphToNext, interval)
    return () => clearInterval(timer)
  }, [morphToNext, interval, texts.length])

  const handleMouseEnter = () => {
    if (glitchOnHover) {
      setIsHovered(true)
      setTimeout(() => setIsHovered(false), 300)
    }
  }

  if (texts.length === 0) return null

  return (
    <div className={cn("relative inline-block cursor-pointer select-none", className)} onMouseEnter={handleMouseEnter}>
      <span
        className={cn(
          "font-mono text-foreground transition-all duration-300",
          isHovered && glitchOnHover && "glitch-effect",
          "hover:text-primary",
        )}
        style={{
          fontVariantNumeric: "tabular-nums",
          letterSpacing: "0.05em",
        }}
      >
        {displayText.split("").map((char, index) => (
          <span
            key={`${currentIndex}-${index}`}
            className={cn("inline-block", isAnimating && "morph-char")}
            style={{
              animationDelay: `${index * 35}ms`, // increased from 20ms to 35ms to slow down staggered character animations
            }}
          >
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </span>

      {/* Subtle cursor indicator */}
      <span
        className={cn(
          "inline-block w-0.5 h-[1em] bg-primary ml-1 transition-opacity duration-500",
          isAnimating ? "opacity-100" : "opacity-30",
        )}
        style={{
          animation: "pulse 2s ease-in-out infinite", // increased from 1.5s to 2s to slow down cursor pulse
        }}
      />
    </div>
  )
}
