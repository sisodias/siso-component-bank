import { useGSAP } from '@gsap/react'
import { gsap } from 'gsap'
import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

function Input({ ref, className, type, ...props }: InputProps & { ref?: React.RefObject<HTMLInputElement | null> }) {
  const radius = 100 // change this to increase the radius of the hover effect
  const containerRef = React.useRef<HTMLDivElement | null>(null)
  const gradientRef = React.useRef(null)
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 })

  useGSAP(() => {
    gsap.set(gradientRef.current, {
      background: `radial-gradient(0px circle at ${mousePosition.x}px ${mousePosition.y}px, #3b82f6, transparent 80%)`,
    })
  }, { scope: containerRef })

  function handleMouseMove(e: React.MouseEvent) {
    if (!containerRef.current)
      return

    const { left, top } = containerRef.current.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top

    setMousePosition({ x, y })

    gsap.to(gradientRef.current, {
      background: `radial-gradient(${radius}px circle at ${x}px ${y}px, #3b82f6, transparent 80%)`,
      duration: 0.1,
    })
  }

  function handleMouseEnter(e: React.MouseEvent) {
    if (!containerRef.current)
      return

    const { left, top } = containerRef.current.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top

    setMousePosition({ x, y })
    gsap.set(gradientRef.current, {
      background: `radial-gradient(0px circle at ${x}px ${y}px, #3b82f6, transparent 80%)`,
    })

    gsap.to(gradientRef.current, {
      background: `radial-gradient(${radius}px circle at ${x}px ${y}px, #3b82f6, transparent 80%)`,
      duration: 0.3,
    })
  }

  function handleMouseLeave() {
    gsap.to(gradientRef.current, {
      background: `radial-gradient(0px circle at ${mousePosition.x}px ${mousePosition.y}px, #3b82f6, transparent 80%)`,
      duration: 0.3,
    })
  }

  return (
    <div
      ref={containerRef}
      className="group/input rounded-lg p-[2px] transition duration-300 relative"
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={gradientRef}
        className="absolute inset-0 rounded-lg"
      />

      <input
        type={type}
        className={cn(
          `relative z-10 shadow-input dark:placeholder-text-neutral-600 flex h-10 w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/input:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600`,
          className,
        )}
        ref={ref}
        {...props}
      />
    </div>
  )
}
Input.displayName = 'Input'

export { Input }
