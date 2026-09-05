import { cn } from "../_utils/cn"
import { ElementType, ComponentPropsWithoutRef } from "react"

interface CosmicGlowButtonProps<T extends ElementType> {
  as?: T
  color?: string
  speed?: string
  className?: string
  children?: React.ReactNode
}

const CosmicGlowButton = <T extends ElementType = "button">({
  as,
  className,
  color,
  speed = "5s",
  children,
  ...props
}: CosmicGlowButtonProps<T> & Omit<ComponentPropsWithoutRef<T>, keyof CosmicGlowButtonProps<T>>) => {
  const Component = as || "button"
  const glowColor = color || "hsl(var(--foreground))"
  const content = children ?? "Click me"

  return (
    <Component
      className={cn(
        "relative inline-flex items-center justify-center py-4 px-8 rounded-2xl font-semibold text-base cursor-pointer",
        "bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900",
        "text-white shadow-lg shadow-[rgba(0,0,0,0.4)]",
        "overflow-hidden",
        className
      )}
      {...props}
    >
      <span
        className="absolute inset-0 rounded-2xl blur-lg opacity-40 animate-glow-scale"
        style={{
          background: `radial-gradient(circle at center, ${glowColor} 10%, transparent 60%)`,
          animationDuration: speed,
          zIndex: 0,
        }}
      />
      <span
        className="absolute inset-0 rounded-2xl opacity-20 animate-glow-slide"
        style={{
          background: `conic-gradient(from 90deg at 50% 50%, transparent 0deg, ${glowColor} 120deg, transparent 240deg)`,
          animationDuration: speed,
          zIndex: 0,
        }}
      />
      <span className="relative z-10">{content}</span>
    </Component>
  )
}

export { CosmicGlowButton }
