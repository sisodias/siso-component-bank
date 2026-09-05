"use client"
import { ToastProvider } from "./toast-1"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <ToastProvider />
    </div>
  )
}
