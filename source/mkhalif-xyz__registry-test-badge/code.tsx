import * as React from "react"

export interface RegistryTestBadgeProps {
  /** Text shown inside the badge. */
  label?: string
}

/**
 * RegistryTestBadge
 * A tiny, dependency-free badge used to verify that publishing to the
 * 21st.dev registry works end to end.
 */
export default function RegistryTestBadge({
  label = "Registry OK",
}: RegistryTestBadgeProps) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        padding: "4px 10px",
        borderRadius: 9999,
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1,
        color: "#ffffff",
        background: "#16a34a",
      }}
    >
      <span
        aria-hidden
        style={{ width: 6, height: 6, borderRadius: "50%", background: "#ffffff" }}
      />
      {label}
    </span>
  )
}
