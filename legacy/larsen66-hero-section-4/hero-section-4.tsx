import React from 'react'
import Link from 'next/link'
import { Button } from "./button"
import Image from 'next/image'
import { BookOpen } from 'lucide-react'
import { cn } from "../_utils/cn"

export default function HeroSection() {
  return (
    <section className="py-20">
      <div className="relative z-10 mx-auto w-full max-w-2xl px-6 lg:px-0">
        <div className="relative">
          <MistKitLogo />
          <h1 className="mt-16 max-w-xl text-balance text-5xl font-medium">
            The Note App
          </h1>

          <p className="text-muted-foreground mb-6 mt-4 text-balance text-xl">
            The Note App is a simple note app that allows you to create and manage your notes.
          </p>

          <div className="flex flex-col items-center gap-2 sm:flex-row">
<Button
  asChild
  variant="outline"
  className="w-full sm:w-auto border-black text-black hover:bg-black hover:text-white"
>
  <Link href="#link">
    <span className="whitespace-nowrap">Get Started</span>
  </Link>
</Button>

            <Button asChild variant="ghost" className="w-full sm:w-auto">
              <Link href="#link">
                <span className="whitespace-nowrap">View Demo</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative mt-12 overflow-hidden rounded-3xl bg-black/10 md:mt-16">
          <img
            src="https://images.unsplash.com/photo-1547623641-d2c56c03e2a7?q=80&w=3087&auto=format&fit=crop"
            alt=""
            className="absolute inset-0 size-full object-cover"
            loading="lazy"
          />
          <div className="relative m-4 overflow-hidden rounded-[var(--radius)] border border-transparent bg-background shadow-xl shadow-black/15 ring-1 ring-black/10 sm:m-8 md:m-12">
            <Image
              src="https://tailark.com/_next/image?url=%2Fmist%2Ftailark.png&w=3840&q=75"
              alt="App screen"
              width={2880}
              height={1842}
              className="size-full object-left-top"
              priority
            />
          </div>
        </div>

        {/* Logos */}
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <p className="text-muted-foreground text-center">Trusted by teams at:</p>
          <div className="flex items-center justify-center gap-8">
            {[
              { src: 'https://html.tailus.io/blocks/customers/nvidia.svg', alt: 'Nvidia Logo', h: 4 },
              { src: 'https://html.tailus.io/blocks/customers/column.svg', alt: 'Column Logo', h: 3 },
              { src: 'https://html.tailus.io/blocks/customers/github.svg', alt: 'GitHub Logo', h: 3 },
              { src: 'https://html.tailus.io/blocks/customers/nike.svg', alt: 'Nike Logo', h: 4 },
            ].map((logo, i) => (
              <div className="flex" key={i}>
                <img
                  className={`mx-auto h-${logo.h} w-auto`}
                  src={logo.src}
                  alt={logo.alt}
                  height={logo.h * 4}
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

const MistKitLogo = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      'relative flex size-9 items-center justify-center translate-y-0.5 rounded-[var(--radius)] border border-background bg-gradient-to-b from-yellow-300 to-orange-600 shadow-lg shadow-black/20 ring-1 ring-black/10',
      className
    )}
  >
    <BookOpen className="mask-b-from-25% size-6 fill-white stroke-white drop-shadow-sm" />
    <BookOpen className="absolute inset-0 m-auto size-6 fill-white stroke-white opacity-65 drop-shadow-sm" />
    <div className="absolute inset-2 z-10 m-auto h-[18px] w-px translate-y-px rounded-full bg-black/10" />
  </div>
)
