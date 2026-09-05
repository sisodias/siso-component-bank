import { useState } from "react";
import { cn } from "@/lib/utils";
import React from 'react';
import { ArrowUpRight } from "lucide-react";

const HeroHeader = ({
  logoImage = "https://i.ibb.co/3xrkQwT/logo.png",
  logoText = "Ring IG",
  heading = "Create With Control",
  tagline = "Transform your ideas into stunning visuals with Ring IG. Unleash your creativity with advanced AI tools designed for professionals and enthusiasts alike.",
  taglineShort = "Transform ideas into stunning visuals with Ring IG.",
  buttonTitle = "Try now",
  buttonUrl = "https://ring.lovable.app",
  mainImage = "https://raw.githubusercontent.com/mobalti/open-props-interfaces/refs/heads/main/ai-hero-chat-popover/assets/img-1.jpg",
  topRightImage = "https://raw.githubusercontent.com/mobalti/open-props-interfaces/refs/heads/main/ai-hero-chat-popover/assets/img-2.jpg",
  bottomLeftImage = "https://raw.githubusercontent.com/mobalti/open-props-interfaces/refs/heads/main/ai-hero-chat-popover/assets/img-3.jpg",
  bottomRightImage = "https://raw.githubusercontent.com/mobalti/open-props-interfaces/refs/heads/main/ai-hero-chat-popover/assets/img-4.jpg"
}) => {
  const featureCards = [
    { id: 1, image: mainImage },
    { id: 2, image: topRightImage },
    { id: 3, image: bottomLeftImage },
    { id: 4, image: bottomRightImage }
  ];

  return (
    <section className="min-h-screen bg-[url('https://raw.githubusercontent.com/mobalti/open-props-interfaces/refs/heads/main/ai-hero-chat-popover/assets/bg-gradient.jpg')] bg-cover bg-center py-12 px-1 md:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center">
          {/* Left side - Content */}
          <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start gap-4 md:gap-8 text-center lg:text-left mx-auto">
            <div className="flex items-center gap-3 w-full justify-center lg:justify-start">
              <img alt={`${logoText} logo`} src={logoImage} className="h-8 w-8 rounded-full" />
              <span className="text-xl font-bold text-black">{logoText}</span>
            </div>
            
            <div className="flex flex-col items-center lg:items-start gap-4 text-center lg:text-left">
              <h1 className="text-3xl md:text-5xl font-bold text-black text-center lg:text-left">{heading}</h1>
              <p className="text-base md:text-lg text-gray-800 max-w-lg text-center lg:text-left">
                <span className="hidden md:block">{tagline}</span>
                <span className="md:hidden">{taglineShort}</span>
              </p>
            </div>
            
            <div className="mt-0 self-center lg:self-start">
              <a 
                href={buttonUrl} 
                className="rounded-full py-2 md:py-3.5 px-6 md:px-8 text-black font-medium text-sm md:text-base transition-all hover:shadow-lg flex items-center gap-2 bg-white/30 backdrop-blur-sm border border-white/40"
              >
                {buttonTitle}
                <ArrowUpRight className="h-3 w-3 md:h-4 md:w-4 scale-150" />
              </a>
            </div>
          </div>

          {/* Right side - Card Gallery */}
          <div className="w-full lg:w-1/2 relative h-[400px] md:h-[500px]">
            {/* Main large card */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2/3 h-2/3 z-10">
              <div className="w-full h-full bg-white/20 backdrop-blur-md border border-white/30 rounded-xl shadow-xl transition-all hover:shadow-2xl">
                <div className="h-full p-1 md:p-4">
                  <div className="rounded-lg overflow-hidden h-full">
                    <img 
                      className="w-full h-full object-cover transition-transform duration-300" 
                      src={featureCards[0].image} 
                      alt="Main feature image" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Small floating card - top right */}
            <div className="absolute top-8 right-8 w-1/4 h-1/4 z-20">
              <div className="w-full h-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="h-full p-0.5 md:p-3">
                  <div className="rounded-lg overflow-hidden h-full">
                    <img 
                      className="w-full h-full object-cover" 
                      src={featureCards[1].image} 
                      alt="Top right feature image" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Small floating card - bottom left */}
            <div className="absolute bottom-16 left-6 w-1/4 h-1/4 z-20">
              <div className="w-full h-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="h-full p-0.5 md:p-3">
                  <div className="rounded-lg overflow-hidden h-full">
                    <img 
                      className="w-full h-full object-cover" 
                      src={featureCards[2].image} 
                      alt="Bottom left feature image" 
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Small floating card - bottom right */}
            <div className="absolute bottom-32 right-12 w-1/4 h-1/4 z-20">
              <div className="w-full h-full bg-white/30 backdrop-blur-md border border-white/40 rounded-xl shadow-lg hover:shadow-xl transition-all">
                <div className="h-full p-0.5 md:p-3">
                  <div className="rounded-lg overflow-hidden h-full">
                    <img 
                      className="w-full h-full object-cover" 
                      src={featureCards[3].image} 
                      alt="Bottom right feature image" 
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export {HeroHeader}