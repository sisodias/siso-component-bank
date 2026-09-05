'use client'
import React from 'react'
import { Menu, X, ChevronRight } from 'lucide-react'
import { useScroll, motion, useMotionValue, animate, HTMLMotionProps } from 'framer-motion'

// ── utils ─────────────────────────────────────────────────────────────────────
function cn(...classes: (string | undefined | false | null)[]) {
  return classes.filter(Boolean).join(' ')
}

// ── useMeasure ────────────────────────────────────────────────────────────────
function useMeasure(): [React.RefCallback<HTMLElement>, { width: number; height: number }] {
  const [size, setSize] = React.useState({ width: 0, height: 0 })
  const ref = React.useCallback((node: HTMLElement | null) => {
    if (!node) return
    const observer = new ResizeObserver(([entry]) => {
      setSize({ width: entry.contentRect.width, height: entry.contentRect.height })
    })
    observer.observe(node)
    setSize({ width: node.offsetWidth, height: node.offsetHeight })
  }, [])
  return [ref, size]
}

// ── InfiniteSlider ────────────────────────────────────────────────────────────
type InfiniteSliderProps = {
  children: React.ReactNode
  gap?: number
  duration?: number
  durationOnHover?: number
  direction?: 'horizontal' | 'vertical'
  reverse?: boolean
  className?: string
}

function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  direction = 'horizontal',
  reverse = false,
  className,
}: InfiniteSliderProps) {
  const [currentDuration, setCurrentDuration] = React.useState(duration)
  const [ref, { width, height }] = useMeasure()
  const translation = useMotionValue(0)
  const [isTransitioning, setIsTransitioning] = React.useState(false)
  const [key, setKey] = React.useState(0)

  React.useEffect(() => {
    let controls: { stop: () => void } | undefined
    const size = direction === 'horizontal' ? width : height
    const contentSize = size + gap
    const from = reverse ? -contentSize / 2 : 0
    const to = reverse ? 0 : -contentSize / 2

    if (isTransitioning) {
      controls = animate(translation, [translation.get(), to], {
        ease: 'linear',
        duration: currentDuration * Math.abs((translation.get() - to) / contentSize),
        onComplete: () => { setIsTransitioning(false); setKey(k => k + 1) },
      })
    } else {
      controls = animate(translation, [from, to], {
        ease: 'linear',
        duration: currentDuration,
        repeat: Infinity,
        repeatType: 'loop',
        repeatDelay: 0,
        onRepeat: () => { translation.set(from) },
      })
    }
    return controls?.stop
  }, [key, translation, currentDuration, width, height, gap, isTransitioning, direction, reverse])

  const hoverProps = durationOnHover ? {
    onHoverStart: () => { setIsTransitioning(true); setCurrentDuration(durationOnHover) },
    onHoverEnd: () => { setIsTransitioning(true); setCurrentDuration(duration) },
  } : {}

  return (
    <div className={cn('overflow-hidden', className)}>
      <motion.div
        className="flex w-max"
        style={{
          ...(direction === 'horizontal' ? { x: translation } : { y: translation }),
          gap: `${gap}px`,
          flexDirection: direction === 'horizontal' ? 'row' : 'column',
        }}
        ref={ref as React.Ref<HTMLDivElement>}
        {...hoverProps}
      >
        {children}
        {children}
      </motion.div>
    </div>
  )
}

// ── ProgressiveBlur ───────────────────────────────────────────────────────────
const GRADIENT_ANGLES = { top: 0, right: 90, bottom: 180, left: 270 }

type ProgressiveBlurProps = {
  direction?: keyof typeof GRADIENT_ANGLES
  blurLayers?: number
  blurIntensity?: number
  className?: string
} & HTMLMotionProps<'div'>

function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 8,
  blurIntensity = 0.25,
  className,
  ...props
}: ProgressiveBlurProps) {
  const layers = Math.max(blurLayers, 2)
  const segmentSize = 1 / (blurLayers + 1)
  return (
    <div className={cn('relative', className)}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction]
        const gradientStops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map((pos, posIndex) =>
          `rgba(255,255,255,${posIndex === 1 || posIndex === 2 ? 1 : 0}) ${pos * 100}%`
        )
        const gradient = `linear-gradient(${angle}deg, ${gradientStops.join(', ')})`
        return (
          <motion.div
            key={index}
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ maskImage: gradient, WebkitMaskImage: gradient, backdropFilter: `blur(${index * blurIntensity}px)` }}
            {...props}
          />
        )
      })}
    </div>
  )
}

// ── HeroSection ───────────────────────────────────────────────────────────────
export function HeroSection() {
  return (
    <>
      <HeroHeader />
      <main className="overflow-x-hidden">
        <section>
          <div className="py-24 md:pb-32 lg:pb-36 lg:pt-72">
            <div className="relative z-10 mx-auto flex max-w-7xl flex-col px-6 lg:block lg:px-12">
              <div className="mx-auto max-w-lg text-center lg:ml-0 lg:max-w-full lg:text-left">
                <h1 className="mt-8 max-w-2xl text-balance text-5xl md:text-6xl lg:mt-16 xl:text-7xl">Build 10x Faster with NS</h1>
                <p className="mt-8 max-w-2xl text-balance text-lg">Highly customizable components for building modern websites and applications you mean it.</p>
                <div className="mt-12 flex flex-col items-center justify-center gap-2 sm:flex-row lg:justify-start">
                  <a href="#link" className="inline-flex h-12 items-center rounded-full bg-primary px-5 text-base font-medium text-primary-foreground hover:bg-primary/90">
                    <span className="text-nowrap">Start Building</span>
                    <ChevronRight className="ml-1 h-4 w-4" />
                  </a>
                  <a href="#link" className="inline-flex h-12 items-center rounded-full px-5 text-base font-medium hover:bg-zinc-950/5 dark:hover:bg-white/5">
                    <span className="text-nowrap">Request a demo</span>
                  </a>
                </div>
              </div>
            </div>
            <div className="aspect-[2/3] absolute inset-1 overflow-hidden rounded-3xl border border-black/10 sm:aspect-video lg:rounded-[3rem] dark:border-white/5">
              <video
                autoPlay
                loop
                className="size-full object-cover opacity-50 invert dark:opacity-35 dark:invert-0 dark:lg:opacity-75"
                src="https://ik.imagekit.io/lrigu76hy/tailark/dna-video.mp4?updatedAt=1745736251477"
              />
            </div>
          </div>
        </section>
        <section className="bg-background pb-2">
          <div className="group relative m-auto max-w-7xl px-6">
            <div className="flex flex-col items-center md:flex-row">
              <div className="md:max-w-44 md:border-r md:pr-6">
                <p className="text-end text-sm">Powering the best teams</p>
              </div>
              <div className="relative py-6 md:w-[calc(100%-11rem)]">
                <InfiniteSlider durationOnHover={20} duration={40} gap={112}>
                  {[
                    { src: 'https://html.tailus.io/blocks/customers/nvidia.svg', alt: 'Nvidia Logo', h: 'h-5' },
                    { src: 'https://html.tailus.io/blocks/customers/column.svg', alt: 'Column Logo', h: 'h-4' },
                    { src: 'https://html.tailus.io/blocks/customers/github.svg', alt: 'GitHub Logo', h: 'h-4' },
                    { src: 'https://html.tailus.io/blocks/customers/nike.svg', alt: 'Nike Logo', h: 'h-5' },
                    { src: 'https://html.tailus.io/blocks/customers/lemonsqueezy.svg', alt: 'Lemon Squeezy Logo', h: 'h-5' },
                    { src: 'https://html.tailus.io/blocks/customers/laravel.svg', alt: 'Laravel Logo', h: 'h-4' },
                    { src: 'https://html.tailus.io/blocks/customers/lilly.svg', alt: 'Lilly Logo', h: 'h-7' },
                    { src: 'https://html.tailus.io/blocks/customers/openai.svg', alt: 'OpenAI Logo', h: 'h-6' },
                  ].map(({ src, alt, h }) => (
                    <div key={alt} className="flex">
                      <img className={cn('mx-auto w-fit dark:invert', h)} src={src} alt={alt} />
                    </div>
                  ))}
                </InfiniteSlider>
                <div className="bg-linear-to-r from-background absolute inset-y-0 left-0 w-20" />
                <div className="bg-linear-to-l from-background absolute inset-y-0 right-0 w-20" />
                <ProgressiveBlur className="pointer-events-none absolute left-0 top-0 h-full w-20" direction="left" blurIntensity={1} />
                <ProgressiveBlur className="pointer-events-none absolute right-0 top-0 h-full w-20" direction="right" blurIntensity={1} />
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}

// ── HeroHeader ────────────────────────────────────────────────────────────────
const menuItems = [
  { name: 'Features', href: '#link' },
  { name: 'Solution', href: '#link' },
  { name: 'Pricing', href: '#link' },
  { name: 'About', href: '#link' },
]

function HeroHeader() {
  const [menuState, setMenuState] = React.useState(false)
  const [scrolled, setScrolled] = React.useState(false)
  const { scrollYProgress } = useScroll()

  React.useEffect(() => {
    const unsubscribe = scrollYProgress.on('change', latest => setScrolled(latest > 0.05))
    return () => unsubscribe()
  }, [scrollYProgress])

  return (
    <header>
      <nav data-state={menuState && 'active'} className="group sticky top-0 z-20 w-full pt-2">
        <div className={cn('mx-auto max-w-7xl rounded-3xl px-6 transition-all duration-300 lg:px-12', scrolled && 'bg-background/50 backdrop-blur-2xl')}>
          <motion.div
            key={1}
            className={cn('relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6', scrolled && 'lg:py-4')}
          >
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <a href="/" aria-label="home" className="flex items-center space-x-2"><Logo /></a>
              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
              <div className="hidden lg:block">
                <ul className="flex gap-8 text-sm">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a href={item.href} className="text-muted-foreground hover:text-accent-foreground block duration-150">{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              <div className="lg:hidden">
                <ul className="space-y-6 text-base">
                  {menuItems.map((item, index) => (
                    <li key={index}>
                      <a href={item.href} className="text-muted-foreground hover:text-accent-foreground block duration-150">{item.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                <a href="#" className="inline-flex h-9 items-center rounded-md border border-input bg-background px-3 text-sm font-medium hover:bg-accent hover:text-accent-foreground">
                  Login
                </a>
                <a href="#" className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                  Sign Up
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  )
}

const Logo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 78 18" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn('h-5 w-auto', className)}>
    <path d="M3 0H5V18H3V0ZM13 0H15V18H13V0ZM18 3V5H0V3H18ZM0 15V13H18V15H0Z" fill="url(#logo-gradient)" />
    <path d="M27.06 7.054V12.239C27.06 12.5903 27.1393 12.8453 27.298 13.004C27.468 13.1513 27.7513 13.225 28.148 13.225H29.338V14.84H27.808C26.9353 14.84 26.2667 14.636 25.802 14.228C25.3373 13.82 25.105 13.157 25.105 12.239V7.054H24V5.473H25.105V3.144H27.06V5.473H29.338V7.054H27.06Z" fill="currentColor" />
    <defs>
      <linearGradient id="logo-gradient" x1="10" y1="0" x2="10" y2="20" gradientUnits="userSpaceOnUse">
        <stop stopColor="#9B99FE" />
        <stop offset="1" stopColor="#2BC8B7" />
      </linearGradient>
    </defs>
  </svg>
)

export default HeroSection
