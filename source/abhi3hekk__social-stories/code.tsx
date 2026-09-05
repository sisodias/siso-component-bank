"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { ArrowUpRight, X, Loader2 } from "lucide-react"
import Image from "next/image"

export type SocialPlatform = "linkedin" | "instagram"

export interface Story {
  id: string
  platform: SocialPlatform
  mediaUrl: string
  linkUrl: string
  caption?: string
  duration?: number
}

interface SocialStoriesProps {
  stories: Story[]
  profile: {
    name: string
    avatarUrl: string
  }
  defaultDuration?: number
}

const isVideo = (url: string) =>
  /\.(mp4|webm|ogg)$/i.test(url) || url.includes("/video/")

export function SocialStories({
  stories = [],
  profile,
  defaultDuration = 5,
}: SocialStoriesProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMediaReady, setIsMediaReady] = useState(false)
  const [mounted, setMounted] = useState(false)

  const activeProgressBarRef = useRef<HTMLDivElement | null>(null)
  const rafRef = useRef<number | null>(null)
  const startTimeRef = useRef<number | null>(null)
  const pausedAtRef = useRef<number | null>(null)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const lastProgressRef = useRef<number>(0)

  // -- Safe Access to Current Story --
  const currentStory = stories[currentIndex]
  const currentIsVideo = isVideo(currentStory?.mediaUrl ?? "")
  const durationMs = ((currentStory?.duration ?? defaultDuration) as number) * 1000

  // -- Hydration Fix --
  useEffect(() => {
    setMounted(true)
  }, [])

  // -- Progress & Animation Logic --
  const setProgress = (value: number) => {
    lastProgressRef.current = Math.max(0, Math.min(1, value))
    if (activeProgressBarRef.current) {
      activeProgressBarRef.current.style.transform = `scaleX(${lastProgressRef.current})`
    }
  }

  const stopAnimation = () => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
  }

  const resetTiming = useCallback((clearProgress = true) => {
    startTimeRef.current = null
    pausedAtRef.current = null
    if (clearProgress) setProgress(0)
    setIsMediaReady(false)
  }, [])

  const goNext = useCallback(() => {
    stopAnimation()
    resetTiming()
    if (currentIndex < stories.length - 1) {
      setCurrentIndex((i) => i + 1)
    } else {
      setIsOpen(false)
      setCurrentIndex(0)
    }
  }, [currentIndex, stories.length, resetTiming])

  const goPrev = useCallback(() => {
    if (currentIndex === 0) return
    stopAnimation()
    resetTiming()
    setCurrentIndex((i) => i - 1)
  }, [currentIndex, resetTiming])

  // -- Image Timer --
  useEffect(() => {
    if (!isOpen || !isMediaReady || currentIsVideo) return
    
    const animate = (now: number) => {
      if (!startTimeRef.current) startTimeRef.current = now
      
      if (!isPaused) {
        const elapsed = now - startTimeRef.current
        const progress = Math.min(elapsed / durationMs, 1)
        setProgress(progress)
        
        if (progress >= 1) {
          stopAnimation()
          requestAnimationFrame(goNext)
          return
        }
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    stopAnimation()
    rafRef.current = requestAnimationFrame(animate)
    return () => stopAnimation()
  }, [isOpen, isPaused, isMediaReady, durationMs, goNext, currentIsVideo])

  // -- Video Sync --
  useEffect(() => {
    if (!currentIsVideo || !isOpen) return
    const video = videoRef.current

    const sync = () => {
      if (!video || !video.duration) {
        rafRef.current = requestAnimationFrame(sync)
        return
      }
      setProgress(video.currentTime / video.duration)
      rafRef.current = requestAnimationFrame(sync)
    }

    if (isMediaReady && !isPaused) {
      stopAnimation()
      rafRef.current = requestAnimationFrame(sync)
    }
    return () => stopAnimation()
  }, [currentIsVideo, isPaused, isOpen, isMediaReady])

  // -- Pause/Resume --
  useEffect(() => {
    if (isPaused) {
      if (pausedAtRef.current === null) pausedAtRef.current = performance.now()
      videoRef.current?.pause()
      stopAnimation()
    } else {
      if (pausedAtRef.current !== null && startTimeRef.current !== null) {
        startTimeRef.current += performance.now() - pausedAtRef.current
        pausedAtRef.current = null
      }
      if (currentIsVideo) videoRef.current?.play().catch(() => {})
    }
  }, [isPaused, currentIsVideo])

  // -- Tap Navigation --
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest("button, a")) return
    const { width } = e.currentTarget.getBoundingClientRect()
    e.nativeEvent.offsetX < width / 3 ? goPrev() : goNext()
  }

  // Prevent SSR issues
  if (!mounted) return null

  return (
    <>
      {/* 
        TRIGGER: The ringed avatar you see initially.
        Centered by the parent in default.tsx
      */}
      <div className="relative w-12 h-12 sm:w-16 sm:h-16 cursor-pointer z-10">
        {!isOpen && (
          <motion.div
            layoutId="story-trigger"
            onClick={() => setIsOpen(true)}
            className="absolute inset-0 rounded-full p-[4px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Gradient Ring */}
            <div className="absolute inset-0 rounded-full border-[3px] border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)]" />
            
            {/* Avatar Image */}
            <div className="absolute inset-[6px] rounded-full overflow-hidden bg-zinc-800 ring-2 ring-black">
              <Image
                src={profile.avatarUrl}
                alt={profile.name}
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        )}
      </div>

      {/* 
        MODAL: Portaled to document.body to ensure it overlays everything.
        Fixed Z-Index to 9999 to avoid "nothing appears" issues.
      */}
      {createPortal(
        <AnimatePresence>
          {isOpen && currentStory && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center pointer-events-auto">
              
              {/* Backdrop Blur */}
              <motion.div
                className="absolute inset-0 bg-black/80 backdrop-blur-xl"
                onClick={() => setIsOpen(false)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />

              {/* 
                THE CARD 
                - Responsive Sizing: 
                  Mobile: w-[90vw] (leaves gaps on sides)
                  Desktop: max-h-[85vh] (leaves gaps on top/bottom)
                - Aspect Ratio: Always 9/16
              */}
              <motion.div
                layoutId="story-card-modal"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
                className="
                  relative
                  w-[90vw] h-auto
                  aspect-[9/16]
                  max-h-[85vh]
                  max-w-[420px]
                  bg-black
                  rounded-[20px] md:rounded-[30px]
                  overflow-hidden
                  shadow-2xl
                  border border-white/10
                  flex flex-col
                "
              >
                {/* Story Content */}
                <div
                  className="relative w-full h-full flex-1"
                  onMouseDown={() => setIsPaused(true)}
                  onMouseUp={handleTap}
                  onMouseLeave={() => setIsPaused(false)}
                  onTouchStart={() => setIsPaused(true)}
                  onTouchEnd={() => setIsPaused(false)}
                >
                  {/* Loading State */}
                  {!isMediaReady && (
                    <div className="absolute inset-0 z-10 flex items-center justify-center bg-zinc-900">
                      <Loader2 className="w-8 h-8 animate-spin text-white/50" />
                    </div>
                  )}

                  {/* Media Layer */}
                  <div className="absolute inset-0 bg-zinc-900">
                    {currentIsVideo ? (
                      <video
                        ref={videoRef}
                        src={currentStory.mediaUrl}
                        playsInline
                        autoPlay
                        className="w-full h-full object-cover"
                        onLoadedData={() => {
                          setIsMediaReady(true)
                          if (!isPaused) videoRef.current?.play().catch(() => {})
                        }}
                        onEnded={goNext}
                      />
                    ) : (
                      <Image
                        src={currentStory.mediaUrl}
                        alt="Story"
                        fill
                        className="object-cover"
                        priority
                        onLoad={() => setIsMediaReady(true)}
                      />
                    )}
                  </div>

                  {/* Readability Gradient */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/80 pointer-events-none" />

                  {/* Top Progress Bars */}
                  <div className="absolute top-4 left-4 right-4 flex gap-1.5 z-20">
                    {stories.map((_, i) => (
                      <div key={i} className="h-[2px] flex-1 bg-white/30 rounded-full overflow-hidden">
                        <div
                          ref={i === currentIndex ? activeProgressBarRef : null}
                          className="h-full bg-white origin-left"
                          style={{
                            transform: i < currentIndex ? "scaleX(1)" : "scaleX(0)",
                          }}
                        />
                      </div>
                    ))}
                  </div>

                  {/* Header: User Info */}
                  <div className="absolute top-8 left-4 right-4 flex justify-between items-center z-20">
                    <div className="flex items-center gap-2.5">
                      <div className="relative w-9 h-9 rounded-full overflow-hidden border border-white/20">
                        <Image
                          src={profile.avatarUrl}
                          alt={profile.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-white text-sm font-semibold leading-none drop-shadow-sm">
                          {profile.name}
                        </span>
                        <span className="text-white/70 text-[10px] uppercase tracking-wider mt-0.5">
                          {currentStory.platform}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsOpen(false)
                      }}
                      className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md transition-colors"
                    >
                      <X className="w-5 h-5 text-white" />
                    </button>
                  </div>

                  {/* Footer: Caption & Link */}
                  <div className="absolute bottom-6 left-5 right-5 flex items-end justify-between gap-4 z-20">
                    <div className="flex-1">
                      <p className="text-white text-[15px] font-medium leading-relaxed drop-shadow-md line-clamp-2">
                        {currentStory.caption}
                      </p>
                    </div>
                    {currentStory.linkUrl && (
                      <a
                        href={currentStory.linkUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-shrink-0 flex items-center justify-center w-11 h-11 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-md border border-white/10 transition-all hover:scale-105"
                      >
                        <ArrowUpRight className="w-5 h-5 text-white" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  )
}