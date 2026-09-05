"use client"

import { motion } from "framer-motion"

const portfolioItems = [
  "https://i.pinimg.com/736x/65/96/97/659697c26cd6b0ca0a2c0c0ba13e65dd.jpg",
  "https://i.pinimg.com/736x/ab/ef/82/abef82fddc6e3db86db23870f2a52277.jpg",
  "https://i.pinimg.com/736x/d5/7e/60/d57e602cbd6924da7a61ff7dc466fa42.jpg",
  "https://i.pinimg.com/736x/89/fb/d3/89fbd3620c5652aafb137c9cd25827be.jpg",
  "https://i.pinimg.com/736x/ff/40/ef/ff40efab997d755cf91e022917fc6434.jpg",
  "https://i.pinimg.com/736x/62/2a/bd/622abdb66db47aa105401d8576bd98b2.jpg",
]

export function CarouselSection() {
  // Duplicate for seamless loop
  const items = [...portfolioItems, ...portfolioItems]

  return (
    <section className="bg-primary w-full h-full py-24 overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 mb-12">
        <motion.h2
          className="text-3xl md:text-4xl font-serif text-primary-foreground"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          Built by creators, for creators.
        </motion.h2>
      </div>

      <div className="relative">
        <motion.div
          className="flex gap-6"
          animate={{ x: [0, "-50%"] }}
          transition={{
            duration: 30,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        >
          {items.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-[300px] md:w-[400px] rounded-xl overflow-hidden shadow-2xl"
              data-clickable
            >
              <img
                src={src || "/placeholder.svg"}
                alt={`Portfolio example ${(i % portfolioItems.length) + 1}`}
                className="w-full h-auto"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
