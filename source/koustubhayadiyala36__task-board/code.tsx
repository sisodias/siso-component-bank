"use client"

import { useState } from "react"

interface Task {
  id: string
  title: string
}

interface Column {
  id: "todo" | "in-progress" | "done"
  title: string
  tasks: Task[]
}

const initialColumns: Column[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: "1", title: "Create project documentation" },
      { id: "2", title: "Design system components" },
      { id: "3", title: "Set up testing framework" },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      { id: "4", title: "Build authentication flow" },
      { id: "5", title: "API integration" },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      { id: "6", title: "Project setup" },
      { id: "7", title: "Database design" },
    ],
  },
]

export function Component() {
  const [columns, setColumns] = useState<Column[]>(initialColumns)
  const [dragging, setDragging] = useState<{ task: Task; fromColumn: string } | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)

  const columnStyles: Record<string, { accent: string; bg: string; badge: string }> = {
    todo: { accent: "#6366f1", bg: "#eef2ff", badge: "#c7d2fe" },
    "in-progress": { accent: "#f59e0b", bg: "#fffbeb", badge: "#fde68a" },
    done: { accent: "#10b981", bg: "#ecfdf5", badge: "#a7f3d0" },
  }

  const handleDragStart = (task: Task, columnId: string) => {
    setDragging({ task, fromColumn: columnId })
  }

  const handleDrop = (toColumnId: string) => {
    if (!dragging || dragging.fromColumn === toColumnId) {
      setDragging(null)
      setDropTarget(null)
      return
    }

    setColumns((prev) =>
      prev.map((col) => {
        if (col.id === dragging.fromColumn) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== dragging.task.id) }
        }
        if (col.id === toColumnId) {
          return { ...col, tasks: [...col.tasks, dragging.task] }
        }
        return col
      }),
    )

    setDragging(null)
    setDropTarget(null)
  }

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#fafafa", padding: "48px 24px" }}>
      <style jsx>{`
        @keyframes slide-in {
          from { opacity: 0; transform: translateY(-8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .task-card {
          transition: transform 0.15s ease, box-shadow 0.15s ease, opacity 0.15s ease;
          animation: slide-in 0.2s ease;
        }
        .task-card:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        .task-card.dragging {
          opacity: 0.4;
        }
        .column {
          transition: border-color 0.2s ease, background-color 0.2s ease;
        }
        .column.drop-active {
          border-style: dashed;
        }
      `}</style>

      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontSize: "32px", fontWeight: "700", color: "#18181b", marginBottom: "8px" }}>Task Board</h1>
          <p style={{ color: "#71717a" }}>Drag tasks between columns to update their status</p>
        </div>

        {/* Columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px" }}>
          {columns.map((column) => {
            const style = columnStyles[column.id]
            const isDropActive = dropTarget === column.id && dragging?.fromColumn !== column.id

            return (
              <div
                key={column.id}
                className={`column ${isDropActive ? "drop-active" : ""}`}
                onDragOver={(e) => {
                  e.preventDefault()
                  setDropTarget(column.id)
                }}
                onDrop={() => handleDrop(column.id)}
                onDragLeave={() => setDropTarget(null)}
                style={{
                  backgroundColor: isDropActive ? style.bg : "#ffffff",
                  borderRadius: "16px",
                  padding: "20px",
                  border: `2px solid ${isDropActive ? style.accent : "#e4e4e7"}`,
                  minHeight: "400px",
                }}
              >
                {/* Column Header */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: "10px",
                        height: "10px",
                        borderRadius: "50%",
                        backgroundColor: style.accent,
                      }}
                    />
                    <h2 style={{ fontSize: "16px", fontWeight: "600", color: "#18181b" }}>{column.title}</h2>
                  </div>
                  <span
                    style={{
                      backgroundColor: style.badge,
                      color: "#18181b",
                      fontSize: "13px",
                      fontWeight: "600",
                      padding: "4px 10px",
                      borderRadius: "9999px",
                    }}
                  >
                    {column.tasks.length}
                  </span>
                </div>

                {/* Tasks */}
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  {column.tasks.map((task) => (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task, column.id)}
                      onDragEnd={() => setDragging(null)}
                      className={`task-card ${dragging?.task.id === task.id ? "dragging" : ""}`}
                      style={{
                        backgroundColor: "#fafafa",
                        borderRadius: "10px",
                        padding: "14px 16px",
                        cursor: "grab",
                        borderLeft: `3px solid ${style.accent}`,
                      }}
                    >
                      <p style={{ fontSize: "14px", color: "#27272a", fontWeight: "500", margin: 0 }}>{task.title}</p>
                    </div>
                  ))}

                  {column.tasks.length === 0 && (
                    <div
                      style={{
                        padding: "32px 16px",
                        textAlign: "center",
                        color: "#a1a1aa",
                        fontSize: "14px",
                        borderRadius: "10px",
                        border: "2px dashed #e4e4e7",
                      }}
                    >
                      No tasks yet
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
