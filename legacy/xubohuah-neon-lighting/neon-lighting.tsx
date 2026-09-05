"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "../_utils/cn"

export const NEON_PRESETS = {
  classic: { text: "#ff4500", border: "#ff4500", name: "Classic Neon (Neon Gas)" },
  argon: { text: "#00bfff", border: "#00bfff", name: "Argon Blue" },
  mercury: { text: "#00ff41", border: "#00ff41", name: "Mercury Green" },
  helium: { text: "#ffff00", border: "#ffff00", name: "Helium Yellow" },
  krypton: { text: "#dda0dd", border: "#dda0dd", name: "Krypton Purple" },
  xenon: { text: "#4169e1", border: "#4169e1", name: "Xenon Blue" },
  hydrogen: { text: "#dc143c", border: "#dc143c", name: "Hydrogen Red" },
  phosphorPink: { text: "#ff1493", border: "#ff1493", name: "Phosphor Pink" },
  phosphorCyan: { text: "#00ffff", border: "#00ffff", name: "Phosphor Cyan" },
  phosphorWhite: { text: "#ffffff", border: "#ffffff", name: "Phosphor White" },
   gradient: { text: "linear-gradient(90deg, #ff00ff, #00ffff)", border: "#ff00ff", name: "Gradient Neon" },
    dualColor: { text: "#ff00ff", border: "#00ff00", name: "Dual Color" },
    rainbow: { text: "#ff0000", border: "#ffff00", name: "Rainbow (Animated)" },
} as const

export type NeonPreset = keyof typeof NEON_PRESETS

interface NeonTextProps {
  initialText?: string
  className?: string
  contentEditable?: boolean
  spellCheck?: boolean
  textColor?: string
  borderColor?: string
  preset?: NeonPreset
  intensity?: number
}

export function NeonText({
  initialText = "open",
  className,
  contentEditable = false,
  spellCheck = false,
  textColor,
  borderColor,
  preset = "classic",
  intensity = 1,
}: NeonTextProps) {
  const [text, setText] = useState(initialText)
  const textRef = useRef<HTMLHeadingElement>(null)

  const colors = textColor && borderColor ? { text: textColor, border: borderColor } : NEON_PRESETS[preset]

  useEffect(() => {
    if (contentEditable && textRef.current) {
      const handleInput = () => {
        if (textRef.current) {
          setText(textRef.current.textContent || "")
        }
      }

      textRef.current.addEventListener("input", handleInput)
      return () => {
        if (textRef.current) {
          textRef.current.removeEventListener("input", handleInput)
        }
      }
    }
  }, [contentEditable])

  return (
    <div
   className={cn("min-h-screen bg-background flex items-center justify-center font-mono", className)}
      style={
        {
          "--neon-text-color": colors.text,
          "--neon-border-color": colors.border,
          "--neon-intensity": intensity,
        } as React.CSSProperties
      }
    >
      <h1
        ref={textRef}
        contentEditable={contentEditable}
        spellCheck={spellCheck}
 className="neon-text text-white text-8xl md:text-9xl font-light italic uppercase px-16 py-12 border-4 border-white rounded-3xl 
  focus:outline-none select-all"
        style={{
          animation: "flicker 1.5s infinite alternate",
        }}
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  )
}

interface NeonColorPickerProps {
  currentPreset: NeonPreset
  onPresetChange: (preset: NeonPreset) => void
  intensity: number
  onIntensityChange: (intensity: number) => void
}

export function NeonColorPicker({ currentPreset, onPresetChange, intensity, onIntensityChange }: NeonColorPickerProps) {
    const [isExpanded, setIsExpanded] = useState(false)

    console.log("[v0] NeonColorPicker render - isExpanded:", isExpanded, "intensity:", intensity)

    return (
      <div className="fixed top-6 left-6 z-10 mb-6">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="bg-background/80 backdrop-blur-sm p-3 rounded-xl border border-white/20 hover:border-white/30 transition-all
  duration-200 mb-2"
          style={{
            boxShadow: `0 0 15px ${NEON_PRESETS[currentPreset].text}30`,
          }}
        >
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: NEON_PRESETS[currentPreset].text }} />
            <span className="text-white/80 text-xs font-light">{isExpanded ? "−" : "+"}</span>
          </div>
        </button>

        <div
          className={cn(
            "bg-background/80 backdrop-blur-sm rounded-2xl border border-white/20 transition-all duration-300 overflow-hidden",
            isExpanded ? "p-4 pb-6 opacity-100 max-h-[520px] w-96" : "p-0 opacity-0 max-h-0 w-0",  // 改为 w-96
          )}
        >
          <h3 className="text-white/90 text-xs font-light mb-3 tracking-wide">Gas Type</h3>
          <div className="grid grid-cols-2 gap-1.5 mb-4">  {/* 改为 grid 两列 */}
            {Object.entries(NEON_PRESETS).map(([key, preset]) => (
              <button
                key={key}
                onClick={() => onPresetChange(key as NeonPreset)}
                className={cn(
                  "px-3 py-1.5 text-xs rounded-lg border transition-all duration-200 text-left",
                  currentPreset === key
                    ? "border-white/40 text-white bg-white/5"
                    : "border-white/10 text-white/60 hover:border-white/20 hover:text-white/80 hover:bg-white/5",
                )}
                style={{
                  boxShadow: currentPreset === key ? `0 0 20px ${preset.text}40` : undefined,
                }}
              >
                <span className="font-light truncate">{preset.name.replace(/\s*\([^)]*\)$/, "")}</span>
              </button>
            ))}
          </div>
          <div className="space-y-3 pt-3 border-t border-white/20">
            <div className="flex items-center justify-between">
              <label className="text-white/90 text-sm font-light tracking-wide">Intensity</label>
              <span className="text-white/70 text-sm font-mono bg-white/10 px-2 py-1 rounded">
                {intensity.toFixed(1)}
              </span>
            </div>
            <input
              type="range"
              min="0.3"
              max="2"
              step="0.1"
              value={intensity}
              onChange={(e) => {
                const newIntensity = Number.parseFloat(e.target.value)
                console.log("[v0] Intensity changed to:", newIntensity)
                onIntensityChange(newIntensity)
              }}
              className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider mb-2"
              style={{
                background: `linear-gradient(to right, ${NEON_PRESETS[currentPreset].text} 0%, ${NEON_PRESETS[currentPreset].text}
  ${((intensity - 0.3) / (2 - 0.3)) * 100}%, rgba(255,255,255,0.2) ${((intensity - 0.3) / (2 - 0.3)) * 100}%, rgba(255,255,255,0.2) 100%)`,
              }}
            />
          </div>
        </div>
      </div>
    )
  }
