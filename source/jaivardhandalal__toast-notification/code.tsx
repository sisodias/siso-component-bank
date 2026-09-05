import * as React from "react"
import { cn } from "@/lib/utils"

// ─── Types ────────────────────────────────────────────────────────────────────

export type ToastVariant = "default" | "success" | "error" | "warning" | "info"

export interface ToastData {
  id: number
  variant: ToastVariant
  title: string
  description?: string
}

// ─── Context ──────────────────────────────────────────────────────────────────

interface ToastContextValue {
  toasts: ToastData[]
  toast: (variant: ToastVariant, title: string, description?: string) => void
  dismiss: (id: number) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export const TOAST_DURATION = 4000

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastData[]>([])
  const counter = React.useRef(0)

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    (variant: ToastVariant, title: string, description?: string) => {
      const id = ++counter.current
      setToasts((prev) => {
        const next = [...prev, { id, variant, title, description }]
        return next.length > 5 ? next.slice(-5) : next
      })
      setTimeout(() => dismiss(id), TOAST_DURATION)
    },
    [dismiss]
  )

  return (
    <ToastContext.Provider value={{ toasts, toast, dismiss }}>
      {children}
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error("useToast must be used within a <ToastProvider>")
  return ctx
}

// ─── Primitives ───────────────────────────────────────────────────────────────

const variantStyles: Record<ToastVariant, string> = {
  default: "border-l-border",
  success: "border-l-green-500  dark:border-l-green-400",
  error:   "border-l-red-500    dark:border-l-red-400",
  warning: "border-l-amber-400  dark:border-l-amber-300",
  info:    "border-l-blue-500   dark:border-l-blue-400",
}

function Toast({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"li"> & { variant?: ToastVariant }) {
  return (
    <li
      data-slot="toast"
      data-variant={variant}
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      className={cn(
        "bg-card text-card-foreground relative flex w-full items-start gap-3",
        "rounded-xl border border-l-4 px-4 py-3 shadow-sm",
        "animate-in slide-in-from-bottom-2 fade-in duration-300",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

function ToastIcon({ className, ...props }: React.ComponentProps<"span">) {
  return (
    <span
      data-slot="toast-icon"
      className={cn("mt-0.5 shrink-0", className)}
      {...props}
    />
  )
}

function ToastContent({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="toast-content"
      className={cn("flex min-w-0 flex-1 flex-col gap-0.5", className)}
      {...props}
    />
  )
}

function ToastTitle({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="toast-title"
      className={cn("text-sm font-medium leading-snug", className)}
      {...props}
    />
  )
}

function ToastDescription({ className, ...props }: React.ComponentProps<"p">) {
  return (
    <p
      data-slot="toast-description"
      className={cn("text-muted-foreground text-xs leading-snug", className)}
      {...props}
    />
  )
}

function ToastClose({ className, ...props }: React.ComponentProps<"button">) {
  return (
    <button
      data-slot="toast-close"
      aria-label="Dismiss notification"
      className={cn(
        "text-muted-foreground cursor-pointer hover:text-foreground shrink-0 mt-0.5 rounded transition-colors",
        className
      )}
      {...props}
    >
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </button>
  )
}

function ToastProgress({
  className,
  duration = TOAST_DURATION,
  ...props
}: React.ComponentProps<"div"> & { duration?: number }) {
  return (
    <div
      data-slot="toast-progress"
      className={cn("bg-border absolute bottom-0 left-0 h-px", className)}
      style={{ animation: `toast-shrink ${duration}ms linear forwards`, ...props.style }}
      {...props}
    />
  )
}

function ToastViewport({ className, ...props }: React.ComponentProps<"ol">) {
  return (
    <ol
      data-slot="toast-viewport"
      role="region"
      aria-live="polite"
      aria-label="Notifications"
      className={cn(
        "fixed bottom-5 right-5 z-50 flex w-80 flex-col-reverse gap-2 pointer-events-none",
        "[&>li]:pointer-events-auto",
        className
      )}
      {...props}
    />
  )
}

// ─── Icons ────────────────────────────────────────────────────────────────────

export const toastIcons: Record<ToastVariant, React.ReactNode> = {
  default: null,
  success: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="stroke-green-500 dark:stroke-green-400">
      <circle cx="8" cy="8" r="7" strokeWidth="1.4" />
      <path d="M5 8l2 2 4-4" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  ),
  error: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="stroke-red-500 dark:stroke-red-400">
      <circle cx="8" cy="8" r="7" strokeWidth="1.4" />
      <path d="M8 5v3.5M8 10.5v.5" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  warning: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="stroke-amber-400 dark:stroke-amber-300">
      <path d="M8 2L14.5 13.5H1.5L8 2z" strokeWidth="1.4" strokeLinejoin="round" />
      <path d="M8 6.5v3M8 11v.5" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
  info: (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" className="stroke-blue-500 dark:stroke-blue-400">
      <circle cx="8" cy="8" r="7" strokeWidth="1.4" />
      <path d="M8 7v4M8 5.5v.5" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  ),
}

// ─── Toaster (drop once in your root layout) ──────────────────────────────────

export function Toaster() {
  const { toasts, dismiss } = useToast()

  return (
    <>
      <style>{`@keyframes toast-shrink { from { width:100% } to { width:0% } }`}</style>
      <ToastViewport>
        {toasts.map((t) => (
          <Toast key={t.id} variant={t.variant}>
            {toastIcons[t.variant] && (
              <ToastIcon>{toastIcons[t.variant]}</ToastIcon>
            )}
            <ToastContent>
              <ToastTitle>{t.title}</ToastTitle>
              {t.description && (
                <ToastDescription>{t.description}</ToastDescription>
              )}
            </ToastContent>
            <ToastClose onClick={() => dismiss(t.id)} />
            <ToastProgress />
          </Toast>
        ))}
      </ToastViewport>
    </>
  )
}

// ─── Component (used by demo) ─────────────────────────────────────────────────

export const Component = ({ children }: { children?: React.ReactNode }) => {
  return (
    <ToastProvider>
      {children}
      <Toaster />
    </ToastProvider>
  )
}

export {
  Toast,
  ToastIcon,
  ToastContent,
  ToastTitle,
  ToastDescription,
  ToastClose,
  ToastProgress,
  ToastViewport,
}