"use client"
import { useState, useEffect } from "react"
import { Check } from "lucide-react"
import { cn } from "../_utils/cn"

interface StepBreadcrumbProps {
  className?: string
  steps?: Array<{ id: string; name: string; status: "complete" | "current" | "upcoming" }>
}

export function Breadcrumb({
  className,
  steps = [
    { id: "01", name: "Cart", status: "complete" },
    { id: "02", name: "Shipping", status: "current" },
    { id: "03", name: "Payment", status: "upcoming" },
    { id: "04", name: "Confirmation", status: "upcoming" },
  ],
}: StepBreadcrumbProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 500)
    }

    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)

    return () => {
      window.removeEventListener("resize", checkScreenSize)
    }
  }, [])

  return (
    <nav
      className={cn(
        "p-2 sm:p-3 rounded-xl bg-gray-100 dark:bg-zinc-900 text-gray-900 dark:text-zinc-100 overflow-x-auto scrollbar-hide",
        className,
      )}
      aria-label="Progress"
    >
      <ol className={cn("flex w-full min-w-max", isMobile ? "flex-col space-y-3" : "items-center justify-between")}>
        {steps.map((step, stepIdx) => (
          <li key={step.id} className={cn("relative", !isMobile && stepIdx !== steps.length - 1 && "pr-8 md:pr-16")}>
            {!isMobile && stepIdx !== steps.length - 1 && (
              <div
                className={cn(
                  "absolute top-4 left-7 -ml-px mt-0.5 h-0.5 w-full",
                  step.status === "complete" ? "bg-green-600 dark:bg-green-500" : "bg-gray-300 dark:bg-zinc-700",
                )}
                aria-hidden="true"
              />
            )}
            <div className={cn("group flex", isMobile ? "items-center" : "items-start")}>
              <span className="flex items-center">
                <span
                  className={cn(
                    "flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full",
                    step.status === "complete"
                      ? "bg-green-600 dark:bg-green-500 text-white"
                      : step.status === "current"
                        ? "border-2 border-green-600 dark:border-green-500 bg-white dark:bg-zinc-900"
                        : "border-2 border-gray-300 dark:border-zinc-700 bg-white dark:bg-zinc-900",
                  )}
                >
                  {step.status === "complete" ? (
                    <Check className="h-2.5 w-2.5 sm:h-3 sm:w-3 text-white" aria-hidden="true" />
                  ) : (
                    <span
                      className={cn(
                        "text-[10px] sm:text-xs",
                        step.status === "current"
                          ? "text-green-600 dark:text-green-500"
                          : "text-gray-500 dark:text-zinc-500",
                      )}
                    >
                      {step.id}
                    </span>
                  )}
                </span>
              </span>
              <span className="ml-2 text-[10px] sm:text-xs">
                <span
                  className={cn(
                    "font-medium",
                    step.status === "complete"
                      ? "text-gray-900 dark:text-zinc-100"
                      : step.status === "current"
                        ? "text-green-600 dark:text-green-500"
                        : "text-gray-500 dark:text-zinc-500",
                  )}
                >
                  {step.name}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  )
}
