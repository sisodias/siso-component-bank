import React from "react";

interface EditorialEyebrowProps {
  /** Small uppercase label shown after the line */
  label: string;
  /** Color of the line and label */
  color?: string;
  /** Length of the decorative rule in pixels */
  lineWidth?: number;
  className?: string;
}

/**
 * Decorative editorial eyebrow — a short horizontal rule + uppercase label.
 * Used above section headings and hero headlines to establish visual rhythm.
 */
export function EditorialEyebrow({
  label,
  color = "#B41100",
  lineWidth = 28,
  className = "",
}: EditorialEyebrowProps) {
  return (
    <div
      className={className}
      style={{ display: "inline-flex", alignItems: "center", gap: 10 }}
      aria-hidden="true"
    >
      <div style={{ width: lineWidth, height: 2, background: color, flexShrink: 0 }} />
      <span
        style={{
          fontSize: "0.68rem",
          fontWeight: 600,
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          color,
        }}
      >
        {label}
      </span>
    </div>
  );
}

interface EditorialSectionProps {
  eyebrow: string;
  eyebrowColor?: string;
  headline: string;
  /** Max width for the headline in px */
  headlineMaxWidth?: number;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Full editorial section header: eyebrow + Playfair Display headline.
 * Pairs with `EditorialEyebrow` for consistent section openings across pages.
 */
export function EditorialSection({
  eyebrow,
  eyebrowColor = "#C9A84C",
  headline,
  headlineMaxWidth = 560,
  children,
  className = "",
}: EditorialSectionProps) {
  return (
    <div className={className}>
      <EditorialEyebrow label={eyebrow} color={eyebrowColor} />
      <h2
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2rem, 3.5vw, 2.8rem)",
          fontWeight: 700,
          color: "#1a1108",
          lineHeight: 1.12,
          letterSpacing: "-0.02em",
          marginTop: 16,
          marginBottom: 40,
          maxWidth: headlineMaxWidth,
        }}
      >
        {headline}
      </h2>
      {children}
    </div>
  );
}

export default EditorialEyebrow;
