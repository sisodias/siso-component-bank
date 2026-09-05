import * as React from "react"
import { motion, useReducedMotion } from "motion/react"

import { cn } from "@/lib/utils"

type ScrollBlurAxis = "vertical" | "horizontal" | "both"
type ScrollSnap = "none" | "x" | "y" | "both"
type ScrollSnapAlign = "start" | "center" | "end"

export interface ScrollBlurProps extends React.HTMLAttributes<HTMLDivElement> {
  axis?: ScrollBlurAxis
  edgeSize?: number
  snap?: ScrollSnap
  viewportClassName?: string
  contentClassName?: string
  children: React.ReactNode
}

export function ScrollBlur({
  axis = "vertical",
  edgeSize = 40,
  snap = "none",
  className,
  viewportClassName,
  contentClassName,
  children,
  ...props
}: ScrollBlurProps) {
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const reduceMotion = useReducedMotion()
  const [edges, setEdges] = React.useState({
    top: false,
    bottom: false,
    left: false,
    right: false,
  })
  const isVertical = axis === "vertical" || axis === "both"
  const isHorizontal = axis === "horizontal" || axis === "both"

  const updateEdges = React.useCallback(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const maxTop = viewport.scrollHeight - viewport.clientHeight
    const maxLeft = viewport.scrollWidth - viewport.clientWidth

    setEdges({
      top: isVertical && viewport.scrollTop > 2,
      bottom: isVertical && viewport.scrollTop < maxTop - 2,
      left: isHorizontal && viewport.scrollLeft > 2,
      right: isHorizontal && viewport.scrollLeft < maxLeft - 2,
    })
  }, [isHorizontal, isVertical])

  React.useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    updateEdges()

    const resizeObserver = new ResizeObserver(updateEdges)
    resizeObserver.observe(viewport)
    if (viewport.firstElementChild) {
      resizeObserver.observe(viewport.firstElementChild)
    }

    viewport.addEventListener("scroll", updateEdges, { passive: true })
    window.addEventListener("resize", updateEdges)

    return () => {
      resizeObserver.disconnect()
      viewport.removeEventListener("scroll", updateEdges)
      window.removeEventListener("resize", updateEdges)
    }
  }, [updateEdges])

  return (
    <div
      data-slot="scroll-blur"
      className={cn("relative overflow-hidden", className)}
      {...props}
    >
      <div
        ref={viewportRef}
        data-slot="scroll-blur-viewport"
        className={cn(
          "scrollbar-none h-full w-full",
          isVertical && "overflow-y-auto",
          isHorizontal && "overflow-x-auto",
          snap === "x" && "snap-x snap-mandatory",
          snap === "y" && "snap-y snap-mandatory",
          snap === "both" && "snap-both snap-mandatory",
          viewportClassName
        )}
      >
        <div data-slot="scroll-blur-content" className={contentClassName}>
          {children}
        </div>
      </div>

      {isVertical ? (
        <>
          <ScrollBlurEdge
            visible={edges.top}
            side="top"
            size={edgeSize}
            reduceMotion={reduceMotion}
          />
          <ScrollBlurEdge
            visible={edges.bottom}
            side="bottom"
            size={edgeSize}
            reduceMotion={reduceMotion}
          />
        </>
      ) : null}
      {isHorizontal ? (
        <>
          <ScrollBlurEdge
            visible={edges.left}
            side="left"
            size={edgeSize}
            reduceMotion={reduceMotion}
          />
          <ScrollBlurEdge
            visible={edges.right}
            side="right"
            size={edgeSize}
            reduceMotion={reduceMotion}
          />
        </>
      ) : null}
    </div>
  )
}

export function ScrollSnapItem({
  align = "start",
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  align?: ScrollSnapAlign
}) {
  return (
    <div
      data-slot="scroll-snap-item"
      className={cn(
        align === "start" && "snap-start",
        align === "center" && "snap-center",
        align === "end" && "snap-end",
        className
      )}
      {...props}
    />
  )
}

function ScrollBlurEdge({
  visible,
  side,
  size,
  reduceMotion,
}: {
  visible: boolean
  side: "top" | "bottom" | "left" | "right"
  size: number
  reduceMotion: boolean | null
}) {
  const isVertical = side === "top" || side === "bottom"
  const gradient =
    side === "top"
      ? "bg-linear-to-b"
      : side === "bottom"
        ? "bg-linear-to-t"
        : side === "left"
          ? "bg-linear-to-r"
          : "bg-linear-to-l"
  const mask =
    side === "top"
      ? "[mask-image:linear-gradient(to_bottom,black_0%,black_45%,transparent_100%)]"
      : side === "bottom"
        ? "[mask-image:linear-gradient(to_top,black_0%,black_45%,transparent_100%)]"
        : side === "left"
          ? "[mask-image:linear-gradient(to_right,black_0%,black_45%,transparent_100%)]"
          : "[mask-image:linear-gradient(to_left,black_0%,black_45%,transparent_100%)]"

  return (
    <motion.div
      data-slot="scroll-blur-edge"
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute z-10",
        side === "top" && "inset-x-0 top-0",
        side === "bottom" && "inset-x-0 bottom-0",
        side === "left" && "inset-y-0 left-0",
        side === "right" && "inset-y-0 right-0",
        isVertical ? "w-full" : "h-full"
      )}
      style={isVertical ? { height: size } : { width: size }}
      initial={false}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: reduceMotion ? 0 : 0.16 }}
    >
      <div
        className={cn(
          "absolute inset-0 from-background via-background/75 to-transparent",
          gradient
        )}
      />
      <div className={cn("absolute inset-0 backdrop-blur-[4px]", mask)} />
    </motion.div>
  )
}

export default ScrollBlur;
