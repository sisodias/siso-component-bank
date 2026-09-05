"use client"

import { useState, useRef } from "react"
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { Home, Mail, Calendar, Camera, Music, Settings, FileText, MessageCircle, Globe, Folder } from 'lucide-react'

interface DockItem {
  id: string
  name: string
  icon: React.ReactNode
  color: string
}

const dockItems: DockItem[] = [
  { id: "finder", name: "Finder", icon: <Folder />, color: "bg-blue-500" },
  { id: "home", name: "Home", icon: <Home />, color: "bg-gray-600" },
  { id: "mail", name: "Mail", icon: <Mail />, color: "bg-blue-600" },
  { id: "calendar", name: "Calendar", icon: <Calendar />, color: "bg-red-500" },
  { id: "camera", name: "Camera", icon: <Camera />, color: "bg-gray-800" },
  { id: "music", name: "Music", icon: <Music />, color: "bg-gradient-to-br from-pink-500 to-purple-600" },
  { id: "messages", name: "Messages", icon: <MessageCircle />, color: "bg-green-500" },
  { id: "safari", name: "Safari", icon: <Globe />, color: "bg-blue-400" },
  { id: "notes", name: "Notes", icon: <FileText />, color: "bg-yellow-400" },
  { id: "settings", name: "Settings", icon: <Settings />, color: "bg-gray-500" },
]

function DockIcon({ item, mouseX }: { item: DockItem; mouseX: any }) {
  const ref = useRef<HTMLDivElement>(null)
  
  const distance = useTransform(mouseX, (val) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 }
    return val - bounds.x - bounds.width / 2
  })

  const widthSync = useTransform(distance, [-150, 0, 150], [50, 80, 50])
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 })

  const heightSync = useTransform(distance, [-150, 0, 150], [50, 80, 50])
  const height = useSpring(heightSync, { mass: 0.1, stiffness: 150, damping: 12 })

  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsClicked(true)}
      onMouseUp={() => setIsClicked(false)}
      className="aspect-square cursor-pointer flex items-center justify-center relative group"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className={`w-full h-full rounded-2xl shadow-lg flex items-center justify-center text-white relative overflow-hidden ${item.color}`}
        animate={{
          y: isClicked ? 2 : isHovered ? -8 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
      >
        <motion.div
          className="text-xl"
          animate={{
            scale: isHovered ? 1.1 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
        >
          {item.icon}
        </motion.div>
        
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-2xl"
          animate={{
            opacity: isHovered ? 0.3 : 0.1,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? -20 : 10,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-gray-800/90 text-white text-xs px-2 py-1 rounded-md whitespace-nowrap pointer-events-none backdrop-blur-sm"
      >
        {item.name}
      </motion.div>

      {/* Active indicator dot */}
      <motion.div
        className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white/80 rounded-full"
        animate={{
          scale: isClicked ? 1.5 : 1,
          opacity: isClicked ? 1 : 0.7,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </motion.div>
  )
}

export function DockTabs() {
  const mouseX = useMotionValue(Infinity)

  return (
    <div className="flex items-center justify-center min-h-screen p-8">
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="mx-auto flex h-20 items-end gap-4 rounded-3xl bg-gray-100/40 backdrop-blur-md px-4 pb-3.5 border-2 border-white/20 shadow-xl"
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
      >
        {dockItems.map((item) => (
          <DockIcon key={item.id} item={item} mouseX={mouseX} />
        ))}
      </motion.div>
    </div>
  )
}
