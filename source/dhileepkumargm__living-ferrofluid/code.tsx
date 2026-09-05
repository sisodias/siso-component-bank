import React from 'react';

export const Component = () => {

  return (
   <main className="hero-section w-full h-screen flex items-center justify-center">
                {/* This SVG filter is designed for a high-contrast, metallic look.
                    - feGaussianBlur blurs the shapes slightly to help them merge.
                    - feColorMatrix dramatically increases contrast, creating sharp, defined edges.
                    - feComposite merges the blurred, high-contrast shapes.
                    - feTurbulence and feDisplacementMap add the organic, spiky distortion.
                */}
                <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <filter id="ferrofluid">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur" />
                        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 50 -15" result="contrast" />
                        <feComposite in="SourceGraphic" in2="contrast" operator="atop"/>
                        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.08" numOctaves="3" result="noise" />
                        <feDisplacementMap in="contrast" in2="noise" scale="50" />
                    </filter>
                </svg>

                <div className="ferrofluid-canvas">
                    <div className="globule globule-1"></div>
                    <div className="globule globule-2"></div>
                    <div className="globule globule-3"></div>
                </div>

                {/* Content layered on top */}
                <div className="relative z-10 flex flex-col items-center justify-center h-full text-center p-8">
                    <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight mb-4" style={{textShadow: '0 0 15px rgba(0,0,0,0.5)'}}>
                        Forging the Future
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto mb-8" style={{textShadow: '0 0 10px rgba(0,0,0,0.5)'}}>
                        Experience a new wave of digital artistry with dynamic, fluid animations that redefine interaction.
                    </p>
                    <a href="#" className="bg-white text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-gray-200 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-white/20">
                        Discover Now
                    </a>
                </div>
            </main>
  );
};
