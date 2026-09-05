import { HTMLAttributes, forwardRef } from "react"
import { cn } from "@/lib/utils"

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  isPressable?: boolean
  onPress?: () => void
}

const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, isPressable, onPress, children, ...props }, ref) => {
    const handleClick = () => isPressable && onPress?.()
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isPressable && onPress && (e.key === "Enter" || e.key === " ")) {
        e.preventDefault()
        onPress()
      }
    }

    return (
      <div
        ref={ref}
        role={isPressable ? "button" : undefined}
        tabIndex={isPressable ? 0 : undefined}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        className={cn(
          "rounded-2xl border border-zinc-200 bg-white text-zinc-950 shadow-sm transition-all duration-200",
          "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
          isPressable && [
            "cursor-pointer hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700",
            "active:scale-[0.99] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2",
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    )
  }
)
Card.displayName = "Card"

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex flex-col space-y-1.5 p-4", className)} {...props} />
)
CardHeader.displayName = "CardHeader"

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={cn("text-lg font-semibold leading-none tracking-tight", className)} {...props} />
)
CardTitle.displayName = "CardTitle"

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn("text-sm text-zinc-500 dark:text-zinc-400", className)} {...props} />
)
CardDescription.displayName = "CardDescription"

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("p-4 pt-0", className)} {...props} />
)
CardContent.displayName = "CardContent"

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn("flex items-center p-4 pt-0", className)} {...props} />
)
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }
