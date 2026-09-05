import React, { useState, useEffect } from 'react'

/** I. CONFIGURATION */
export const CARD_CONFIG = {
  width: 360,
  height: 540,
  glowColor: 'cyan',
  buttonText: "View Profile",
  animation: {
    statusInterval: 2500,
    fadeDuration: 500,
  },
}

export const TIER_STYLES = {
  3: {
    name: 'Gold',
    glowClass: 'shadow-amber-400/50 border-amber-400 bg-amber-400',
  },
  // Add more tiers here
}

/** II. CUSTOM HOOK */
export const useAnimatedStatus = (statuses, interval) => {
  const [index, setIndex] = useState(0)
  const [fading, setFading] = useState(false)
  const [visible, setVisible] = useState(statuses[0])

  useEffect(() => {
    if (statuses.length <= 1) return
    const timer = setInterval(() => {
      setFading(true)
      setTimeout(() => {
        const next = (index + 1) % statuses.length
        setIndex(next)
        setVisible(statuses[next])
        setFading(false)
      }, CARD_CONFIG.animation.fadeDuration)
    }, interval)
    return () => clearInterval(timer)
  }, [index, statuses, interval])

  return (
    <span
      className={`
        transition-opacity 
        duration-${CARD_CONFIG.animation.fadeDuration} 
        ${fading ? 'opacity-0' : 'opacity-100'}
      `}
    >
      {visible}
    </span>
  )
}

/** III. UI PARTS */
export const FloatingBadge = ({ text, className = '' }) => (
  <div
    className={`
      absolute 
      text-amber-300/50 
      font-bold 
      text-6xl 
      select-none 
      ${className}
    `}
    style={{ textShadow: '0 1px 4px rgba(0,0,0,0.5)' }}
  >
    {text}
  </div>
)

export const ProfileImage = ({ imageUrl, username }) => (
  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px]">
    <div className="w-full h-full rounded-full bg-zinc-800 p-1 ring-2 ring-zinc-600">
      <img
        src={imageUrl}
        alt={username}
        className="w-full h-full rounded-full object-cover"
        onError={(e) => {
          e.target.onerror = null
          e.target.src =
            'https://placehold.co/256x256/1f2937/ffffff?text=Error'
        }}
      />
    </div>
  </div>
)

export const ProfileDetails = ({ data }) => {
  const animated = useAnimatedStatus(
    data.status,
    CARD_CONFIG.animation.statusInterval
  )
  return (
    <div className="p-6 pt-24 text-white text-center h-full flex flex-col justify-center">
      <h2 className="text-4xl font-bold">{data.username}</h2>
      <p className="text-lg text-zinc-300 mt-4 max-w-xs mx-auto">
        {data.bio}
      </p>
      <div
        className="absolute bottom-5 right-6 text-2xl font-bold text-amber-400 tracking-widest"
        style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
      >
        {animated}
      </div>
    </div>
  )
}

/** IV. MAIN COMPONENT */
export default function ProfileCard({ data }) {
  const [hover, setHover] = useState(false)
  const tierStyle = TIER_STYLES[data.tier] || {}

  return (
    <div
      className="relative cursor-pointer transition-all duration-500"
      style={{
        width: CARD_CONFIG.width,
        height: CARD_CONFIG.height,
        transformStyle: 'preserve-3d',
        transform: hover
          ? 'rotateY(5deg) rotateX(-10deg) scale(1.05)'
          : 'scale(1)',
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <FloatingBadge text="dev" className="top-[-10px] right-[-30px]" />
      <FloatingBadge text="21" className="bottom-[-20px] left-[-20px] scale-75" />

      <div className="absolute inset-0 bg-zinc-900/80 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden border border-zinc-700">
        <ProfileDetails data={data} />
      </div>

      <div
        className="absolute top-0 left-0 w-full h-[45%] transition-transform duration-500 ease-in-out"
        style={{
          transform: hover ? 'translateY(-70%)' : 'translateY(0%)',
        }}
      >
        <div className="absolute inset-0 bg-black/20 rounded-2xl backdrop-blur-md border border-white/10 shadow-lg" />
        <div
          className={`
            absolute 
            top-0 
            right-0 
            h-full 
            w-1.5 
            rounded-r-2xl 
            border-r-2 
            ${tierStyle.glowClass}
          `}
          style={{ boxShadow: `0 0 20px 3px var(--tw-shadow-color)` }}
        />
        <ProfileImage
          imageUrl={data.imageUrl}
          username={data.username}
        />
      </div>

      <button
        className="
          absolute 
          bottom-[-60px] 
          left-1/2 
          -translate-x-1/2 
          w-48 
          py-3 
          bg-cyan-500 
          text-black 
          font-bold 
          rounded-lg 
          shadow-lg 
          hover:bg-cyan-400 
          transition-all 
          duration-300 
          hover:scale-105
        "
      >
        {CARD_CONFIG.buttonText}
      </button>
    </div>
  )
}
