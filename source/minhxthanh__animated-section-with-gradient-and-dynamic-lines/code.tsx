import React, { useEffect } from 'react'

export default function AnimatedSection() {
  useEffect(() => {
    // Compute each SVG path’s length for the dash‐animation
    document.querySelectorAll('.line-animation-path').forEach((path) => {
      const len = path.getTotalLength()
      path.style.setProperty('--path-length', `${len}`)
    })
  }, [])

  return (
    <div className="relative bg-[#0a0a0a] text-white font-sans overflow-x-hidden flex items-center justify-center min-h-screen py-20 px-5">
      
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Corner Animations */}
        <div className="absolute top-1/2 left-0 right-0 transform -translate-y-1/2 h-[80px]">
          {/* Left corner */}
          <div className="absolute w-[200px] h-[80px] left-[-120px]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 177 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="line-background"
                d="M176 1L53.5359 1C52.4313 1 51.5359 1.89543 51.5359 3L51.5359 56C51.5359 57.1046 50.6405 58 49.5359 58L0 58"
              />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 177 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="line-animation-path"
                d="M176 1L53.5359 1C52.4313 1 51.5359 1.89543 51.5359 3L51.5359 56C51.5359 57.1046 50.6405 58 49.5359 58L0 58"
              />
            </svg>
          </div>

          {/* Right corner */}
          <div className="absolute w-[200px] h-[80px] right-[-120px]">
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 176 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="line-background"
                d="M0 1L122.464 1C123.569 1 124.464 1.89543 124.464 3L124.464 56C124.464 57.1046 125.36 58 126.464 58L176 58"
              />
            </svg>
            <svg
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 176 59"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                className="line-animation-path reverse"
                d="M0 1L122.464 1C123.569 1 124.464 1.89543 124.464 3L124.464 56C124.464 57.1046 125.36 58 126.464 58L176 58"
              />
            </svg>
          </div>
        </div>

        {/* Background Stripe Lines */}
        {/* Line 1 (15%) */}
        <div className="absolute w-full h-[77px] top-[15%]">
          <div className="absolute w-full h-full z-20">
            <svg width="100%" viewBox="0 0 1336 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="line-gradient-1">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="20%" stopColor="white" stopOpacity="1" />
                  <stop offset="40%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="gradient-mask-1">
                  <rect
                    className="mask-rect"
                    x="0"
                    y="0"
                    width="20%"
                    height="100%"
                    fill="url(#line-gradient-1)"
                  />
                </mask>
              </defs>
              <path
                d="M0 1H179.567L254.595 76H1081.4L1156.43 1H1336"
                stroke="currentColor"
                mask="url(#gradient-mask-1)"
              />
            </svg>
          </div>
          <div className="absolute w-full h-full z-10">
            <svg width="100%" viewBox="0 0 1336 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H179.567L254.595 76H1081.4L1156.43 1H1336" stroke="currentColor" />
            </svg>
          </div>
        </div>

        {/* Line 2 (35%) */}
        <div className="absolute w-full h-[98px] top-[35%]">
          <div className="absolute w-full h-full z-20">
            <svg width="100%" viewBox="0 0 1336 98" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="line-gradient-2">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="20%" stopColor="white" stopOpacity="1" />
                  <stop offset="40%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="gradient-mask-2">
                  <rect
                    className="mask-rect"
                    x="0"
                    y="0"
                    width="20%"
                    height="100%"
                    fill="url(#line-gradient-2)"
                  />
                </mask>
              </defs>
              <path
                d="M0 1H107.5L182.528 97H1154L1229.03 1H1336"
                stroke="#f90"
                mask="url(#gradient-mask-2)"
              />
            </svg>
          </div>
          <div className="absolute w-full h-full z-10">
            <svg width="100%" viewBox="0 0 1336 98" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 1H107.5L182.528 97H1154L1229.03 1H1336" stroke="currentColor" />
            </svg>
          </div>
        </div>

        {/* Line 3 (55%) */}
        <div className="absolute w-full h-[98px] top-[55%]">
          <div className="absolute w-full h-full z-20">
            <svg width="100%" viewBox="0 0 1336 98" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="line-gradient-3">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="20%" stopColor="white" stopOpacity="1" />
                  <stop offset="40%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="gradient-mask-3">
                  <rect
                    className="mask-rect"
                    x="0"
                    y="0"
                    width="20%"
                    height="100%"
                    fill="url(#line-gradient-3)"
                  />
                </mask>
              </defs>
              <path
                d="M0 97H107.5L182.528 1H1154L1229.03 97H1336"
                stroke="#f90"
                mask="url(#gradient-mask-3)"
              />
            </svg>
          </div>
          <div className="absolute w-full h-full z-10">
            <svg width="100%" viewBox="0 0 1336 98" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 97H107.5L182.528 1H1154L1229.03 97H1336" stroke="currentColor" />
            </svg>
          </div>
        </div>

        {/* Line 4 (75%) */}
        <div className="absolute w-full h-[77px] top-[75%]">
          <div className="absolute w-full h-full z-20">
            <svg width="100%" viewBox="0 0 1336 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="line-gradient-4">
                  <stop offset="0%" stopColor="white" stopOpacity="0" />
                  <stop offset="20%" stopColor="white" stopOpacity="1" />
                  <stop offset="40%" stopColor="white" stopOpacity="0" />
                </linearGradient>
                <mask id="gradient-mask-4">
                  <rect
                    className="mask-rect"
                    x="0"
                    y="0"
                    width="20%"
                    height="100%"
                    fill="url(#line-gradient-4)"
                  />
                </mask>
              </defs>
              <path
                d="M1336 76H1156.43L1081.4 1H254.595L179.567 76H0"
                stroke="#f90"
                mask="url(#gradient-mask-4)"
              />
            </svg>
          </div>
          <div className="absolute w-full h-full z-10">
            <svg width="100%" viewBox="0 0 1336 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1336 76H1156.43L1081.4 1H254.595L179.567 76H0" stroke="currentColor" />
            </svg>
          </div>
        </div>
      </div>

      <div className="relative z-20 max-w-screen-xl w-full text-center">
        <h2 className="text-[clamp(3rem,8vw,6rem)] font-bold leading-tight mb-12">
          Ready to build<br />
          <span className="bg-gradient-to-r from-[#ff6b35] via-[#f7931e] to-[#ffdd00] bg-clip-text text-transparent">
            the software of the future?
          </span>
        </h2>

        <a
          href="#"
          className="inline-block py-4 px-8 bg-white text-black rounded-lg font-semibold text-lg transition-transform ease-in-out hover:-translate-y-0.5 hover:shadow-lg"
        >
          Start building
        </a>
      </div>
    </div>
  )
}
