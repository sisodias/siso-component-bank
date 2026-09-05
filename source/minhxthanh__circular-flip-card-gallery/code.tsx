"use client"

import { useState, useEffect, useRef } from "react"

// A simple utility for conditional class names
const cn = (...classes) => classes.filter(Boolean).join(" ")

// --- Card Data ---
// Using more diverse and high-quality images for a better visual experience.
const cardData = [
  {
    image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=600&fit=crop&crop=center",
    title: "Golden Hour",
    description: "Capturing the perfect moment when day meets night",
  },
  {
    image: "https://images.unsplash.com/photo-1519046904884-53103b34b206?w=400&h=600&fit=crop&crop=center",
    title: "Paradise Found",
    description: "Escape to pristine beaches and crystal waters",
  },
  {
    image: "https://images.unsplash.com/photo-1609172303465-56c68ad89aae?w=400&h=600&fit=crop&crop=center",
    title: "Vintage Memories",
    description: "Preserving moments with timeless elegance",
  },
  {
    image: "https://images.unsplash.com/photo-1490750967868-88aa4486c946?w=400&h=600&fit=crop&crop=center",
    title: "Natural Beauty",
    description: "Finding art in nature's simplest forms",
  },
  {
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=600&fit=crop&crop=center",
    title: "Creative Expression",
    description: "Where imagination meets artistic vision",
  },
  {
    image: "https://images.unsplash.com/photo-1681986367283-c6a5fbf3a7b2?w=400&h=600&fit=crop&crop=center",
    title: "Mountain Majesty",
    description: "Standing tall among nature's giants",
  },
  {
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=600&fit=crop&crop=center",
    title: "Urban Lines",
    description: "Geometry and light in modern spaces",
  },
  {
    image: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&h=600&fit=crop&crop=center",
    title: "Warm Moments",
    description: "Finding comfort in life's simple pleasures",
  },
  {
    image: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=600&fit=crop&crop=center",
    title: "Cosmic Wonder",
    description: "Exploring the infinite beauty above us",
  },
  {
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=600&fit=crop&crop=center",
    title: "Nature's Path",
    description: "Following trails through seasonal beauty",
  },
  {
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=600&fit=crop&crop=center",
    title: "Pure Design",
    description: "Elegance through thoughtful simplicity",
  },
  {
    image: "https://images.unsplash.com/photo-1505142468610-359e7d316be0?w=400&h=600&fit=crop&crop=center",
    title: "Ocean Power",
    description: "Witnessing nature's raw energy and grace",
  },
  {
    image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=600&fit=crop&crop=center",
    title: "Knowledge Keeper",
    description: "Stories waiting to be discovered",
  },
  {
    image: "https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400&h=600&fit=crop&crop=center",
    title: "Night Lights",
    description: "When the city comes alive with energy",
  },
  {
    image: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?w=400&h=600&fit=crop&crop=center",
    title: "Desert Dreams",
    description: "Finding beauty in vast, open spaces",
  },
  {
    image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=600&fit=crop&crop=center",
    title: "Weathered Journey",
    description: "Stories carved by time and tide",
  },
]

// --- FlipCard Component ---
// Converted custom CSS to Tailwind classes for a unified styling approach.
function FlipCard({ image, title, description, className, style }) {
  return (
    <div
      className={cn(
        "group w-24 h-32 md:w-28 md:h-36 rounded-xl [perspective:1000px] transition-transform duration-300 ease-in-out hover:scale-110",
        className,
      )}
      style={style}
    >
      <div className="relative w-full h-full rounded-xl shadow-lg transition-all duration-700 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
        {/* Front side - Image */}
        <div className="absolute inset-0 rounded-xl [backface-visibility:hidden]">
          <img
            src={image || "/placeholder.svg"}
            alt={title}
            className="w-full h-full object-cover rounded-xl border border-neutral-700"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "https://placehold.co/400x600/0a0a0a/333333?text=Image"
            }}
          />
        </div>
        {/* Back side - Title and Description */}
        <div className="absolute inset-0 rounded-xl bg-neutral-900 border border-neutral-700 flex flex-col items-center justify-center p-3 text-center [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <h3 className="font-bold text-xs md:text-sm text-neutral-100 mb-1 text-balance">{title}</h3>
          <p className="text-[10px] md:text-xs text-neutral-400 text-pretty leading-snug">{description}</p>
        </div>
      </div>
    </div>
  )
}

// --- Main App Component (Circular Gallery) ---
export default function CircularGallery() {
  const galleryRef = useRef(null)
  const [size, setSize] = useState(0)
  const [rotation, setRotation] = useState(0)

  // Effect for responsive sizing
  useEffect(() => {
    const updateSize = () => {
      if (galleryRef.current) {
        const gallerySize = galleryRef.current.offsetWidth
        setSize(gallerySize)
      }
    }

    updateSize() // Initial size

    // Use ResizeObserver for better performance than window resize listener
    const resizeObserver = new ResizeObserver(updateSize)
    if (galleryRef.current) {
      resizeObserver.observe(galleryRef.current)
    }

    return () => resizeObserver.disconnect()
  }, [])

  // Effect for animation loop
  useEffect(() => {
    let animationFrameId
    // Slowed down the animation for a more subtle effect
    const animate = () => {
      setRotation((prevRotation) => prevRotation + 0.00005)
      animationFrameId = requestAnimationFrame(animate)
    }
    animationFrameId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrameId)
  }, [])

  const radius = size * 0.4 // 40% of the container size
  const centerX = size / 2
  const centerY = size / 2

  return (
    // Main container with dark background and Inter font
    <main className="font-sans bg-[#0A0A0A] text-[#F5F5F5] min-h-screen flex items-center justify-center p-4 overflow-hidden">
      <div
        ref={galleryRef}
        className="relative w-full max-w-[340px] sm:max-w-[500px] md:max-w-[650px] aspect-square flex items-center justify-center"
      >
        {/* Central text */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10 pointer-events-none p-4">
          <h1 className="text-2xl md:text-4xl lg:text-5xl font-extrabold text-white text-center text-balance mb-3 leading-tight [text-shadow:0_4px_10px_rgba(0,0,0,0.5)]">
            The Future is Built on Artificial Intelligence
          </h1>
          <p className="text-sm md:text-base text-neutral-400 uppercase tracking-widest font-medium">
            Hover to Explore
          </p>
        </div>

        {/* Circular arrangement of cards */}
        {size > 0 &&
          cardData.map((card, index) => {
            // Calculation to position cards in a circle
            const angle = (index / cardData.length) * 2 * Math.PI - Math.PI / 2 + rotation
            const x = centerX + radius * Math.cos(angle)
            const y = centerY + radius * Math.sin(angle)

            return (
              <FlipCard
                key={index}
                {...card}
                className="absolute hover:z-20"
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  transform: `translate(-50%, -50%) rotate(${(angle + Math.PI / 2) * (180 / Math.PI)}deg)`,
                }}
              />
            )
          })}
      </div>
    </main>
  )
}
