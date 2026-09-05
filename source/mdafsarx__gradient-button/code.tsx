import { cn } from "@/lib/utils";
import React, { CSSProperties } from "react";

interface GradientButtonProps {
  borderWidth?: number;
  colors?: string[];
  duration?: number;
  borderRadius?: number;
  blur?: number;
  className?: string;
  bgColor?: string;
  text?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
  borderWidth = 2,
  colors = [
    "#FF0000",
    "#FFA500",
    "#FFFF00",
    "#008000",
    "#0000FF",
    "#4B0082",
    "#EE82EE",
    "#FF0000",
  ],
  duration = 2500,
  borderRadius = 8,
  blur = 4,
  className,
  bgColor = "#000",
  text = "Zooooooooooom 🚀",
}) => {
  const gradientStyle = {
    "--allColors": colors.join(", "),
    "--duration": `${duration}ms`,
    "--borderWidth": `${borderWidth}px`,
    "--borderRadius": `${borderRadius}px`,
    "--blur": `${blur}px`,
    "--bgColor": bgColor,
  } as CSSProperties;

  return (
    <>
      <style jsx>{`
        @keyframes rotate-rainbow {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .rainbow-btn {
          padding: var(--borderWidth);
          border-radius: var(--borderRadius);
          position: relative;
          overflow: hidden;
        }

        .rainbow-btn::before {
          content: "";
          background: conic-gradient(var(--allColors));
          animation: rotate-rainbow var(--duration) linear infinite;
          filter: blur(var(--blur));
          padding: var(--borderWidth);
          position: absolute;
          inset: -200%;
          z-index: 0;
        }

        .btn-content {
          border-radius: var(--borderRadius);
          background-color: var(--bgColor);
          z-index: 10;
          position: relative;
        }
      `}</style>

      <div className="inline-block">
        <button
          style={gradientStyle}
          className={cn(
            "relative flex items-center justify-center min-w-28 min-h-10 overflow-hidden rainbow-btn before:absolute before:-inset-[200%] animate-rainbow",
            className
          )}
        >
          <span className="text-white btn-content inline-flex w-full h-full items-center justify-center px-4 py-2">
            {text}
          </span>
        </button>
      </div>
    </>
  );
};

export default GradientButton;