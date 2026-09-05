"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { animate } from "animejs"
import { ChevronUp, ChevronDown } from "lucide-react"

const OFFSET = 130
const ANIMATION_DURATION = 600
const NUMBER_SHIFT = 40
const DRAG_THRESHOLD = 10

interface StepperProps {
  initialValue?: number
  min?: number
  max?: number
  step?: number
  onChange?: (value: number) => void
}

const useStepperAnimation = (ref: React.RefObject<HTMLDivElement | null>) => {
  const animation = useRef<ReturnType<typeof animate> | null>(null)

  const centerElement = useCallback(() => {
    if (!ref.current) return

    animation.current = animate(ref.current, {
      translateY: 0,
      duration: ANIMATION_DURATION,
      easing: "easeOutQuad",
    })
  }, [ref])

  const pauseAnimation = () => {
    if (animation.current) animation.current.pause()
  }

  return { centerElement, pauseAnimation }
}

export default function Stepper({
  initialValue = 10,
  min = 0,
  max = 20,
  step = 1,
  onChange,
}: StepperProps) {
  const [count, setCount] = useState(initialValue)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState(0)

  const stepperRef = useRef<HTMLDivElement | null>(null)
  const currentPos = useRef(0)
  const mouseY = useRef(0)

  const { centerElement, pauseAnimation } = useStepperAnimation(stepperRef)

  const updateCount = useCallback(
    (newCount: number) => {
      const clampedValue = Math.max(min, Math.min(max, newCount))
      setCount(clampedValue)
      onChange?.(clampedValue)
    },
    [min, max, onChange]
  )

  const handlePointerDown = useCallback(
    (clientY: number) => {
      mouseY.current = clientY
      currentPos.current = clientY
      setIsDragging(true)
      pauseAnimation()
    },
    [pauseAnimation]
  )

  const handleDragEnd = useCallback(() => {
    setIsDragging(false)
    setDragOffset(0)
    centerElement()
  }, [centerElement])

  const handlePointerMove = useCallback(
    (clientY: number) => {
      mouseY.current = clientY

      if (isDragging && stepperRef.current) {
        const deltaY = mouseY.current - currentPos.current
        stepperRef.current.style.transform = `translateY(${deltaY / 2}px)`
        setDragOffset(deltaY)

        if (deltaY <= -OFFSET) {
          handleDragEnd()
          updateCount(count + step)
        } else if (deltaY >= OFFSET) {
          handleDragEnd()
          updateCount(count - step)
        }
      }
    },
    [isDragging, count, step, handleDragEnd, updateCount]
  )

  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      handlePointerDown(e.clientY)
    },
    [handlePointerDown]
  )

  const onTouchStart = useCallback(
    (e: React.TouchEvent) => {
      handlePointerDown(e.touches[0].clientY)
    },
    [handlePointerDown]
  )

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      handlePointerMove(e.clientY)
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      handlePointerMove(e.touches[0].clientY)
    }
    const onPointerUp = () => {
      if (isDragging) handleDragEnd()
    }

    document.addEventListener("mousemove", onMouseMove)
    document.addEventListener("touchmove", onTouchMove, { passive: false })
    document.addEventListener("mouseup", onPointerUp)
    document.addEventListener("touchend", onPointerUp)
    document.addEventListener("touchcancel", onPointerUp)

    return () => {
      document.removeEventListener("mousemove", onMouseMove)
      document.removeEventListener("touchmove", onTouchMove)
      document.removeEventListener("mouseup", onPointerUp)
      document.removeEventListener("touchend", onPointerUp)
      document.removeEventListener("touchcancel", onPointerUp)
    }
  }, [isDragging, handleDragEnd, handlePointerMove])

  const progress = Math.min(Math.abs(dragOffset) / OFFSET, 1)
  const direction = dragOffset < 0 ? "up" : "down"
  const currentNumber = count
  const nextNumber =
    direction === "up" ? Math.min(count + step, max) : Math.max(count - step, min)
  const showNextNumber = isDragging && Math.abs(dragOffset) > DRAG_THRESHOLD

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-foreground font-bold text-[20px] relative w-full max-w-full">
      <div className="flex flex-col items-center gap-2">
        <ChevronUp
          className="w-16 h-16 transition-colors duration-200"
          style={{
            color:
              isDragging && dragOffset < -20
                ? "var(--foreground)"
                : "var(--muted-foreground)",
          }}
        />

        <div className="relative">
          <div
            ref={stepperRef}
            onMouseDown={onMouseDown}
            onTouchStart={onTouchStart}
            className="w-[130px] h-[130px] rounded-[40px] flex justify-center items-center text-[64px] overflow-hidden z-20 cursor-grab active:cursor-grabbing select-none bg-primary text-primary-foreground border-3 border-muted-foreground"
          >
            <span
              className="absolute inset-0 flex items-center justify-center transition-all duration-100 ease-out"
              style={{
                opacity: isDragging ? 1 - progress : 1,
                transform: isDragging
                  ? `translateY(${
                      direction === "up"
                        ? -progress * NUMBER_SHIFT
                        : progress * NUMBER_SHIFT
                    }px)`
                  : "translateY(0px)",
              }}
            >
              {currentNumber}
            </span>

            {showNextNumber && (
              <span
                className="absolute inset-0 flex items-center justify-center transition-all duration-100 ease-out"
                style={{
                  opacity: progress,
                  transform: `translateY(${
                    direction === "up"
                      ? (1 - progress) * NUMBER_SHIFT
                      : -(1 - progress) * NUMBER_SHIFT
                  }px)`,
                }}
              >
                {nextNumber}
              </span>
            )}
          </div>
        </div>

        <ChevronDown
          className="w-16 h-16 transition-colors duration-200"
          style={{
            color:
              isDragging && dragOffset > 20
                ? "var(--foreground)"
                : "var(--muted-foreground)",
          }}
        />
      </div>
    </div>
  )
}
