"use client"
import { CommentThread } from "./reddit-nested-thread-reply"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <CommentThread />
    </div>
  )
}
