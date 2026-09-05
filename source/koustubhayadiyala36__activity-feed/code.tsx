"use client"

import { useState } from "react"

interface Activity {
  id: string
  user: {
    name: string
    avatar: string
    initials: string
  }
  action: "liked" | "commented" | "shared" | "followed" | "mentioned"
  target?: string
  content?: string
  timestamp: Date
  isNew: boolean
}

const initialActivities: Activity[] = [
  {
    id: "1",
    user: { name: "Sarah Chen", avatar: "", initials: "SC" },
    action: "liked",
    target: "your post",
    timestamp: new Date(Date.now() - 1000 * 30),
    isNew: true,
  },
  {
    id: "2",
    user: { name: "Alex Morgan", avatar: "", initials: "AM" },
    action: "commented",
    target: "Project Update",
    content: "This looks amazing! Great work on the new design.",
    timestamp: new Date(Date.now() - 1000 * 60 * 5),
    isNew: true,
  },
  {
    id: "3",
    user: { name: "Jamie Lee", avatar: "", initials: "JL" },
    action: "followed",
    timestamp: new Date(Date.now() - 1000 * 60 * 15),
    isNew: true,
  },
  {
    id: "4",
    user: { name: "Chris Park", avatar: "", initials: "CP" },
    action: "shared",
    target: "your article",
    timestamp: new Date(Date.now() - 1000 * 60 * 45),
    isNew: false,
  },
  {
    id: "5",
    user: { name: "Taylor Swift", avatar: "", initials: "TS" },
    action: "mentioned",
    target: "Team Standup",
    content: "Hey @you, can you review this PR when you get a chance?",
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
    isNew: false,
  },
]

export function Component() {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)
  const [showNewIndicator, setShowNewIndicator] = useState(false)

  const formatTime = (date: Date) => {
    const diff = Date.now() - date.getTime()
    const seconds = Math.floor(diff / 1000)
    if (seconds < 60) return "Just now"
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const getActionText = (activity: Activity) => {
    switch (activity.action) {
      case "liked":
        return `liked ${activity.target}`
      case "commented":
        return `commented on ${activity.target}`
      case "shared":
        return `shared ${activity.target}`
      case "followed":
        return "started following you"
      case "mentioned":
        return `mentioned you in ${activity.target}`
    }
  }

  const getActionIcon = (action: Activity["action"]) => {
    const iconProps = { width: 14, height: 14, fill: "white" }
    switch (action) {
      case "liked":
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
        )
      case "commented":
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )
      case "shared":
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <circle cx="18" cy="5" r="3" />
            <circle cx="6" cy="12" r="3" />
            <circle cx="18" cy="19" r="3" />
            <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="white" strokeWidth="2" />
            <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="white" strokeWidth="2" />
          </svg>
        )
      case "followed":
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="8.5" cy="7" r="4" />
            <line x1="20" y1="8" x2="20" y2="14" stroke="white" strokeWidth="2" />
            <line x1="23" y1="11" x2="17" y2="11" stroke="white" strokeWidth="2" />
          </svg>
        )
      case "mentioned":
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="4" />
            <path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94" stroke="white" strokeWidth="2" fill="none" />
          </svg>
        )
    }
  }

  const getActionColor = (action: Activity["action"]) => {
    const colors = {
      liked: "#ef4444",
      commented: "#3b82f6",
      shared: "#10b981",
      followed: "#8b5cf6",
      mentioned: "#f59e0b",
    }
    return colors[action]
  }

  const addNewActivity = () => {
    const actions: Activity["action"][] = ["liked", "commented", "shared", "followed", "mentioned"]
    const names = ["Emma Wilson", "Liam Johnson", "Olivia Brown", "Noah Davis", "Ava Miller"]
    const randomAction = actions[Math.floor(Math.random() * actions.length)]
    const randomName = names[Math.floor(Math.random() * names.length)]

    const newActivity: Activity = {
      id: Math.random().toString(36).slice(2),
      user: {
        name: randomName,
        avatar: "",
        initials: randomName
          .split(" ")
          .map((n) => n[0])
          .join(""),
      },
      action: randomAction,
      target: randomAction === "followed" ? undefined : "your post",
      content: randomAction === "commented" ? "Great work! Love this." : undefined,
      timestamp: new Date(),
      isNew: true,
    }

    setShowNewIndicator(true)
    setTimeout(() => setShowNewIndicator(false), 2000)
    setActivities((prev) => [newActivity, ...prev.slice(0, 9)])
  }

  const handleLike = (id: string) => {
    setActivities((prev) =>
      prev.map((a) => (a.id === id ? { ...a, liked: !(a as Activity & { liked?: boolean }).liked } : a)),
    )
  }

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        @keyframes newBadge {
          0% {
            transform: scale(0);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }
        .activity-item {
          animation: slideIn 0.4s ease-out forwards;
        }
        .new-indicator {
          animation: pulse 1s ease-in-out infinite;
        }
        .new-badge {
          animation: newBadge 0.3s ease-out forwards;
        }
      `}</style>

      <div
        style={{
          maxWidth: "480px",
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px 24px",
            borderBottom: "1px solid #f3f4f6",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: "#111827" }}>Activity</h2>
            {showNewIndicator && (
              <span
                className="new-badge"
                style={{
                  padding: "2px 8px",
                  borderRadius: "10px",
                  background: "#dbeafe",
                  color: "#2563eb",
                  fontSize: "11px",
                  fontWeight: "600",
                }}
              >
                NEW
              </span>
            )}
          </div>
          <button
            onClick={addNewActivity}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              background: "#f3f4f6",
              color: "#374151",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}
          >
            + Simulate
          </button>
        </div>

        {/* Activity List */}
        <div style={{ maxHeight: "500px", overflow: "auto" }}>
          {activities.map((activity, index) => (
            <div
              key={activity.id}
              className="activity-item"
              style={{
                padding: "16px 24px",
                display: "flex",
                gap: "14px",
                borderBottom: "1px solid #f9fafb",
                background: activity.isNew ? "#fefce8" : "white",
                animationDelay: `${index * 0.05}s`,
                transition: "background 0.3s",
              }}
            >
              {/* Avatar */}
              <div style={{ position: "relative", flexShrink: 0 }}>
                <div
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: `linear-gradient(135deg, ${getActionColor(activity.action)}22, ${getActionColor(activity.action)}44)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: getActionColor(activity.action),
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  {activity.user.initials}
                </div>
                <div
                  style={{
                    position: "absolute",
                    bottom: "-2px",
                    right: "-2px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    background: getActionColor(activity.action),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid white",
                  }}
                >
                  {getActionIcon(activity.action)}
                </div>
              </div>

              {/* Content */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontSize: "14px", color: "#374151", lineHeight: "1.5" }}>
                  <span style={{ fontWeight: "600", color: "#111827" }}>{activity.user.name}</span>{" "}
                  {getActionText(activity)}
                </p>
                {activity.content && (
                  <p
                    style={{
                      margin: "8px 0 0",
                      padding: "10px 14px",
                      borderRadius: "10px",
                      background: "#f9fafb",
                      fontSize: "13px",
                      color: "#4b5563",
                      lineHeight: "1.5",
                    }}
                  >
                    {activity.content}
                  </p>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginTop: "10px" }}>
                  <span style={{ fontSize: "12px", color: "#9ca3af" }}>{formatTime(activity.timestamp)}</span>
                  <div style={{ display: "flex", gap: "8px" }}>
                    <button
                      onClick={() => handleLike(activity.id)}
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "none",
                        background: "transparent",
                        color: "#6b7280",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                      </svg>
                      Like
                    </button>
                    <button
                      style={{
                        padding: "4px 10px",
                        borderRadius: "6px",
                        border: "none",
                        background: "transparent",
                        color: "#6b7280",
                        fontSize: "12px",
                        fontWeight: "500",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "4px",
                        transition: "color 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.color = "#3b82f6")}
                      onMouseLeave={(e) => (e.currentTarget.style.color = "#6b7280")}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                      </svg>
                      Reply
                    </button>
                  </div>
                </div>
              </div>

              {/* New Indicator */}
              {activity.isNew && (
                <div
                  className="new-indicator"
                  style={{
                    width: "8px",
                    height: "8px",
                    borderRadius: "50%",
                    background: "#3b82f6",
                    flexShrink: 0,
                    marginTop: "6px",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
