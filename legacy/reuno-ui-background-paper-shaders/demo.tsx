"use client"
import { ShaderPlane } from "./background-paper-shaders"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <ShaderPlane />
    </div>
  )
}
