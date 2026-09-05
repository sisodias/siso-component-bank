"use client"

import type * as React from "react"
import { motion } from "framer-motion"

export interface MenuItem {
  icon: React.ReactNode
  label: string
  href: string
  color: "primary" | "orange" | "green" | "red"
}

const colorMap = {
  primary: "hsl(var(--primary))",
  orange: "hsl(var(--orange))",
  green: "hsl(var(--green))",
  red: "hsl(var(--destructive))",
}

export function MenuBar({ items }: { items: MenuItem[] }) {
  const itemVariants = {
    initial: { rotateX: 0, opacity: 1 },
    hover: { rotateX: -90, opacity: 0 },
  }

  const backVariants = {
    initial: { rotateX: 90, opacity: 0 },
    hover: { rotateX: 0, opacity: 1 },
  }

  const glowVariants = {
    initial: { opacity: 0, scale: 0.8 },
    hover: {
      opacity: 1,
      scale: 2,
      transition: {
        opacity: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
        scale: { duration: 0.5, type: "spring", stiffness: 300, damping: 25 },
      },
    },
  }

  const navGlowVariants = {
    initial: { opacity: 0 },
    hover: {
      opacity: 1,
      transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] },
    },
  }

  const sharedTransition = {
    type: "spring",
    stiffness: 100,
    damping: 20,
    duration: 0.5,
  }

  return (
    <motion.nav
      className="p-2 rounded-2xl bg-gradient-to-b from-background/80 to-background/40 backdrop-blur-lg border border-border/40 shadow-lg relative overflow-hidden"
      initial="initial"
      whileHover="hover"
    >
      {/* Outer hover glow — theme safe */}
      <motion.div
        className="absolute -inset-2 bg-gradient-radial from-transparent via-primary/20 to-transparent rounded-3xl z-0 pointer-events-none"
        variants={navGlowVariants}
      />

      <ul className="flex items-center gap-2 relative z-10">
        {items.map((item) => {
          const themeColor = colorMap[item.color]

          return (
            <motion.li key={item.label} className="relative">
              <motion.div
                className="block rounded-xl overflow-visible group relative"
                style={{ perspective: "600px" }}
                whileHover="hover"
                initial="initial"
              >
                {/* Glow behind item — now theme variable based */}
                <motion.div
                  className="absolute inset-0 z-0 pointer-events-none rounded-xl"
                  variants={glowVariants}
                  style={{
                    background: `radial-gradient(circle,
                      ${themeColor} / 0.20 0%,
                      ${themeColor} / 0.08 50%,
                      transparent 100%)`,
                  }}
                />

                {/* Front face */}
                <motion.a
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 relative z-10 bg-transparent text-muted-foreground group-hover:text-foreground transition-colors rounded-xl"
                  variants={itemVariants}
                  transition={sharedTransition}
                  style={{ transformStyle: "preserve-3d", transformOrigin: "center bottom" }}
                >
                  <span
                    className="transition-colors duration-300"
                    style={{ color: themeColor }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </motion.a>

                {/* Back face */}
                <motion.a
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2 absolute inset-0 z-10 bg-transparent text-muted-foreground group-hover:text-foreground transition-colors rounded-xl"
                  variants={backVariants}
                  transition={sharedTransition}
                  style={{
                    transformStyle: "preserve-3d",
                    transformOrigin: "center top",
                    rotateX: 90,
                  }}
                >
                  <span
                    className="transition-colors duration-300"
                    style={{ color: themeColor }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </motion.a>
              </motion.div>
            </motion.li>
          )
        })}
      </ul>
    </motion.nav>
  )
}
