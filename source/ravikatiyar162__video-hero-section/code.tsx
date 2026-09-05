// components/ui/zomato-hero.tsx

import React from 'react';
import { cn } from "@/lib/utils"; // Assumes shadcn/ui setup
import { ChevronDown, Apple } from "lucide-react";

// A self-contained SVG for the Google Play icon for consistency
const GooglePlayIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" fill="currentColor" {...props}>
    <path d="M325.2,256.1l-92.4-92.4l-113,113l113,113l92.4-92.4C330.6,261.5,330.6,250.5,325.2,256.1z M222.4,153.4L49.8,22.8 C38.5,11.6,20.4,19.3,20.4,35.2v441.6c0,15.9,18,23.6,29.4,12.3l172.6-130.6L222.4,153.4z M381.1,304.3L325.2,256l55.9-48.3 c18.8-18.8,18.8-49.2,0-68s-49.2-18.8-68,0l-55.9,48.3L381.1,304.3z"/>
  </svg>
);

// Interface for component props for reusability and type safety
interface ZomatoHeroProps {
  /** Source URL for the background video. */
  videoSrc: string;
  /** Source URL for the logo image. */
  logoSrc: string;
  /** Main title text, displayed prominently. */
  title: string;
  /** Subtitle text, displayed below the main title. */
  subtitle: string;
  /** Description text for additional context. */
  description: string;
  /** URL for the Google Play store button. */
  googlePlayLink: string;
  /** URL for the Apple App Store button. */
  appStoreLink: string;
  /** Optional className to override or extend styles. */
  className?: string;
}

/**
 * A responsive and theme-adaptive hero section component inspired by Zomato's landing page.
 * Features a background video, animated text, and app download buttons.
 */
export const ZomatoHero = ({
  videoSrc,
  logoSrc,
  title,
  subtitle,
  description,
  googlePlayLink,
  appStoreLink,
  className,
}: ZomatoHeroProps) => {
  return (
    <section
      className={cn(
        "relative flex h-screen w-full flex-col items-center justify-center overflow-hidden",
        "text-primary-foreground", // Ensures text color adapts to themes
        className
      )}
      aria-labelledby="hero-title"
    >
      {/* Semi-transparent overlay for text readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />

      {/* Background Video */}
      <video
        src={videoSrc}
        className="absolute inset-0 w-full h-full object-cover z-0"
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
      />

      {/* Main Content */}
      <div className="relative z-20 flex flex-col items-center text-center p-4">
        {/* Logo */}
        <img
          src={logoSrc}
          alt="Company Logo"
          className="h-12 md:h-16 mb-4 animate-fade-in-up"
          style={{ animationDelay: '0.2s', animationFillMode: 'both' }}
        />
        {/* Main Title */}
        <h1
          id="hero-title"
          className="text-5xl md:text-7xl font-bold tracking-tighter animate-fade-in-up"
          style={{ animationDelay: '0.4s', animationFillMode: 'both' }}
        >
          {title}
        </h1>
        {/* Subtitle */}
        <h2
          className="mt-2 text-xl md:text-2xl font-medium animate-fade-in-up"
          style={{ animationDelay: '0.6s', animationFillMode: 'both' }}
        >
          {subtitle}
        </h2>
        {/* Description */}
        <p
          className="mt-6 max-w-md text-base md:text-lg text-primary-foreground/80 animate-fade-in-up"
          style={{ animationDelay: '0.8s', animationFillMode: 'both' }}
        >
          {description}
        </p>
        
        {/* App Store Buttons */}
        <div
          className="mt-8 flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up"
          style={{ animationDelay: '1s', animationFillMode: 'both' }}
        >
          <a
            href={googlePlayLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Get it on Google Play"
            className="flex items-center gap-3 px-4 py-2 bg-background/20 border border-primary-foreground/30 backdrop-blur-sm rounded-lg hover:bg-background/30 transition-colors duration-300 w-48 justify-center"
          >
            <GooglePlayIcon className="h-6 w-6" />
            <div>
              <p className="text-xs leading-none text-left">GET IT ON</p>
              <p className="text-lg font-semibold leading-tight text-left">Google Play</p>
            </div>
          </a>
          <a
            href={appStoreLink}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Download on the App Store"
            className="flex items-center gap-3 px-4 py-2 bg-background/20 border border-primary-foreground/30 backdrop-blur-sm rounded-lg hover:bg-background/30 transition-colors duration-300 w-48 justify-center"
          >
            <Apple className="h-8 w-8" />
            <div>
              <p className="text-xs leading-none text-left">Download on the</p>
              <p className="text-lg font-semibold leading-tight text-left">App Store</p>
            </div>
          </a>
        </div>
      </div>
      
      {/* Animated Scroll Down Indicator */}
      <div
        className="absolute bottom-10 z-20 flex flex-col items-center gap-1 text-primary-foreground/80 animate-bounce cursor-pointer"
        style={{ animationDelay: '1.5s' }}
        onClick={() => window.scrollBy({ top: window.innerHeight, behavior: 'smooth' })}
        aria-hidden="true"
      >
        <span className="text-sm">Scroll down</span>
        <ChevronDown className="h-5 w-5" />
      </div>
    </section>
  );
};