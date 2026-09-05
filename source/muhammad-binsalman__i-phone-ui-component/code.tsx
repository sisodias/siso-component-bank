"use client"

import React from 'react';
import { Wifi, Signal, Battery, Search, Phone, MessageSquare, AppWindow, Settings, Chrome, Mail, Facebook, Volume2, Power, UsbIcon as UsbC, Text, Lock, RefreshCw, ChevronLeft, ChevronRight, Share, Book, SquareStack } from 'lucide-react';
import Image from 'next/image'; // Import Image component

export function IPhoneCard() {
  // Define the phone's dimensions and depth
  const phoneWidth = 150;
  const phoneHeight = 280;
  const phoneDepth = 10; // Realistic phone thickness
  const halfWidth = phoneWidth / 2;
  const halfHeight = phoneHeight / 2;
  const halfDepth = phoneDepth / 2;

  return (
    <div className="flex items-center justify-center min-h-screen dark:bg-neutral-800 p-4 bg-stone-100">
      {/* Main Phone Container with 3D Transform */}
      <div className="relative"
           style={{
             width: `${phoneWidth}px`,
             height: `${phoneHeight}px`,
             transformStyle: 'preserve-3d',
             perspective: '1000px',
             // Initial rotation to clearly show depth without distortion
             transform: 'rotateX(65deg) rotateY(10deg) rotateZ(25deg)',
             transition: 'all 0.7s ease-in-out',
             transformOrigin: 'center',
           }}
           onMouseEnter={(e) => {
             e.currentTarget.style.transform = 'rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1.5)';
           }}
           onMouseLeave={(e) => {
             e.currentTarget.style.transform = 'rotateX(65deg) rotateY(10deg) rotateZ(25deg)';
           }}
      >
        {/* Phone Body (container for all faces) */}
        <div className="absolute inset-0 transform-style-3d">

          {/* Front Face (Screen) */}
          <div className="absolute w-full h-full bg-black rounded-xl border-[3px] border-black overflow-hidden
                          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform"
               style={{
                 transform: `translateZ(${halfDepth}px)`,
                
               }}>
            <div className="absolute inset-0 bg-[#4c5360] p-0 flex flex-col">
              {/* Notch/Dynamic Island - Moved to top */}
              <div className="absolute top-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-black rounded-full z-10" />

              {/* Status Bar */}
              <div className="flex justify-between items-center text-white text-[6px] px-2 py-[3px]">
                <span>9:41 AM</span>
                <div className="flex items-center space-x-0.5">
                  <Wifi className="w-2 h-2" />
                  <Battery className="w-2 h-2"  />
                </div>
              </div>

              {/* Screen Content: Display the screenshot */}
              <div className="flex-grow relative overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/del.JPG-Zc49VGQiaKc5xMuOIIwGZyzEP1l8v8.jpeg"
                  alt="Dovetail UI Screenshot"
                  layout="fill"
                  objectFit="cover"
                  className=""
                />
              </div>

              {/* Safari Navigation Bar */}
              <div className="absolute w-full bottom-0 bg-slate-800/50 p-1.5 pb-3 flex backdrop-blur-xl flex-col items-center justify-center space-y-1">
                {/* URL Bar */}
                <div className="flex items-center w-[95%] bg-gray-700/70 rounded-md px-1 py-[2px] text-white text-[7px]">
                  <Text className="w-2.5 h-2.5 text-gray-300 mr-1 cursor-text" />
                  <Lock className="w-2 h-2 text-gray-300 mr-0.5" />
                  <span className="flex-grow text-center cursor-text">21st.dev</span>
                  <RefreshCw className="w-2.5 h-2.5 text-gray-300 ml-1 cursor-pointer" />
                </div>
                {/* Bottom Navigation Icons */}
                <div className="flex justify-around items-center w-full text-blue-400 text-xs">
                  <ChevronLeft className="w-3 h-3 opacity-50" /> {/* Disabled look */}
                  <ChevronRight className="w-3 h-3 opacity-50" /> {/* Disabled look */}
                  <Share className="w-2 h-2 opacity-50" />
                  <Book className="w-2 h-2 opacity-50" />
                  <SquareStack className="w-2 h-2 opacity-50" />
                </div>
              </div>

              {/* Home Indicator */}
              <div className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1/3 h-[2px] bg-white rounded-full" />
            </div>
          </div>

          {/* Back Face */}
          <div className="absolute w-full h-full bg-black rounded-xl
                          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-y-180"
               style={{
                 transform: `rotateY(180deg) translateZ(${halfDepth}px)`,
                 backfaceVisibility: 'hidden',
               }}>
            {/* Simple camera bump placeholder */}
            <div className="absolute top-4 right-4 w-8 h-8 bg-gray-900 rounded-md flex items-center justify-center">
              <div className="w-3 h-3 bg-gray-700 rounded-full" />
            </div>
          </div>

          {/* Top Face */}
          <div className="absolute w-full bg-black rounded-t-xl shadow-inner
                          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-x-90"
               style={{
                 height: `${phoneDepth}px`,
                 transform: `rotateX(90deg) translateY(-${halfHeight}px) translateZ(${halfDepth}px)`,
                 backfaceVisibility: 'hidden',
               }} />

          {/* Bottom Face */}
          <div className="absolute w-full bg-black rounded-b-xl shadow-inner
                          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-x-[-90deg] flex items-center justify-around px-4"
               style={{
                 height: `${phoneDepth}px`,
                 transform: `rotateX(-90deg) translateY(${halfHeight}px) translateZ(${halfDepth}px)`,
                 backfaceVisibility: 'hidden',
               }}>
            <UsbC className="w-4 h-4 text-gray-500" />
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
            </div>
            <div className="flex space-x-1">
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
              <div className="w-1 h-1 bg-gray-600 rounded-full" />
            </div>
          </div>

          {/* Left Face */}
          <div className="absolute h-full bg-black rounded-l-xl shadow-inner
                          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-y-[-90deg] flex flex-col justify-center items-center space-y-4"
               style={{
                 width: `${phoneDepth}px`,
                 transform: `rotateY(-90deg) translateX(-${halfWidth}px) translateZ(${halfDepth}px)`,
                 backfaceVisibility: 'hidden',
               }}>
            <div className="w-2 h-4 bg-gray-600 rounded-sm" /> {/* Mute switch */}
            <div className="w-2 h-6 bg-gray-600 rounded-sm" /> {/* Volume Up */}
            <div className="w-2 h-6 bg-gray-600 rounded-sm" /> {/* Volume Down */}
          </div>

          {/* Right Face */}
          <div className="absolute h-full bg-black rounded-r-xl shadow-inner
                          top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform rotate-y-90 flex items-center justify-center"
               style={{
                 width: `${phoneDepth}px`,
                 transform: `rotateY(90deg) translateX(${halfWidth}px) translateZ(${halfDepth}px)`,
                 backfaceVisibility: 'hidden',
               }}>
            <div className="w-2 h-10 bg-gray-600 rounded-sm" /> {/* Power button */}
          </div>
        </div>
      </div>
    </div>
  );
}

interface AppIconProps {
  icon: React.ReactNode;
  bgColor?: string;
  isDock?: boolean;
}

function AppIcon({ icon, bgColor = "bg-gray-700", isDock = false }: AppIconProps) {
  return (
    <div className={`flex items-center justify-center rounded-md ${bgColor} ${isDock ? 'w-8 h-8' : 'w-full h-full'}`}>
      {icon}
    </div>
  );
}
