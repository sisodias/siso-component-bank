"use client"

import Image from "next/image"
import { useState } from "react"
import { Card, CardHeader, CardContent } from "./card"
import { Button } from "./button"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  [
    { role: "Computer Vision Engineer", count: "2.6K+ Jobs" },
    { role: "AI Research Scientist", count: "1.8K+ Jobs" },
    { role: "Machine Learning Engineer", count: "3.2K+ Jobs" },
    { role: "Deep Learning Specialist", count: "2.1K+ Jobs" },
    { role: "Data Scientist", count: "1.5K+ Jobs" },
    { role: "NLP Engineer", count: "1.2K+ Jobs" },
    { role: "Robotics Engineer", count: "800+ Jobs" },
    { role: "Autonomous Vehicle Engineer", count: "1.4K+ Jobs" },
    { role: "AI Product Manager", count: "950+ Jobs" },
    { role: "Augmented Reality Developer", count: "1.1K+ Jobs" },
  ],
  [
    { role: "AI Researcher", count: "1.1K+ Jobs" },
    { role: "Vision Systems Developer", count: "750+ Jobs" },
    { role: "Predictive Analytics Specialist", count: "1.3K+ Jobs" },
    { role: "Generative AI Engineer", count: "2.0K+ Jobs" },
    { role: "AI Consultant", count: "1.7K+ Jobs" },
    { role: "Healthcare AI Specialist", count: "900+ Jobs" },
    { role: "Edge AI Developer", count: "1.4K+ Jobs" },
    { role: "3D Reconstruction Engineer", count: "850+ Jobs" },
    { role: "Face Recognition Expert", count: "600+ Jobs" },
    { role: "AI Solutions Architect", count: "1.9K+ Jobs" },
  ],
  [
    { role: "Speech Recognition Engineer", count: "1.0K+ Jobs" },
    { role: "AI Ethics Specialist", count: "500+ Jobs" },
    { role: "AI Trainer", count: "1.3K+ Jobs" },
    { role: "Computer Vision Analyst", count: "1.2K+ Jobs" },
    { role: "Video Analytics Specialist", count: "800+ Jobs" },
    { role: "AI Operations Manager", count: "700+ Jobs" },
    { role: "Image Processing Engineer", count: "900+ Jobs" },
    { role: "CV Algorithm Developer", count: "1.6K+ Jobs" },
    { role: "AI Hardware Engineer", count: "600+ Jobs" },
    { role: "AI Chatbot Developer", count: "1.2K+ Jobs" },
  ],
]

export default function JobSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)

  const handlePrev = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1))
  const handleNext = () =>
    setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1))

  return (
    <section
      className="
      w-full flex flex-col md:flex-row items-center justify-between
      rounded-2xl border
      bg-[#fdf7f3] dark:bg-neutral-900
      border-gray-200 dark:border-neutral-700
      py-10 px-6 m-4 md:m-8
      relative min-h-[400px] transition-colors
      "
    >
      {/* Right Section */}
      <div className="w-full md:w-2/5 text-left space-y-4">
        <Image
          src="https://pub-940ccf6255b54fa799a9b01050e6c227.r2.dev/jobs.png"
          alt="Discover Jobs"
          width={300}
          height={300}
          className="rounded-xl mx-auto md:mx-0"
        />
        <h2 className="text-3xl md:text-5xl font-semibold text-gray-800 dark:text-gray-100">
          Discover jobs across popular roles
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Select a role and we’ll show you relevant jobs for it!
        </p>
      </div>

      {/* Left Section */}
      <div className="w-full md:w-1/2 flex items-center relative mt-10 md:mt-0">
        {/* Prev Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="
            absolute -left-6 sm:-left-8 top-1/2 -translate-y-1/2
            rounded-full bg-white dark:bg-neutral-800
            shadow hover:bg-gray-100 dark:hover:bg-neutral-700
          "
          onClick={handlePrev}
        >
          <ChevronLeft className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </Button>

        {/* Slider */}
        <div className="overflow-hidden w-full">
          <div
            className="flex transition-transform duration-500"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {slides.map((slide, i) => (
              <div
                key={i}
                className="
                  grid grid-cols-1 sm:grid-cols-2 gap-4
                  min-w-full p-4 rounded-xl
                  bg-gray-100 dark:bg-neutral-800
                "
              >
                {slide.map((job, idx) => (
                  <Card
                    key={idx}
                    className="
                      text-center shadow-md p-4
                      bg-white dark:bg-neutral-900
                      border border-gray-200 dark:border-neutral-700
                      transition-colors
                    "
                  >
                    <CardHeader className="text-base sm:text-lg font-semibold p-0 text-gray-800 dark:text-gray-100">
                      {job.role}
                    </CardHeader>
                    <CardContent className="text-sm text-gray-500 dark:text-gray-400 p-0 mt-1">
                      {job.count}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Next Arrow */}
        <Button
          variant="ghost"
          size="icon"
          className="
            absolute -right-6 sm:-right-8 top-1/2 -translate-y-1/2
            rounded-full bg-white dark:bg-neutral-800
            shadow hover:bg-gray-100 dark:hover:bg-neutral-700
          "
          onClick={handleNext}
        >
          <ChevronRight className="w-5 h-5 text-gray-700 dark:text-gray-200" />
        </Button>
      </div>
    </section>
  )
}
