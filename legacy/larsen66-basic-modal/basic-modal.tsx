"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useOnClickOutside } from "usehooks-ts"

interface BasicModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl" | "full"
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  full: "max-w-4xl",
}

export default function BasicModal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: BasicModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const modalRef = useRef<HTMLDivElement>(
    null
  ) as React.RefObject<HTMLDivElement>
  useOnClickOutside(modalRef, () => onClose())

  // Закрытие по ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            ref={overlayRef}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => {
              if (e.target === overlayRef.current) {
                onClose()
              }
            }}
          />

          {/* Modal */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 sm:p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className={`${modalSizes[size]} relative mx-auto w-full rounded-xl border border-zinc-800 bg-zinc-900 p-4 shadow-2xl sm:p-6 text-zinc-100`}
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{
                scale: 0.95,
                y: 10,
                opacity: 0,
                transition: { duration: 0.15 },
              }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header */}
              <div className="mb-4 flex items-center justify-between">
                {title && (
                  <h3 className="text-xl font-medium text-zinc-100">{title}</h3>
                )}
                <motion.button
                  className="ml-auto rounded-full p-1.5 text-zinc-400 transition-colors hover:bg-zinc-800 hover:text-zinc-100"
                  onClick={onClose}
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                >
                  <X className="h-5 w-5" />
                  <span className="sr-only">Close</span>
                </motion.button>
              </div>

              {/* Content */}
              <div className="relative text-zinc-200">{children}</div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
