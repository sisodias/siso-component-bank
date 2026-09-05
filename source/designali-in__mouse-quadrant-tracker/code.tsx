"use client"

import type React from "react"
import { useEffect, useRef } from "react"

interface MouseQuadrantTrackerProps {
  text: string
  hue?: number
  fontSize?: string
  shadowIntensity?: number 
  textColor?: string
  className?: string
}

export function MouseQuadrantTracker({
  text,
  hue = 200,
  fontSize = "25vmax",
  shadowIntensity = 10, 
  textColor,
  className,
}: MouseQuadrantTrackerProps) {
  const h1Ref = useRef<HTMLHeadingElement>(null)

  const getQuadrants = (element: HTMLElement, clientX: number, clientY: number) => {
    const { x, y, width, height } = element.getBoundingClientRect()
    const quadX = clientX - (x + 0.5 * width)
    const quadY = clientY - (y + 0.5 * height)

    return {
      x: quadX >= 0 ? 1 : -1,
      y: quadY >= 0 ? 1 : -1,
    }
  }

  useEffect(() => {
    const h1Element = h1Ref.current
    if (!h1Element) return

    const handleMouseMove = (event: MouseEvent) => {
      const { clientX, clientY } = event
      const { x, y } = getQuadrants(h1Element, clientX, clientY)

      // Update CSS custom properties
      h1Element.style.setProperty("--x-quadrant", `${x}`)
      h1Element.style.setProperty("--y-quadrant", `${y}`)
    }

    h1Element.addEventListener("mousemove", handleMouseMove)

    return () => {
      h1Element.removeEventListener("mousemove", handleMouseMove)
    }
  }, [])

  return (
    <div
      className={className}
      style={
        {
          minHeight: "100vh",
          minWidth: "100%",
          margin: 0,
          padding: "5vmin",
          boxSizing: "border-box",
          display: "grid",
          placeItems: "center",  
          "--hue": hue.toString(),
          "--x-quadrant": "1",
          "--y-quadrant": "1",
        } as React.CSSProperties
      }
    >
      <h1 className={className}
        ref={h1Ref}
        style={
          {
            color: textColor || `hsl(${hue} 90% 90%)`,
            textShadow: `
            calc(var(--x-quadrant) * ${shadowIntensity}px) calc(var(--y-quadrant) * ${shadowIntensity}px) 0 hsl(var(--hue) 70% 75%),
            calc(var(--x-quadrant) * ${shadowIntensity * 2}px) calc(var(--y-quadrant) * ${shadowIntensity * 2}px) 0 hsl(var(--hue) 70% 65%),
            calc(var(--x-quadrant) * ${shadowIntensity * 3}px) calc(var(--y-quadrant) * ${shadowIntensity * 3}px) 0 hsl(var(--hue) 70% 55%),
            calc(var(--x-quadrant) * ${shadowIntensity * 4}px) calc(var(--y-quadrant) * ${shadowIntensity * 4}px) 0 hsl(var(--hue) 70% 45%),
            calc(var(--x-quadrant) * ${shadowIntensity * 5}px) calc(var(--y-quadrant) * ${shadowIntensity * 5}px) 0 hsl(var(--hue) 70% 35%)
          `,
            transition: "text-shadow 0.2s ease",
            textTransform: "uppercase",
            fontSize: fontSize,
            margin: 0,
            lineHeight: "0.8em",
            inlineSize: "min-content",
          } as React.CSSProperties
        }
      >
        {text}
      </h1>
    </div>
  )
}
