import { cn } from "@/lib/utils";
import { useState } from "react";

interface ColourfulTagProps {
  icon: ReactNode;
  bgColor: string;
  textColor: string;
  label: string;
  children?: ReactNode;
  size?: "sm" | "md" | "lg";
  onClick?: () => void;
  className?: string;
}

const sizeConfig = {
  sm: {
    padding: "px-2 py-1",
    fontSize: "text-xs",
    iconSize: "text-xs",
    inset: "-1px",
  },
  md: {
    padding: "px-3 py-1.5",
    fontSize: "text-sm",
    iconSize: "text-sm",
    inset: "-1.5px",
  },
  lg: {
    padding: "px-4 py-2",
    fontSize: "text-base",
    iconSize: "text-base",
    inset: "-2px",
  }
};

export const Component: FC<ColourfulTagProps> = ({
  icon,
  bgColor,
  textColor,
  label,
  children,
  size = "md",
  onClick,
  className
}) => {
    const [isHovered, setIsHovered] = useState(false);
  const sizeStyles = sizeConfig[size];
  
  const displayText = children || label;

  const animatedGradient = `radial-gradient(circle, ${hexToRgba(bgColor, 0.4)} 0%, ${hexToRgba(bgColor, 0.15)} 40%, ${hexToRgba(bgColor, 0)} 70%)`;
  const borderGradient = `radial-gradient(circle, ${hexToRgba(bgColor, 0.3)} 0%, ${hexToRgba(bgColor, 0.35)} 50%, ${hexToRgba(bgColor, 0.9)} 100%)`;
  
  const normalShadow = `inset 0 0 15px 0 ${hexToRgba(bgColor, 0.35)}`;
  const pulseShadow = `inset 0 0 22px 0 ${hexToRgba(bgColor, 0.3)}, inset 0 0 13px 0 ${hexToRgba(bgColor, 0.3)}, inset 0 0 6px 0 ${hexToRgba(bgColor, 0.7)}`;

  return (
    <div 
      className={cn('relative cursor-pointer group my-1 h-full', className)}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <span
        className="absolute inset-0 z-0 rounded-full"
        style={{ 
            top: sizeStyles.inset,
            left: sizeStyles.inset,
            right: sizeStyles.inset,
            bottom: size == 'sm' ? "1px" : sizeStyles.inset,
          content: '""',
          pointerEvents: "none",
          background: borderGradient,
          backgroundSize: "200% 100%",
          backgroundPosition: isHovered ? "0% 50%" : "100% 50%",
          boxShadow: isHovered ? pulseShadow : normalShadow,
          transition: "all 0.25s ease-in-out",
        }}
      />
      <div
        className={cn(
          "relative inline-flex bg-black w-full items-center gap-1.5 rounded-full font-medium",
          textColor,
          sizeStyles.padding,
          sizeStyles.fontSize,
          onClick && "cursor-pointer hover:opacity-80 active:opacity-60"
        )}
        onClick={onClick}
        style={{ position: "relative" }}
      >
        <span className={cn("z-20 leading-none", sizeStyles.iconSize)}>
          {icon}
        </span>
        <span className="z-20 leading-none font-light whitespace-nowrap">
          {displayText}
        </span>
        <span
          className={`absolute inset-0 z-10 rounded-full transition-all duration-400 ease-in-out`}
          data-animated-span
          style={{
            background: animatedGradient,
            backgroundSize: "200% 100%",
            backgroundPosition: isHovered ? "100% 50%" : "0% 50%",
            boxShadow: isHovered ? pulseShadow : normalShadow,
            transition: "all 0.25s ease-in-out",
          }}
        />   
      </div>
    </div>
  );
};

function hexToRgba(hex: string, opacity: number = 1): string {
  let sanitized = hex.replace(/^#/, "").trim();

  if (sanitized.length === 3) {
    sanitized = sanitized
      .split("")
      .map((char) => char + char)
      .join("");
  }

  if (sanitized.length !== 6 || !/^[0-9a-fA-F]{6}$/.test(sanitized)) {
    throw new Error(`hexToRgba: "${hex}" is not a valid 3- or 6-digit hex colour.`);
  }

  const r = parseInt(sanitized.substring(0, 2), 16);
  const g = parseInt(sanitized.substring(2, 4), 16);
  const b = parseInt(sanitized.substring(4, 6), 16);
  
  const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

  const alpha = clamp(opacity > 1 ? opacity / 100 : opacity, 0, 1);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
} 