"use client"
import { QRCodeDisplay } from "./qr-code-generator"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <QRCodeDisplay />
    </div>
  )
}
