import { ButtonHTMLAttributes, ReactNode, forwardRef } from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl",
    "text-sm font-medium transition-all duration-200",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ],
  {
    variants: {
      variant: {
        solid: "shadow-sm hover:shadow-md",
        bordered: "border-2 bg-transparent",
        light: "bg-transparent",
        flat: "",
        ghost: "bg-transparent",
      },
      color: {
        default: "",
        primary: "",
        secondary: "",
        success: "",
        warning: "",
        danger: "",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4 text-sm",
        lg: "h-12 px-6 text-base",
        icon: "h-10 w-10",
      },
    },
    compoundVariants: [
      { variant: "solid", color: "default", className: "bg-zinc-900 text-white hover:bg-zinc-800 focus-visible:ring-zinc-500 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200" },
      { variant: "solid", color: "primary", className: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500" },
      { variant: "solid", color: "secondary", className: "bg-purple-600 text-white hover:bg-purple-700 focus-visible:ring-purple-500" },
      { variant: "solid", color: "success", className: "bg-green-600 text-white hover:bg-green-700 focus-visible:ring-green-500" },
      { variant: "solid", color: "warning", className: "bg-amber-500 text-white hover:bg-amber-600 focus-visible:ring-amber-500" },
      { variant: "solid", color: "danger", className: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500" },
      { variant: "bordered", color: "default", className: "border-zinc-300 text-zinc-900 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-100 dark:hover:bg-zinc-800" },
      { variant: "bordered", color: "primary", className: "border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950" },
      { variant: "bordered", color: "secondary", className: "border-purple-600 text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950" },
      { variant: "bordered", color: "success", className: "border-green-600 text-green-600 hover:bg-green-50 dark:hover:bg-green-950" },
      { variant: "bordered", color: "warning", className: "border-amber-500 text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950" },
      { variant: "bordered", color: "danger", className: "border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-950" },
      { variant: ["light", "ghost"], color: "default", className: "text-zinc-900 hover:bg-zinc-100 dark:text-zinc-100 dark:hover:bg-zinc-800" },
      { variant: ["light", "ghost"], color: "primary", className: "text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950" },
      { variant: ["light", "ghost"], color: "secondary", className: "text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-950" },
      { variant: ["light", "ghost"], color: "success", className: "text-green-600 hover:bg-green-50 dark:hover:bg-green-950" },
      { variant: ["light", "ghost"], color: "warning", className: "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950" },
      { variant: ["light", "ghost"], color: "danger", className: "text-red-600 hover:bg-red-50 dark:hover:bg-red-950" },
      { variant: "flat", color: "default", className: "bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700" },
      { variant: "flat", color: "primary", className: "bg-blue-100 text-blue-700 hover:bg-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:hover:bg-blue-900/50" },
      { variant: "flat", color: "secondary", className: "bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 dark:hover:bg-purple-900/50" },
      { variant: "flat", color: "success", className: "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400 dark:hover:bg-green-900/50" },
      { variant: "flat", color: "warning", className: "bg-amber-100 text-amber-700 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:hover:bg-amber-900/50" },
      { variant: "flat", color: "danger", className: "bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50" },
    ],
    defaultVariants: { variant: "solid", color: "primary", size: "md" },
  }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  isLoading?: boolean
  startContent?: ReactNode
  endContent?: ReactNode
}

const Spinner = () => (
  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24" aria-hidden="true">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
  </svg>
)

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, color, size, isLoading = false, startContent, endContent, children, disabled, ...props }, ref) => (
    <button ref={ref} className={cn(buttonVariants({ variant, color, size, className }))} disabled={disabled || isLoading} aria-busy={isLoading} {...props}>
      {isLoading ? <Spinner /> : startContent}
      {children}
      {!isLoading && endContent}
    </button>
  )
)
Button.displayName = "Button"

export { Button, buttonVariants }
