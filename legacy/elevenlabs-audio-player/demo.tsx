"use client"
import { AudioPlayerProvider } from "./audio-player"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <AudioPlayerProvider />
    </div>
  )
}
