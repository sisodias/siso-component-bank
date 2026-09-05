"use client"

import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
import { Play, Menu } from "lucide-react"
// import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

export default function HeroWithNavbar() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  }

  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  return (
    <motion.div initial="hidden" animate="visible" className="min-h-screen bg-[#0B0C0E] text-white">
      {/* Header */}
      <motion.header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-black/50 backdrop-blur-md" : ""}`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
      >
        <div className="container py-4 md:py-6">
          <nav className="flex items-center justify-between">
            <motion.a href="/" className="flex items-center space-x-3 group">
              <div className="relative w-8 h-8 overflow-hidden">
                <img
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Group%201171274909-6qAc0l9yFtnmWK0yfTDOWwiPgp4bEd.png"
                  alt="Jessi Logo"
                  width={32}
                  height={32}
                  className="object-contain"
                  priority
                  unoptimized
                />
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100"
                  initial={{ x: "-100%" }}
                  whileHover={{ x: "100%" }}
                  transition={{ duration: 0.8, ease: "easeInOut" }}
                />
              </div>
              <span className="font-mono text-xl">Jessi</span>
            </motion.a>
            <motion.div
              className="hidden md:flex items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <button
                variant="outline"
                className="rounded-full border border-zinc-800 bg-black/20 backdrop-blur-sm text-sm px-6 py-2 h-auto hover:bg-zinc-800/50 transition-colors"
              >
                Backed by Y Combinator (hopefully soon)
              </button>
            </motion.div>
            <motion.button
              className="md:hidden"
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="h-6 w-6" />
            </motion.button>
          </nav>
        </div>
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              className="md:hidden bg-black/90 backdrop-blur-md"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="container py-4">
                <button
                  variant="outline"
                  className="w-full rounded-full border border-zinc-800 bg-black/20 backdrop-blur-sm text-sm px-6 py-2 h-auto hover:bg-zinc-800/50 transition-colors"
                >
                  Backed by Y Combinator (hopefully soon)
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* Hero Section */}
      <motion.section
        className="min-h-[80vh] flex flex-col items-center justify-center pt-16 px-4 md:px-0"
        variants={staggerChildren}
      >
        <div className="container">
          <div className="max-w-[800px] mx-auto text-center space-y-6">
            <motion.h1
              className="text-3xl md:text-[56px] leading-tight md:leading-[1.1] font-medium tracking-[-0.02em]"
              variants={fadeIn}
            >
              Empower your apps with contextual intelligence
            </motion.h1>
            <motion.p
              className="text-zinc-400 text-base md:text-xl leading-relaxed max-w-[600px] mx-auto"
              variants={fadeIn}
            >
              Graphyn provides a powerful SDK for seamless integration of personalized, context-aware features in your
              applications.
            </motion.p>
            <motion.div className="pt-8" variants={fadeIn}>
              <button
                className="bg-[#8564FA] hover:bg-[#8564FA]/90 text-white rounded-full px-6 py-3 h-auto text-sm md:text-md"
                onClick={() => {
                  const videoSection = document.getElementById("video-section")
                  videoSection?.scrollIntoView({ behavior: "smooth" })
                }}
              >
                Hear what we wanna say
              </button>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Video Demo Section */}
      <motion.section
        id="video-section"
        className="pt-4 -mt-16 md:-mt-24 px-4 md:px-0"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
      >
        <div className="container">
          <div className="max-w-[1000px] mx-auto">
            {/* Browser Window Mockup */}
            <div className="rounded-xl overflow-hidden bg-zinc-900/50 shadow-2xl border border-white/5">
              {/* Browser Controls */}
              <div className="flex items-center gap-2 px-4 py-3 bg-black/40 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                  <div className="w-3 h-3 rounded-full bg-zinc-600" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-black/40 rounded-md py-1.5 px-3 text-xs text-zinc-500 max-w-[300px] flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-zinc-800" />
                    jessi.xyz
                  </div>
                </div>
              </div>

              {/* Video/Content Area */}
              <div className="aspect-[16/9] relative">
                {isPlaying ? (
                  <iframe
                    src={`https://player.vimeo.com/video/1055784280?h=your_hash_here&autoplay=1&title=0&byline=0&portrait=0`}
                    className="w-full h-full"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen
                  />
                ) : (
                  <div
                    className="absolute inset-0 flex items-center justify-center cursor-pointer group"
                    onClick={() => setIsPlaying(true)}
                  >
                    <div className="absolute inset-0">
                      <img
                        src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-lQJe60OxxGongNvLeFeJWGT3Gz0Rra.png"
                        alt="Weaves every interaction into a web of knowledge"
                        fill
                        className="object-cover"
                        priority
                        unoptimized
                      />
                    </div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                      <button
                        size="lg"
                        className="relative z-10 size-16 md:size-20 rounded-full p-0 bg-black/20 hover:bg-black/30 transition-all duration-200 backdrop-blur-sm"
                      >
                        <Play className="size-6 md:size-8 text-white" />
                      </button>
                    </motion.div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </motion.div>
  )
}
