"use client"
import { X } from "lucide-react"
import { cn } from "../_utils/cn"

interface FilterBreadcrumbProps {
  className?: string
  filters?: Array<{ id: string; name: string; value: string }>
  onRemove?: (id: string) => void
}

export function Breadcrumb({
  className,
  filters = [
    { id: "category", name: "Category", value: "Electronics" },
    { id: "price", name: "Price", value: "$100-$200" },
    { id: "color", name: "Color", value: "Black" },
  ],
  onRemove = () => {},
}: FilterBreadcrumbProps) {
  return (
    <div
      className={cn("p-2 sm:p-3 rounded-xl bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100", className)}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
        <span className="text-xs sm:text-sm font-medium whitespace-nowrap">Filters:</span>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 w-full">
          {filters.map((filter) => (
            <span
              key={filter.id}
              className="inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200"
            >
              <span className="truncate max-w-[100px] sm:max-w-none">
                {filter.name}: {filter.value}
              </span>
              <button
                type="button"
                className="ml-1 inline-flex h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 items-center justify-center rounded-full hover:bg-gray-300 dark:hover:bg-zinc-700 hover:text-gray-900 dark:hover:text-zinc-100 focus:outline-none"
                onClick={() => onRemove(filter.id)}
              >
                <X className="h-2 w-2 sm:h-3 sm:w-3" />
                <span className="sr-only">Remove {filter.name} filter</span>
              </button>
            </span>
          ))}
          <button className="text-[10px] sm:text-xs underline text-gray-600 dark:text-zinc-400 whitespace-nowrap">
            Clear all
          </button>
        </div>
      </div>
    </div>
  )
}
