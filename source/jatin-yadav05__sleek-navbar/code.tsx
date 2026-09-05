"use client"

import type * as React from "react"
import { motion } from "framer-motion"
import { Home, Settings, Bell, User } from "lucide-react"
import { useTheme } from "next-themes"
import { useState, useRef } from "react"

interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
  iconColor: string
}

const menuItems: MenuItem[] = [
  {
    icon: <Home className="h-5 w-5" />,
    label: "Home",
    href: "#",
    iconColor: "text-blue-500",
  },
  {
    icon: <Bell className="h-5 w-5" />,
    label: "Notifications",
    href: "#",
    iconColor: "text-orange-500",
  },
  {
    icon: <Settings className="h-5 w-5" />,
    label: "Settings",
    href: "#",
    iconColor: "text-green-500",
  },
  {
    icon: <User className="h-5 w-5" />,
    label: "Profile",
    href: "#",
    iconColor: "text-red-500",
  },
]

export function MenuBar() {
  const { theme } = useTheme()
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [tabPositions, setTabPositions] = useState<{ x: number; width: number }[]>([])
  const navRef = useRef<HTMLElement>(null)

  const isDarkTheme = theme === "dark"

  const handleTabHover = (index: number, element: HTMLElement) => {
    const rect = element.getBoundingClientRect()
    const navRect = navRef.current?.getBoundingClientRect()

    if (navRect) {
      const relativeX = rect.left - navRect.left
      setHoveredIndex(index)

      if (tabPositions.length === 0) {
        const positions = Array.from(navRef.current?.querySelectorAll("li") || []).map((li) => {
          const liRect = li.getBoundingClientRect()
          return {
            x: liRect.left - navRect.left,
            width: liRect.width,
          }
        })
        setTabPositions(positions)
      }
    }
  }

  const handleNavLeave = () => {
    setHoveredIndex(null)
  }

  const gradientPosition =
    hoveredIndex !== null && tabPositions[hoveredIndex] ? tabPositions[hoveredIndex] : { x: 0, width: 0 }

  return (
    <motion.nav
      ref={navRef}
      className="p-2 rounded-2xl bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-lg border border-border/40 shadow-lg relative overflow-hidden"
      onMouseLeave={handleNavLeave}
    >
      <motion.div
        className="absolute top-2 bottom-2 pointer-events-none rounded-xl z-0"
        initial={{ opacity: 0, x: 0, width: 0 }}
        animate={{
          opacity: hoveredIndex !== null ? 1 : 0,
          x: gradientPosition.x,
          width: gradientPosition.width,
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
        style={{
          background: isDarkTheme
            ? "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)"
            : "linear-gradient(135deg, rgba(0,0,0,0.11) 0%, rgba(0,0,0,0.09) 100%)",
        }}
      />

      <ul className="flex items-center gap-2 relative z-10">
        {menuItems.map((item, index) => (
          <motion.li key={item.label} className="relative" onMouseEnter={(e) => handleTabHover(index, e.currentTarget)}>
            <motion.a
              href={item.href}
              className="flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent text-muted-foreground hover:text-foreground transition-colors duration-200 rounded-xl"
            >
              <span className={`transition-colors duration-200 hover:${item.iconColor} text-foreground`}>
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </motion.a>
          </motion.li>
        ))}
      </ul>
    </motion.nav>
  )
}
