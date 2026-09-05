"use client"

import { useState } from "react"
import { Check, Copy, ArrowUpRight } from "lucide-react"

interface CopyEmailButtonProps {
  email?: string
}

export function CopyEmailButton({ email = "hello@yourname.com" }: CopyEmailButtonProps) {
  const [copied, setCopied] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button
      onClick={handleCopy}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative flex items-center gap-3 px-5 py-3 rounded-full border border-border bg-background text-foreground transition-all duration-300 ease-out hover:border-foreground/30 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.04),0_2px_8px_rgba(0,0,0,0.04)] focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      {/* Icon container with flip animation */}
      <span className="relative flex items-center justify-center w-5 h-5 overflow-hidden">
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            copied ? "translate-y-0 opacity-100" : "-translate-y-full opacity-0"
          }`}
        >
          <Check className="w-4 h-4 text-accent" strokeWidth={2.5} />
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${
            copied ? "translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          <Copy
            className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
            strokeWidth={1.5}
          />
        </span>
      </span>

      {/* Text with slide animation */}
      <span className="relative h-5 overflow-hidden">
        <span
          className={`block text-sm font-medium tracking-tight transition-all duration-300 ${
            copied ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100"
          }`}
        >
          {email}
        </span>
        <span
          className={`absolute inset-0 flex items-center text-sm font-medium tracking-tight text-accent transition-all duration-300 ${
            copied ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
          }`}
        >
          Copied!
        </span>
      </span>

      {/* Arrow indicator */}
      <span
        className={`flex items-center justify-center transition-all duration-300 ${
          isHovered && !copied ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"
        }`}
      >
        <ArrowUpRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
      </span>
    </button>
  )
}
