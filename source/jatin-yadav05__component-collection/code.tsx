"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, ChevronUp, ChevronDown, Search } from "lucide-react"

// Ask AI Button Component
function AskAIButton() {
  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="relative overflow-hidden rounded-2xl px-5 py-3 text-white font-medium text-[15px]
                 shadow-[0_2px_8px_rgba(0,0,0,0.08)]"
      style={{
        background: "linear-gradient(145deg, #f87c8d 0%, #c084d8 40%, #7c9bf5 100%)",
      }}
    >
      <span className="relative flex items-center gap-2">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="opacity-90">
          <path
            d="M12 2L13.5 8.5L20 10L13.5 11.5L12 18L10.5 11.5L4 10L10.5 8.5L12 2Z"
            fill="white"
            stroke="white"
            strokeWidth="1"
          />
          <path
            d="M18 14L18.75 16.25L21 17L18.75 17.75L18 20L17.25 17.75L15 17L17.25 16.25L18 14Z"
            fill="white"
            stroke="white"
            strokeWidth="0.5"
          />
        </svg>
        Ask AI
      </span>
    </motion.button>
  )
}

// User Chip Component
function UserChip({ name, avatar }: { name: string; avatar: string }) {
  const [isVisible, setIsVisible] = useState(true)

  const handleRemove = () => {
    setIsVisible(false)
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9, filter: "blur(4px)" }}
          transition={{ type: "spring", stiffness: 500, damping: 25 }}
          className="inline-flex items-center gap-2.5 bg-card rounded-full pl-1.5 pr-3 py-1.5
                     shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                     border border-border"
        >
          <img
            src={avatar || "/placeholder.svg?height=32&width=32&query=professional woman portrait"}
            alt={name}
            className="w-8 h-8 rounded-full object-cover"
          />
          <span className="text-[15px] font-medium text-foreground tracking-[-0.01em]">{name}</span>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleRemove}
            className="text-muted-foreground hover:text-foreground transition-colors duration-150 ml-0.5"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Upload Button Component
function UploadButton() {
  const [isDragging, setIsDragging] = useState(false)

  return (
    <motion.button
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      onDragOver={(e) => {
        e.preventDefault()
        setIsDragging(true)
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={() => setIsDragging(false)}
      className={`inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl
                  border-[1.5px] border-dashed transition-all duration-200 ease-out
                  ${
                    isDragging
                      ? "border-muted-foreground bg-muted text-muted-foreground"
                      : "border-border text-muted-foreground hover:border-muted-foreground hover:text-foreground"
                  }`}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M12 12v9" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M8 17l4-5 4 5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="font-medium text-[15px]">Upload</span>
    </motion.button>
  )
}

// Filter Chip Component
function FilterChip({ count }: { count: number }) {
  const [localCount, setLocalCount] = useState(count)

  const handleClear = () => {
    setLocalCount(0)
  }

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      className="inline-flex items-center bg-card rounded-xl
                 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                 border border-border overflow-hidden"
    >
      <div className="flex items-center gap-2 px-4 py-2.5">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
          className="text-muted-foreground"
        >
          <path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className="text-[15px] font-medium text-foreground">Filter</span>
        <AnimatePresence mode="wait">
          {localCount > 0 && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[15px] font-semibold text-primary"
            >
              · {localCount}
            </motion.span>
          )}
        </AnimatePresence>
      </div>
      <AnimatePresence>
        {localCount > 0 && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "auto", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className="flex items-center overflow-hidden"
          >
            <div className="w-px h-5 bg-border" />
            <motion.button
              whileHover={{ backgroundColor: "hsl(var(--muted))" }}
              whileTap={{ scale: 0.95 }}
              onClick={handleClear}
              className="px-3 py-2.5 text-muted-foreground hover:text-foreground transition-colors duration-150"
            >
              <X className="w-4 h-4" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// Alignment Toggle Component
function AlignmentToggle() {
  const [alignment, setAlignment] = useState<"left" | "center" | "right">("left")

  const options: { value: "left" | "center" | "right"; lines: number[] }[] = [
    { value: "left", lines: [16, 12, 14] },
    { value: "center", lines: [12, 16, 10] },
    { value: "right", lines: [10, 14, 16] },
  ]

  return (
    <div
      className="inline-flex items-center bg-card rounded-xl
                 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                 border border-border p-1"
    >
      {options.map(({ value, lines }) => (
        <motion.button
          key={value}
          onClick={() => setAlignment(value)}
          whileTap={{ scale: 0.95 }}
          className={`relative p-2.5 rounded-lg transition-colors duration-200
                     ${alignment === value ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {alignment === value && (
            <motion.div
              layoutId="alignment-bg"
              className="absolute inset-0 bg-muted rounded-lg"
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
          )}
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="relative z-10">
            {lines.map((width, i) => (
              <rect
                key={i}
                x={value === "left" ? 0 : value === "center" ? (18 - width) / 2 : 18 - width}
                y={2 + i * 6}
                width={width}
                height="2"
                rx="1"
                fill="currentColor"
              />
            ))}
          </svg>
        </motion.button>
      ))}
    </div>
  )
}

// Book Call Button Component
function BookCallButton() {
  const [duration, setDuration] = useState(30)
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  const durations = [15, 30, 45, 60]

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <div
      ref={containerRef}
      className="inline-flex items-center bg-card rounded-full
                 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                 border border-border pl-4 pr-1.5 py-1.5"
    >
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-1 text-[15px] font-medium text-muted-foreground hover:text-foreground
                     transition-colors duration-150 pr-3"
        >
          <span className="tabular-nums">{duration}</span>
          <span>mins</span>
          <div className="flex flex-col -space-y-1 ml-0.5">
            <ChevronUp className="w-3 h-3 text-muted-foreground" />
            <ChevronDown className="w-3 h-3 text-muted-foreground" />
          </div>
        </button>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -4, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 500, damping: 30 }}
              className="absolute bottom-full left-0 mb-2 bg-card rounded-xl
                         shadow-[0_4px_20px_rgba(0,0,0,0.1)] border border-border py-1.5 z-10 min-w-[90px]"
            >
              {durations.map((d) => (
                <motion.button
                  key={d}
                  whileHover={{ backgroundColor: "hsl(var(--muted))" }}
                  onClick={() => {
                    setDuration(d)
                    setIsOpen(false)
                  }}
                  className={`w-full px-4 py-2 text-[14px] text-left transition-colors
                             ${d === duration ? "text-primary font-medium" : "text-muted-foreground"}`}
                >
                  {d} mins
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className="rounded-full px-4 py-2 text-white font-medium text-[14px]"
        style={{
          background: "linear-gradient(135deg, #f9a05c 0%, #e87faf 50%, #9b8cef 100%)",
        }}
      >
        Book a Call
      </motion.button>
    </div>
  )
}

// Sidebar Toggle Component
function SidebarToggle() {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <motion.button
      onClick={() => setIsCollapsed(!isCollapsed)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className="p-3 bg-card rounded-xl
                 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                 border border-border
                 text-muted-foreground hover:text-foreground transition-colors duration-200"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <motion.line
          x1={isCollapsed ? 15 : 9}
          y1="3"
          x2={isCollapsed ? 15 : 9}
          y2="21"
          animate={{ x1: isCollapsed ? 15 : 9, x2: isCollapsed ? 15 : 9 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <motion.line
          x1="3"
          y1={isCollapsed ? 7 : 12}
          x2={isCollapsed ? 14 : 9}
          y2={isCollapsed ? 7 : 12}
          animate={{ x2: isCollapsed ? 14 : 9, y2: isCollapsed ? 7 : 12 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
        <motion.line
          x1="3"
          y1={isCollapsed ? 12 : 17}
          x2={isCollapsed ? 14 : 9}
          y2={isCollapsed ? 12 : 17}
          animate={{ x2: isCollapsed ? 14 : 9, y2: isCollapsed ? 12 : 17 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      </svg>
    </motion.button>
  )
}

// Status Badge Component
function StatusBadge({ status }: { status: "online" | "in-progress" }) {
  if (status === "online") {
    return (
      <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-50 dark:bg-emerald-950/30 rounded-xl border border-emerald-200 dark:border-emerald-800">
        <motion.span
          animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
          className="w-2 h-2 rounded-full bg-emerald-500"
        />
        <span className="text-[15px] font-medium text-emerald-600 dark:text-emerald-400">Online</span>
      </div>
    )
  }

  return (
    <div className="inline-flex items-center gap-2 px-4 py-2.5 bg-card rounded-xl border border-blue-200 dark:border-blue-800">
      <motion.svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      >
        <circle
          cx="8"
          cy="8"
          r="6"
          stroke="#3b82f6"
          strokeWidth="1.5"
          strokeDasharray="3 3"
          strokeLinecap="round"
          fill="none"
          opacity="0.3"
        />
        <path d="M8 2a6 6 0 0 1 6 6" stroke="#3b82f6" strokeWidth="1.5" strokeLinecap="round" fill="none" />
      </motion.svg>
      <span className="text-[15px] font-medium text-blue-500 dark:text-blue-400">In progress</span>
    </div>
  )
}

// Search Pill Component
function SearchPill() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleClose = () => {
    setQuery("")
    setIsExpanded(false)
  }

  const handleExpand = () => {
    setIsExpanded(true)
    setTimeout(() => {
      inputRef.current?.focus()
    }, 0)
  }

  return (
    <motion.div
      layout
      transition={{ type: "spring", stiffness: 500, damping: 30 }}
      onClick={!isExpanded ? handleExpand : undefined}
      className="inline-flex items-center bg-card rounded-full
                 shadow-[0_1px_3px_rgba(0,0,0,0.06),0_1px_2px_rgba(0,0,0,0.04)]
                 border border-border overflow-hidden cursor-pointer"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isExpanded ? (
          <motion.div
            key="expanded"
            initial={{ width: 120 }}
            animate={{ width: 200 }}
            exit={{ width: 120 }}
            onClick={(e) => e.stopPropagation()}
            className="flex items-center"
          >
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full pl-4 pr-2 py-2.5 text-[15px] text-foreground placeholder-muted-foreground outline-none bg-transparent"
            />
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  onClick={handleClose}
                  className="p-1.5 text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Close search"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="p-2 mr-1 text-muted-foreground hover:text-foreground transition-colors"
            >
              <Search className="w-4 h-4" />
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="collapsed"
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="flex items-center gap-3 px-4 py-2.5 text-muted-foreground hover:text-foreground
                       transition-colors duration-150"
          >
            <span className="text-[15px]">Search</span>
            <Search className="w-4 h-4" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen flex items-center justify-center p-8 w-full">
      <div className="flex flex-col items-center gap-6">
        {/* Row 1 */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <AskAIButton />
          <UserChip name="Ella M." avatar="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/professional-woman-smiling-headshot-G0Ik2DgCOJqKPVbEZ0awAUCmuLoALF.png" />
          <UploadButton />
        </div>

        {/* Row 2 */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <FilterChip count={2} />
          <AlignmentToggle />
          <BookCallButton />
        </div>

        {/* Row 3 */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <SidebarToggle />
          <StatusBadge status="online" />
          <StatusBadge status="in-progress" />
          <SearchPill />
        </div>
      </div>
    </main>
  )
}
