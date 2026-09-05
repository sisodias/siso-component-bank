"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function OTPDialog() {
  const [otp, setOtp] = useState(["", "", "", ""])
  const [message, setMessage] = useState("")
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setCanResend(true)
      return
    }
    const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    return () => clearTimeout(timer)
  }, [timeLeft])

  const handleChange = (value: string, index: number) => {
    if (/^\d?$/.test(value)) {
      const updated = [...otp]
      updated[index] = value
      setOtp(updated)
      if (value && index < otp.length - 1) {
        const nextInput = document.getElementById(`otp-${index + 1}`)
        nextInput?.focus()
      }
    }
  }

  const handleVerify = () => {
    if (otp.every((d) => d !== "")) {
      setMessage("✅ OTP verified successfully! You can now continue.")
    } else {
      setMessage("⚠️ Please enter the complete 4-digit OTP.")
    }
  }

  const handleResend = () => {
    setMessage("OTP has been resent to your email or phone.")
    setOtp(["", "", "", ""])
    setTimeLeft(60)
    setCanResend(false)
    document.getElementById("otp-0")?.focus()
  }

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0")
    const s = (seconds % 60).toString().padStart(2, "0")
    return `${m}:${s}`
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Verify OTP</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-sm !rounded-xl p-6">
        <DialogHeader className="text-center mb-4">
          <DialogTitle className="text-lg font-semibold">OTP Verification</DialogTitle>
          <DialogDescription className="text-sm text-muted-foreground mt-1">
            Enter the 4-digit code sent to <strong>example@email.com</strong>.
          </DialogDescription>
        </DialogHeader>

        <p className="text-center text-xs text-muted-foreground mb-4">
          Step 1 of 1: Verify your account
        </p>

        {/* OTP Inputs */}
        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, idx) => (
            <Input
              key={idx}
              id={`otp-${idx}`}
              value={digit}
              onChange={(e) => handleChange(e.target.value, idx)}
              className="w-14 h-14 text-center text-lg font-medium rounded-md border border-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
              maxLength={1}
            />
          ))}
        </div>

        {/* Timer */}
        {!canResend && (
          <p className="text-center text-xs text-muted-foreground mb-2">
            You can resend OTP in <strong>{formatTime(timeLeft)}</strong>
          </p>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-2">
          <Button className="w-full" onClick={handleVerify}>
            Verify OTP
          </Button>

          <Button
            variant="outline"
            className="w-full flex justify-between items-center"
            onClick={handleResend}
            disabled={!canResend}
          >
            {canResend ? "Send Again" : "Resend OTP"}
            {!canResend && (
              <span className="text-xs text-muted-foreground">{formatTime(timeLeft)}</span>
            )}
          </Button>
        </div>

        {/* Feedback message */}
        {message && (
          <p className="mt-3 text-center text-sm text-muted-foreground">{message}</p>
        )}
      </DialogContent>
    </Dialog>
  )
}
