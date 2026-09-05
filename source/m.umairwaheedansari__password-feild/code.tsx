"use client"

import { useMemo, useState } from "react"
import { Check, Eye, EyeOff, X } from "lucide-react"
import { cn } from "@/lib/utils"

const passwordRequirements = [
  { regex: /.{8,}/, text: "At least 8 characters" },
  { regex: /[0-9]/, text: "At least 1 number" },
  { regex: /[a-z]/, text: "At least 1 lowercase letter" },
  { regex: /[A-Z]/, text: "At least 1 uppercase letter" },
  { regex: /[!@#$%^&*(),.?\":{}|<>]/, text: "At least 1 special character" },
]

export default function InputPassword() {
  const [password, setPassword] = useState("")
  const [isVisible, setIsVisible] = useState(false)

  const strength = useMemo(() => {
    return passwordRequirements.map((req) => ({
      met: req.regex.test(password),
      text: req.text,
    }))
  }, [password])

  const strengthScore = strength.filter((req) => req.met).length

  const getStrengthColor = (score: number) => {
    const colors = [
      "bg-muted dark:bg-neutral-700",
      "bg-red-500",
      "bg-orange-400",
      "bg-yellow-400",
      "bg-green-400",
      "bg-emerald-500",
    ]
    return colors[score]
  }

  const getStrengthText = (score: number) => {
    if (score === 0) return "Enter a password"
    if (score <= 2) return "Weak password"
    if (score === 3) return "Medium password"
    if (score === 4) return "Strong password"
    return "Very strong password"
  }

  return (
    <div className="space-y-3 w-full max-w-sm mx-auto px-4 py-3 rounded-lg border border-gray-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 shadow-sm transition-colors">
      <label
        htmlFor="password"
        className="text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        Password
      </label>

      {/* Input */}
      <div className="relative">
        <input
          id="password"
          type={isVisible ? "text" : "password"}
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={strengthScore < 4}
          aria-describedby="password-strength"
          className={cn(
            "flex h-10 w-full rounded-md border border-gray-300 dark:border-neutral-700 bg-white dark:bg-neutral-800 px-3 py-2 pr-9 text-sm placeholder:text-gray-400 dark:placeholder:text-neutral-500 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 dark:focus:border-blue-500 dark:focus:ring-blue-900 transition-all duration-200 text-gray-900 dark:text-gray-100"
          )}
        />
        <button
          type="button"
          onClick={() => setIsVisible((v) => !v)}
          aria-label={isVisible ? "Hide password" : "Show password"}
          aria-pressed={isVisible}
          className="absolute inset-y-0 right-2 flex items-center text-gray-500 dark:text-neutral-400 hover:text-gray-700 dark:hover:text-neutral-200 transition-colors"
        >
          {isVisible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>

      {/* Strength bar */}
      <div
        className="h-2 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-neutral-700"
        role="progressbar"
        aria-valuenow={strengthScore}
        aria-valuemin={0}
        aria-valuemax={5}
      >
        <div
          className={`h-full transition-all duration-300 ease-in-out ${getStrengthColor(
            strengthScore
          )}`}
          style={{ width: `${(strengthScore / 5) * 100}%` }}
        />
      </div>

      {/* Strength label */}
      <p
        id="password-strength"
        className="text-sm text-gray-600 dark:text-gray-400 transition-colors"
      >
        {getStrengthText(strengthScore)}
      </p>

      {/* Requirements */}
      <ul className="space-y-1.5 text-xs sm:text-sm">
        {strength.map((req, idx) => (
          <li
            key={idx}
            className={cn(
              "flex items-center gap-2 transition-colors",
              req.met
                ? "text-green-600 dark:text-green-400"
                : "text-gray-500 dark:text-gray-500"
            )}
          >
            {req.met ? <Check size={14} /> : <X size={14} />}
            <span>{req.text}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
