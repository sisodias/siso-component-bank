"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"

const ImagePile = ({ images, speed = 2 }: { images: string[]; speed?: number }) => {
  const [topIndex, setTopIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return

    const id = setInterval(() => {
      setTopIndex((prevIndex) => (prevIndex + 1) % images.length)
    }, speed * 1000)

    return () => {
      clearInterval(id)
    }
  }, [images.length, speed, isPaused])

  const handleDotClick = (index: number) => {
    setTopIndex(index)
    setIsPaused(true)
    // Resume auto-cycling after 5 seconds
    setTimeout(() => setIsPaused(false), 5000)
  }

  return (
    <div className="relative">
      <div className="relative h-[200px] sm:h-[260px] md:h-[390px] lg:h-[450px] xl:h-[500px] w-[310px] sm:w-[500px] md:w-[725px] lg:w-[900px] xl:w-[1200px] overflow-visible">
        {images.map((image, i) => {
          const key = `stacked-card-${i}`
          const isTop = topIndex === i
          const secondTopIndex = (topIndex + 2) % images.length
          const zIndex = isTop ? 100 : secondTopIndex ? 99 : images.length - i
          const y: number = Math.random() * 20
          const x: number = Math.random() * 20
          const rotation = i * (Math.random() * 1 + 2) - 2

          return (
            <motion.div
              key={key}
              className="absolute w-full h-full"
              style={{
                zIndex,
                transformOrigin: "center center",
              }}
              animate={{
                rotateZ: isTop ? 0 : rotation,
                translateX: Math.random() < 0.5 ? x : -x,
                opacity: isTop ? [0, 1] : 0.8,
                translateY: isTop ? [30, Math.random() < 0.5 ? y : -y] : Math.random() < 0.5 ? y : -y,
                transition: {
                  duration: 0.5,
                },
              }}
              initial={isTop ? { rotateZ: 0 } : { rotateZ: rotation }}
            >
              <div className="relative h-full w-full overflow-hidden rounded-3xl">
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`stacked-card-${i}`}
                  height={1080}
                  width={1920}
                  className="h-full w-full object-cover"
                  priority={isTop}
                />
              </div>
            </motion.div>
          )
        })}
      </div>

      <div className="flex justify-center space-x-2 mt-8">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => handleDotClick(index)}
            className={`w-8 rounded-sm transition-all cursor-pointer duration-300 h-2 ${
              topIndex === index ? "bg-primary scale-110" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Go to image ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

export default ImagePile
