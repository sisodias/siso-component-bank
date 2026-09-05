"use client"

import { useState, useEffect, useRef, useMemo, useCallback, CSSProperties } from 'react'

interface GridCell {
  id: string
  x: number
  y: number
  blinkDelay: number
  fadeDelay: number
  initialOpacity: number
  color: string | null
}

interface ImageLoaderProps {
  src: string
  alt?: string
  gridSize?: number
  cellShape?: "circle" | "square"
  cellGap?: number
  cellColor?: string
  blinkSpeed?: number
  transitionDuration?: number
  fadeOutDuration?: number
  loadingDelay?: number
  onLoad?: () => void
  className?: string
  width?: string | number
  height?: string | number
}

export default function ImageLoader({
  src,
  alt = "",
  gridSize = 20,
  cellShape = "circle",
  cellGap = 2,
  cellColor = "#cbd5e1",
  blinkSpeed = 1000,
  transitionDuration = 800,
  fadeOutDuration = 600,
  loadingDelay = 1500,
  onLoad = () => {},
  className = "",
  width,
  height
}: ImageLoaderProps) {
  // ============================================================================
  // STATE
  // ============================================================================
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [showImage, setShowImage] = useState<boolean>(false)
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false)
  const [isFadingOut, setIsFadingOut] = useState<boolean>(false)
  const [gridCells, setGridCells] = useState<GridCell[]>([])

  // ============================================================================
  // REFS
  // ============================================================================
  const imageRef = useRef<HTMLImageElement>(null)
  const processedRef = useRef<boolean>(false)
  const loadStartTimeRef = useRef<number>(Date.now())

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================
  const dimensions = useMemo(() => ({
    width: parseInt(String(width)) || 800,
    height: parseInt(String(height)) || 600
  }), [width, height])

  // ============================================================================
  // GRID GENERATION
  // ============================================================================
  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    const cellWithGap = gridSize + cellGap
    const cols = Math.ceil(dimensions.width / cellWithGap) + 1
    const rows = Math.ceil(dimensions.height / cellWithGap) + 1

    const cells: GridCell[] = []
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        cells.push({
          id: `${row}-${col}`,
          x: col * cellWithGap,
          y: row * cellWithGap,
          blinkDelay: Math.random() * blinkSpeed,
          fadeDelay: Math.random() * fadeOutDuration,
          initialOpacity: Math.random() * 0.7 + 0.3,
          color: null
        })
      }
    }

    setGridCells(cells)
  }, [dimensions.width, dimensions.height, gridSize, cellGap, blinkSpeed, fadeOutDuration])

  // ============================================================================
  // COLOR SAMPLING
  // ============================================================================
  const sampleColorFromRegion = useCallback((canvas: HTMLCanvasElement, x: number, y: number, width: number, height: number): string => {
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) return cellColor

    const imageData = ctx.getImageData(x, y, width, height)
    const data = imageData.data

    let r = 0, g = 0, b = 0, count = 0

    // Sample every 4th pixel for performance
    for (let i = 0; i < data.length; i += 16) {
      r += data[i]
      g += data[i + 1]
      b += data[i + 2]
      count++
    }

    return `rgb(${Math.round(r / count)}, ${Math.round(g / count)}, ${Math.round(b / count)})`
  }, [cellColor])

  // ============================================================================
  // IMAGE PROCESSING
  // ============================================================================
  const processImage = useCallback((img: HTMLImageElement, currentGridCells: GridCell[]) => {
    if (processedRef.current || currentGridCells.length === 0) return
    processedRef.current = true

    const doProcess = () => {
      // Create off-screen canvas for color sampling
      const canvas = document.createElement('canvas')
      canvas.width = img.naturalWidth
      canvas.height = img.naturalHeight
      const ctx = canvas.getContext('2d', { willReadFrequently: true })
      if (!ctx) return

      ctx.drawImage(img, 0, 0)

      // Calculate scale factors
      const scaleX = img.naturalWidth / dimensions.width
      const scaleY = img.naturalHeight / dimensions.height

      // Sample colors and update cells
      const updatedCells = currentGridCells.map(cell => ({
        ...cell,
        color: sampleColorFromRegion(
          canvas,
          Math.floor(cell.x * scaleX),
          Math.floor(cell.y * scaleY),
          Math.floor(gridSize * scaleX),
          Math.floor(gridSize * scaleY)
        )
      }))

      setGridCells(updatedCells)
      setIsLoading(false)
      setIsTransitioning(true)

      // Show image after cells fill the gaps
      setTimeout(() => setShowImage(true), transitionDuration)

      // After transition, start fade out
      setTimeout(() => {
        setIsTransitioning(false)
        setIsFadingOut(true)
      }, transitionDuration)

      onLoad()
    }

    // Calculate minimum loading time
    if (loadingDelay > 0) {
      const elapsedTime = Date.now() - loadStartTimeRef.current
      const remainingDelay = Math.max(0, loadingDelay - elapsedTime)
      setTimeout(doProcess, remainingDelay)
    } else {
      doProcess()
    }
  }, [dimensions, gridSize, transitionDuration, loadingDelay, sampleColorFromRegion, onLoad])

  // ============================================================================
  // IMAGE LOAD DETECTION
  // ============================================================================
  useEffect(() => {
    const img = imageRef.current
    if (!img) return

    if (img.complete && img.naturalWidth > 0) {
      processImage(img, gridCells)
    } else {
      const handleLoad = () => processImage(img, gridCells)
      img.addEventListener('load', handleLoad)
      return () => img.removeEventListener('load', handleLoad)
    }
  }, [gridCells, processImage])

  // ============================================================================
  // CELL STYLES
  // ============================================================================
  const getCellStyle = useCallback((cell: GridCell): CSSProperties => {
    const baseStyle: CSSProperties = {
      position: 'absolute',
      left: cell.x,
      top: cell.y,
      willChange: 'opacity, background-color, width, height, left, top'
    }

    if (isLoading) {
      return {
        ...baseStyle,
        animation: `blink ${blinkSpeed}ms infinite`,
        animationDelay: `${cell.blinkDelay}ms`,
        animationFillMode: 'backwards',
        backgroundColor: cellColor,
        width: gridSize,
        height: gridSize,
        opacity: cell.initialOpacity
      }
    }

    if (isTransitioning) {
      return {
        ...baseStyle,
        backgroundColor: cell.color || cellColor,
        transition: `background-color ${transitionDuration}ms ease, width ${transitionDuration}ms ease, height ${transitionDuration}ms ease, left ${transitionDuration}ms ease, top ${transitionDuration}ms ease, opacity ${transitionDuration}ms ease`,
        width: gridSize + cellGap,
        height: gridSize + cellGap,
        left: cell.x - (cellGap / 2),
        top: cell.y - (cellGap / 2),
        opacity: 1,
        animation: 'none'
      }
    }

    if (isFadingOut) {
      return {
        ...baseStyle,
        backgroundColor: cell.color || cellColor,
        opacity: 0,
        transition: `opacity ${fadeOutDuration}ms ease`,
        transitionDelay: `${cell.fadeDelay}ms`,
        width: gridSize + cellGap,
        height: gridSize + cellGap,
        left: cell.x - (cellGap / 2),
        top: cell.y - (cellGap / 2)
      }
    }

    return baseStyle
  }, [isLoading, isTransitioning, isFadingOut, blinkSpeed, cellColor, gridSize, cellGap, transitionDuration, fadeOutDuration])

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className={`relative ${className}`}>
      <style jsx>{`
        @keyframes blink {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
      `}</style>

      <div
        className="relative overflow-hidden mx-auto"
        style={{
          width: width || '100%',
          height: height || 'auto',
          aspectRatio: `${dimensions.width} / ${dimensions.height}`
        }}
      >
        {/* Grid Overlay */}
        {gridCells.length > 0 && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            {gridCells.map(cell => (
              <div
                key={cell.id}
                className={cellShape === 'circle' ? 'rounded-full' : 'rounded'}
                style={getCellStyle(cell)}
              />
            ))}
          </div>
        )}

        {/* Image */}
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          crossOrigin="anonymous"
          className="absolute inset-0 w-full h-full object-cover"
          style={{
            opacity: showImage ? 1 : 0,
            transition: 'opacity 300ms ease'
          }}
        />
      </div>
    </div>
  )
}
