"use client"

import * as React from "react"
import {
  Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

type ProviderId = "google" | "github"

export interface LoginCardProps {
  title?: string
  description?: string
  isLoading?: boolean
  error?: string | null
  onEmailPasswordSubmit?: (data: { email: string; password: string }) => Promise<void> | void
  onProviderClick?: (provider: ProviderId) => Promise<void> | void
}

function Logo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 200 200"
      aria-hidden="true"
      {...props}
    >
      <g clipPath="url(#cs_clip_1_triangle-5)">
        <mask
          id="cs_mask_1_triangle-5"
          width="200"
          height="184"
          x="0"
          y="8"
          maskUnits="userSpaceOnUse"
          style={{ maskType: "alpha" }}
        >
          <path
            fill="#fff"
            d="M54.42 55.018c15.258-26.783 22.887-40.175 32.976-44.454a32.263 32.263 0 0125.208 0c10.089 4.28 17.718 17.67 32.975 44.454l32.998 57.923c15.101 26.507 22.651 40.766 21.26 51.627-1.111 8.678-4.645 15.537-11.582 20.82C179.571 192 163.38 192 132.998 192H67.002c-30.382 0-46.573 0-55.256-6.612-6.938-5.283-10.472-12.142-11.583-20.82-1.39-10.861 6.16-25.12 21.26-51.627L54.42 55.018z"
          />
        </mask>
        <g mask="url(#cs_mask_1_triangle-5)">
          <path fill="#fff" d="M200 0H0v200h200V0z" />
          <path
            fill="url(#paint0_linear_748_4943)"
            fillOpacity="0.55"
            d="M200 0H0v200h200V0z"
          />
          <g filter="url(#filter0_f_748_4943)">
            <path fill="#18A0FB" d="M135.366 3H-13v108h148.366V3z" />
            <path fill="#FF58E4" d="M196.58 109H-.55v116h197.13V109z" />
            <ellipse
              cx="85.159"
              cy="57.673"
              fill="#FFD749"
              rx="85.159"
              ry="57.673"
              transform="matrix(.83957 -.54325 .57155 .82057 54.44 63.525)"
            />
          </g>
        </g>
      </g>
      <defs>
        <filter
          id="filter0_f_748_4943"
          width="370.649"
          height="346.593"
          x="-73"
          y="-61.593"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur result="effect1_foregroundBlur_748_4943" stdDeviation="30" />
        </filter>
        <linearGradient
          id="paint0_linear_748_4943"
          x1="200"
          x2="0"
          y1="0"
          y2="200"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF1F00" />
          <stop offset="1" stopColor="#FFD600" />
        </linearGradient>
        <clipPath id="cs_clip_1_triangle-5">
          <path fill="#fff" d="M0 0H200V200H0z" />
        </clipPath>
      </defs>
      <g style={{ mixBlendMode: "overlay" }} mask="url(#cs_mask_1_triangle-5)">
        <path
          fill="gray"
          stroke="transparent"
          d="M200 0H0v200h200V0z"
          filter="url(#cs_noise_1_triangle-5)"
        />
      </g>
      <defs>
        <filter
          id="cs_noise_1_triangle-5"
          width="100%"
          height="100%"
          x="0%"
          y="0%"
          filterUnits="objectBoundingBox"
        >
          <feTurbulence baseFrequency="0.6" numOctaves="5" result="out1" seed="4" />
          <feComposite in="out1" in2="SourceGraphic" operator="in" result="out2" />
          <feBlend in="SourceGraphic" in2="out2" mode="overlay" result="out3" />
        </filter>
      </defs>
    </svg>
  )
}

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 256 262" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" {...props}>
      <path fill="#4285F4" d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027" />
      <path fill="#34A853" d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1" />
      <path fill="#FBBC05" d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782" />
      <path fill="#EB4335" d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251" />
    </svg>
  )
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M12 5c-5 0-9 4.5-9 7s4 7 9 7 9-4.5 9-7-4-7-9-7Zm0 11a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" />
    </svg>
  )
}
function EyeOffIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" {...props}>
      <path fill="currentColor" d="M3 4.27 4.28 3l17 17L20.73 21l-3.15-3.15A10.8 10.8 0 0 1 12 19c-5 0-9-4.5-9-7 0-1.1.55-2.5 1.58-3.86L3 4.27ZM12 7a5 5 0 0 1 5 5c0 .74-.16 1.45-.45 2.08L14.9 12.43A2.99 2.99 0 0 0 12 9a3 3 0 0 0-2.42 1.28L7.92 8.62A4.97 4.97 0 0 1 12 7Z" />
    </svg>
  )
}

export function LoginCard({
  title = "Sign in",
  description = "Enter to continue",
  isLoading,
  error,
  onEmailPasswordSubmit,
  onProviderClick,
}: LoginCardProps) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false)
  const [submitting, setSubmitting] = React.useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!onEmailPasswordSubmit) return
    try {
      setSubmitting(true)
      await onEmailPasswordSubmit({ email, password })
    } finally {
      setSubmitting(false)
    }
  }

  const disabled = isLoading || submitting
  const passwordId = "password"

  return (
    <Card className="w-full max-w-sm bg-background text-foreground">
      <CardHeader className="flex items-center">
        <Logo className="h-12 w-12" />
        <div className="mt-2 text-center">
          <CardTitle className="text-2xl">{title}</CardTitle>
          <CardDescription>{description}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <Button
            type="button"
            variant="ghost"
            className="
              w-full
              border-0
              bg-white dark:bg-neutral-900
              text-foreground
              shadow-sm
              hover:bg-neutral-100 dark:hover:bg-neutral-800
              focus-visible:ring-2 focus-visible:ring-ring
              focus-visible:ring-offset-2 focus-visible:ring-offset-background
            "
            disabled={disabled}
            onClick={() => onProviderClick?.("google")}
          >
            <GoogleIcon className="mr-2 h-4 w-4" />
            Continue with Google
          </Button>

          <Button
            type="button"
            variant="ghost"
            className="
              w-full
              border-0
              bg-white dark:bg-neutral-900
              text-foreground
              shadow-sm
              hover:bg-neutral-100 dark:hover:bg-neutral-800
              focus-visible:ring-2 focus-visible:ring-ring
              focus-visible:ring-offset-2 focus-visible:ring-offset-background
            "
            disabled={disabled}
            onClick={() => onProviderClick?.("github")}
          >
            <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4">
              <path
                fill="currentColor"
                d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56l-.02-2.02c-3.2.7-3.87-1.37-3.87-1.37-.53-1.35-1.3-1.71-1.3-1.71-1.06-.73.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.04 1.78 2.74 1.27 3.4.97.1-.75.41-1.26.75-1.55-2.55-.29-5.22-1.28-5.22-5.7 0-1.26.45-2.29 1.2-3.1-.12-.29-.52-1.47.11-3.07 0 0 .98-.31 3.2 1.18.93-.26 1.93-.39 2.93-.39s2 .13 2.93.39c2.22-1.49 3.2-1.18 3.2-1.18.63 1.6.23 2.78.11 3.07.75.81 1.2 1.84 1.2 3.1 0 4.43-2.67 5.41-5.22 5.7.42.36.8 1.07.8 2.16l-.01 3.2c0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z"
              />
            </svg>
            Continue with GitHub
          </Button>
        </div>

        <div className="relative">
          <Separator className="my-4" />
          <div className="absolute inset-x-0 -top-3 flex justify-center">
            <span className="bg-background px-2 text-xs text-muted-foreground">
              or with email
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-invalid={!!error}
              className="
                border-0
                bg-white dark:bg-neutral-900
                placeholder:text-muted-foreground
                focus-visible:ring-2 focus-visible:ring-ring
                focus-visible:ring-offset-2 focus-visible:ring-offset-background
                focus:outline-none focus-visible:outline-none
              "
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor={passwordId}>Password</Label>

            <div className="relative">
              <Input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                required
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!error}
                aria-describedby="password-visibility-status"
                className="
                  pr-10
                  border-0
                  bg-white dark:bg-neutral-900
                  placeholder:text-muted-foreground
                  focus-visible:ring-2 focus-visible:ring-ring
                  focus-visible:ring-offset-2 focus-visible:ring-offset-background
                  focus:outline-none focus-visible:outline-none
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-controls={passwordId}
                aria-pressed={showPassword}
                className="absolute inset-y-0 right-0 flex items-center px-3 text-muted-foreground hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
              >
                {showPassword ? (
                  <EyeOffIcon className="h-4 w-4" />
                ) : (
                  <EyeIcon className="h-4 w-4" />
                )}
              </button>

              <span
                id="password-visibility-status"
                role="status"
                aria-live="polite"
                className="sr-only"
              >
                {showPassword ? "Password visible" : "Password hidden"}
              </span>
            </div>

            {error ? (
              <p role="alert" className="text-sm text-red-500">
                {error}
              </p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={disabled}>
            Sign in
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col gap-2">
        <p className="text-xs text-muted-foreground">
          By continuing, you agree to our terms and policies.
        </p>
      </CardFooter>
    </Card>
  )
}
