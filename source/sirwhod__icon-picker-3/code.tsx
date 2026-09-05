import { useState, useEffect, useRef, useCallback } from 'react'
import { DynamicIcon, type IconName } from 'lucide-react/dynamic'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'

const ICON_INITIAL_CHARGE = 20 * 5
const ICONS_BY_CHARGE = 6 * 3
const SCROLL_THRESHOLD = 100

interface IconPickerProps {
  icons: IconName[]
  onIconSelect: (iconName: IconName) => void
  selectedIcon?: IconName
  heightClassName?: string
}

export function IconPicker({
  icons,
  onIconSelect,
  selectedIcon,
  heightClassName = 'h-[280px]',
}: IconPickerProps) {
  const [visibleCount, setVisibleCount] = useState(ICON_INITIAL_CHARGE)
  const rootScrollAreaRef = useRef<HTMLDivElement>(null)
  const viewportScrollElementRef = useRef<HTMLElement | null>(null)

  const iconesAtuais = icons.slice(0, visibleCount)

  useEffect(() => {
    setVisibleCount(ICON_INITIAL_CHARGE)
    if (viewportScrollElementRef.current) {
      viewportScrollElementRef.current.scrollTop = 0
    }
  }, [icons])

  const loadMoreIcons = useCallback(() => {
    setVisibleCount((prevCount) => {
      if (prevCount >= icons.length) {
        return prevCount
      }
      return Math.min(prevCount + ICONS_BY_CHARGE, icons.length)
    })
  }, [icons.length])

  useEffect(() => {
    const rootElement = rootScrollAreaRef.current
    if (rootElement && !viewportScrollElementRef.current) {
      const viewport = rootElement.querySelector<HTMLElement>('[data-radix-scroll-area-viewport]')
      viewportScrollElementRef.current = viewport
    }

    const currentViewport = viewportScrollElementRef.current
    if (!currentViewport) return

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = currentViewport
      if (scrollHeight - scrollTop - clientHeight < SCROLL_THRESHOLD) {
        if (visibleCount < icons.length) {
          loadMoreIcons()
        }
      }
    }

    currentViewport.addEventListener('scroll', handleScroll)
    return () => {
      currentViewport.removeEventListener('scroll', handleScroll)
    }
  }, [loadMoreIcons, visibleCount, icons.length])

  return (
    <ScrollArea ref={rootScrollAreaRef} className={cn('w-full', heightClassName)}>
      <div className="p-2 grid grid-cols-5 sm:grid-cols-9 gap-1">
        {iconesAtuais.map((iconName) => (
          <div
            key={iconName}
            className={cn(
              'flex flex-col items-center justify-center text-center p-2 rounded-sm hover:bg-accent cursor-pointer group',
              selectedIcon === iconName && 'bg-accent text-accent-foreground ring-2 ring-primary',
            )}
            title={iconName}
            onClick={() => onIconSelect(iconName)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onIconSelect(iconName)}}
          >
            <DynamicIcon
              name={iconName}
              className={cn(
                'group-hover:scale-110 transition-transform',
                selectedIcon === iconName ? 'text-primary' : 'text-accent-foreground',
              )}
              size={16}
            />
          </div>
        ))}
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  )
}