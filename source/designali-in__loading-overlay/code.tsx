"use client"

import type React from "react"

import { useState, useEffect } from "react"

interface LoadingOverlayProps {
  onComplete?: () => void
  children?: React.ReactNode
}

export function LoadingOverlay({ onComplete, children }: LoadingOverlayProps) {
  const [percentage, setPercentage] = useState(0)
  const [isClipping, setIsClipping] = useState(false)
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    // Animate percentage from 0 to 100 over 2 seconds
    const duration = 2000
    const startTime = Date.now()

    const animatePercentage = () => {
      const elapsed = Date.now() - startTime
      const progress = Math.min(elapsed / duration, 1)
      const currentPercentage = Math.round(progress * 100)

      setPercentage(currentPercentage)

      if (progress < 1) {
        requestAnimationFrame(animatePercentage)
      } else {
        // Start clipping animation after percentage reaches 100%
        setTimeout(() => {
          setIsClipping(true)

          // Show content and call onComplete after clip animation
          setTimeout(() => {
            setShowContent(true)
            onComplete?.()
          }, 400)
        }, 100)
      }
    }

    requestAnimationFrame(animatePercentage)
  }, [onComplete])

  return (
    <>
      {/* Loading Overlay */}
      <div
        style={{ 
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 11,
          clipPath: isClipping ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)",
          pointerEvents: isClipping ? "none" : "auto",
          transition: "clip-path 0.4s ease-in-out",
        }}
      >
        {/* Percentage Counter */}
        <div
          style={{
            position: "absolute",
            right: "clamp(1rem, 2vw, 3rem)",
            bottom: "clamp(1rem, 2vw, 3rem)", 
            fontSize: "clamp(3rem, 8vw, 12rem)", 
          }}
        >
          {percentage}%
        </div>
      </div>

      {/* Page Content */}
      <div
        style={{
          opacity: showContent ? 1 : 0,
          transform: showContent ? "translateY(0)" : "translateY(100px)",
          transition: "opacity 0.6s ease-out, transform 0.6s ease-out",
        }}
      >
        {children}
      </div>
    </>
  )
}
