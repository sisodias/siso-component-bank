"use client"

import { useState, useMemo } from "react"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileNode[]
}

const sampleData: FileNode[] = [
  {
    id: "1",
    name: "src",
    type: "folder",
    children: [
      {
        id: "2",
        name: "components",
        type: "folder",
        children: [
          { id: "3", name: "Button.tsx", type: "file" },
          { id: "4", name: "Card.tsx", type: "file" },
          { id: "5", name: "Modal.tsx", type: "file" },
          { id: "6", name: "index.ts", type: "file" },
        ],
      },
      {
        id: "7",
        name: "hooks",
        type: "folder",
        children: [
          { id: "8", name: "useAuth.ts", type: "file" },
          { id: "9", name: "useTheme.ts", type: "file" },
        ],
      },
      {
        id: "10",
        name: "styles",
        type: "folder",
        children: [
          { id: "11", name: "globals.css", type: "file" },
          { id: "12", name: "variables.scss", type: "file" },
        ],
      },
      { id: "13", name: "App.tsx", type: "file" },
      { id: "14", name: "main.tsx", type: "file" },
    ],
  },
  {
    id: "15",
    name: "public",
    type: "folder",
    children: [
      { id: "16", name: "index.html", type: "file" },
      { id: "17", name: "robots.txt", type: "file" },
    ],
  },
  { id: "18", name: "package.json", type: "file" },
  { id: "19", name: "tsconfig.json", type: "file" },
  { id: "20", name: "vite.config.ts", type: "file" },
  { id: "21", name: ".gitignore", type: "file" },
  { id: "22", name: "README.md", type: "file" },
]

const getFileIcon = (filename: string) => {
  const ext = filename.split(".").pop()?.toLowerCase() || ""
  const iconMap: Record<string, { bg: string; fg: string; text: string }> = {
    tsx: { bg: "#1e3a5f", fg: "#3178c6", text: "TSX" },
    ts: { bg: "#1e3a5f", fg: "#3178c6", text: "TS" },
    jsx: { bg: "#1a2f3a", fg: "#61dafb", text: "JSX" },
    js: { bg: "#3d3a1e", fg: "#f7df1e", text: "JS" },
    css: { bg: "#1e2a5f", fg: "#264de4", text: "CSS" },
    scss: { bg: "#3d2a3a", fg: "#cf649a", text: "SC" },
    json: { bg: "#3d3a1e", fg: "#cbcb41", text: "{}" },
    html: { bg: "#3d2a1e", fg: "#e34c26", text: "HT" },
    md: { bg: "#1e2a3d", fg: "#083fa1", text: "MD" },
    txt: { bg: "#2a2a2a", fg: "#9ca3af", text: "TXT" },
    gitignore: { bg: "#3d2a1e", fg: "#f05032", text: "GIT" },
  }
  return iconMap[ext] || iconMap[filename.replace(".", "")] || { bg: "#2a2a2a", fg: "#6b7280", text: "F" }
}

export function Component() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["1", "2"]))
  const [selected, setSelected] = useState<string | null>("13")
  const [searchQuery, setSearchQuery] = useState("")
  const [searchFocused, setSearchFocused] = useState(false)

  const toggleExpand = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

  const flattenTree = (nodes: FileNode[], path: string[] = []): { node: FileNode; path: string[] }[] => {
    let result: { node: FileNode; path: string[] }[] = []
    for (const node of nodes) {
      result.push({ node, path })
      if (node.children) {
        result = result.concat(flattenTree(node.children, [...path, node.name]))
      }
    }
    return result
  }

  const filteredItems = useMemo(() => {
    if (!searchQuery.trim()) return null
    const flat = flattenTree(sampleData)
    return flat.filter(({ node }) => node.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [searchQuery])

  const renderNode = (node: FileNode, depth = 0) => {
    const isExpanded = expanded.has(node.id)
    const isSelected = selected === node.id
    const icon = node.type === "file" ? getFileIcon(node.name) : null

    return (
      <div key={node.id}>
        <div
          onClick={() => {
            setSelected(node.id)
            if (node.type === "folder") toggleExpand(node.id)
          }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "5px 12px",
            paddingLeft: `${depth * 12 + 12}px`,
            cursor: "pointer",
            backgroundColor: isSelected ? "#2d3748" : "transparent",
            borderLeft: isSelected ? "2px solid #60a5fa" : "2px solid transparent",
            transition: "all 0.1s ease",
          }}
          onMouseEnter={(e) => {
            if (!isSelected) e.currentTarget.style.backgroundColor = "#1e2533"
          }}
          onMouseLeave={(e) => {
            if (!isSelected) e.currentTarget.style.backgroundColor = "transparent"
          }}
        >
          {node.type === "folder" ? (
            <>
              <span
                style={{
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.15s ease",
                  display: "flex",
                  alignItems: "center",
                  color: "#6b7280",
                }}
              >
                <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={isExpanded ? "#60a5fa" : "#3b82f6"}
                style={{ opacity: isExpanded ? 1 : 0.7 }}
              >
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </>
          ) : (
            <>
              <span style={{ width: "10px" }} />
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  borderRadius: "2px",
                  backgroundColor: icon?.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "6px",
                  fontWeight: 700,
                  color: icon?.fg,
                  flexShrink: 0,
                }}
              >
                {icon?.text}
              </div>
            </>
          )}
          <span
            style={{
              fontSize: "13px",
              fontWeight: 400,
              color: isSelected ? "#f3f4f6" : "#d1d5db",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {node.name}
          </span>
        </div>

        {node.type === "folder" && node.children && (
          <div
            style={{
              overflow: "hidden",
              maxHeight: isExpanded ? `${node.children.length * 100}px` : "0",
              opacity: isExpanded ? 1 : 0,
              transition: "all 0.2s ease-in-out",
            }}
          >
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      <style jsx>{`
        @keyframes highlightPulse {
          0%,
          100% {
            background-color: #2d3748;
          }
          50% {
            background-color: #374151;
          }
        }
      `}</style>
      <div
        style={{
          width: "260px",
          height: "500px",
          backgroundColor: "#111827",
          borderRadius: "8px",
          overflow: "hidden",
          fontFamily: '"JetBrains Mono", "Fira Code", "SF Mono", Consolas, monospace',
          display: "flex",
          flexDirection: "column",
          border: "1px solid #1f2937",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "10px 12px",
            borderBottom: "1px solid #1f2937",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            backgroundColor: "#0d1117",
          }}
        >
          <span
            style={{
              fontSize: "11px",
              fontWeight: 600,
              color: "#9ca3af",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
          >
            Explorer
          </span>
          <div style={{ display: "flex", gap: "8px" }}>
            {["M12 5v14M5 12h14", "M3 12h18M3 6h18M3 18h18", "M4 4h16v16H4z"].map((d, i) => (
              <button
                key={i}
                style={{
                  background: "none",
                  border: "none",
                  padding: "4px",
                  cursor: "pointer",
                  color: "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  borderRadius: "4px",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#1f2937")}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d={d} />
                </svg>
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: "8px 12px", borderBottom: "1px solid #1f2937" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 10px",
              backgroundColor: "#1f2937",
              borderRadius: "6px",
              border: searchFocused ? "1px solid #3b82f6" : "1px solid transparent",
              transition: "border 0.15s ease",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6b7280" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="M21 21l-4.35-4.35" />
            </svg>
            <input
              type="text"
              placeholder="Search files..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              style={{
                background: "none",
                border: "none",
                outline: "none",
                color: "#e5e7eb",
                fontSize: "12px",
                width: "100%",
                fontFamily: "inherit",
              }}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                style={{
                  background: "none",
                  border: "none",
                  padding: "2px",
                  cursor: "pointer",
                  color: "#6b7280",
                  display: "flex",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* File Tree */}
        <div style={{ flex: 1, overflowY: "auto", paddingTop: "4px" }}>
          {filteredItems ? (
            filteredItems.length > 0 ? (
              <div>
                <div style={{ padding: "4px 12px", fontSize: "10px", color: "#6b7280", textTransform: "uppercase" }}>
                  {filteredItems.length} result{filteredItems.length !== 1 ? "s" : ""}
                </div>
                {filteredItems.map(({ node, path }) => {
                  const icon = node.type === "file" ? getFileIcon(node.name) : null
                  return (
                    <div
                      key={node.id}
                      onClick={() => setSelected(node.id)}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        padding: "6px 12px",
                        cursor: "pointer",
                        backgroundColor: selected === node.id ? "#2d3748" : "transparent",
                        borderLeft: selected === node.id ? "2px solid #60a5fa" : "2px solid transparent",
                      }}
                      onMouseEnter={(e) => {
                        if (selected !== node.id) e.currentTarget.style.backgroundColor = "#1e2533"
                      }}
                      onMouseLeave={(e) => {
                        if (selected !== node.id) e.currentTarget.style.backgroundColor = "transparent"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {node.type === "folder" ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="#3b82f6">
                            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                          </svg>
                        ) : (
                          <div
                            style={{
                              width: "14px",
                              height: "14px",
                              borderRadius: "2px",
                              backgroundColor: icon?.bg,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: "5px",
                              fontWeight: 700,
                              color: icon?.fg,
                            }}
                          >
                            {icon?.text}
                          </div>
                        )}
                        <span style={{ fontSize: "12px", color: "#e5e7eb" }}>{node.name}</span>
                      </div>
                      {path.length > 0 && (
                        <span style={{ fontSize: "10px", color: "#6b7280", marginLeft: "20px", marginTop: "2px" }}>
                          {path.join(" / ")}
                        </span>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div
                style={{
                  padding: "20px",
                  textAlign: "center",
                  color: "#6b7280",
                  fontSize: "12px",
                }}
              >
                No files found
              </div>
            )
          ) : (
            sampleData.map((node) => renderNode(node))
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "8px 12px",
            borderTop: "1px solid #1f2937",
            backgroundColor: "#0d1117",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "10px", color: "#6b7280" }}>22 files</span>
          <span style={{ fontSize: "10px", color: "#6b7280" }}>TypeScript Project</span>
        </div>
      </div>
    </>
  )
}
