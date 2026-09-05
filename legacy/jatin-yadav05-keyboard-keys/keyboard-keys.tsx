"use client"

import { useState, useEffect, useCallback } from "react"
import { cn } from "../_utils/cn"

interface KeyProps {
  label: string
  sublabel?: string
  width?: string
  keyCode?: string
}

function Key({ label, sublabel, width = "w-12", keyCode }: KeyProps) {
  const [isPressed, setIsPressed] = useState(false)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (keyCode && e.key.toLowerCase() === keyCode.toLowerCase()) {
        setIsPressed(true)
      }
    },
    [keyCode],
  )

  const handleKeyUp = useCallback(
    (e: KeyboardEvent) => {
      if (keyCode && e.key.toLowerCase() === keyCode.toLowerCase()) {
        setIsPressed(false)
      }
    },
    [keyCode],
  )

  useEffect(() => {
    if (keyCode) {
      window.addEventListener("keydown", handleKeyDown)
      window.addEventListener("keyup", handleKeyUp)
      return () => {
        window.removeEventListener("keydown", handleKeyDown)
        window.removeEventListener("keyup", handleKeyUp)
      }
    }
  }, [keyCode, handleKeyDown, handleKeyUp])

  return (
    <button
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onTouchStart={() => setIsPressed(true)}
      onTouchEnd={() => setIsPressed(false)}
      className={cn(
        width,
        "group relative h-12 select-none rounded-lg transition-all duration-75 ease-out focus:outline-none",
        isPressed ? "translate-y-1" : "translate-y-0",
      )}
    >
      {/* Shadow/depth layer */}
      <span
        className={cn(
          "absolute inset-0 rounded-lg transition-all duration-75",
          "bg-neutral-400 dark:bg-neutral-800",
          isPressed ? "translate-y-0" : "translate-y-1",
        )}
      />

      {/* Main key surface */}
      <span
        className={cn(
          "absolute inset-0 flex flex-col items-center justify-center rounded-lg border transition-all duration-75",
          isPressed
            ? "border-neutral-300 bg-gradient-to-b from-neutral-200 to-neutral-100 dark:border-neutral-600 dark:from-neutral-900 dark:to-neutral-800"
            : "border-neutral-300 bg-gradient-to-b from-white to-neutral-100 dark:border-neutral-700 dark:from-neutral-800 dark:to-neutral-900",
        )}
      >
        {/* Shine effect */}
        <span
          className={cn(
            "absolute inset-x-2 top-1 h-px rounded-full bg-gradient-to-r from-transparent to-transparent transition-opacity duration-75",
            "via-black/10 dark:via-white/20",
            isPressed ? "opacity-0" : "opacity-100",
          )}
        />

        {/* Key label */}
        <span className="relative z-10 flex flex-col items-center justify-center gap-0.5">
          {sublabel && (
            <span className="text-[10px] font-medium text-neutral-400 dark:text-neutral-500">{sublabel}</span>
          )}
          <span
            className={cn(
              "text-xs font-semibold tracking-wide transition-colors duration-75",
              isPressed ? "text-neutral-500 dark:text-neutral-400" : "text-neutral-700 dark:text-neutral-300",
            )}
          >
            {label}
          </span>
        </span>
      </span>
    </button>
  )
}

export function KeyboardKeys() {
  return (
    <div className="inline-flex flex-col items-center gap-3">
      <p className="text-xs font-medium uppercase tracking-widest text-neutral-500">Press or Click</p>
      <div className="flex items-center gap-1.5 rounded-xl border p-3 shadow-2xl border-neutral-200 bg-neutral-100 shadow-neutral-300/50 dark:border-neutral-800 dark:bg-neutral-950 dark:shadow-black/50">
        <Key label="⌘" keyCode="Meta" />
        <Key label="⇧" keyCode="Shift" />
        <Key label="P" keyCode="p" />
      </div>
    </div>
  )
}
