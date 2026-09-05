import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  loadingText?: string
  loadingIconPosition?: 'left' | 'right'
  loadingAnimation?: boolean
  loadingIcon?: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    asChild = false, 
    loading = false, 
    loadingText, 
    loadingIconPosition = 'left', 
    loadingAnimation = false, 
    loadingIcon, 
    children, 
    disabled, 
    ...props 
  }, ref) => {
    const Comp = asChild ? Slot : "button"
    
    // Determine which loading icon to show and where
    const showLoadingLeft = loading && loadingIconPosition === 'left'
    const showLoadingRight = loading && loadingIconPosition === 'right'
    const content = loading && loadingText ? loadingText : children
    const defaultLoadingIcon = loadingIcon || <Loader2 className="animate-spin" />
    
    // Check if this should be an icon-only button (no label/children and loading)
    const hasNoContent = !children && !loadingText
    const isIconOnlyButton = hasNoContent && loading
    
    // Override size to 'icon' when loading without content (like original component)
    const effectiveSize = isIconOnlyButton ? 'icon' : size
    
    // Gradient animation classes - only when loading AND loadingAnimation are both true
    const hasGradientAnimation = loading && loadingAnimation
    const animationClasses = hasGradientAnimation ? 
      "relative overflow-hidden before:content-[''] before:absolute before:top-0 before:left-[-110%] before:w-[110%] before:h-full before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent before:animate-[gradient-slide_1.5s_linear_infinite] before:rounded-r-md" : ""
    
    return (
      <Comp
        className={cn(
          buttonVariants({ variant, size: effectiveSize }),
          animationClasses,
          loading && "pointer-events-none", // Disable interactions when loading
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {/* Content wrapper with z-index to stay above animation */}
        <span className={cn(
          "relative z-10 flex items-center justify-center",
          !isIconOnlyButton && "gap-2", // Only add gap when not icon-only
          loading && "relative" // Ensure proper stacking context
        )}>
          {showLoadingLeft && defaultLoadingIcon}
          {content}
          {showLoadingRight && defaultLoadingIcon}
        </span>
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants } 