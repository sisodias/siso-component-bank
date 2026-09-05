"use client"

import * as React from "react"
import { Button } from "./button"
import { cn } from "../_utils/cn"

interface VisualizerButtonProps {
  audioSrc: string
  width?: number
  height?: number
  className?: string
}

export default function VisualizerButton({
  audioSrc,
  width = 60,
  height = 30,
  className,
}: VisualizerButtonProps) {
  const [audio] = React.useState(new Audio(audioSrc))
  const [isPlaying, setIsPlaying] = React.useState(false)
  const [levels, setLevels] = React.useState<number[]>(Array(5).fill(0))

  React.useEffect(() => {
    let interval: NodeJS.Timer
    if (isPlaying) {
      interval = setInterval(() => {
        setLevels(levels.map(() => Math.random() * height))
      }, 150)
    } else {
      setLevels(Array(5).fill(0))
    }
    return () => clearInterval(interval)
  }, [isPlaying, height])

  const togglePlay = () => {
    if (isPlaying) audio.pause()
    else audio.play()
    setIsPlaying(!isPlaying)
  }

  return (
    <Button
      className={cn(
        "relative flex items-end justify-between px-2 py-1",
        className
      )}
      onClick={togglePlay}
      variant="outline"
      style={{ width, height }}
    >
      {levels.map((lvl, idx) => (
        <div
          key={idx}
          className="bg-blue-500 dark:bg-white rounded-sm transition-all duration-150"
          style={{ width: 4, height: `${lvl}px` }}
        />
      ))}
    </Button>
  )
}
