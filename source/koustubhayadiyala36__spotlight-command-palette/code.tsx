"use client"

import { useState, useEffect, useRef, useMemo } from "react"

interface Command {
  id: string
  label: string
  category: string
  shortcut?: string
  icon: "search" | "file" | "settings" | "user" | "code" | "mail" | "calendar" | "folder" | "star" | "clock"
}

const commands: Command[] = [
  { id: "1", label: "Search Files", category: "General", shortcut: "⌘F", icon: "search" },
  { id: "2", label: "New Document", category: "General", shortcut: "⌘N", icon: "file" },
  { id: "3", label: "Open Settings", category: "General", shortcut: "⌘,", icon: "settings" },
  { id: "4", label: "View Profile", category: "Account", icon: "user" },
  { id: "5", label: "Open Terminal", category: "Developer", shortcut: "⌘T", icon: "code" },
  { id: "6", label: "Compose Email", category: "Communication", shortcut: "⌘E", icon: "mail" },
  { id: "7", label: "Open Calendar", category: "Productivity", icon: "calendar" },
  { id: "8", label: "Browse Projects", category: "General", icon: "folder" },
  { id: "9", label: "Starred Items", category: "General", icon: "star" },
  { id: "10", label: "Recent Activity", category: "General", icon: "clock" },
]

export function Component() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>(["dashboard", "settings", "profile"])
  const inputRef = useRef<HTMLInputElement>(null)

  const filteredCommands = useMemo(() => {
    if (!query) return commands
    const lowerQuery = query.toLowerCase()
    return commands.filter(
      (cmd) => cmd.label.toLowerCase().includes(lowerQuery) || cmd.category.toLowerCase().includes(lowerQuery),
    )
  }, [query])

  const groupedCommands = useMemo(() => {
    const groups: Record<string, Command[]> = {}
    filteredCommands.forEach((cmd) => {
      if (!groups[cmd.category]) groups[cmd.category] = []
      groups[cmd.category].push(cmd)
    })
    return groups
  }, [filteredCommands])

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus()
      setSelectedIndex(0)
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
      if (e.key === "Escape") {
        setIsOpen(false)
        setQuery("")
      }
      if (isOpen) {
        if (e.key === "ArrowDown") {
          e.preventDefault()
          setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1))
        }
        if (e.key === "ArrowUp") {
          e.preventDefault()
          setSelectedIndex((prev) => Math.max(prev - 1, 0))
        }
        if (e.key === "Enter" && filteredCommands[selectedIndex]) {
          e.preventDefault()
          handleSelect(filteredCommands[selectedIndex])
        }
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, filteredCommands, selectedIndex])

  const handleSelect = (cmd: Command) => {
    if (query && !recentSearches.includes(query)) {
      setRecentSearches((prev) => [query, ...prev.slice(0, 4)])
    }
    setIsOpen(false)
    setQuery("")
  }

  const getIcon = (icon: Command["icon"]) => {
    const props = { width: 18, height: 18, stroke: "#6b7280", strokeWidth: 1.5, fill: "none" }
    switch (icon) {
      case "search":
        return (
          <svg {...props} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        )
      case "file":
        return (
          <svg {...props} viewBox="0 0 24 24">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
            <polyline points="14 2 14 8 20 8" />
          </svg>
        )
      case "settings":
        return (
          <svg {...props} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
          </svg>
        )
      case "user":
        return (
          <svg {...props} viewBox="0 0 24 24">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
        )
      case "code":
        return (
          <svg {...props} viewBox="0 0 24 24">
            <polyline points="16 18 22 12 16 6" />
            <polyline points="8 6 2 12 8 18" />
          </svg>
        )
      case "mail":
        return (
          <svg {...props} viewBox="0 0 24 24">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        )
      case "calendar":
        return (
          <svg {...props} viewBox="0 0 24 24">
            <rect width="18" height="18" x="3" y="4" rx="2" />
            <path d="M16 2v4M8 2v4M3 10h18" />
          </svg>
        )
      case "folder":
        return (
          <svg {...props} viewBox="0 0 24 24">
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
        )
      case "star":
        return (
          <svg {...props} viewBox="0 0 24 24">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
          </svg>
        )
      case "clock":
        return (
          <svg {...props} viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        )
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .overlay {
          animation: fadeIn 0.15s ease-out forwards;
        }
        .palette {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>

      <div
        style={{
          minHeight: "400px",
          minWidth:"500px",
          background: "linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)",
          borderRadius: "16px",
          padding: "40px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        <button
          onClick={() => setIsOpen(true)}
          style={{
            padding: "14px 88px",
            borderRadius: "12px",
            border: "1px solid #e2e8f0",
            background: "white",
            color: "#374151",
            fontSize: "15px",
            fontWeight: "500",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.boxShadow = "0 8px 24px rgba(0,0,0,0.1)"
            e.currentTarget.style.transform = "translateY(-2px)"
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)"
            e.currentTarget.style.transform = "translateY(0)"
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          Quick Search...
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              background: "#f3f4f6",
              fontSize: "12px",
              color: "#6b7280",
              fontFamily: "monospace",
            }}
          >
            ⌘K
          </span>
        </button>

        <p style={{ color: "#64748b", fontSize: "14px", margin: 0 }}>Press ⌘K or click to open</p>
      </div>

      {isOpen && (
        <div
          className="overlay"
          onClick={() => {
            setIsOpen(false)
            setQuery("")
          }}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            paddingTop: "15vh",
            zIndex: 1000,
          }}
        >
          <div
            className="palette"
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "100%",
              maxWidth: "580px",
              background: "white",
              borderRadius: "16px",
              boxShadow: "0 25px 60px rgba(0,0,0,0.25)",
              overflow: "hidden",
            }}
          >
            {/* Search Input */}
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
                gap: "14px",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value)
                  setSelectedIndex(0)
                }}
                placeholder="Search commands..."
                style={{
                  flex: 1,
                  border: "none",
                  outline: "none",
                  fontSize: "17px",
                  color: "#111827",
                  background: "transparent",
                }}
              />
              {query && (
                <button
                  onClick={() => setQuery("")}
                  style={{
                    width: "24px",
                    height: "24px",
                    borderRadius: "6px",
                    border: "none",
                    background: "#f3f4f6",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Recent Searches */}
            {!query && recentSearches.length > 0 && (
              <div style={{ padding: "12px 20px", borderBottom: "1px solid #f3f4f6" }}>
                <p
                  style={{
                    margin: "0 0 10px",
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#9ca3af",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px",
                  }}
                >
                  Recent Searches
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
                  {recentSearches.map((search, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(search)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        border: "none",
                        background: "#f3f4f6",
                        color: "#4b5563",
                        fontSize: "13px",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        transition: "background 0.2s",
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = "#e5e7eb")}
                      onMouseLeave={(e) => (e.currentTarget.style.background = "#f3f4f6")}
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#9ca3af" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                      {search}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Results */}
            <div style={{ maxHeight: "360px", overflow: "auto" }}>
              {Object.entries(groupedCommands).map(([category, cmds]) => (
                <div key={category}>
                  <p
                    style={{
                      margin: 0,
                      padding: "12px 20px 8px",
                      fontSize: "11px",
                      fontWeight: "600",
                      color: "#9ca3af",
                      textTransform: "uppercase",
                      letterSpacing: "0.5px",
                    }}
                  >
                    {category}
                  </p>
                  {cmds.map((cmd) => {
                    const globalIndex = filteredCommands.findIndex((c) => c.id === cmd.id)
                    const isSelected = globalIndex === selectedIndex
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => handleSelect(cmd)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        style={{
                          width: "100%",
                          padding: "12px 20px",
                          border: "none",
                          background: isSelected ? "#f3f4f6" : "transparent",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "14px",
                          textAlign: "left",
                          transition: "background 0.15s",
                        }}
                      >
                        <div
                          style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: isSelected ? "white" : "#f9fafb",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: isSelected ? "0 2px 8px rgba(0,0,0,0.08)" : "none",
                          }}
                        >
                          {getIcon(cmd.icon)}
                        </div>
                        <span style={{ flex: 1, fontSize: "14px", fontWeight: "500", color: "#111827" }}>
                          {cmd.label}
                        </span>
                        {cmd.shortcut && (
                          <span
                            style={{
                              padding: "4px 8px",
                              borderRadius: "6px",
                              background: "#f3f4f6",
                              fontSize: "12px",
                              color: "#6b7280",
                              fontFamily: "monospace",
                            }}
                          >
                            {cmd.shortcut}
                          </span>
                        )}
                      </button>
                    )
                  })}
                </div>
              ))}
              {filteredCommands.length === 0 && (
                <div style={{ padding: "40px 20px", textAlign: "center", color: "#9ca3af" }}>
                  <p style={{ margin: 0, fontSize: "14px" }}>No results found for "{query}"</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "12px 20px",
                borderTop: "1px solid #f3f4f6",
                display: "flex",
                alignItems: "center",
                gap: "16px",
                fontSize: "12px",
                color: "#9ca3af",
              }}
            >
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <kbd style={{ padding: "2px 6px", borderRadius: "4px", background: "#f3f4f6", fontSize: "11px" }}>
                  ↑↓
                </kbd>
                Navigate
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <kbd style={{ padding: "2px 6px", borderRadius: "4px", background: "#f3f4f6", fontSize: "11px" }}>
                  ↵
                </kbd>
                Select
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                <kbd style={{ padding: "2px 6px", borderRadius: "4px", background: "#f3f4f6", fontSize: "11px" }}>
                  esc
                </kbd>
                Close
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
