'use client'

import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Menu, X, ChevronRight, CirclePlay } from 'lucide-react'
import { Button } from "./button"
import { cn } from "../_utils/cn"

const menuItems = [
  { name: 'Features', href: '#link' },
  { name: 'Pricing', href: '#link' },
  { name: 'About', href: '#link' },
]

export default function Hero() {
  const [menuState, setMenuState] = React.useState(false)
  const [isScrolled, setIsScrolled] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      {/* Header */}
      <header>
        <nav
          data-state={menuState ? 'active' : undefined}
          className={cn(
            'fixed z-20 w-full transition-all duration-300',
            isScrolled && 'bg-background/75 border-b border-black/5 backdrop-blur-lg'
          )}
        >
          <div className="mx-auto max-w-5xl px-6">
            <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0">
              <div className="flex w-full justify-between gap-6 lg:w-auto">
                <Link href="/" aria-label="home" className="flex items-center space-x-2">
                </Link>

                <button
                  onClick={() => setMenuState((s) => !s)}
                  aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>

                <div className="m-auto hidden size-fit lg:block">
                  <ul className="flex gap-1">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Button asChild variant="ghost" size="sm">
                          <Link href={item.href} className="text-base">
                            <span>{item.name}</span>
                          </Link>
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:hidden">
                  <ul className="space-y-6 text-base">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                  <Button
                    asChild
                    variant="ghost"
                    size="sm"
                    className={cn(isScrolled && 'lg:hidden')}
                  >
                    <Link href="#">
                      <span>Login</span>
                    </Link>
                  </Button>
                  <Button asChild size="sm" className={cn(isScrolled && 'lg:hidden')}>
                    <Link href="#">
                      <span>Sign Up</span>
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="sm"
                    className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}
                  >
                    <Link href="#">
                      <span>Get Started</span>
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="overflow-hidden">
        <section className="bg-linear-to-b to-muted from-background">
          <div className="relative py-36">
            <div className="relative z-10 mx-auto w-full max-w-5xl px-6">
              <div className="md:w-1/2">
                <div>
                  <h1 className="max-w-md text-balance text-5xl font-medium md:text-6xl">
                    Simple payments for startups
                  </h1>
                  <p className="text-muted-foreground my-8 max-w-2xl text-balance text-xl">
                    One tool that does it all. Search, generate, analyze, and chat—right inside
                    Tailark.
                  </p>

                  <div className="flex items-center gap-3">
                    <Button asChild size="lg" className="pr-4.5">
                      <Link href="#link">
                        <span className="text-nowrap">Get Started</span>
                        <ChevronRight className="opacity-50" />
                      </Link>
                    </Button>
                    <Button key={2} asChild size="lg" variant="outline" className="pl-5">
                      <Link href="#link">
                        <CirclePlay className="fill-primary/25 stroke-primary" />
                        <span className="text-nowrap">Watch video</span>
                      </Link>
                    </Button>
                  </div>
                </div>

                <div className="mt-10">
                  <p className="text-muted-foreground">Trusted by teams at :</p>
                  <div className="mt-6 grid max-w-sm grid-cols-3 gap-6">
                    <div className="flex">
                      <img
                        className="h-4 w-fit"
                        src="https://html.tailus.io/blocks/customers/column.svg"
                        alt="Column Logo"
                        height="16"
                        width="auto"
                      />
                    </div>
                    <div className="flex">
                      <img
                        className="h-5 w-fit"
                        src="https://html.tailus.io/blocks/customers/nvidia.svg"
                        alt="Nvidia Logo"
                        height="20"
                        width="auto"
                      />
                    </div>
                    <div className="flex">
                      <img
                        className="h-4 w-fit"
                        src="https://html.tailus.io/blocks/customers/github.svg"
                        alt="GitHub Logo"
                        height="16"
                        width="auto"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="perspective-near mt-24 translate-x-12 md:absolute md:-right-6 md:bottom-16 md:left-1/2 md:top-40 md:mt-0 md:translate-x-0">
              <div className="before:border-foreground/5 before:bg-foreground/5 relative h-full before:absolute before:-inset-x-4 before:bottom-7 before:top-0 before:skew-x-6 before:rounded-[calc(var(--radius)+1rem)] before:border">
                <div className="bg-background rounded-(--radius) shadow-foreground/10 ring-foreground/5 relative h-full -translate-y-12 skew-x-6 overflow-hidden border border-transparent shadow-md ring-1">
                  <Image
                    src="https://tailark.com/_next/image?url=%2Fmist%2Ftailark.png&w=3840&q=75"
                    alt="app screen"
                    width={2880}
                    height={1842}
                    className="object-top-left size-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
