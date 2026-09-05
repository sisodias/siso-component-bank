"use client"

import { Star, MessageCircle, UserPlus } from "lucide-react"
import { cn } from "../_utils/cn"

type ProfileCardProps = {
  name: string
  role: string
  status: "online" | "offline" | "away"
  avatar: string
  tags?: string[]
  isVerified?: boolean
  followers?: number
}

export default function AnimatedProfileCard() {
  const alexProfile: ProfileCardProps = {
    name: "Alex Thompson",
    role: "UI/UX Designer",
    status: "online",
    avatar: "https://ik.imagekit.io/fpxbgsota/memoji-alex.png?updatedAt=1752933824067",
    tags: ["Premium"],
    isVerified: true,
    followers: 1240,
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center w-full justify-center p-4 relative overflow-hidden">
      {/* Animated Grid Background */}
      <div className="absolute inset-0 opacity-20">
        <div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-300 dark:via-gray-600 to-transparent"
          style={{
            backgroundImage: `
              linear-gradient(rgba(156, 163, 175, 0.3) 1px, transparent 1px),
              linear-gradient(90deg, rgba(156, 163, 175, 0.3) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
            animation: "gridMove 20s linear infinite",
          }}
        />
      </div>

      <ProfileCard {...alexProfile} />

      <style jsx>{`
        @keyframes gridMove {
          0% { transform: translate(0, 0); }
          100% { transform: translate(40px, 40px); }
        }
      `}</style>
    </div>
  )
}

function ProfileCard({ name, role, status, avatar, tags = [], isVerified, followers }: ProfileCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-3xl bg-white dark:bg-gray-800 p-6 w-80 shadow-[12px_12px_24px_rgba(0,0,0,0.15),-12px_-12px_24px_rgba(255,255,255,0.9)] dark:shadow-[12px_12px_24px_rgba(0,0,0,0.3),-12px_-12px_24px_rgba(255,255,255,0.1)] transition-all duration-500 hover:shadow-[20px_20px_40px_rgba(0,0,0,0.2),-20px_-20px_40px_rgba(255,255,255,1)] dark:hover:shadow-[20px_20px_40px_rgba(0,0,0,0.4),-20px_-20px_40px_rgba(255,255,255,0.15)] hover:scale-105 hover:-translate-y-2">
      {/* Status indicator with pulse animation */}
      <div className="absolute right-4 top-4 z-10">
        <div className="relative">
          <div
            className={cn(
              "h-3 w-3 rounded-full border-2 border-white dark:border-gray-800 transition-all duration-300 group-hover:scale-125",
              status === "online"
                ? "bg-green-500 group-hover:shadow-[0_0_20px_rgba(34,197,94,0.6)]"
                : status === "away"
                  ? "bg-amber-500"
                  : "bg-gray-400",
            )}
          ></div>
          {status === "online" && (
            <div className="absolute inset-0 h-3 w-3 rounded-full bg-green-500 animate-ping opacity-30"></div>
          )}
        </div>
      </div>

      {/* Verified badge with bounce animation */}
      {isVerified && (
        <div className="absolute right-4 top-10 z-10">
          <div className="rounded-full bg-blue-500 dark:bg-blue-600 p-1 shadow-[2px_2px_4px_rgba(0,0,0,0.1)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.3)] transition-all duration-300 group-hover:scale-110 group-hover:rotate-12 group-hover:shadow-[0_0_15px_rgba(59,130,246,0.5)]">
            <Star className="h-3 w-3 fill-white text-white" />
          </div>
        </div>
      )}

      {/* Profile Photo with enhanced hover effects */}
      <div className="mb-4 flex justify-center relative z-10">
        <div className="relative group-hover:animate-pulse">
          <div className="h-28 w-28 overflow-hidden rounded-full bg-white dark:bg-gray-700 p-1 shadow-[inset_6px_6px_12px_rgba(0,0,0,0.1),inset_-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[inset_6px_6px_12px_rgba(0,0,0,0.3),inset_-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-500 group-hover:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.15),inset_-8px_-8px_16px_rgba(255,255,255,1)] dark:group-hover:shadow-[inset_8px_8px_16px_rgba(0,0,0,0.4),inset_-8px_-8px_16px_rgba(255,255,255,0.15)] group-hover:scale-110">
            <img
              src={avatar}
              alt={name}
              className="h-full w-full rounded-full object-contain transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          {/* Glowing ring on hover */}
          <div className="absolute inset-0 rounded-full border-2 border-blue-400 dark:border-blue-500 opacity-0 group-hover:opacity-100 transition-all duration-500 animate-pulse"></div>
        </div>
      </div>

      {/* Profile Info with slide-up animation */}
      <div className="text-center relative z-10 transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 transition-colors duration-300 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {name}
        </h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300 group-hover:text-gray-700 dark:group-hover:text-gray-300">
          {role}
        </p>

        {followers && (
          <p className="mt-2 text-xs text-gray-400 dark:text-gray-500 transition-all duration-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 group-hover:font-medium">
            {followers.toLocaleString()} followers
          </p>
        )}
      </div>

      {/* Tags with bounce animation */}
      {tags.length > 0 && (
        <div className="mt-4 flex justify-center gap-2 relative z-10">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={cn(
                "inline-block rounded-full bg-white dark:bg-gray-700 px-3 py-1 text-xs font-medium shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:shadow-[2px_2px_4px_rgba(0,0,0,0.2),-2px_-2px_4px_rgba(255,255,255,0.1)] transition-all duration-300",
                tag === "Premium"
                  ? "text-blue-600 dark:text-blue-400 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30 group-hover:scale-105 group-hover:shadow-[0_0_10px_rgba(59,130,246,0.3)]"
                  : "text-gray-600 dark:text-gray-300 group-hover:scale-105",
              )}
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Action Buttons with enhanced hover effects and increased height */}
      <div className="mt-6 flex gap-2 relative z-10">
        <button className="flex-1 rounded-full bg-white dark:bg-gray-700 py-4 text-sm font-medium text-blue-600 dark:text-blue-400 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.05)] hover:scale-95 active:scale-90 group-hover:bg-blue-50 dark:group-hover:bg-blue-900/30">
          <UserPlus className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" />
        </button>
        <button className="flex-1 rounded-full bg-white dark:bg-gray-700 py-4 text-sm font-medium text-gray-700 dark:text-gray-300 shadow-[6px_6px_12px_rgba(0,0,0,0.1),-6px_-6px_12px_rgba(255,255,255,0.9)] dark:shadow-[6px_6px_12px_rgba(0,0,0,0.2),-6px_-6px_12px_rgba(255,255,255,0.1)] transition-all duration-300 hover:shadow-[2px_2px_4px_rgba(0,0,0,0.05),-2px_-2px_4px_rgba(255,255,255,0.8)] dark:hover:shadow-[2px_2px_4px_rgba(0,0,0,0.15),-2px_-2px_4px_rgba(255,255,255,0.05)] hover:scale-95 active:scale-90 group-hover:bg-gray-50 dark:group-hover:bg-gray-600">
          <MessageCircle className="mx-auto h-4 w-4 transition-transform duration-300 hover:scale-110" />
        </button>
      </div>

      {/* Animated border on hover */}
      <div className="absolute inset-0 rounded-3xl border border-blue-200 dark:border-blue-700 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
    </div>
  )
}
