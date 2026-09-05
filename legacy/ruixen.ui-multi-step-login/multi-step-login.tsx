"use client"

import * as React from "react"
import { Button } from "./button"
import { Input } from "./input"
import { Label } from "./label"
import { cn } from "../_utils/cn"

export default function MultiStepLogin() {
  const [step, setStep] = React.useState<number>(1)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [otp, setOtp] = React.useState("")
  const [twoFA, setTwoFA] = React.useState("")

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 3))
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1))

  return (
    <div className="w-full max-w-md mx-auto bg-white dark:bg-gray-800 border rounded-lg shadow-md overflow-hidden p-6 flex flex-col gap-6">
      
      {/* Step Indicator */}
      <div className="flex justify-between mb-4">
        <div className={cn("flex-1 h-1 rounded bg-gray-300 dark:bg-gray-600", step >= 1 && "bg-blue-500")}></div>
        <div className={cn("flex-1 h-1 rounded bg-gray-300 dark:bg-gray-600 mx-2", step >= 2 && "bg-blue-500")}></div>
        <div className={cn("flex-1 h-1 rounded bg-gray-300 dark:bg-gray-600", step >= 3 && "bg-blue-500")}></div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="flex flex-col gap-4">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button className="mt-2 w-full" onClick={nextStep}>Next</Button>
        </div>
      )}

      {step === 2 && (
        <div className="flex flex-col gap-4">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Label htmlFor="otp">OTP (Optional)</Label>
          <Input
            id="otp"
            type="text"
            placeholder="123456"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <div className="flex justify-between mt-2">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button onClick={nextStep}>Next</Button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="flex flex-col gap-4">
          <Label htmlFor="2fa">2FA Verification Code</Label>
          <Input
            id="2fa"
            type="text"
            placeholder="Enter code"
            value={twoFA}
            onChange={(e) => setTwoFA(e.target.value)}
          />
          <div className="flex justify-between mt-2">
            <Button variant="outline" onClick={prevStep}>Back</Button>
            <Button>Verify & Login</Button>
          </div>
        </div>
      )}
    </div>
  )
}
