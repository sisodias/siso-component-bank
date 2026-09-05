import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Eye, EyeOff, Check } from "lucide-react"
import { cn } from "@/lib/utils"

interface PasswordRequirement {
  id: string
  label: string
  validator: (password: string) => boolean
}

interface PasswordResetFormProps {
  logo?: React.ReactNode
  logoUrl?: string
  title?: string
  description?: string
  requirements?: PasswordRequirement[]
  onSubmit?: (password: string) => void | Promise<void>
  isLoading?: boolean
  onSuccess?: () => void
}

const defaultRequirements: PasswordRequirement[] = [
  { id: "length", label: "At least 8 characters", validator: (p) => p.length >= 8 },
  { id: "lowercase", label: "1 lowercase", validator: (p) => /[a-z]/.test(p) },
  { id: "uppercase", label: "1 uppercase", validator: (p) => /[A-Z]/.test(p) },
  { id: "number", label: "1 number", validator: (p) => /\d/.test(p) },
]

export function PasswordResetForm({
  logo,
  logoUrl,
  title = "Create new password",
  description = "Enter a new password below to change your password.",
  requirements = defaultRequirements,
  onSubmit,
  isLoading = false,
  onSuccess,
}: PasswordResetFormProps) {
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [validationStates, setValidationStates] = useState<Record<string, boolean>>({})
  const [focusedField, setFocusedField] = useState<string | null>(null)
  const [error, setError] = useState("")

  // Update validation states whenever password changes
  useEffect(() => {
    const newStates: Record<string, boolean> = {}
    requirements.forEach((req) => {
      newStates[req.id] = req.validator(password)
    })
    setValidationStates(newStates)
    setError("")
  }, [password, requirements])

  const allRequirementsMet = Object.values(validationStates).every(Boolean)
  const passwordsMatch = password && confirmPassword && password === confirmPassword

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault()

      if (!allRequirementsMet) {
        setError("Password does not meet all requirements")
        return
      }

      if (!passwordsMatch) {
        setError("Passwords do not match")
        return
      }

      try {
        if (onSubmit) {
          await onSubmit(password)
        }
        onSuccess?.()
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred")
      }
    },
    [allRequirementsMet, passwordsMatch, password, onSubmit, onSuccess],
  )

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Logo Section */}
        {(logo || logoUrl) && (
          <div className="flex justify-center mb-4 animate-in fade-in duration-500">
            {logo ? logo : logoUrl ? <img src={logoUrl || "/placeholder.svg"} alt="Logo" className="h-24" /> : null}
          </div>
        )}

        {/* Header */}
        <div className="text-center space-y-2 animate-in fade-in slide-in-from-top-2 duration-500">
          <h1 className="text-3xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm">{description}</p>
        </div>

        {/* Password Input */}
        <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-100">
          <label className="block text-sm font-medium text-foreground">Password</label>
          <div className="relative group">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onFocus={() => setFocusedField("password")}
              onBlur={() => setFocusedField(null)}
              className={cn(
                "w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-300",
                "bg-muted text-foreground placeholder-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                focusedField === "password"
                  ? "border-primary ring-2 ring-primary ring-offset-0 bg-background"
                  : "border-input hover:border-border",
              )}
              placeholder="Enter password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                "hover:text-foreground transition-colors duration-200",
                "p-1 hover:bg-muted rounded",
              )}
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="space-y-2 animate-in fade-in slide-in-from-left-4 duration-500 delay-150">
          <label className="block text-sm font-medium text-foreground">Confirm password</label>
          <div className="relative group">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusedField("confirm")}
              onBlur={() => setFocusedField(null)}
              className={cn(
                "w-full px-4 py-3 pr-12 rounded-lg border-2 transition-all duration-300",
                "bg-muted text-foreground placeholder-muted-foreground",
                "focus:outline-none focus:ring-2 focus:ring-offset-2",
                focusedField === "confirm"
                  ? "border-primary ring-2 ring-primary ring-offset-0 bg-background"
                  : "border-input hover:border-border",
              )}
              placeholder="Confirm password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className={cn(
                "absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground",
                "hover:text-foreground transition-colors duration-200",
                "p-1 hover:bg-muted rounded",
              )}
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
          {confirmPassword && !passwordsMatch && (
            <p className="text-sm text-destructive animate-in fade-in duration-200">Passwords do not match</p>
          )}
        </div>

        {/* Requirements Checklist */}
        <div className="bg-muted/50 border border-border rounded-lg p-4 space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500 delay-200">
          <p className="text-sm font-semibold text-foreground">Your password must have the following:</p>
          <div className="grid grid-cols-2 gap-3">
            {requirements.map((req, index) => (
              <div
                key={req.id}
                className={cn(
                  "flex items-center gap-2 transition-all duration-300 animate-in fade-in",
                  validationStates[req.id] ? "text-green-600 dark:text-green-400" : "text-muted-foreground",
                )}
                style={{ animationDelay: `${200 + index * 50}ms` }}
              >
                <div className="relative w-5 h-5 flex-shrink-0">
                  <div
                    className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                      validationStates[req.id]
                        ? "border-green-500 bg-green-50 dark:bg-green-950"
                        : "border-muted-foreground",
                    )}
                  >
                    {validationStates[req.id] && (
                      <Check size={14} className="text-green-600 dark:text-green-400 animate-in zoom-in duration-300" />
                    )}
                  </div>
                </div>
                <span className="text-xs sm:text-sm">{req.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-3 animate-in shake duration-300">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!allRequirementsMet || !passwordsMatch || isLoading}
          className={cn(
            "w-full py-3 rounded-full font-semibold transition-all duration-300",
            "transform hover:scale-105 active:scale-95",
            allRequirementsMet && passwordsMatch
              ? "bg-foreground text-background hover:shadow-lg"
              : "bg-muted text-muted-foreground cursor-not-allowed",
            "animate-in fade-in delay-300",
          )}
        >
          {isLoading ? "Resetting..." : "Reset password"}
        </button>
      </form>
    </div>
  )
}
