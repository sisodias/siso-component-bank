"use client"
import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin"
import Image from "next/image"

if (typeof window !== "undefined") {
  gsap.registerPlugin(DrawSVGPlugin)
}

export default function SVGTransition() {
  const [activeTab, setActiveTab] = useState("home")
  const [animating, setAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  const overlayRef = useRef(null)
  const pathRef = useRef(null)

  useEffect(() => {
    if (pathRef.current) {
      gsap.set(pathRef.current, {
        drawSVG: "0%",
        strokeWidth: 2
      })
    }
    const checkMobile = () => setIsMobile(window.innerWidth < 1024)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const switchTab = (tab) => {
    if (tab === activeTab || animating) return
    setAnimating(true)

    const tl = gsap.timeline({
      defaults: { ease: "power3.inOut" },
      onComplete: () => setAnimating(false)
    })

    // **INSTANT FULL COVERAGE**
    tl.set(overlayRef.current, { 
      opacity: 1,
      backgroundColor: "#ffffff"  // White fallback for perfect fill
    })

    // **MASSIVE STROKE THAT FILLS ENTIRE SCREEN**
    .to(pathRef.current, {
      drawSVG: "100%",
      strokeWidth: Math.max(window.innerWidth * 3, window.innerHeight * 3, 5000),  // HUGE stroke
      duration: 1.2,
      scale: 1.2  // Overshoot for edge coverage
    })

    .call(() => setActiveTab(tab))

    // Shrink away
    .to(pathRef.current, {
      drawSVG: "100% 100%",
      strokeWidth: 0,
      scale: 1,
      duration: 1.1
    })

    // Fade out
    .to(overlayRef.current, {
      opacity: 0,
      duration: 0.4
    }, "-=0.5")

    .set(pathRef.current, {
      drawSVG: "0%",
      strokeWidth: 2,
      scale: 1
    })
  }

  const tabs = [
    { id: "home", label: "Intelligence" },
    { id: "showcase", label: "Showcase" }
  ]

  const content = {
    home: {
      title: "Intelligence that\nmoves like you think",
      description:
        "AI that understands your intent, adapts to your workflow, and delivers results faster than you can explain them. From code to design to strategy — we make intelligence invisible.",
      image: "https://images.pexels.com/photos/1624496/pexels-photo-1624496.jpeg"
    },
    showcase: {
      title: "Real companies.\nReal intelligence.",
      description:
        "OpenAI-scale models powering Stripe payments, Vercel deployments, and Figma plugins. See how Neural transforms enterprise workflows with adaptive intelligence.",
      image: "https://images.pexels.com/photos/4067701/pexels-photo-4067701.jpeg"
    }
  }

  const current = content[activeTab]

  return (
    <>
      <div className="min-h-screen bg-white text-black flex flex-col lg:flex-row">
        {/* Your existing sidebar and main content - unchanged */}
        <aside className="w-full lg:w-64 border-b lg:border-r lg:border-b-0 border-gray-200 flex flex-col justify-between p-4 lg:p-10 shrink-0">
          <div className="flex-1 flex flex-col justify-center lg:justify-start">
            <h2 className="font-semibold text-lg tracking-tight mb-8 lg:mb-16">
              JUSTDOIT
            </h2>
            <div className="flex flex-col gap-3 lg:gap-4">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => switchTab(tab.id)}
                  className={`text-left text-sm transition py-2 ${
                    activeTab === tab.id
                      ? "text-black font-semibold"
                      : "text-gray-400 hover:text-black"
                  } ${animating ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={animating}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <main className="flex-1 flex items-center justify-center px-4 sm:px-8 lg:px-20 py-12 lg:py-0">
          <div className={`grid ${isMobile ? 'grid-cols-1 gap-12 lg:gap-20' : 'grid-cols-1 lg:grid-cols-2'} gap-12 lg:gap-20 items-center max-w-6xl w-full`}>
            <div className="space-y-6 lg:space-y-8 order-2 lg:order-1">
              <h1 
                className="text-4xl sm:text-5xl lg:text-[56px] font-semibold leading-[1.05] tracking-tight whitespace-pre-line"
                style={{lineHeight: '1.05'}}
              >
                {current.title}
              </h1>
              <p className="text-gray-500 text-base sm:text-lg leading-relaxed max-w-md">
                {current.description}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <button className="px-6 py-3 bg-black text-white rounded-lg text-sm font-medium w-full sm:w-auto">
                  Get started
                </button>
                <button className="px-6 py-3 border border-gray-300 rounded-lg text-sm w-full sm:w-auto">
                  Browse examples
                </button>
              </div>
            </div>

            <div className="w-full order-1 lg:order-2">
              <div className="rounded-2xl overflow-hidden shadow-xl relative h-80 sm:h-[400px] lg:h-[520px] mx-auto max-w-md lg:max-w-none">
                <Image
                  src={current.image}
                  alt={current.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 50vw"
                  priority
                />
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* FULL SCREEN SVG OVERLAY */}
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[10000] pointer-events-none opacity-0"
        style={{
          backgroundColor: '#ffffff',  // Perfect white fill
          width: '100vw',
          height: '100vh',
          top: 0,
          left: 0
        }}
      >
        <svg
          viewBox="-500 -300 3000 1800"  // Massive viewbox for full coverage
          className="absolute inset-0 w-full h-full"
          preserveAspectRatio="none"  // Stretch to fill completely
        >
          <path
            ref={pathRef}
            d="
              M -500 600 
              Q 0 1600, 1000 -200, 1500 600, 
              2000 1600, 2800 600
            "
            stroke="#000000"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
      </div>
    </>
  )
}
