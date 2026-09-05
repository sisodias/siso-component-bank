"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "./button"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"

interface AboutPageProps {
  achievements?: Array<{ label: string; value: string }>
}

const defaultAchievements = [
  { label: "Companies Supported", value: "300+" },
  { label: "Projects Finalized", value: "800+" },
  { label: "Happy Customers", value: "99%" },
  { label: "Recognized Awards", value: "10+" },
]

export default function AboutPage({
  achievements = defaultAchievements,
}: AboutPageProps) {
  return (
    <div className="flex flex-col">

      {/* ---------------- HERO SECTION ---------------- */}
      <section className="py-16 md:py-28 bg-background">
        <div className="mx-auto max-w-6xl space-y-2 px-6">
          <Image
            className="rounded-xl object-cover w-full h-[240px] md:h-[460px]"
            src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_hero_gradient.jpg"
            alt="Hero section image"
            width={1200}
            height={600}
            priority
          />

          <div className="grid gap-6 md:grid-cols-2 md:gap-12">
            <h1 className="text-3xl md:text-4xl font-semibold text-gray-900 dark:text-white leading-snug">
              The Lyra <span className="text-primary">ecosystem</span>{" "}
              <span className="text-gray-500 dark:text-gray-400">
                brings together our models, products, and platforms.
              </span>
            </h1>
            <div className="space-y-6 text-muted-foreground">
              <p>
                Lyra is evolving to be more than just the models. It supports an entire ecosystem — 
                from products to the APIs and platforms helping developers and businesses innovate.
              </p>
              <Button
                asChild
                variant="secondary"
                size="sm"
                className="gap-1 pr-1.5"
              >
                <Link href="#">
                  <span>Learn More</span>
                  <ChevronRight className="size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- ABOUT SECTION ---------------- */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-6xl space-y-16 px-6">

          {/* Header */}
          <div className="grid gap-6 text-center md:grid-cols-2 md:gap-12 md:text-left">
            <h1 className="text-4xl md:text-5xl font-semibold text-gray-900 dark:text-white">
              About Us
            </h1>
            <p className="text-muted-foreground">
              Shadcnblocks is a passionate team dedicated to creating innovative solutions
              that empower businesses to thrive in the digital age.
            </p>
          </div>

          {/* ---------------- LAST THREE CARDS (NEW LAYOUT) ---------------- */}
          <div className="flex flex-col md:flex-row gap-6 mt-16">
            
            {/* LEFT BIG IMAGE */}
            <div className="md:flex-1">
              <Image
                src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_chat_gradient.png"
                alt="Left big image"
                className="rounded-xl object-cover w-full h-[300px] sm:h-[360px] md:h-[100%]"
                width={800}
                height={550}
              />
            </div>

            {/* RIGHT TWO CARDS */}
            <div className="flex flex-col gap-6 md:flex-1">
              {/* FIRST CARD */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="relative overflow-hidden rounded-xl bg-black text-white shadow-lg"
              >
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.4 }}
                  className="relative h-60 sm:h-64 md:h-48 w-full overflow-hidden"
                >
                  <Image
                    src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_moon.png"
                    alt="Card Image"
                    className="h-full w-full object-cover"
                    width={600}
                    height={400}
                  />
                  <div className="absolute bottom-0 h-32 w-full bg-gradient-to-t from-black via-black/70 to-transparent" />
                </motion.div>
                <div className="p-6">
                  <h3 className="text-xl font-bold">Accelerate Growth</h3>
                  <p className="mt-2 text-sm text-gray-300">
                    Our solutions drive innovation, efficiency, and measurable impact for businesses.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-white text-black dark:text-white hover:bg-white hover:text-black"
                  >
                    Learn More
                  </Button>
                </div>
              </motion.div>

              {/* SECOND CARD */}
              <motion.div
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 250, damping: 20 }}
                className="relative overflow-hidden rounded-xl bg-muted shadow-lg"
              >
                <Image
                  src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/ruixen_hero_gradient.jpg"
                  alt="Secondary card"
                  className="h-full w-full object-cover min-h-[220px] sm:min-h-[240px] md:min-h-[220px]"
                  width={600}
                  height={400}
                />
                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                  <h3 className="text-xl font-bold">Future-Ready Design</h3>
                  <p className="mt-2 text-sm text-gray-200">
                    Intuitive, scalable designs for modern businesses combining aesthetics and functionality.
                  </p>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </section>
    </div>
  )
}
