
interface AILoaderProps {
  text?: string
  variant?: "purple" | "blue" | "green" | "orange" | "pink"
  size?: "sm" | "md" | "lg"
  theme?: "light" | "dark"
}

export const AILoader = ({ text = "AI is generating", variant = "purple", size = "md", theme = "light" }: AILoaderProps) => {
  const letters = text.split("")

  const variants = {
    purple: {
      primary: "#ff69b4",
      secondary: "#8b5cf6",
      accent: "#ff1493",
      deep: "#6b46c1",
      textColor: theme === "dark" ? "#ffffff" : "#4c1d95",
    },
    blue: {
      primary: "#00bfff",
      secondary: "#1e90ff",
      accent: "#0099ff",
      deep: "#0066cc",
      textColor: theme === "dark" ? "#ffffff" : "#1e3a8a",
    },
    green: {
      primary: "#00ff88",
      secondary: "#00cc66",
      accent: "#00ff44",
      deep: "#009944",
      textColor: theme === "dark" ? "#ffffff" : "#14532d",
    },
    orange: {
      primary: "#ff8c00",
      secondary: "#ff6600",
      accent: "#ff4400",
      deep: "#cc3300",
      textColor: theme === "dark" ? "#ffffff" : "#9a3412",
    },
    pink: {
      primary: "#ff1493",
      secondary: "#ff69b4",
      accent: "#ff0080",
      deep: "#cc0066",
      textColor: theme === "dark" ? "#ffffff" : "#be185d",
    },
  }

  const sizes = {
    sm: { width: "120px", height: "120px", fontSize: "0.9em" },
    md: { width: "180px", height: "180px", fontSize: "1.2em" },
    lg: { width: "240px", height: "240px", fontSize: "1.5em" },
  }

  const currentVariant = variants[variant]
  const currentSize = sizes[size]

  return (
    <div className="ai-loader-wrapper">
      <div
        className="loader-wrapper"
        style={{
          width: currentSize.width,
          height: currentSize.height,
          fontSize: currentSize.fontSize,
          color: currentVariant.textColor,
        }}
      >
        {letters.map((letter, index) => (
          <span key={index} className="loader-letter" style={{ animationDelay: `${index * 0.1}s` }}>
            {letter}
          </span>
        ))}
        <div className="loader" />
      </div>

      <style jsx>{`
        .loader-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: "Inter", sans-serif;
          font-weight: 300;
          border-radius: 50%;
          background-color: transparent;
          user-select: none;
        }

        .loader {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          aspect-ratio: 1 / 1;
          border-radius: 50%;
          background-color: transparent;
          animation: loader-rotate 2s linear infinite;
          z-index: 0;
        }

        @keyframes loader-rotate {
          0% {
            transform: rotate(90deg);
            box-shadow:
              0 10px 20px 0 #fff inset,
              0 20px 30px 0 ${currentVariant.primary} inset,
              0 60px 60px 0 ${currentVariant.secondary} inset;
          }
          50% {
            transform: rotate(270deg);
            box-shadow:
              0 10px 20px 0 #fff inset,
              0 20px 10px 0 ${currentVariant.accent} inset,
              0 40px 60px 0 ${currentVariant.deep} inset;
          }
          100% {
            transform: rotate(450deg);
            box-shadow:
              0 10px 20px 0 #fff inset,
              0 20px 30px 0 ${currentVariant.primary} inset,
              0 60px 60px 0 ${currentVariant.secondary} inset;
          }
        }

        .loader-letter {
          display: inline-block;
          opacity: 0.4;
          transform: translateY(0);
          animation: loader-letter-anim 2s infinite;
          z-index: 1;
          border-radius: 50ch;
          border: none;
        }

        @keyframes loader-letter-anim {
          0%,
          100% {
            opacity: 0.4;
            transform: translateY(0);
          }
          20% {
            opacity: 1;
            transform: scale(1.15);
          }
          40% {
            opacity: 0.7;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  )
}
