"use client"

import * as React from "react"
import { cn } from "../_utils/cn"
import { Button } from "./button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip"
import { motion, AnimatePresence } from "framer-motion"
import { Home, Search, Bell, User, Settings } from "lucide-react"

interface DockMorphProps {
  className?: string
  items?: {
    icon: React.ComponentType<{ className?: string }>
    label: string
    onClick?: () => void
  }[]
  position?: "bottom" | "top" | "left"
}

export default function DockMorph({ items, className, position = "bottom" }: DockMorphProps) {
  const [hovered, setHovered] = React.useState<number | null>(null)

  const dockItems =
    items && items.length > 0
      ? items
      : [
          { icon: Home, label: "Home", onClick: () => alert("Home clicked") },
          { icon: Search, label: "Search", onClick: () => alert("Search clicked") },
          { icon: Bell, label: "Notifications", onClick: () => alert("Notifications clicked") },
          { icon: User, label: "Profile", onClick: () => alert("Profile clicked") },
          { icon: Settings, label: "Settings", onClick: () => alert("Settings clicked") },
        ]

  // Position classes
  const positionClasses = {
    bottom: "fixed bottom-6 left-1/2 -translate-x-1/2",
    top: "fixed top-6 left-1/2 -translate-x-1/2",
    left: "fixed left-6 top-1/2 -translate-y-1/2 flex-col",
  }

  return (
    <div
      className={cn(
        "z-50 flex items-center justify-center",
        positionClasses[position],
        className
      )}
    >
      <TooltipProvider delayDuration={100}>
        <div
          className={cn(
            "relative flex items-center gap-6 p-3 rounded-3xl",
            position === "left" ? "flex-col gap-4 px-4 py-8" : "flex-row",
            "bg-background/30 backdrop-blur-xl shadow-lg border",
            "dark:border-white/10 border-black/10"
          )}
        >
          {dockItems.map((item, i) => (
            <Tooltip key={item.label}>
              <TooltipTrigger asChild>
                <div
                  className="relative flex items-center justify-center"
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                >
                  {/* Morphic glass bubble */}
                  <AnimatePresence>
                    {hovered === i && (
                      <motion.div
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1.4, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{
                          type: "spring",
                          stiffness: 200,
                          damping: 20,
                        }}
                        className={cn(
                          "absolute inset-0 rounded-full -z-10",
                          "bg-gradient-to-tr from-primary/40 via-primary/20 to-transparent",
                          "backdrop-blur-2xl",
                          "shadow-md dark:shadow-primary/20"
                        )}
                      />
                    )}
                  </AnimatePresence>

                  {/* Icon button */}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="relative z-10 rounded-full hover:scale-110 transition-transform"
                    onClick={item.onClick}
                  >
                    <item.icon className="h-6 w-6" />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent
                side={position === "left" ? "right" : "top"}
                className="text-xs"
              >
                {item.label}
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
    </div>
  )
}
