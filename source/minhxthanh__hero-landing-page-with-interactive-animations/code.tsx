import React, { useState, useEffect } from 'react';
import { ArrowRight, Sparkles, Zap, Star, Rocket, Heart, Crown } from 'lucide-react';

interface AnimatedHeroProps {
  title?: string;
  subtitle?: string;
  badgeText?: string;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  features?: Array<{
    icon: React.ComponentType<any>;
    title: string;
    desc: string;
    color: string;
  }>;
}

const AnimatedHero: React.FC<AnimatedHeroProps> = ({
  title = "Amazing Experience",
  subtitle = "Discover the perfect blend of innovation and creativity. Immerse yourself in a world where technology meets artistry and dreams become reality.",
  badgeText = "Welcome to the Future",
  primaryButtonText = "Get Started",
  secondaryButtonText = "Learn More",
  onPrimaryClick = () => {},
  onSecondaryClick = () => {},
  features = [
    { 
      icon: Sparkles, 
      title: "Innovative", 
      desc: "Cutting-edge technology that pushes boundaries",
      color: "from-purple-500 to-pink-500"
    },
    { 
      icon: Zap, 
      title: "Lightning Fast", 
      desc: "Optimized performance for seamless experience",
      color: "from-yellow-500 to-orange-500"
    },
    { 
      icon: Star, 
      title: "Premium Quality", 
      desc: "Excellence in every detail and interaction",
      color: "from-blue-500 to-cyan-500"
    }
  ]
}) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const createParticles = () => {
    const particleConfigs = [
      { width: 120, height: 120, left: '10%', delay: '0s', bg: 'linear-gradient(45deg, rgba(102, 126, 234, 0.2), rgba(118, 75, 162, 0.1))' },
      { width: 80, height: 80, left: '20%', delay: '3s', bg: 'linear-gradient(45deg, rgba(240, 147, 251, 0.2), rgba(245, 87, 108, 0.1))' },
      { width: 60, height: 60, left: '30%', delay: '6s', bg: 'linear-gradient(45deg, rgba(79, 172, 254, 0.2), rgba(0, 242, 254, 0.1))' },
      { width: 150, height: 150, left: '70%', delay: '2s', bg: 'linear-gradient(45deg, rgba(67, 233, 123, 0.2), rgba(56, 249, 215, 0.1))' },
      { width: 90, height: 90, left: '80%', delay: '4s', bg: 'linear-gradient(45deg, rgba(102, 126, 234, 0.2), rgba(240, 147, 251, 0.1))' },
      { width: 110, height: 110, left: '60%', delay: '7s', bg: 'linear-gradient(45deg, rgba(245, 87, 108, 0.2), rgba(79, 172, 254, 0.1))' }
    ];

    return particleConfigs.map((config, i) => (
      <div
        key={i}
        className="animated-hero-particle"
        style={{
          width: `${config.width}px`,
          height: `${config.height}px`,
          left: config.left,
          top: `${Math.random() * 100}%`,
          animationDelay: config.delay,
          background: config.bg,
          animationDuration: `${10 + Math.random() * 8}s`,
        }}
      />
    ));
  };

  const createFloatingIcons = () => {
    const icons = [Sparkles, Zap, Star, Rocket, Heart, Crown];
    return Array.from({ length: 6 }, (_, i) => {
      const Icon = icons[i];
      return (
        <div
          key={i}
          className="absolute opacity-15 text-white"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animation: `float ${12 + Math.random() * 6}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 4}s`,
            fontSize: `${18 + Math.random() * 16}px`,
          }}
        >
          <Icon className="animated-hero-spin-slow" />
        </div>
      );
    });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated gradient background */}
      <div 
        className="absolute inset-0 animated-hero-gradient-bg"
        style={{
          transform: `translateY(${scrollY * 0.3}px)`,
        }}
      />
      
      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {createParticles()}
      </div>

      {/* Floating icons */}
      <div className="absolute inset-0 pointer-events-none">
        {createFloatingIcons()}
      </div>

      {/* Mouse follower effects */}
      <div
        className="fixed w-6 h-6 rounded-full bg-gradient-to-r from-white to-transparent bg-opacity-20 pointer-events-none z-50 transition-all duration-300 ease-out"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: 'translate3d(0, 0, 0)',
          boxShadow: '0 0 15px rgba(255, 255, 255, 0.2)',
        }}
      />

      <div
        className="fixed w-3 h-3 rounded-full bg-white bg-opacity-8 pointer-events-none z-40 transition-all duration-700 ease-out"
        style={{
          left: mousePosition.x - 6,
          top: mousePosition.y - 6,
          transform: 'translate3d(0, 0, 0)',
        }}
      />

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Hero badge */}
          <div className="animated-hero-fade-in-scale mb-8 mt-5">
            <div className="inline-flex items-center gap-3 animated-hero-glass-effect rounded-full px-6 py-3 text-sm text-white animated-hero-bounce-effect">
              <Sparkles className="w-5 h-5 animated-hero-pulse-glow" />
              <span className="animated-hero-shimmer-text font-medium">{badgeText}</span>
              <Sparkles className="w-5 h-5 animated-hero-pulse-glow" />
            </div>
          </div>

          {/* Main title */}
          <h1 
            className="animated-hero-title text-7xl md:text-9xl font-bold mb-8 animated-hero-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            {title.split(' ').map((word, index) => (
              <React.Fragment key={index}>
                {index === Math.floor(title.split(' ').length / 2) && <br />}
                {index === title.split(' ').length - 1 ? (
                  <span className="inline-flex items-center gap-6">
                    {word}
                    <Zap className="w-20 h-20 md:w-24 md:h-24 text-yellow-300 animated-hero-pulse-glow animated-hero-bounce-effect" />
                  </span>
                ) : (
                  word + ' '
                )}
              </React.Fragment>
            ))}
          </h1>

          {/* Subtitle */}
          <p 
            className="animated-hero-subtitle text-2xl md:text-3xl mb-16 max-w-3xl mx-auto leading-relaxed animated-hero-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            {subtitle}
          </p>

          {/* Action buttons */}
          <div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center animated-hero-fade-in-up"
            style={{ animationDelay: '0.9s' }}
          >
            <button 
              onClick={onPrimaryClick}
              className="animated-hero-button-glow bg-white text-gray-900 hover:bg-gray-100 px-10 py-5 text-xl font-bold rounded-full group relative overflow-hidden transition-all duration-300"
            >
              <Rocket className="w-6 h-6 mr-3 group-hover:translate-x-1 transition-transform duration-300 inline" />
              {primaryButtonText}
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-2 transition-transform duration-300 inline" />
            </button>
            
            <button 
              onClick={onSecondaryClick}
              className="animated-hero-glass-effect border-2 border-white text-white hover:bg-white hover:text-gray-900 px-10 py-5 text-xl font-bold rounded-full group transition-all duration-700"
            >
              <Star className="w-6 h-6 mr-3 group-hover:rotate-45 transition-transform duration-700 inline" />
              {secondaryButtonText}
              <Crown className="w-6 h-6 ml-3 group-hover:scale-125 transition-transform duration-700 inline" />
            </button>
          </div>

          {/* Feature highlights */}
          <div 
            className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-10 animated-hero-fade-in-up"
            style={{ animationDelay: '1.2s' }}
          >
            {features.map((feature, index) => (
              <div 
                key={index}
                className="animated-hero-glass-effect rounded-2xl p-8 text-center group cursor-pointer relative overflow-hidden"
                style={{ animationDelay: `${1.5 + index * 0.3}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                <feature.icon className="w-12 h-12 mx-auto mb-6 text-white group-hover:scale-110 group-hover:rotate-6 transition-all duration-700 animated-hero-pulse-glow" />
                <h3 className="text-white font-bold text-2xl mb-4 animated-hero-shimmer-text">{feature.title}</h3>
                <p className="text-white text-opacity-90 text-lg leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient overlay */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black via-transparent to-transparent opacity-20" />
    </div>
  );
};

export default AnimatedHero;
