"use client"

import { useState, useEffect } from "react"
import { Instagram, Twitter } from "lucide-react"

interface ProfileCardProps {
  name?: string
  title?: string
  avatarUrl?: string
  backgroundUrl?: string
  likes?: number
  posts?: number
  views?: number
  instagramUrl?: string
  twitterUrl?: string
  threadsUrl?: string
}

export function ProfileCard({
  name = "Bhomik Chauhan",
  title = "Product Designer who focuses on simplicity & usability.",
  avatarUrl = "https://i.ibb.co/Kc3MTRNm/caarton-character.png",
  backgroundUrl = "https://i.ibb.co/nHk8jc8/cloud-image.jpg",
  likes = 72900,
  posts = 828,
  views = 342900,
  instagramUrl = "https://instagram.com/bhomikchauhan",
  twitterUrl = "https://twitter.com/bhomikchauhan",
  threadsUrl = "https://threads.net/@bhomikchauhan",
}: ProfileCardProps) {
  const [isFollowing, setIsFollowing] = useState(false)
  const [expProgress, setExpProgress] = useState(0)
  const [animatedLikes, setAnimatedLikes] = useState(0)
  const [animatedPosts, setAnimatedPosts] = useState(0)
  const [animatedViews, setAnimatedViews] = useState(0)

  // Animate experience bar
  useEffect(() => {
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setExpProgress((prev) => {
          if (prev >= 65) {
            clearInterval(interval)
            return 65
          }
          return prev + 1
        })
      }, 20)
      return () => clearInterval(interval)
    }, 300)
    return () => clearTimeout(timer)
  }, [])

  // Animate counters
  useEffect(() => {
    const duration = 2000
    const steps = 60
    const stepDuration = duration / steps

    const likesIncrement = likes / steps
    const postsIncrement = posts / steps
    const viewsIncrement = views / steps

    let currentStep = 0

    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        currentStep++
        setAnimatedLikes(Math.min(Math.floor(likesIncrement * currentStep), likes))
        setAnimatedPosts(Math.min(Math.floor(postsIncrement * currentStep), posts))
        setAnimatedViews(Math.min(Math.floor(viewsIncrement * currentStep), views))

        if (currentStep >= steps) {
          clearInterval(interval)
        }
      }, stepDuration)
      return () => clearInterval(interval)
    }, 500)

    return () => clearTimeout(timer)
  }, [likes, posts, views])

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <div className="bg-card rounded-[2rem] shadow-lg overflow-hidden">
        {/* Header with background */}
        <div className="relative h-40 bg-gradient-to-br from-sky-start to-sky-end overflow-hidden">
          <img
            src={backgroundUrl || "/placeholder.svg"}
            alt="Background"
            className="w-full h-full object-cover opacity-60"
          />

          {/* Follow button */}
          <button
            onClick={() => setIsFollowing(!isFollowing)}
            className={`absolute top-4 right-4 rounded-full px-6 py-2 font-medium transition-all duration-300 ${
              isFollowing
                ? "bg-card text-card-foreground border-2 border-border hover:bg-secondary"
                : "bg-card text-card-foreground hover:bg-secondary"
            }`}
          >
            {isFollowing ? "Following" : "Follow"}
            <span className="ml-2 text-lg">{isFollowing ? "✓" : "+"}</span>
          </button>
        </div>

        {/* Profile content */}
        <div className="px-6 pb-6 -mt-12">
          {/* Avatar */}
          <div className="relative w-24 h-24 mb-4">
            <div className="w-full h-full rounded-full border-4 border-card overflow-hidden bg-card shadow-lg">
              <img src={avatarUrl || "/placeholder.svg"} alt={name} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Experience bar */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm text-muted-foreground font-light">exp.</span>
              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 via-orange-500 via-yellow-500 via-green-500 to-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${expProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Name and title */}
          <h2 className="text-2xl font-semibold text-card-foreground mb-2 tracking-tight">{name}</h2>
          <p className="text-muted-foreground text-sm leading-relaxed mb-6 font-light">{title}</p>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6 py-4 border-t border-b border-border">
            <div className="text-center">
              <div className="text-2xl font-semibold text-card-foreground mb-1">{formatNumber(animatedLikes)}</div>
              <div className="text-xs text-muted-foreground font-light">Likes</div>
            </div>
            <div className="text-center border-l border-r border-border">
              <div className="text-2xl font-semibold text-card-foreground mb-1">{animatedPosts}</div>
              <div className="text-xs text-muted-foreground font-light">Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-card-foreground mb-1">{formatNumber(animatedViews)}</div>
              <div className="text-xs text-muted-foreground font-light">Views</div>
            </div>
          </div>

          {/* Social icons */}
          <div className="flex justify-center gap-8">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Instagram Profile"
            >
              <Instagram className="w-5 h-5 text-card-foreground" />
            </a>
            <a
              href={twitterUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Twitter Profile"
            >
              <Twitter className="w-5 h-5 text-card-foreground" />
            </a>
            <a
              href={threadsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
              aria-label="Threads Profile"
            >
              <svg
                className="w-5 h-5 text-card-foreground"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
