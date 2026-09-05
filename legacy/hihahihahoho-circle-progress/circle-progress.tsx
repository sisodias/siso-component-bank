import { cn } from "../_utils/cn"
import React from "react"

export interface CircleProgressProps
  extends React.HtmlHTMLAttributes<HTMLDivElement> {
  value: number
  maxValue: number
  size?: number
  strokeWidth?: number
  showValue?: boolean
  description?: React.ReactNode
  suffix?: string
  counterClockwise?: boolean
  onColorChange?: (color: string) => void
  onValueChange?: (value: number, percentage: number) => void
  // Custom color function
  getColor?: (fillPercentage: number) => string
  // Add className prop for styling
  className?: string
  // Animation duration in ms
  animationDuration?: number
  // Disable animation
  disableAnimation?: boolean
  // Gradient support
  useGradient?: boolean
  // Gradient colors array (from start to end)
  gradientColors?: string[]
  // Optional custom ID for the gradient
  gradientId?: string
}

const CircleProgress = ({
  value,
  maxValue,
  size = 40,
  strokeWidth = 3,
  counterClockwise = false,
  onColorChange,
  onValueChange,
  // New custom color function
  getColor,
  className,
  // Animation duration with default of 300ms
  animationDuration = 300,
  // Option to disable animation
  disableAnimation = false,
  // Gradient options
  useGradient = false,
  gradientColors = ["#10b981", "#f59e0b", "#ef4444"],
  gradientId,
  ...props
}: CircleProgressProps) => {
  // Add state for animated value
  const [animatedValue, setAnimatedValue] = React.useState(
    disableAnimation ? value : 0
  )
  // Use a ref to track the current animation value without causing re-renders
  const animatedValueRef = React.useRef(animatedValue)

  // Generate a unique gradient ID if not provided
  const uniqueGradientId = React.useRef(
    gradientId ||
      `circle-progress-gradient-${Math.random().toString(36).substring(2, 9)}`
  ).current

  // Update ref when state changes
  React.useEffect(() => {
    animatedValueRef.current = animatedValue
  }, [animatedValue])

  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const fillPercentage = Math.min(animatedValue / maxValue, 1)
  const strokeDashoffset = circumference * (1 - fillPercentage)

  // Default color function
  const defaultGetColor = (percentage: number) => {
    if (percentage < 0.7) return "stroke-emerald-500" // Green
    if (percentage < 0.9) return "stroke-amber-500" // Yellow/Orange
    return "stroke-red-500" // Red
  }

  // Use custom color function if provided, otherwise use default
  const currentColor = useGradient
    ? "" // We don't use the color classes with gradient
    : getColor
      ? getColor(fillPercentage)
      : defaultGetColor(fillPercentage)

  // Animation effect - fixed to avoid the dependency loop
  React.useEffect(() => {
    // If animation is disabled, just set the value directly
    if (disableAnimation) {
      setAnimatedValue(value)
      return
    }

    // Start from current animated value using the ref
    const start = animatedValueRef.current
    const end = Math.min(value, maxValue)
    const startTime = performance.now()

    // If we're already at the target value, don't animate
    if (start === end) return

    const animateProgress = (timestamp: number) => {
      const elapsed = timestamp - startTime
      const progress = Math.min(elapsed / animationDuration, 1)

      // Use easeOutQuad for smoother deceleration
      const easeProgress = 1 - (1 - progress) * (1 - progress)
      const currentValue = start + (end - start) * easeProgress

      setAnimatedValue(currentValue)

      if (progress < 1) {
        requestAnimationFrame(animateProgress)
      }
    }

    const animationFrame = requestAnimationFrame(animateProgress)

    return () => cancelAnimationFrame(animationFrame)
  }, [value, maxValue, animationDuration, disableAnimation]) // removed animatedValue from deps

  React.useEffect(() => {
    if (onColorChange) {
      onColorChange(currentColor)
    }
  }, [currentColor, onColorChange])

  React.useEffect(() => {
    if (onValueChange) {
      onValueChange(animatedValue, fillPercentage)
    }
  }, [animatedValue, fillPercentage, onValueChange])

  // Format value text for aria-valuetext - more descriptive for screen readers
  const valueText =
    props["aria-valuetext"] ||
    `${Math.round(value)}${props.suffix ? props.suffix : ""} out of ${maxValue}${props.suffix ? props.suffix : ""}, ${Math.round(fillPercentage * 100)}% complete`

  return (
    <div
      className={cn(className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={maxValue}
      aria-valuetext={valueText}
      {...props}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className={cn("duration-300")}
      >
        {/* SVG Gradient Definition */}
        {useGradient && (
          <defs>
            <linearGradient
              id={uniqueGradientId}
              gradientUnits="userSpaceOnUse"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              {gradientColors.map((color, index) => (
                <stop
                  key={index}
                  offset={`${(index / (gradientColors.length - 1)) * 100}%`}
                  stopColor={color}
                />
              ))}
            </linearGradient>
          </defs>
        )}
        {/* Background track circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="fill-transparent stroke-gray-200 dark:stroke-gray-700"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className={cn(
            "fill-transparent transition-colors",
            !useGradient && currentColor
          )}
          style={
            useGradient ? { stroke: `url(#${uniqueGradientId})` } : undefined
          }
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={
            counterClockwise ? -strokeDashoffset : strokeDashoffset
          }
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}

export { CircleProgress }
