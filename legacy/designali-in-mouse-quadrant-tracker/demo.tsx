"use client"
import { MouseQuadrantTracker } from "./mouse-quadrant-tracker"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <MouseQuadrantTracker />
    </div>
  )
}
