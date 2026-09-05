"use client"

interface GooeyMarqueeProps {
  text: string
  className?: string
  speed?: number
}

export function GooeyMarquee({ text, className = "", speed = 16 }: GooeyMarqueeProps) {
  return (
    <div className={`relative w-full h-32 text-8xl flex items-center justify-center overflow-hidden ${className}`}>
      {/* Blur layer with gooey effect */}
      <div
        className="absolute inset-0 hidden dark:flex items-center justify-center"
        style={{
          backgroundColor: "black",
          backgroundImage: `
            linear-gradient(to right, white, 1rem, transparent 50%),
            linear-gradient(to left, white, 1rem, transparent 50%)
          `,
          filter: "contrast(15)",
        }}
      >
        <p
          className="absolute min-w-full whitespace-nowrap animate-marquee"
          style={{
            filter: "blur(0.07em)",
            animation: `marquee ${speed}s infinite linear`,
          }}
        >
          {text}
        </p>
      </div>

      <div
        className="absolute dark:hidden inset-0 flex items-center justify-center"
        style={{
          backgroundColor: "white",
          backgroundImage: `
            linear-gradient(to right, black,  1rem, transparent 50%),
            linear-gradient(to left, black,  1rem, transparent 50%)
          `,
          filter: "contrast(15)",
        }}
      >
        <p
          className="absolute min-w-full whitespace-nowrap animate-marquee"
          style={{
            filter: "blur(0.07em)",
            animation: `marquee ${speed}s infinite linear`,
          }}
        >
          {text}
        </p>
      </div>

      {/* Clear text layer on top */}
      <div className="absolute inset-0 flex items-center justify-center">
        <p
          className="absolute min-w-full whitespace-nowrap animate-marquee"
          style={{
            animation: `marquee ${speed}s infinite linear`,
          }}
        >
          {text}
        </p>
      </div>

      <style jsx>{`
        @keyframes marquee {
          from { transform: translateX(70%); }
          to { transform: translateX(-70%); }
        }
        .animate-marquee {
          animation: marquee ${speed}s infinite linear;
        }
      `}</style>
    </div>
  )
}
