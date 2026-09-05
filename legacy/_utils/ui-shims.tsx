'use client'
import * as React from 'react'
import { cn } from './cn'

// separator shim
export const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & { orientation?: 'horizontal' | 'vertical' }
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <div
    ref={ref}
    role="separator"
    className={cn(
      'shrink-0 bg-neutral-800',
      orientation === 'horizontal' ? 'h-px w-full' : 'h-full w-px',
      className
    )}
    {...props}
  />
))
Separator.displayName = 'Separator'

// button shim
export const Button = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: string; size?: string }
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    className={cn('inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium', className)}
    {...props}
  />
))
Button.displayName = 'Button'
