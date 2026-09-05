"use client"

import { useEffect, useRef, useCallback } from "react"
import createGlobe from "cobe"

interface WeatherMarker {
  id: string
  location: [number, number]
  emoji: string
}

interface GlobeWeatherProps {
  markers?: WeatherMarker[]
  className?: string
  speed?: number
}

const defaultMarkers: WeatherMarker[] = [
  { id: "weather-1", location: [50.0, -100.0], emoji: "☀️" },
  { id: "weather-2", location: [55.0, 10.0], emoji: "🌧️" },
  { id: "weather-3", location: [25.0, 80.0], emoji: "⛈️" },
  { id: "weather-4", location: [-10.0, -60.0], emoji: "🌤️" },
  { id: "weather-5", location: [65.0, 100.0], emoji: "❄️" },
  { id: "weather-6", location: [35.0, 140.0], emoji: "🌸" },
  { id: "weather-7", location: [-30.0, 25.0], emoji: "🌈" },
  { id: "weather-8", location: [40.0, -5.0], emoji: "☁️" },
  { id: "weather-9", location: [-45.0, 170.0], emoji: "🌊" },
  { id: "weather-10", location: [15.0, -130.0], emoji: "🌴" },
  { id: "weather-11", location: [70.0, -40.0], emoji: "🌨️" },
  { id: "weather-12", location: [-20.0, 130.0], emoji: "🔥" },
  { id: "weather-13", location: [5.0, 40.0], emoji: "🌪️" },
  { id: "weather-14", location: [45.0, 60.0], emoji: "🌙" },
  { id: "weather-15", location: [-35.0, -70.0], emoji: "⭐" },
  { id: "weather-16", location: [20.0, -20.0], emoji: "🌞" },
]

export function GlobeWeather({
  markers = defaultMarkers,
  className = "",
  speed = 0.003,
}: GlobeWeatherProps) {
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
      mapSamples: 16000, mapBrightness: 10,
      baseColor: [0.98, 0.98, 1],
      markerColor: [0.4, 0.7, 0.95],
      glowColor: [0.94, 0.93, 0.91],
      markerElevation: 0.12,
      markers: markers.map((m) => ({ location: m.location, size: 0.025, id: m.id })),
      arcs: [], arcColor: [0.5, 0.8, 1],
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
      <style>{`
        @keyframes weather-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
      `}</style>
      <svg width="0" height="0" style={{ position: "absolute" }}>
        <defs>
          <filter id="sticker-outline-weather">
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
            fontSize: "1.8rem",
            filter: "url(#sticker-outline-weather) drop-shadow(0 2px 6px rgba(100,150,220,0.4))",
            pointerEvents: "none" as const,
            opacity: `var(--cobe-visible-${m.id}, 0)`,
            transition: "opacity 0.3s, filter 0.3s",
            animation: "weather-float 3s ease-in-out infinite",
          }}
        >
          {m.emoji}
        </div>
      ))}
    </div>
  )
}
