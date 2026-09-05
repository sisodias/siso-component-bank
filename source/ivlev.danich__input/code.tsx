import { InputHTMLAttributes, ReactNode, forwardRef, useId} from "react"
import { cn } from "@/lib/utils"

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  startContent?: ReactNode
  endContent?: ReactNode
  description?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, description, startContent, endContent, id: providedId, ...props }, ref) => {
    const generatedId = useId()
    const id = providedId || generatedId

    return (
      <div className="flex flex-col gap-1.5">
        {label && <label htmlFor={id} className="text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</label>}
        <div className="relative flex items-center">
          {startContent && <div className="pointer-events-none absolute left-3 flex items-center text-zinc-400">{startContent}</div>}
          <input
            id={id}
            type={type}
            ref={ref}
            aria-invalid={!!error}
            className={cn(
              "flex h-10 w-full rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm transition-colors",
              "placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
              "disabled:cursor-not-allowed disabled:opacity-50",
              "dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-50",
              startContent && "pl-10",
              endContent && "pr-10",
              error && "border-red-500 focus:ring-red-500",
              className
            )}
            {...props}
          />
          {endContent && <div className="absolute right-3 flex items-center">{endContent}</div>}
        </div>
        {description && !error && <p className="text-xs text-zinc-500">{description}</p>}
        {error && <p className="text-xs text-red-500" role="alert">{error}</p>}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
