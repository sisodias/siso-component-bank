"use client"

import * as React from "react"
import { Button } from "./button"
import { Slider } from "./slider"
import { cn } from "../_utils/cn"

interface AudioBookPlayerProps {
  audioSrc?: string
  chapterTitle?: string
  author?: string
  className?: string
}

export default function AudioBookPlayer({
  audioSrc = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  chapterTitle = "Chapter 1: The Beginning",
  author = "John Doe",
  className,
}: AudioBookPlayerProps) {
  const [audio] = React.useState(new Audio(audioSrc))
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [progress, setProgress] = React.useState(0)
  const [speed, setSpeed] = React.useState(1)

  React.useEffect(() => {
    const updateProgress = () => {
      setProgress((audio.currentTime / audio.duration) * 100)
    }

    audio.addEventListener("timeupdate", updateProgress)
    return () => {
      audio.pause()
      audio.removeEventListener("timeupdate", updateProgress)
    }
  }, [audio])

  const togglePlay = () => {
    if (isPlaying) audio.pause()
    else audio.play()
    setIsPlaying(!isPlaying)
  }

  const handleSeek = (value: number) => {
    audio.currentTime = (value / 100) * audio.duration
    setProgress(value)
  }

  const changeSpeed = () => {
    const nextSpeed = speed === 1 ? 1.5 : speed === 1.5 ? 2 : 1
    audio.playbackRate = nextSpeed
    setSpeed(nextSpeed)
  }

  return (
    <div className={cn(
      "fixed bottom-4 left-1/2 -translate-x-1/2 border dark:border-gray-700 shadow-lg rounded-xl p-4 flex flex-col gap-3 w-[350px]",
      className
    )}>
      <div className="flex justify-between items-center">
        <div>
          <p className="font-medium text-gray-900 dark:text-gray-100">{chapterTitle}</p>
          <p className="text-sm text-gray-500 dark:text-gray-300">{author}</p>
        </div>
        <Button size="sm" onClick={togglePlay}>
          {isPlaying ? "Pause" : "Play"}
        </Button>
      </div>

      <Slider
        value={[progress]}
        onValueChange={(val) => handleSeek(val[0])}
      />

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500 dark:text-gray-300">{progress.toFixed(0)}%</span>
        <Button size="sm" onClick={changeSpeed}>{speed}x</Button>
      </div>
    </div>
  )
}
