"use client"

import { useMemo } from "react"
import { OrbitalChar } from "@/components/ui/orbital-letters-utils/orbital-char"

type Props = {
  text?: string
  radius?: number
  duration?: number
  decay?: number
}

export default function OrbitalText({ text = "Orbital Letters", radius = 18, duration = 2000, decay = 0.9 }: Props) {
  const chars = useMemo(() => text.split(""), [text])

  return (
    <div className="relative font-semibold tracking-tight text-[clamp(28px,5vw,56px)]" aria-label={text} role="img">
      <div className="flex select-none items-center justify-center gap-[0.02em] text-neutral-900 dark:text-neutral-200">
        {chars.map((c, i) => (
          <OrbitalChar
            key={i}
            char={c}
            index={i}
            radius={radius}
            duration={duration}
            decay={decay}
          />
        ))}
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-[0.08]">
        <div className="h-full w-full bg-[radial-gradient(50%_50%_at_50%_40%,#8882_0%,transparent_60%)]" />
      </div>
    </div>
  )
}

export { OrbitalText }
