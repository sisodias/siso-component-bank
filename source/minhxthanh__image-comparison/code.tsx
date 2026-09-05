"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ChevronsLeftRight, ChevronsUpDown } from "lucide-react"

export function ImageComparison({
  beforeSrc,
  afterSrc,
  beforeAlt = "Before",
  afterAlt = "After",
  initialPosition = 0.5,
  orientation = "horizontal",
  className = "",
  showLabels = true,
  handleAriaLabel = "Drag to compare",
  onChange,
}) {
  const containerRef = useRef(null)
  const handleRef = useRef(null)
  const [pos, setPos] = useState(() => clamp(initialPosition, 0, 1)) // 0..1
  const [dragging, setDragging] = useState(false)

  const isHorizontal = orientation === "horizontal"

  const updateFromPointer = useCallback(
    (clientX, clientY) => {
      const el = containerRef.current
      if (!el) return
      const rect = el.getBoundingClientRect()
      let next
      if (isHorizontal) {
        next = (clientX - rect.left) / rect.width
      } else {
        next = (clientY - rect.top) / rect.height
      }
      next = clamp(next, 0, 1)
      setPos((prev) => {
        if (prev !== next && typeof onChange === "function") onChange(next)
        return next
      })
    },
    [isHorizontal, onChange],
  )

  // Pointer events
  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const onPointerMove = (e) => {
      if (!dragging) return
      updateFromPointer(e.clientX, e.clientY)
    }
    const onPointerUp = () => setDragging(false)

    window.addEventListener("pointermove", onPointerMove)
    window.addEventListener("pointerup", onPointerUp)
    return () => {
      window.removeEventListener("pointermove", onPointerMove)
      window.removeEventListener("pointerup", onPointerUp)
    }
  }, [dragging, updateFromPointer])

  const onContainerPointerDown = (e) => {
    // Only left mouse button or primary touch/pen
    if (e.pointerType === "mouse" && e.button !== 0) return
    setDragging(true)
    containerRef.current?.setPointerCapture?.(e.pointerId)
    updateFromPointer(e.clientX, e.clientY)
  }

  const onHandlePointerDown = (e) => {
    e.stopPropagation()
    onContainerPointerDown(e)
  }

  // Keyboard support on handle (role=slider)
  const onHandleKeyDown = (e) => {
    const small = 0.02 // 2%
    const big = 0.1 // 10%
    let next = pos
    switch (e.key) {
      case "ArrowRight":
        next = pos + (isHorizontal ? small : 0)
        break
      case "ArrowLeft":
        next = pos - (isHorizontal ? small : 0)
        break
      case "ArrowUp":
        next = pos - (!isHorizontal ? small : 0)
        break
      case "ArrowDown":
        next = pos + (!isHorizontal ? small : 0)
        break
      case "Home":
        next = 0
        break
      case "End":
        next = 1
        break
      case "PageUp":
        next = clamp(pos + big * (isHorizontal ? 1 : -1), 0, 1)
        break
      case "PageDown":
        next = clamp(pos - big * (isHorizontal ? 1 : -1), 0, 1)
        break
      default:
        return // don't prevent default for other keys
    }
    e.preventDefault()
    next = clamp(next, 0, 1)
    setPos((prev) => {
      if (prev !== next && typeof onChange === "function") onChange(next)
      return next
    })
  }

  const percent = (pos * 100).toFixed(2) + "%"

  return (
    <div
      ref={containerRef}
      className={[
        "relative overflow-hidden select-none",
        // Touch-action to avoid scroll hijacking while dragging
        "touch-none",
        // Rounded container and subtle card look by default
        "rounded-2xl shadow-sm bg-black/5",
        className,
      ].join(" ")}
      onPointerDown={onContainerPointerDown}
      onDoubleClick={() => setPos((p) => (Math.abs(p - 0.5) < 0.05 ? 0.5 : 0.5))}
      aria-label={`${beforeAlt} vs ${afterAlt}`}
    >
      {/* Base image (AFTER) */}
      <img
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src={afterSrc || "/placeholder.svg"}
        alt={afterAlt}
        draggable={false}
      />

      {/* Clipped overlay (BEFORE) */}
      <div className="absolute inset-0" style={isHorizontal ? { width: percent } : { height: percent }}>
        <img
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          src={beforeSrc || "/placeholder.svg"}
          alt={beforeAlt}
          draggable={false}
        />
      </div>

      {/* Divider line */}
      <div
        className={["absolute bg-white/80 shadow", isHorizontal ? "top-0 bottom-0 w-px" : "left-0 right-0 h-px"].join(
          " ",
        )}
        style={isHorizontal ? { left: percent } : { top: percent }}
        aria-hidden="true"
      />

      {/* Handle / Thumb */}
      <button
        ref={handleRef}
        type="button"
        onPointerDown={onHandlePointerDown}
        onKeyDown={onHandleKeyDown}
        className={[
          "absolute -translate-x-1/2 -translate-y-1/2",
          "grid place-items-center",
          "h-10 w-10 rounded-full dark:bg-white bg-black shadow-lg ring-1 ring-black/10",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500",
          "cursor-ew-resize",
          !isHorizontal && "cursor-ns-resize",
        ].join(" ")}
        style={isHorizontal ? { left: percent, top: "50%" } : { top: percent, left: "50%" }}
        role="slider"
        aria-label={handleAriaLabel}
        aria-orientation={isHorizontal ? "horizontal" : "vertical"}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(pos * 100)}
        aria-valuetext={`${Math.round(pos * 100)}%`}
      >
        {isHorizontal ? (
          <ChevronsLeftRight className="h-5 w-5 dark:text-black text-white" aria-hidden="true" />
        ) : (
          <ChevronsUpDown className="h-5 w-5 dark:text-black text-white" aria-hidden="true" />
        )}
      </button>

      {/* Labels */}
      {showLabels && (
        <>
          <span
            className={[
              "absolute rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white transition-opacity duration-200",
              isHorizontal ? "left-2 top-2" : "left-2 top-2",
            ].join(" ")}
            style={{ opacity: pos < 0.05 ? 0 : 1 }}
          >
            {beforeAlt}
          </span>
          <span
            className={[
              "absolute rounded-md bg-black/60 px-2 py-1 text-xs font-medium text-white transition-opacity duration-200",
              isHorizontal ? "right-2 top-2" : "left-2 bottom-2",
            ].join(" ")}
            style={{ opacity: pos > 0.95 ? 0 : 1 }}
          >
            {afterAlt}
          </span>
        </>
      )}
    </div>
  )
}

// Simple clamp helper
function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}