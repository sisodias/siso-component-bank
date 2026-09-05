"use client"

import { useEffect, useRef } from "react"

interface AnimatedTilesProps {
  rows?: number
  cols?: number
  tileSize?: number
  imageUrl?: string
  backgroundColor?: string
}

export function AnimatedTiles({
  rows = 12,
  cols = 8,
  tileSize = 50,
  imageUrl = "https://raw.githubusercontent.com/aliimam-in/aliimam/refs/heads/main/apps/www/public/ai.jpg",
  backgroundColor = "transparent",
}: AnimatedTilesProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const tilesRef = useRef<HTMLDivElement>(null)

  const maxOpacities = [
    [0.0, 0.2, 0.4, 0.6, 0.6, 0.4, 0.2, 0.0],
    [0.2, 0.4, 0.8, 1.0, 1.0, 0.6, 0.4, 0.2],
    [0.2, 0.4, 1.0, 1.0, 1.0, 0.8, 0.6, 0.2],
    [0.2, 0.6, 1.0, 1.0, 1.0, 1.0, 0.6, 0.2],
    [0.2, 0.6, 1.0, 1.0, 1.0, 1.0, 0.6, 0.2],
    [0.2, 0.6, 1.0, 1.0, 1.0, 1.0, 0.6, 0.2],
    [0.2, 0.4, 0.8, 1.0, 1.0, 0.8, 0.6, 0.2],
    [0.2, 0.4, 0.6, 0.8, 0.8, 0.6, 0.4, 0.1],
    [0.1, 0.2, 0.4, 0.4, 0.4, 0.4, 0.2, 0.1],
    [0.0, 0.2, 0.2, 0.2, 0.2, 0.2, 0.1, 0.1],
    [0.0, 0.1, 0.1, 0.1, 0.1, 0.1, 0.0, 0.0],
    [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  ]

  useEffect(() => {
    if (!tilesRef.current) return

    const tiles: HTMLDivElement[] = []
    tilesRef.current.innerHTML = ""

    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const tile = document.createElement("div")
        tile.className = "tile"
        tile.style.width = `${tileSize}px`
        tile.style.height = `${tileSize}px`
        tile.style.backgroundImage = `url(${imageUrl})`
        tile.style.backgroundPosition = `${-col * tileSize}px ${-row * tileSize}px`
        tile.style.backgroundSize = `${cols * tileSize}px ${rows * tileSize}px`
        tile.style.float = "left"
        tiles.push(tile)
        tilesRef.current.appendChild(tile)
      }
    }

    const animationFrames: number[] = []
    const startTimes: number[] = []

    tiles.forEach((tile, i) => {
      const row = Math.floor(i / cols)
      const col = i % cols
      const variance = 0.4
      const maxOpacity = maxOpacities[row]?.[col] ?? 0
      const minOpacity = Math.max(0, maxOpacity - variance)
      const duration = Math.random() * 0.25 + 0.75 // 0.75 to 1 second

      if (maxOpacity === 0) {
        tile.style.opacity = "0"
        return
      }

      startTimes[i] = Math.random() * duration
      let startTime: number | null = null

      const animate = (currentTime: number) => {
        if (startTime === null) startTime = currentTime
        const elapsed = (currentTime - startTime) / 1000
        const progress = (elapsed + startTimes[i]) % (duration * 2)
        const normalizedProgress = progress < duration ? progress / duration : (duration * 2 - progress) / duration

        const opacity = minOpacity + (maxOpacity - minOpacity) * normalizedProgress
        tile.style.opacity = Math.max(minOpacity, Math.min(maxOpacity, opacity)).toString()

        animationFrames[i] = requestAnimationFrame(animate)
      }

      animationFrames[i] = requestAnimationFrame(animate)
    })

    return () => {
      animationFrames.forEach((frameId) => cancelAnimationFrame(frameId))
    }
  }, [rows, cols, tileSize, imageUrl])

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div
        ref={tilesRef}
        style={{
          width: `${cols * tileSize}px`,
          height: `${rows * tileSize}px`,
          position: "relative",
          overflow: "hidden",
        }}
      />
    </div>
  )
}
