"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { z } from "zod"
import { Check } from "lucide-react"

export interface OnboardingStep {
  id: string
  title: string
  description?: string
  schema: z.ZodObject<any>
  fields: {
    name: string
    label: string
    type: "text" | "email" | "select" | "textarea" | "number"
    placeholder?: string
    options?: { value: string; label: string }[]
  }[]
}

export interface OnboardingFlowProps {
  steps: OnboardingStep[]
  logo?: React.ReactNode
  onComplete?: (data: Record<string, any>) => void
  onSkip?: () => void
  showSkip?: boolean
  className?: string
}

export function OnboardingFlow({ steps, logo, onComplete, onSkip, showSkip = true, className }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = React.useState(0)
  const [formData, setFormData] = React.useState<Record<string, any>>({})
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set())
  const [showConfetti, setShowConfetti] = React.useState(false)
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [isCompleting, setIsCompleting] = React.useState(false)

  const currentStepData = steps[currentStep]
  const isLastStep = currentStep === steps.length - 1

  const handleFieldChange = (fieldName: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [fieldName]: value,
    }))
    if (errors[fieldName]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }
  }

  const validateCurrentStep = () => {
    const currentSchema = currentStepData.schema
    const currentStepFields = currentStepData.fields.reduce(
      (acc, field) => {
        acc[field.name] = formData[field.name]
        return acc
      },
      {} as Record<string, any>,
    )

    try {
      currentSchema.parse(currentStepFields)
      setErrors({})
      return true
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {}
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message
          }
        })
        setErrors(newErrors)
      }
      return false
    }
  }

  const handleNext = () => {
    if (!validateCurrentStep()) {
      return
    }

    setCompletedSteps((prev) => new Set(prev).add(currentStep))

    if (isLastStep) {
      setIsCompleting(true)
      setTimeout(() => {
        setShowConfetti(true)
        setTimeout(() => {
          setShowConfetti(false)
          onComplete?.(formData)
        }, 4000)
      }, 1500)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleSkip = () => {
    setErrors({})
    if (isLastStep) {
      onComplete?.(formData)
    } else {
      setCurrentStep((prev) => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 0) {
      setErrors({})
      setCurrentStep((prev) => prev - 1)
    }
  }

  return (
    <div className={cn("mx-auto space-y-8 p-6 md:p-8 w-full max-w-3xl self-stretch", className)}>
      {showConfetti && <Confetti />}
      <div className={cn("transition-opacity duration-500", isCompleting && "opacity-0 pointer-events-none")}>
        {logo && <div className="mb-8">{logo}</div>}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Step {currentStep + 1} of {steps.length}
            </span>
          </div>
          <div className="relative h-2 w-full overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full bg-primary transition-all duration-500 ease-out"
              style={{
                width: `${((currentStep + 1) / steps.length) * 100}%`,
              }}
            />
          </div>
        </div>
        <div className="space-y-6 animate-in fade-in-50 slide-in-from-right-5 duration-500">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tight text-balance">{currentStepData.title}</h2>
            {currentStepData.description && (
              <p className="text-muted-foreground text-pretty">{currentStepData.description}</p>
            )}
          </div>
          <div className="space-y-4">
            {currentStepData.fields.map((field) => {
              const fieldSchema = currentStepData.schema.shape[field.name]
              const isRequired = !fieldSchema?.isOptional()

              return (
                <div key={field.name} className="space-y-2">
                  <Label htmlFor={field.name} className="font-semibold">
                    {field.label}
                    {isRequired && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  {field.type === "select" ? (
                    <Select
                      value={formData[field.name] || ""}
                      onValueChange={(value) => handleFieldChange(field.name, value)}
                    >
                      <SelectTrigger
                        id={field.name}
                        className={cn("w-full", errors[field.name] && "border-destructive")}
                      >
                        <SelectValue placeholder={field.placeholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {field.options?.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : field.type === "textarea" ? (
                    <textarea
                      id={field.name}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={cn(
                        "flex min-h-[120px] w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
                        errors[field.name] && "border-destructive focus-visible:ring-destructive",
                      )}
                    />
                  ) : (
                    <Input
                      id={field.name}
                      type={field.type}
                      value={formData[field.name] || ""}
                      onChange={(e) => handleFieldChange(field.name, e.target.value)}
                      placeholder={field.placeholder}
                      className={cn(errors[field.name] && "border-destructive focus-visible:ring-destructive")}
                    />
                  )}
                  {errors[field.name] && (
                    <p className="text-sm text-destructive font-medium animate-in fade-in-50 slide-in-from-top-1">
                      {errors[field.name]}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
        <div className="flex items-center justify-between gap-4 pt-4">
          <div className="flex gap-2">
            {currentStep > 0 && (
              <Button type="button" variant="outline" onClick={handleBack} className="min-w-20 bg-transparent">
                Back
              </Button>
            )}
            {showSkip && !isLastStep && (
              <Button type="button" variant="ghost" onClick={handleSkip} className="text-muted-foreground">
                Skip
              </Button>
            )}
          </div>
          <Button type="button" onClick={handleNext} className="min-w-32" size="lg">
            {isLastStep ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
      {isCompleting && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div
            className={cn(
              "bg-primary text-primary-foreground flex items-center justify-center transition-all duration-1000 ease-out",
              "animate-in fade-in-0 zoom-in-95",
            )}
            style={{
              width: isCompleting ? "80px" : "128px",
              height: isCompleting ? "80px" : "44px",
              borderRadius: isCompleting ? "50%" : "0.5rem",
            }}
          >
            <Check className="w-10 h-10 animate-in zoom-in-50 duration-500" style={{ animationDelay: "500ms" }} />
          </div>
        </div>
      )}
    </div>
  )
}

function Confetti() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      color: string
      size: number
      rotation: number
      rotationSpeed: number
    }> = []

    const colors = ["#ff6b6b", "#4ecdc4", "#45b7d1", "#f9ca24", "#6c5ce7", "#a29bfe", "#fd79a8", "#fdcb6e"]

    for (let i = 0; i < 150; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        vx: (Math.random() - 0.5) * 3,
        vy: Math.random() * 3 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: Math.random() * 8 + 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      })
    }

    let animationId: number

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.vy += 0.1
        particle.rotation += particle.rotationSpeed

        ctx.save()
        ctx.translate(particle.x, particle.y)
        ctx.rotate((particle.rotation * Math.PI) / 180)
        ctx.fillStyle = particle.color
        ctx.fillRect(-particle.size / 2, -particle.size / 2, particle.size, particle.size)
        ctx.restore()

        if (particle.y > canvas.height) {
          particle.y = -10
          particle.x = Math.random() * canvas.width
        }
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      style={{ width: "100%", height: "100%" }}
    />
  )
}
