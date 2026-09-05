import React from "react";
import { cn } from "@/lib/utils";

export interface ComponentProps {
  logoSrc?: string;
  coursesHref?: string;
  signUpHref?: string;
  signUpLabel?: string;
  backgroundImg?: string;
  kicker?: string;
  headingMain?: string;
  headingEmphasis?: string;
  description?: string;
  priceText?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  className?: string;
}

export const Component: React.FC<ComponentProps> = ({
  logoSrc = "https://cdn.rareblocks.xyz/collection/bakerstreet/images/logo.svg",
  coursesHref = "#",
  signUpHref = "#",
  signUpLabel = "Sign Up",
  kicker = "Master the basics of baking",
  headingMain = "The road to the",
  headingEmphasis = "perfect loaf",
  description = "Our curated lessons take you from zero to fresh sourdough in no time. Follow along with step-by-step videos and downloadable recipes.",
  priceText = "Starting at $9.99/month",
  primaryCtaLabel = "Get started",
  primaryCtaHref = "#",
  secondaryCtaLabel = "Watch trailer",
  secondaryCtaHref = "#",
  className,
}) => {
  return (
    <div className={cn("relative min-h-screen flex flex-col justify-center py-16 sm:py-20 md:py-24 lg:py-32 xl:py-40 bg-black w-full", className)}>
      {/* Header */}
      <header className="absolute inset-x-0 top-0 z-10 py-4 sm:py-6 md:py-8 lg:py-10 xl:py-12">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto max-w-screen-2xl">
          <div className="flex items-center justify-between">
            <a href="#" title="Home" className="flex focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black rounded-sm">
              <img src={logoSrc} alt="Logo" className="w-auto h-6 sm:h-7 md:h-8 lg:h-9 xl:h-10" />
            </a>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex md:items-center md:space-x-6 lg:space-x-8 xl:space-x-10">
              <a 
                href={coursesHref} 
                className="text-sm lg:text-base xl:text-lg text-white hover:text-primary transition-colors duration-200 focus:outline-none focus:text-primary"
              >
                Courses
              </a>
              <a
                href={signUpHref}
                className="inline-flex items-center justify-center px-4 py-2 lg:px-5 lg:py-2.5 xl:px-6 xl:py-3 text-sm lg:text-base xl:text-lg text-white border-2 border-primary rounded-full hover:bg-white hover:text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black"
              >
                {signUpLabel}
              </a>
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 text-white rounded-full hover:bg-white hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transition-colors duration-200" 
              aria-label="Open menu"
            >
              <svg className="w-5 h-5 sm:w-6 sm:h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Background */}
      <div className="absolute inset-0">
        <img alt="Background" className="object-cover w-full h-full" />
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
      </div>

      {/* Content */}
      <div className="relative flex-1 flex items-center">
        <div className="px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 mx-auto max-w-screen-2xl w-full">
          <div className="w-full max-w-4xl">
            {/* Kicker */}
            <h2 className="text-xs sm:text-sm md:text-base lg:text-lg text-white text-opacity-70 font-medium tracking-wide uppercase">
              {kicker}
            </h2>
            
            {/* Main Heading */}
            <div className="mt-4 sm:mt-6 md:mt-8 lg:mt-10">
              <h1 className="text-white tracking-tight leading-none">
                <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-light">
                  {headingMain}
                </span>
                <span className="block font-serif italic text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl mt-1 sm:mt-2">
                  {headingEmphasis}
                </span>
              </h1>
            </div>
            
            {/* Description */}
            <p className="mt-6 sm:mt-8 md:mt-10 lg:mt-12 text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed text-white text-opacity-80 max-w-2xl">
              {description}
            </p>
            
            {/* Price */}
            <p className="mt-6 sm:mt-8 md:mt-10 text-lg sm:text-xl md:text-2xl lg:text-3xl text-white font-medium">
              {priceText}
            </p>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center mt-6 sm:mt-8 md:mt-10 lg:mt-12 gap-3 sm:gap-4 md:gap-5 lg:gap-6">
              <a
                href={primaryCtaHref}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 lg:px-10 lg:py-5 text-sm sm:text-base md:text-lg lg:text-xl font-semibold rounded-full bg-white text-black hover:bg-opacity-90 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transform hover:scale-105"
              >
                {primaryCtaLabel}
              </a>
              <a
                href={secondaryCtaHref}
                className="inline-flex items-center justify-center w-full sm:w-auto px-6 py-3 sm:px-7 sm:py-3.5 md:px-8 md:py-4 lg:px-10 lg:py-5 text-sm sm:text-base md:text-lg lg:text-xl font-semibold text-white border-2 border-primary rounded-full hover:bg-white hover:text-black transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-black transform hover:scale-105"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 md:w-6 md:h-6 mr-2 sm:mr-3" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" d="M8.0416 4.9192C7.37507 4.51928 6.5271 4.99939 6.5271 5.77669V18.2233C6.5271 19.0006 7.37507 19.4807 8.0416 19.0808L18.4137 12.8574C19.061 12.469 19.061 11.5308 18.4137 11.1424L8.0416 4.9192Z" />
                </svg>
                {secondaryCtaLabel}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 