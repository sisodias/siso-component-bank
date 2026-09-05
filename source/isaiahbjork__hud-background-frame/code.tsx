import { cn } from "@/lib/utils"
import type React from "react"

interface HudFrameProps {
  children?: React.ReactNode
  backgroundImage?: string
  backgroundColor?: string
  backgroundVideo?: string
}

export function HudFrame({ children, backgroundImage, backgroundColor, backgroundVideo }: HudFrameProps) {
  return (
    <div className="relative w-full h-full">
      {/* Content area - this is where children will render */}
      <div className="w-full h-full relative z-20">{children}</div>

      {/* HUD Frame Overlay */}
      <div
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none z-10"
        style={
          {
            "--frame-thickness": "8px",
            "--corner-chamfer": "16px",
            "--notch-width": "240px",
            "--notch-depth": "16px",
            "--notch-chamfer": "12px",
            "--frame-padding": "8px",
            "--edge-radius": "50px",
            "--border-width": "0px",
          } as React.CSSProperties
        }
      >
        {/* White border layer (behind) */}
        <div
          className="w-full h-full bg-white"
          style={{
            clipPath: `polygon(
        calc(var(--frame-padding) - var(--border-width)) calc(var(--corner-chamfer) + var(--frame-padding) - var(--border-width)),
        calc(var(--corner-chamfer) + var(--frame-padding) - var(--border-width)) calc(var(--frame-padding) - var(--border-width)),
        calc(50% - var(--notch-width)/2) calc(var(--frame-padding) - var(--border-width)),
        calc(50% - var(--notch-width)/2 + var(--notch-chamfer)) calc(var(--notch-depth) + var(--frame-padding) - var(--border-width)),
        calc(50% + var(--notch-width)/2 - var(--notch-chamfer)) calc(var(--notch-depth) + var(--frame-padding) - var(--border-width)),
        calc(50% + var(--notch-width)/2) calc(var(--frame-padding) - var(--border-width)),
        calc(100% - var(--corner-chamfer) - var(--frame-padding) + var(--border-width)) calc(var(--frame-padding) - var(--border-width)),
        calc(100% - var(--frame-padding) + var(--border-width)) calc(var(--corner-chamfer) + var(--frame-padding) - var(--border-width)),
        calc(100% - var(--frame-padding) + var(--border-width)) calc(50% - var(--notch-width)/2),
        calc(100% - var(--notch-depth) - var(--frame-padding) + var(--border-width)) calc(50% - var(--notch-width)/2 + var(--notch-chamfer)),
        calc(100% - var(--notch-depth) - var(--frame-padding) + var(--border-width)) calc(50% + var(--notch-width)/2 - var(--notch-chamfer)),
        calc(100% - var(--frame-padding) + var(--border-width)) calc(50% + var(--notch-width)/2),
        calc(100% - var(--frame-padding) + var(--border-width)) calc(100% - var(--corner-chamfer) - var(--frame-padding) + var(--border-width)),
        calc(100% - var(--corner-chamfer) - var(--frame-padding) + var(--border-width)) calc(100% - var(--frame-padding) + var(--border-width)),
        calc(50% + var(--notch-width)/2) calc(100% - var(--frame-padding) + var(--border-width)),
        calc(50% + var(--notch-width)/2 - var(--notch-chamfer)) calc(100% - var(--notch-depth) - var(--frame-padding) + var(--border-width)),
        calc(50% - var(--notch-width)/2 + var(--notch-chamfer)) calc(100% - var(--notch-depth) - var(--frame-padding) + var(--border-width)),
        calc(50% - var(--notch-width)/2) calc(100% - var(--frame-padding) + var(--border-width)),
        calc(var(--corner-chamfer) + var(--frame-padding) - var(--border-width)) calc(100% - var(--frame-padding) + var(--border-width)),
        calc(var(--frame-padding) - var(--border-width)) calc(100% - var(--corner-chamfer) - var(--frame-padding) + var(--border-width)),
        calc(var(--frame-padding) - var(--border-width)) calc(50% + var(--notch-width)/2),
        calc(var(--notch-depth) + var(--frame-padding) - var(--border-width)) calc(50% + var(--notch-width)/2 - var(--notch-chamfer)),
        calc(var(--notch-depth) + var(--frame-padding) - var(--border-width)) calc(50% - var(--notch-width)/2 + var(--notch-chamfer)),
        calc(var(--frame-padding) - var(--border-width)) calc(50% - var(--notch-width)/2)
      )`,
            borderRadius: "var(--edge-radius)",
          }}
        />

        {/* Main frame layer with background image */}
        <div
          className={cn("absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat", backgroundColor ? `bg-[${backgroundColor}]` : "bg-zinc-800")}
          style={{
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            clipPath: `polygon(
        var(--frame-padding) calc(var(--corner-chamfer) + var(--frame-padding)),
        calc(var(--corner-chamfer) + var(--frame-padding)) var(--frame-padding),
        calc(50% - var(--notch-width)/2) var(--frame-padding),
        calc(50% - var(--notch-width)/2 + var(--notch-chamfer)) calc(var(--notch-depth) + var(--frame-padding)),
        calc(50% + var(--notch-width)/2 - var(--notch-chamfer)) calc(var(--notch-depth) + var(--frame-padding)),
        calc(50% + var(--notch-width)/2) var(--frame-padding),
        calc(100% - var(--corner-chamfer) - var(--frame-padding)) var(--frame-padding),
        calc(100% - var(--frame-padding)) calc(var(--corner-chamfer) + var(--frame-padding)),
        calc(100% - var(--frame-padding)) calc(50% - var(--notch-width)/2),
        calc(100% - var(--notch-depth) - var(--frame-padding)) calc(50% - var(--notch-width)/2 + var(--notch-chamfer)),
        calc(100% - var(--notch-depth) - var(--frame-padding)) calc(50% + var(--notch-width)/2 - var(--notch-chamfer)),
        calc(100% - var(--frame-padding)) calc(50% + var(--notch-width)/2),
        calc(100% - var(--frame-padding)) calc(100% - var(--corner-chamfer) - var(--frame-padding)),
        calc(100% - var(--corner-chamfer) - var(--frame-padding)) calc(100% - var(--frame-padding)),
        calc(50% + var(--notch-width)/2) calc(100% - var(--frame-padding)),
        calc(50% + var(--notch-width)/2 - var(--notch-chamfer)) calc(100% - var(--notch-depth) - var(--frame-padding)),
        calc(50% - var(--notch-width)/2 + var(--notch-chamfer)) calc(100% - var(--notch-depth) - var(--frame-padding)),
        calc(50% - var(--notch-width)/2) calc(100% - var(--frame-padding)),
        calc(var(--corner-chamfer) + var(--frame-padding)) calc(100% - var(--frame-padding)),
        var(--frame-padding) calc(100% - var(--corner-chamfer) - var(--frame-padding)),
        var(--frame-padding) calc(50% + var(--notch-width)/2),
        calc(var(--notch-depth) + var(--frame-padding)) calc(50% + var(--notch-width)/2 - var(--notch-chamfer)),
        calc(var(--notch-depth) + var(--frame-padding)) calc(50% - var(--notch-width)/2 + var(--notch-chamfer)),
        var(--frame-padding) calc(50% - var(--notch-width)/2)
      )`,
            borderRadius: "var(--edge-radius)",
          }}
        >
          {/* Background Video */}
          {backgroundVideo && (
            <video
              className="absolute inset-0 w-full h-full object-cover"
              src={backgroundVideo}
              autoPlay
              loop
              muted
              playsInline
              style={{
                clipPath: `polygon(
            var(--frame-padding) calc(var(--corner-chamfer) + var(--frame-padding)),
            calc(var(--corner-chamfer) + var(--frame-padding)) var(--frame-padding),
            calc(50% - var(--notch-width)/2) var(--frame-padding),
            calc(50% - var(--notch-width)/2 + var(--notch-chamfer)) calc(var(--notch-depth) + var(--frame-padding)),
            calc(50% + var(--notch-width)/2 - var(--notch-chamfer)) calc(var(--notch-depth) + var(--frame-padding)),
            calc(50% + var(--notch-width)/2) var(--frame-padding),
            calc(100% - var(--corner-chamfer) - var(--frame-padding)) var(--frame-padding),
            calc(100% - var(--frame-padding)) calc(var(--corner-chamfer) + var(--frame-padding)),
            calc(100% - var(--frame-padding)) calc(50% - var(--notch-width)/2),
            calc(100% - var(--notch-depth) - var(--frame-padding)) calc(50% - var(--notch-width)/2 + var(--notch-chamfer)),
            calc(100% - var(--notch-depth) - var(--frame-padding)) calc(50% + var(--notch-width)/2 - var(--notch-chamfer)),
            calc(100% - var(--frame-padding)) calc(50% + var(--notch-width)/2),
            calc(100% - var(--frame-padding)) calc(100% - var(--corner-chamfer) - var(--frame-padding)),
            calc(100% - var(--corner-chamfer) - var(--frame-padding)) calc(100% - var(--frame-padding)),
            calc(50% + var(--notch-width)/2) calc(100% - var(--frame-padding)),
            calc(50% + var(--notch-width)/2 - var(--notch-chamfer)) calc(100% - var(--notch-depth) - var(--frame-padding)),
            calc(50% - var(--notch-width)/2 + var(--notch-chamfer)) calc(100% - var(--notch-depth) - var(--frame-padding)),
            calc(50% - var(--notch-width)/2) calc(100% - var(--frame-padding)),
            calc(var(--corner-chamfer) + var(--frame-padding)) calc(100% - var(--frame-padding)),
            var(--frame-padding) calc(100% - var(--corner-chamfer) - var(--frame-padding)),
            var(--frame-padding) calc(50% + var(--notch-width)/2),
            calc(var(--notch-depth) + var(--frame-padding)) calc(50% + var(--notch-width)/2 - var(--notch-chamfer)),
            calc(var(--notch-depth) + var(--frame-padding)) calc(50% - var(--notch-width)/2 + var(--notch-chamfer)),
            var(--frame-padding) calc(50% - var(--notch-width)/2)
          )`
              }}
            />
          )}

          {/* Inner transparent cutout */}
          <div
            className="w-full h-full bg-transparent"
            style={{
              clipPath: `polygon(
          calc(var(--frame-thickness) + var(--frame-padding)) calc(var(--corner-chamfer) + var(--frame-thickness) + var(--frame-padding)),
          calc(var(--corner-chamfer) + var(--frame-thickness) + var(--frame-padding)) calc(var(--frame-thickness) + var(--frame-padding)),
          calc(50% - var(--notch-width)/2) calc(var(--frame-thickness) + var(--frame-padding)),
          calc(50% - var(--notch-width)/2 + var(--notch-chamfer)) calc(var(--notch-depth) + var(--frame-thickness) + var(--frame-padding)),
          calc(50% + var(--notch-width)/2 - var(--notch-chamfer)) calc(var(--notch-depth) + var(--frame-thickness) + var(--frame-padding)),
          calc(50% + var(--notch-width)/2) calc(var(--frame-thickness) + var(--frame-padding)),
          calc(100% - var(--corner-chamfer) - var(--frame-thickness) - var(--frame-padding)) calc(var(--frame-thickness) + var(--frame-padding)),
          calc(100% - var(--frame-thickness) - var(--frame-padding)) calc(var(--corner-chamfer) + var(--frame-thickness) + var(--frame-padding)),
          calc(100% - var(--frame-thickness) - var(--frame-padding)) calc(50% - var(--notch-width)/2),
          calc(100% - var(--notch-depth) - var(--frame-thickness) - var(--frame-padding)) calc(50% - var(--notch-width)/2 + var(--notch-chamfer)),
          calc(100% - var(--notch-depth) - var(--frame-thickness) - var(--frame-padding)) calc(50% + var(--notch-width)/2 - var(--notch-chamfer)),
          calc(100% - var(--frame-thickness) - var(--frame-padding)) calc(50% + var(--notch-width)/2),
          calc(100% - var(--frame-thickness) - var(--frame-padding)) calc(100% - var(--corner-chamfer) - var(--frame-thickness) - var(--frame-padding)),
          calc(100% - var(--corner-chamfer) - var(--frame-thickness) - var(--frame-padding)) calc(100% - var(--frame-thickness) - var(--frame-padding)),
          calc(50% + var(--notch-width)/2) calc(100% - var(--frame-thickness) - var(--frame-padding)),
          calc(50% + var(--notch-width)/2 - var(--notch-chamfer)) calc(100% - var(--notch-depth) - var(--frame-thickness) - var(--frame-padding)),
          calc(50% - var(--notch-width)/2 + var(--notch-chamfer)) calc(100% - var(--notch-depth) - var(--frame-thickness) - var(--frame-padding)),
          calc(50% - var(--notch-width)/2) calc(100% - var(--frame-thickness) - var(--frame-padding)),
          calc(var(--corner-chamfer) + var(--frame-thickness) + var(--frame-padding)) calc(100% - var(--frame-thickness) - var(--frame-padding)),
          calc(var(--frame-thickness) + var(--frame-padding)) calc(100% - var(--corner-chamfer) - var(--frame-thickness) - var(--frame-padding)),
          calc(var(--frame-thickness) + var(--frame-padding)) calc(50% + var(--notch-width)/2),
          calc(var(--notch-depth) + var(--frame-thickness) + var(--frame-padding)) calc(50% + var(--notch-width)/2 - var(--notch-chamfer)),
          calc(var(--notch-depth) + var(--frame-thickness) + var(--frame-padding)) calc(50% - var(--notch-width)/2 + var(--notch-chamfer)),
          calc(var(--frame-thickness) + var(--frame-padding)) calc(50% - var(--notch-width)/2)
        )`,
              borderRadius: "calc(var(--edge-radius) - 2px)",
            }}
          />
        </div>
      </div>
    </div>
  )
}
