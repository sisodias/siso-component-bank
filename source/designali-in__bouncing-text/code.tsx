"use client"

interface BouncingTextProps {
  text: string
  colors?: string[]
  bounceTime?: number
  fontSize?: string 
  bounceHeight?: number
  shadowOpacity?: number
  letterDelayFactor?: number
  shadowScatteringInitial?: number
  shadowScatteringPeak?: number
  fontWeight?: string | number
  className?: string 
}

export function BouncingText({
  text,
  colors = ["#4285f4", "#ea4335", "#fbbc05", "#22c55e", "#f97316", "#4563e8", "#ec4899", "#eab308"],
  bounceTime = 2,
  fontSize = "8rem", 
  bounceHeight = 1,
  shadowOpacity = 0.4,
  letterDelayFactor = 1 / 3,
  shadowScatteringInitial = 0.05,
  shadowScatteringPeak = 0.35,
  fontWeight = "bold",
  className = "", 
}: BouncingTextProps) {
  const letters = text.split("")

  return (
    <div
      className={`flex items-center justify-center w-full h-full ${className}`}
      style={{ 
        fontSize,
        fontWeight,
        whiteSpace: "nowrap", 
      }}
    >
      <style>{`
        @keyframes bounce {
          0% {
            transform: translate3d(0, 0, 0);
            text-shadow: rgba(0, 0, 0, ${shadowOpacity}) 0 0 ${shadowScatteringInitial}em;
          }
          100% {
            transform: translate3d(0, -${bounceHeight}em, 0);
            text-shadow: rgba(0, 0, 0, ${shadowOpacity}) 0 ${bounceHeight}em ${shadowScatteringPeak}em;
          }
        }
      `}</style>

      {letters.map((letter, index) => {
        const delay = index * (bounceTime / letters.length) * letterDelayFactor
        const color = colors[index % colors.length]

        return (
          <span
            key={index}
            style={{
              animation: `bounce ${bounceTime / 2}s cubic-bezier(0.05, 0, 0.2, 1) infinite alternate`,
              animationDelay: `${delay}s`,
              display: "inline-block",
              transform: "translate3d(0, 0, 0)",
              marginTop: "0.5em",
              textShadow: `rgba(0, 0, 0, ${shadowOpacity}) 0 0 ${shadowScatteringInitial}em`,
              color, 
              fontSize,
              fontWeight,
            }}
          >
            {letter}
          </span>
        )
      })}
    </div>
  )
}
