"use client"

import type React from "react"

import { useState, useCallback } from "react"

interface FileNode {
  id: string
  name: string
  type: "file" | "folder"
  children?: FileNode[]
  fileType?: string
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
          { id: "3", name: "Button.tsx", type: "file", fileType: "tsx" },
          { id: "4", name: "Card.tsx", type: "file", fileType: "tsx" },
          { id: "5", name: "styles.css", type: "file", fileType: "css" },
        ],
      },
      {
        id: "6",
        name: "utils",
        type: "folder",
        children: [
          { id: "7", name: "helpers.ts", type: "file", fileType: "ts" },
          { id: "8", name: "constants.json", type: "file", fileType: "json" },
        ],
      },
      { id: "9", name: "index.tsx", type: "file", fileType: "tsx" },
    ],
  },
  {
    id: "10",
    name: "public",
    type: "folder",
    children: [
      { id: "11", name: "logo.svg", type: "file", fileType: "svg" },
      { id: "12", name: "favicon.ico", type: "file", fileType: "ico" },
    ],
  },
  { id: "13", name: "package.json", type: "file", fileType: "json" },
  { id: "14", name: "README.md", type: "file", fileType: "md" },
]

const fileIcons: Record<string, { color: string; label: string }> = {
  tsx: { color: "#3178c6", label: "TS" },
  ts: { color: "#3178c6", label: "TS" },
  jsx: { color: "#61dafb", label: "JS" },
  js: { color: "#f7df1e", label: "JS" },
  css: { color: "#264de4", label: "CS" },
  json: { color: "#cbcb41", label: "{}" },
  md: { color: "#083fa1", label: "MD" },
  svg: { color: "#ffb13b", label: "SV" },
  ico: { color: "#a855f7", label: "IC" },
  default: { color: "#6b7280", label: "F" },
}

export function Component() {
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["1"]))
  const [selected, setSelected] = useState<string | null>(null)
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; nodeId: string } | null>(null)
  const [dragOver, setDragOver] = useState<string | null>(null)
  const [dragging, setDragging] = useState<string | null>(null)

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

  const handleContextMenu = useCallback((e: React.MouseEvent, nodeId: string) => {
    e.preventDefault()
    setContextMenu({ x: e.clientX, y: e.clientY, nodeId })
  }, [])

  const closeContextMenu = () => setContextMenu(null)

  const handleDragStart = (e: React.DragEvent, nodeId: string) => {
    setDragging(nodeId)
    e.dataTransfer.effectAllowed = "move"
  }

  const handleDragOver = (e: React.DragEvent, nodeId: string) => {
    e.preventDefault()
    setDragOver(nodeId)
  }

  const handleDragLeave = () => setDragOver(null)

  const handleDrop = (e: React.DragEvent, targetId: string) => {
    e.preventDefault()
    setDragOver(null)
    setDragging(null)
    // In a real implementation, you would handle the file move here
  }

  const handleDragEnd = () => {
    setDragging(null)
    setDragOver(null)
  }

  const renderNode = (node: FileNode, depth = 0) => {
    const isExpanded = expanded.has(node.id)
    const isSelected = selected === node.id
    const isDragOver = dragOver === node.id
    const isDragging = dragging === node.id
    const icon = node.fileType ? fileIcons[node.fileType] || fileIcons.default : null

    return (
      <div key={node.id} style={{ opacity: isDragging ? 0.5 : 1 }}>
        <div
          draggable
          onDragStart={(e) => handleDragStart(e, node.id)}
          onDragOver={(e) => node.type === "folder" && handleDragOver(e, node.id)}
          onDragLeave={handleDragLeave}
          onDrop={(e) => node.type === "folder" && handleDrop(e, node.id)}
          onDragEnd={handleDragEnd}
          onClick={() => {
            setSelected(node.id)
            if (node.type === "folder") toggleExpand(node.id)
          }}
          onContextMenu={(e) => handleContextMenu(e, node.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
            padding: "6px 12px",
            paddingLeft: `${depth * 16 + 12}px`,
            cursor: "pointer",
            borderRadius: "6px",
            margin: "2px 8px",
            backgroundColor: isDragOver
              ? "rgba(139, 92, 246, 0.2)"
              : isSelected
                ? "rgba(139, 92, 246, 0.15)"
                : "transparent",
            border: isDragOver ? "2px dashed #8b5cf6" : "2px solid transparent",
            transition: "all 0.15s ease",
          }}
          onMouseEnter={(e) => {
            if (!isSelected && !isDragOver) {
              e.currentTarget.style.backgroundColor = "rgba(139, 92, 246, 0.08)"
            }
          }}
          onMouseLeave={(e) => {
            if (!isSelected && !isDragOver) {
              e.currentTarget.style.backgroundColor = "transparent"
            }
          }}
        >
          {node.type === "folder" ? (
            <>
              <span
                style={{
                  transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)",
                  transition: "transform 0.2s ease",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </span>
              <svg width="18" height="18" viewBox="0 0 24 24" fill={isExpanded ? "#8b5cf6" : "#a78bfa"}>
                {isExpanded ? (
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2v11z" />
                ) : (
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                )}
              </svg>
            </>
          ) : (
            <>
              <span style={{ width: "12px" }} />
              <div
                style={{
                  width: "18px",
                  height: "18px",
                  borderRadius: "3px",
                  backgroundColor: icon?.color || "#6b7280",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "8px",
                  fontWeight: 700,
                  color: "#fff",
                }}
              >
                {icon?.label}
              </div>
            </>
          )}
          <span
            style={{
              fontSize: "13px",
              fontWeight: node.type === "folder" ? 500 : 400,
              color: isSelected ? "#7c3aed" : "#374151",
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
              transition: "all 0.25s ease-in-out",
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
      <div
        style={{
          width: "320px",
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          boxShadow: "0 4px 24px rgba(139, 92, 246, 0.12), 0 0 0 1px rgba(139, 92, 246, 0.08)",
          padding: "16px 0",
          fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          userSelect: "none",
        }}
        onClick={closeContextMenu}
      >
        <div
          style={{
            padding: "0 16px 12px",
            borderBottom: "1px solid #f3f4f6",
            marginBottom: "8px",
          }}
        >
          <h3 style={{ fontSize: "14px", fontWeight: 600, color: "#1f2937", margin: 0 }}>File Explorer</h3>
        </div>

        {sampleData.map((node) => renderNode(node))}
      </div>

      {contextMenu && (
        <div
          style={{
            position: "fixed",
            top: contextMenu.y,
            left: contextMenu.x,
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
            padding: "4px 0",
            minWidth: "160px",
            zIndex: 1000,
            animation: "fadeIn 0.15s ease",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {["New File", "New Folder", "Rename", "Copy", "Cut", "Delete"].map((action, i) => (
            <div
              key={action}
              onClick={closeContextMenu}
              style={{
                padding: "8px 16px",
                fontSize: "13px",
                color: action === "Delete" ? "#ef4444" : "#374151",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                borderTop: i === 5 ? "1px solid #f3f4f6" : "none",
                marginTop: i === 5 ? "4px" : 0,
                paddingTop: i === 5 ? "12px" : "8px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#f9fafb")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
            >
              {action}
            </div>
          ))}
        </div>
      )}
    </>
  )
}
