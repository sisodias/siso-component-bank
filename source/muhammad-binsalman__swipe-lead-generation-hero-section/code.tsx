import React from 'react';

export default function SwipeHeroSection() {
  return (
    <div className="relative min-h-screen bg-blue-700 overflow-hidden w-full">
      {/* Background Pattern with Sections */}
      <div className="absolute inset-0">
        {/* Main background with sectioned pattern */}
        <div className="w-full h-full bg-blue-700">
          {/* Diagonal sections creating the pattern */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-0 w-full h-1/3 bg-blue-600 transform -skew-y-1 origin-top-left"></div>
            <div className="absolute top-1/4 right-0 w-3/4 h-1/2 bg-blue-800 transform skew-y-1"></div>
            <div className="absolute bottom-0 left-1/4 w-2/3 h-1/3 bg-blue-600 transform -skew-y-1"></div>
            <div className="absolute top-1/2 left-0 w-1/2 h-1/4 bg-blue-800 transform skew-y-2"></div>
            <div className="absolute top-3/4 right-1/3 w-1/2 h-1/4 bg-blue-600 transform -skew-y-2"></div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-center pt-6 px-4">
        <div className="bg-white/95 backdrop-blur-sm rounded-full px-8 py-3 shadow-lg">
          <div className="flex items-center space-x-8">
            <div className="font-bold text-lg text-gray-900">*SWIPE.</div>
            <div className="flex items-center space-x-6 text-sm font-medium text-gray-700">
              <a href="#" className="hover:text-gray-900 transition-colors">HOME</a>
              <a href="#" className="hover:text-gray-900 transition-colors">CASE STUDIES</a>
              <a href="#" className="hover:text-gray-900 transition-colors">ABOUT</a>
              <a href="#" className="hover:text-gray-900 transition-colors">GET IN TOUCH</a>
            </div>
          </div>
        </div>
      </nav>

      {/* Decorative Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 right-16 w-32 h-32 opacity-20">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <circle cx="50" cy="50" r="2" fill="currentColor" className="text-yellow-300">
              <animate attributeName="r" values="1;3;1" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="30" cy="40" r="1" fill="currentColor" className="text-green-400"/>
            <circle cx="70" cy="60" r="1.5" fill="currentColor" className="text-yellow-300"/>
            <path d="M20,50 Q50,20 80,50 Q50,80 20,50" stroke="currentColor" strokeWidth="0.5" fill="none" className="text-white/30"/>
          </svg>
        </div>
        
        <div className="absolute top-20 left-1/4 w-1 h-1 bg-yellow-300 rounded-full opacity-60"></div>
        <div className="absolute top-40 right-1/3 w-1 h-1 bg-green-400 rounded-full opacity-60"></div>
        <div className="absolute bottom-40 left-1/3 w-0.5 h-0.5 bg-white rounded-full opacity-40"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center">
        {/* Star Rating */}
        <div className="mb-8">
          <div className="flex items-center justify-center space-x-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className="w-5 h-5 text-yellow-400 fill-current"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <p className="text-white/90 text-sm font-medium">
            <span className="font-bold">Rated 4.97/5</span> from over 50 reviews.
          </p>
        </div>

        {/* Main Heading */}
        <div className="max-w-6xl mx-auto mb-8">
          <h1 className="text-white text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight mb-4">
            WE GENERATE
          </h1>
          <div className="relative inline-block">
            <h1 className="text-6xl md:text-7xl lg:text-8xl font-black leading-none tracking-tight relative">
              <span className="relative z-10 text-blue-900 font-black">CONVERTING</span>
              <span className="text-white ml-4">LEADS</span>
              {/* Bright green/lime background */}
              <div className="absolute left-0 top-1/2 -rotate-[2deg] transform -translate-y-1/2 bg-lime-400 h-[85%] w-[420px] lg:w-[610px] -z-0"></div>
            </h1>
          </div>
        </div>

        {/* Subheading */}
        <p className="text-white/90 text-lg md:text-xl max-w-2xl mx-auto mb-12 font-medium">
          We generate <span className="font-bold italic">highly qualified</span> bespoke leads for businesses around the world.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
          <button className="bg-white cursor-pointer text-blue-900 px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-gray-100 transition-all duration-200 transform hover:scale-105 shadow-lg">
            GET IN TOUCH
          </button>
          <button className="text-white cursor-pointer border-2 border-white px-8 py-4 rounded-full font-bold text-sm tracking-wide hover:bg-white hover:text-blue-900 transition-all duration-200 transform hover:scale-105">
            LEARN ABOUT US
          </button>
        </div>
      </div>
    </div>
  );
}