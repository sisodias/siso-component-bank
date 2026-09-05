"use client"

import { useState } from "react"

interface Milestone {
  id: string
  title: string
  date: string
  description: string
  details: string[]
  status: "completed" | "current" | "upcoming"
}

const initialMilestones: Milestone[] = [
  {
    id: "1",
    title: "Project Kickoff",
    date: "Jan 15, 2024",
    description: "Initial planning and team assembly",
    details: ["Team formed", "Requirements gathered", "Timeline established"],
    status: "completed",
  },
  {
    id: "2",
    title: "Design Phase",
    date: "Feb 1, 2024",
    description: "UI/UX design and prototyping",
    details: ["Wireframes created", "Design system defined", "Prototype approved"],
    status: "completed",
  },
  {
    id: "3",
    title: "Development Sprint 1",
    date: "Mar 1, 2024",
    description: "Core features implementation",
    details: ["Authentication system", "Database setup", "API endpoints"],
    status: "current",
  },
  {
    id: "4",
    title: "Testing & QA",
    date: "Apr 15, 2024",
    description: "Quality assurance and bug fixes",
    details: ["Unit testing", "Integration testing", "User acceptance testing"],
    status: "upcoming",
  },
  {
    id: "5",
    title: "Launch",
    date: "May 1, 2024",
    description: "Product release and deployment",
    details: ["Production deployment", "Marketing launch", "User onboarding"],
    status: "upcoming",
  },
]

export function Component() {
  const [milestones] = useState<Milestone[]>(initialMilestones)
  const [expandedId, setExpandedId] = useState<string | null>("3")

  const completedCount = milestones.filter((m) => m.status === "completed").length
  const progress = (completedCount / milestones.length) * 100

  const getStatusColor = (status: Milestone["status"]) => {
    switch (status) {
      case "completed":
        return { bg: "#10b981", border: "#10b981", text: "#ffffff" }
      case "current":
        return { bg: "#3b82f6", border: "#3b82f6", text: "#ffffff" }
      case "upcoming":
        return { bg: "#f3f4f6", border: "#d1d5db", text: "#6b7280" }
    }
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "48px 24px" }}>
      <style jsx>{`
        @keyframes pulse-ring {
          0% {
            transform: scale(1);
            opacity: 1;
          }
          100% {
            transform: scale(1.5);
            opacity: 0;
          }
        }
        @keyframes check-draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        .milestone-dot {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .milestone-dot:hover {
          transform: scale(1.2);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }
        .milestone-card {
          transition: all 0.3s ease;
        }
        .milestone-card:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
        }
        .details-content {
          overflow: hidden;
          transition: max-height 0.3s ease, opacity 0.3s ease;
        }
        .progress-fill {
          transition: width 0.5s ease;
        }
      `}</style>

      <div style={{ maxWidth: "700px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: "32px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#111827", marginBottom: "8px" }}>
            Project Timeline
          </h1>
          <p style={{ color: "#6b7280", marginBottom: "16px" }}>Track your project milestones and progress</p>

          {/* Progress Bar */}
          <div style={{ backgroundColor: "#e5e7eb", borderRadius: "9999px", height: "8px", overflow: "hidden" }}>
            <div
              className="progress-fill"
              style={{
                width: `${progress}%`,
                height: "100%",
                backgroundColor: "#10b981",
                borderRadius: "9999px",
              }}
            />
          </div>
          <p style={{ fontSize: "14px", color: "#6b7280", marginTop: "8px" }}>
            {completedCount} of {milestones.length} milestones completed ({Math.round(progress)}%)
          </p>
        </div>

        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: "40px" }}>
          {/* Connecting Line */}
          <div
            style={{
              position: "absolute",
              left: "15px",
              top: "24px",
              bottom: "24px",
              width: "2px",
              backgroundColor: "#e5e7eb",
            }}
          />
          {/* Progress Line */}
          <div
            style={{
              position: "absolute",
              left: "15px",
              top: "24px",
              width: "2px",
              backgroundColor: "#10b981",
              height: `${(completedCount / milestones.length) * 100}%`,
              transition: "height 0.5s ease",
            }}
          />

          {milestones.map((milestone, index) => {
            const colors = getStatusColor(milestone.status)
            const isExpanded = expandedId === milestone.id

            return (
              <div
                key={milestone.id}
                style={{ position: "relative", marginBottom: index < milestones.length - 1 ? "32px" : "0" }}
              >
                {/* Milestone Dot */}
                <div
                  style={{
                    position: "absolute",
                    left: "-40px",
                    top: "24px",
                    transform: "translateY(-50%)",
                  }}
                >
                  {milestone.status === "current" && (
                    <div
                      style={{
                        position: "absolute",
                        inset: "-4px",
                        borderRadius: "50%",
                        backgroundColor: colors.bg,
                        opacity: 0.3,
                        animation: "pulse-ring 2s ease-out infinite",
                      }}
                    />
                  )}
                  <div
                    className="milestone-dot"
                    style={{
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: colors.bg,
                      border: `3px solid ${colors.border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      position: "relative",
                      zIndex: 1,
                    }}
                  >
                    {milestone.status === "completed" && (
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="white"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline
                          points="20 6 9 17 4 12"
                          style={{
                            strokeDasharray: 24,
                            strokeDashoffset: 24,
                            animation: "check-draw 0.3s ease forwards",
                          }}
                        />
                      </svg>
                    )}
                    {milestone.status === "current" && (
                      <div style={{ width: "10px", height: "10px", borderRadius: "50%", backgroundColor: "white" }} />
                    )}
                    {milestone.status === "upcoming" && (
                      <span style={{ fontSize: "12px", fontWeight: "600", color: colors.text }}>{index + 1}</span>
                    )}
                  </div>
                </div>

                {/* Card */}
                <div
                  className="milestone-card"
                  onClick={() => setExpandedId(isExpanded ? null : milestone.id)}
                  style={{
                    backgroundColor: "white",
                    borderRadius: "12px",
                    padding: "20px",
                    cursor: "pointer",
                    border: milestone.status === "current" ? "2px solid #3b82f6" : "1px solid #e5e7eb",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "flex-start",
                      marginBottom: "8px",
                    }}
                  >
                    <div>
                      <span
                        style={{
                          display: "inline-block",
                          padding: "2px 10px",
                          borderRadius: "9999px",
                          fontSize: "12px",
                          fontWeight: "500",
                          marginBottom: "8px",
                          backgroundColor:
                            milestone.status === "completed"
                              ? "#d1fae5"
                              : milestone.status === "current"
                                ? "#dbeafe"
                                : "#f3f4f6",
                          color:
                            milestone.status === "completed"
                              ? "#065f46"
                              : milestone.status === "current"
                                ? "#1e40af"
                                : "#6b7280",
                        }}
                      >
                        {milestone.status === "completed"
                          ? "Completed"
                          : milestone.status === "current"
                            ? "In Progress"
                            : "Upcoming"}
                      </span>
                      <h3 style={{ fontSize: "18px", fontWeight: "600", color: "#111827" }}>{milestone.title}</h3>
                    </div>
                    <span style={{ fontSize: "14px", color: "#6b7280", whiteSpace: "nowrap" }}>{milestone.date}</span>
                  </div>
                  <p style={{ color: "#6b7280", marginBottom: isExpanded ? "16px" : "0" }}>{milestone.description}</p>

                  {/* Expandable Details */}
                  <div
                    className="details-content"
                    style={{
                      maxHeight: isExpanded ? "200px" : "0",
                      opacity: isExpanded ? 1 : 0,
                    }}
                  >
                    <div style={{ paddingTop: "12px", borderTop: "1px solid #e5e7eb" }}>
                      <p style={{ fontSize: "14px", fontWeight: "500", color: "#374151", marginBottom: "8px" }}>
                        Details:
                      </p>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {milestone.details.map((detail, i) => (
                          <li
                            key={i}
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: "8px",
                              fontSize: "14px",
                              color: "#6b7280",
                              marginBottom: "4px",
                            }}
                          >
                            <div
                              style={{ width: "6px", height: "6px", borderRadius: "50%", backgroundColor: colors.bg }}
                            />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Expand Indicator */}
                  <div style={{ display: "flex", justifyContent: "center", marginTop: "8px" }}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9ca3af"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      style={{
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                      }}
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
