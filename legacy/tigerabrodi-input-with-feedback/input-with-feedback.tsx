import * as React from "react"
import { cn } from "../_utils/cn"
import { Input } from "./input"

export interface InputWithFeedbackProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  errorMessage?: string
  isError?: boolean
  helperText?: string
}

const InputWithFeedback = React.forwardRef<HTMLInputElement, InputWithFeedbackProps>(
  ({ className, errorMessage, helperText, isError, ...props }, ref) => {
    return (
      <div className="relative w-full">
        <Input
          className={cn(
            "w-full",
            className,
            isError && "border-destructive focus-visible:ring-destructive"
          )}
          ref={ref}
          {...props}
        />
        
        {isError && errorMessage && (
          <p className="absolute -bottom-6 text-xs text-destructive">
            {errorMessage}
          </p>
        )}

        {!isError && helperText && (
          <p className="absolute -bottom-6 text-xs text-muted-foreground">
            {helperText}
          </p>
        )}
      </div>
    )
  }
)
InputWithFeedback.displayName = "InputWithFeedback"

export { InputWithFeedback }