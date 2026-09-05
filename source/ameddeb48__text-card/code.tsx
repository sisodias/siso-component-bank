"use client"

import { useState, useEffect } from "react"
import { Share, Copy, Eye, TrendingUp, Zap } from "lucide-react"

interface ViralTextDisplayProps {
  apiEndpoint?: string
  className?: string
}

export function ViralTextDisplay({ apiEndpoint = "/api/dynamic-text", className = "" }: ViralTextDisplayProps) {
  const [text, setText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [viewCount, setViewCount] = useState(1247)
  const [isShared, setIsShared] = useState(false)
  const [showTyping, setShowTyping] = useState(false)

  // Mock dynamic text data - replace with actual API call
  const mockTexts = [
    "🚀 This ONE trick will change your life forever!",
    "💎 Millionaires don't want you to know this secret...",
    "⚡ The #1 habit that successful people do daily",
    "🔥 Why 99% of people fail at this (and how you won't)",
    "✨ The shocking truth they don't teach in school",
  ]

  useEffect(() => {
    // Simulate API call with mock data
    const fetchText = async () => {
      setIsLoading(true)
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const randomText = mockTexts[Math.floor(Math.random() * mockTexts.length)]
      setText(randomText)
      setIsLoading(false)
      setShowTyping(true)

      // Simulate increasing view count
      const interval = setInterval(() => {
        setViewCount((prev) => prev + Math.floor(Math.random() * 3) + 1)
      }, 2000)

      return () => clearInterval(interval)
    }

    fetchText()
  }, [])

  const handleShare = async (platform: "twitter" | "copy") => {
    const shareText = `Check this out: ${text}`

    if (platform === "twitter") {
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`
      window.open(twitterUrl, "_blank")
    } else {
      try {
        await navigator.clipboard.writeText(shareText)
        setIsShared(true)
        setTimeout(() => setIsShared(false), 2000)
      } catch (err) {
        console.error("Failed to copy text:", err)
      }
    }
  }

  const refreshText = () => {
    const newText = mockTexts[Math.floor(Math.random() * mockTexts.length)]
    setText(newText)
    setShowTyping(false)
    setTimeout(() => setShowTyping(true), 100)
  }

  return (
    <div className={`max-w-2xl mx-auto p-6 ${className}`}>
      {/* Trending indicator */}
      <div className="flex items-center justify-center gap-2 mb-4 text-sm text-muted-foreground">
        <TrendingUp className="w-4 h-4 text-accent" />
        <span className="font-medium">TRENDING NOW</span>
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4" />
          <span className="font-bold text-foreground">{viewCount.toLocaleString()}</span>
          <span>views</span>
        </div>
      </div>

      {/* Main content card */}
      <div className="relative bg-card border border-border rounded-xl p-8 shadow-lg glow-effect">
        {/* Loading state */}
        {isLoading ? (
          <div className="text-center space-y-4">
            <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="text-muted-foreground">Loading viral content...</p>
          </div>
        ) : (
          <>
            {/* Main text with typing effect */}
            <div className="text-center space-y-6">
              <h2
                className={`text-3xl md:text-4xl font-black text-card-foreground leading-tight ${
                  showTyping ? "typing-effect cursor-blink" : ""
                }`}
              >
                {text}
              </h2>

              {/* Social proof badges */}
              <div className="flex items-center justify-center gap-4 text-sm">
                <div className="flex items-center gap-1 bg-accent/10 px-3 py-1 rounded-full">
                  <Zap className="w-4 h-4 text-accent" />
                  <span className="font-semibold">VIRAL</span>
                </div>
                <div className="flex items-center gap-1 bg-primary/10 px-3 py-1 rounded-full">
                  <span className="font-semibold text-primary">98% AGREE</span>
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={refreshText}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-full text-lg transition-all duration-300 pulse-scale glow-effect"
              >
                Get Another Mind-Blowing Fact
              </button>
            </div>
          </>
        )}

        {/* Share buttons */}
        <div className="flex items-center justify-center gap-4 mt-8 pt-6 border-t border-border">
          <button
            onClick={() => handleShare("twitter")}
            className="flex items-center gap-2 bg-secondary hover:bg-secondary/90 text-secondary-foreground px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105"
          >
            <Share className="w-4 h-4" />
            Share on X
          </button>

          <button
            onClick={() => handleShare("copy")}
            className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all duration-200 hover:scale-105 ${
              isShared ? "bg-green-500 text-white" : "bg-muted hover:bg-muted/80 text-muted-foreground"
            }`}
          >
            <Copy className="w-4 h-4" />
            {isShared ? "Copied!" : "Copy Link"}
          </button>
        </div>
      </div>

      {/* Bottom engagement metrics */}
      <div className="flex items-center justify-center gap-6 mt-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span>{Math.floor(viewCount / 10)} people viewing now</span>
        </div>
        <div className="flex items-center gap-1">
          <TrendingUp className="w-4 h-4 text-accent" />
          <span>Trending #1 today</span>
        </div>
      </div>
    </div>
  )
}

export { ViralTextDisplay as Component }
export default ViralTextDisplay
