"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import createGlobe from "cobe"

interface AnalyticsMarker {
  id: string
  location: [number, number]
  visitors: number
  trend: number
}

interface GlobeAnalyticsProps {
  markers?: AnalyticsMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: AnalyticsMarker[] = [
  { id: "vis-1", location: [40.71, -74.01], visitors: 847, trend: 12 },
  { id: "vis-2", location: [51.51, -0.13], visitors: 623, trend: -3 },
  { id: "vis-3", location: [35.68, 139.65], visitors: 412, trend: 8 },
  { id: "vis-4", location: [48.86, 2.35], visitors: 385, trend: 5 },
  { id: "vis-5", location: [-33.87, 151.21], visitors: 201, trend: 15 },
  { id: "vis-6", location: [52.52, 13.41], visitors: 178, trend: -1 },
]

export function GlobeAnalytics({
  markers: initialMarkers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeAnalyticsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)
  const [data, setData] = useState(initialMarkers)

  useEffect(() => {
    const interval = setInterval(() => {
      setData((prev) =>
        prev.map((m) => ({
          ...m,
          visitors: m.visitors + Math.floor(Math.random() * 11) - 3,
          trend: Math.max(-20, Math.min(20, m.trend + Math.floor(Math.random() * 5) - 2)),
        }))
      )
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerInteracting.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = "grabbing"
    isPausedRef.current = true
  }, [])

  const handlePointerUp = useCallback(() => {
    if (pointerInteracting.current !== null) {
      phiOffsetRef.current += dragOffset.current.phi
      thetaOffsetRef.current += dragOffset.current.theta
      dragOffset.current = { phi: 0, theta: 0 }
    }
    pointerInteracting.current = null
    if (canvasRef.current) canvasRef.current.style.cursor = "grab"
    isPausedRef.current = false
  }, [])

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (pointerInteracting.current !== null) {
        dragOffset.current = {
          phi: (e.clientX - pointerInteracting.current.x) / 300,
          theta: (e.clientY - pointerInteracting.current.y) / 1000,
        }
      }
    }
    window.addEventListener("pointermove", handlePointerMove, { passive: true })
    window.addEventListener("pointerup", handlePointerUp, { passive: true })
    return () => {
      window.removeEventListener("pointermove", handlePointerMove)
      window.removeEventListener("pointerup", handlePointerUp)
    }
  }, [handlePointerUp])

  useEffect(() => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    let globe: ReturnType<typeof createGlobe> | null = null
    let animationId: number
    let phi = 0

    function init() {
      const width = canvas.offsetWidth
      if (width === 0 || globe) return

      globe = createGlobe(canvas, {
      devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
      width, height: width,
      phi: 0, theta: 0.2, dark: 0, diffuse: 1.5,
      mapSamples: 16000, mapBrightness: 10,
      baseColor: [1, 1, 1],
      markerColor: [0.3, 0.85, 0.45],
      glowColor: [0.94, 0.93, 0.91],
      markerElevation: 0,
      markers: initialMarkers.map((m) => ({ location: m.location, size: 0.04, id: m.id })),
      arcs: [], arcColor: [0.25, 0.9, 0.5],
      arcWidth: 0.5, arcHeight: 0.25, opacity: 0.7,
    })
    function animate() {
      if (!isPausedRef.current) phi += speed
      globe!.update({
        phi: phi + phiOffsetRef.current + dragOffset.current.phi,
        theta: 0.2 + thetaOffsetRef.current + dragOffset.current.theta,
      })
      animationId = requestAnimationFrame(animate)
    }
      animate()
      setTimeout(() => canvas && (canvas.style.opacity = "1"))
    }

    if (canvas.offsetWidth > 0) {
      init()
    } else {
      const ro = new ResizeObserver((entries) => {
        if (entries[0]?.contentRect.width > 0) {
          ro.disconnect()
          init()
        }
      })
      ro.observe(canvas)
    }

    return () => {
      if (animationId) cancelAnimationFrame(animationId)
      if (globe) globe.destroy()
    }
  }, [initialMarkers, speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
        }}
      />
      {data.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: 6,
            display: "flex",
            alignItems: "baseline",
            gap: "0.35rem",
            padding: "0.3rem 0.5rem",
            background: "rgba(0,0,0,0.85)",
            borderRadius: 4,
            pointerEvents: "none" as const,
            whiteSpace: "nowrap" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.3s, filter 0.3s",
          }}
        >
          <span style={{
            fontFamily: "monospace", fontSize: "0.85rem", fontWeight: 600,
            color: "#fff", letterSpacing: "-0.02em",
          }}>{m.visitors}</span>
          <span style={{
            fontFamily: "monospace", fontSize: "0.55rem", fontWeight: 500,
            letterSpacing: "0.02em",
            color: m.trend >= 0 ? "#34d399" : "#f87171",
          }}>
            {m.trend >= 0 ? "↑" : "↓"} {Math.abs(m.trend)}%
          </span>
        </div>
      ))}
    </div>
  )
}
