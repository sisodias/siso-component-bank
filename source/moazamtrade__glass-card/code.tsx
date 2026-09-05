"use client"

import * as React from "react"
import { motion, useInView } from "framer-motion"
import { Shield, Zap, ArrowRight } from "lucide-react"

export type LineCardProps = {
  className?: string

  // Content
  label?: string
  title: string
  description?: string

  // Badges or meta
  meta?: string

  // CTA
  ctaLabel?: string
  onCtaClick?: () => void

  // Leading icon
  icon?: React.ReactNode

  // Layout toggles
  showRunningBorder?: boolean
  compact?: boolean

  // Sizing
  fullViewport?: boolean // if true, the card fills the viewport
}

function cn(...a: Array<string | undefined | false | null>) {
  return a.filter(Boolean).join(" ")
}

export function LineCard({
  className,
  label = "Featured",
  title,
  description,
  meta,
  ctaLabel = "Open",
  onCtaClick,
  icon = <Shield className="h-5 w-5 text-white/80" />,
  showRunningBorder = true,
  compact = false,
  fullViewport = true,
}: LineCardProps) {
  const ref = React.useRef<HTMLDivElement | null>(null)
  const inView = useInView(ref, { once: true, margin: "-50px" })
  const dashId = React.useId()

  return (
    <motion.section
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ type: "spring", stiffness: 90, damping: 16 }}
      className={cn(
        "relative w-full max-w-2xl mx-auto overflow-hidden rounded-2xl border border-white/10 bg-black/20 text-white shadow-2xl backdrop-blur-xl",
        fullViewport ? "min-h-[400px]" : "h-full",
        "isolate",
        className,
      )}
      style={{
        background: "rgba(0, 0, 0, 0.3)",
        backdropFilter: "blur(24px) saturate(1.2)",
        border: "1px solid rgba(255, 255, 255, 0.15)",
      }}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(800px 400px at 50% 0%, rgba(255, 255, 255, 0.03), transparent 60%), radial-gradient(600px 300px at 50% 100%, rgba(255, 255, 255, 0.02), transparent 70%)",
          mixBlendMode: "overlay",
        }}
      />

      <div className="absolute inset-[1px] rounded-[15px] border border-white/8 pointer-events-none" aria-hidden />

      <div className={cn("relative p-8", compact && "p-6", "flex flex-col h-full")}>
        {/* Header */}
        <div className="flex items-start justify-between gap-6 mb-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-xl border border-white/15 bg-white/10 backdrop-blur-sm shadow-xl">
              {icon}
            </div>
            <div>
              {label ? (
                <div className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium uppercase tracking-wide text-white/90 backdrop-blur-sm">
                  <Zap className="h-3 w-3" />
                  {label}
                </div>
              ) : null}
              <h3 className="text-2xl font-bold leading-tight tracking-tight text-white">{title}</h3>
            </div>
          </div>

          {meta ? (
            <span className="shrink-0 text-sm font-medium text-white/70 bg-white/10 px-3 py-1 rounded-md backdrop-blur-sm">
              {meta}
            </span>
          ) : null}
        </div>

        {/* Body */}
        {description ? <p className="text-base leading-relaxed text-white/80 mb-8 flex-1">{description}</p> : null}

        {/* Footer */}
        <div className="flex items-center justify-between gap-4 mt-auto">
          <div className="flex items-center gap-2">
            <CircleDot />
            <CircleDot className="opacity-70" />
            <CircleDot className="opacity-40" />
            <span className="text-xs text-white/60 ml-2">Active</span>
          </div>

          {ctaLabel ? (
            <motion.button
              type="button"
              onClick={onCtaClick}
              whileTap={{ scale: 0.98 }}
              whileHover={{ y: -1 }}
              className="inline-flex items-center gap-2 rounded-lg border border-white/20 bg-white/15 px-6 py-3 text-sm font-semibold text-white shadow-xl transition-all hover:bg-white/25 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-white/30 focus:ring-offset-2 ring-offset-transparent backdrop-blur-sm"
            >
              {ctaLabel}
              <ArrowRight className="h-4 w-4" />
            </motion.button>
          ) : null}
        </div>
      </div>
    </motion.section>
  )
}

/**
 * RunningOutline
 * Animated rounded-rect outline with a moving dash.
 */
function RunningOutline({
  id,
  radius = 16,
  speedSec = 4,
  dashLen = 8,
  dashGap = 8,
}: {
  id: string
  radius?: number
  speedSec?: number
  dashLen?: number
  dashGap?: number
}) {
  const safe = `dash_${id.replace(/[^a-zA-Z0-9_-]/g, "")}`
  const animName = `${safe}_anim`
  const dashArray = `${dashLen} ${dashGap}`

  return (
    <div className="pointer-events-none absolute inset-0">
      <style>{`
        @keyframes ${animName} {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: -420; }
        }
      `}</style>
      <svg
        aria-hidden="true"
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <rect
          x="1"
          y="1"
          width="98"
          height="98"
          rx={radius}
          ry={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.1)"
          strokeWidth="0.8"
        />
        <rect
          x="1"
          y="1"
          width="98"
          height="98"
          rx={radius}
          ry={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.3)"
          strokeOpacity="0.2"
          strokeWidth="1.2"
        />
        <rect
          x="1"
          y="1"
          width="98"
          height="98"
          rx={radius}
          ry={radius}
          fill="none"
          stroke="rgba(255, 255, 255, 0.6)"
          strokeOpacity="0.4"
          strokeWidth="0.9"
          strokeDasharray={dashArray}
          style={{ animation: `${animName} ${speedSec}s linear infinite` }}
        />
      </svg>
    </div>
  )
}

/**
 * CircleDot
 */
function CircleDot({ className }: { className?: string }) {
  return <div className={cn("h-3 w-3 rounded-full border border-white/30 bg-white/20 shadow-sm", className)} />
}
