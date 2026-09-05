import React, { useState, useRef, useEffect } from 'react'

interface QuadrantItem {
  id: string
  x: number // Effort (0-1)
  y: number // Priority (0-1)
  label: string
  description?: string
}

interface QuadrantChartProps {
  items: QuadrantItem[]
  aspectRatio?: number // width / height, e.g. 2 for 2:1
  minHeight?: number
}

const MARGIN = 100
const CIRCLE_RADIUS = 24


export const Component: React.FC<QuadrantChartProps> = ({
  items,
  aspectRatio = 2,
  minHeight = 320,
}) => {
  const [hovered, setHovered] = useState<null | QuadrantItem>(null)
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(
    null,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 800, height: 400 })

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth
        const height = Math.max(width / aspectRatio, minHeight)
        setSize({ width, height })
      }
    }
    handleResize()
    const observer = new window.ResizeObserver(handleResize)
    if (containerRef.current) observer.observe(containerRef.current)
    return () => observer.disconnect()
  }, [aspectRatio, minHeight])

  // Map x/y (0-1) to SVG coordinates
  const mapX = (x: number) => MARGIN + x * (size.width - 2 * MARGIN)
  const mapY = (y: number) =>
    size.height - MARGIN - y * (size.height - 2 * MARGIN)

  // Calculate where the legend starts (right edge minus legend width and some padding)
  const LEGEND_WIDTH = 220 // estimate, adjust as needed
  const LEGEND_PADDING = 40
  const xAxisEnd = size.width - LEGEND_WIDTH - LEGEND_PADDING
  // Make the left side of the x axis match the right in length
  const xAxisCenter = size.width / 2
  const xAxisLength = xAxisEnd - xAxisCenter
  const xAxisStart = xAxisCenter - xAxisLength

  return (
    <div className="relative flex h-full w-full flex-col">
      <div
        ref={containerRef}
        style={{ width: '100%', minHeight, position: 'relative', flex: 1 }}
      >
        <svg
          width={size.width}
          height={size.height}
          style={{ display: 'block', width: '100%', height: 'auto' }}
        >
          {/* Axes */}
          <line
            x1={xAxisStart}
            y1={size.height / 2}
            x2={xAxisEnd}
            y2={size.height / 2}
            stroke={'black'}
            strokeWidth={2}
          />
          <line
            x1={size.width / 2}
            y1={MARGIN}
            x2={size.width / 2}
            y2={size.height - MARGIN}
            stroke={'black'}
            strokeWidth={2}
          />
          {/* Arrowheads */}
          {/* Y axis arrow (top) */}
          <polygon
            points={`${size.width / 2 - 6},${MARGIN + 16} ${size.width / 2 + 6},${MARGIN + 16} ${size.width / 2},${MARGIN}`}
            fill={'black'}
          />
          {/* Y axis arrow (bottom) */}
          <polygon
            points={`${size.width / 2 - 6},${size.height - MARGIN - 16} ${size.width / 2 + 6},${size.height - MARGIN - 16} ${size.width / 2},${size.height - MARGIN}`}
            fill={'black'}
          />
          {/* X axis arrow, now before legend */}
          <polygon
            points={`${xAxisEnd - 16},${size.height / 2 - 6} ${xAxisEnd - 16},${size.height / 2 + 6} ${xAxisEnd},${size.height / 2}`}
            fill={'black'}
          />
          {/* X axis left arrow */}
          <polygon
            points={`${xAxisStart + 16},${size.height / 2 - 6} ${xAxisStart + 16},${size.height / 2 + 6} ${xAxisStart},${size.height / 2}`}
            fill={'black'}
          />
          {/* Labels */}
          <text
            x={size.width / 2}
            y={MARGIN - 20}
            textAnchor="middle"
            fontWeight="bold"
            fontSize={22}
          >
            Priority
          </text>
          <text
            x={xAxisEnd + 30}
            y={size.height / 2 + 8}
            fontWeight="bold"
            fontSize={22}
          >
            Effort
          </text>
          {/* Circles */}
          {items.map((item) => (
            <g key={item.id} className="group">
              <circle
                cx={mapX(item.x)}
                cy={mapY(item.y)}
                r={CIRCLE_RADIUS}
                fill={'black'}
                className="transition-transform duration-300 ease-out group-hover:scale-110 group-hover:drop-shadow-lg"
                style={{ cursor: 'pointer', transformOrigin: 'center' }}
                onMouseEnter={() => {
                  setHovered(item)
                  setTooltipPos({ x: mapX(item.x), y: mapY(item.y) })
                }}
                onMouseLeave={() => {
                  setHovered(null)
                  setTooltipPos(null)
                }}
              />
            </g>
          ))}
        </svg>
        {/* Tooltip */}
        {hovered && tooltipPos && hovered.description && (
          <div
            className="absolute z-10 min-w-[180px] rounded-lg border border-gray-300 bg-white px-4 py-2 text-base shadow-lg dark:border-gray-700 dark:bg-black"
            style={{
              left: tooltipPos.x + 30,
              top: tooltipPos.y - 10,
            }}
          >
            <strong>{hovered.label}</strong>
            <div className="mt-1">{hovered.description}</div>
          </div>
        )}
      </div>
      {/* Legend */}
      <div
        style={{
          position: 'absolute',
          top: MARGIN,
          right: 30,
          display: 'flex',
          flexDirection: 'column',
          gap: 18,
        }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center text-lg font-semibold"
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: 'black',
                display: 'inline-block',
                marginRight: 12,
              }}
            />
            {item.label}
          </div>
        ))}
      </div>
    </div>
  )
}


export default Component
