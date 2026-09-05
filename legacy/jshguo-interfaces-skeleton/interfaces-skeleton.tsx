import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../_utils/cn"

const skeletonVariants = cva("animate-pulse rounded-md bg-accent", {
  variants: {
    variant: {
      avatar: "rounded-full size-16",
      title: "h-6 w-40",
      text: "w-80 h-4 space-y-2",
      media: "aspect-video w-80",
    },
  },
  defaultVariants: {
    variant: "text",
  },
})

export interface SkeletonProps
  extends React.HTMLAttributes<HTMLDivElement>,
  VariantProps<typeof skeletonVariants> { }

function Skeleton({ className, variant, ...props }: SkeletonProps) {
  if (variant === "text") {
    return (
      <div className={cn(skeletonVariants({ variant: "text" }), className)}>
        <div className={cn(skeletonVariants({ variant: "text" }), "w-full h-4")} />
        <div className={cn(skeletonVariants({ variant: "text" }), "w-3/4 h-4")} />
      </div>
    )
  }

  return (
    <div
      data-slot="skeleton"
      className={cn(skeletonVariants({ variant, className }))}
      {...props}
    />
  )
}

export { Skeleton, skeletonVariants }
