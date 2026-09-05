"use client"

import * as React from "react"

import { cn } from "@/lib/utils"

const PIXEL_PATH =
  "M0 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h16M9 1h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h9M2 2h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h14M11 3h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h7M0 4h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h16M9 5h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h5M2 6h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h14M11 7h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h3M0 8h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h16M9 9h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h5M2 10h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h14M11 11h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h3M0 12h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h12M9 13h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h5M2 14h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h10M11 15h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h3M0 16h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h12M9 17h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h5M6 18h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h10M11 19h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3M4 20h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h12M9 21h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h5M6 22h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h10M15 23h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3M4 24h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h12M13 25h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h5M6 26h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h10M15 27h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3M4 28h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h12M13 29h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3m1 0h1M6 30h1m3 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h10M15 31h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h1m1 0h3"

export type AvatarPreset = {
  name: string
  /** Pixel pattern color (the foreground halftone) */
  pattern: string
  /** Circle fill color (the background disc) */
  surface: string
}

export const AVATAR_PRESETS = {
  volcanic:       { name: "Volcanic",        pattern: "#FFB36B", surface: "#7A1F00" },
  neonLime:       { name: "Neon Lime",       pattern: "#D7FF64", surface: "#234900" },
  electricViolet: { name: "Electric Violet", pattern: "#D8A8FF", surface: "#4A0D73" },
  hyperBlue:      { name: "Hyper Blue",      pattern: "#78D6FF", surface: "#003B8F" },
  aquaMint:       { name: "Aqua Mint",       pattern: "#7DFFF2", surface: "#005F5A" },
  graphite:       { name: "Graphite",        pattern: "#E2E2E2", surface: "#3D3D3D" },
  solarGold:      { name: "Solar Gold",      pattern: "#FFE45E", surface: "#8A5A00" },
  coralPeach:     { name: "Coral Peach",     pattern: "#FFC7A8", surface: "#A63D1A" },
  cyberPink:      { name: "Cyber Pink",      pattern: "#FF9BEF", surface: "#7A004E" },
  toxicGreen:     { name: "Toxic Green",     pattern: "#7BFF91", surface: "#004B1A" },
  iceBlue:        { name: "Ice Blue",        pattern: "#D8F3FF", surface: "#005B7A" },
  royalIndigo:    { name: "Royal Indigo",    pattern: "#A9B8FF", surface: "#1E2A78" },
} as const satisfies Record<string, AvatarPreset>

export type AvatarPresetKey = keyof typeof AVATAR_PRESETS

export type TeamMember = {
  name: string
  preset: AvatarPreset
}

/* ---------- helpers ---------- */

const kebab = (s: string) =>
  s.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")

const buildAvatarSVGString = (pattern: string, surface: string, size = 160) =>
  `<svg width="${size}" height="${size}" viewBox="0 0 160 160" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges"><defs><clipPath id="c"><circle cx="80" cy="80" r="80"/></clipPath></defs><g clip-path="url(#c)"><rect width="160" height="160" fill="${surface}"/><path fill="none" stroke="${pattern}" transform="translate(0,2.5) scale(5)" d="${PIXEL_PATH}"/></g></svg>`

const downloadSVG = (filename: string, svg: string) => {
  const dataUrl =
    "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg)
  const a = document.createElement("a")
  a.href = dataUrl
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms))

const DownloadIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M8 3v6m0 0L5.5 6.5M8 9l2.5-2.5M3.5 12h9" />
  </svg>
)

/* ---------- Avatar primitive ---------- */

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  preset: AvatarPreset
  size?: number
}

export const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
  ({ preset, size = 56, className, style, ...props }, ref) => {
    const reactId = React.useId()
    const clipId = `ac-${reactId.replace(/:/g, "")}`
    return (
      <div
        ref={ref}
        style={{ width: size, height: size, ...style }}
        className={cn(
          "relative shrink-0 overflow-hidden rounded-full",
          "shadow-[0_1px_3px_rgba(0,0,0,0.12)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_4px_8px_rgba(0,0,0,0.3)]",
          "after:pointer-events-none after:absolute after:inset-0 after:bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.18),transparent_38%)]",
          className,
        )}
        {...props}
      >
        <svg
          viewBox="0 0 160 160"
          width="100%"
          height="100%"
          xmlns="http://www.w3.org/2000/svg"
          shapeRendering="crispEdges"
          aria-hidden="true"
        >
          <defs>
            <clipPath id={clipId}>
              <circle cx="80" cy="80" r="80" />
            </clipPath>
          </defs>
          <g clipPath={`url(#${clipId})`}>
            <rect width="160" height="160" fill={preset.surface} />
            <path
              fill="none"
              stroke={preset.pattern}
              transform="translate(0,2.5) scale(5)"
              d={PIXEL_PATH}
            />
          </g>
        </svg>
      </div>
    )
  },
)
Avatar.displayName = "Avatar"

/* ---------- FallbackAvatars composite ---------- */

export interface VercelAvatarsProps
  extends React.HTMLAttributes<HTMLDivElement> {
  members: TeamMember[]
  eyebrow?: string
  title?: string
  subtitle?: string
  version?: string
  columns?: number
  avatarSize?: number
}

export function VercelAvatars({
  members,
  eyebrow = "Vercel Avatars",
  title = "Generated team identities",
  subtitle = "Click any avatar to download · SVG · 64 × 64",
  version = "v1.0",
  columns = 4,
  avatarSize = 56,
  className,
  ...props
}: FallbackAvatarsProps) {
  const [toast, setToast] = React.useState<string | null>(null)
  const toastTimer = React.useRef<number | null>(null)

  const showToast = React.useCallback((msg: string) => {
    setToast(msg)
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }, [])

  React.useEffect(
    () => () => {
      if (toastTimer.current) window.clearTimeout(toastTimer.current)
    },
    [],
  )

  const handleDownload = (member: TeamMember) => {
    downloadSVG(
      `${kebab(member.name)}-avatar.svg`,
      buildAvatarSVGString(member.preset.pattern, member.preset.surface),
    )
    showToast(`${member.name}.svg downloaded`)
  }

  const handleDownloadAll = async () => {
    showToast(`Downloading ${members.length} avatars…`)
    for (let i = 0; i < members.length; i++) {
      const m = members[i]
      downloadSVG(
        `${kebab(m.name)}-avatar.svg`,
        buildAvatarSVGString(m.preset.pattern, m.preset.surface),
      )
      if (i < members.length - 1) await sleep(140)
    }
    await sleep(200)
    showToast(`${members.length} avatars downloaded`)
  }

  return (
    <>
      <div
        className={cn(
          "relative w-full max-w-[560px] overflow-hidden rounded-2xl border border-border bg-card p-7 text-card-foreground",
          "shadow-[0_1px_2px_rgba(0,0,0,0.04),0_8px_24px_-4px_rgba(0,0,0,0.08)]",
          "dark:shadow-[0_1px_2px_rgba(0,0,0,0.5),0_4px_12px_-2px_rgba(0,0,0,0.4),0_16px_32px_-4px_rgba(0,0,0,0.35)]",
          className,
        )}
        {...props}
      >
        {/* Decorative grid — currentColor + foreground tint, masked with radial fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[length:24px_24px]"
          style={{
            backgroundImage:
              "linear-gradient(to right, hsl(var(--foreground) / 0.04) 1px, transparent 1px), linear-gradient(to bottom, hsl(var(--foreground) / 0.04) 1px, transparent 1px)",
            maskImage:
              "radial-gradient(circle at 50% 0%, black 40%, transparent 85%)",
            WebkitMaskImage:
              "radial-gradient(circle at 50% 0%, black 40%, transparent 85%)",
          }}
        />

        {/* Header */}
        <div className="relative mb-4 flex items-center justify-between">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
            {eyebrow}
          </span>
          <span className="rounded-full border border-border bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">
            {version}
          </span>
        </div>

        {/* Title */}
        <div className="relative">
          <h2 className="m-0 text-[22px] font-semibold tracking-tight text-foreground">
            {title}
          </h2>
          <p className="mt-1.5 font-mono text-[13px] text-muted-foreground">
            {subtitle}
          </p>
        </div>

        {/* Grid */}
        <div
          className="relative mt-6 grid gap-2"
          style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))` }}
        >
          {members.map((member) => (
            <button
              key={member.name}
              type="button"
              onClick={() => handleDownload(member)}
              title={`Download ${member.name}'s avatar`}
              className={cn(
                "group relative flex flex-col items-center gap-2.5 rounded-xl border border-transparent px-2 pt-3.5 pb-3",
                "transition-[background,border-color,transform]",
                "hover:border-border hover:bg-accent",
                "active:translate-y-px",
                "focus-visible:border-border focus-visible:bg-accent focus-visible:outline-none",
              )}
            >
              <div className="relative transition-transform group-hover:-translate-y-0.5">
                <Avatar preset={member.preset} size={avatarSize} />
                <span
                  aria-hidden
                  className={cn(
                    "absolute -right-1 -top-1 flex h-[22px] w-[22px] items-center justify-center rounded-full",
                    "bg-foreground text-background shadow-md",
                    "opacity-0 scale-75 transition-[opacity,transform]",
                    "group-hover:opacity-100 group-hover:scale-100",
                  )}
                >
                  <DownloadIcon className="h-3 w-3" />
                </span>
              </div>
              <div className="flex min-h-[30px] flex-col items-center gap-px">
                <span className="text-xs font-medium tracking-tight text-foreground">
                  {member.name}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-[0.08em] text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                  {member.preset.name}
                </span>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <div className="relative mt-6 flex items-center justify-between border-t border-border pt-4">
          <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted-foreground">
            {members.length} PRESETS
            <span className="px-1.5 text-muted-foreground/40">·</span>
            SVG
          </span>
          <button
            type="button"
            onClick={handleDownloadAll}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-medium",
              "bg-foreground text-background shadow-sm",
              "transition-[opacity,transform] hover:opacity-90 active:translate-y-px",
            )}
          >
            <DownloadIcon className="h-3 w-3" />
            Download all
          </button>
        </div>
      </div>

      {/* Toast */}
      <div
        role="status"
        aria-live="polite"
        className={cn(
          "fixed bottom-6 left-1/2 z-50 inline-flex items-center gap-1.5 rounded-lg",
          "border border-border bg-foreground px-3.5 py-2 text-xs font-medium text-background",
          "shadow-lg transition-[opacity,transform] duration-200",
          toast ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        style={{
          transform: `translateX(-50%) translateY(${toast ? "0" : "12px"})`,
        }}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        {toast ?? "Downloaded"}
      </div>
    </>
  )
}