"use client"

import { useState } from "react"

interface FlashcardData {
  native: string
  english: string
}

const sampleCards: FlashcardData[] = [
  { native: "감사합니다", english: "thank you" },
  { native: "물", english: "water" },
  { native: "음식", english: "food" },
]

export function FlashcardStack() {
  const [hovered, setHovered] = useState(false)
  const count = 3

  const restTransforms = [
    "translate(-120%, -40%) rotate(-10deg)",
    "translate(-50%, -38%) rotate(0deg)",
    "translate(20%, -40%) rotate(10deg)",
  ]

  const activeTransforms = [
    "translate(-120%, -95%) rotate(-10deg)",
    "translate(-50%, -110%) rotate(0deg)",
    "translate(20%, -95%) rotate(10deg)",
  ]

  return (
    <div
      className="relative w-[420px] mx-auto"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Peek-out flashcards */}
      <div className="pointer-events-none absolute inset-0 z-0">
        {sampleCards.map((card, i) => (
          <div
            key={i}
            className="absolute left-1/2 top-0 h-[80px] w-[110px] rounded-xl border bg-card text-card-foreground shadow-md transition-all duration-700 ease-out"
            style={{
              transform: hovered ? activeTransforms[i] : restTransforms[i],
              opacity: hovered ? 1 : 0,
              transitionDelay: `${i * 90}ms`,
              zIndex: i,
            }}
          >
            {/* subtle inner highlight */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-white/40 to-transparent pointer-events-none" />

            <div className="flex h-full flex-col items-center justify-center px-2 text-center">
              <span className="text-sm font-semibold leading-tight">
                {card.native}
              </span>
              <span className="mt-1 text-[10px] text-muted-foreground">
                {card.english}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Button */}
      <button
        className="relative z-10 flex w-full items-center justify-between rounded-xl border bg-primary px-6 py-4 text-primary-foreground shadow-sm transition-all hover:scale-[1.02] hover:shadow-md active:scale-[0.99]"
      >
        <span className="text-lg font-semibold tracking-tight">
          Review Flashcards
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary-foreground/10 text-sm font-bold backdrop-blur">
          {count}
        </span>
      </button>
    </div>
  )
}