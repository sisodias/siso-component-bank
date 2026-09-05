"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface LabelMarker {
  id: string
  location: [number, number]
  text: string
  color: string
  rotate: number
}

interface GlobeLabelsProps {
  markers?: LabelMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: LabelMarker[] = [
  { id: "label-1", location: [48.86, 2.35], text: "visit soon!", color: "#e84855", rotate: -8 },
  { id: "label-2", location: [35.68, 139.65], text: "amazing food", color: "#2a9d8f", rotate: 5 },
  { id: "label-3", location: [40.71, -74.01], text: "home ♥", color: "#e76f51", rotate: -3 },
  { id: "label-4", location: [-33.87, 151.21], text: "bucket list", color: "#264653", rotate: 7 },
  { id: "label-5", location: [51.51, -0.13], text: "rainy but fun", color: "#7b2cbf", rotate: -5 },
  { id: "label-6", location: [-22.91, -43.17], text: "samba time!", color: "#f4a261", rotate: 4 },
  { id: "label-7", location: [55.75, 37.62], text: "cold but cozy", color: "#457b9d", rotate: -6 },
  { id: "label-8", location: [25.2, 55.27], text: "so luxurious", color: "#d4a373", rotate: 3 },
  { id: "label-9", location: [1.35, 103.82], text: "foodie heaven", color: "#e63946", rotate: -4 },
  { id: "label-10", location: [-34.6, -58.38], text: "tango nights", color: "#9d4edd", rotate: 6 },
]

export function GlobeLabels({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeLabelsProps) {
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
      phi: 0, theta: 0.2, dark: 0, diffuse: 1.5,
      mapSamples: 16000, mapBrightness: 9,
      baseColor: [1, 1, 1],
      markerColor: [0.55, 0.35, 0.75],
      glowColor: [0.94, 0.93, 0.91],
      markerElevation: 0,
      markers: markers.map((m) => ({ location: m.location, size: 0.025, id: m.id })),
      arcs: [], arcColor: [0.6, 0.4, 0.8],
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
  }, [markers, speed])

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
      {markers.map((m) => (
        <div
          key={m.id}
          style={{
            position: "absolute",
            // @ts-expect-error CSS Anchor Positioning
            positionAnchor: `--cobe-${m.id}`,
            bottom: "anchor(top)",
            left: "anchor(center)",
            translate: "-50% 0",
            marginBottom: -10,
            padding: "0.4rem 0.65rem 0.35rem",
            background: m.color,
            color: "#fff",
            fontFamily: "ui-rounded, 'SF Pro Rounded', system-ui, sans-serif",
            fontSize: "0.85rem",
            fontWeight: 600,
            letterSpacing: "0.01em",
            whiteSpace: "nowrap" as const,
            transform: `rotate(${m.rotate}deg)`,
            borderRadius: 4,
            boxShadow: "0 1px 3px rgba(0,0,0,0.2), 0 3px 8px rgba(0,0,0,0.1), inset 0 -1px 0 rgba(0,0,0,0.15)",
            textShadow: "0 1px 1px rgba(0,0,0,0.25)",
            pointerEvents: "none" as const,
            overflow: "hidden",
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            filter: `blur(calc((1 - var(--cobe-visible-${m.id}, 0)) * 8px))`,
            transition: "opacity 0.3s, filter 0.3s",
          }}
        >
          <span style={{
            position: "absolute", top: 0, left: 0, right: 0, height: "50%",
            background: "linear-gradient(180deg, rgba(255,255,255,0.35) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)",
            borderRadius: "4px 4px 50% 50%", pointerEvents: "none" as const,
          }} />
          {m.text}
        </div>
      ))}
    </div>
  )
}
