import type { ComponentProps } from "react"

function cn(...c: (string|undefined|null|boolean)[]) { return c.filter(Boolean).join(" ") }

export type ScrollFadeEffectProps = ComponentProps<"div"> & {
  /** Scroll direction. @defaultValue "vertical" */
  orientation?: "horizontal" | "vertical"
}

export function ScrollFadeEffect({
  className,
  orientation = "vertical",
  style,
  ...props
}: ScrollFadeEffectProps) {
  const isH = orientation === "horizontal"
  const mask = isH
    ? "linear-gradient(to right, transparent 0px, black 32px, black calc(100% - 32px), transparent 100%)"
    : "linear-gradient(to bottom, transparent 0px, black 32px, black calc(100% - 32px), transparent 100%)"
  return (
    <div
      className={cn(isH ? "overflow-x-auto" : "overflow-y-auto", className)}
      style={{ maskImage: mask, WebkitMaskImage: mask, ...style }}
      {...props}
    />
  )
}
