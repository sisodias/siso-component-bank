"use client"

import { useState, useEffect } from "react"

export function Component() {
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setRevealed(true), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#0f172a",
        padding: "24px",
        fontFamily: "system-ui, -apple-system, sans-serif",
      }}
    >
      <style jsx>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.7; }
        }
        @keyframes reveal {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .skeleton-dark {
          background: linear-gradient(
            90deg,
            #1e293b 25%,
            #334155 50%,
            #1e293b 75%
          );
          background-size: 200% 100%;
          animation: shimmer 1.5s ease-in-out infinite;
          border-radius: 8px;
        }
        .skeleton-pulse {
          animation: pulse 1.5s ease-in-out infinite;
        }
        .card-skeleton {
          background-color: #1e293b;
          border-radius: 16px;
          padding: 20px;
          animation: pulse 2s ease-in-out infinite;
        }
        .reveal-content {
          animation: reveal 0.5s ease-out forwards;
        }
      `}</style>

      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
          }}
        >
          <div>
            <div className="skeleton-dark" style={{ width: "200px", height: "32px", marginBottom: "8px" }} />
            <div className="skeleton-dark" style={{ width: "300px", height: "16px" }} />
          </div>
          <div style={{ display: "flex", gap: "12px" }}>
            <div className="skeleton-dark" style={{ width: "120px", height: "40px", borderRadius: "8px" }} />
            <div className="skeleton-dark" style={{ width: "40px", height: "40px", borderRadius: "50%" }} />
          </div>
        </div>

        {/* Stats cards */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card-skeleton" style={{ animationDelay: `${i * 0.1}s` }}>
              <div className="skeleton-dark" style={{ width: "100px", height: "14px", marginBottom: "16px" }} />
              <div className="skeleton-dark" style={{ width: "120px", height: "36px", marginBottom: "12px" }} />
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <div className="skeleton-dark" style={{ width: "60px", height: "20px", borderRadius: "9999px" }} />
                <div className="skeleton-dark" style={{ width: "80px", height: "12px" }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
          {/* Main chart area */}
          <div className="card-skeleton" style={{ padding: "24px" }}>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "24px",
              }}
            >
              <div className="skeleton-dark" style={{ width: "150px", height: "24px" }} />
              <div style={{ display: "flex", gap: "8px" }}>
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="skeleton-dark"
                    style={{ width: "60px", height: "32px", borderRadius: "6px" }}
                  />
                ))}
              </div>
            </div>

            {/* Chart placeholder */}
            <div
              style={{
                height: "280px",
                display: "flex",
                alignItems: "flex-end",
                gap: "8px",
                paddingTop: "20px",
              }}
            >
              {[40, 65, 45, 80, 55, 90, 70, 85, 60, 75, 50, 95].map((h, i) => (
                <div
                  key={i}
                  className="skeleton-dark skeleton-pulse"
                  style={{
                    flex: 1,
                    height: `${h}%`,
                    borderRadius: "4px 4px 0 0",
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>

            {/* X-axis labels */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: "12px",
                padding: "0 4px",
              }}
            >
              {[...Array(6)].map((_, i) => (
                <div key={i} className="skeleton-dark" style={{ width: "40px", height: "12px" }} />
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Pie chart card */}
            <div className="card-skeleton" style={{ padding: "24px" }}>
              <div className="skeleton-dark" style={{ width: "120px", height: "20px", marginBottom: "20px" }} />
              <div
                style={{
                  width: "160px",
                  height: "160px",
                  margin: "0 auto 20px",
                  borderRadius: "50%",
                  background: `conic-gradient(
                  #334155 0deg 120deg,
                  #475569 120deg 200deg,
                  #1e293b 200deg 280deg,
                  #334155 280deg 360deg
                )`,
                  position: "relative",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "80px",
                    height: "80px",
                    borderRadius: "50%",
                    backgroundColor: "#1e293b",
                  }}
                />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {[...Array(4)].map((_, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div className="skeleton-dark" style={{ width: "12px", height: "12px", borderRadius: "2px" }} />
                    <div className="skeleton-dark" style={{ width: "80px", height: "12px" }} />
                    <div className="skeleton-dark" style={{ width: "40px", height: "12px", marginLeft: "auto" }} />
                  </div>
                ))}
              </div>
            </div>

            {/* Activity list */}
            <div className="card-skeleton" style={{ padding: "24px", flex: 1 }}>
              <div className="skeleton-dark" style={{ width: "140px", height: "20px", marginBottom: "20px" }} />
              {[...Array(4)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    marginBottom: i < 3 ? "16px" : 0,
                  }}
                >
                  <div className="skeleton-dark" style={{ width: "36px", height: "36px", borderRadius: "50%" }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton-dark" style={{ width: "100%", height: "14px", marginBottom: "6px" }} />
                    <div className="skeleton-dark" style={{ width: "60%", height: "12px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table section */}
        <div className="card-skeleton" style={{ marginTop: "24px", padding: "24px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "20px",
            }}
          >
            <div className="skeleton-dark" style={{ width: "150px", height: "24px" }} />
            <div className="skeleton-dark" style={{ width: "200px", height: "36px", borderRadius: "8px" }} />
          </div>

          {/* Table header */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
              gap: "16px",
              padding: "12px 0",
              borderBottom: "1px solid #334155",
            }}
          >
            {[...Array(5)].map((_, i) => (
              <div key={i} className="skeleton-dark" style={{ height: "14px" }} />
            ))}
          </div>

          {/* Table rows */}
          {[...Array(5)].map((_, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr 1fr 1fr 100px",
                gap: "16px",
                padding: "16px 0",
                borderBottom: rowIndex < 4 ? "1px solid #1e293b" : "none",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div className="skeleton-dark" style={{ width: "32px", height: "32px", borderRadius: "8px" }} />
                <div className="skeleton-dark" style={{ width: "120px", height: "14px" }} />
              </div>
              <div className="skeleton-dark" style={{ height: "14px" }} />
              <div className="skeleton-dark" style={{ height: "14px" }} />
              <div className="skeleton-dark" style={{ width: "80px", height: "24px", borderRadius: "9999px" }} />
              <div className="skeleton-dark" style={{ height: "14px" }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
