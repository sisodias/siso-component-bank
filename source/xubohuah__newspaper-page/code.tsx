'use client'

/**
 * A vintage newspaper-style announcement page with elegant typography, animated content, and a classic paper texture background for creating impactful full-screen presentations.
 */

import { motion } from 'framer-motion'
import Image from 'next/image'

export function NewspaperPage() {
  return (
    <div className="fixed inset-0 w-screen h-screen overflow-hidden">
      {/* Background Image */}
      <div className="fixed inset-0">
        <Image
          src="https://redirect.xubh.fun/background.png"
          alt="Newspaper Background"
          fill
          sizes="100vw"
          className="object-cover w-full h-full"
          priority
        />
      </div>
      
      {/* Content Container */}
      <div className="relative z-10 w-full h-full flex items-center justify-center px-4">
        <div className="max-w-[1893px] w-full font-serif">
          {/* Header Info */}
          <div className="relative px-4 sm:px-8 md:px-[55px]">
            <div className="relative flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-0">
              <h3 className="sm:absolute sm:left-0 text-lg sm:text-xl md:text-2xl lg:text-[28px] font-bold tracking-[0.04em] leading-[1.36] text-black">
                By 21st.dev
              </h3>
              <h3 className="sm:flex-1 text-lg sm:text-xl md:text-2xl lg:text-[28px] font-bold tracking-[0.04em] leading-[1.36] text-center text-black">
                Magic 2.0
              </h3>
              <h3 className="sm:absolute sm:right-0 text-lg sm:text-xl md:text-2xl lg:text-[28px] font-bold tracking-[0.04em] leading-[1.36] text-black whitespace-nowrap">
                May 29, 2025
              </h3>
            </div>
            <div className="w-full h-[2px] bg-black mt-4 sm:mt-2" />
          </div>
          
          {/* Main Title */}
          <motion.div 
            className="text-center mt-8 sm:mt-12 md:mt-16 lg:mt-[80px] mb-6 sm:mb-8 md:mb-10 lg:mb-12 px-4 sm:px-8 md:px-[55px] text-black"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="text-[24px] xs:text-[32px] sm:text-[48px] md:text-[64px] lg:text-[100px] xl:text-[140px] font-bold tracking-[0.02em] leading-[1.1] mb-4 sm:mb-6 md:mb-8">
              MAGIC 2.0
            </div>
            <div className="text-[18px] xs:text-[24px] sm:text-[32px] md:text-[48px] lg:text-[72px] xl:text-[100px] font-bold tracking-[0.02em] leading-[1.1] whitespace-nowrap">
              UI FOR THE AI ERA
            </div>
          </motion.div>
          
          {/* Black Box with Author Name */}
          <div className="relative mx-4 sm:mx-8 md:mx-[55px]">
            <div className="w-full h-20 sm:h-24 md:h-28 lg:h-[100px] bg-black" />
            <h2 className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
              w-[95%] text-[16px] xs:text-[20px] sm:text-[24px] md:text-[32px] lg:text-[48px] xl:text-[72px] font-normal tracking-[0.04em] sm:tracking-[0.06em] text-[#FFFFFF] text-center leading-[1.1] whitespace-nowrap">
              NOW AVAILABLE ON WEB
            </h2>
          </div>
          
          {/* Bottom Line */}
          <div className="mx-4 sm:mx-8 md:mx-[55px] mt-6 sm:mt-8 md:mt-10 lg:mt-12 h-[2px] bg-black" />
        </div>
      </div>
      
      {/* Plastic Overlay */}
      <div className="fixed inset-0 z-20">
        <Image
          src="https://redirect.xubh.fun/plasticOverlay.png"
          alt="Plastic Overlay"
          fill
          sizes="100vw"
          className="object-cover w-full h-full pointer-events-none mix-blend-overlay"
          priority
        />
      </div>
    </div>
  )
}
