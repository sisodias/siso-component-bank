import React from "react";

interface CourseCompassLogoProps {
  /** Size of the compass SVG in pixels */
  size?: number;
  /** Primary brand color (cardinal red) */
  primaryColor?: string;
  /** Accent color for needle (gold) */
  accentColor?: string;
  /** Show the wordmark next to the icon */
  showWordmark?: boolean;
  /** Font family for wordmark */
  fontFamily?: string;
  className?: string;
}

export default function CourseCompassLogo({
  size = 34,
  primaryColor = "#B41100",
  accentColor = "#C9A84C",
  showWordmark = true,
  fontFamily = "'Oswald', sans-serif",
  className = "",
}: CourseCompassLogoProps) {
  return (
    <div
      className={className}
      style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 34 34"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{ flexShrink: 0 }}
        aria-hidden="true"
      >
        {/* Outer ring */}
        <circle cx="17" cy="17" r="15" stroke={primaryColor} strokeWidth="1.5" />
        {/* Center dot */}
        <circle cx="17" cy="17" r="3.5" fill={primaryColor} />
        {/* Cardinal tick marks */}
        <line x1="17" y1="2" x2="17" y2="8" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="17" y1="26" x2="17" y2="32" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="2" y1="17" x2="8" y2="17" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
        <line x1="26" y1="17" x2="32" y2="17" stroke={primaryColor} strokeWidth="1.5" strokeLinecap="round" />
        {/* Gold needle pointing NE */}
        <line x1="17" y1="17" x2="23" y2="10" stroke={accentColor} strokeWidth="1.8" strokeLinecap="round" />
        <circle cx="23" cy="10" r="1.5" fill={accentColor} />
        {/* Diagonal ticks */}
        <line x1="24.5" y1="6.5" x2="26.5" y2="4.5" stroke={primaryColor} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        <line x1="6.5" y1="24.5" x2="8.5" y2="22.5" stroke={primaryColor} strokeWidth="1" strokeLinecap="round" opacity="0.5" />
      </svg>

      {showWordmark && (
        <span
          style={{
            fontFamily,
            fontSize: "1.05rem",
            fontWeight: 700,
            color: "#1a1108",
            letterSpacing: "0.8px",
            textTransform: "uppercase",
          }}
        >
          Course
          <span style={{ color: primaryColor }}>Compass</span>
        </span>
      )}
    </div>
  );
}
