import React from 'react';
import { Play } from 'lucide-react';

const TestimonialsSection = () => {
  return (
    <div className="bg-white p-16">
      <div className="max-w-7xl mx-auto w-full">
        {/* Top Row - 3 Equal Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {/* Top Left Testimonial - White */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
            <div className="flex items-center mb-6">
              <div className="px-4 h-10 bg-black rounded-2xl flex items-center justify-center text-white text-xs font-bold mr-3">
                LOGOPSUM
              </div>
            </div>
            <div className="text-6xl text-gray-300 font-serif mb-4">"</div>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              From installation to launch, Swipe made everything seamless. Our conversion rates have improved, and clients are constantly complimenting our website's clean, professional look.
            </p>
            <div className="flex items-center">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23E5E7EB'/%3E%3C/svg%3E"
                alt="Aisha Brown"
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <h4 className="font-semibold text-gray-900 text-sm">AISHA BROWN</h4>
                <p className="text-gray-500 text-sm">Co-Founder of Thrive Marketing Co.</p>
              </div>
            </div>
          </div>

          {/* Top Center Testimonial - Blue with Image */}
          <div className="relative rounded-2xl overflow-hidden min-h-[400px]">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='400' viewBox='0 0 400 400'%3E%3Crect width='400' height='400' fill='%234F46E5'/%3E%3C/svg%3E"
                alt="Background"
                className="w-full h-full object-cover opacity-50"
              />
            </div>
            <div className="relative z-10 p-8 text-white h-full flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="text-6xl font-serif opacity-80">"</div>
                  <div className="text-6xl font-serif opacity-80">"</div>
                </div>
                <p className="text-lg leading-relaxed mb-8">
                  Using Swipe was the best decision we made for our agency's rebrand. Our site looks modern, professional, and attracts the kind of clients we want.
                </p>
              </div>
              <div>
                <h4 className="font-bold text-white text-sm tracking-wide">SARAH NGUYEN</h4>
                <p className="text-blue-200 text-sm">CEO of Elevate Digital</p>
              </div>
            </div>
          </div>

          {/* Top Right Testimonial - White */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 relative">
            <div className="flex items-center justify-between mb-6">
              <div className="w-8 h-8 bg-black rounded flex items-center justify-center">
                <div className="w-4 h-4 bg-white rounded-sm"></div>
              </div>
              <div className="text-6xl text-gray-300 font-serif">"</div>
            </div>
            <p className="text-gray-600 text-base leading-relaxed mb-8">
              Swipe made our agency website overhaul insanely easy. We went from a bland, outdated site to a sleek, high-converting platform in just a day. Our lead generation has never been this consistent.
            </p>
            <div className="flex items-center justify-end gap-3 mt-20">
              <div>
                <h4 className="font-semibold text-gray-900 text-sm text-right">RYAN CARTER</h4>
                <p className="text-gray-500 text-sm">Founder of Apex Media</p>
              </div>
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23374151'/%3E%3C/svg%3E"
                alt="Ryan Carter"
                className="w-12 h-12 rounded-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Bottom Row - 30% and 70% */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Bottom Left - Green (30%) */}
          <div className="lg:col-span-4 bg-lime-400 rounded-2xl p-8 text-black relative">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center">
                <div className="w-6 h-6 mr-2">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                  </svg>
                </div>
                <span className="font-bold text-sm">Logopsum</span>
              </div>
              <div className="text-6xl font-serif opacity-60">"</div>
            </div>
            <p className="text-black text-base leading-relaxed mb-8">
              We were struggling to find a website template that was both visually stunning and optimized for conversions. Swipe ticked all the boxes. Customization was a breeze, and the SEO structure helped us rank within weeks.
            </p>
            <div className="flex items-center">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='20' fill='%23374151'/%3E%3C/svg%3E"
                alt="James Wallace"
                className="w-12 h-12 rounded-full mr-4 object-cover"
              />
              <div>
                <h4 className="font-bold text-black text-sm">JAMES WALLACE</h4>
                <p className="text-gray-800 text-sm">Director of WaveMakers</p>
              </div>
            </div>
          </div>

          {/* Bottom Right - Large Dark Section (70%) */}
          <div className="lg:col-span-6 relative rounded-2xl overflow-hidden">
            <div className="absolute inset-0">
              <img
                src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='700' height='400' viewBox='0 0 700 400'%3E%3Crect width='700' height='400' fill='%231F2937'/%3E%3C/svg%3E"
                alt="Office workspace"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black bg-opacity-60"></div>
            </div>
            <div className="relative z-10 p-8 text-white h-full flex flex-col min-h-[400px]">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold tracking-wider">WIZE</h3>
                <div className="flex items-center justify-between">
                  <div className="text-4xl font-serif opacity-60 mr-4">"</div>
                  <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                    <div className="w-4 h-4 bg-white rounded-sm"></div>
                  </div>
                  <div className="text-4xl font-serif opacity-60 ml-4">"</div>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center">
                <h2 className="text-4xl font-bold mb-2">35% GROWTH IN</h2>
                <h2 className="text-4xl font-bold mb-6">PRODUCTIVITY</h2>
                <p className="text-gray-300 text-base mb-8">
                  Watch the video testimonial to learn more.
                </p>
                <button className="bg-white text-black px-6 py-3 rounded-full font-semibold text-sm hover:bg-gray-100 transition-colors self-start flex items-center">
                  <Play className="w-4 h-4 mr-2" />
                  PLAY VIDEO
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestimonialsSection;