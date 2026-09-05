import React, { useState, useEffect, useRef } from 'react';
import { cn } from "../../lib/utils";
import { MoreHorizontal, Plus, X, GripVertical, Pencil, Sun, Moon } from "lucide-react";

// --- START Moved from trello-kanban-board.tsx ---

// Types
export interface KanbanTask {
  id: string
  title: string
  description?: string
  labels?: string[]
  assignee?: string
}

export interface KanbanColumn {
  id: string
  title: string
  tasks: KanbanTask[]
}

export interface KanbanBoardProps {
  columns: KanbanColumn[]
  onColumnsChange?: (columns: KanbanColumn[]) => void
  onTaskMove?: (taskId: string, fromColumnId: string, toColumnId: string) => void
  onTaskAdd?: (columnId: string, title: string) => void
  onColumnColorChange?: (columnId: string, color: string) => void
  labelColors?: Record<string, string>
  columnColors?: Record<string, string>
  className?: string
  allowAddTask?: boolean
}

const defaultLabelColors: Record<string, string> = {
  research: "bg-pink-500",
  design: "bg-violet-500",
  frontend: "bg-blue-500",
  backend: "bg-emerald-500",
  devops: "bg-amber-500",
  docs: "bg-slate-500",
  urgent: "bg-red-500",
}

const defaultColumnColors: Record<string, string> = {
  backlog: "#64748b", // slate-500
  todo: "#3b82f6", // blue-500
  "in-progress": "#f59e0b", // amber-500
  review: "#8b5cf6", // violet-500
  done: "#10b981", // emerald-500
}

function TaskEditModal({
  task,
  isOpen,
  onClose,
  onSave,
}: {
  task: KanbanTask | null
  isOpen: boolean
  onClose: () => void
  onSave: (updatedTask: KanbanTask) => void
}) {
  const [title, setTitle] = useState(task?.title || "")
  const [description, setDescription] = useState(task?.description || "")
  const [assignee, setAssignee] = useState(task?.assignee || "")
  const [labels, setLabels] = useState(task?.labels?.join(", ") || "")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
      setAssignee(task.assignee || "")
      setLabels(task.labels?.join(", ") || "")
    }
  }, [task])

  if (!isOpen || !task) return null

  const handleSave = () => {
    if (!title.trim()) return;
    
    onSave({
      ...task,
      title: title.trim(),
      description: description.trim() || undefined,
      assignee: assignee.trim() || undefined,
      labels: labels
        .split(",")
        .map((l) => l.trim())
        .filter((l) => l.length > 0),
    })
  }

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md rounded-lg border bg-background p-6 shadow-lg animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">Edit Task</h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium leading-none">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Task title"
              autoFocus
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm font-medium leading-none">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              placeholder="Add a description..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Assignee</label>
              <input
                type="text"
                value={assignee}
                onChange={(e) => setAssignee(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="e.g., JD"
              />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium leading-none">Labels</label>
              <input
                type="text"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                placeholder="design, bug"
              />
              <p className="text-[10px] text-muted-foreground">Comma separated</p>
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export function KanbanBoard({
  columns: initialColumns,
  onColumnsChange,
  onTaskMove,
  onTaskAdd,
  onColumnColorChange,
  labelColors = defaultLabelColors,
  columnColors = defaultColumnColors,
  className,
  allowAddTask = true,
}: KanbanBoardProps) {
  const [columns, setColumns] = useState<KanbanColumn[]>(initialColumns)
  const [draggedTask, setDraggedTask] = useState<{
    task: KanbanTask
    sourceColumnId: string
  } | null>(null)
  const [dropTarget, setDropTarget] = useState<string | null>(null)
  const [addingCardTo, setAddingCardTo] = useState<string | null>(null)
  const [newCardTitle, setNewCardTitle] = useState("")
  const [editingTask, setEditingTask] = useState<{
    task: KanbanTask
    columnId: string
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Update internal state when props change
  useEffect(() => {
    setColumns(initialColumns)
  }, [initialColumns])

  useEffect(() => {
    if (addingCardTo && inputRef.current) {
      inputRef.current.focus()
    }
  }, [addingCardTo])

  const handleDragStart = (task: KanbanTask, columnId: string) => {
    setDraggedTask({ task, sourceColumnId: columnId })
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setDropTarget(columnId)
  }

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask || draggedTask.sourceColumnId === targetColumnId) {
      setDraggedTask(null)
      setDropTarget(null)
      return
    }

    const newColumns = columns.map((col) => {
      if (col.id === draggedTask.sourceColumnId) {
        return { ...col, tasks: col.tasks.filter((t) => t.id !== draggedTask.task.id) }
      }
      if (col.id === targetColumnId) {
        return { ...col, tasks: [...col.tasks, draggedTask.task] }
      }
      return col
    })

    setColumns(newColumns)
    onColumnsChange?.(newColumns)
    onTaskMove?.(draggedTask.task.id, draggedTask.sourceColumnId, targetColumnId)
    setDraggedTask(null)
    setDropTarget(null)
  }

  const handleAddCard = (columnId: string) => {
    if (!newCardTitle.trim()) return

    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      title: newCardTitle.trim(),
      labels: [],
    }

    const newColumns = columns.map((col) => (col.id === columnId ? { ...col, tasks: [...col.tasks, newTask] } : col))

    setColumns(newColumns)
    onColumnsChange?.(newColumns)
    onTaskAdd?.(columnId, newCardTitle.trim())
    setNewCardTitle("")
    setAddingCardTo(null)
  }

  const handleSaveTask = (updatedTask: KanbanTask) => {
    if (!editingTask) return

    const newColumns = columns.map((col) => {
      if (col.id === editingTask.columnId) {
        return {
          ...col,
          tasks: col.tasks.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
        }
      }
      return col
    })

    setColumns(newColumns)
    onColumnsChange?.(newColumns)
    setEditingTask(null)
  }

  const getLabelColor = (label: string) => labelColors[label] || "bg-slate-500"

  const getColorStyles = (colorId: string) => {
    const color = columnColors[colorId] || "#64748b";
    // Check if it's a hex/rgb/hsl string or a tailwind class
    const isCssValue = color.startsWith("#") || color.startsWith("rgb") || color.startsWith("hsl");
    
    return {
      value: color,
      isCssValue,
      style: isCssValue ? { backgroundColor: color } : {},
      className: !isCssValue ? color : "",
    };
  }

  return (
    <>
      <div className={cn("flex gap-4 overflow-x-auto pb-4 items-start", className)}>
        {columns.map((column) => {
          const isDropActive = dropTarget === column.id && draggedTask?.sourceColumnId !== column.id
          const colorProps = getColorStyles(column.id);

          return (
            <div
              key={column.id}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDrop={() => handleDrop(column.id)}
              onDragLeave={() => setDropTarget(null)}
              className={cn(
                "min-w-[280px] max-w-[280px] rounded-xl p-3 transition-all duration-200",
                "bg-muted/50 border-2",
                isDropActive ? "border-primary/50 border-dashed bg-primary/5" : "border-transparent",
              )}
            >
              {/* Column Header */}
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  {/* Color Picker / Indicator */}
                  <div className="relative group flex items-center justify-center">
                    <div 
                      className={cn(
                        "h-4 w-4 rounded-full ring-1 ring-offset-1 ring-transparent transition-all group-hover:ring-border", 
                        colorProps.className
                      )} 
                      style={colorProps.style} 
                    />
                    <input 
                      type="color" 
                      value={colorProps.isCssValue ? colorProps.value : "#000000"} 
                      onChange={(e) => onColumnColorChange?.(column.id, e.target.value)}
                      className="absolute inset-0 h-full w-full opacity-0 cursor-pointer"
                      title="Change column color"
                    />
                  </div>
                  
                  <h2 className="text-sm font-semibold text-foreground">{column.title}</h2>
                  <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
                    {column.tasks.length}
                  </span>
                </div>
                <button
                  className="rounded p-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  aria-label="Column options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </div>

              {/* Tasks */}
              <div className="flex min-h-[100px] flex-col gap-2">
                {column.tasks.map((task) => {
                  const isDragging = draggedTask?.task.id === task.id

                  return (
                    <div
                      key={task.id}
                      draggable
                      onDragStart={() => handleDragStart(task, column.id)}
                      onDragEnd={() => setDraggedTask(null)}
                      className={cn(
                        "group relative cursor-grab rounded-lg border border-border bg-card p-3 shadow-sm transition-all duration-150",
                        "hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing",
                        isDragging && "rotate-2 opacity-50",
                      )}
                    >
                      {/* Action Buttons (Edit + Drag Handle) */}
                      <div className="absolute right-2 top-2 flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingTask({ task, columnId: column.id })
                          }}
                          className="rounded p-0.5 text-muted-foreground/50 hover:bg-muted hover:text-foreground"
                          aria-label="Edit task"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <div className="cursor-grab text-muted-foreground/30 hover:text-muted-foreground/80">
                          <GripVertical className="h-4 w-4" />
                        </div>
                      </div>

                      {task.labels && task.labels.length > 0 && (
                        <div className="mb-2 flex flex-wrap gap-1 pr-12">
                          {task.labels.map((label) => (
                            <span
                              key={label}
                              className={cn(
                                "rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase text-white",
                                getLabelColor(label),
                              )}
                            >
                              {label}
                            </span>
                          ))}
                        </div>
                      )}

                      <h3 className={cn("text-sm font-medium text-card-foreground pr-8", task.description && "mb-1")}>
                        {task.title}
                      </h3>

                      {task.description && <p className="mb-2 text-xs text-muted-foreground">{task.description}</p>}

                      {task.assignee && (
                        <div className="flex justify-end">
                          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                            {task.assignee}
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}

                {/* Add Card */}
                {allowAddTask && (
                  <>
                    {addingCardTo === column.id ? (
                      <div className="rounded-lg border border-border bg-card p-3 shadow-sm">
                        <input
                          ref={inputRef}
                          type="text"
                          value={newCardTitle}
                          onChange={(e) => setNewCardTitle(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddCard(column.id)}
                          placeholder="Enter card title..."
                          className="mb-2 w-full border-none bg-transparent text-sm text-card-foreground outline-none placeholder:text-muted-foreground"
                        />
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleAddCard(column.id)}
                            className="rounded bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                          >
                            Add Card
                          </button>
                          <button
                            onClick={() => {
                              setAddingCardTo(null)
                              setNewCardTitle("")
                            }}
                            className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                            aria-label="Cancel"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingCardTo(column.id)}
                        className="flex w-full items-center justify-center gap-1 rounded-lg p-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                      >
                        <Plus className="h-4 w-4" />
                        Add a card
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {editingTask && (
        <TaskEditModal
          task={editingTask.task}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onSave={handleSaveTask}
        />
      )}
    </>
  )
}

// --- END Moved from trello-kanban-board.tsx ---

const simpleColumns: KanbanColumn[] = [
  {
    id: "todo",
    title: "To Do",
    tasks: [
      { id: "1", title: "Create project documentation", labels: ["docs"], assignee: "JD" },
      { id: "2", title: "Design system components", labels: ["design", "urgent"], assignee: "AL" },
      { id: "3", title: "Set up testing framework", labels: ["devops"] },
    ],
  },
  {
    id: "in-progress",
    title: "In Progress",
    tasks: [
      { id: "4", title: "Build authentication flow", labels: ["backend"], assignee: "MK" },
      { id: "5", title: "API integration", description: "Connect to the payment gateway" },
    ],
  },
  {
    id: "done",
    title: "Done",
    tasks: [
      { id: "6", title: "Project setup", labels: ["devops"] },
      { id: "7", title: "Database design", labels: ["backend"] },
    ],
  },
];

const DEFAULT_COLUMN_COLORS_APP = {
  todo: "#3b82f6", // blue-500
  "in-progress": "#f59e0b", // amber-500
  done: "#10b981", // emerald-500
};

export default function App() {
  const [columns, setColumns] = useState<KanbanColumn[]>(simpleColumns);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Initialize colors from localStorage or default
  const [columnColors, setColumnColors] = useState<Record<string, string>>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("kanban-column-colors");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to parse saved colors", e);
        }
      }
    }
    return DEFAULT_COLUMN_COLORS_APP;
  });

  // Initialize theme
  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as 'light' | 'dark' | null;
    if (savedTheme) {
      setTheme(savedTheme);
    } else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setTheme('dark');
    }
  }, []);

  // Apply theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('app-theme', theme);
  }, [theme]);

  // Persist colors whenever they change
  useEffect(() => {
    localStorage.setItem("kanban-column-colors", JSON.stringify(columnColors));
  }, [columnColors]);

  const handleColumnColorChange = (columnId: string, color: string) => {
    setColumnColors(prev => ({
      ...prev,
      [columnId]: color
    }));
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return (
    <div className="w-full min-h-screen bg-background p-8 transition-colors duration-300">
      <div className="absolute top-4 right-4">
        <button
          onClick={toggleTheme}
          className="rounded-full p-2 text-foreground hover:bg-muted transition-colors"
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon className="h-6 w-6" /> : <Sun className="h-6 w-6" />}
        </button>
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mb-10 text-center">
          <h1 className="mb-2 text-3xl font-bold text-foreground">Task Board</h1>
          <p className="text-muted-foreground">Drag tasks between columns to update their status. Click the colored dot in a header to change its color.</p>
        </div>
        
        {/* Main Board Area */}
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <KanbanBoard
            columns={columns}
            onColumnsChange={setColumns}
            columnColors={columnColors}
            onColumnColorChange={handleColumnColorChange}
            allowAddTask={true}
          />
        </div>

        {/* Instructions/Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>Built with React, Tailwind CSS, and Lucide Icons.</p>
        </div>
      </div>
    </div>
  )
}