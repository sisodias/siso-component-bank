"use client"

import { useState, useEffect, useCallback, type ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../_utils/cn"

export interface CommandItem {
  id: string
  icon: ReactNode
  label: string
  shortcut?: string
  onClick?: () => void
}

export interface CircularCommandMenuProps {
  items?: CommandItem[]
  trigger?: ReactNode
  className?: string
  radius?: number
  onSelect?: (item: CommandItem) => void
}

function Component({
  items = [],
  trigger,
  className,
  radius = 120,
  onSelect,
}: CircularCommandMenuProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)

  // Defensive check for items
  const safeItems = items || []
  const itemCount = safeItems.length

  const angleStep = itemCount > 0 ? 360 / itemCount : 0
  const startAngle = -90 // Start from top

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen || itemCount === 0) return

      switch (e.key) {
        case "ArrowRight":
        case "ArrowDown":
          e.preventDefault()
          setActiveIndex((prev) => (prev + 1) % itemCount)
          break
        case "ArrowLeft":
        case "ArrowUp":
          e.preventDefault()
          setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount)
          break
        case "Enter":
          e.preventDefault()
          const selectedItem = safeItems[activeIndex]
          if (selectedItem) {
            selectedItem.onClick?.()
            onSelect?.(selectedItem)
          }
          setIsOpen(false)
          break
        case "Escape":
          e.preventDefault()
          setIsOpen(false)
          break
      }
    },
    [isOpen, activeIndex, safeItems, itemCount, onSelect],
  )

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const getItemPosition = (index: number) => {
    const angle = ((startAngle + index * angleStep) * Math.PI) / 180
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    }
  }

  return (
    <div className={cn("relative inline-flex", className)}>
      {/* Trigger */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative z-20 flex h-14 w-14 items-center justify-center rounded-full",
          "bg-primary text-primary-foreground shadow-lg",
          "hover:bg-primary/90 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
        )}
        whileTap={{ scale: 0.95 }}
        aria-expanded={isOpen}
        aria-haspopup="menu"
      >
        <motion.div animate={{ rotate: isOpen ? 45 : 0 }} transition={{ duration: 0.2 }}>
          {trigger || (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          )}
        </motion.div>
      </motion.button>

      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-10 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Menu Items */}
      <AnimatePresence>
        {isOpen && itemCount > 0 && (
          <div className="absolute left-1/2 top-1/2 z-20" role="menu">
            {safeItems.map((item, index) => {
              const position = getItemPosition(index)
              const isActive = activeIndex === index

              return (
                <motion.button
                  key={item.id}
                  initial={{
                    opacity: 0,
                    x: 0,
                    y: 0,
                    scale: 0,
                  }}
                  animate={{
                    opacity: 1,
                    x: position.x - 24,
                    y: position.y - 24,
                    scale: 1,
                  }}
                  exit={{
                    opacity: 0,
                    x: 0,
                    y: 0,
                    scale: 0,
                  }}
                  transition={{
                    type: "spring",
                    stiffness: 400,
                    damping: 25,
                    delay: index * 0.05,
                  }}
                  onClick={() => {
                    item.onClick?.()
                    onSelect?.(item)
                    setIsOpen(false)
                  }}
                  onMouseEnter={() => setActiveIndex(index)}
                  className={cn(
                    "absolute flex h-12 w-12 items-center justify-center rounded-full",
                    "border border-border bg-card shadow-lg",
                    "transition-colors hover:bg-secondary",
                    isActive && "ring-2 ring-primary bg-secondary",
                  )}
                  role="menuitem"
                  aria-label={item.label}
                >
                  <div className="text-foreground">{item.icon}</div>

                  {/* Tooltip */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{
                      opacity: isActive ? 1 : 0,
                      scale: isActive ? 1 : 0.9,
                    }}
                    className="absolute left-full ml-3 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground shadow-md border border-border"
                  >
                    <span>{item.label}</span>
                    {item.shortcut && <span className="ml-2 text-muted-foreground">{item.shortcut}</span>}
                  </motion.div>
                </motion.button>
              )
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  )
}

export { Component }
export type { CircularCommandMenuProps, CommandItem } 