"use client"

import type React from "react"
import { useState } from "react"
import { cn } from "../_utils/cn"

interface RadioOption {
  id: string
  label: string
  value: string
  color: {
    border: string
    dot: string
    glow: string
    shadow: string
  }
}

interface RadioProps {
  options?: RadioOption[]
  name?: string
  defaultValue?: string
  onChange?: (value: string) => void
  className?: string
}

const defaultOptions: RadioOption[] = [
  {
    id: "helios-blue",
    label: "Helios Blue",
    value: "helios-blue",
    color: {
      border: "border-blue-400",
      dot: "bg-blue-400",
      glow: "shadow-blue-400/50",
      shadow: "shadow-blue-400/20",
    },
  },
  {
    id: "cygnus-magenta",
    label: "Cygnus Magenta",
    value: "cygnus-magenta",
    color: {
      border: "border-fuchsia-400",
      dot: "bg-fuchsia-400",
      glow: "shadow-fuchsia-400/50",
      shadow: "shadow-fuchsia-400/20",
    },
  },
  {
    id: "orion-lime",
    label: "Orion Lime",
    value: "orion-lime",
    color: {
      border: "border-emerald-400",
      dot: "bg-emerald-400",
      glow: "shadow-emerald-400/50",
      shadow: "shadow-emerald-400/20",
    },
  },
]

export default function Radio({
  options = defaultOptions,
  name = "radio-group",
  defaultValue,
  onChange,
  className,
}: RadioProps) {
  const [selectedValue, setSelectedValue] = useState(defaultValue || options[0]?.value)

  const handleChange = (value: string) => {
    setSelectedValue(value)
    onChange?.(value)
  }

  const handleKeyDown = (event: React.KeyboardEvent, value: string) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      handleChange(value)
    }
  }

  return (
    <div
      className={cn(
        "flex items-center justify-center min-h-screen w-full p-5 font-sans bg-gray-100 dark:bg-black",
        className,
      )}
    >
      <div className="backdrop-blur-xl border border-gray-200/20 dark:border-white/5 rounded-3xl p-6 sm:p-8 w-full max-w-sm transition-all duration-300 bg-white/10 dark:bg-zinc-900">
        <div className="space-y-6" role="radiogroup" aria-label="Color theme selection">
          {options.map((option) => {
            const isSelected = selectedValue === option.value

            return (
              <label key={option.id} className="flex items-center cursor-pointer group select-none" htmlFor={option.id}>
                <div className="relative flex items-center justify-center">
                  <input
                    id={option.id}
                    type="radio"
                    name={name}
                    value={option.value}
                    checked={isSelected}
                    onChange={() => handleChange(option.value)}
                    onKeyDown={(e) => handleKeyDown(e, option.value)}
                    className="sr-only"
                    aria-describedby={`${option.id}-description`}
                  />

                  {/* Custom radio button */}
                  <div
                    className={cn(
                      "w-6 h-6 rounded-full border-2 transition-all duration-500 ease-out flex items-center justify-center mr-4 flex-shrink-0",
                      isSelected
                        ? cn(option.color.border, "scale-90")
                        : "border-gray-400 dark:border-slate-500 group-hover:border-gray-600 dark:group-hover:border-slate-400 group-hover:scale-110",
                    )}
                  >
                    {/* Inner dot */}
                    <div
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-300",
                        isSelected ? cn(option.color.dot, "scale-100") : "scale-0 bg-gray-600 dark:bg-slate-400",
                      )}
                    />

                    {/* Animated ring */}
                    {isSelected && (
                      <div
                        className={cn(
                          "absolute w-9 h-9 rounded-full border-2 border-transparent animate-spin",
                          option.color.border,
                          "shadow-lg",
                          option.color.glow,
                        )}
                        style={{
                          borderTopColor: "currentColor",
                          animationDuration: "2s",
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Label text */}
                <span
                  id={`${option.id}-description`}
                  className={cn(
                    "text-lg font-medium transition-colors duration-300",
                    isSelected
                      ? "text-gray-900 dark:text-white font-bold"
                      : "text-gray-600 dark:text-slate-300 group-hover:text-gray-800 dark:group-hover:text-slate-100",
                  )}
                >
                  {option.label}
                </span>
              </label>
            )
          })}
        </div>
      </div>
    </div>
  )
}
