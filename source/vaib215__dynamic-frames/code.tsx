"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils" // Assuming a utility for class names

// --- TYPE DEFINITIONS ---
interface FrameData {
  id: number | string
  video: string
  corner: string
  edgeHorizontal: string
  edgeVertical: string
  defaultPos: { x: number; y: number }
}

interface FrameComponentProps {
  frame: FrameData
  autoplayMode: "all" | "hover"
  isHovered: boolean
  showFrame: boolean
  className?: string
}

// --- FRAME COMPONENT (Child) ---
const FrameComponent: React.FC<FrameComponentProps> = ({
  frame,
  autoplayMode,
  isHovered,
  showFrame,
  className,
}) => {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  // Effect to control video playback based on autoplay mode and hover state
  React.useEffect(() => {
    const videoElement = videoRef.current
    if (!videoElement) return

    if (autoplayMode === "all") {
      videoElement.play().catch(() => {}) // Autoplay all videos
    } else if (autoplayMode === "hover") {
      if (isHovered) {
        videoElement.play().catch(() => {}) // Play on hover
      } else {
        videoElement.pause() // Pause when not hovered
      }
    }
  }, [isHovered, autoplayMode])

  return (
    <div className={cn("relative w-full h-full overflow-hidden", className)}>
      {/* Video Player */}
      <video
        ref={videoRef}
        src={frame.video}
        className="absolute inset-0 w-full h-full object-cover"
        loop
        muted
        playsInline
        style={{ zIndex: 1 }}
      />

      {/* Custom Image-based Frame */}
      {showFrame && (
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          {/* Corners */}
          <div
            className="absolute top-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${frame.corner})` }}
          />
          <div
            className="absolute top-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${frame.corner})`, transform: "scaleX(-1)" }}
          />
          <div
            className="absolute bottom-0 left-0 w-16 h-16 bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${frame.corner})`, transform: "scaleY(-1)" }}
          />
          <div
            className="absolute bottom-0 right-0 w-16 h-16 bg-contain bg-no-repeat"
            style={{ backgroundImage: `url(${frame.corner})`, transform: "scale(-1, -1)" }}
          />

          {/* Edges */}
          <div
            className="absolute top-0 left-16 right-16 h-16"
            style={{
              backgroundImage: `url(${frame.edgeHorizontal})`,
              backgroundSize: "auto 64px",
              backgroundRepeat: "repeat-x",
            }}
          />
          <div
            className="absolute bottom-0 left-16 right-16 h-16"
            style={{
              backgroundImage: `url(${frame.edgeHorizontal})`,
              backgroundSize: "auto 64px",
              backgroundRepeat: "repeat-x",
              transform: "rotate(180deg)",
            }}
          />
          <div
            className="absolute left-0 top-16 bottom-16 w-16"
            style={{
              backgroundImage: `url(${frame.edgeVertical})`,
              backgroundSize: "64px auto",
              backgroundRepeat: "repeat-y",
            }}
          />
          <div
            className="absolute right-0 top-16 bottom-16 w-16"
            style={{
              backgroundImage: `url(${frame.edgeVertical})`,
              backgroundSize: "64px auto",
              backgroundRepeat: "repeat-y",
              transform: "scaleX(-1)",
            }}
          />
        </div>
      )}
    </div>
  )
}

// --- DYNAMIC FRAME LAYOUT (Parent) ---
interface DynamicFrameLayoutProps extends React.HTMLAttributes<HTMLDivElement> {
  frames: FrameData[]
  gridSize?: number
  hoverSize?: number
  gapSize?: number
  initialShowFrames?: boolean
  initialAutoplayMode?: "all" | "hover"
}

const DynamicFrameLayout = React.forwardRef<HTMLDivElement, DynamicFrameLayoutProps>(
  (
    {
      className,
      frames,
      gridSize = 12,
      hoverSize = 6,
      gapSize = 4,
      initialShowFrames = true,
      initialAutoplayMode = "all",
      ...props
    },
    ref
  ) => {
    const [hovered, setHovered] = React.useState<{ row: number; col: number } | null>(null)
    const [showFrames, setShowFrames] = React.useState(initialShowFrames)
    const [autoplayMode, setAutoplayMode] = React.useState(initialAutoplayMode)

    const numCols = Math.max(...frames.map((f) => f.defaultPos.x)) + 1
    const numRows = Math.max(...frames.map((f) => f.defaultPos.y)) + 1
    const defaultCellSize = gridSize / Math.max(numCols, numRows)

    // Calculate grid row sizes for hover effect
    const getRowSizes = () => {
      if (hovered === null) {
        return `repeat(${numRows}, 1fr)`
      }
      const { row } = hovered
      const nonHoveredSize = (gridSize - hoverSize) / (numRows - 1)
      return Array.from({ length: numRows })
        .map((_, r) => (r === row ? `${hoverSize}fr` : `${nonHoveredSize}fr`))
        .join(" ")
    }

    // Calculate grid column sizes for hover effect
    const getColSizes = () => {
      if (hovered === null) {
        return `repeat(${numCols}, 1fr)`
      }
      const { col } = hovered
      const nonHoveredSize = (gridSize - hoverSize) / (numCols - 1)
      return Array.from({ length: numCols })
        .map((_, c) => (c === col ? `${hoverSize}fr` : `${nonHoveredSize}fr`))
        .join(" ")
    }

    // Determine transform origin for smooth scaling
    const getTransformOrigin = (x: number, y: number) => {
        const vertical = y === 0 ? "top" : y === numRows - 1 ? "bottom" : "center";
        const horizontal = x === 0 ? "left" : x === numCols - 1 ? "right" : "center";
        return `${vertical} ${horizontal}`;
    };


    return (
      <div className={cn("w-full h-full", className)} {...props}>
        {/* You can add controls here if needed, passing setShowFrames and setAutoplayMode */}
        <div
          ref={ref}
          className="relative w-full h-full"
          style={{
            display: "grid",
            gridTemplateRows: getRowSizes(),
            gridTemplateColumns: getColSizes(),
            gap: `${gapSize}px`,
            transition: "grid-template-rows 0.4s ease, grid-template-columns 0.4s ease",
          }}
        >
          {frames.map((frame) => {
            const row = frame.defaultPos.y
            const col = frame.defaultPos.x
            const transformOrigin = getTransformOrigin(col, row)

            return (
              <motion.div
                key={frame.id}
                className="relative"
                style={{
                  gridColumn: `${col + 1}`,
                  gridRow: `${row + 1}`,
                  transformOrigin,
                  transition: "transform 0.4s ease",
                }}
                onMouseEnter={() => setHovered({ row, col })}
                onMouseLeave={() => setHovered(null)}
              >
                <FrameComponent
                  frame={frame}
                  showFrame={showFrames}
                  autoplayMode={autoplayMode}
                  isHovered={hovered?.row === row && hovered?.col === col}
                />
              </motion.div>
            )
          })}
        </div>
      </div>
    )
  }
)

DynamicFrameLayout.displayName = "DynamicFrameLayout"

export { DynamicFrameLayout, type FrameData }
