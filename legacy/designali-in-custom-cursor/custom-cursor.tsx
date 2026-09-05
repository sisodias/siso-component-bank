"use client"

import { useEffect, useRef, useState } from "react"

type CursorType = "arrow-pointer" | "big-circle" | "ring-dot" | "circle-and-dot" | "glitch-effect" | "motion-blur"

interface CustomCursorProps {
  cursorType?: CursorType
  color?: string
  size?: number
  glitchColorB?: string
  glitchColorR?: string
}

export function CustomCursor({
  cursorType = "arrow-pointer",
  color = "#292927",
  size = 20,
  glitchColorB = "#00feff",
  glitchColorR = "#ff4f71",
}: CustomCursorProps) {
  const cursorRef = useRef<HTMLDivElement>(null)
  const circleRef = useRef<HTMLDivElement>(null)
  const dotRef = useRef<HTMLDivElement>(null)
  const filterRef = useRef<SVGFEGaussianBlurElement>(null)

  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [fading, setFading] = useState(false)

  const positionState = useRef({
    distanceX: 0,
    distanceY: 0,
    distance: 0,
    pointerX: 0,
    pointerY: 0,
    previousPointerX: 0,
    previousPointerY: 0,
    angle: 0,
    previousAngle: 0,
    angleDisplace: 0,
    degrees: 57.296,
    moving: false,
  })

  useEffect(() => {
    document.body.style.cursor = "none"

    const handleMouseMove = (event: MouseEvent) => {
      const state = positionState.current
      state.previousPointerX = state.pointerX
      state.previousPointerY = state.pointerY
      state.pointerX = event.pageX
      state.pointerY = event.pageY
      state.distanceX = state.previousPointerX - state.pointerX
      state.distanceY = state.previousPointerY - state.pointerY
      state.distance = Math.sqrt(state.distanceY ** 2 + state.distanceX ** 2)

      setPosition({ x: event.pageX, y: event.pageY })

      const target = event.target as HTMLElement
      const isInteractive =
        target.tagName === "A" ||
        target.tagName === "BUTTON" ||
        target.onclick !== null ||
        target.classList.contains("cursor-hover")
      setIsHovering(isInteractive)

      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    const handleClick = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform += " scale(0.75)"
        setTimeout(() => {
          if (cursorRef.current) {
            cursorRef.current.style.transform = cursorRef.current.style.transform.replace(" scale(0.75)", "")
          }
        }, 35)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("click", handleClick)

    return () => {
      document.body.style.cursor = "auto"
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("click", handleClick)
    }
  }, [isVisible])

  const calculateRotation = () => {
    const state = positionState.current
    if (state.distance <= 1) return state.angleDisplace

    const unsortedAngle = Math.atan(Math.abs(state.distanceY) / Math.abs(state.distanceX)) * state.degrees
    state.previousAngle = state.angle

    if (state.distanceX <= 0 && state.distanceY >= 0) {
      state.angle = 90 - unsortedAngle + 0
    } else if (state.distanceX < 0 && state.distanceY < 0) {
      state.angle = unsortedAngle + 90
    } else if (state.distanceX >= 0 && state.distanceY <= 0) {
      state.angle = 90 - unsortedAngle + 180
    } else if (state.distanceX > 0 && state.distanceY > 0) {
      state.angle = unsortedAngle + 270
    }

    if (isNaN(state.angle)) {
      state.angle = state.previousAngle
    } else {
      if (state.angle - state.previousAngle <= -270) {
        state.angleDisplace += 360 + state.angle - state.previousAngle
      } else if (state.angle - state.previousAngle >= 270) {
        state.angleDisplace += state.angle - state.previousAngle - 360
      } else {
        state.angleDisplace += state.angle - state.previousAngle
      }
    }
    return state.angleDisplace
  }

  useEffect(() => {
    const state = positionState.current
    if (state.distance > 1 && !fading) {
      setFading(true)
      setTimeout(() => {
        setFading(false)
      }, 50)
    }
  }, [positionState.current.distance])

  const getBaseStyle = () => ({
    position: "fixed" as const,
    top: 0,
    left: 0,
    zIndex: 2147483647,
    pointerEvents: "none" as const,
    userSelect: "none" as const,
    opacity: isVisible ? 1 : 0,
    transition: "250ms, transform 100ms",
    transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
  })

  const renderArrowPointer = () => {
    const rotation = calculateRotation()
    return (
      <div
        ref={cursorRef}
        style={{
          ...getBaseStyle(),
          width: `${size}px`,
          height: `${size}px`,
          transform: `translate3d(${position.x - size / 2}px, ${position.y}px, 0) rotate(${rotation}deg)`,
        }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" style={{ width: "100%", height: "100%" }}>
          <path
            d="M25,30a5.82,5.82,0,0,1-1.09-.17l-.2-.07-7.36-3.48a.72.72,0,0,0-.35-.08.78.78,0,0,0-.33.07L8.24,29.54a.66.66,0,0,1-.2.06,5.17,5.17,0,0,1-1,.15,3.6,3.6,0,0,1-3.29-5L12.68,4.2a3.59,3.59,0,0,1,6.58,0l9,20.74A3.6,3.6,0,0,1,25,30Z"
            fill="#F2F5F8"
          />
          <path
            d="M16,3A2.59,2.59,0,0,1,18.34,4.6l9,20.74A2.59,2.59,0,0,1,25,29a5.42,5.42,0,0,1-.86-.15l-7.37-3.48a1.84,1.84,0,0,0-.77-.17,1.69,1.69,0,0,0-.73.16l-7.4,3.31a5.89,5.89,0,0,1-.79.12,2.59,2.59,0,0,1-2.37-3.62L13.6,4.6A2.58,2.58,0,0,1,16,3m0-2h0A4.58,4.58,0,0,0,11.76,3.8L2.84,24.33A4.58,4.58,0,0,0,7,30.75a6.08,6.08,0,0,0,1.21-.17,1.87,1.87,0,0,0,.4-.13L16,27.18l7.29,3.44a1.64,1.64,0,0,0,.39.14A6.37,6.37,0,0,0,25,31a4.59,4.59,0,0,0,4.21-6.41l-9-20.75A4.62,4.62,0,0,0,16,1Z"
            fill={color}
          />
        </svg>
      </div>
    )
  }

  const renderBigCircle = () => (
    <>
      <div
        ref={circleRef}
        style={{
          ...getBaseStyle(),
          width: `${size * 2.5}px`,
          height: `${size * 2.5}px`,
          backgroundColor: "transparent",
          borderRadius: "50%",
          backdropFilter: "invert(0.85) grayscale(1)",
          transform: `translate3d(${position.x - (size * 2.5) / 2}px, ${position.y - (size * 2.5) / 2}px, 0) ${isHovering ? "scale(2.5)" : "scale(1)"}`,
        }}
      />
      <div
        ref={dotRef}
        style={{
          ...getBaseStyle(),
          width: "6px",
          height: "6px",
          backgroundColor: "transparent",
          borderRadius: "50%",
          backdropFilter: "invert(1)",
          transform: `translate3d(${position.x - 3}px, ${position.y - 3}px, 0)`,
        }}
      />
    </>
  )

  const renderRingDot = () => {
    const hoverSize = isHovering ? 40 : size
    return (
      <div
        ref={cursorRef}
        style={{
          ...getBaseStyle(),
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: `${hoverSize}px`,
          height: `${hoverSize}px`,
          backgroundColor: "transparent",
          boxShadow: `0 0 0 1.25px ${color}, 0 0 0 2.25px #edf370`,
          borderRadius: "50%",
          transform: `translate3d(${position.x - hoverSize / 2}px, ${position.y - hoverSize / 2}px, 0)`,
        }}
      >
        <div
          style={{
            width: "4px",
            height: "4px",
            backgroundColor: color,
            boxShadow: "0 0 0 1px #edf370",
            borderRadius: "50%",
          }}
        />
      </div>
    )
  }

  const renderCircleAndDot = () => {
    const rotation = calculateRotation()

    return (
      <div
        ref={cursorRef}
        style={{
          ...getBaseStyle(),
          width: `${size}px`,
          height: `${size}px`,
          backgroundColor: "transparent",
          border: isHovering ? `10px solid ${color}` : `1.25px solid ${color}`,
          borderRadius: "50%",
          boxShadow: `0 ${-15 - positionState.current.distance}px 0 -8px ${color}${fading ? "00" : ""}`,
          transform: `translate3d(${position.x - size / 2}px, ${position.y - size / 2}px, 0) rotate(${rotation}deg)`,
        }}
      />
    )
  }

  const renderGlitchEffect = () => {
    const state = positionState.current
    const distanceX = Math.min(Math.max(state.distanceX, -10), 10)
    const distanceY = Math.min(Math.max(state.distanceY, -10), 10)
    const currentSize = isHovering ? 30 : 15

    return (
      <div
        ref={cursorRef}
        style={{
          ...getBaseStyle(),
          width: `${currentSize}px`,
          height: `${currentSize}px`,
          backgroundColor: "#222",
          borderRadius: "50%",
          backdropFilter: "invert(1)",
          boxShadow: `${distanceX}px ${distanceY}px 0 ${glitchColorB}, ${-distanceX}px ${-distanceY}px 0 ${glitchColorR}`,
          transform: `translate3d(${position.x - currentSize / 2}px, ${position.y - currentSize / 2}px, 0)`,
        }}
      />
    )
  }

  const renderMotionBlur = () => {
    const state = positionState.current
    const distanceX = Math.min(Math.max(state.distanceX, -20), 20)
    const distanceY = Math.min(Math.max(state.distanceY, -20), 20)

    const unsortedAngle = Math.atan(Math.abs(distanceY) / Math.abs(distanceX)) * state.degrees
    let angle = 0
    let stdDeviation = "0, 0"

    if (!isNaN(unsortedAngle)) {
      if (unsortedAngle <= 45) {
        angle = distanceX * distanceY >= 0 ? unsortedAngle : -unsortedAngle
        stdDeviation = `${Math.abs(distanceX / 2)}, 0`
      } else {
        angle = distanceX * distanceY <= 0 ? 180 - unsortedAngle : unsortedAngle
        stdDeviation = `${Math.abs(distanceY / 2)}, 0`
      }
    }

    return (
      <svg
        ref={cursorRef}
        style={{
          ...getBaseStyle(),
          width: `${size}px`,
          height: `${size}px`,
          borderRadius: "50%",
          overflow: "visible",
          transform: `translate3d(${position.x - size / 2}px, ${position.y - size / 2}px, 0) rotate(${angle}deg)`,
        }}
      >
        <defs>
          <filter id="motionblur" x="-100%" y="-100%" width="400%" height="400%">
            <feGaussianBlur ref={filterRef} stdDeviation={stdDeviation} />
          </filter>
        </defs>
        <circle cx="50%" cy="50%" r="5" fill={color} filter="url(#motionblur)" />
      </svg>
    )
  }

  const renderCursor = () => {
    switch (cursorType) {
      case "big-circle":
        return renderBigCircle()
      case "ring-dot":
        return renderRingDot()
      case "circle-and-dot":
        return renderCircleAndDot()
      case "glitch-effect":
        return renderGlitchEffect()
      case "motion-blur":
        return renderMotionBlur()
      default:
        return renderArrowPointer()
    }
  }

  return <>{renderCursor()}</>
}
