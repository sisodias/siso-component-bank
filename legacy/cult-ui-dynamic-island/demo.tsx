"use client"
import { DynamicIslandProvider } from "./dynamic-island"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <DynamicIslandProvider />
    </div>
  )
}
