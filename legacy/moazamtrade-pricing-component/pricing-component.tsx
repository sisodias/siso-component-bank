import { useState } from "react"
import { Calendar } from "lucide-react"

export default function PricingCards() {
  const [starterFast, setStarterFast] = useState(false)
  const [proFast, setProFast] = useState(false)

  const LightCheckIcon = ({ className = "" }: { className?: string }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="8" className="fill-neutral-900 dark:fill-neutral-100" />
      <path
        d="M5.5 8.5L7 10L11 6"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  const DarkCheckIcon = ({ className = "" }: { className?: string }) => (
    <svg
      className={className}
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="8" cy="8" r="7.5" className="stroke-neutral-500" />
      <path
        d="M5.5 8.5L7 10L11 6"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )

  const ToggleSwitch = ({
    enabled,
    onChange,
    isDark = false,
  }: {
    enabled: boolean
    onChange: (v: boolean) => void
    isDark?: boolean
  }) => (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(!enabled)}
        className={[
          "relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none",
          "ring-1 ring-inset",
          enabled
            ? isDark
              ? "bg-neutral-100 ring-neutral-300"
              : "bg-neutral-900 ring-neutral-900"
            : isDark
            ? "bg-neutral-800 ring-neutral-700"
            : "bg-neutral-200 ring-neutral-300",
        ].join(" ")}
        aria-pressed={enabled}
        aria-label="Toggle fast delivery"
      >
        <span
          className={[
            "inline-block h-4 w-4 transform rounded-full transition-transform duration-200 ease-in-out",
            enabled ? "translate-x-6" : "translate-x-1",
            isDark ? (enabled ? "bg-neutral-900" : "bg-neutral-500") : "bg-white",
            "shadow-sm",
          ].join(" ")}
        />
      </button>
      <span className={["text-sm", isDark ? "text-neutral-400" : "text-neutral-600"].join(" ")}>
        Fast delivery (5 days)
      </span>
    </div>
  )

  const starterFeatures = ["1 design concept", "Custom code", "On-time delivery", "Email support"]
  const proFeatures = ["3 design concepts", "Custom code", "On-time delivery", "Priority support", "Micro-interactions"]

  return (
    <div className="w-full">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-[900px] mx-auto">
        <div
          className={[
            "rounded-3xl p-2",
            "bg-white/65 backdrop-blur-md",
            "border border-neutral-200/70",
            "shadow-[0_12px_40px_-15px_rgba(0,0,0,0.15)]",
            "ring-1 ring-inset ring-white/40",
          ].join(" ")}
        >
          <div
            className={[
              "rounded-2xl p-8 mb-2",
              "bg-white/80 backdrop-blur-sm",
              "border border-neutral-200/80",
              "ring-1 ring-inset ring-neutral-900/5",
            ].join(" ")}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-900">Starter</h2>
                <p className="text-neutral-600 text-base leading-relaxed mt-1">
                  Launch quickly with a solid landing page.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white/70 px-3 py-1 text-xs font-medium text-neutral-700 backdrop-blur">
                Most Friendly
              </span>
            </div>

            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold tracking-tighter text-neutral-900">$1299</span>
              <span className="text-neutral-400 text-lg ml-1">/fixed</span>
            </div>

            <button
              className={[
                "w-full rounded-xl font-semibold text-base py-4",
                "bg-neutral-900 text-white",
                "hover:opacity-95 transition-opacity duration-200",
                "flex items-center justify-center gap-2.5",
                "shadow-[0_4px_18px_-6px_rgba(0,0,0,0.4)]",
                "ring-1 ring-inset ring-neutral-900/10",
              ].join(" ")}
            >
              Book a call
              <Calendar className="w-5 h-5 text-neutral-300" />
            </button>
          </div>

          <div
            className={[
              "px-6 pb-6 pt-4",
              "bg-white/50 backdrop-blur-sm rounded-2xl",
              "border border-neutral-200/70",
              "ring-1 ring-inset ring-white/30",
            ].join(" ")}
          >
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              {starterFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <LightCheckIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-neutral-800 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <ToggleSwitch enabled={starterFast} onChange={setStarterFast} />
            </div>
          </div>
        </div>

        {/* Dark (Pro) Card - glassy with unique border/outline */}
        <div
          className={[
            "rounded-3xl p-2",
            "bg-neutral-900/60 backdrop-blur-md",
            "border border-neutral-800",
            "shadow-[0_12px_50px_-15px_rgba(0,0,0,0.55)]",
            "ring-1 ring-inset ring-white/5",
            "dark",
          ].join(" ")}
        >
          <div
            className={[
              "rounded-2xl p-8 mb-2",
              "bg-neutral-900/70 backdrop-blur-sm",
              "border border-neutral-800",
              "ring-1 ring-inset ring-white/10",
            ].join(" ")}
          >
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-neutral-50">Pro</h2>
                <p className="text-neutral-400 text-base leading-relaxed mt-1">
                  Go further with more concepts and polish.
                </p>
              </div>
              <span className="inline-flex items-center rounded-full border border-neutral-700 bg-neutral-900/50 px-3 py-1 text-xs font-medium text-neutral-300 backdrop-blur">
                Best Value
              </span>
            </div>

            <div className="flex items-baseline mb-8">
              <span className="text-5xl font-bold tracking-tighter text-white">$2299</span>
              <span className="text-neutral-500 text-lg ml-1">/fixed</span>
            </div>

            <button
              className={[
                "w-full rounded-xl font-semibold text-base py-4",
                "bg-white text-neutral-900",
                "hover:opacity-95 transition-opacity duration-200",
                "flex items-center justify-center gap-2.5",
                "shadow-[0_4px_18px_-6px_rgba(255,255,255,0.35)]",
                "ring-1 ring-inset ring-white/30",
              ].join(" ")}
            >
              Book a call
              <Calendar className="w-5 h-5 text-neutral-600" />
            </button>
          </div>

          <div
            className={[
              "px-6 pb-6 pt-4",
              "bg-neutral-900/55 backdrop-blur-sm rounded-2xl",
              "border border-neutral-800",
              "ring-1 ring-inset ring-white/10",
            ].join(" ")}
          >
            <div className="grid grid-cols-2 gap-y-4 gap-x-4">
              {proFeatures.map((feature) => (
                <div key={feature} className="flex items-center gap-3">
                  <DarkCheckIcon className="w-4 h-4 flex-shrink-0" />
                  <span className="text-neutral-300 text-sm font-medium">{feature}</span>
                </div>
              ))}
            </div>
            <div className="mt-8">
              <ToggleSwitch enabled={proFast} onChange={setProFast} isDark />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}