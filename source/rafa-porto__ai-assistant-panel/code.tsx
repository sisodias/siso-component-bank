'use client'

import { useState, useRef } from 'react'
import { X, Paperclip, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

interface AIAssistantPanelProps {
  isOpen: boolean
  onClose: () => void
}

export function AIAssistantPanel({ isOpen, onClose }: AIAssistantPanelProps) {
  const [message, setMessage] = useState('')
  const [userName] = useState('Sarah')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSend = () => {
    if (message.trim()) {
      console.log('Sending message:', message)
      setMessage('')
    }
  }

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div className={`fixed right-4 bottom-4 top-4 w-96 bg-card rounded-2xl shadow-lg z-50 flex flex-col transition-all duration-300 transform ${
        isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
      }`}>
        
        <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center text-center relative">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 p-1 hover:bg-secondary rounded-md transition"
          >
            <X size={20} />
          </button>

          <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <svg
              className="w-12 h-12"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 200 200"
              width="400"
              height="400"
            >
              <defs>
                <linearGradient id="starGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#fbbf24" stopOpacity="1">
                    <animate attributeName="stopColor" values="#fbbf24;#fcd34d;#fbbf24" dur="3s" repeatCount="indefinite" />
                  </stop>
                  <stop offset="100%" stopColor="#ec4899" stopOpacity="1">
                    <animate attributeName="stopColor" values="#ec4899;#f472b6;#ec4899" dur="3s" repeatCount="indefinite" />
                  </stop>
                </linearGradient>
              </defs>
              <g clipPath="url(#cs_clip_1_star-10)">
                <mask id="cs_mask_1_star-10" width="200" height="200" x="0" y="0" maskUnits="userSpaceOnUse">
                  <path fill="#fff" d="M91.317 6.8l.028-.098c2.483-8.71 14.826-8.71 17.31 0l.027.098.083.293a122 122 0 0084.142 84.142l.293.082.098.028c8.709 2.484 8.709 14.826 0 17.31a5.593 5.593 0 01-.098.028l-.293.082c-40.751 11.541-72.602 43.391-84.142 84.142l-.083.293-.027.098c-2.484 8.709-14.827 8.709-17.31 0a21.647 21.647 0 01-.028-.098l-.082-.293a122.002 122.002 0 00-84.143-84.142l-.292-.082-.098-.028c-8.71-2.484-8.71-14.826 0-17.31l.098-.028.292-.082A122 122 0 0091.235 7.093l.082-.293z"></path>
                </mask>
                <g mask="url(#cs_mask_1_star-10)">
                  <path fill="url(#starGradient)" d="M200 0H0v200h200V0z"></path>
                  <path fill="white" d="M91.317 6.8l.028-.098c2.483-8.71 14.826-8.71 17.31 0l.027.098.083.293a122 122 0 0084.142 84.142l.293.082.098.028c8.709 2.484 8.709 14.826 0 17.31a5.593 5.593 0 01-.098.028l-.293.082c-40.751 11.541-72.602 43.391-84.142 84.142l-.083.293-.027.098c-2.484 8.709-14.827 8.709-17.31 0a21.647 21.647 0 01-.028-.098l-.082-.293a122.002 122.002 0 00-84.143-84.142l-.292-.082-.098-.028c-8.71-2.484-8.71-14.826 0-17.31l.098-.028.292-.082A122 122 0 0091.235 7.093l.082-.293z"></path>
                </g>
              </g>
              <clipPath id="cs_clip_1_star-10">
                <path fill="#fff" d="M0 0H200V200H0z"></path>
              </clipPath>
            </svg>
          </div>

          {/* Greeting */}
          <p className="text-sm text-muted-foreground mb-1">
            Hi {userName},
          </p>
          <h2 className="text-xl font-bold mb-3">
            Welcome back! How can I help?
          </h2>
          <p className="text-sm text-muted-foreground mb-8">
            I'm here to assist you with your work. Choose from the options below or ask me anything!
          </p>

          <div className="grid grid-cols-3 gap-2 w-full mb-6">
            {[
              { label: 'Generate Ideas', icon: '💡' },
              { label: 'Write Content', icon: '✍️' },
              { label: 'Analyze Data', icon: '📊' },
              { label: 'Code Help', icon: '💻' },
              { label: 'Brainstorm', icon: '🧠' },
              { label: 'Learn', icon: '📚' },
            ].map((action) => (
              <Button
                key={action.label}
                variant="ghost"
                className="flex flex-col items-center gap-2 h-auto py-4 px-2 text-xs font-medium rounded-lg bg-secondary/60 hover:bg-secondary text-foreground transition-colors duration-200"
              >
                <span className="text-lg">{action.icon}</span>
                <span className="line-clamp-2">{action.label}</span>
              </Button>
            ))}
          </div>
        </div>

        <div className="p-4 space-y-3 bg-transparent">
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              if (e.target.files?.[0]) {
                setMessage(prev => `${prev} [File: ${e.target.files[0].name}]`)
              }
            }}
          />

          <div className="mx-1 px-4 py-3 bg-secondary/100 rounded-xl border border-secondary/50">
            <div className="space-y-3">
              <div className="flex gap-2 items-center">
                <Input
                  placeholder="Ask me anything..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="flex-1 border-0 bg-transparent placeholder:text-muted-foreground/60 focus-visible:ring-0 p-0"
                />
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground h-8 w-8 flex-shrink-0"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Paperclip className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="text-muted-foreground hover:text-foreground h-8 w-8 flex-shrink-0"
                  onClick={handleSend}
                  disabled={!message.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex justify-start">
                <Select defaultValue="gpt-v60">
                  <SelectTrigger className="w-40 h-8 shadow-none text-xs border-0 bg-transparent hover:bg-primary/10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gpt-v60">GPT</SelectItem>
                    <SelectItem value="gpt-4">Gemini</SelectItem>
                    <SelectItem value="claude">Claude</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
