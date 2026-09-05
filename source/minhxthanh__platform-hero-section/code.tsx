import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Code2, Zap } from 'lucide-react';

const HeroSection = () => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    { icon: Code2, text: 'Custom AI Assistants' },
    { icon: Zap, text: 'Lightning Fast' },
    { icon: Sparkles, text: 'Production Ready' },
  ];

  return (
    <section className="relative w-full min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse"
          style={{
            transform: `translate(${mousePosition.x * 0.02}px, ${mousePosition.y * 0.02}px)`,
          }}
        />
        <div 
          className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"
          style={{
            transform: `translate(${mousePosition.x * -0.01}px, ${mousePosition.y * -0.01}px)`,
          }}
        />
        <div 
          className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-500"
          style={{
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`,
          }}
        />
      </div>

      {/* Static Grid Pattern with Animated Light Lines */}
      <div className="absolute inset-0">
        {/* Static Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
        
        {/* Animated Light Lines - Horizontal */}
        <div className="absolute inset-0">
          {/* Row 1 - Purple light */}
          <div className="absolute top-[60px] left-0 w-full h-px overflow-hidden">
            <div className="absolute top-0 left-0 w-40 h-px bg-gradient-to-r from-transparent via-purple-400 to-transparent opacity-80 animate-light-horizontal" />
          </div>
          
          {/* Row 2 - Cyan light */}
          <div className="absolute top-[180px] left-0 w-full h-px overflow-hidden">
            <div className="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-70 animate-light-horizontal-delayed" />
          </div>
          
          {/* Row 3 - Pink light */}
          <div className="absolute top-[300px] left-0 w-full h-px overflow-hidden">
            <div className="absolute top-0 left-0 w-48 h-px bg-gradient-to-r from-transparent via-pink-400 to-transparent opacity-60 animate-light-horizontal-slow" />
          </div>
          
          {/* Row 4 - Blue light */}
          <div className="absolute top-[420px] left-0 w-full h-px overflow-hidden">
            <div className="absolute top-0 left-0 w-36 h-px bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-75 animate-light-horizontal-fast" />
          </div>
          
          {/* Row 5 - Yellow light */}
          <div className="absolute top-[540px] left-0 w-full h-px overflow-hidden">
            <div className="absolute top-0 left-0 w-44 h-px bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-65 animate-light-horizontal-medium" />
          </div>
        </div>
        
        {/* Animated Light Lines - Vertical */}
        <div className="absolute inset-0">
          {/* Column 1 - Purple light */}
          <div className="absolute left-[60px] top-0 w-px h-full overflow-hidden">
            <div className="absolute left-0 top-0 w-px h-40 bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-70 animate-light-vertical" />
          </div>
          
          {/* Column 2 - Cyan light */}
          <div className="absolute left-[180px] top-0 w-px h-full overflow-hidden">
            <div className="absolute left-0 top-0 w-px h-32 bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-80 animate-light-vertical-delayed" />
          </div>
          
          {/* Column 3 - Pink light */}
          <div className="absolute left-[300px] top-0 w-px h-full overflow-hidden">
            <div className="absolute left-0 top-0 w-px h-48 bg-gradient-to-b from-transparent via-pink-400 to-transparent opacity-60 animate-light-vertical-slow" />
          </div>
          
          {/* Column 4 - Blue light */}
          <div className="absolute left-[420px] top-0 w-px h-full overflow-hidden">
            <div className="absolute left-0 top-0 w-px h-36 bg-gradient-to-b from-transparent via-blue-400 to-transparent opacity-75 animate-light-vertical-fast" />
          </div>
          
          {/* Column 5 - Yellow light */}
          <div className="absolute left-[540px] top-0 w-px h-full overflow-hidden">
            <div className="absolute left-0 top-0 w-px h-44 bg-gradient-to-b from-transparent via-yellow-400 to-transparent opacity-65 animate-light-vertical-medium" />
          </div>
        </div>
        
        {/* Additional scattered light lines for more dynamic effect */}
        <div className="absolute inset-0">
          {/* More horizontal lights at different positions */}
          <div className="absolute top-[140px] left-0 w-full h-px overflow-hidden">
            <div className="absolute top-0 left-0 w-28 h-px bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-50 animate-light-horizontal-reverse" />
          </div>
          
          <div className="absolute top-[380px] left-0 w-full h-px overflow-hidden">
            <div className="absolute top-0 left-0 w-52 h-px bg-gradient-to-r from-transparent via-indigo-400 to-transparent opacity-55 animate-light-horizontal-ultra-slow" />
          </div>
          
          {/* More vertical lights at different positions */}
          <div className="absolute left-[140px] top-0 w-px h-full overflow-hidden">
            <div className="absolute left-0 top-0 w-px h-28 bg-gradient-to-b from-transparent via-emerald-400 to-transparent opacity-50 animate-light-vertical-reverse" />
          </div>
          
          <div className="absolute left-[380px] top-0 w-px h-full overflow-hidden">
            <div className="absolute left-0 top-0 w-px h-52 bg-gradient-to-b from-transparent via-indigo-400 to-transparent opacity-55 animate-light-vertical-ultra-slow" />
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 text-sm text-white/90 animate-fade-in mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>Introducing AI-Powered Development</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-tight animate-fade-in-up max-w-6xl">
            Create, share, and use
            <span className="block bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent animate-gradient">
              custom AI assistants
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl lg:text-2xl text-gray-300 max-w-4xl leading-relaxed animate-fade-in-up delay-200 mt-8">
            Discover the models, rules, prompts, docs, and other building blocks you need to become an 
            <span className="text-purple-400 font-semibold"> amplified developer</span>
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 justify-center animate-fade-in-up delay-300 mt-12">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full px-6 py-3 text-base text-white/80 hover:bg-white/10 transition-all duration-300"
              >
                <feature.icon className="w-5 h-5" />
                <span>{feature.text}</span>
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-400 mt-12">
            <a
              href="https://hub.continue.dev"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl shadow-lg hover:shadow-xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center space-x-2">
                <span>Explore Continue Hub</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </span>
            </a>
            
            <button className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl hover:bg-white/20 transition-all duration-300">
              Watch Demo
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-12 mt-16 border-t border-white/10 animate-fade-in-up delay-500 max-w-2xl w-full">
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">10K+</div>
              <div className="text-sm lg:text-base text-gray-400 mt-1">Active Developers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">500+</div>
              <div className="text-sm lg:text-base text-gray-400 mt-1">AI Assistants</div>
            </div>
            <div className="text-center">
              <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white">99.9%</div>
              <div className="text-sm lg:text-base text-gray-400 mt-1">Uptime</div>
            </div>
          </div>

          {/* Decorative floating icons */}
          <div className="absolute top-1/4 left-8 w-16 h-16 bg-gradient-to-br from-purple-500/20 to-pink-500/20 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center animate-float">
            <Code2 className="w-6 h-6 text-purple-400" />
          </div>
          
          <div className="absolute bottom-1/4 right-8 w-14 h-14 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 backdrop-blur-md border border-white/20 rounded-xl flex items-center justify-center animate-float delay-1000">
            <Zap className="w-5 h-5 text-cyan-400" />
          </div>
        </div>
      </div>

      {/* Bottom Gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-slate-900 to-transparent" />
    </section>
  );
};

export default HeroSection;