"use client"
import { TreeProvider } from "./tree"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <TreeProvider />
    </div>
  )
}
