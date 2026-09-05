import { Warp } from "@paper-design/shaders-react"

export default function NewsLetter() {
  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background shader */}
      <div className="absolute inset-0">
        <Warp
          style={{ height: "100%", width: "100%" }}
          proportion={0.45}
          softness={1}
          distortion={0.25}
          swirl={0.8}
          swirlIterations={10}
          shape="checks"
          shapeScale={0.1}
          scale={1}
          rotation={0}
          speed={1}
          colors={["hsl(340, 100%, 20%)", "hsl(320, 100%, 75%)", "hsl(350, 90%, 30%)", "hsl(330, 100%, 80%)"]}
        />
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center px-8">
        <div className="max-w-2xl w-full text-center space-y-8">
          <h1 className="text-white text-6xl md:text-7xl font-sans font-light italic">Coming Soon</h1>

          {/* Email input with submit button */}
          <div className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-6 py-4 pr-20 text-lg bg-white/20 backdrop-blur-sm border border-white/30 rounded-full text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300"
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-300 group">
              <svg
                className="w-5 h-5 text-gray-800 group-hover:translate-x-0.5 transition-transform duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          {/* Description text */}
          <p className="text-white/90 text-lg font-sans font-light leading-relaxed">
            Don't miss out on the latest news and special content!
            <br />
            Sign up for our newsletter now and stay in the loop with every update.
          </p>
        </div>
      </div>
    </main>
  )
}
