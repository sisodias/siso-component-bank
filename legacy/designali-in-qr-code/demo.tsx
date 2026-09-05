"use client"
import { QRCodeGenerator } from "./qr-code"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <QRCodeGenerator />
    </div>
  )
}
