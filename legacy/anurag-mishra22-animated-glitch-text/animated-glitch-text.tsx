import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "../_utils/cn"

interface GlitchTextProps extends React.HTMLAttributes<HTMLDivElement> {
  text: string
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "p" | "span"
  textClassName?: string
  containerClassName?: string
  colors?: {
    red: string
    green: string
    blue: string
  }
}

const GlitchText = React.forwardRef<HTMLDivElement, GlitchTextProps>(
  ({
    text,
    as: Component = "h1",
    className,
    textClassName,
    containerClassName,
    colors = {
      red: "#ff0000",
      green: "#00ff00",
      blue: "#0000ff"
    },
    ...props
  }, ref) => {
    return (
      <div 
        ref={ref}
        className={cn(
          "flex items-center justify-center p-4",
          "min-h-[200px]",
          className
        )}
        {...props}
      >
        <div className={cn(
          "relative",
          containerClassName
        )}>
          <motion.div
            className={cn(
              "text-6xl font-bold absolute",
              "mix-blend-multiply dark:mix-blend-screen",
              textClassName
            )}
            animate={{
              x: [-2, 2, -2],
              y: [0, -1, 1],
              skew: [0, -2, 2],
              opacity: [1, 0.8, 0.9],
              color: [colors.red, colors.red, colors.red]
            }}
            transition={{
              duration: 0.15,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "anticipate"
            }}
          >
            {text}
          </motion.div>
          <motion.div
            className={cn(
              "text-6xl font-bold absolute",
              "mix-blend-multiply dark:mix-blend-screen",
              textClassName
            )}
            animate={{
              x: [2, -2, 2],
              y: [1, -1, 0],
              skew: [-2, 2, 0],
              opacity: [0.9, 1, 0.8],
              color: [colors.green, colors.green, colors.green]
            }}
            transition={{
              duration: 0.13,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "anticipate"
            }}
          >
            {text}
          </motion.div>
          <motion.div
            className={cn(
              "text-6xl font-bold",
              "mix-blend-multiply dark:mix-blend-screen",
              textClassName
            )}
            animate={{
              x: [-1, 1, -1],
              y: [-1, 1, 0],
              skew: [2, -2, 0],
              opacity: [0.8, 0.9, 1],
              color: [colors.blue, colors.blue, colors.blue]
            }}
            transition={{
              duration: 0.11,
              repeat: Infinity,
              repeatType: "mirror",
              ease: "anticipate"
            }}
          >
            {text}
          </motion.div>
        </div>
      </div>
    )
  }
)
GlitchText.displayName = "GlitchText"

export { GlitchText }