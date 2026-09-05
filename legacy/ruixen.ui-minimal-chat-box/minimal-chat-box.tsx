"use client"

import * as React from "react"
import { motion, MotionConfig } from "framer-motion"
import { Input } from "./input"
import { MessageSquare, X, Send } from "lucide-react"

const transition = {
  type: "spring",
  bounce: 0,
  duration: 0.3,
}

export default function MinimalChatBox() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<string[]>([])
  const [input, setInput] = React.useState("")

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, input.trim()])
      setInput("")
    }
  }

  return (
    <MotionConfig transition={transition}>
      <div className="fixed bottom-6 right-6 z-50">
        <motion.div
          animate={{
            height: isOpen ? "400px" : "50px",
            width: isOpen ? "320px" : "50px",
          }}
          initial={false}
          className="flex flex-col shadow-md overflow-hidden
                     bg-white dark:bg-gray-900 rounded-md border border-gray-200 dark:border-gray-700"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-2 bg-gray-100 dark:bg-gray-800">
            {isOpen && <span className="font-medium text-gray-900 dark:text-gray-100">Chat</span>}
            <div
              className="flex items-center justify-center w-8 h-8 cursor-pointer rounded"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X size={18} className="text-gray-900 dark:text-gray-100" /> : <MessageSquare size={18} className="text-gray-900 dark:text-gray-100" />}
            </div>
          </div>

          {/* Messages */}
          {isOpen && (
            <div className="flex-1 px-4 py-2 overflow-y-auto flex flex-col gap-2 bg-white dark:bg-gray-900">
              {messages.length === 0 ? (
                <span className="text-gray-400 text-sm">No messages yet. Say hi!</span>
              ) : (
                messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className="self-start bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 rounded text-sm max-w-[85%]"
                  >
                    {msg}
                  </div>
                ))
              )}
            </div>
          )}

          {/* Input */}
          {isOpen && (
            <div className="flex items-center gap-2 px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
              <Input
                className="flex-1 h-10 rounded-md border border-gray-300 dark:border-gray-600 focus:ring-1 focus:ring-gray-500 focus:border-gray-500 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
              />
              <div
                className="flex items-center justify-center w-10 h-10 rounded-md bg-gray-800 dark:bg-gray-700 cursor-pointer hover:bg-gray-700 dark:hover:bg-gray-600"
                onClick={handleSend}
              >
                <Send size={18} className="text-white" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </MotionConfig>
  )
}
