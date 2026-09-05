"use client"

import { useRef, useState, KeyboardEvent, ClipboardEvent, ChangeEvent } from "react"
import { motion, useAnimationControls } from "framer-motion"
import { cn } from "@/lib/utils"

interface OTPInputProps {
  length?: number
  value: string
  onChange: (val: string) => void
  isError?: boolean
  isValid?: boolean
  disabled?: boolean
  className?: string
}

export function OTPInput({
  length = 6,
  value,
  onChange,
  isError = false,
  isValid = false,
  disabled = false,
  className,
}: OTPInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const controls = useAnimationControls()

  // Shake animation on error
  if (isError) {
    controls.start({
      x: [0, -8, 8, -8, 8, 0],
      transition: { duration: 0.4 },
    })
  }

  const handleChange = (index: number, e: ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value
    if (!/^\d*$/.test(inputValue)) return

    const newValue = value.split("")
    newValue[index] = inputValue
    const updatedValue = newValue.join("")

    onChange(updatedValue)

    // Auto-advance to next input
    if (inputValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      if (!value[index] && index > 0) {
        // Auto-retreat to previous input if current is empty
        inputRefs.current[index - 1]?.focus()
      } else {
        // Clear current input
        const newValue = value.split("")
        newValue[index] = ""
        onChange(newValue.join(""))
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus()
    } else if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedValue = e.clipboardData.getData("text")
    const digits = pastedValue.replace(/\D/g, "").slice(0, length)

    onChange(digits)

    // Focus the next empty input or the last input
    const nextIndex = Math.min(digits.length, length - 1)
    inputRefs.current[nextIndex]?.focus()
  }

  return (
    <motion.div
      className={cn("flex gap-2 justify-center", className)}
      animate={controls}
    >
      {Array.from({ length }).map((_, index) => (
        <motion.input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[index] || ""}
          onChange={(e) => handleChange(index, e)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            "w-12 h-14 text-center text-lg font-semibold border-2 rounded-lg transition-all",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            isError && "border-red-500 focus:ring-red-500",
            isValid && "border-green-500 focus:ring-green-500",
            !isError && !isValid && "border-input focus:ring-ring",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          animate={
            isValid
              ? {
                  scale: [1, 1.08, 1],
                  transition: { duration: 0.3 },
                }
              : {}
          }
        />
      ))}
    </motion.div>
  )
}
