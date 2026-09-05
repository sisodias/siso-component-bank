"use client"
import { WebGLShader } from "./web-gl-shader"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <WebGLShader />
    </div>
  )
}
