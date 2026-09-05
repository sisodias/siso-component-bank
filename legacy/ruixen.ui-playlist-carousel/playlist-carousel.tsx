"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "../_utils/cn"
import { LucidePlay, LucidePause } from "lucide-react"

export interface PlaylistItem {
  id: string
  title: string
  duration: string
  image: string
  audioSrc: string
}

interface PlaylistCarouselProps {
  items: PlaylistItem[]
  width?: number
  height?: number
  className?: string
}

export default function PlaylistCarousel({
  items,
  width = 200,
  height = 250,
  className,
}: PlaylistCarouselProps) {
  const [playingId, setPlayingId] = React.useState<string | null>(null)
  const [progressMap, setProgressMap] = React.useState<Record<string, number>>({})
  const [audioMap] = React.useState<Record<string, HTMLAudioElement>>(
    items.reduce((acc, item) => {
      acc[item.id] = new Audio(item.audioSrc)
      return acc
    }, {} as Record<string, HTMLAudioElement>)
  )

  // Setup timeupdate listeners
  React.useEffect(() => {
    items.forEach((item) => {
      const audio = audioMap[item.id]
      const updateProgress = () => {
        setProgressMap((prev) => ({
          ...prev,
          [item.id]: (audio.currentTime / (audio.duration || 1)) * 100,
        }))
      }
      audio.addEventListener("timeupdate", updateProgress)
      audio.addEventListener("ended", () => setPlayingId(null))
      return () => audio.removeEventListener("timeupdate", updateProgress)
    })
  }, [audioMap, items])

  const togglePlay = (id: string) => {
    const currentAudio = audioMap[id]
    if (playingId && playingId !== id) {
      audioMap[playingId].pause()
      audioMap[playingId].currentTime = 0
    }

    if (playingId === id && !currentAudio.paused) {
      currentAudio.pause()
      setPlayingId(null)
    } else {
      currentAudio.play()
      setPlayingId(id)
    }
  }

  const formatTime = (audio: HTMLAudioElement) => {
    const minutes = Math.floor(audio.currentTime / 60)
    const seconds = Math.floor(audio.currentTime % 60)
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`
  }

  return (
    <div className={cn("flex overflow-x-auto gap-4 p-4", className)}>
      {items.map((item) => {
        const progress = progressMap[item.id] || 0
        const audio = audioMap[item.id]
        return (
          <div
            key={item.id}
            className="flex-shrink-0 rounded-xl shadow-md bg-white dark:bg-gray-800 flex flex-col items-center p-3"
            style={{ width, height }}
          >
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-32 object-cover rounded-md mb-3"
            />
            <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 text-center mb-1">
              {item.title}
            </h4>

            {/* Linear progress */}
            <div className="w-full h-1 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
              <div
                className="h-full bg-black dark:bg-white rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              {audio ? `${formatTime(audio)} / ${item.duration}` : `0:00 / ${item.duration}`}
            </p>

            {/* Circular button with progress */}
            <div className="relative">
              <svg className="w-12 h-12">
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="gray"
                  strokeWidth="3"
                  fill="none"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="22"
                  stroke="black"
                  strokeWidth="3"
                  fill="none"
                  strokeDasharray={138.2} // 2πr
                  strokeDashoffset={138.2 - (138.2 * progress) / 100}
                  transform="rotate(-90 24 24)"
                />
              </svg>
              <Button
                className="absolute top-0 left-0 w-12 h-12 flex items-center justify-center rounded-full p-0"
                onClick={() => togglePlay(item.id)}
                variant="outline"
              >
                {playingId === item.id ? <LucidePause className="w-5 h-5" /> : <LucidePlay className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
