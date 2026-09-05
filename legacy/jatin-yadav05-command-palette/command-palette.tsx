"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Search, Command } from "lucide-react"
import { cn } from "../_utils/cn"

interface CommandPaletteProps {
  placeholder?: string
  onSearch?: (query: string) => void
  className?: string
}

export function CommandPalette({
  placeholder = "Search or type a command...",
  onSearch,
  className,
}: CommandPaletteProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  // Handle keyboard shortcut (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
        setQuery("")
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSearch?.(query)
    setIsOpen(false)
    setQuery("")
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsOpen(false)
      setQuery("")
    }
  }

  return (
    <>
      <div className="min-h-screen w-full bg-background flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-foreground">Command Palette</h1>
            <p className="text-sm text-muted-foreground">Professional search with keyboard shortcuts</p>
          </div>

          <div className="space-y-4 flex justify-center items-center">
            {/* Trigger Button */}
            <button
              onClick={() => setIsOpen(true)}
              className={cn(
                "flex items-center min-w-64 gap-2 px-3 py-2 text-sm",
                "border border-border rounded-lg bg-background",
                "hover:border-ring/40 hover:bg-muted/50",
                "transition-all duration-200",
                "text-muted-foreground",
                className,
              )}
            >
              <Search className="h-4 w-4" />
              <span>Search...</span>
              <div className="ml-auto flex items-center gap-1">
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                  <Command className="h-3 w-3" />K
                </kbd>
              </div>
            </button>
          </div>

          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Press{" "}
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground bg-muted border border-border rounded-lg">
                ⌘K
              </kbd>{" "}
              or{" "}
              <kbd className="px-1.5 py-0.5 text-xs font-semibold text-foreground bg-muted border border-border rounded-lg">
                Ctrl+K
              </kbd>{" "}
              to open search
            </p>
          </div>
        </div>
      </div>

      {/* Modal Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm" onClick={handleBackdropClick}>
          <div className="fixed left-1/2 top-1/4 -translate-x-1/2 w-full max-w-lg">
            <div className="mx-4 rounded-lg border bg-background shadow-2xl">
              <form onSubmit={handleSubmit}>
                <div className="flex items-center border-b px-3">
                  <Search className="h-4 w-4 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder={placeholder}
                    className="flex h-12 w-full bg-transparent px-3 py-3 text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                    ESC
                  </kbd>
                </div>

                {/* Results area - can be extended */}
                <div className="max-h-80 overflow-y-auto p-2">
                  {query ? (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">Press Enter to search for "{query}"</div>
                  ) : (
                    <div className="px-2 py-1.5 text-sm text-muted-foreground">Type to search...</div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
