"use client"

import type React from "react"

interface LeatherButtonProps {
  children: React.ReactNode
  onClick?: () => void
  disabled?: boolean
  className?: string
}

const LeatherButton: React.FC<LeatherButtonProps> = ({ children, onClick, disabled = false, className = "" }) => {
  return (
    <button
      className={`
                leather-button
                relative px-6 py-3 border-none rounded-lg
                text-[#F5DEB3] font-bold cursor-pointer
                transition-all duration-300 ease-in-out
                overflow-hidden
                hover:transform hover:-translate-y-0.5
                active:transform active:translate-y-0
                disabled:opacity-60 disabled:cursor-not-allowed disabled:transform-none
                ${className}
                ${disabled ? "disabled" : ""}
            `}
      onClick={onClick}
      disabled={disabled}
      style={{
        background: `
                    radial-gradient(circle at 20% 30%, rgba(139, 105, 85, 0.3) 1px, transparent 1px),
                    radial-gradient(circle at 70% 60%, rgba(101, 67, 33, 0.2) 1px, transparent 1px),
                    radial-gradient(circle at 40% 80%, rgba(160, 120, 90, 0.25) 1px, transparent 1px),
                    linear-gradient(45deg, #8B4513 0%, #A0522D 25%, #CD853F 50%, #D2691E 75%, #8B4513 100%)
                `,
        backgroundSize: "15px 15px, 20px 20px, 18px 18px, 100% 100%",
        textShadow: "1px 1px 2px rgba(0, 0, 0, 0.5)",
        boxShadow: `
                    0 4px 8px rgba(0, 0, 0, 0.3),
                    inset 0 1px 0 rgba(255, 255, 255, 0.1),
                    inset 0 -1px 0 rgba(0, 0, 0, 0.2)
                `,
      }}
    >
      <span className="relative z-10 block">{children}</span>
    </button>
  )
}

export default LeatherButton
