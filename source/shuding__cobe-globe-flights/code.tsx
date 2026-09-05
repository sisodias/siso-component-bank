"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface FlightArc {
  id: string
  from: [number, number]
  to: [number, number]
}

interface FlightMarker {
  id: string
  location: [number, number]
}

interface GlobeFlightsProps {
  arcs?: FlightArc[]
  markers?: FlightMarker[]
  className?: string
  speed?: number
}

const defaultArcs: FlightArc[] = [
  { id: "flight-1", from: [40.64, -73.78], to: [51.47, -0.46] },
  { id: "flight-2", from: [51.47, -0.46], to: [25.25, 55.36] },
  { id: "flight-3", from: [35.55, 139.78], to: [37.62, -122.38] },
  { id: "flight-4", from: [1.36, 103.99], to: [-33.95, 151.18] },
  { id: "flight-5", from: [48.86, 2.35], to: [40.64, -73.78] },
]

const defaultMarkers: FlightMarker[] = [
  { id: "apt-jfk", location: [40.64, -73.78] },
  { id: "apt-lhr", location: [51.47, -0.46] },
  { id: "apt-dxb", location: [25.25, 55.36] },
  { id: "apt-nrt", location: [35.55, 139.78] },
  { id: "apt-sfo", location: [37.62, -122.38] },
  { id: "apt-sin", location: [1.36, 103.99] },
  { id: "apt-syd", location: [-33.95, 151.18] },
  { id: "apt-cdg", location: [48.86, 2.35] },
]

export function GlobeFlights({
  arcs = defaultArcs,
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeFlightsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointerInteracting = useRef<{ x: number; y: number } | null>(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const phiOffsetRef = useRef(0)
  const thetaOffsetRef = useRef(0)
  const isPausedRef = useRef(false)

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
      phi: 0, theta: 0.2, dark: 0.05, diffuse: 1.5,
      mapSamples: 16000, mapBrightness: 8,
      baseColor: [0.98, 0.98, 1],
      markerColor: [0.3, 0.55, 0.95],
      glowColor: [0.94, 0.93, 0.91],
      markerElevation: 0,
      markers: markers.map((m) => ({ location: m.location, size: 0.02, id: m.id })),
      arcs: arcs.map((a) => ({ from: a.from, to: a.to, id: a.id })),
      arcColor: [0.35, 0.6, 1],
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
  }, [markers, arcs, speed])

  return (
    <div className={`relative aspect-square select-none ${className}`}>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="sticker-outline-flight">
            <feMorphology in="SourceAlpha" result="Dilated" operator="dilate" radius="2" />
            <feFlood floodColor="#ffffff" result="OutlineColor" />
            <feComposite in="OutlineColor" in2="Dilated" operator="in" result="Outline" />
            <feMerge>
              <feMergeNode in="Outline" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        style={{
          width: "100%", height: "100%", cursor: "grab", opacity: 0,
          transition: "opacity 1.2s ease", borderRadius: "50%", touchAction: "none",
        }}
      />
      {arcs.map((a) => (
        <div
          key={a.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning
            positionAnchor: `--cobe-arc-${a.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            fontSize: "1.2rem",
            pointerEvents: "none" as const,
            filter: "url(#sticker-outline-flight) drop-shadow(0 1px 2px rgba(0,0,0,0.3))",
            opacity: `var(--cobe-visible-arc-${a.id}, 0)`,
            transition: "opacity 0.3s, filter 0.3s",
          }}
        >
          ✈️
        </div>
      ))}
    </div>
  )
}
