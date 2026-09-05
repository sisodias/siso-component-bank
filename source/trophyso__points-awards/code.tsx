"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import {
  Award,
  Clock,
  Flame,
  Sparkles,
  Target,
  UserPlus,
  type LucideIcon,
} from "lucide-react"

import { cn } from "@/lib/utils"

export interface PointsAwardTrigger {
  id: string
  type: string
  points: number
  metricName?: string | null
  metricThreshold?: number | null
  achievementName?: string | null
  streakLengthThreshold?: number | null
  timeUnit?: "hour" | "day"
  timeInterval?: number | null
}

export interface PointsAward {
  id: string
  awarded: number
  /** ISO 8601 datetime */
  date: string
  /** User's total points after this award */
  total: number
  trigger: PointsAwardTrigger
}

interface PointsAwardsProps extends React.HTMLAttributes<HTMLDivElement> {
  awards: PointsAward[]
  formatTotalPoints?: (value: number) => string
  formatAwardedPoints?: (value: number) => string
  formatDate?: (isoDate: string) => string
}

const triggerIconMap: Record<string, LucideIcon> = {
  metric: Target,
  achievement: Award,
  streak: Flame,
  time: Clock,
  user_creation: UserPlus,
}

function triggerIcon(type: string): LucideIcon {
  return triggerIconMap[type] ?? Sparkles
}

function awardActionDescription(trigger: PointsAwardTrigger): string {
  if (trigger.metricName) {
    if (trigger.metricThreshold != null) {
      return `${trigger.metricName} · threshold ${Number(trigger.metricThreshold).toLocaleString()}`
    }
    return trigger.metricName
  }
  if (trigger.type === "achievement") {
    return trigger.achievementName ?? "Achievement"
  }
  if (trigger.type === "streak") {
    return trigger.streakLengthThreshold != null
      ? `Streak · ${trigger.streakLengthThreshold.toLocaleString()}`
      : "Streak"
  }
  if (trigger.type === "time" && trigger.timeInterval != null && trigger.timeUnit) {
    return `Every ${trigger.timeInterval} ${trigger.timeUnit}(s)`
  }
  if (trigger.type === "user_creation") {
    return "Account created"
  }
  return trigger.type.replace(/_/g, " ")
}

function defaultFormatAwardedPoints(value: number) {
  return value > 0 ? `+${value.toLocaleString()}` : value.toLocaleString()
}

function defaultFormatAwardDate(iso: string) {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) {
    return iso.length >= 10 ? iso.slice(0, 10) : iso
  }
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

const PointsAwards = React.forwardRef<HTMLDivElement, PointsAwardsProps>(
  ({ className, awards, formatTotalPoints, formatAwardedPoints, formatDate, ...props }, ref) => {
    const formatRowDate = formatDate ?? defaultFormatAwardDate

    return (
      <div
        ref={ref}
        className={cn("bg-card w-full rounded-xl border", className)}
        {...props}
      >
        <TooltipPrimitive.Provider>
          <div
            role="list"
            aria-label="Points awards history"
            className="divide-border divide-y"
          >
            {awards.map((award) => {
              const awardedLabel = formatAwardedPoints
                ? formatAwardedPoints(award.awarded)
                : defaultFormatAwardedPoints(award.awarded)
              const totalLabel = formatTotalPoints
                ? formatTotalPoints(award.total)
                : award.total.toLocaleString()
              const description = awardActionDescription(award.trigger)
              const tooltip = `${awardedLabel} — ${description}`
              const Icon = triggerIcon(award.trigger.type)

              return (
                <div
                  key={award.id}
                  role="listitem"
                  className="py-3"
                  style={{ paddingLeft: "24px", paddingRight: "24px" }}
                >
                  <div className="grid grid-cols-[7rem_minmax(0,1fr)_auto] items-center gap-4">
                    <span className="text-muted-foreground truncate text-sm">
                      {formatRowDate(award.date)}
                    </span>

                    <p className="flex items-center gap-2">
                      <span className="text-foreground justify-self-center font-bold tabular-nums">
                        {totalLabel}
                      </span>
                      <span className="text-green-600 dark:text-green-400 font-medium tabular-nums">
                        {awardedLabel}
                      </span>
                    </p>

                    <div className="flex items-center justify-end gap-2" style={{ paddingLeft: "48px" }}>
                      <TooltipPrimitive.Root>
                        <TooltipPrimitive.Trigger asChild>
                          <span
                            aria-label={tooltip}
                            className="bg-muted text-foreground inline-flex h-6 w-6 items-center justify-center rounded-full"
                          >
                            <Icon className="h-3 w-3" aria-hidden="true" />
                          </span>
                        </TooltipPrimitive.Trigger>
                        <TooltipPrimitive.Content
                          side="top"
                          sideOffset={6}
                          className="bg-popover text-popover-foreground z-50 max-w-xs overflow-hidden rounded-md border px-3 py-1.5 text-xs shadow-md"
                        >
                          {tooltip}
                        </TooltipPrimitive.Content>
                      </TooltipPrimitive.Root>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </TooltipPrimitive.Provider>
      </div>
    )
  }
)

PointsAwards.displayName = "PointsAwards"

export { PointsAwards }
export type { PointsAwardsProps }