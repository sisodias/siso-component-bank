"use client"

import type React from "react"
import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { LiquidCard, CardContent, CardHeader } from "@/components/ui/liquid-glass-card"
import { Badge } from "@/components/ui/badge"
import { LiquidButton } from "@/components/ui/liquid-glass-button"

// Types and Enums
enum Strength {
  None = "none",
  Weak = "weak",
  Moderate = "moderate",
  Strong = "strong",
}

interface FinancialScoreProps {
  title: string
  description: string
  initialScore?: number
}

interface FinancialScoreButtonProps {
  children?: React.ReactNode
  isOutlined?: boolean
  onClick?: () => void
}

interface FinancialScoreCardProps {
  children?: React.ReactNode
}

interface FinancialScoreDisplayProps {
  value: Score
  max: number
}

interface FinancialScoreHalfCircleProps {
  value: Score
  max: number
}

interface FinancialScoreHeaderProps {
  title?: string
  strength?: Strength
}

type CounterContextType = {
  getNextIndex: () => number
}

type Score = number | null
type StrengthColors = Record<Strength, string[]>

// Sample Data
const data: FinancialScoreProps[] = [
  {
    title: "Protection Score",
    description:
      "This score measures your overall security strength. Higher score means better protection. Aim to maintain or improve.",
    initialScore: 42,
  },
  {
    title: "Investment Score",
    description:
      "This score measures portfolio alignment with your goals and strategy. Higher score indicates better performance.",
    initialScore: 83,
  },
  {
    title: "Financial Fitness",
    description:
      "Boost financial control in 10 minutes. Get your fitness score—quick, free, no impact on credit or mortgages.",
  },
]

// Utils Class
class Utils {
  static LOCALE = "en-US"

  static easings = {
    easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
    easeOut: "cubic-bezier(0.33, 1, 0.68, 1)",
  }

  static circumference(r: number): number {
    return 2 * Math.PI * r
  }

  static formatNumber(n: number) {
    return new Intl.NumberFormat(this.LOCALE).format(n)
  }

  static getStrength(score: Score, maxScore: number): Strength {
    if (!score) return Strength.None

    const percent = score / maxScore

    if (percent >= 0.8) return Strength.Strong
    if (percent >= 0.4) return Strength.Moderate

    return Strength.Weak
  }

  static randomHash(length = 4): string {
    const chars = "abcdef0123456789"
    const bytes = crypto.getRandomValues(new Uint8Array(length))

    return [...bytes].map((b) => chars[b % chars.length]).join("")
  }

  static randomInt(min = 0, max = 1): number {
    const value = crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32

    return Math.round(min + (max - min) * value)
  }
}

// Context
const CounterContext = createContext<CounterContextType | undefined>(undefined)

const CounterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const counterRef = useRef(0)
  const getNextIndex = useCallback(() => {
    return counterRef.current++
  }, [])

  return <CounterContext.Provider value={{ getNextIndex }}>{children}</CounterContext.Provider>
}

const useCounter = () => {
  const context = useContext(CounterContext)

  if (!context) {
    throw new Error("useCounter must be used within a CounterProvider")
  }

  return context.getNextIndex
}

// Components
function FinancialScoreButton({ children, isOutlined, onClick }: FinancialScoreButtonProps) {
  return (
    <LiquidButton
      variant={"default"}
      onClick={onClick}
      className="w-full h-16 text-lg py-3 animate-in fade-in slide-in-from-bottom-12 duration-800 delay-300"
       
    >
      {children}
    </LiquidButton>
  )
}

function FinancialScoreCard({ children }: FinancialScoreCardProps) {
  const getNextIndex = useCounter()
  const indexRef = useRef<number | null>(null)
  const animationRef = useRef(0)
  const [appearing, setAppearing] = useState(false)

  if (indexRef.current === null) {
    indexRef.current = getNextIndex()
  }

  useEffect(() => {
    const delayInc = 200
    const delay = 300 + indexRef.current! * delayInc

    animationRef.current = setTimeout(() => setAppearing(true), delay)

    return () => {
      clearTimeout(animationRef.current)
    }
  }, [])

  if (!appearing) return null

  return (
    <LiquidCard className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-800 fill-mode-both">
      <CardContent className="p-9">{children}</CardContent>
    </LiquidCard>
  )
}

function FinancialScoreDisplay({ value, max }: FinancialScoreDisplayProps) {
  const hasValue = value !== null
  const digits = String(Math.floor(value!)).split("")
  const maxFormatted = Utils.formatNumber(max)
  const label = hasValue ? `out of ${maxFormatted}` : "No score"

  return (
    <div className="absolute bottom-0 w-full text-center">
      <div className="text-4xl font-medium h-15 overflow-hidden relative">
        <div className="absolute inset-0 opacity-0">
          <div className="inline-block">0</div>
        </div>
        <div className="absolute inset-0">
          {hasValue &&
            digits.map((digit, i) => (
              <span
                key={i}
                className="inline-block animate-in slide-in-from-bottom-full duration-800 delay-400 fill-mode-both"
                style={{
                  animationDelay: `${400 + i * 100}ms`,
                  animationDuration: `${800 + i * 300}ms`,
                }}
              >
                {digit}
              </span>
            ))}
        </div>
      </div>
      <div className="text-sm text-muted-foreground uppercase tracking-wide">{label}</div>
    </div>
  )
}

function FinancialScoreHalfCircle({ value, max }: FinancialScoreHalfCircleProps) {
  const strokeRef = useRef<SVGCircleElement>(null)
  const gradIdRef = useRef(`grad-${Utils.randomHash()}`)
  const gradId = gradIdRef.current
  const gradStroke = `url(#${gradId})`
  const radius = 45
  const dist = Utils.circumference(radius)
  const distHalf = dist / 2
  const distFourth = distHalf / 2
  const strokeDasharray = `${distHalf} ${distHalf}`
  const distForValue = Math.min((value as number) / max, 1) * -distHalf
  const strokeDashoffset = value !== null ? distForValue : -distFourth
  const strength = Utils.getStrength(value, max)
  const strengthColors: StrengthColors = {
    none: ["hsl(220, 13%, 69%)", "hsl(220, 9%, 46%)"],
    weak: ["hsl(0, 84%, 80%)", "hsl(0, 84%, 60%)", "hsl(0, 84%, 40%)"],
    moderate: ["hsl(38, 92%, 80%)", "hsl(38, 92%, 60%)", "hsl(38, 92%, 40%)"],
    strong: ["hsl(142, 71%, 80%)", "hsl(142, 71%, 60%)", "hsl(142, 71%, 40%)"],
  }
  const colorStops = strengthColors[strength]

  useEffect(() => {
    const strokeStart = 400
    const duration = 1400

    strokeRef.current?.animate(
      [
        { strokeDashoffset: "0", offset: 0 },
        { strokeDashoffset: "0", offset: strokeStart / duration },
        { strokeDashoffset: strokeDashoffset.toString() },
      ],
      {
        duration,
        easing: Utils.easings.easeInOut,
        fill: "forwards",
      },
    )
  }, [value, max, strokeDashoffset])

  return (
    <svg className="block mx-auto w-auto max-w-full h-36" viewBox="0 0 100 50" aria-hidden="true">
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          {colorStops.map((stop, i) => {
            const offset = `${(100 / (colorStops.length - 1)) * i}%`
            return <stop key={i} offset={offset} stopColor={stop} />
          })}
        </linearGradient>
      </defs>
      <g fill="none" strokeWidth="10" transform="translate(50, 50.5)">
        <circle className="stroke-muted/20" r={radius} />
        <circle ref={strokeRef} stroke={gradStroke} strokeDasharray={strokeDasharray} r={radius} />
      </g>
    </svg>
  )
}

function FinancialScoreHeader({ title, strength }: FinancialScoreHeaderProps) {
  const hasStrength = strength !== Strength.None

  const getBadgeVariant = (strength: Strength) => {
    switch (strength) {
      case Strength.Weak:
        return "destructive"
      case Strength.Moderate:
        return "secondary"
      case Strength.Strong:
        return "default"
      default:
        return "secondary"
    }
  }

  const getBadgeClassName = (strength: Strength) => {
    switch (strength) {
      case Strength.Weak:
        return "bg-red-100 text-red-700 hover:bg-red-100 dark:bg-red-900/30 dark:text-red-300"
      case Strength.Moderate:
        return "bg-yellow-100 text-yellow-700 hover:bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300"
      case Strength.Strong:
        return "bg-green-100 text-green-700 hover:bg-green-100 dark:bg-green-900/30 dark:text-green-300"
      default:
        return ""
    }
  }

  return (
    <CardHeader className="flex flex-row items-center justify-between gap-6 pb-10 px-0 animate-in fade-in slide-in-from-bottom-12 duration-800 delay-0">
      <h2 className="text-xl font-medium truncate">{title}</h2>
      {hasStrength && (
        <LiquidButton
          variant={getBadgeVariant(strength)}
          className={`uppercase text-xs font-semibold shrink-0 animate-in fade-in slide-in-from-bottom-12 h-8 duration-800 delay-800 ${getBadgeClassName(strength)}`}
        >
          {strength}
        </LiquidButton>
      )}
    </CardHeader>
  )
}

function FinancialScore({ title, description, initialScore }: FinancialScoreProps) {
  const [score, setScore] = useState<Score>(initialScore ?? null)
  const hasScore = score !== null
  const max = 100
  const strength = Utils.getStrength(score, max)

  function handleGenerateScore(): void {
    if (!hasScore) {
      setScore(Utils.randomInt(0, max))
    }
  }

  return (
    <FinancialScoreCard>
      <FinancialScoreHeader title={title} strength={strength} />
      <div className="relative mb-8 animate-in fade-in slide-in-from-bottom-12 duration-800 delay-100">
        <FinancialScoreHalfCircle value={score} max={max} />
        <FinancialScoreDisplay value={score} max={max} />
      </div>
      <p className="text-muted-foreground text-center mb-9 min-h-[4.5rem] animate-in fade-in slide-in-from-bottom-12 duration-800 delay-200">
        {description}
      </p>
      <FinancialScoreButton isOutlined={hasScore} onClick={handleGenerateScore}>
        {hasScore ? "Learn more" : "Calculate your score"}
      </FinancialScoreButton>
    </FinancialScoreCard>
  )
}

// Main Component
export function FinancialScoreCards() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-3 mx-auto py-6 px-6 min-h-screen bg-background">
      <CounterProvider>
        {data.map((card, i) => (
          <FinancialScore key={i} {...card} />
        ))}
      </CounterProvider>
    </div>
  )
}
