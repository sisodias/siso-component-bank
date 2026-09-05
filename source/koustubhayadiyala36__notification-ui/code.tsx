"use client";

import { useState } from "react";
import { bell, bellIcon} from "lucide-react"
export function Component({
  notifications,
  onDelete,
  onMarkAsRead,
  onMarkAllAsRead,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [filter, setFilter] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;
  const filtered = filter === "all" ? notifications : notifications.filter((n) => !n.read);

  const formatTime = (date) => {
    const diff = Date.now() - date.getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const typeStyles = {
    success: { border: "#16a34a" },
    error: { border: "#dc2626" },
    info: { border: "#2563eb" },
    warning: { border: "#d97706" },
  };

  return (
    <>
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .panel {
          animation: slideIn 0.25s ease-out forwards;
        }
        .overlay {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .item {
          animation: slideIn 0.25s ease-out forwards;
        }
      `}</style>

      {/* Trigger */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          width: 44,
          height: 44,
          borderRadius: 10,
          border: "1px solid #e5e7eb",
          background: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* Icon */}
    <svg width="22" height="22" viewBox="0 0 24 24" stroke="#374151" fill="none" strokeWidth="2">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 01-3.46 0" />
        </svg>

        {/* Badge */}
        {unreadCount > 0 && (
          <span
            style={{
              position: "absolute",
              top: -4,
              right: -4,
              background: "#ef4444",
              color: "white",
              width: 20,
              height: 20,
              borderRadius: "50%",
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "2px solid white",
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          className="overlay"
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.25)",
            cursor: "pointer",
          }}
        />
      )}

      {/* Panel */}
      {isOpen && (
        <div
          className="panel"
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: 360,
            height: "100vh",
            background: "white",
            borderLeft: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            boxShadow: "-4px 0 16px rgba(0,0,0,0.1)",
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: 16,
              borderBottom: "1px solid #e5e7eb",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: 16 }}>Notifications</h3>
              <p style={{ margin: 0, fontSize: 13, color: "#6b7280" }}>{unreadCount} unread</p>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              style={{
                border: "none",
                background: "#f3f4f6",
                width: 28,
                height: 28,
                borderRadius: 6,
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          </div>

          {/* Filters */}
          <div style={{ padding: 12, borderBottom: "1px solid #e5e7eb", display: "flex", gap: 8 }}>
            {["all", "unread"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 14px",
                  borderRadius: 20,
                  background: filter === f ? "#2563eb" : "#f3f4f6",
                  color: filter === f ? "white" : "#374151",
                  border: "none",
                  cursor: "pointer",
                  fontSize: 13,
                }}
              >
                {f}
              </button>
            ))}

            <button
              onClick={onMarkAllAsRead}
              style={{
                marginLeft: "auto",
                background: "none",
                border: "none",
                color: "#2563eb",
                cursor: "pointer",
                fontSize: 13,
              }}
            >
              Mark all read
            </button>
          </div>

          {/* Notification List */}
          <div style={{ flex: 1, overflowY: "auto", padding: 12 }}>
            {filtered.length === 0 ? (
              <p style={{ textAlign: "center", padding: 40, color: "#9ca3af" }}>No notifications</p>
            ) : (
              filtered.map((n, idx) => (
                <div
                  key={n.id}
                  className="item"
                  style={{
                    background: n.read ? "#f9fafb" : "white",
                    borderLeft: `3px solid ${typeStyles[n.type].border}`,
                    padding: 12,
                    borderRadius: 8,
                    marginBottom: 8,
                    cursor: "pointer",
                    animationDelay: `${idx * 0.05}s`,
                  }}
                  onClick={() => onMarkAsRead?.(n.id)}
                >
                  <h4 style={{ margin: "0 0 4px", fontSize: 14 }}>{n.title}</h4>
                  <p style={{ margin: "0 0 6px", fontSize: 13, color: "#4b5563" }}>{n.message}</p>
                  <span style={{ fontSize: 11, color: "#6b7280" }}>{formatTime(n.timestamp)}</span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete?.(n.id);
                    }}
                    style={{
                      float: "right",
                      background: "none",
                      border: "none",
                      color: "#9ca3af",
                      cursor: "pointer",
                    }}
                  >
                    ✕
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
