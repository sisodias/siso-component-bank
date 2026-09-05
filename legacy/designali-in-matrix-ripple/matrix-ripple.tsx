"use client"

import { useEffect, useRef, useState } from "react"

interface MatrixRippleProps { 
  width?: number
  height?: number
  fontSize?: string
  fontFamily?: string
  textColor?: string
  hoverColor?: string
  minViewingAngle?: number
  maxViewingAngle?: number
  defaultViewingAngle?: number
}

export function MatrixRipple({ 
  width = 50,
  height = 50,
  fontSize = "2px",
  fontFamily = "monospace",
  textColor = "#ff0000",
  hoverColor = "blue",
  minViewingAngle = 0.1,
  maxViewingAngle = 1,
  defaultViewingAngle = 0.7,
}: MatrixRippleProps) {
  const preRef = useRef<HTMLPreElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const chars = Array.from({ length: 95 }, (_, i) => String.fromCharCode(i + 32))
    const span = document.createElement("span")

    span.style.font = `${fontSize} "${fontFamily}"`
    span.style.visibility = "hidden"
    span.style.position = "absolute"
    document.body.appendChild(span)

    const { w: maxWidth, h: maxHeight } = chars.reduce(
      (max, char) => {
        span.textContent = char
        const { width, height } = span.getBoundingClientRect()
        return { w: Math.max(max.w, width), h: Math.max(max.h, height) }
      },
      { w: 0, h: 0 },
    )

    document.body.removeChild(span)

    const horizontalPadding = maxWidth / 4
    const verticalPadding = maxHeight / 4
    const fullWidth = (canvas.width = maxWidth + 2 * horizontalPadding)
    const fullHeight = (canvas.height = maxHeight + 2 * verticalPadding)

    ctx.font = `${fontSize} "${fontFamily}"`
    ctx.textBaseline = "top"

    const getPixelWeight = (char: string) => {
      ctx.clearRect(0, 0, fullWidth, fullHeight)
      ctx.fillText(char, horizontalPadding, verticalPadding)
      const data = ctx.getImageData(0, 0, fullWidth, fullHeight).data
      return data.reduce((a, b) => a + b)
    }

    const sortedChars = chars
      .map((char) => ({ char, weight: getPixelWeight(char) }))
      .sort((a, b) => a.weight - b.weight)
      .map(({ char }) => char)

    const { sin, pow } = Math
    let viewingAngle = defaultViewingAngle
    let animationId: number

    const draw = (t: number) => {
      if (!preRef.current) return

      const frame = Array.from({ length: height }, (_, y) =>
        Array.from({ length: width }, (_, x) => {
          const value =
            Math.abs(
              sin(
                (t -
                  pow(
                    viewingAngle * pow(x - width / 2, 2) +
                      pow(y - height / 2, 2),
                    0.7,
                  )) / 18,
              ),
            ) * (sortedChars.length - 1)
          return sortedChars[Math.round(value)]
        }).join(" "),
      ).join("\n")

      preRef.current.textContent = frame
      animationId = requestAnimationFrame(() => draw(t + 1))
    }

    draw(0)
    return () => cancelAnimationFrame(animationId)
  }, [width, height, fontSize, fontFamily, defaultViewingAngle])

  const currentColor = isHovered ? hoverColor : textColor

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-background font-mono text-xs"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <style>{`
        .pond-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          text-align: center;
        }

        .pond-pre {
          margin: 0;
          color: ${currentColor};
          transition: color 0.2s ease;
          white-space: pre;
        }
      `}</style>

      <div className="pond-container">
        <pre ref={preRef} className="pond-pre" />
      </div>
    </div>
  )
}
