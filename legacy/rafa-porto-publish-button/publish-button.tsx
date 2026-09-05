"use client"

import * as React from "react"
import { Check } from "lucide-react"
import { Button } from "./button"
import { cn } from "../_utils/cn"

interface PublishButtonProps {
  onPublish?: () => void
  holdDuration?: number
  className?: string
}

export function PublishButton({
  onPublish,
  holdDuration = 2000,
  className
}: PublishButtonProps) {
  const [state, setState] = React.useState<"idle" | "holding" | "publishing" | "published">("idle")
  const [progress, setProgress] = React.useState(0)
  const [animKey, setAnimKey] = React.useState(0)

  const holdTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = React.useRef<number>(0)

  const startHolding = () => {
    if (state !== "idle") return

    setState("holding")
    setProgress(0)
    setAnimKey((k) => k + 1)
    startTimeRef.current = Date.now()

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const pct = Math.min((elapsed / holdDuration) * 100, 100)
      setProgress(pct)
      if (pct >= 100) {
        clearInterval(progressIntervalRef.current!)
      }
    }, 30)

    holdTimerRef.current = setTimeout(() => {
      confirmPublish()
    }, holdDuration)
  }

  const cancelHolding = () => {
    if (state !== "holding") return
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    setProgress(0)
    setState("idle")
    setAnimKey((k) => k + 1)
  }

  const confirmPublish = () => {
    setState("publishing")
    setAnimKey((k) => k + 1)
    setProgress(100)
    onPublish?.()

    setTimeout(() => {
      setState("published")
      setAnimKey((k) => k + 1)
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        navigator.vibrate?.(60)
      }
      setTimeout(() => setState("idle"), 3000)
    }, 600)
  }

  React.useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  const getLabel = () => {
    switch (state) {
      case "holding":
        return "Sure?"
      case "publishing":
        return "Publishing..."
      case "published":
        return "Published"
      default:
        return "Publish"
    }
  }

  return (
    <Button
      variant={state === "published" ? "secondary" : "default"}
      className={cn(
        "relative flex items-center justify-center gap-2 min-w-[140px] select-none transition-all duration-300 ease-in-out",
        state === "holding" && "cursor-grabbing scale-[0.98]",
        state === "published" &&
          "bg-[hsl(var(--success))] text-[hsl(var(--success-foreground))] hover:bg-[hsl(var(--success))]",
        className
      )}
      onMouseDown={startHolding}
      onMouseUp={cancelHolding}
      onMouseLeave={cancelHolding}
      onTouchStart={startHolding}
      onTouchEnd={cancelHolding}
      disabled={state === "publishing"}
    >
      {state === "holding" && (
  <svg
    key={`progress-${animKey}`}
    className="absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 animate-in fade-in"
    viewBox="0 0 36 36"
  >
    <path
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      style={{
        stroke: "var(--muted-foreground)",
        opacity: 0.3,
        transition: "stroke 0.2s ease"
      }}
    />

    <path
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
      style={{
        stroke: "var(--destructive)",
        strokeDasharray: `${progress}, 100`,
        transition: "stroke-dasharray 0.08s linear, stroke 0.3s ease"
      }}
    />
  </svg>
)}

      {state === "published" && (
        <Check
          key={`check-${animKey}`}
          className="h-4 w-4 animate-pop-in"
          style={{ color: "hsl(var(--success-foreground))" }}
        />
      )}

      <span
        key={`label-${animKey}`}
        className={cn(
          "transition-all duration-300 ease-in-out animate-in fade-in slide-in-from-bottom-1",
          state === "published" && "font-semibold"
        )}
      >
        {getLabel()}
      </span>
    </Button>
  )
}
