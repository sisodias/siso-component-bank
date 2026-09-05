import React from 'react';

export default function HeroSection() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative w-full overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-44 h-44 bg-purple-200/30 rounded-full blur-xl"></div>
        <div className="absolute top-40 right-20 w-28 h-28 bg-blue-200/30 rounded-full blur-lg"></div>
        <div className="absolute bottom-40 left-20 w-40 h-40 bg-indigo-200/30 rounded-full blur-2xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-center pt-4">
        <nav className="bg-black/90 backdrop-blur-md rounded-full px-8 py-3 flex items-center space-x-8">
          <div className="flex items-center space-x-2">
            <div className="w-6 h-6 bg-rose-600 rounded-full flex items-center justify-center">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
             <h1 className="font-bold ">Mysh</h1>
          </div>
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Features</a>
          <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">About</a>
           <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">Contact</a>
          <button className="bg-white text-black px-5 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors">
            Get Started
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-16 pb-20">
        {/* Promo Banner */}
        <div className="flex justify-center mb-16">
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 border border-gray-200/60">
            <div className="bg-white text-black px-3 py-0.5 rounded-full mr-4">
              <span className="text-sm font-semibold tracking-tight ">Get Pro 15%</span>
            </div>
            <span className="text-gray-600 text-sm">Join our waitlist and claim instant offer</span>
          </div>
        </div>

        {/* Hero Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-light text-black leading-tight mb-6 tracking-tight" style={{ fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif' }}>
            Seamless SaaS Discovery with<br />
            AI-Powered Search
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Our pre recorded sessions contain all the essentials to help you fix your mood in few sessions
          </p>
        </div>

        {/* CTA Button */}
        <div className="flex justify-center mb-4">
          <button className="bg-rose-800 text-white px-6 py-3 rounded-xl text-lg font-semibold cursor-pointer hover:bg-gray-700 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl flex items-center">
            Download For Free
            <svg className="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Device Mockups */}
        <div className="relative flex justify-center items-center">
          {/* Left Phone */}
          <div className="relative z-20 transform -rotate-12 -translate-x-8">
            <div className="w-64 h-[520px] bg-white rounded-[2.5rem] shadow-2xl border-8 border-gray-200 overflow-hidden">
              {/* Phone Header */}
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <span className="text-sm font-medium">9:41</span>
                <div className="flex items-center space-x-1">
                  <div className="w-4 h-2 bg-black rounded-sm"></div>
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              {/* Phone Content */}
              <div className="p-4 bg-white">
                <div className="text-sm text-gray-500 mb-2">Home Dating Advisor</div>
                <div className="text-xs text-gray-400 mb-4">
                  Is simply dummy text of the printing and typesetting industry. Lorem Ipsum?
                </div>
                <div className="bg-rose-100 rounded-lg p-3 mb-4">
                  <div className="text-sm text-rose-800">Hello Fam this is what we got</div>
                  <div className="text-xs text-rose-600 mt-1">
                    Here are a few great gift for you and your family during holiday season!
                  </div>
                </div>
                <div className="bg-gray-900 text-white p-3 rounded-lg mb-4">
                  <div className="w-full h-1 bg-gray-700 rounded mb-2"></div>
                </div>
                <div className="text-sm font-medium text-gray-800 mb-3">Related Articles</div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-100 rounded-lg p-2">
                    <div className="w-full h-16 bg-gray-200 rounded mb-2"></div>
                    <div className="text-xs">Dating for weebos</div>
                    <div className="text-xs text-gray-500">very common but the...</div>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-2">
                    <div className="w-full h-16 bg-gray-200 rounded mb-2"></div>
                    <div className="text-xs">Dating is</div>
                    <div className="text-xs text-gray-500">more like...</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Center Orb */}
          <div className="relative z-30 mx-8">
            <div className="w-80 h-80 rounded-full bg-gradient-to-br from-purple-400/30 via-rose-400/30 to-indigo-500/30 backdrop-blur-sm border border-white/40 flex items-center justify-center shadow-2xl">
              <div className="w-60 h-60 rounded-full bg-gradient-to-br from-purple-300/40 via-rose-300/40 to-indigo-400/40 backdrop-blur-sm flex items-center justify-center">
                <div className="w-40 h-40 rounded-full bg-gradient-to-br from-purple-200/50 via-rose-200/50 to-indigo-300/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-light text-gray-600 italic">Speak your thoughts</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Phone */}
          <div className="relative z-20 transform rotate-12 translate-x-8">
            <div className="w-64 h-[520px] bg-white rounded-[2.5rem] shadow-2xl border-8 border-gray-200 overflow-hidden">
              {/* Phone Header */}
              <div className="bg-gray-50 px-6 py-3 flex justify-between items-center">
                <button className="text-sm text-blue-500">✕ Close Chat</button>
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
              {/* Phone Content */}
              <div className="p-4 bg-white h-full">
                <div className="text-xs text-gray-500 mb-4">in the article</div>
                <div className="text-xs text-gray-400 mb-4">reading for weeks</div>
                <div className="text-center mb-4">
                  <div className="text-xs text-gray-500">Tue 11th Oct 2022 10:30</div>
                </div>
                <div className="space-y-3">
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="text-xs">caught for 15 seconds</div>
                    <div className="text-xs text-gray-500 mt-1">
                      and you are more and what it's called, finished up and more others but you
                    </div>
                  </div>
                  <div className="text-xs text-gray-400">
                    dummy text of the printing and industry. Lorem Ipsum?
                  </div>
                  <div className="text-xs text-gray-400">
                    Established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Bottom watermark */}
      <div className="absolute bottom-4 right-6 text-xs text-gray-400 flex items-center">
        <span className="mr-2">🖤</span>
        Made in Framer
      </div>
    </div>
  );
}