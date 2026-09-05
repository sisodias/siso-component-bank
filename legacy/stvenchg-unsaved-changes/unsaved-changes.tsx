import * as React from "react"
import { AnimatePresence, motion } from "motion/react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "../_utils/cn"
import { Button } from "./button"

/**
 * Triangle warning icon
 */
const TriangleWarning = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={cn("size-4.5 shrink-0", className)}
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="currentColor">
      <path
        d="M7.63796 3.48996L2.21295 12.89C1.60795 13.9399 2.36395 15.25 3.57495 15.25H14.425C15.636 15.25 16.392 13.9399 15.787 12.89L10.362 3.48996C9.75696 2.44996 8.24296 2.44996 7.63796 3.48996Z"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M9 6.75V9.75"
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
      <path
        d="M9 13.5C8.448 13.5 8 13.05 8 12.5C8 11.95 8.448 11.5 9 11.5C9.552 11.5 10 11.9501 10 12.5C10 13.0499 9.552 13.5 9 13.5Z"
        fill="currentColor"
        stroke="none"
      />
    </g>
  </svg>
)

/**
 * Gradient spinner loader
 */
const Loader2 = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={cn("size-4.5 shrink-0 animate-spin", className)}
    viewBox="0 0 18 18"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="currentColor">
      <path
        d="M9 16.25C13.0041 16.25 16.25 13.0041 16.25 9C16.25 4.99594 13.0041 1.75 9 1.75"
        fill="none"
        stroke="url(#nc-loader-2-outline-gradient-1)"
        strokeWidth="1.5"
      />
      <path
        d="M9 16.25C4.99594 16.25 1.75 13.0041 1.75 9C1.75 4.99594 4.99594 1.75 9 1.75"
        fill="none"
        stroke="url(#nc-loader-2-outline-gradient-2)"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="16.25" fill="currentColor" r="0.75" stroke="none" />
      <defs>
        <linearGradient
          id="nc-loader-2-outline-gradient-1"
          gradientUnits="userSpaceOnUse"
          x1="9"
          x2="9"
          y1="2.5"
          y2="16.25"
        >
          <stop stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="1" stopColor="currentColor" />
        </linearGradient>
        <linearGradient
          id="nc-loader-2-outline-gradient-2"
          gradientUnits="userSpaceOnUse"
          x1="9"
          x2="9"
          y1="2.5"
          y2="16.25"
        >
          <stop stopColor="currentColor" stopOpacity="0.5" />
          <stop offset="1" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
    </g>
  </svg>
)

/**
 * Circle check icon for success state
 */
const CircleCheck = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={cn("size-4.5 shrink-0", className)}
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="currentColor">
      <path
        d="m6,0C2.691,0,0,2.691,0,6s2.691,6,6,6,6-2.691,6-6S9.309,0,6,0Zm2.853,4.45l-3.003,4c-.13.174-.329.282-.546.298-.019.001-.036.002-.054.002-.198,0-.389-.078-.53-.219l-1.503-1.5c-.293-.292-.293-.768,0-1.061s.768-.294,1.062,0l.892.89,2.484-3.31c.248-.331.718-.4,1.05-.149.331.249.398.719.149,1.05Z"
        fill="currentColor"
        strokeWidth="0"
      />
    </g>
  </svg>
)

/**
 * Circle warning icon for error state
 */
const CircleWarning = ({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) => (
  <svg
    className={cn("size-4.5 shrink-0", className)}
    viewBox="0 0 12 12"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g fill="currentColor">
      <path
        d="m6,0C2.691,0,0,2.691,0,6s2.691,6,6,6,6-2.691,6-6S9.309,0,6,0Zm-.75,3.5c0-.414.336-.75.75-.75s.75.336.75.75v3c0,.414-.336.75-.75.75s-.75-.336-.75-.75v-3Zm.75,6.25c-.482,0-.875-.393-.875-.875s.393-.875.875-.875.875.393.875.875-.393.875-.875.875Z"
        fill="currentColor"
        strokeWidth="0"
      />
    </g>
  </svg>
)

const unsavedChangesVariants = cva(
  "fixed inset-x-0 z-50 mx-auto w-fit flex items-center gap-2 rounded-full p-2 pl-3 text-sm font-medium shadow-lg shadow-black/5 border bg-background overflow-hidden",
  {
    variants: {
      position: {
        bottom: "bottom-3",
        top: "top-3",
      },
      size: {
        sm: "h-10",
        default: "h-11",
        lg: "h-12",
      },
    },
    defaultVariants: {
      position: "bottom",
      size: "default",
    },
  }
)

export interface UnsavedChangesProps
  extends VariantProps<typeof unsavedChangesVariants> {
  /** Additional CSS class */
  className?: string
  /** Show/hide the component */
  open?: boolean
  /** Saving in progress state */
  isSaving?: boolean
  /** Save success state */
  success?: boolean
  /** Error state */
  error?: boolean
  /** Default label (default: "Unsaved Changes") */
  label?: string
  /** Label while saving */
  savingLabel?: string
  /** Label after successful save */
  successLabel?: string
  /** Label on error */
  errorLabel?: string
  /** Reset button text */
  resetLabel?: string
  /** Save button text */
  saveLabel?: string
  /** Reset callback */
  onReset?: () => void
  /** Save callback */
  onSave?: () => void
  /** Disable all buttons */
  disabled?: boolean
  /** Disable only Reset button */
  resetDisabled?: boolean
  /** Disable only Save button */
  saveDisabled?: boolean
  /** Custom icon */
  icon?: React.ReactNode
  /** Hide Reset button */
  hideReset?: boolean
}

/**
 * UnsavedChanges Component
 *
 * Animated floating bar to notify unsaved changes with saving states.
 *
 * @example
 * ```tsx
 * <UnsavedChanges
 *   open={hasChanges}
 *   isSaving={isSaving}
 *   success={isSuccess}
 *   error={isError}
 *   onReset={handleReset}
 *   onSave={handleSave}
 * />
 * ```
 */
function UnsavedChanges({
  className,
  open = true,
  isSaving = false,
  success = false,
  error = false,
  position,
  size,
  label = "Unsaved Changes",
  savingLabel = "Saving…",
  successLabel = "Changes saved",
  errorLabel = "An error occurred",
  resetLabel = "Reset",
  saveLabel = "Save",
  onReset,
  onSave,
  disabled = false,
  resetDisabled = false,
  saveDisabled = false,
  icon,
  hideReset = false,
}: UnsavedChangesProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          layout
          style={{ borderRadius: 24 }}
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{
            type: "spring",
            visualDuration: 0.3,
            bounce: 0.15,
          }}
          className={cn(unsavedChangesVariants({ position, size, className }))}
          role="alert"
          aria-live="polite"
        >
          {/* Label with icon */}
          <motion.div
            layout="position"
            className="flex items-center gap-2 text-foreground"
          >
            <AnimatePresence mode="wait" initial={false}>
              {error ? (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <CircleWarning className="text-destructive" />
                </motion.div>
              ) : success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <CircleCheck className="text-emerald-500" />
                </motion.div>
              ) : isSaving ? (
                <motion.div
                  key="saving"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  <Loader2 className="text-muted-foreground" />
                </motion.div>
              ) : (
                <motion.div
                  key="default"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ duration: 0.2 }}
                >
                  {icon ?? <TriangleWarning className="text-muted-foreground" />}
                </motion.div>
              )}
            </AnimatePresence>
            <motion.span layout="position" className="whitespace-nowrap mr-2">
              {error
                ? errorLabel
                : success
                  ? successLabel
                  : isSaving
                    ? savingLabel
                    : label}
            </motion.span>
          </motion.div>

          {/* Actions */}
          <AnimatePresence mode="popLayout">
            {!isSaving && !success && !error && (
              <motion.div
                initial={{ opacity: 0, scale: 1, width: "auto", marginLeft: "1rem" }}
                animate={{ opacity: 1, scale: 1, width: "auto", marginLeft: "1rem" }}
                exit={{ opacity: 0, scale: 0.8, width: 0, marginLeft: 0 }}
                transition={{
                  opacity: { duration: 0.2 },
                  scale: { duration: 0.2 },
                  width: { duration: 0.2, ease: "easeOut" },
                  marginLeft: { duration: 0.2, ease: "easeOut" },
                }}
                className="relative flex items-center gap-2 overflow-hidden pl-2"
              >
                {/* Gradient mask */}
                <div className="absolute inset-y-0 left-0 w-2 bg-linear-to-r from-transparent to-background z-20 pointer-events-none" />

                {/* Buttons container with background */}
                <div className="flex items-center gap-2 bg-background z-10">
                  {!hideReset && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="h-7 rounded-full cursor-pointer"
                      onClick={onReset}
                      disabled={disabled || resetDisabled}
                    >
                      {resetLabel}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    className="h-7 rounded-full cursor-pointer"
                    onClick={onSave}
                    disabled={disabled || saveDisabled}
                  >
                    {saveLabel}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export { UnsavedChanges, unsavedChangesVariants }
