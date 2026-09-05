import { cva } from "class-variance-authority"
import { Star } from "lucide-react"

import { cn } from "../_utils/cn"

interface StarRatingProps {
  ratingScale: number
  value?: number
  readonly?: boolean
  size?: "sm" | "md" | "lg"
  onRatingChange?: (rating: number) => void
}

const starRatingVariants = cva("transition-all duration-150", {
  variants: {
    size: {
      sm: "size-3.5",
      md: "size-5",
      lg: "size-8",
    },
  },
  defaultVariants: {
    size: "md",
  },
})

export function StarRating({
  ratingScale,
  readonly,
  size = "md",
  onRatingChange,
  value,
  className,
  ...props
}: React.ComponentProps<"svg"> & StarRatingProps) {
  const onRatingChangeHandler = (index: number) => {
    if (readonly) {
      return
    }

    onRatingChange?.(index + 1)
  }

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: ratingScale }).map((_, index) => (
        <Star
          role="button"
          onClick={() => onRatingChangeHandler(index)}
          data-slot="star"
          type="button"
          key={index}
          className={cn(
            starRatingVariants({ size }),
            {
              "fill-current": value && index < value,
              "cursor-pointer hover:scale-110": !readonly,
            },
            className,
          )}
          {...props}
        />
      ))}
    </div>
  )
}
