"use client"

import type React from "react"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { TrendingUp, BarChart3, Search, Globe } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

function GridBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(139, 92, 246, 0.1)" strokeWidth="0.5" />
          </pattern>
          <linearGradient id="grid-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0)" />
            <stop offset="50%" stopColor="rgba(139, 92, 246, 0.3)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0)" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" opacity="0.5" />
        <rect width="100%" height="100%" fill="url(#grid-gradient)" />
      </svg>
      <div
        className="absolute inset-0"
        style={{
          background: "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 70%)",
        }}
      />
    </div>
  )
}

function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const updateCanvasSize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }

    updateCanvasSize()

    const stars: { x: number; y: number; radius: number; opacity: number; speed: number; maxOpacity: number }[] = []
    const starCount = window.innerWidth < 768 ? 80 : 150
    const maxRadius = window.innerWidth < 768 ? 1.5 : 2

    // Create stars spread across entire canvas
    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * maxRadius + 0.3,
        opacity: Math.random(),
        speed: Math.random() * 0.01 + 0.003,
        maxOpacity: Math.random() * 0.5 + 0.3,
      })
    }

    function animate() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      stars.forEach((star) => {
        star.opacity += star.speed
        if (star.opacity > star.maxOpacity || star.opacity < 0) {
          star.speed = -star.speed
        }

        const glowRadius = window.innerWidth < 768 ? star.radius * 2 : star.radius * 3
        const gradient = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, glowRadius)
        gradient.addColorStop(0, `rgba(139, 92, 246, ${star.opacity})`)
        gradient.addColorStop(0.5, `rgba(139, 92, 246, ${star.opacity * 0.5})`)
        gradient.addColorStop(1, "rgba(139, 92, 246, 0)")

        ctx.beginPath()
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()
      })

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => {
      const oldWidth = canvas.width
      const oldHeight = canvas.height
      updateCanvasSize()

      stars.forEach((star) => {
        star.x = (star.x / oldWidth) * canvas.width
        star.y = (star.y / oldHeight) * canvas.height
        // Adjust radius for new screen size
        const maxRadius = window.innerWidth < 768 ? 1.5 : 2
        star.radius = Math.min(star.radius, maxRadius)
      })
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
}

function NeonButton({
  children,
  className,
  onClick,
  variant = "default",
}: {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  variant?: "default" | "ghost"
}) {
  return (
    <button onClick={onClick} className={`relative group cursor-pointer ${className}`}>
      {variant === "default" && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 via-pink-500 to-purple-500 rounded-full opacity-75 group-hover:opacity-100 blur-sm transition duration-500 animate-gradient-x" />
      )}
      <div
        className={`relative ${variant === "default" ? "bg-white text-black" : "bg-white/10 text-white border border-white/20"} px-6 py-3 rounded-full font-medium transition-all duration-300 group-hover:scale-105`}
      >
        {children}
      </div>
    </button>
  )
}

export function SeoLanding() {
  const [isVisible, setIsVisible] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [loginOpen, setLoginOpen] = useState(false)
  const [signupOpen, setSignupOpen] = useState(false)
  const heroRef = useRef<HTMLDivElement>(null)
  const featuresRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth"
    return () => {
      document.documentElement.style.scrollBehavior = "auto"
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsVisible(true)

    if (heroRef.current) {
      gsap.from(heroRef.current.querySelectorAll("h1, p, button"), {
        y: 50,
        opacity: 0,
        duration: 1,
        stagger: 0.2,
        ease: "power3.out",
      })
    }

    if (featuresRef.current) {
      gsap.from(featuresRef.current.querySelectorAll(".feature-card"), {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: "top 80%",
        },
        y: 100,
        opacity: 0,
        duration: 0.8,
        stagger: 0.2,
        ease: "power3.out",
      })
    }
  }, [])

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    const element = document.getElementById(targetId)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="min-h-screen w-screen bg-[#0a0118] text-white font-sans">
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0a0118]/95 backdrop-blur-xl shadow-lg shadow-purple-500/10 border-b border-white/10"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">W</span>
            </div>
            <span className="font-semibold text-lg">wope</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              onClick={(e) => handleNavClick(e, "features")}
              className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#pricing"
              onClick={(e) => handleNavClick(e, "pricing")}
              className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Pricing
            </a>
            <a
              href="#faq"
              onClick={(e) => handleNavClick(e, "faq")}
              className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              FAQ
            </a>
            <a
              href="#contact"
              onClick={(e) => handleNavClick(e, "contact")}
              className="text-sm text-gray-300 hover:text-white transition-colors cursor-pointer"
            >
              Contact
            </a>
          </div>
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => setLoginOpen(true)}
              className="text-sm text-white hover:bg-white/10 cursor-pointer"
            >
              Log in
            </Button>
            <NeonButton onClick={() => setSignupOpen(true)}>Sign up</NeonButton>
          </div>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section ref={heroRef} className="pt-32 pb-20 px-6 relative overflow-hidden">
        <GridBackground />
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-60 right-1/4 w-96 h-96 bg-pink-500/20 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 text-balance leading-tight">New Era of SEO Research</h1>
          <p className="text-lg md:text-xl text-gray-400 mb-8 max-w-3xl mx-auto text-balance">
            Let our AI do the heavy lifting. Uncover hidden keyword opportunities, analyze competitor strategies, and
            get actionable insights that drive real results
          </p>
          <NeonButton variant="ghost">Start Free 14-Day Trial</NeonButton>
        </div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-6xl mx-auto mt-16 relative"
        >
          <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border-white/10 backdrop-blur-xl p-6 rounded-2xl shadow-2xl hover:shadow-purple-500/20 transition-shadow duration-500">
            {/* Tabs */}
            <div className="flex items-center gap-4 mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-purple-500/20 rounded-lg border border-purple-500/30 transition-all hover:bg-purple-500/30 cursor-pointer">
                <Globe className="w-4 h-4" />
                <span className="text-sm">Keyword Finder</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:text-white transition-colors cursor-pointer">
                <span className="text-sm">Site Explorer</span>
              </div>
            </div>

            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex-1 flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-4 py-3 hover:border-purple-500/30 transition-colors">
                <Search className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-400">Enter keyword or domain</span>
              </div>
              <Button className="bg-purple-500 hover:bg-purple-600 px-6 transition-all hover:scale-105 cursor-pointer">
                Search
              </Button>
            </div>

            {/* Data Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Keyword</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Volume</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">KD</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Intent</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">CPC</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Competition</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Results</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Trend</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">URL</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Traffic</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    {
                      keyword: "seo tools",
                      volume: "33K",
                      kd: "67",
                      intent: "Commercial",
                      cpc: "$12.50",
                      comp: "High",
                      results: "2.1B",
                      url: "ahrefs.com/seo-tools",
                      traffic: "45K",
                      value: "$89K",
                    },
                    {
                      keyword: "keyword research",
                      volume: "27K",
                      kd: "54",
                      intent: "Informational",
                      cpc: "$8.30",
                      comp: "Medium",
                      results: "1.8B",
                      url: "semrush.com/keyword-research",
                      traffic: "38K",
                      value: "$72K",
                    },
                    {
                      keyword: "backlink checker",
                      volume: "22K",
                      kd: "61",
                      intent: "Commercial",
                      cpc: "$15.20",
                      comp: "High",
                      results: "890M",
                      url: "moz.com/backlink-checker",
                      traffic: "31K",
                      value: "$65K",
                    },
                    {
                      keyword: "rank tracker",
                      volume: "18K",
                      kd: "48",
                      intent: "Commercial",
                      cpc: "$11.80",
                      comp: "Medium",
                      results: "1.2B",
                      url: "serpstat.com/rank-tracker",
                      traffic: "28K",
                      value: "$58K",
                    },
                    {
                      keyword: "site audit",
                      volume: "15K",
                      kd: "52",
                      intent: "Commercial",
                      cpc: "$9.90",
                      comp: "Medium",
                      results: "950M",
                      url: "screaming-frog.co.uk",
                      traffic: "24K",
                      value: "$51K",
                    },
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                      <td className="py-3 px-4 text-white">{row.keyword}</td>
                      <td className="py-3 px-4 text-gray-300">{row.volume}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">{row.kd}</span>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{row.intent}</td>
                      <td className="py-3 px-4 text-gray-300">{row.cpc}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          {[...Array(3)].map((_, j) => (
                            <div key={j} className="w-1 h-3 bg-purple-500 rounded-full" />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-300">{row.results}</td>
                      <td className="py-3 px-4">
                        <TrendingUp className="w-4 h-4 text-green-400" />
                      </td>
                      <td className="py-3 px-4 text-purple-400 text-xs">{row.url}</td>
                      <td className="py-3 px-4 text-gray-300">{row.traffic}</td>
                      <td className="py-3 px-4 text-gray-300">{row.value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </motion.div>
      </section>

      <section className="py-16 px-6 border-y border-white/10 overflow-hidden">
        <div className="relative">
          <div className="flex gap-16 group">
            <div className="flex gap-16 animate-scroll-left group-hover:[animation-play-state:paused]">
              {[...Array(2)].map((_, setIndex) => (
                <div key={setIndex} className="flex gap-16">
                  <div className="text-2xl font-bold text-gray-400 whitespace-nowrap">QNB</div>
                  <div className="text-2xl font-bold text-gray-400 whitespace-nowrap">Delivery Hero</div>
                  <div className="text-2xl font-bold text-gray-400 whitespace-nowrap">Modesto Meat</div>
                  <div className="text-2xl font-bold text-gray-400 whitespace-nowrap">amazon</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" ref={featuresRef} className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">
              Meet New-Gen
              <br />
              Research Experience
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Powerful AI-driven tools that transform how you discover opportunities and dominate search rankings
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 auto-rows-fr">
            {/* Feature Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              whileHover={{ scale: 1.02 }}
              className="feature-card h-full"
            >
              <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl cursor-pointer h-full flex flex-col">
                <h3 className="text-2xl font-bold mb-4">
                  Deep Backlink
                  <br />
                  Profile Analysis
                </h3>
                <p className="text-gray-400 mb-8">
                  Uncover your competitors' link-building secrets. Analyze backlink sources, anchor text patterns, and
                  domain authority to replicate winning strategies
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 relative overflow-hidden flex-1">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent" />
                  <img
                    src="/abstract-data-visualization-showing-network-of-con.jpg"
                    alt="Backlink Analysis Visualization"
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                  <div className="relative">
                    <div className="flex items-center gap-4 mb-6">
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500" />
                      <div className="flex-1">
                        <div className="h-2 bg-white/20 rounded-full mb-2" />
                        <div className="h-2 bg-white/10 rounded-full w-2/3" />
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="h-8 bg-white/5 rounded-lg" />
                      <div className="h-8 bg-white/5 rounded-lg" />
                      <div className="h-8 bg-white/5 rounded-lg" />
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>

            {/* Feature Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              whileHover={{ scale: 1.02 }}
              className="feature-card h-full"
            >
              <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border-white/10 backdrop-blur-xl p-8 rounded-2xl shadow-xl cursor-pointer h-full flex flex-col">
                <div className="mb-8">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-500/20 rounded-full border border-purple-500/30 mb-4 hover:bg-purple-500/30 transition-colors cursor-pointer">
                    <span className="text-xs text-purple-300">SERP LENS</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-pink-500/20 rounded-full border border-pink-500/30 mb-4 ml-2 hover:bg-pink-500/30 transition-colors cursor-pointer">
                    <span className="text-xs text-pink-300">DIFFICULTY</span>
                  </div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-500/20 rounded-full border border-blue-500/30 mb-4 ml-2 hover:bg-blue-500/30 transition-colors cursor-pointer">
                    <span className="text-xs text-blue-300">Keyword Opportunities Locator</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-4">Discover Shared SEO Keywords</h3>
                <p className="text-gray-400 mb-8">
                  Find the exact keywords your competitors rank for. Identify content gaps and opportunities to capture
                  high-value traffic they're missing
                </p>
                <div className="bg-white/5 border border-white/10 rounded-xl p-6 flex-1">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b border-white/10">
                        <th className="text-left py-2 text-gray-400">Keyword</th>
                        <th className="text-left py-2 text-gray-400">Volume</th>
                        <th className="text-left py-2 text-gray-400">KD</th>
                        <th className="text-left py-2 text-gray-400">Traffic</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { keyword: "content marketing", volume: "49K", kd: "72", traffic: "12K" },
                        { keyword: "seo strategy", volume: "33K", kd: "65", traffic: "9.8K" },
                        { keyword: "link building", volume: "27K", kd: "58", traffic: "8.2K" },
                      ].map((row, i) => (
                        <tr
                          key={i}
                          className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer"
                        >
                          <td className="py-2 text-white">{row.keyword}</td>
                          <td className="py-2 text-gray-300">{row.volume}</td>
                          <td className="py-2">
                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-300 rounded">{row.kd}</span>
                          </td>
                          <td className="py-2 text-gray-300">{row.traffic}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Analyze Keywords Section */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16 feature-card"
          >
            <Card className="bg-gradient-to-br from-purple-900/40 to-pink-900/20 border-white/10 backdrop-blur-xl p-8 rounded-2xl hover:shadow-purple-500/20 transition-shadow duration-500">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-bold mb-4">Track Your Keyword Rankings</h3>
                <p className="text-gray-400">
                  Monitor your search positions in real-time. Track keyword performance, traffic potential, and identify
                  quick wins to boost your rankings
                </p>
              </div>
              <div className="mb-6">
                <img
                  src="/modern-dashboard-showing-seo-keyword-rankings-with.jpg"
                  alt="Keyword Rankings Dashboard"
                  className="w-full h-40 object-cover rounded-xl"
                />
              </div>
              <div className="bg-white/5 border border-white/10 rounded-xl p-6 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Keyword</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Position</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Volume</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">KD</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Traffic</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">Intent</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">CPC</th>
                      <th className="text-left py-3 px-4 text-gray-400 font-medium">URL</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      {
                        keyword: "digital marketing",
                        pos: "3",
                        volume: "135K",
                        kd: "78",
                        traffic: "42K",
                        intent: "Commercial",
                        cpc: "$18.50",
                        url: "example.com/digital-marketing",
                      },
                      {
                        keyword: "seo optimization",
                        pos: "5",
                        volume: "89K",
                        kd: "71",
                        traffic: "28K",
                        intent: "Informational",
                        cpc: "$14.20",
                        url: "example.com/seo-guide",
                      },
                      {
                        keyword: "content strategy",
                        pos: "7",
                        volume: "67K",
                        kd: "64",
                        traffic: "19K",
                        intent: "Informational",
                        cpc: "$11.80",
                        url: "example.com/content-strategy",
                      },
                      {
                        keyword: "ppc advertising",
                        pos: "4",
                        volume: "54K",
                        kd: "69",
                        traffic: "22K",
                        intent: "Commercial",
                        cpc: "$22.30",
                        url: "example.com/ppc-guide",
                      },
                    ].map((row, i) => (
                      <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer">
                        <td className="py-3 px-4 text-white">{row.keyword}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-green-500/20 text-green-300 rounded text-xs">{row.pos}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{row.volume}</td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-300 rounded text-xs">{row.kd}</span>
                        </td>
                        <td className="py-3 px-4 text-gray-300">{row.traffic}</td>
                        <td className="py-3 px-4 text-gray-300">{row.intent}</td>
                        <td className="py-3 px-4 text-gray-300">{row.cpc}</td>
                        <td className="py-3 px-4 text-purple-400 text-xs">{row.url}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-6 relative overflow-hidden">
        <StarfieldBackground />
        <div className="max-w-3xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <p className="text-sm text-purple-400 mb-2">FAQ</p>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Frequently asked questions</h2>
            <p className="text-gray-400">
              Haven't found what you're looking for?{" "}
              <a href="#contact" className="text-purple-400 hover:text-purple-300 transition-colors cursor-pointer">
                Contact us
              </a>
            </p>
          </motion.div>

          <Accordion type="single" collapsible className="space-y-4">
            {[
              {
                q: "What is Wope?",
                a: "Wope is an advanced SEO research platform that leverages AI to help you discover keyword opportunities, analyze competitors, and make data-driven decisions for your content strategy.",
              },
              {
                q: "Who is Wope for?",
                a: "Wope is designed for SEO professionals, content marketers, digital agencies, and businesses looking to improve their search engine rankings and organic traffic.",
              },
              {
                q: "What can I do with the Backlink Profile Analysis feature?",
                a: "The Backlink Profile Analysis feature allows you to examine your competitors' backlink sources, analyze anchor text diversity, and understand their link-building strategies to improve your own SEO efforts.",
              },
              {
                q: 'How does the "Shared SEO Keywords" feature work?',
                a: "This feature identifies common keywords between two domains, helping you understand competitive overlaps and discover new content opportunities based on what's working for your competitors.",
              },
              {
                q: "What kind of keyword analysis does Wope offer?",
                a: "Wope provides comprehensive keyword analysis including search volume, keyword difficulty, traffic estimates, search intent, CPC data, and competitive metrics to help you make informed decisions.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <AccordionItem
                  value={`item-${i + 1}`}
                  className="bg-white/5 border border-white/10 rounded-xl px-6 backdrop-blur-sm hover:bg-white/10 transition-colors"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-6">
                    <span className="text-lg font-medium">{item.q}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-400 pb-6">{item.a}</AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section id="pricing" className="py-24 px-6 relative overflow-hidden">
        <GridBackground />
        <div className="absolute inset-0 bg-gradient-to-t from-purple-900/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-t from-purple-500/30 to-transparent rounded-full blur-[100px] pointer-events-none animate-pulse-glow" />

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center relative z-10"
        >
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="w-24 h-24 mx-auto mb-8 rounded-3xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-2xl cursor-pointer"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <BarChart3 className="w-8 h-8 text-white" />
            </div>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">Outrank Everyone. Starting Now.</h2>
          <p className="text-lg text-gray-400 mb-8">
            Join thousands of SEO professionals using Wope to dominate search rankings and drive organic growth.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm max-w-xs focus:border-purple-500 transition-colors"
            />
            <NeonButton>Start Free Trial</NeonButton>
          </div>

          <p className="text-sm text-gray-500">Get started for free • No credit card required • 14 days free trial</p>
        </motion.div>
      </section>

      {/* Footer */}
      <footer id="contact" className="border-t border-white/10 py-12 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <span className="text-white font-bold text-sm">W</span>
                </div>
                <span className="font-semibold text-lg">wope</span>
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Advanced AI-powered SEO research platform trusted by marketing professionals worldwide.
              </p>
              <p className="text-xs text-gray-500">Empowering SEO excellence since 2024</p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="#pricing" className="hover:text-white transition-colors cursor-pointer">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#features" className="hover:text-white transition-colors cursor-pointer">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Roadmap
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Changelog
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Legal</h3>
              <ul className="space-y-3 text-sm text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors cursor-pointer">
                    Security
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Get in touch</h3>
              <p className="text-sm text-gray-400 mb-2">Email us:</p>
              <a
                href="mailto:hello@wope.com"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors cursor-pointer"
              >
                hello@wope.com
              </a>
              <p className="text-sm text-gray-400 mt-4 mb-2">Address:</p>
              <p className="text-sm text-gray-400">
                123 SEO Street, Suite 100
                <br />
                San Francisco, CA 94102
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">© 2025 Wope. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors cursor-pointer">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.51 0 10-4.48 10-10S17.51 2 12 2zm6.605 4.61a8.502 8.502 0 011.93 5.314c-.281-.054-3.101-.629-5.943-.271-.065-.141-.12-.293-.184-.445a25.416 25.416 0 00-.564-1.236c3.145-1.28 4.577-3.124 4.761-3.362zM12 3.475c2.17 0 4.154.813 5.662 2.148-.152.216-1.443 1.941-4.48 3.08-1.399-2.57-2.95-4.675-3.189-5A8.687 8.687 0 0112 3.475zm-3.633.803a53.896 53.896 0 013.167 4.935c-3.992 1.063-7.517 1.04-7.896 1.04a8.581 8.581 0 014.729-5.975zM3.453 12.01v-.26c.37.01 4.512.065 8.775-1.215.25.477.477.965.694 1.453-.109.033-.228.065-.336.098-4.404 1.42-6.747 5.303-6.942 5.629a8.522 8.522 0 01-2.19-5.705zM12 20.547a8.482 8.482 0 01-5.239-1.8c.152-.315 1.888-3.656 6.703-5.337.022-.01.033-.01.054-.022a35.318 35.318 0 011.823 6.475 8.4 8.4 0 01-3.341.684zm4.761-1.465c-.086-.52-.542-3.015-1.659-6.084 2.679-.423 5.022.271 5.314.369a8.468 8.468 0 01-3.655 5.715z"
                    clipRule="evenodd"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </footer>

      <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
        <DialogContent className="bg-[#0a0118] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Welcome back</DialogTitle>
            <DialogDescription className="text-gray-400">Log in to your Wope account</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="login-email" className="text-sm text-gray-300">
                Email
              </Label>
              <Input
                id="login-email"
                type="email"
                placeholder="you@example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="login-password" className="text-sm text-gray-300">
                Password
              </Label>
              <Input
                id="login-password"
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
              />
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded border-white/10" />
                Remember me
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                Forgot password?
              </a>
            </div>
            <NeonButton className="w-full">Log in</NeonButton>
            <p className="text-center text-sm text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => {
                  setLoginOpen(false)
                  setSignupOpen(true)
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Sign up
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={signupOpen} onOpenChange={setSignupOpen}>
        <DialogContent className="bg-[#0a0118] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Create your account</DialogTitle>
            <DialogDescription className="text-gray-400">Start your 14-day free trial</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div>
              <Label htmlFor="signup-name" className="text-sm text-gray-300">
                Full Name
              </Label>
              <Input
                id="signup-name"
                type="text"
                placeholder="John Doe"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="signup-email" className="text-sm text-gray-300">
                Email
              </Label>
              <Input
                id="signup-email"
                type="email"
                placeholder="you@example.com"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
              />
            </div>
            <div>
              <Label htmlFor="signup-password" className="text-sm text-gray-300">
                Password
              </Label>
              <Input
                id="signup-password"
                type="password"
                placeholder="••••••••"
                className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 mt-1"
              />
            </div>
            <div className="text-sm">
              <label className="flex items-start gap-2 text-gray-400 cursor-pointer">
                <input type="checkbox" className="rounded border-white/10 mt-1" />
                <span>
                  I agree to the{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Terms of Service
                  </a>{" "}
                  and{" "}
                  <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">
                    Privacy Policy
                  </a>
                </span>
              </label>
            </div>
            <NeonButton className="w-full">Create account</NeonButton>
            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <button
                onClick={() => {
                  setSignupOpen(false)
                  setLoginOpen(true)
                }}
                className="text-purple-400 hover:text-purple-300 transition-colors"
              >
                Log in
              </button>
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
