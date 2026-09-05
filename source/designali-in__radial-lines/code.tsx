import type React from "react"
interface RadialLinesProps {
  /** Number of lines to render (default: 180) */
  lineCount?: number
  /** Color of the lines (default: '#000000') */
  lineColor?: string
  /** Thickness of each line in pixels (default: 1) */
  lineThickness?: number
  /** Width of each line as percentage (default: 200) */
  lineWidth?: number
  /** Left offset as percentage (default: -50) */
  leftOffset?: number
  /** Opacity of the lines (default: 1) */
  opacity?: number
  /** Container width (default: '100vw') */
  containerWidth?: string
  /** Container height (default: '100vh') */
  containerHeight?: string
  /** Background color of container (default: 'transparent') */
  backgroundColor?: string
  /** Starting rotation angle in degrees (default: 1) */
  startAngle?: number
  /** Ending rotation angle in degrees (default: 181) */
  endAngle?: number
}

export function RadialLines({
  lineCount = 180,
  lineColor = "#000000",
  lineThickness = 1,
  lineWidth = 200,
  leftOffset = -50,
  opacity = 1,
  containerWidth = "100vw",
  containerHeight = "100vh",
  backgroundColor = "transparent",
  startAngle = 1,
  endAngle = 181,
}: RadialLinesProps) {
  // Calculate the step between angles
  const angleStep = (endAngle - startAngle) / (lineCount - 1)

  // Generate array of angles
  const angles = Array.from({ length: lineCount }, (_, i) => startAngle + i * angleStep)

  const containerStyle: React.CSSProperties = {
    position: "relative",
    width: containerWidth,
    height: containerHeight,
    overflow: "hidden",
    backgroundColor: backgroundColor,
  }

  const lineStyle: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: `${leftOffset}%`,
    width: `${lineWidth}%`,
    height: `${lineThickness}px`,
    backgroundColor: lineColor,
    opacity: opacity,
    transformOrigin: "center center",
    border: "none",
    margin: 0,
    padding: 0,
  }

  return (
    <div style={containerStyle}>
      {angles.map((angle, index) => (
        <hr
          key={index}
          style={{
            ...lineStyle,
            transform: `rotate(${angle}deg)`,
          }}
        />
      ))}
    </div>
  )
}
