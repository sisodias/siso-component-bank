"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "../_utils/cn"

interface WaveformPlayerProps {
  audioSrc: string
  width?: number
  height?: number
  className?: string
}

export default function WaveformPlayer({
  audioSrc,
  width = 400,
  height = 60,
  className,
}: WaveformPlayerProps) {
  const [audio] = React.useState(new Audio(audioSrc))
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const handleTimeUpdate = () => {
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    audio.addEventListener("timeupdate", handleTimeUpdate)
    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.pause()
    }
  }, [audio])

  const togglePlay = () => {
    if (isPlaying) audio.pause()
    else audio.play()
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const seekTime = (clickX / rect.width) * audio.duration
    audio.currentTime = seekTime
  }

  return (
    <div className={cn("flex flex-col items-center gap-2", className)}>
      <div
        className="relative w-full rounded-md cursor-pointer overflow-hidden"
        style={{ width, height }}
        onClick={handleSeek}
      >
        {/* Background wave */}
        <div className="absolute inset-0 flex justify-between items-center px-0.5">
          {Array.from({ length: 40 }).map((_, idx) => (
            <div
              key={idx}
              className="rounded-sm bg-black dark:bg-white"
              style={{
                width: 2,
                height: `${10 + Math.random() * (height - 20)}px`,
              }}
            />
          ))}
        </div>

        {/* Progress overlay */}
        <div
          className="absolute top-0 left-0 h-full rounded-md bg-black dark:bg-white"
          style={{
            width: `${progress}%`,
          }}
        />
      </div>

      <Button
        onClick={togglePlay}
        className="w-20 text-sm px-2 py-1"
        variant="outline"
      >
        {isPlaying ? "Pause" : "Play"}
      </Button>
    </div>
  )
}
