"use client"

import * as React from "react"
import { useRef } from "react"

interface DockProps {
  className?: string
  children: React.ReactNode
  maxAdditionalSize?: number
  iconSize?: number
}

interface DockIconProps {
  className?: string
  src?: string
  href: string
  name: string
  handleIconHover?: (e: React.MouseEvent<HTMLLIElement>) => void
  children?: React.ReactNode
  iconSize?: number
}

type ScaleValueParams = [number, number]

// Utility function for className merging
const cn = (...classes: (string | undefined)[]) => classes.filter(Boolean).join(' ')

export const scaleValue = function (
  value: number,
  from: ScaleValueParams,
  to: ScaleValueParams
): number {
  const scale = (to[1] - to[0]) / (from[1] - from[0])
  const capped = Math.min(from[1], Math.max(from[0], value)) - from[0]
  return Math.floor(capped * scale + to[0])
}

export function DockIcon({
  className,
  src,
  href,
  name,
  handleIconHover,
  children,
  iconSize,
}: DockIconProps) {
  const ref = useRef<HTMLLIElement | null>(null)

  return (
    <>
      <style jsx>{`
        .dock-icon:hover + .dock-icon {
          width: calc(var(--icon-size) * 1.4 + var(--dock-offset-right, 0px));
          height: calc(var(--icon-size) * 1.4 + var(--dock-offset-right, 0px));
          transform: translateY(calc(var(--icon-size) * -0.2));
        }

        .dock-icon:hover + .dock-icon + .dock-icon {
          width: calc(var(--icon-size) * 1.2 + var(--dock-offset-right, 0px));
          height: calc(var(--icon-size) * 1.2 + var(--dock-offset-right, 0px));
          transform: translateY(calc(var(--icon-size) * -0.1));
        }

        .dock-icon:has(+ .dock-icon:hover) {
          width: calc(var(--icon-size) * 1.4 + var(--dock-offset-left, 0px));
          height: calc(var(--icon-size) * 1.4 + var(--dock-offset-left, 0px));
          transform: translateY(calc(var(--icon-size) * -0.2));
        }

        .dock-icon:has(+ .dock-icon + .dock-icon:hover) {
          width: calc(var(--icon-size) * 1.2 + var(--dock-offset-left, 0px));
          height: calc(var(--icon-size) * 1.2 + var(--dock-offset-left, 0px));
          transform: translateY(calc(var(--icon-size) * -0.1));
        }

        .dock-icon:hover {
          width: calc(var(--icon-size) * 1.6);
          height: calc(var(--icon-size) * 1.6);
          transform: translateY(calc(var(--icon-size) * -0.3));
        }
      `}</style>
      <li
        ref={ref}
        style={{
          transition: "all cubic-bezier(0.23, 1, 0.32, 1) 200ms",
          "--icon-size": `${iconSize}px`,
        } as React.CSSProperties}
        onMouseMove={handleIconHover}
        className={cn(
          "dock-icon group/li flex cursor-pointer items-end justify-center transition-all duration-200 ease-out",
          "h-[var(--icon-size)] w-[var(--icon-size)]",
          className
        )}
      >
        <a
          href={href}
          className="relative group/icon block w-full h-full"
        >
          <div 
            className="relative aspect-square w-full h-full rounded-[22%] overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-200"
            style={{
              background: src ? 'transparent' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            }}
          >
            {src ? (
              <img
                src={src}
                alt={name}
                className="h-full w-full object-cover rounded-[inherit]"
                draggable={false}
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center text-white text-2xl font-bold">
                {children || name.charAt(0)}
              </div>
            )}
          </div>
          
          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover/li:opacity-100 transition-opacity duration-200 pointer-events-none z-50">
            <div className="bg-black/80 backdrop-blur-sm text-white text-sm px-2 py-1 rounded whitespace-nowrap">
              {name}
            </div>
            <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
          </div>

          {/* Active indicator dot */}
          <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full opacity-70 shadow-sm"></div>
        </a>
      </li>
    </>
  )
}

export function Dock({
  className,
  children,
  maxAdditionalSize = 8,
  iconSize = 60,
}: DockProps) {
  const dockRef = useRef<HTMLDivElement | null>(null)

  const handleIconHover = (e: React.MouseEvent<HTMLLIElement>) => {
    if (!dockRef.current) return
    const mousePos = e.clientX
    const iconPosLeft = e.currentTarget.getBoundingClientRect().left
    const iconWidth = e.currentTarget.getBoundingClientRect().width

    const cursorDistance = (mousePos - iconPosLeft) / iconWidth
    const offsetPixels = scaleValue(
      cursorDistance,
      [0, 1],
      [maxAdditionalSize * -1, maxAdditionalSize]
    )

    dockRef.current.style.setProperty(
      "--dock-offset-left",
      `${offsetPixels * -1}px`
    )

    dockRef.current.style.setProperty(
      "--dock-offset-right",
      `${offsetPixels}px`
    )
  }

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <nav 
        ref={dockRef} 
        role="navigation" 
        aria-label="Dock"
        className={cn(
          "backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl p-2 shadow-2xl",
          className
        )}
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
          backdropFilter: 'blur(20px)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.2)',
        }}
      >
        <ul className="flex items-end gap-1">
          {React.Children.map(children, (child) =>
            React.isValidElement<DockIconProps>(child)
              ? React.cloneElement(child as React.ReactElement<DockIconProps>, {
                  handleIconHover,
                  iconSize,
                })
              : child
          )}
        </ul>
      </nav>
    </div>
  )
}