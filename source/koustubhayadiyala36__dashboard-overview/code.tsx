"use client"

import { useState, useEffect } from "react"

interface StatData {
  label: string
  value: number
  prefix?: string
  suffix?: string
  change: number
  sparkline: number[]
  color: string
}

export function Component() {
  const [stats, setStats] = useState<StatData[]>([
    {
      label: "Total Revenue",
      value: 284500,
      prefix: "$",
      change: 12.5,
      sparkline: [30, 45, 35, 50, 40, 60, 55, 70, 65, 80, 75, 90],
      color: "#6366f1",
    },
    {
      label: "Active Users",
      value: 18420,
      change: 8.2,
      sparkline: [20, 25, 30, 28, 35, 40, 38, 45, 50, 48, 55, 60],
      color: "#10b981",
    },
    {
      label: "Conversion Rate",
      value: 3.24,
      suffix: "%",
      change: -2.1,
      sparkline: [40, 38, 42, 35, 38, 32, 35, 30, 33, 28, 32, 30],
      color: "#f59e0b",
    },
    {
      label: "Avg. Order Value",
      value: 156,
      prefix: "$",
      change: 5.8,
      sparkline: [25, 30, 28, 35, 40, 38, 42, 45, 43, 48, 50, 52],
      color: "#ec4899",
    },
  ])

  const [animatedValues, setAnimatedValues] = useState<number[]>(stats.map(() => 0))
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const duration = 1500
    const steps = 60
    const interval = duration / steps

    let step = 0
    const timer = setInterval(() => {
      step++
      const progress = step / steps
      const easeOut = 1 - Math.pow(1 - progress, 3)

      setAnimatedValues(stats.map((stat) => stat.value * easeOut))

      if (step >= steps) clearInterval(timer)
    }, interval)

    return () => clearInterval(timer)
  }, [])

  const formatNumber = (num: number, stat: StatData) => {
    const formatted = stat.value >= 1000 ? num.toLocaleString("en-US", { maximumFractionDigits: 0 }) : num.toFixed(2)
    return `${stat.prefix || ""}${formatted}${stat.suffix || ""}`
  }

  const getSparklinePath = (data: number[]) => {
    const max = Math.max(...data)
    const min = Math.min(...data)
    const range = max - min || 1
    const width = 100
    const height = 32
    const points = data.map((val, i) => {
      const x = (i / (data.length - 1)) * width
      const y = height - ((val - min) / range) * height
      return `${x},${y}`
    })
    return `M ${points.join(" L ")}`
  }

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
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes drawLine {
          from { stroke-dashoffset: 200; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        .stat-card {
          animation: slideUp 0.5s ease-out forwards;
          opacity: 0;
        }
        .sparkline-path {
          stroke-dasharray: 200;
          animation: drawLine 1.5s ease-out forwards;
        }
        .trend-arrow {
          animation: pulse 2s ease-in-out infinite;
        }
      `}</style>

      <h2
        style={{
          fontSize: "24px",
          fontWeight: "700",
          color: "#1e293b",
          marginBottom: "24px",
        }}
      >
        Dashboard Overview
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "24px",
        }}
      >
        {stats.map((stat, index) => (
          <div
            key={stat.label}
            className="stat-card"
            style={{
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "24px",
              boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
              animationDelay: `${index * 0.1}s`,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: "16px",
              }}
            >
              <span
                style={{
                  fontSize: "14px",
                  fontWeight: "500",
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                }}
              >
                {stat.label}
              </span>

              <div
                className="trend-arrow"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 8px",
                  borderRadius: "9999px",
                  backgroundColor: stat.change >= 0 ? "#dcfce7" : "#fee2e2",
                  color: stat.change >= 0 ? "#16a34a" : "#dc2626",
                  fontSize: "12px",
                  fontWeight: "600",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  {stat.change >= 0 ? <path d="M18 15l-6-6-6 6" /> : <path d="M6 9l6 6 6-6" />}
                </svg>
                {Math.abs(stat.change)}%
              </div>
            </div>

            <div
              style={{
                fontSize: "36px",
                fontWeight: "700",
                color: "#1e293b",
                marginBottom: "16px",
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {mounted ? formatNumber(animatedValues[index], stat) : formatNumber(0, stat)}
            </div>

            <div style={{ height: "40px", position: "relative" }}>
              <svg
                width="100%"
                height="40"
                viewBox="0 0 100 32"
                preserveAspectRatio="none"
                style={{ overflow: "visible" }}
              >
                <defs>
                  <linearGradient id={`gradient-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor={stat.color} stopOpacity="0.3" />
                    <stop offset="100%" stopColor={stat.color} stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path d={`${getSparklinePath(stat.sparkline)} L 100,32 L 0,32 Z`} fill={`url(#gradient-${index})`} />
                <path
                  className="sparkline-path"
                  d={getSparklinePath(stat.sparkline)}
                  fill="none"
                  stroke={stat.color}
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="100"
                  cy={
                    32 -
                    ((stat.sparkline[stat.sparkline.length - 1] - Math.min(...stat.sparkline)) /
                      (Math.max(...stat.sparkline) - Math.min(...stat.sparkline) || 1)) *
                      32
                  }
                  r="4"
                  fill={stat.color}
                />
              </svg>
            </div>

            <div
              style={{
                marginTop: "12px",
                fontSize: "12px",
                color: "#94a3b8",
              }}
            >
              vs. last period
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
