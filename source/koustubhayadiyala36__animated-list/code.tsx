"use client"

import React, { useEffect, useState, ReactNode } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface AnimatedListProps {
  items: string[]
  renderItem: (item: string, index: number) => ReactNode
  className?: string
}

export function AnimatedList({
  items,
  renderItem,
  className,
}: AnimatedListProps) {
  return (
    <div className={cn("w-full", className)}>
      <AnimatePresence>
        {items.map((item, index) => (
          <motion.div
            key={item}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -10, opacity: 0 }}
            transition={{ delay: index * 0.06 }}
          >
            {renderItem(item, index)}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
