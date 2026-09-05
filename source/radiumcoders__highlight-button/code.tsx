import * as React from "react"
import { cn } from "@/lib/utils"
import { Button, type buttonVariants } from "@/components/ui/button"
import type { VariantProps } from "class-variance-authority"

interface HighlightButtonProps
  extends React.ComponentProps<"button">,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  highlightColor?: string
  highlightSize?: number
  borderColor?: string
}

function HighlightButton({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  highlightColor = "color-mix(in oklab, currentColor 55%, transparent)",
  highlightSize = 56,
  borderColor = "color-mix(in oklab, currentColor 58%, transparent)",
  children,
  onClick,
  ...props
}: HighlightButtonProps) {
  const buttonRef = React.useRef<HTMLButtonElement>(null)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const [isHovering, setIsHovering] = React.useState(false)
  const [isClicked, setIsClicked] = React.useState(false)
  const [clickPosition, setClickPosition] = React.useState({ x: 0, y: 0 })

  const handleMouseMove = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current || isClicked) return
      const rect = buttonRef.current.getBoundingClientRect()
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      })
    },
    [isClicked]
  )

  const handleMouseEnter = React.useCallback(() => {
    setIsHovering(true)
  }, [])

  const handleMouseLeave = React.useCallback(() => {
    setIsHovering(false)
    setIsClicked(false)
  }, [])

  const handleClick = React.useCallback(
    (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!buttonRef.current) return
      const rect = buttonRef.current.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      setClickPosition({ x, y })
      setIsClicked(true)
      onClick?.(e)
    },
    [onClick]
  )

  return (
    <Button
      ref={buttonRef}
      variant={variant}
      size={size}
      asChild={asChild}
      className={cn(
        "relative overflow-hidden px-6 py-5 shadow-sm transition-[border-color,box-shadow,transform]",
        className
      )}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{
        borderColor: isHovering ? borderColor : undefined,
        borderWidth: isHovering ? "1px" : undefined,
      }}
      {...props}
    >
      {isHovering && !isClicked && (
        <div
          className="pointer-events-none absolute rounded-full transition-transform duration-100 ease-out"
          style={{
            left: position.x,
            top: position.y,
            width: highlightSize,
            height: highlightSize,
            backgroundColor: highlightColor,
            transform: "translate(-50%, -50%)",
            opacity: isHovering ? 1 : 0,
            filter: "blur(24px)",
          }}
        />
      )}

      <div className="pointer-events-none absolute inset-0 rounded-md bg-current/[0.04]" />

      {isClicked && (
        <div
          className="pointer-events-none absolute rounded-full"
          style={{
            left: clickPosition.x,
            top: clickPosition.y,
            backgroundColor: highlightColor,
            transform: "translate(-50%, -50%)",
            animation: "highlight-button-ripple 0.6s ease-out forwards",
          }}
        />
      )}

      <span className="relative z-10 inline-flex items-center justify-center text-inherit [&>p]:!m-0 [&>p]:!inline [&>p]:!text-sm [&>p]:!font-medium [&>p]:!leading-none [&>p]:!text-inherit">
        {children}
      </span>
    </Button>
  )
}

export { HighlightButton, type HighlightButtonProps }

export default HighlightButton
