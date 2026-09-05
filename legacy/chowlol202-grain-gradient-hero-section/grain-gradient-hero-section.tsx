"use client";

import { GrainGradient, grainGradientPresets } from '@paper-design/shaders-react';
import { Button } from "./button";

interface GrainHeroSectionProps {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCtaClick: () => void;
}

export default function GrainHeroSection({
  title,
  subtitle,
  ctaLabel,
  onCtaClick,
}: GrainHeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <GrainGradient
        {...grainGradientPresets[0]}
        style={{ position: "fixed", inset: 0, zIndex: -10 }}
      />
      
      <div className="text-center px-6 sm:px-8 max-w-4xl mx-auto">
        <h1 
          role="heading" 
          className="text-4xl sm:text-6xl font-bold text-white mb-6"
        >
          {title}
        </h1>
        
        <p className="max-w-2xl text-lg sm:text-xl text-gray-200 mx-auto mb-8">
          {subtitle}
        </p>
        
        <Button 
          onClick={onCtaClick}
          size="lg"
          className="text-lg px-8 py-3 bg-white text-black hover:bg-gray-100"
        >
          {ctaLabel}
        </Button>
      </div>
    </section>
  );
}