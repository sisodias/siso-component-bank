"use client"
import { FileError } from "./file-upload"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <FileError />
    </div>
  )
}
