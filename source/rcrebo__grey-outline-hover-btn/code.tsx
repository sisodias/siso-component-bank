import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { useState } from "react"

interface ComponentProps {
  children: React.ReactNode
  className?: string
  disabled?: boolean
  type?: "button" | "submit" | "reset"
  onClick?: () => void
}

export function Component({ children, className = "", disabled, type, onClick }: ComponentProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`relative py-2 rounded-2xl bg-transparent border-2 border-white/20 text-white font-medium text-base transition-all duration-300 hover:border-white/40 hover:bg-white/5 overflow-hidden group ${className}`}
      style={{
        paddingLeft: isHovered ? '2.75rem' : '3rem',
        paddingRight: isHovered ? '2.75rem' : '3rem',
      }}
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.span
        className="relative z-10 flex items-center justify-center gap-2"
        layout
      >
        {children}
        <motion.span
          initial={{ opacity: 0, width: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
            width: isHovered ? 16 : 0,
            marginLeft: isHovered ? 8 : 0
          }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="inline-flex items-center overflow-hidden"
        >
          <ArrowRight className="w-4 h-4" />
        </motion.span>
      </motion.span>

      {/* Sliding background effect */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10"
        initial={{ x: "-100%" }}
        animate={{ x: isHovered ? "0%" : "-100%" }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />
    </motion.button>
  )
}
