import { Hash } from "lucide-react"
import { cn } from "../_utils/cn"

interface TagBreadcrumbProps {
  className?: string
  tags?: Array<{ name: string; href: string; count?: number }>
}

export function Breadcrumb({
  className,
  tags = [
    { name: "design", href: "#", count: 128 },
    { name: "ui", href: "#", count: 86 },
    { name: "ux", href: "#", count: 54 },
    { name: "inspiration", href: "#", count: 32 },
  ],
}: TagBreadcrumbProps) {
  return (
    <div
      className={cn("p-2 sm:p-3 rounded-xl bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100", className)}
    >
      <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto scrollbar-hide">
        <Hash className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 text-gray-600 dark:text-zinc-400" />
        <div className="flex flex-wrap gap-1 sm:gap-2">
          {tags.map((tag) => (
            <a
              key={tag.name}
              href={tag.href}
              className="inline-flex items-center rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-[10px] sm:text-xs font-medium bg-gray-200 dark:bg-zinc-800 text-gray-800 dark:text-zinc-200 hover:bg-gray-300 dark:hover:bg-zinc-700"
            >
              <span className="truncate max-w-[80px] sm:max-w-none">{tag.name}</span>
              {tag.count !== undefined && (
                <span className="ml-1 sm:ml-1.5 inline-flex items-center justify-center rounded-full px-1 sm:px-1.5 py-0.5 text-[8px] sm:text-xs bg-gray-300 dark:bg-zinc-700 text-gray-700 dark:text-zinc-300">
                  {tag.count}
                </span>
              )}
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}
