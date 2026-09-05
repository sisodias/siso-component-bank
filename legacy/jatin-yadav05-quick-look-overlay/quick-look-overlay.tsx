"use client"

import { cn } from "../_utils/cn"
import { useRef, useEffect } from "react"

type Props = {
  items: PreviewItem[]
  onOpen: (index: number) => void
}

export function PreviewGrid({ items, onOpen }: Props) {
  return (
    <ul className={cn("grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4", "list-none p-0 m-0")}>
      {items.map((item, i) => (
        <li key={item.id} className="m-0">
          <button
            type="button"
            onClick={() => onOpen(i)}
            onKeyDown={(e) => {
              // Space to open preview without scrolling the page
              if (e.key === " " || e.code === "Space") {
                e.preventDefault()
                onOpen(i)
              }
            }}
            className={cn(
              "group w-full overflow-hidden rounded-lg border border-border",
              "bg-card text-card-foreground",
              "focus:outline-none focus:ring-2 focus:ring-ring",
            )}
            aria-label={`Preview ${item.title}`}
          >
            <div className="aspect-[4/3] w-full bg-muted dark:bg-muted flex items-center justify-center">
              {item.kind === "image" && item.src ? (
                <img
                  src={item.src || "/placeholder.svg"}
                  alt={item.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]"
                />
              ) : item.kind === "code" ? (
                <div className="w-full h-full p-3 text-xs text-left overflow-hidden">
                  <pre className="max-h-full overflow-hidden text-ellipsis">
                    <code>{item.title}</code>
                  </pre>
                </div>
              ) : item.kind === "text" ? (
                <div className="w-full h-full p-3 text-sm text-pretty leading-relaxed">{item.title}</div>
              ) : item.kind === "video" ? (
                <div className="w-full h-full p-3 text-xs text-muted-foreground">Video: {item.title}</div>
              ) : (
                <div className="w-full h-full p-3 text-xs text-muted-foreground">{item.title}</div>
              )}
            </div>
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-sm font-medium text-pretty">{item.title}</span>
              <span className="text-xs text-muted-foreground">Space ▸ Quick Look</span>
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}



type PreviewItem = {
  id: string
  title: string
  kind: "image" | "code" | "video" | "text"
  src?: string
  content?: string
}

type QuickProps = {
  open: boolean
  item: PreviewItem | null
  index: number
  total: number
  onClose: () => void
  onPrev: () => void
  onNext: () => void
}

export function QuickLookOverlay({ open, item, index, total, onClose, onPrev, onNext }: QuickProps) {
  const closeBtnRef = useRef<HTMLButtonElement | null>(null)

  // Keyboard controls when overlay is open
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowLeft") {
        e.preventDefault()
        onPrev()
      } else if (e.key === "ArrowRight") {
        e.preventDefault()
        onNext()
      } else if (e.key === " ") {
        // Space toggles Quick Look (close)
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener("keydown", onKey)
    // Focus the close button for accessibility
    const id = window.setTimeout(() => closeBtnRef.current?.focus(), 0)

    return () => {
      window.clearTimeout(id)
      document.removeEventListener("keydown", onKey)
    }
  }, [open, onClose, onPrev, onNext])

  if (!open || !item) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center",
        "bg-background/80 backdrop-blur-sm dark:bg-black/70",
      )}
      aria-hidden={!open}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label={`${item.title} quick preview`}
        className={cn(
          "relative w-[92vw] max-w-5xl max-h-[86vh]",
          "rounded-lg border border-border bg-card text-foreground",
          "shadow-lg",
        )}
      >
        {/* Toolbar */}
        <header
          className={cn(
            "flex items-center justify-between px-4 py-2",
            "border-b border-border bg-secondary text-secondary-foreground rounded-t-lg dark:bg-secondary dark:text-secondary-foreground",
          )}
        >
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium">{item.title}</span>
            <span className="text-xs text-muted-foreground">
              {index + 1} / {total}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <kbd
              className={cn(
                "rounded-md border border-border px-1.5 py-0.5 text-xs",
                "bg-background text-foreground dark:bg-muted/40",
              )}
              aria-hidden="true"
            >
              ← →
            </kbd>
            <span className="text-xs text-muted-foreground" aria-hidden="true">
              navigate
            </span>
            <kbd
              className={cn(
                "rounded-md border border-border px-1.5 py-0.5 text-xs",
                "bg-background text-foreground dark:bg-muted/40",
              )}
              aria-hidden="true"
            >
              Space
            </kbd>
            <span className="text-xs text-muted-foreground" aria-hidden="true">
              close
            </span>
            <button
              ref={closeBtnRef}
              type="button"
              onClick={onClose}
              className={cn(
                "ml-2 rounded-md border border-border px-2 py-1 text-xs",
                "bg-background hover:bg-accent hover:text-accent-foreground",
                "dark:bg-muted/20 dark:hover:bg-accent dark:hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring",
              )}
              aria-label="Close preview"
            >
              Close
            </button>
          </div>
        </header>

        {/* Content */}
        <div className="p-4 overflow-auto max-h-[calc(86vh-44px)]">
          {item.kind === "image" && item.src ? (
            <div className="flex items-center justify-center">
              <img
                src={item.src || "/placeholder.svg"}
                alt={item.title}
                className="h-auto max-h-[70vh] w-auto max-w-[90%] rounded-lg border border-border"
              />
            </div>
          ) : item.kind === "code" && item.content ? (
            <pre
              className={cn(
                "rounded-lg border border-border bg-muted dark:bg-muted p-4",
                "text-sm leading-6 overflow-auto",
              )}
            >
              <code>{item.content}</code>
            </pre>
          ) : item.kind === "text" && item.content ? (
            <article className="prose max-w-none dark:prose-invert">
              <p className="text-pretty leading-relaxed">{item.content}</p>
            </article>
          ) : item.kind === "video" && item.src ? (
            <div className="flex items-center justify-center">
              <video
                src={item.src}
                controls
                className="h-auto max-h-[70vh] w-auto max-w-[90%] rounded-lg border border-border"
              />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Nothing to preview for this item.</p>
          )}
        </div>

        {/* Bottom nav */}
        <footer
          className={cn(
            "flex items-center justify-between px-4 py-2",
            "border-t border-border bg-secondary text-secondary-foreground rounded-b-lg dark:bg-secondary dark:text-secondary-foreground",
          )}
        >
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onPrev}
              className={cn(
                "rounded-md border border-border px-2 py-1 text-xs",
                "bg-background hover:bg-accent hover:text-accent-foreground",
                "dark:bg-muted/20 dark:hover:bg-accent dark:hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring",
              )}
              aria-label="Previous"
            >
              ← Prev
            </button>
            <button
              type="button"
              onClick={onNext}
              className={cn(
                "rounded-md border border-border px-2 py-1 text-xs",
                "bg-background hover:bg-accent hover:text-accent-foreground",
                "dark:bg-muted/20 dark:hover:bg-accent dark:hover:text-accent-foreground",
                "focus:outline-none focus:ring-2 focus:ring-ring",
              )}
              aria-label="Next"
            >
              Next →
            </button>
          </div>
          <div className="text-xs text-muted-foreground">Tip: Focus an item and press Space</div>
        </footer>
      </section>
    </div>
  )
}
