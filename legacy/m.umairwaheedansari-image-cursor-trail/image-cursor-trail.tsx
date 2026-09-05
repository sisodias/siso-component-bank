"use client"

import React, { createRef, useRef, type ReactNode } from "react"
import { SparklesIcon } from "lucide-react"

function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ")
}

interface ImageMouseTrailProps {
  items: string[]
  children?: ReactNode
  className?: string
  imgClass?: string
  distance?: number
  maxNumberOfImages?: number
  fadeAnimation?: boolean
}

function ImageCursorTrail({
  items,
  children,
  className,
  maxNumberOfImages = 5,
  imgClass = "w-40 h-48",
  distance = 20,
  fadeAnimation = false,
}: ImageMouseTrailProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const refs = useRef(items.map(() => createRef<HTMLImageElement>()))
  const currentZIndexRef = useRef(1)

  let globalIndex = 0
  let last = { x: 0, y: 0 }

  const activate = (image: HTMLImageElement, x: number, y: number) => {
    const containerRect = containerRef.current?.getBoundingClientRect()
    if (!containerRect) return
    const relativeX = x - containerRect.left
    const relativeY = y - containerRect.top
    image.style.left = `${relativeX}px`
    image.style.top = `${relativeY}px`

    if (currentZIndexRef.current > 40) {
      currentZIndexRef.current = 1
    }
    image.style.zIndex = String(currentZIndexRef.current)
    currentZIndexRef.current++

    image.dataset.status = "active"
    if (fadeAnimation) {
      setTimeout(() => {
        image.dataset.status = "inactive"
      }, 1500)
    }
    last = { x, y }
  }

  const distanceFromLast = (x: number, y: number) =>
    Math.hypot(x - last.x, y - last.y)

  const deactivate = (image: HTMLImageElement) => {
    image.dataset.status = "inactive"
  }

  const handleOnMove = (e: MouseEvent | Touch) => {
    if (distanceFromLast(e.clientX, e.clientY) > window.innerWidth / distance) {
      const lead = refs.current[globalIndex % refs.current.length].current
      const tail =
        refs.current[
          (globalIndex - maxNumberOfImages) % refs.current.length
        ]?.current
      if (lead) activate(lead, e.clientX, e.clientY)
      if (tail) deactivate(tail)
      globalIndex++
    }
  }

  return (
    <section
      onMouseMove={(e) => handleOnMove(e)}
      onTouchMove={(e) => handleOnMove(e.touches[0])}
      ref={containerRef}
      className={cn(
        "relative grid h-[600px] w-full place-content-center overflow-hidden rounded-lg",
        className
      )}
    >
      {items.map((item, index) => (
        <img
          key={index}
          className={cn(
            "opacity:0 data-[status='active']:ease-out-expo absolute -translate-x-[50%] -translate-y-[50%] scale-0 rounded-3xl object-cover transition-transform duration-300 data-[status='active']:scale-100 data-[status='active']:opacity-100 data-[status='active']:duration-500",
            imgClass
          )}
          data-index={index}
          data-status="inactive"
          src={item}
          alt={`image-${index}`}
          ref={refs.current[index]}
        />
      ))}
      {children}
    </section>
  )
}

export default function CursorTrailDemo() {
  const images = [
    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1482192596544-9eb780fc7f66?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1506744038136-46273834b3fb?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1521295121783-8a321d551ad2?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1465101162946-4377e57745c3?q=80&w=1200&auto=format",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=1200&auto=format",
  ]

  return (
    <section className="mx-auto w-full max-w-4xl rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-t-[44px]">
      <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/5 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px]">
        <ImageCursorTrail
          items={images}
          maxNumberOfImages={5}
          distance={25}
          imgClass="sm:w-40 w-28 sm:h-48 h-36"
          className="max-w-4xl rounded-3xl"
        />
      </div>
    </section>
  )
}
