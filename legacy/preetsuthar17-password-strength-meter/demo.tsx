"use client"
import { PasswordStrengthMeter } from "./password-strength-meter"

export default function DemoOne() {
  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      <PasswordStrengthMeter />
    </div>
  )
}
