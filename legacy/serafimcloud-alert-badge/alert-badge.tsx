import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "../_utils/cn"
import { IconType } from "@remixicon/react"

const alertBadgeVariants = cva(
  "inline-flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-tremor-label font-medium text-white",
  {
    variants: {
      variant: {
        error: "bg-red-500",
        success: "bg-emerald-500",
        info: "bg-blue-500",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
)

interface AlertBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof alertBadgeVariants> {
  icon?: IconType
  label: string
  action?: {
    label: string
    href: string
    icon?: IconType
  }
}

export function AlertBadge({
  className,
  variant,
  icon: Icon,
  label,
  action,
  ...props
}: AlertBadgeProps) {
  return (
    <span className={cn(alertBadgeVariants({ variant }), className)} {...props}>
      <span className="inline-flex items-center gap-1.5">
        {Icon && <Icon className="size-4" aria-hidden={true} />}
        {label}
      </span>
      {action && (
        <>
          <span
            className={cn(
              "h-5 w-px",
              variant === "error" && "bg-red-400",
              variant === "success" && "bg-emerald-400",
              variant === "info" && "bg-blue-400",
            )}
          />
          <a href={action.href} className="inline-flex items-center gap-1.5">
            {action.label}
            {action.icon && (
              <action.icon className="size-4" aria-hidden={true} />
            )}
          </a>
        </>
      )}
    </span>
  )
}
