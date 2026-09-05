import React, { useState } from "react";

export interface School {
  id: number | string;
  name: string;
  tagline?: string;
  logoUrl?: string;
  shortName?: string;
  primaryColor?: string;
  onSelect?: (id: number | string) => void;
}

interface SchoolSelectorPanelProps {
  schools: School[];
  onSelect?: (school: School) => void;
  /** Accent color for active border and AI badge */
  accentColor?: string;
  className?: string;
}

export default function SchoolSelectorPanel({
  schools,
  onSelect,
  accentColor = "#B41100",
  className = "",
}: SchoolSelectorPanelProps) {
  const [hovered, setHovered] = useState<string | number | null>(null);

  return (
    <div
      className={className}
      style={{
        background: "#fff",
        border: "1px solid #e8e0d0",
        borderRadius: 20,
        overflow: "hidden",
        boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 32px rgba(0,0,0,0.08), 0 32px 80px rgba(0,0,0,0.06)",
      }}
    >
      {/* Panel chrome header */}
      <div
        style={{
          padding: "22px 28px 20px",
          borderBottom: "1px solid #e8e0d0",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <span
          style={{
            fontFamily: "system-ui, sans-serif",
            fontSize: "0.72rem",
            fontWeight: 700,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
            color: "#7a6a52",
          }}
        >
          Select your institution
        </span>
        {/* macOS-style dots */}
        <div style={{ display: "flex", gap: 6 }}>
          {["#fc6058", "#fec02f", "#2aca3e"].map((c) => (
            <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
          ))}
        </div>
      </div>

      {/* School rows */}
      <div style={{ padding: 16, display: "flex", flexDirection: "column", gap: 10 }}>
        {schools.length === 0 ? (
          <div
            style={{
              padding: "48px 28px",
              textAlign: "center",
              color: "#7a6a52",
              fontSize: "0.9rem",
            }}
          >
            No schools are currently available. Check back soon.
          </div>
        ) : (
          schools.map((school) => {
            const isHovered = hovered === school.id;
            const abbr = (school.shortName ?? school.name).slice(0, 2).toUpperCase();
            const bg = school.primaryColor ? `${school.primaryColor}15` : "#e8e0d015";

            return (
              <button
                key={school.id}
                onClick={() => onSelect?.(school)}
                onMouseEnter={() => setHovered(school.id)}
                onMouseLeave={() => setHovered(null)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 14,
                  padding: "16px 18px",
                  borderRadius: 12,
                  border: `1.5px solid ${isHovered ? accentColor : "#e8e0d0"}`,
                  background: isHovered ? "#fff" : "#FAF8F4",
                  cursor: "pointer",
                  textAlign: "left",
                  width: "100%",
                  transition: "all 0.22s cubic-bezier(0.4,0,0.2,1)",
                  transform: isHovered ? "translateX(3px)" : "none",
                  boxShadow: isHovered ? "0 4px 16px rgba(0,0,0,0.07)" : "none",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                {/* Left accent bar */}
                <div
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    bottom: 0,
                    width: isHovered ? 4 : 3,
                    background: isHovered ? accentColor : "#d4c9b5",
                    transition: "all 0.22s",
                  }}
                />

                {/* Logo */}
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 10,
                    background: bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    overflow: "hidden",
                    padding: 4,
                  }}
                >
                  {school.logoUrl ? (
                    <img
                      src={school.logoUrl}
                      alt={`${school.name} logo`}
                      style={{ width: "100%", height: "100%", objectFit: "contain" }}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: "'Oswald', system-ui, sans-serif",
                        fontSize: "0.85rem",
                        fontWeight: 700,
                        color: "#3d3220",
                      }}
                    >
                      {abbr}
                    </span>
                  )}
                </div>

                {/* Text */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: "0.88rem",
                      color: "#1a1108",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      marginBottom: 2,
                    }}
                  >
                    {school.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#7a6a52",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {school.tagline ?? school.shortName ?? "Academic Advisor"}
                  </div>
                </div>

                {/* Arrow */}
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  style={{
                    flexShrink: 0,
                    color: isHovered ? accentColor : "#7a6a52",
                    transition: "color 0.22s, transform 0.22s",
                    transform: isHovered ? "translateX(4px)" : "none",
                  }}
                >
                  <path d="M5 9h8M9 6l3 3-3 3" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
            );
          })
        )}
      </div>

      {/* Footer */}
      <div
        style={{
          padding: "18px 28px",
          borderTop: "1px solid #e8e0d0",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <AiBadge color={accentColor} />
        <p style={{ fontSize: "0.75rem", color: "#7a6a52", lineHeight: 1.4, margin: 0 }}>
          Your academic advisor is ready. Select a school to begin.
        </p>
      </div>
    </div>
  );
}

function AiBadge({ color }: { color: string }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        background: `${color}14`,
        border: `1px solid ${color}26`,
        color,
        fontSize: "0.67rem",
        fontWeight: 700,
        letterSpacing: "0.1em",
        textTransform: "uppercase",
        padding: "3px 8px",
        borderRadius: 100,
        whiteSpace: "nowrap",
      }}
    >
      <span
        style={{
          width: 5,
          height: 5,
          background: color,
          borderRadius: "50%",
          animation: "aidot 2s ease infinite",
        }}
      />
      AI Live
      <style>{`@keyframes aidot{0%,100%{opacity:1}50%{opacity:0.3}}`}</style>
    </span>
  );
}
