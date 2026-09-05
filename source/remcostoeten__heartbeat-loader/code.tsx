import type React from "react"

type TProps = {
  width?: number
  height?: number
  strokeWidth?: number
  backStrokeColor?: string
  frontStrokeColor?: string
  animationDuration?: number
  strokeDashArray?: string
  strokeDashOffset?: number
  position?: "static" | "relative" | "absolute" | "fixed" | "sticky"
  centered?: boolean
  fullscreen?: boolean
  backgroundColor?: string
  className?: string
  ariaLabel?: string
  role?: string
  zIndex?: number
  top?: string
  left?: string
  right?: string
  bottom?: string
  transform?: string
}

export function Heartbeat({
  width = 64,
  height = 48,
  strokeWidth = 3,
  backStrokeColor = "rgba(255, 77, 80, 0.2)",
  frontStrokeColor = "#ff4d4f",
  animationDuration = 1.4,
  strokeDashArray = "48, 144",
  strokeDashOffset = 192,
  position = "static",
  centered = false,
  fullscreen = false,
  backgroundColor,
  className = "",
  ariaLabel = "Loading",
  role = "status",
  zIndex,
  top,
  left,
  right,
  bottom,
  transform,
}: TProps): React.ReactElement {
  const animationName = `dash-${Math.random().toString(36).substr(2, 9)}`

  const containerStyle: React.CSSProperties = {
    position: fullscreen ? "fixed" : position,
    display: centered || fullscreen ? "flex" : undefined,
    justifyContent: centered || fullscreen ? "center" : undefined,
    alignItems: centered || fullscreen ? "center" : undefined,
    inset: fullscreen ? 0 : undefined,
    backgroundColor,
    zIndex,
    top,
    left,
    right,
    bottom,
    transform,
  }

  const polylinePoints = "0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24"

  const basePolylineStyle: React.CSSProperties = {
    fill: "none",
    strokeWidth,
    strokeLinecap: "round",
    strokeLinejoin: "round",
  }

  const backPolylineStyle: React.CSSProperties = {
    ...basePolylineStyle,
    stroke: backStrokeColor,
  }

  const frontPolylineStyle: React.CSSProperties = {
    ...basePolylineStyle,
    stroke: frontStrokeColor,
    strokeDasharray: strokeDashArray,
    strokeDashoffset: strokeDashOffset,
    animation: `${animationName} ${animationDuration}s linear infinite`,
  }

  return (
    <>
      <style>
        {`
          @keyframes ${animationName} {
            72.5% {
              opacity: 0;
            }
            to {
              stroke-dashoffset: 0;
            }
          }
        `}
      </style>
      <div style={containerStyle} className={className} role={role} aria-label={ariaLabel} aria-live="polite">
        <svg width={`${width}px`} height={`${height}px`} viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
          <polyline points={polylinePoints} style={backPolylineStyle} />
          <polyline points={polylinePoints} style={frontPolylineStyle} />
        </svg>
      </div>
    </>
  )
}
