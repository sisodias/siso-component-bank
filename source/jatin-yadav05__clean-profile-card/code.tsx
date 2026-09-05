"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils"

const experienceColors = [
  "#8B5CF6",
  "#8B5CF6",
  "#8B5CF6",
  "#8B5CF6",
  "#EC4899",
  "#EC4899",
  "#EC4899",
  "#F97316",
  "#F97316",
  "#F97316",
  "#EAB308",
  "#EAB308",
  "#EAB308",
  "#EAB308",
  "#22C55E",
  "#22C55E",
  "#22C55E",
  "#22C55E",
  "#22C55E",
  "#9CA3AF",
  "#9CA3AF",
  "#9CA3AF",
  "#9CA3AF",
  "#9CA3AF",
]

export function ProfileCard() {
  const [isFollowing, setIsFollowing] = useState(false)
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const [isPressed, setIsPressed] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const stats = {
    likes: 72900,
    posts: 828,
    views: 342900,
  }

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      const formatted = (num / 1000).toFixed(1)
      return formatted.endsWith(".0") ? formatted.slice(0, -2) + "K" : formatted + "K"
    }
    return num.toString()
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x: x * 4, y: y * -4 })
  }

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 })
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="w-full max-w-[340px] rounded-[32px] bg-card overflow-hidden transition-all duration-500 ease-out will-change-transform shadow-xl shadow-foreground/[0.08] dark:shadow-black/30"
      style={{
        transform: `perspective(1000px) rotateX(${mousePosition.y}deg) rotateY(${mousePosition.x}deg) translateZ(0)`,
      }}
    >
      {/* Banner Section */}
      <div className="relative h-[180px] m-3 mb-0 rounded-[22px] overflow-hidden">
        <Image
          src="https://plus.unsplash.com/premium_photo-1677105700661-dbfad22793ca?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8c2t5JTIwY2xlYW58ZW58MHx8MHx8fDA%3D$0"
          alt="Banner"
          fill
          className="object-cover transition-transform duration-700 ease-out hover:scale-[1.03]"
          priority
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-transparent" />

        {/* Follow Button with enhanced interactions */}
        <button
          onClick={() => setIsFollowing(!isFollowing)}
          onMouseDown={() => setIsPressed(true)}
          onMouseUp={() => setIsPressed(false)}
          onMouseLeave={() => setIsPressed(false)}
          className={cn(
            "absolute top-3.5 right-3.5 px-5 py-2.5 rounded-full text-sm font-semibold",
            "flex items-center gap-1.5 transition-all duration-300 ease-out",
            "backdrop-blur-md border border-white/20",
            isFollowing
              ? "bg-foreground text-background shadow-lg shadow-black/20"
              : "bg-background/95 text-foreground shadow-lg shadow-foreground/10 hover:shadow-xl hover:shadow-foreground/15",
            isPressed && "scale-95",
          )}
        >
          <span className="transition-all duration-300">{isFollowing ? "Following" : "Follow"}</span>
          <span
            className={cn(
              "transition-all duration-300 ease-out inline-block",
              isFollowing ? "rotate-45 opacity-70" : "rotate-0",
            )}
          >
            +
          </span>
        </button>
      </div>

      {/* Avatar and Experience Section */}
      <div className="relative px-5 pt-0">
        <div className="flex items-end gap-4 -mt-11">
          {/* Avatar with ring animation on hover */}
          <div className="relative group">
            <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-purple-400/40 via-pink-400/40 to-orange-400/40 opacity-0 group-hover:opacity-60 blur-sm transition-opacity duration-500" />
            <div
              className={cn(
                "relative w-[92px] h-[92px] rounded-full border-[4px] border-card overflow-hidden",
                "bg-gradient-to-br from-secondary to-muted",
                "shadow-lg shadow-foreground/10 dark:shadow-black/20",
                "transition-all duration-500 ease-out",
                "group-hover:scale-[1.02]",
              )}
            >
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/attachments/gen-images/public/3d-cartoon-character-boy-with-round-glasses-brown--euRI2jSYQStq9nIycYBELsV3HRaz4v.jpg"
                alt="Noah Thompson"
                width={92}
                height={92}
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Experience Bar with stagger animation */}
          <div className="flex items-center gap-2.5 pb-3.5">
            <span className="text-sm text-muted-foreground font-medium tracking-wide">exp.</span>
            <div className="flex gap-[2.5px]">
              {experienceColors.map((color, index) => (
                <div
                  key={index}
                  className="w-[3px] rounded-full transition-all duration-500 ease-out hover:scale-y-125"
                  style={{
                    backgroundColor: color,
                    height: `${12 + Math.sin(index * 0.4) * 4}px`,
                    transitionDelay: `${index * 15}ms`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Name and Bio */}
        <div className="mt-4">
          <h2 className="text-[22px] font-bold text-card-foreground tracking-tight leading-tight">Noah Thompson</h2>
          <p className="mt-2 text-[15px] text-muted-foreground leading-[1.55]">
            Product Designer who focuses on
            <br />
            simplicity & usability.
          </p>
        </div>
      </div>

      {/* Stats Section with enhanced hover states */}
      <div className="grid grid-cols-3 mt-6 border-t border-border">
        {[
          { label: "Likes", value: stats.likes, key: "likes" },
          { label: "Posts", value: stats.posts, key: "posts" },
          { label: "Views", value: stats.views, key: "views" },
        ].map((stat, index) => (
          <div
            key={stat.key}
            className={cn(
              "relative flex py-5 flex-col items-center justify-center cursor-default",
              "transition-all duration-300 ease-out",
              index !== 2 && "border-r border-border",
            )}
            onMouseEnter={() => setIsHovering(stat.key)}
            onMouseLeave={() => setIsHovering(null)}
          >
            <span
              className={cn(
                "relative text-[20px] font-bold text-card-foreground transition-all duration-300",
                isHovering === stat.key && "scale-105",
              )}
            >
              {formatNumber(stat.value)}
            </span>
            <span
              className={cn(
                "relative text-[13px] text-muted-foreground mt-0.5 transition-all duration-300",
                isHovering === stat.key && "text-card-foreground/70",
              )}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>

      {/* Social Links with polished interactions */}
      <div className="grid grid-cols-3 border-t border-border">
        {[
          { icon: InstagramIcon, label: "Instagram" },
          { icon: XIcon, label: "X" },
          { icon: LinkedInIcon, label: "LinkedIn" },
        ].map((social, index) => (
          <button
            key={social.label}
            className={cn(
              "group relative flex items-center justify-center py-4",
              "transition-all duration-300 ease-out",
              "active:scale-[0.97]",
              index !== 2 && "border-r border-border",
            )}
            aria-label={social.label}
          >
            <div className="absolute inset-0 bg-foreground/[0.03] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <social.icon
              className={cn(
                "relative w-[22px] h-[22px] text-muted-foreground",
                "transition-all duration-300 ease-out",
                "group-hover:text-card-foreground group-hover:scale-110",
              )}
            />
          </button>
        ))}
      </div>
    </div>
  )
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  )
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}
