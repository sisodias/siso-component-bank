"use client"

import { useState, useEffect } from "react"
import { cn } from "../_utils/cn"

interface LegendItem {
  id: string
  name: string
}

interface ScrollLegendProps {
  items: LegendItem[]
  className?: string
}

export function ScrollLegend({ items, className }: ScrollLegendProps) {
  const [activeSection, setActiveSection] = useState<string>("")
  const [isHovered, setIsHovered] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const sections = items.map((item) => document.getElementById(item.id))
      const scrollPosition = window.scrollY + 100

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPosition) {
          setActiveSection(items[i].id)
          break
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Call once to set initial state

    return () => window.removeEventListener("scroll", handleScroll)
  }, [items])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div
      className={cn("fixed left-4 top-1/2 -translate-y-1/2 z-50", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex flex-col space-y-3">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="relative flex items-center cursor-pointer group"
            onClick={() => scrollToSection(item.id)}
          >
            {/* Horizontal line indicator */}
            <div
              className={cn(
                "h-0.5 transition-all duration-200",
                activeSection === item.id
                  ? "w-6 bg-red-500"
                  : "w-4 bg-gray-400 dark:bg-gray-600 group-hover:bg-gray-600 dark:group-hover:bg-gray-400",
              )}
            />

            {/* Section name - only visible on hover */}
            <span
              className={cn(
                "ml-4 text-sm font-medium transition-all duration-200 whitespace-nowrap",
                "text-gray-300 dark:text-gray-400",
                activeSection === item.id && "text-red-500 dark:text-red-400",
                isHovered ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2 pointer-events-none",
              )}
            >
              {item.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
