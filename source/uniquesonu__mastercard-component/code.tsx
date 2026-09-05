import React from 'react';

export default function CardaqConcierge() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-200 via-pink-100 to-rose-300 p-2 sm:p-4 md:p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden">
        

        {/* Main Content */}
        <main className="grid xl:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 p-4 sm:p-6 lg:p-12">
          {/* Left Section */}
          <div className="space-y-6 sm:space-y-8 order-2 xl:order-1">
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-bold text-gray-800 leading-tight mb-4 sm:mb-6">
                Singapore Rose
                <br className="hidden sm:block" />
                <span className="sm:block">Concierge</span>
                <span className="ml-2 sm:ml-4 inline-block">
                  <svg width="40" height="30" viewBox="0 0 60 40" className="text-pink-400 sm:w-[50px] sm:h-[35px] lg:w-[60px] lg:h-[40px]">
                    <path d="M30 5 C20 5, 15 15, 20 25 C25 35, 35 35, 40 25 C45 15, 40 5, 30 5 Z" fill="currentColor" opacity="0.7"/>
                    <path d="M25 10 C20 10, 18 18, 22 25 C26 32, 34 32, 38 25 C42 18, 40 10, 35 10" fill="currentColor" opacity="0.5"/>
                    <circle cx="30" cy="20" r="3" fill="currentColor" opacity="0.8"/>
                  </svg>
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-full sm:max-w-md">
                We are offering the unique customer journey with the most luxurious concierge experience worldwide
              </p>
            </div>

            {/* Account Cards */}
            <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-gray-100 transition-colors group">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Private Account</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4">
                  Open account with us and experience the unique opportunity of international travel without any boundaries.
                </p>
                <button className="text-pink-500 font-medium hover:text-pink-600 transition-colors group-hover:translate-x-1 transform duration-200 text-sm sm:text-base">
                  Learn more ›
                </button>
              </div>

              <div className="bg-gray-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 hover:bg-gray-100 transition-colors group">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-2 sm:mb-3">Corporate Account</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 sm:mb-4">
                  Being an executive is a hard work and we know that not like any other. That is why we have designed a special program exactly for you and your company.
                </p>
                <button className="text-pink-500 font-medium hover:text-pink-600 transition-colors group-hover:translate-x-1 transform duration-200 text-sm sm:text-base">
                  Learn more ›
                </button>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div className="relative order-1 xl:order-2">
            <div className="bg-gradient-to-br from-pink-100 to-rose-200 rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 h-full min-h-[400px] sm:min-h-[450px] lg:min-h-[500px] relative overflow-hidden">
              {/* Background decorative elements */}
              <div className="absolute top-10 sm:top-20 right-10 sm:right-20 w-16 sm:w-24 lg:w-32 h-16 sm:h-24 lg:h-32 rounded-full bg-white bg-opacity-20"></div>
              <div className="absolute bottom-10 sm:bottom-20 left-10 sm:left-20 w-12 sm:w-18 lg:w-24 h-12 sm:h-18 lg:h-24 rounded-full bg-pink-300 bg-opacity-30"></div>
              
              {/* Content */}
              <div className="relative z-10 h-full flex flex-col">
                <div className="flex items-start justify-between mb-6 sm:mb-8">
                  <div className="flex-1 pr-4">
                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 mb-2 sm:mb-3 leading-tight">
                      Mastercard Airport
                      <br className="hidden sm:block" />
                      <span className="sm:block">Experiences</span>
                    </h2>
                    <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                      Travel in comfort. Relax in over 1,000 airport lounges
                      <br className="hidden sm:block" />
                      <span className="sm:block">worldwide with your Mastercard.</span>
                    </p>
                  </div>
                  <div className="bg-white rounded-full w-10 sm:w-12 h-10 sm:h-12 flex items-center justify-center shadow-lg flex-shrink-0">
                    <span className="text-gray-800 font-bold text-sm sm:text-base">01</span>
                  </div>
                </div>

                {/* Airplane illustration - centered in remaining space */}
                <div className="flex-1 flex justify-center items-center">
                  <div className="relative">
                    <svg 
                      width="150" 
                      height="90" 
                      viewBox="0 0 200 120" 
                      className="text-pink-300 sm:w-[180px] sm:h-[108px] lg:w-[200px] lg:h-[120px]"
                    >
                      {/* Airplane body */}
                      <ellipse cx="100" cy="60" rx="80" ry="12" fill="currentColor" opacity="0.3"/>
                      {/* Wings */}
                      <ellipse cx="70" cy="50" rx="25" ry="8" fill="currentColor" opacity="0.4"/>
                      <ellipse cx="130" cy="70" rx="25" ry="8" fill="currentColor" opacity="0.4"/>
                      {/* Tail */}
                      <ellipse cx="150" cy="45" rx="15" ry="6" fill="currentColor" opacity="0.5"/>
                    </svg>
                    
                    {/* Dotted path */}
                    <div className="absolute -top-6 sm:-top-8 left-0 w-full">
                      <svg 
                        width="150" 
                        height="30" 
                        className="text-pink-400 sm:w-[180px] sm:h-[35px] lg:w-[200px] lg:h-[40px]"
                      >
                        <path d="M20 25 Q60 8, 100 15 T130 20" stroke="currentColor" strokeWidth="2" strokeDasharray="3,3" fill="none" opacity="0.6" className="sm:strokeDasharray-4,4"/>
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-4 sm:mt-8 lg:mt-12">
                  <button className="bg-pink-400 hover:bg-pink-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 text-sm sm:text-base">
                    Explore Lounges ›
                  </button>
                </div>
              </div>

              {/* Mastercard logo */}
              <div className="absolute bottom-4 sm:bottom-6 lg:bottom-8 right-4 sm:right-6 lg:right-8">
                <div className="flex space-x-1">
                  <div className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 bg-red-500 rounded-full opacity-80"></div>
                  <div className="w-6 sm:w-7 lg:w-8 h-6 sm:h-7 lg:h-8 bg-yellow-500 rounded-full opacity-80 -ml-2 sm:-ml-3"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}