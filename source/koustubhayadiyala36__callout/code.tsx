"use client"

import type React from "react"
import type { JSX } from "react/jsx-runtime"

type CalloutType = "info" | "warning" | "success" | "error" | "note"

interface CalloutProps {
  type?: CalloutType
  title?: string
  children?: React.ReactNode
}

const calloutConfig: Record<
  CalloutType,
  {
    icon: JSX.Element
    bgColor: string
    borderColor: string
    iconBg: string
    titleColor: string
    textColor: string
  }
> = {
  info: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
    bgColor: "#eff6ff",
    borderColor: "#3b82f6",
    iconBg: "#dbeafe",
    titleColor: "#1e40af",
    textColor: "#1e3a8a",
  },
  warning: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
        <path d="M12 9v4M12 17h.01" />
      </svg>
    ),
    bgColor: "#fffbeb",
    borderColor: "#f59e0b",
    iconBg: "#fef3c7",
    titleColor: "#92400e",
    textColor: "#78350f",
  },
  success: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
    ),
    bgColor: "#f0fdf4",
    borderColor: "#22c55e",
    iconBg: "#dcfce7",
    titleColor: "#166534",
    textColor: "#14532d",
  },
  error: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="10" />
        <path d="M15 9l-6 6M9 9l6 6" />
      </svg>
    ),
    bgColor: "#fef2f2",
    borderColor: "#ef4444",
    iconBg: "#fee2e2",
    titleColor: "#991b1b",
    textColor: "#7f1d1d",
  },
  note: {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <polyline points="10 9 9 9 8 9" />
      </svg>
    ),
    bgColor: "#faf5ff",
    borderColor: "#a855f7",
    iconBg: "#f3e8ff",
    titleColor: "#6b21a8",
    textColor: "#581c87",
  },
}

function SingleCallout({ type = "info", title, children }: CalloutProps) {
  const config = calloutConfig[type]

  return (
    <div
      style={{
        backgroundColor: config.bgColor,
        borderLeft: `4px solid ${config.borderColor}`,
        borderRadius: "0 8px 8px 0",
        padding: "16px 20px",
        marginBottom: "16px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          gap: "12px",
        }}
      >
        <div
          style={{
            backgroundColor: config.iconBg,
            padding: "8px",
            borderRadius: "8px",
            color: config.borderColor,
            flexShrink: 0,
          }}
        >
          {config.icon}
        </div>
        <div style={{ flex: 1 }}>
          {title && (
            <div
              style={{
                fontWeight: "600",
                color: config.titleColor,
                marginBottom: "4px",
                fontSize: "15px",
              }}
            >
              {title}
            </div>
          )}
          <div
            style={{
              color: config.textColor,
              fontSize: "14px",
              lineHeight: "1.6",
            }}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export function Component() {
  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        padding: "32px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-10px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .callout-animated {
          animation: slideIn 0.3s ease-out forwards;
          opacity: 0;
        }
      `}</style>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        <h2
          style={{
            fontSize: "28px",
            fontWeight: "700",
            color: "#1e293b",
            marginBottom: "8px",
          }}
        >
          Callout Components
        </h2>
        <p
          style={{
            color: "#64748b",
            marginBottom: "32px",
            fontSize: "15px",
          }}
        >
          Use callouts to highlight important information in your documentation.
        </p>

        <div className="callout-animated" style={{ animationDelay: "0s" }}>
          <SingleCallout type="info" title="Did you know?">
            This is an informational callout. Use it to provide helpful tips or additional context that readers might
            find useful.
          </SingleCallout>
        </div>

        <div className="callout-animated" style={{ animationDelay: "0.1s" }}>
          <SingleCallout type="warning" title="Caution">
            This action cannot be undone. Please make sure you have backed up your data before proceeding with the
            deletion.
          </SingleCallout>
        </div>

        <div className="callout-animated" style={{ animationDelay: "0.2s" }}>
          <SingleCallout type="success" title="Success!">
            Your changes have been saved successfully. The new configuration will take effect immediately.
          </SingleCallout>
        </div>

        <div className="callout-animated" style={{ animationDelay: "0.3s" }}>
          <SingleCallout type="error" title="Error">
            Failed to connect to the database. Please check your connection settings and try again.
          </SingleCallout>
        </div>

        <div className="callout-animated" style={{ animationDelay: "0.4s" }}>
          <SingleCallout type="note" title="Note">
            This feature is currently in beta. Some functionality may change in future releases. Check the{" "}
            <strong>changelog</strong> for updates.
          </SingleCallout>
        </div>

        {/* Callout without title */}
        <div className="callout-animated" style={{ animationDelay: "0.5s" }}>
          <SingleCallout type="info">
            Callouts can also be used without a title for simpler messages that don't need a headline.
          </SingleCallout>
        </div>

        {/* Markdown-like content */}
        <h3
          style={{
            fontSize: "18px",
            fontWeight: "600",
            color: "#1e293b",
            marginTop: "32px",
            marginBottom: "16px",
          }}
        >
          With Rich Content
        </h3>

        <div className="callout-animated" style={{ animationDelay: "0.6s" }}>
          <SingleCallout type="note" title="Code Example">
            <div>You can include code snippets in callouts:</div>
            <code
              style={{
                display: "block",
                backgroundColor: "rgba(0,0,0,0.05)",
                padding: "8px 12px",
                borderRadius: "4px",
                marginTop: "8px",
                fontFamily: "monospace",
                fontSize: "13px",
              }}
            >
              npm install @acme/components
            </code>
          </SingleCallout>
        </div>

        <div className="callout-animated" style={{ animationDelay: "0.7s" }}>
          <SingleCallout type="warning" title="Breaking Changes">
            <ul
              style={{
                margin: "8px 0 0 0",
                paddingLeft: "20px",
              }}
            >
              <li>
                The{" "}
                <code style={{ backgroundColor: "rgba(0,0,0,0.05)", padding: "2px 6px", borderRadius: "3px" }}>
                  legacyMode
                </code>{" "}
                prop has been removed
              </li>
              <li>Default theme colors have been updated</li>
              <li>Minimum Node.js version is now 18.x</li>
            </ul>
          </SingleCallout>
        </div>
      </div>
    </div>
  )
}
