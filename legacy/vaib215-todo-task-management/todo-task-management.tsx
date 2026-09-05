"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "../_utils/cn"

export interface TodoItem {
  id: string
  text: string
  completed: boolean
}

export interface TodoProps {
  initialTodos?: TodoItem[]
  className?: string
}

export function Todo({ initialTodos = [], className }: TodoProps) {
  const [todos, setTodos] = useState<TodoItem[]>(initialTodos)
  const [input, setInput] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingText, setEditingText] = useState("")
  const [transitioningItem, setTransitioningItem] = useState<{
    text: string
    id: string
    startY: number
  } | null>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  const addTodo = () => {
    if (input.trim()) {
      const inputRect = inputRef.current?.getBoundingClientRect()
      const listRect = listRef.current?.getBoundingClientRect()

      if (inputRect && listRect) {
        const newId = Date.now().toString()
        const startY = inputRect.top - listRect.top

        // Add the task immediately to the list
        setTodos([
          {
            id: newId,
            text: input.trim(),
            completed: false,
          },
          ...todos,
        ])

        // Set transitioning state to show the flying element
        setTransitioningItem({
          text: input.trim(),
          id: newId,
          startY,
        })

        setInput("")

        // Clear transitioning state after animation completes
        setTimeout(() => {
          setTransitioningItem(null)
        }, 400)
      }
    }
  }

  const toggleTodo = (id: string) => {
    setTodos(todos.map((todo) => (todo.id === id ? { ...todo, completed: !todo.completed } : todo)))
  }

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id))
  }

  const handleDoubleClick = (todo: TodoItem) => {
    setEditingId(todo.id)
    setEditingText(todo.text)
  }

  const saveEdit = () => {
    if (editingText.trim() && editingId) {
      setTodos(todos.map((todo) => (todo.id === editingId ? { ...todo, text: editingText.trim() } : todo)))
    }
    setEditingId(null)
    setEditingText("")
  }

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      saveEdit()
    } else if (e.key === "Escape") {
      setEditingId(null)
      setEditingText("")
    }
  }

  return (
    <div className={cn("w-full max-w-2xl mx-auto relative", className)}>
      {/* Input Section */}
      <div className="flex gap-0 border-b border-border relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && addTodo()}
          placeholder="Add a task..."
          className={cn(
            "flex-1 bg-transparent px-4 py-3 text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors",
            transitioningItem && "text-transparent",
          )}
        />
        <button
          onClick={addTodo}
          className="px-6 border-l border-border hover:bg-accent transition-colors duration-200"
        >
          <span className="text-sm font-medium">Add</span>
        </button>
      </div>

      {/* Todo List */}
      <div ref={listRef} className="divide-y divide-border relative">
        <AnimatePresence>
          {transitioningItem && (
            <motion.div
              initial={{
                y: transitioningItem.startY,
                opacity: 1,
              }}
              animate={{
                y: 0,
                opacity: 1,
              }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              transition={{
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1],
              }}
              className="absolute left-0 right-0 flex items-center gap-0 pointer-events-none z-10 bg-background"
            >
              <div className="w-12 h-12 border-r border-border" />
              <div className="flex-1 px-4 py-3">
                <span className="text-foreground">{transitioningItem.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence mode="popLayout">
          {todos.map((todo, index) => (
            <motion.div
              key={todo.id}
              layout
              initial={{
                opacity: transitioningItem?.id === todo.id ? 0 : 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
                transition: {
                  opacity: { duration: 0.2, delay: transitioningItem?.id === todo.id ? 0.4 : 0 },
                  height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
                },
              }}
              exit={{
                x: -500,
                opacity: 0,
                height: 0,
                transition: {
                  x: { duration: 0.3, ease: [0.4, 0, 1, 1] },
                  opacity: { duration: 0.2 },
                  height: { duration: 0.2, delay: 0.3 },
                },
              }}
              className="group flex items-center gap-0 hover:bg-accent/50 transition-all duration-200 overflow-hidden"
            >
              {/* Checkbox */}
              <button
                onClick={() => toggleTodo(todo.id)}
                className="flex items-center justify-center w-12 h-12 border-r border-border transition-colors"
              >
                <div
                  className={cn(
                    "w-4 h-4 border border-foreground transition-all duration-300",
                    todo.completed && "bg-foreground",
                  )}
                />
              </button>

              {/* Text */}
              <div className="flex-1 px-4 py-3" onDoubleClick={() => handleDoubleClick(todo)}>
                {editingId === todo.id ? (
                  <input
                    type="text"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={handleEditKeyDown}
                    onBlur={saveEdit}
                    autoFocus
                    className="w-full bg-transparent text-foreground focus:outline-none border-b border-foreground"
                  />
                ) : (
                  <span
                    className={cn(
                      "text-foreground transition-all duration-300",
                      todo.completed && "opacity-40 line-through decoration-foreground/40",
                    )}
                  >
                    {todo.text}
                  </span>
                )}
              </div>

              {/* Delete Button */}
              <button
                onClick={() => deleteTodo(todo.id)}
                className="w-12 h-12 border-l border-border opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-200"
              >
                <span className="text-sm">×</span>
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Stats */}
      {todos.length > 0 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <span>
            {todos.filter((t) => !t.completed).length} of {todos.length} tasks remaining
          </span>
          <button
            onClick={() => setTodos(todos.filter((t) => !t.completed))}
            className="hover:text-foreground transition-colors duration-200"
          >
            Clear completed
          </button>
        </div>
      )}
    </div>
  )
}
