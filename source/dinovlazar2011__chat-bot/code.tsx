'use client'

import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'bot' | 'user'
  text: string
}

interface ChatWidgetProps {
  onSend?: (message: string) => Promise<string>
}

const WELCOME = "Welcome to E Corp Support. I'm Alex. How can I assist you today?"

// Pulse animation: 63 steps × 40ms ≈ 2520ms ≈ 2.5s cycle
const PULSE_STEPS = 63
// Dot bounce animation: 30 steps × 40ms = 1200ms cycle
const DOT_STEPS = 30

function getPulseBoxShadow(step: number): string {
  const t = step / PULSE_STEPS
  if (t < 0.6) {
    const p = t / 0.6
    const spread = (p * 10).toFixed(1)
    const alpha = (0.35 * (1 - p)).toFixed(3)
    return `0 0 0 ${spread}px rgba(255,255,255,${alpha})`
  }
  return '0 0 0 0px rgba(255,255,255,0)'
}

// delaySteps: 0 = dot1, 5 = dot2 (~200ms), 10 = dot3 (~400ms)
function getDotStyle(step: number, delaySteps: number): { transform: string; opacity: number } {
  const s = (step - delaySteps + DOT_STEPS * 10) % DOT_STEPS
  const t = s / DOT_STEPS
  let y = 0
  let opacity = 0.4
  if (t < 0.3) {
    const p = t / 0.3
    y = -5 * Math.sin((p * Math.PI) / 2)
    opacity = 0.4 + 0.6 * Math.sin((p * Math.PI) / 2)
  } else if (t < 0.6) {
    const p = (t - 0.3) / 0.3
    y = -5 * Math.cos((p * Math.PI) / 2)
    opacity = 1 - 0.6 * Math.sin((p * Math.PI) / 2)
  }
  return { transform: `translateY(${y.toFixed(2)}px)`, opacity }
}

const ECorpLogo = () => (
  <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" aria-label="E Corp">
    <text
      x="5"
      y="22"
      fontFamily="system-ui, -apple-system, sans-serif"
      fontSize="22"
      fontWeight="800"
      fill="white"
    >
      E
    </text>
  </svg>
)

const SendIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M22 2L11 13" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

export default function ChatWidget({ onSend }: ChatWidgetProps) {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([{ role: 'bot', text: WELCOME }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)

  // Animation states
  const [pulseStep, setPulseStep] = useState(0)
  const [dotStep, setDotStep] = useState(0)
  const [panelVisible, setPanelVisible] = useState(false)

  // Interaction states (hover/active/focus)
  const [triggerHover, setTriggerHover] = useState(false)
  const [triggerActive, setTriggerActive] = useState(false)
  const [sendHover, setSendHover] = useState(false)
  const [sendActive, setSendActive] = useState(false)
  const [textareaFocused, setTextareaFocused] = useState(false)

  const panelRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Pulse glow on trigger (runs always)
  useEffect(() => {
    const id = setInterval(() => setPulseStep((s) => (s + 1) % PULSE_STEPS), 40)
    return () => clearInterval(id)
  }, [])

  // Dot bounce (only while loading)
  useEffect(() => {
    if (!loading) {
      setDotStep(0)
      return
    }
    const id = setInterval(() => setDotStep((s) => (s + 1) % DOT_STEPS), 40)
    return () => clearInterval(id)
  }, [loading])

  // Panel scale-in: flip panelVisible after one frame so CSS transition fires
  useEffect(() => {
    if (!open) {
      setPanelVisible(false)
      return
    }
    setPanelVisible(false)
    const id = setTimeout(() => setPanelVisible(true), 16)
    return () => clearTimeout(id)
  }, [open])

  // Scroll to bottom on new messages / typing indicator
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  // Auto-resize textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = Math.min(ta.scrollHeight, 96) + 'px'
  }

  // Close on outside click
  const handleOutsideClick = useCallback((e: MouseEvent) => {
    if (
      panelRef.current &&
      !panelRef.current.contains(e.target as Node) &&
      triggerRef.current &&
      !triggerRef.current.contains(e.target as Node)
    ) {
      setOpen(false)
    }
  }, [])

  useEffect(() => {
    if (open) {
      document.addEventListener('mousedown', handleOutsideClick)
      setTimeout(() => textareaRef.current?.focus(), 100)
    } else {
      document.removeEventListener('mousedown', handleOutsideClick)
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [open, handleOutsideClick])

  const sendMessage = async () => {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: Message = { role: 'user', text }
    const next = [...messages, userMsg]
    setMessages(next)
    setInput('')
    if (textareaRef.current) textareaRef.current.style.height = 'auto'
    setLoading(true)

    try {
      let reply: string
      if (onSend) {
        reply = await onSend(text)
      } else {
        reply =
          'Thanks for reaching out to E Corp Support. A specialist will follow up shortly. Reference: EC-' +
          Math.floor(100000 + Math.random() * 900000)
      }
      setMessages((prev) => [...prev, { role: 'bot', text: reply }])
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'I apologize — there was a connection issue. Please try again.' },
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  // Derived style values
  const sendDisabled = loading || !input.trim()
  const triggerTransform = triggerActive ? 'scale(0.95)' : triggerHover ? 'scale(1.08)' : 'scale(1)'
  const sendTransform = sendActive && !sendDisabled ? 'scale(0.93)' : 'scale(1)'
  const sendBg = !sendDisabled && (sendHover || sendActive) ? '#c8050f' : '#e30613'

  return (
    <>
      {/* Trigger button */}
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        onMouseEnter={() => setTriggerHover(true)}
        onMouseLeave={() => { setTriggerHover(false); setTriggerActive(false) }}
        onMouseDown={() => setTriggerActive(true)}
        onMouseUp={() => setTriggerActive(false)}
        aria-label={open ? 'Close E Corp Support' : 'Open E Corp Support'}
        aria-expanded={open}
        style={{
          position: 'fixed',
          bottom: 24,
          left: 24,
          width: 56,
          height: 56,
          borderRadius: '50%',
          background: '#0a0a0a',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9998,
          padding: 0,
          boxShadow: getPulseBoxShadow(pulseStep),
          transform: triggerTransform,
          transition: 'transform 0.15s ease',
        }}
      >
        <ECorpLogo />
      </button>

      {/* Chat panel */}
      {open && (
        <div
          ref={panelRef}
          role="dialog"
          aria-label="E Corp Support Chat"
          style={{
            position: 'fixed',
            bottom: 92,
            left: 24,
            width: 380,
            maxWidth: 'calc(100vw - 48px)',
            height: 520,
            maxHeight: 'calc(100vh - 120px)',
            background: '#0a0a0a',
            border: '1px solid #222',
            borderRadius: 16,
            display: 'flex',
            flexDirection: 'column',
            zIndex: 9997,
            overflow: 'hidden',
            transformOrigin: 'bottom left',
            opacity: panelVisible ? 1 : 0,
            transform: panelVisible ? 'scale(1) translateY(0)' : 'scale(0.6) translateY(20px)',
            transition: 'opacity 0.2s, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
          }}
        >
          {/* Messages area */}
          <div
            role="log"
            aria-live="polite"
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: 16,
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
            }}
          >
            {messages.map((m, i) => (
              <div
                key={i}
                style={{
                  maxWidth: '80%',
                  padding: '10px 14px',
                  borderRadius: 14,
                  fontFamily: 'system-ui, -apple-system, sans-serif',
                  fontSize: 14,
                  lineHeight: 1.5,
                  wordBreak: 'break-word',
                  whiteSpace: 'pre-wrap',
                  ...(m.role === 'bot'
                    ? {
                        alignSelf: 'flex-start',
                        background: '#1a1a1a',
                        color: '#f0f0f0',
                        borderBottomLeftRadius: 4,
                      }
                    : {
                        alignSelf: 'flex-end',
                        background: '#e30613',
                        color: '#fff',
                        borderBottomRightRadius: 4,
                      }),
                }}
              >
                {m.text}
              </div>
            ))}

            {/* Typing indicator */}
            {loading && (
              <div
                aria-label="Alex is typing"
                style={{
                  alignSelf: 'flex-start',
                  background: '#1a1a1a',
                  borderRadius: 14,
                  borderBottomLeftRadius: 4,
                  padding: '12px 16px',
                  display: 'flex',
                  gap: 5,
                  alignItems: 'center',
                }}
              >
                {[0, 5, 10].map((delay, i) => {
                  const ds = getDotStyle(dotStep, delay)
                  return (
                    <span
                      key={i}
                      style={{
                        width: 6,
                        height: 6,
                        background: '#666',
                        borderRadius: '50%',
                        display: 'block',
                        flexShrink: 0,
                        transform: ds.transform,
                        opacity: ds.opacity,
                      }}
                    />
                  )
                })}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input row */}
          <div
            style={{
              display: 'flex',
              alignItems: 'flex-end',
              gap: 8,
              padding: '12px 16px 14px',
              borderTop: '1px solid #1a1a1a',
              background: '#0a0a0a',
            }}
          >
            <textarea
              ref={textareaRef}
              placeholder="Message E Corp Support…"
              rows={1}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setTextareaFocused(true)}
              onBlur={() => setTextareaFocused(false)}
              disabled={loading}
              aria-label="Message input"
              style={{
                flex: 1,
                background: '#111',
                border: `1px solid ${textareaFocused ? '#444' : '#2a2a2a'}`,
                borderRadius: 10,
                color: '#f0f0f0',
                fontFamily: 'system-ui, -apple-system, sans-serif',
                fontSize: 14,
                lineHeight: 1.5,
                padding: '9px 12px',
                resize: 'none',
                outline: 'none',
                minHeight: 38,
                maxHeight: 96,
                overflowY: 'auto',
                transition: 'border-color 0.15s',
                boxSizing: 'border-box',
              }}
            />
            <button
              onClick={sendMessage}
              disabled={sendDisabled}
              onMouseEnter={() => setSendHover(true)}
              onMouseLeave={() => { setSendHover(false); setSendActive(false) }}
              onMouseDown={() => setSendActive(true)}
              onMouseUp={() => setSendActive(false)}
              aria-label="Send message"
              style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: sendBg,
                border: 'none',
                cursor: sendDisabled ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                padding: 0,
                opacity: sendDisabled ? 0.4 : 1,
                transform: sendTransform,
                transition: 'background 0.15s, transform 0.1s',
              }}
            >
              <SendIcon />
            </button>
          </div>

          {/* Footer */}
          <div
            style={{
              textAlign: 'center',
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 10,
              color: '#444',
              padding: '0 16px 10px',
              letterSpacing: '0.02em',
            }}
          >
            Powered by E Corp AI &middot; A Better Tomorrow, Today.
          </div>
        </div>
      )}
    </>
  )
}

export { ChatWidget as Component }