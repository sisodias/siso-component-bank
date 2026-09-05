"use client"

import * as React from "react"
import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DeleteButtonProps {
  onDelete?: () => void
  onCancel?: () => void
  className?: string
  holdDuration?: number
}

export function DeleteButton({
  onDelete,
  onCancel,
  className,
  holdDuration = 2000,
}: DeleteButtonProps) {
  const [state, setState] = React.useState<"normal" | "holding" | "deleting" | "deleted">("normal")
  const [progress, setProgress] = React.useState(0)
  const [isDeleting, setIsDeleting] = React.useState(false)

  const holdTimerRef = React.useRef<NodeJS.Timeout | null>(null)
  const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = React.useRef<number>(0)

  const handleClick = () => {
    if (state === "normal") {
      setState("holding")
    }
  }

  const startHolding = () => {
    if (state !== "holding") return

    setProgress(0)
    startTimeRef.current = Date.now()

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTimeRef.current
      const newProgress = Math.min((elapsed / holdDuration) * 100, 100)
      setProgress(newProgress)

      if (newProgress >= 100) {
        clearInterval(progressIntervalRef.current!)
      }
    }, 50)

    holdTimerRef.current = setTimeout(() => {
      confirmDelete()
    }, holdDuration)
  }

  const cancelHolding = () => {
    if (state !== "holding") return

    if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

    setState("normal")
    setProgress(0)
    onCancel?.()
  }

  const confirmDelete = () => {
    setState("deleting")
    setIsDeleting(true)
    setProgress(0)

    onDelete?.()

    setTimeout(() => {
      setState("deleted")
      setIsDeleting(false)

      setTimeout(() => {
        setState("normal")
      }, 3000)
    }, 600)
  }

  React.useEffect(() => {
    return () => {
      if (holdTimerRef.current) clearTimeout(holdTimerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [])

  const getButtonText = () => {
    switch (state) {
      case "holding":
        return "Hold to confirm"
      case "deleting":
        return "Deleting..."
      case "deleted":
        return "Deleted!"
      default:
        return "Delete"
    }
  }

  return (
    <div className="inline-flex flex-col items-center gap-4">
      <Button
        variant="destructive"
        className={cn(
          "relative min-w-[160px] overflow-hidden transition-colors",
          state === "holding" && "cursor-grabbing select-none",
          className
        )}
        onClick={handleClick}
        onMouseDown={state === "holding" ? startHolding : undefined}
        onMouseUp={state === "holding" ? cancelHolding : undefined}
        onMouseLeave={state === "holding" ? cancelHolding : undefined}
        onTouchStart={state === "holding" ? startHolding : undefined}
        onTouchEnd={state === "holding" ? cancelHolding : undefined}
        disabled={state === "deleting" || state === "deleted"}
      >
        {state === "holding" && (
          <div className="absolute inset-0 overflow-hidden rounded-md">
            <div
              className="absolute inset-y-0 left-0 bg-destructive/80 transition-all duration-75 ease-linear"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        <div className="relative z-10 flex items-center gap-2">
          <Trash2
            className={cn("h-4 w-4", isDeleting && "animate-trash-shake")}
          />
          <span>{getButtonText()}</span>
        </div>
      </Button>

      {state === "deleted" && (
        <div className="rounded-md border bg-muted p-3 text-sm text-muted-foreground shadow-sm">
          ✓ Item deleted successfully!
        </div>
      )}
    </div>
  )
}
